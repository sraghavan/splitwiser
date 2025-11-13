# 🚀 Quick Deployment Guide

## 1. Set Up Free Database (5 minutes)

### Create Supabase Account
1. Go to [supabase.com](https://supabase.com) → "Start your project"
2. Sign up with GitHub
3. Create new project:
   - Name: `splitwise-app`
   - Generate strong database password
   - Choose region closest to you

### Get Database URL
1. In Supabase dashboard → Settings → Database
2. Copy the Connection string:
   `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

## 2. Deploy to Vercel (3 minutes)

### Option A: Vercel CLI (Fastest)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# When prompted, add environment variables:
# DATABASE_URL=your-supabase-connection-string
```

### Option B: GitHub Integration
1. Push your code to GitHub:
   ```bash
   git remote add origin https://github.com/yourusername/splitwise-app.git
   git push -u origin main
   ```

2. Connect to Vercel:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Add environment variables in deployment settings:
     - `DATABASE_URL`: Your Supabase connection string

## 3. Environment Variables

Add these in Vercel dashboard → Your Project → Settings → Environment Variables:

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

## 4. Verify Deployment

1. Your app will be live at `https://your-app-name.vercel.app`
2. Test by creating a trip and adding members
3. Data will persist in your Supabase database

## 🎉 You're Live!

✅ **Free PostgreSQL database** (500MB on Supabase)
✅ **Vercel hosting** with automatic deployments
✅ **Admin features** for managing trip members
✅ **Central money keeper** system
✅ **Real-time balance calculations**
✅ **Responsive design** works on all devices

### Next Steps:
- Share your app URL with friends
- Add custom domain (optional)
- Monitor usage in Supabase dashboard
- Scale up database when needed

**Total time**: ~8 minutes
**Total cost**: $0 (free tiers)