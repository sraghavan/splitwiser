# 🚀 Quick Deploy Commands

**Copy and paste these commands for fast deployment**

## 1. Push to GitHub
```bash
# Create GitHub repo first at github.com, then:
git remote add origin https://github.com/[YOUR-USERNAME]/splitwise-app.git
git branch -M main
git push -u origin main
```

## 2. Set Up Supabase Database
1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy your DATABASE_URL (looks like):
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```

## 3. Deploy to Vercel
Go to [vercel.com](https://vercel.com) → Import from GitHub → Add Environment Variable:
- **Name**: `DATABASE_URL`
- **Value**: Your Supabase URL

## 4. Test Your Live App
Visit your Vercel URL and test:
- Sign in → Create trip → Add members → Add expenses

---

## 📚 Full Guides Available:
- **Complete Guide**: [DEPLOYMENT_STEP_BY_STEP.md](./DEPLOYMENT_STEP_BY_STEP.md)
- **Pre-deployment Check**: [PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md)
- **Database Setup**: [DATABASE_SETUP.md](./DATABASE_SETUP.md)

**Your app is ready! Total deploy time: ~10 minutes** ⚡