# 🚀 Complete Deployment Guide: Splitwise to Vercel + Supabase

**Total Time: ~10 minutes | Cost: $0 (Free tiers)**

## 📋 Prerequisites Checklist
- [ ] GitHub account
- [ ] Node.js installed on your computer
- [ ] Your Splitwise app running locally

---

## Step 1: 🗄️ Set Up Free Database (Supabase)

### 1.1 Create Supabase Account
1. **Go to**: [supabase.com](https://supabase.com)
2. **Click**: "Start your project"
3. **Sign up**: Use your GitHub account (recommended)
4. **Verify**: Check your email if prompted

### 1.2 Create New Project
1. **Click**: "New project"
2. **Fill in**:
   - **Organization**: Select your personal account
   - **Project name**: `splitwise-app`
   - **Database password**: Click "Generate a password" (SAVE THIS PASSWORD!)
   - **Region**: Choose closest to your location
3. **Click**: "Create new project"
4. **Wait**: 2-3 minutes for setup (grab a coffee ☕)

### 1.3 Get Database Connection String
1. **Go to**: Settings → Database (in left sidebar)
2. **Find**: "Connection info" section
3. **Copy**: The connection string that looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres
   ```
4. **Save this somewhere safe** - you'll need it for Vercel!

### 1.4 Test Database Connection
1. **In your terminal** (in the Splitwise project folder):
   ```bash
   # Create environment file
   cp .env.example .env.local
   ```

2. **Edit .env.local** and add your database URL:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres"
   ```

3. **Set up the database**:
   ```bash
   npm run db:setup
   ```

4. **You should see**: "✅ Database setup completed successfully!"

---

## Step 2: 📱 Push Code to GitHub

### 2.1 Create GitHub Repository
1. **Go to**: [github.com](https://github.com)
2. **Click**: "New repository" (green button)
3. **Fill in**:
   - **Repository name**: `splitwise-app`
   - **Description**: "Expense sharing app with central money keeper"
   - **Public** or **Private** (your choice)
   - **DON'T** check "Add README" (we have one)
4. **Click**: "Create repository"

### 2.2 Push Your Code
1. **Copy the commands** from GitHub (under "push an existing repository")
2. **In your terminal**:
   ```bash
   git remote add origin https://github.com/[YOUR-USERNAME]/splitwise-app.git
   git branch -M main
   git push -u origin main
   ```

3. **Refresh GitHub** - you should see all your files!

---

## Step 3: 🌐 Deploy to Vercel

### 3.1 Create Vercel Account
1. **Go to**: [vercel.com](https://vercel.com)
2. **Click**: "Sign Up"
3. **Choose**: "Continue with GitHub"
4. **Authorize**: Vercel to access your repositories

### 3.2 Import Your Project
1. **Click**: "Add New..." → "Project"
2. **Find**: Your `splitwise-app` repository
3. **Click**: "Import"

### 3.3 Configure Environment Variables
**IMPORTANT**: Before deploying, you MUST add your database URL!

1. **Before clicking "Deploy"**, click "Environment Variables"
2. **Add**:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Supabase connection string (from Step 1.3)
3. **Click**: "Add"

### 3.4 Deploy
1. **Click**: "Deploy"
2. **Wait**: 2-3 minutes for build and deployment
3. **Success**: You'll see confetti 🎉 and your live URL!

---

## Step 4: ✅ Test Your Live App

### 4.1 Open Your Live App
1. **Click**: "Visit" or go to your assigned URL (like `https://splitwise-app-xyz.vercel.app`)
2. **Test**:
   - Sign in with your name and email
   - Create a new trip
   - Add yourself as central money keeper
   - Add some members (use the bulk add feature!)

### 4.2 Verify Database Connection
1. **Create a trip**: Make sure it saves
2. **Add expenses**: Test the splitting features
3. **Check persistence**: Refresh the page - data should remain

### 4.3 Test Admin Features
1. **Go to trip settings**: Click the settings icon
2. **Add members individually**: Use the "Add Member" button
3. **Try bulk add**: Click "Bulk Add Members" and paste:
   ```
   John Doe, john@example.com
   Jane Smith, jane@example.com
   Bob Wilson, bob@example.com
   ```

---

## Step 5: 🎯 Set Up Automatic Deployments

**Good news**: This is already set up! Every time you push to GitHub, Vercel will automatically deploy your changes.

### Test Automatic Deployment
1. **Make a small change** to your app (like updating the title)
2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Test automatic deployment"
   git push origin main
   ```
3. **Go to Vercel dashboard**: You'll see a new deployment in progress
4. **Visit your URL**: Changes will appear in ~2 minutes

---

## 🔧 Troubleshooting

### Database Connection Issues
**Error**: "Database connection failed"
**Solution**:
1. Check your `DATABASE_URL` in Vercel environment variables
2. Make sure there are no extra spaces
3. Verify your Supabase project is active

### Build Failures
**Error**: "Build failed"
**Solution**:
1. Check Vercel function logs
2. Ensure all environment variables are set
3. Try redeploy: Vercel dashboard → Deployments → Redeploy

### App Not Loading
**Error**: "Application error"
**Solution**:
1. Check Vercel function logs
2. Verify database schema was created: `npm run db:setup`
3. Test locally first: `npm run dev`

---

## 🎉 Success Checklist

- [ ] Supabase database created and connected
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel with environment variables
- [ ] App accessible via live URL
- [ ] Can create trips and add members
- [ ] Data persists between sessions
- [ ] Automatic deployments working

---

## 📊 What You Get (Free Tiers)

### Supabase Free Tier
- **Database**: 500MB PostgreSQL
- **Bandwidth**: 2GB/month
- **Users**: Up to 50,000 monthly active users
- **Perfect for**: Hundreds of trips, thousands of expenses

### Vercel Free Tier
- **Bandwidth**: 100GB/month
- **Function executions**: 1,000 hours/month
- **Deployments**: Unlimited
- **Perfect for**: Personal and small team use

---

## 🚀 Next Steps

### Share Your App
1. **Copy your live URL**: `https://your-app-name.vercel.app`
2. **Share with friends**: They can access directly via browser
3. **Add to home screen**: Works like a mobile app!

### Monitor Usage
1. **Supabase Dashboard**: Monitor database usage
2. **Vercel Analytics**: See how many people use your app
3. **Upgrade when needed**: Both have paid plans for heavy usage

### Customize Your Domain (Optional)
1. **Buy a domain**: From any registrar
2. **Add to Vercel**: Project Settings → Domains
3. **Professional look**: `splitwise.yourdomain.com`

---

## 🆘 Need Help?

1. **Check the logs**: Vercel dashboard → Functions → View function logs
2. **Database issues**: Supabase dashboard → Logs
3. **GitHub Issues**: Create an issue in your repository
4. **Community help**:
   - [Vercel Discord](https://discord.gg/vercel)
   - [Supabase Discord](https://discord.supabase.com)

**Your Splitwise app is now live and ready to use! 🎊**