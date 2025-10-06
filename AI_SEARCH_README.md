# 🤖 AI-Powered Search System

## Overview
The Pear Demo Day platform features an intelligent AI search system powered by **Google Gemini** with function calling capabilities. This allows investors to find companies using natural language queries.

## How It Works

### 1. **Natural Language Processing**
Users can type queries in plain English, such as:
- "Show me AI companies"
- "Seed stage startups in San Francisco"
- "B2B SaaS companies raising Series A"
- "Fintech or healthcare startups"
- "Featured companies in the latest batch"

### 2. **Gemini Function Calling**
The system uses Gemini 1.5 Flash with a custom `filter_companies` function that can filter by:
- **Industries**: AI, Fintech, Healthcare, Climate Tech, Security, Industrial
- **Stages**: Pre-Seed, Seed, Series A
- **Batches**: S24, W24, S23
- **Tags**: Any tags in the company profile
- **Locations**: City or state
- **Search Text**: Matches in name, tagline, or description
- **Featured**: Boolean flag for featured companies

### 3. **Expandable Architecture**
The system is designed to be easily expandable:

#### Adding New Filter Fields
To add a new filterable field (e.g., "funding amount"):

1. **Update the function schema** in `/src/app/api/ai-search/route.ts`:
```typescript
const filterCompaniesFunction = {
  // ... existing properties
  fundingAmount: {
    type: 'object',
    properties: {
      min: { type: 'number' },
      max: { type: 'number' }
    },
    description: 'Filter by funding amount range'
  }
}
```

2. **Add filter logic**:
```typescript
if (args.fundingAmount) {
  if (company.fundingAmount < args.fundingAmount.min ||
      company.fundingAmount > args.fundingAmount.max) {
    return false;
  }
}
```

3. **Update Company type** in `/src/types/index.ts`:
```typescript
export interface Company {
  // ... existing fields
  fundingAmount?: number;
}
```

## Example Queries

| Query | What It Does |
|-------|-------------|
| "AI companies" | Filters by industry: AI |
| "seed stage" | Filters by stage: Seed |
| "SF startups" | Filters by location containing "SF" or "San Francisco" |
| "B2B SaaS" | Filters by tags containing "B2B SaaS" |
| "fintech in NYC" | Filters by industry: Fintech AND location: NYC |
| "featured AI companies" | Filters by featured: true AND industry: AI |

## Features

### ✨ Visual Feedback
- **Loading state**: Animated spinner while AI processes the query
- **Applied filters display**: Shows exactly what filters the AI applied
- **Clear button**: One-click to reset AI filters
- **Enter key support**: Press Enter to search

### 🔄 Hybrid Filtering
- AI filters work **in combination** with manual dropdown filters
- Manual filters further refine AI results
- Both systems work together seamlessly

### 🎯 Smart Matching
- Case-insensitive matching
- Partial string matching for locations and text search
- Array intersection for tags
- Boolean logic support (OR conditions)

## API Endpoint

### POST `/api/ai-search`

**Request Body:**
```json
{
  "query": "AI companies in San Francisco"
}
```

**Response:**
```json
{
  "companies": [...],
  "filters": {
    "industries": ["AI"],
    "locations": ["San Francisco"]
  },
  "query": "AI companies in San Francisco"
}
```

## Configuration

The Gemini API key is hardcoded in the route for demo purposes. In production:
1. Move to environment variable: `process.env.GOOGLE_API_KEY`
2. Add to `.env.local`
3. Never commit API keys to version control

## Performance

- **Model**: Gemini 1.5 Flash (fast, cost-effective)
- **Average response time**: < 2 seconds
- **Fallback**: Returns all companies if AI fails
- **Error handling**: Graceful degradation with user feedback

## Future Enhancements

1. **Semantic Search**: Use embeddings for similarity matching
2. **Query History**: Remember past searches
3. **Suggested Queries**: Show example queries to users
4. **Multi-language Support**: Accept queries in different languages
5. **Advanced Filters**: Date ranges, team size, revenue, etc.
6. **Saved Searches**: Let users save favorite filter combinations
7. **Analytics**: Track popular search patterns

## Testing

Try these queries to test the system:
```
✅ "Show me all AI companies"
✅ "Seed stage fintech startups"
✅ "Companies in San Francisco"
✅ "B2B SaaS with AI"
✅ "Featured companies"
✅ "Healthcare or climate tech"
✅ "Series A companies in NYC"
```

---

Built with ❤️ using Next.js, TypeScript, and Google Gemini AI
