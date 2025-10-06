import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { getAllCompanies } from '@/lib/db';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const filterCompaniesFunction = {
  name: 'filter_companies',
  description: 'Filter companies based on various criteria like industry, stage, batch, tags, location, or any text in name/description',
  parameters: {
    type: 'object',
    properties: {
      industries: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter by industries (e.g., ["AI", "Fintech"])',
      },
      stages: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter by funding stages (e.g., ["Seed", "Series A"])',
      },
      batches: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter by batch (e.g., ["S24", "W24"])',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter by tags (e.g., ["AI", "B2B SaaS"])',
      },
      locations: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter by location/city',
      },
      searchText: {
        type: 'string',
        description: 'Search text to match in company name, tagline, or description',
      },
      featured: {
        type: 'boolean',
        description: 'Filter only featured companies',
      },
    },
    required: [],
  },
};

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    // Fetch companies from database
    const allCompanies = await getAllCompanies();

    if (!query || query.trim() === '') {
      return NextResponse.json({ companies: allCompanies });
    }
    // Initialize Gemini model with function calling
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      tools: [
        {
          functionDeclarations: [filterCompaniesFunction],
        },
      ],
    });

    // Create the prompt
    const prompt = `You are a helpful assistant that filters startup companies for a demo day platform.
    
Available companies data structure:
- id, name, tagline, description
- industry: AI, Fintech, Healthcare, Climate Tech, Security, Industrial
- stage: Pre-Seed, Seed, Series A
- batch: S24, W24, S23
- tags: array of strings
- location: city, state
- featured: boolean

User query: "${query}"

Based on this query, determine the appropriate filter criteria and call the filter_companies function.
Be flexible and understand natural language queries like:
- "AI companies" → filter by industry: AI
- "seed stage startups in SF" → filter by stage: Seed, location: San Francisco
- "B2B SaaS companies" → filter by tags containing "B2B SaaS"
- "featured companies" → filter by featured: true
- "fintech or healthcare" → filter by industries: Fintech, Healthcare`;

    const chat = model.startChat();
    console.log("message sent")
    const result = await chat.sendMessage(prompt);
    const response = result.response;

    // Check if function was called
    const functionCall = response.functionCalls()?.[0];

    if (functionCall && functionCall.name === 'filter_companies') {
      const args = functionCall.args;
      
      // Apply filters to companies
      const filteredCompanies = allCompanies.filter((company) => {
        // Industry filter
        if (args.industries && args.industries.length > 0) {
          if (!args.industries.includes(company.industry)) return false;
        }

        // Stage filter
        if (args.stages && args.stages.length > 0) {
          if (!args.stages.includes(company.stage)) return false;
        }

        // Batch filter
        if (args.batches && args.batches.length > 0) {
          if (!args.batches.includes(company.batch)) return false;
        }

        // Tags filter
        if (args.tags && args.tags.length > 0) {
          const hasMatchingTag = args.tags.some((tag: string) =>
            company.tags.some((companyTag) =>
              companyTag.toLowerCase().includes(tag.toLowerCase())
            )
          );
          if (!hasMatchingTag) return false;
        }

        // Location filter
        if (args.locations && args.locations.length > 0) {
          const hasMatchingLocation = args.locations.some((loc: string) =>
            company.location.toLowerCase().includes(loc.toLowerCase())
          );
          if (!hasMatchingLocation) return false;
        }

        // Search text filter
        if (args.searchText) {
          const searchLower = args.searchText.toLowerCase();
          const matchesSearch =
            company.name.toLowerCase().includes(searchLower) ||
            company.tagline.toLowerCase().includes(searchLower) ||
            company.description.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }

        // Featured filter
        if (args.featured !== undefined && args.featured !== null) {
          if (company.featured !== args.featured) return false;
        }

        return true;
      });

      return NextResponse.json({
        companies: filteredCompanies,
        filters: args,
        query,
      });
    }

    // If no function call, return all companies
    return NextResponse.json({
      companies: allCompanies,
      filters: {},
      query,
    });
  } catch (error: unknown) {
    console.error('AI Search Error:', error);
    
    // Check for rate limiting or quota errors
    const err = error as Error;
    let errorMessage = 'Failed to process AI search';
    if (err?.message?.includes('quota') || err?.message?.includes('rate limit')) {
      errorMessage = 'API rate limit exceeded. Please try again in a few moments.';
    } else if (err?.message?.includes('API key')) {
      errorMessage = 'API configuration error. Please contact support.';
    } else if (err?.message) {
      errorMessage = `Search error: ${err.message}`;
    }
    
    // Fetch companies for fallback
    const allCompanies = await getAllCompanies();
    
    return NextResponse.json(
      { error: errorMessage, companies: allCompanies },
      { status: 500 }
    );
  }
}
