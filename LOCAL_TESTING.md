# Local Testing Guide

## Option 1: Test with Vercel Postgres (Recommended)

### Step 1: Create Vercel Postgres Database
1. Go to https://vercel.com/dashboard
2. Select your `pear-demo-day` project
3. Go to **Storage** tab
4. Click **Create Database** → Select **Postgres**
5. Name it `pear-demo-day-db` and create

### Step 2: Pull Environment Variables
```bash
vercel env pull .env.local
```

This will download all environment variables including the Postgres connection strings.

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Initialize Database
Open your browser and visit:
- http://localhost:3000/api/init-db (creates tables)
- http://localhost:3000/api/seed-db (adds mock data)

You should see success messages!

### Step 5: Test the App
- Visit http://localhost:3000
- You should see all companies loaded from the database
- Try the AI search
- Click on a company to see details
- Try sending a connection request

## Option 2: Test Without Database (Fallback Mode)

If you want to test without setting up Postgres yet, we can add a fallback mode that uses mock data when the database isn't available.

Would you like me to implement this fallback mode?

## Troubleshooting

### "Failed to fetch companies"
- Make sure you've created the Vercel Postgres database
- Run `vercel env pull .env.local` to get the connection strings
- Check that `.env.local` has `POSTGRES_URL` set

### "Database connection failed"
- The Postgres database might not be accessible from localhost
- Try deploying to Vercel first, then test there
- Or use Option 2 (fallback mode)

### Empty company list
- Visit http://localhost:3000/api/seed-db to populate the database
- Check the browser console for errors
