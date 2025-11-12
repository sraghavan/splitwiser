# 🗄️ Database Setup Guide for Splitwise

This guide will help you set up a free PostgreSQL database with Supabase and connect it to your Vercel deployment.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → Sign up with GitHub
3. Create a new project:
   - **Project name**: `splitwise-app`
   - **Database password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - Click "Create new project"

### Step 2: Get Database Credentials
1. In your Supabase dashboard, go to **Settings** → **Database**
2. Copy the **Connection string** under "Connection info"
3. It looks like: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

### Step 3: Set Up Environment Variables

**For Local Development:**
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your database URL
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres"
```

**For Vercel Deployment:**
1. Go to your [Vercel dashboard](https://vercel.com/dashboard)
2. Select your project → Settings → Environment Variables
3. Add these variables:
   - `DATABASE_URL`: Your Supabase connection string
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL (from Supabase dashboard → Settings → API)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon public key (from Supabase dashboard → Settings → API)

### Step 4: Set Up Database Schema
```bash
# Install dependencies with PostgreSQL support
npm install

# Set up database tables
npm run db:setup
```

### Step 5: Deploy to Vercel
```bash
# Install Vercel CLI if you haven't
npm install -g vercel

# Deploy your app
vercel

# Or push to GitHub and connect to Vercel
git add .
git commit -m "Add PostgreSQL database support"
git push origin main
```

## 🔧 Detailed Configuration

### Database Connection Options

**Option 1: Supabase (Recommended - Free tier includes 500MB)**
- ✅ Free tier with 500MB storage
- ✅ Built-in authentication (future feature)
- ✅ Real-time subscriptions
- ✅ REST API auto-generated

**Option 2: Neon (Alternative free PostgreSQL)**
- ✅ Free tier with 512MB storage
- ✅ Automatic scaling
- ✅ Branch-based development

**Option 3: Railway (PostgreSQL)**
- ✅ Free tier with $5/month credits
- ✅ Easy deployment
- ✅ Built-in monitoring

### Environment Variables Explained

```bash
# Required for database connection
DATABASE_URL="postgresql://postgres:password@host:5432/database"

# Optional: For future Supabase features (auth, real-time)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### Database Schema Overview

Your Splitwise app uses these tables:
- **users**: User accounts and profiles
- **trips**: Trip information and settings
- **trip_members**: User associations with trips
- **expenses**: Expense records with amounts
- **expense_participants**: Individual expense shares
- **payments**: Regular settlements between users
- **adhoc_payments**: Ad-hoc payments to central money keepers

## 🚨 Troubleshooting

### Common Issues

**1. Database Connection Failed**
```bash
# Test your connection
npx prisma db push
```
- Check your DATABASE_URL format
- Ensure your Supabase project is active
- Verify password doesn't contain special characters that need encoding

**2. Build Fails on Vercel**
- Make sure all environment variables are set in Vercel dashboard
- Check that DATABASE_URL is accessible from Vercel's servers
- Verify your Supabase project allows external connections

**3. Schema Push Fails**
```bash
# Reset and retry
npx prisma migrate reset
npx prisma db push
```

**4. Local Development Issues**
```bash
# Regenerate Prisma client
npm run db:generate

# Check database connection
npx prisma studio
```

### Performance Tips

**For Production:**
1. **Connection Pooling**: Already configured in schema
2. **Environment-specific URLs**: Use `?pgbouncer=true` for Supabase
3. **Query Optimization**: Prisma handles most optimizations automatically

### Backup & Migration

**Export Data (before major changes):**
```bash
# Export from Supabase dashboard
# Or use pg_dump if you have PostgreSQL tools
```

**Import Data:**
```bash
# Use Supabase dashboard SQL editor
# Or restore from pg_dump file
```

## 📊 Free Tier Limits

**Supabase Free Tier:**
- 500MB database storage
- 50MB file storage
- 2 GB bandwidth
- 50,000 monthly active users

**What this means for Splitwise:**
- Supports thousands of trips
- Hundreds of active users
- Plenty for personal/small group use
- Upgrade when you hit limits

## 🔄 Migration from SQLite

If you have existing SQLite data:

1. **Export your current data**
2. **Set up PostgreSQL database**
3. **Run migration scripts**
4. **Import data to new database**

Your app will automatically work with the new database once you update the DATABASE_URL!

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Database credentials copied
- [ ] Environment variables set (local and Vercel)
- [ ] `npm run db:setup` completed successfully
- [ ] App runs locally with database
- [ ] Deployed to Vercel with database connection
- [ ] Can create trips and add members
- [ ] Data persists between sessions

**Need help?** Check the [Supabase docs](https://supabase.com/docs) or [Vercel deployment guide](https://vercel.com/docs).