#!/usr/bin/env node

/**
 * Database setup script for Splitwise
 * This script helps set up the database connection and run migrations
 */

const { execSync } = require('child_process');

console.log('🚀 Setting up Splitwise database...\n');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Push database schema
  console.log('🗄️  Pushing database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });

  console.log('\n✅ Database setup completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Make sure your DATABASE_URL is set correctly');
  console.log('2. Run "npm run dev" to start the development server');
  console.log('3. Visit http://localhost:3000 to see your app');

} catch (error) {
  console.error('\n❌ Database setup failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Check your DATABASE_URL environment variable');
  console.log('2. Ensure your database is accessible');
  console.log('3. Check your internet connection if using a cloud database');
  process.exit(1);
}