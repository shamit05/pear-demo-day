import { sql } from '@vercel/postgres';
import { ConnectionRequest } from '@/types/connection';
import { Company, Founder } from '@/types';

// Check if database is configured
const isDatabaseConfigured = () => {
  return !!process.env.POSTGRES_URL;
};

// Initialize database tables
export async function initDatabase() {
  try {
    // Create companies table
    await sql`
      CREATE TABLE IF NOT EXISTS companies (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        tagline TEXT NOT NULL,
        logo TEXT,
        description TEXT NOT NULL,
        industry TEXT NOT NULL,
        stage TEXT NOT NULL,
        batch TEXT NOT NULL,
        location TEXT NOT NULL,
        website TEXT,
        video_url TEXT,
        pitch_deck_url TEXT,
        tags TEXT[],
        featured BOOLEAN DEFAULT false,
        image TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    // Create founders table
    await sql`
      CREATE TABLE IF NOT EXISTS founders (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        photo TEXT,
        bio TEXT NOT NULL,
        linkedin TEXT,
        twitter TEXT,
        company_id TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      )
    `;

    // Create connection_requests table
    await sql`
      CREATE TABLE IF NOT EXISTS connection_requests (
        id TEXT PRIMARY KEY,
        investor_id TEXT NOT NULL,
        investor_name TEXT NOT NULL,
        investor_email TEXT NOT NULL,
        investor_firm TEXT,
        investor_linkedin TEXT,
        company_id TEXT NOT NULL,
        company_name TEXT NOT NULL,
        message TEXT NOT NULL,
        interests TEXT[],
        check_size TEXT,
        timeline TEXT,
        status TEXT NOT NULL DEFAULT 'unreviewed',
        pear_notes TEXT,
        founder_response TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Get all connection requests
export async function getAllConnectionRequests(): Promise<ConnectionRequest[]> {
  try {
    const result = await sql`
      SELECT 
        id,
        investor_id as "investorId",
        investor_name as "investorName",
        investor_email as "investorEmail",
        investor_firm as "investorFirm",
        investor_linkedin as "investorLinkedIn",
        company_id as "companyId",
        company_name as "companyName",
        message,
        interests,
        check_size as "checkSize",
        timeline,
        status,
        pear_notes as "pearNotes",
        founder_response as "founderResponse",
        created_at as "createdAt"
      FROM connection_requests
      ORDER BY created_at DESC
    `;
    return result.rows as ConnectionRequest[];
  } catch (error) {
    console.error('Error fetching connection requests:', error);
    return [];
  }
}

// Get connection request by ID
export async function getConnectionRequestById(id: string): Promise<ConnectionRequest | null> {
  try {
    const result = await sql`
      SELECT 
        id,
        investor_id as "investorId",
        investor_name as "investorName",
        investor_email as "investorEmail",
        investor_firm as "investorFirm",
        investor_linkedin as "investorLinkedIn",
        company_id as "companyId",
        company_name as "companyName",
        message,
        interests,
        check_size as "checkSize",
        timeline,
        status,
        pear_notes as "pearNotes",
        founder_response as "founderResponse",
        created_at as "createdAt"
      FROM connection_requests
      WHERE id = ${id}
    `;
    return result.rows[0] as ConnectionRequest || null;
  } catch (error) {
    console.error('Error fetching connection request:', error);
    return null;
  }
}

// Get connection requests by company
export async function getConnectionRequestsByCompany(companyId: string): Promise<ConnectionRequest[]> {
  try {
    const result = await sql`
      SELECT 
        id,
        investor_id as "investorId",
        investor_name as "investorName",
        investor_email as "investorEmail",
        investor_firm as "investorFirm",
        investor_linkedin as "investorLinkedIn",
        company_id as "companyId",
        company_name as "companyName",
        message,
        interests,
        check_size as "checkSize",
        timeline,
        status,
        pear_notes as "pearNotes",
        founder_response as "founderResponse",
        created_at as "createdAt"
      FROM connection_requests
      WHERE company_id = ${companyId}
      ORDER BY created_at DESC
    `;
    return result.rows as ConnectionRequest[];
  } catch (error) {
    console.error('Error fetching connection requests by company:', error);
    return [];
  }
}

// Get connection requests by investor
export async function getConnectionRequestsByInvestor(investorId: string): Promise<ConnectionRequest[]> {
  try {
    const result = await sql`
      SELECT 
        id,
        investor_id as "investorId",
        investor_name as "investorName",
        investor_email as "investorEmail",
        investor_firm as "investorFirm",
        investor_linkedin as "investorLinkedIn",
        company_id as "companyId",
        company_name as "companyName",
        message,
        interests,
        check_size as "checkSize",
        timeline,
        status,
        pear_notes as "pearNotes",
        founder_response as "founderResponse",
        created_at as "createdAt"
      FROM connection_requests
      WHERE investor_id = ${investorId}
      ORDER BY created_at DESC
    `;
    return result.rows as ConnectionRequest[];
  } catch (error) {
    console.error('Error fetching connection requests by investor:', error);
    return [];
  }
}

// Create connection request
export async function createConnectionRequest(
  request: Omit<ConnectionRequest, 'id' | 'createdAt'>
): Promise<ConnectionRequest> {
  const id = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const result = await sql`
      INSERT INTO connection_requests (
        id,
        investor_id,
        investor_name,
        investor_email,
        investor_firm,
        investor_linkedin,
        company_id,
        company_name,
        message,
        interests,
        check_size,
        timeline,
        status,
        pear_notes,
        founder_response
      ) VALUES (
        ${id},
        ${request.investorId},
        ${request.investorName},
        ${request.investorEmail},
        ${request.investorFirm || null},
        ${request.investorLinkedIn || null},
        ${request.companyId},
        ${request.companyName},
        ${request.message},
        ${request.interests || []},
        ${request.checkSize || null},
        ${request.timeline || null},
        ${request.status},
        ${request.pearNotes || null},
        ${request.founderResponse || null}
      )
      RETURNING 
        id,
        investor_id as "investorId",
        investor_name as "investorName",
        investor_email as "investorEmail",
        investor_firm as "investorFirm",
        investor_linkedin as "investorLinkedIn",
        company_id as "companyId",
        company_name as "companyName",
        message,
        interests,
        check_size as "checkSize",
        timeline,
        status,
        pear_notes as "pearNotes",
        founder_response as "founderResponse",
        created_at as "createdAt"
    `;
    return result.rows[0] as ConnectionRequest;
  } catch (error) {
    console.error('Error creating connection request:', error);
    throw error;
  }
}

// Update connection request
export async function updateConnectionRequest(
  id: string,
  updates: Partial<ConnectionRequest>
): Promise<ConnectionRequest | null> {
  try {
    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.status !== undefined) {
      setClauses.push(`status = $${paramIndex++}`);
      values.push(updates.status);
    }
    if (updates.pearNotes !== undefined) {
      setClauses.push(`pear_notes = $${paramIndex++}`);
      values.push(updates.pearNotes);
    }
    if (updates.founderResponse !== undefined) {
      setClauses.push(`founder_response = $${paramIndex++}`);
      values.push(updates.founderResponse);
    }

    if (setClauses.length === 0) {
      return getConnectionRequestById(id);
    }

    values.push(id);
    const query = `
      UPDATE connection_requests
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING 
        id,
        investor_id as "investorId",
        investor_name as "investorName",
        investor_email as "investorEmail",
        investor_firm as "investorFirm",
        investor_linkedin as "investorLinkedIn",
        company_id as "companyId",
        company_name as "companyName",
        message,
        interests,
        check_size as "checkSize",
        timeline,
        status,
        pear_notes as "pearNotes",
        founder_response as "founderResponse",
        created_at as "createdAt"
    `;

    const result = await sql.query(query, values);
    return result.rows[0] as ConnectionRequest || null;
  } catch (error) {
    console.error('Error updating connection request:', error);
    return null;
  }
}

// Delete connection request
export async function deleteConnectionRequest(id: string): Promise<boolean> {
  try {
    await sql`DELETE FROM connection_requests WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Error deleting connection request:', error);
    return false;
  }
}

// Get connection stats
export async function getConnectionStats() {
  try {
    const result = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'unreviewed') as unreviewed,
        COUNT(*) FILTER (WHERE status = 'reviewed') as reviewed,
        COUNT(*) FILTER (WHERE status = 'accepted') as accepted,
        COUNT(*) FILTER (WHERE status = 'declined') as declined
      FROM connection_requests
    `;
    
    const stats = result.rows[0];
    return {
      total: parseInt(stats.total),
      unreviewed: parseInt(stats.unreviewed),
      reviewed: parseInt(stats.reviewed),
      accepted: parseInt(stats.accepted),
      declined: parseInt(stats.declined),
    };
  } catch (error) {
    console.error('Error fetching connection stats:', error);
    return { total: 0, unreviewed: 0, reviewed: 0, accepted: 0, declined: 0 };
  }
}

// ==================== COMPANIES ====================

// Get all companies
export async function getAllCompanies(): Promise<Company[]> {
  try {
    const companiesResult = await sql`
      SELECT 
        id, name, tagline, logo, description, industry, stage, batch,
        location, website,
        video_url as "videoUrl",
        pitch_deck_url as "pitchDeckUrl",
        tags, featured, image,
        created_at as "createdAt"
      FROM companies
      ORDER BY featured DESC, created_at DESC
    `;

    const companies = companiesResult.rows as Company[];
    
    // Fetch founders for each company
    for (const company of companies) {
      const foundersResult = await sql`
        SELECT 
          id, name, title, photo, bio,
          linkedin as "linkedIn",
          twitter,
          company_id as "companyId",
          created_at as "createdAt"
        FROM founders
        WHERE company_id = ${company.id}
      `;
      company.founders = foundersResult.rows as Founder[];
    }

    return companies;
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
}

// Get company by ID
export async function getCompanyById(id: string): Promise<Company | null> {
  try {
    const result = await sql`
      SELECT 
        id, name, tagline, logo, description, industry, stage, batch,
        location, website,
        video_url as "videoUrl",
        pitch_deck_url as "pitchDeckUrl",
        tags, featured, image,
        created_at as "createdAt"
      FROM companies
      WHERE id = ${id}
    `;

    if (result.rows.length === 0) return null;

    const company = result.rows[0] as Company;

    // Fetch founders
    const foundersResult = await sql`
      SELECT 
        id, name, title, photo, bio,
        linkedin as "linkedIn",
        twitter,
        company_id as "companyId",
        created_at as "createdAt"
      FROM founders
      WHERE company_id = ${id}
    `;
    company.founders = foundersResult.rows as Founder[];

    return company;
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
}

// Create company
export async function createCompany(company: Omit<Company, 'founders' | 'createdAt'>): Promise<Company> {
  try {
    const result = await sql`
      INSERT INTO companies (
        id, name, tagline, logo, description, industry, stage, batch,
        location, website, video_url, pitch_deck_url, tags, featured, image
      ) VALUES (
        ${company.id},
        ${company.name},
        ${company.tagline},
        ${company.logo || null},
        ${company.description},
        ${company.industry},
        ${company.stage},
        ${company.batch},
        ${company.location},
        ${company.website || null},
        ${company.videoUrl || null},
        ${company.pitchDeckUrl || null},
        ${company.tags || []},
        ${company.featured || false},
        ${company.image || null}
      )
      RETURNING 
        id, name, tagline, logo, description, industry, stage, batch,
        location, website,
        video_url as "videoUrl",
        pitch_deck_url as "pitchDeckUrl",
        tags, featured, image,
        created_at as "createdAt"
    `;

    const newCompany = result.rows[0] as Company;
    newCompany.founders = [];
    return newCompany;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
}

// Create founder
export async function createFounder(founder: Omit<Founder, 'createdAt'>): Promise<Founder> {
  try {
    const result = await sql`
      INSERT INTO founders (
        id, name, title, photo, bio, linkedin, twitter, company_id
      ) VALUES (
        ${founder.id},
        ${founder.name},
        ${founder.title},
        ${founder.photo || null},
        ${founder.bio},
        ${founder.linkedIn || null},
        ${founder.twitter || null},
        ${founder.companyId}
      )
      RETURNING 
        id, name, title, photo, bio,
        linkedin as "linkedIn",
        twitter,
        company_id as "companyId",
        created_at as "createdAt"
    `;

    return result.rows[0] as Founder;
  } catch (error) {
    console.error('Error creating founder:', error);
    throw error;
  }
}
