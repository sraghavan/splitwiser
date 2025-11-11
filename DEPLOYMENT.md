# Deploying Splitwise to Vercel

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/splitwise-app)

## Manual Deployment Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from this directory**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? `Y`
   - Which scope? Choose your account
   - Link to existing project? `N`
   - What's your project's name? `splitwise-app` (or your preferred name)
   - In which directory is your code located? `./` (current directory)

## Environment Variables

After deployment, you may need to set environment variables in the Vercel dashboard:

- Go to your project dashboard on [vercel.com](https://vercel.com)
- Navigate to Settings → Environment Variables
- Add any required environment variables

## Database Considerations

**Current Setup**: Uses SQLite (file-based database)
- Good for development and demos
- Data persists locally but doesn't sync between devices

**For Production**: Consider upgrading to a hosted database:
- **PostgreSQL**: Supabase, Neon, or Vercel Postgres
- **MySQL**: PlanetScale or Railway
- **MongoDB**: MongoDB Atlas

To change database:
1. Update `prisma/schema.prisma` with new database provider
2. Update `DATABASE_URL` environment variable
3. Run `npx prisma db push` to create tables

## Features Included in Deployment

✅ **Complete Expense Sharing App**
- Trip management with admin controls
- Advanced expense splitting (equal/exact/percentage)
- Central money keeper system with ad-hoc payments
- Real-time balance calculations
- Responsive design for all devices

✅ **Admin Features**
- Add/remove trip members
- Bulk member addition
- Configure central money keeper
- Enhanced local storage caching

✅ **Data Persistence**
- All data saved to local storage
- Enhanced caching system
- Automatic backup of trip data

## Post-Deployment

After successful deployment:
1. Your app will be available at `https://your-app-name.vercel.app`
2. Test all features including member management
3. Share the link with your team members
4. Consider setting up a custom domain in Vercel settings

## Troubleshooting

- **Build fails**: Check that all dependencies are in `package.json`
- **Database errors**: Ensure Prisma schema is correct for your database
- **Missing features**: Verify all components are properly imported

## Scaling for Production

For heavy usage, consider:
- Upgrading to a hosted database
- Adding user authentication with NextAuth.js
- Implementing real-time sync between users
- Adding email notifications for payments/expenses