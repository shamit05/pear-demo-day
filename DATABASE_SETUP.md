# Database Setup Guide

This project uses **Vercel Postgres** for persistent data storage.

## Setup Steps

### 1. Create a Vercel Postgres Database

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your `pear-demo-day` project
3. Go to the **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a name (e.g., `pear-demo-day-db`)
7. Select a region (choose one close to your users)
8. Click **Create**

### 2. Connect Database to Your Project

Vercel will automatically add the following environment variables to your project:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### 3. Initialize the Database Schema

After creating the database, you need to create the tables:

**Option A: Via API Route (Recommended)**
1. Deploy your project to Vercel
2. Visit: `https://your-app.vercel.app/api/init-db`
3. You should see: `{"message":"Database initialized successfully"}`

**Option B: Via Vercel Dashboard**
1. Go to your database in the Vercel dashboard
2. Click on the **Query** tab
3. Run the following SQL:

```sql
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
);
```

### 4. Local Development

For local development, you can either:

**Option A: Use Vercel Postgres (Recommended)**
1. Install Vercel CLI: `npm i -g vercel`
2. Link your project: `vercel link`
3. Pull environment variables: `vercel env pull .env.local`
4. This will download all the Postgres connection strings

**Option B: Use a Local Postgres Instance**
1. Install Postgres locally
2. Create a database
3. Add the connection string to `.env.local`:
   ```
   POSTGRES_URL=postgresql://user:password@localhost:5432/dbname
   ```

## Database Schema

### `connection_requests` Table

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key, unique request ID |
| investor_id | TEXT | ID of the investor (or 'guest') |
| investor_name | TEXT | Investor's full name |
| investor_email | TEXT | Investor's email |
| investor_firm | TEXT | Investor's firm name (optional) |
| investor_linkedin | TEXT | LinkedIn profile URL (optional) |
| company_id | TEXT | ID of the company being contacted |
| company_name | TEXT | Name of the company |
| message | TEXT | Connection request message |
| interests | TEXT[] | Array of interest types |
| check_size | TEXT | Investment check size range |
| timeline | TEXT | Investment timeline |
| status | TEXT | Request status: 'unreviewed', 'reviewed', 'accepted', 'declined' |
| pear_notes | TEXT | Admin notes from Pear team (optional) |
| founder_response | TEXT | Founder's response (optional) |
| created_at | TIMESTAMP | When the request was created |

## Troubleshooting

### "Failed to connect to database"
- Make sure you've created a Vercel Postgres database
- Verify the environment variables are set in Vercel
- Redeploy your application after adding the database

### "Table does not exist"
- Run the initialization script: visit `/api/init-db`
- Or manually create the table using the SQL above

### Local development not working
- Run `vercel env pull .env.local` to get the latest environment variables
- Make sure you're linked to the correct Vercel project
