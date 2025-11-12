# Splitwise - Expense Sharing App

A comprehensive expense sharing application built with Next.js, TypeScript, and Tailwind CSS that allows groups to track shared expenses and settle balances easily.

## 🚀 Features

### Core Functionality
- **Trip Management**: Create and manage trips with multiple members
- **Expense Tracking**: Add expenses with flexible splitting options (equal, exact amounts, percentages)
- **Member Management**: Admin interface for adding/removing trip members
- **Balance Calculations**: Real-time balance tracking for each member
- **Payment Settlement**: Record payments between members

### Central Money Keeper System 🏦
- **Assign Central Money Keeper**: One person can be designated as the central money handler
- **Ad-hoc Payments**: Members can send money to the central keeper anytime
- **Payment Tracking**: Full history of all ad-hoc contributions
- **Simplified Group Payments**: Central keeper handles most group expenses

### Advanced Features
- **Multiple Split Types**:
  - Equal splits
  - Exact amount splits
  - Percentage-based splits
- **Expense Categories**: Food, Transport, Accommodation, Entertainment, Shopping, General
- **Payment History**: Complete audit trail of all transactions
- **Responsive Design**: Works on mobile and desktop
- **Real-time Balance Updates**: Balances update automatically as expenses are added

## 🎯 Key Components

### 1. Dashboard (`/components/dashboard.tsx`)
- Overview of all trips
- Balance summaries
- Quick access to create new trips

### 2. Trip Management (`/components/expense-tracker.tsx`)
- Main interface for managing a specific trip
- Tabbed navigation between Expenses, Balances, and Payments
- Integration with all trip features

### 3. Admin Interface (`/components/trip-admin.tsx`)
- Add/remove trip members
- Configure central money keeper
- Manage trip settings

### 4. Expense Management
- **Add Expense Dialog** (`/components/add-expense-dialog.tsx`): Comprehensive expense creation with all split types
- **Expense List** (`/components/expense-list.tsx`): Display and manage all trip expenses

### 5. Central Money Keeper Panel (`/components/central-money-keeper-panel.tsx`)
- Track ad-hoc payments from members
- View contribution history
- Record received payments

### 6. Balances & Settlements (`/components/balances-summary.tsx`)
- Member balance overview
- Quick payment interface
- Settlement tracking

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Database**: Prisma with SQLite (configurable)
- **State Management**: React Context + localStorage
- **Icons**: Lucide React

## 📦 Installation & Setup

### Local Development
1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set up Environment Variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database URL
   ```

3. **Set up Database**:
   ```bash
   npm run db:setup
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   Navigate to `http://localhost:3000`

### Production Deployment with Database

🎯 **Quick Deploy**: See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for complete guide

1. **Create free database** on [Supabase](https://supabase.com)
2. **Deploy to Vercel** with environment variables
3. **Set up database schema** automatically on first deploy

**Free Database Options:**
- **Supabase**: 500MB PostgreSQL (Recommended)
- **Neon**: 512MB PostgreSQL
- **Railway**: $5/month credits

## 📋 Database Schema

The app uses Prisma with the following main models:

- **User**: User accounts and profiles
- **Trip**: Trip information and settings
- **TripMember**: Member associations with roles
- **Expense**: Expense records with split information
- **ExpenseParticipant**: Individual expense shares
- **Payment**: Regular settlements between members
- **AdhocPayment**: Ad-hoc payments to central money keeper

## 🎨 UI Features

- **Clean Design**: Modern, intuitive interface
- **Responsive Layout**: Works on all screen sizes
- **Interactive Dialogs**: Modal interfaces for forms
- **Status Indicators**: Visual feedback for balances and payments
- **Category Icons**: Visual categorization of expenses

## 💰 Central Money Keeper Workflow

1. **Setup**: Admin assigns a central money keeper for the trip
2. **Ad-hoc Payments**: Members send money to the keeper as needed
3. **Expense Management**: Keeper handles group payments using the collected funds
4. **Tracking**: System tracks all contributions and provides transparency

## 🔧 Usage Examples

### Creating a Trip
1. Sign in with your email and name
2. Click "Create Trip" from the dashboard
3. Fill in trip details and optionally set yourself as central money keeper
4. Start adding members and expenses

### Adding Expenses
1. Open a trip and click "Add Expense"
2. Choose split type (equal, exact amounts, or percentages)
3. Select participants and enter amounts
4. System automatically calculates balances

### Central Money Keeper Operations
1. Navigate to the Payments tab in any trip with a central keeper
2. Record ad-hoc payments received from members
3. View contribution history and member balances
4. Track all money flows transparently

This application provides a complete solution for group expense management with the unique central money keeper feature that simplifies group payment coordination!