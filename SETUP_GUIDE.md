# Coinlect Application - Complete Setup Guide

This comprehensive guide will walk you through setting up the Coinlect crypto learning platform, including database configuration, environment variables, and backend connections.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Environment Variables](#environment-variables)
4. [Installation & Setup](#installation--setup)
5. [Running the Application](#running-the-application)
6. [Backend Connection](#backend-connection)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### Verify Installation

```bash
node --version  # Should be v18 or higher
npm --version
psql --version  # Should be PostgreSQL 12 or higher
```

---

## Database Setup

### Option 1: Local PostgreSQL Installation

#### Step 1: Install PostgreSQL

**Windows:**
- Download from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
- Run the installer and remember the password you set for the `postgres` user

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Step 2: Create Database

1. **Access PostgreSQL CLI:**
   ```bash
   psql -U postgres
   ```
   (On Windows, use `psql -U postgres` from Command Prompt or use pgAdmin)

2. **Create the database:**
   ```sql
   CREATE DATABASE coinlect_db;
   CREATE USER coinlect_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE coinlect_db TO coinlect_user;
   \q
   ```

3. **Test connection:**
   ```bash
   psql -U coinlect_user -d coinlect_db -h localhost
   ```

### Option 2: Cloud Database (Recommended for Production)

#### Using Neon (Free Tier Available)

1. Go to [Neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string (format: `postgresql://user:password@host/dbname?sslmode=require`)

#### Using Supabase (Free Tier Available)

1. Go to [Supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the connection string from **Connection string** → **URI**

#### Using Vercel Postgres

1. In your Vercel project dashboard, go to **Storage**
2. Click **Create Database** → Select **Postgres**
3. Copy the connection string (automatically added as `POSTGRES_URL`)

### Step 3: Run Database Migrations

After setting up your database, run Prisma migrations:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create all tables
npx prisma migrate dev

# (Optional) View your database in Prisma Studio
npx prisma studio
```

This will create the following tables:
- `User` - User accounts and authentication
- `Course` - Educational courses
- `CourseModule` - Course modules/lessons
- `Article` - Blog articles
- `Enrollment` - User course enrollments
- `Progress` - User learning progress
- `RefreshToken` - JWT refresh tokens
- `FeaturedItem` - Featured courses/articles

---

## Environment Variables

Create a `.env.local` file in the root directory of your project:

```bash
cp .env.example .env.local  # If .env.example exists
# OR create manually
touch .env.local
```

### Required Environment Variables

Add the following variables to your `.env.local` file:

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
# PostgreSQL connection string
# Format: postgresql://username:password@host:port/database
# Local example: postgresql://coinlect_user:password@localhost:5432/coinlect_db
# Cloud example: postgresql://user:pass@host.neon.tech/dbname?sslmode=require
DATABASE_URL=postgresql://coinlect_user:your_password@localhost:5432/coinlect_db

# ============================================
# JWT AUTHENTICATION
# ============================================
# Generate a strong random string (minimum 32 characters)
# You can generate one using: openssl rand -base64 32
# Or: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# ============================================
# APPLICATION URL
# ============================================
# Your application URL (for local development use http://localhost:3000)
# For production, use your actual domain
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ============================================
# EMAIL (RESEND)
# ============================================
# Used to send welcome emails + password reset emails.
# IMPORTANT: Do NOT commit real keys to git.
RESEND_API_KEY=re_************************
# In production, set this to a verified sender like: Coinlect <no-reply@coinlect.com>
# For dev/testing, Resend allows: onboarding@resend.dev
RESEND_FROM=Coinlect <onboarding@resend.dev>
# Base URL used in email links (reset password). For local dev:
APP_BASE_URL=http://localhost:3000

# ============================================
# GOOGLE OAUTH CONFIGURATION
# ============================================
# Client ID from Google Cloud Console
# Used on both client and server side
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Optional Environment Variables

```env
# ============================================
# GEMINI AI (Optional - for chat features)
# ============================================
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key-here
```

### Generating Required Values

#### 1. Generate JWT Secret

**Using OpenSSL:**
```bash
openssl rand -base64 32
```

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Using Online Tool:**
- Visit [randomkeygen.com](https://randomkeygen.com/) and use a "CodeIgniter Encryption Keys" (256-bit)

#### 2. Get Google OAuth Credentials

1. **Go to Google Cloud Console:**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)

2. **Create a Project:**
   - Click "Select a project" → "New Project"
   - Enter project name (e.g., "Coinlect App")
   - Click "Create"

3. **Enable Google+ API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it

4. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure OAuth consent screen:
     - User Type: External
     - App name: Coinlect
     - User support email: your email
     - Developer contact: your email
     - Click "Save and Continue" through all steps
   - Application type: Web application
   - Name: Coinlect Web Client
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback` (for development)
     - `https://your-domain.com/api/auth/google/callback` (for production)
   - Click "Create"
   - Copy the **Client ID** (not the Client Secret)

5. **Add to Environment Variables:**
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
   GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
   ```

#### 3. Get Gemini API Key (Optional)

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. Add to `.env.local`:
   ```env
   GEMINI_API_KEY=your-api-key-here
   ```

---

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd coinlect-app
```

### Step 2: Install Dependencies

```bash
npm install
```

This will:
- Install all Node.js dependencies
- Run `prisma generate` automatically (via postinstall script)

### Step 3: Configure Environment Variables

1. Create `.env.local` file (as described above)
2. Fill in all required environment variables
3. **Important:** Never commit `.env.local` to Git (it's in `.gitignore`)

### Step 4: Set Up Database

1. Ensure PostgreSQL is running
2. Create the database (see [Database Setup](#database-setup))
3. Update `DATABASE_URL` in `.env.local`
4. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

### Step 5: Verify Prisma Client

```bash
npx prisma generate
```

This generates the Prisma Client based on your schema.

---

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

**Features in Development:**
- Hot module reloading
- Detailed error messages
- Prisma Studio available at `npx prisma studio`

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Other Useful Commands

```bash
# Run linting
npm run lint

# Open Prisma Studio (database GUI)
npx prisma studio

# View database schema
npx prisma format

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

---

## Backend Connection

### API Endpoints

The application uses Next.js API routes (located in `app/api/`). All endpoints are automatically available at:

- Base URL: `http://localhost:3000` (development) or your production URL
- API prefix: `/api`

### Available Endpoints

#### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth authentication
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

#### Courses

- `GET /api/courses` - List all courses
- `GET /api/courses/[id]` - Get course details
- `POST /api/courses` - Create course (Admin/Editor only)
- `PUT /api/courses/[id]` - Update course (Admin/Editor only)
- `GET /api/courses/[id]/modules` - Get course modules

#### Articles

- `GET /api/articles` - List all articles
- `GET /api/articles/[id]` - Get article details
- `POST /api/articles` - Create article (Admin/Editor only)

#### User Progress

- `GET /api/progress` - Get user progress
- `POST /api/progress` - Update user progress
- `POST /api/enrollments` - Enroll in a course

#### AI Chat (Optional)

- `POST /api/chat` - Chat with AI assistant (requires GEMINI_API_KEY)

### Authentication Flow

1. **User Registration/Login:**
   ```javascript
   // Register
   const response = await fetch('/api/auth/register', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email, password, name })
   });

   // Login
   const response = await fetch('/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email, password })
   });
   ```

2. **Store Tokens:**
   - Access token: Stored in localStorage (expires in 15 minutes)
   - Refresh token: Stored in localStorage (expires in 7 days)

3. **Authenticated Requests:**
   ```javascript
   const response = await fetch('/api/courses', {
     headers: {
       'Authorization': `Bearer ${accessToken}`,
       'Content-Type': 'application/json'
     }
   });
   ```

4. **Token Refresh:**
   ```javascript
   const response = await fetch('/api/auth/refresh', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ refreshToken })
   });
   ```

### Database Connection

The application uses Prisma ORM to connect to PostgreSQL:

- **Connection File:** `lib/prisma.ts`
- **Schema:** `prisma/schema.prisma`
- **Connection String:** Set via `DATABASE_URL` environment variable

**Prisma automatically:**
- Manages connection pooling
- Handles reconnections
- Provides type-safe database access

### Testing Backend Connection

1. **Test Database Connection:**
   ```bash
   npx prisma db pull
   ```
   This will verify your database connection.

2. **Test API Endpoints:**
   ```bash
   # Test health (if you add a health endpoint)
   curl http://localhost:3000/api/health

   # Test registration
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
   ```

---

## Troubleshooting

### Database Connection Issues

**Error: "Can't reach database server"**
- Verify PostgreSQL is running: `pg_isready` or `sudo systemctl status postgresql`
- Check `DATABASE_URL` format is correct
- Ensure database exists: `psql -U postgres -l`
- Check firewall settings if using remote database

**Error: "Authentication failed"**
- Verify username and password in `DATABASE_URL`
- Check PostgreSQL `pg_hba.conf` allows your connection method
- For cloud databases, ensure SSL is enabled: `?sslmode=require`

**Error: "Database does not exist"**
- Create the database: `CREATE DATABASE coinlect_db;`
- Update `DATABASE_URL` with correct database name

### Prisma Issues

**Error: "Prisma Client not generated"**
```bash
npx prisma generate
```

**Error: "Migration failed"**
```bash
# Reset and re-run migrations (WARNING: deletes data)
npx prisma migrate reset
npx prisma migrate dev
```

**Error: "Schema drift detected"**
```bash
# Pull current database schema
npx prisma db pull
# Review changes and update schema.prisma
npx prisma migrate dev
```

### Environment Variable Issues

**Error: "JWT_SECRET is not set"**
- Ensure `.env.local` exists in project root
- Verify `JWT_SECRET` is at least 32 characters
- Restart development server after adding variables

**Error: "Google Client ID not configured"**
- Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID` are set
- Ensure values match (same Client ID)
- Restart development server

**Error: "DATABASE_URL is not set"**
- Check `.env.local` file exists
- Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/db`
- No spaces around `=` in `.env.local`

### Port Already in Use

**Error: "Port 3000 is already in use"**
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or use different port
PORT=3001 npm run dev
```

### Build Errors

**Error: "Module not found"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error: "TypeScript errors"**
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

### Google OAuth Issues

**Error: "redirect_uri_mismatch"**
- Verify redirect URI in Google Cloud Console matches exactly:
  - Development: `http://localhost:3000/api/auth/google/callback`
  - Production: `https://your-domain.com/api/auth/google/callback`
- No trailing slashes
- Must match exactly (including http vs https)

**Error: "Invalid client"**
- Verify Client ID is correct in `.env.local`
- Ensure OAuth consent screen is configured
- Check that Google+ API is enabled

### Common Solutions

1. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Reset Prisma:**
   ```bash
   npx prisma migrate reset
   npx prisma migrate dev
   ```

3. **Verify all environment variables:**
   ```bash
   # Check if variables are loaded (in Node.js)
   node -e "require('dotenv').config({ path: '.env.local' }); console.log(process.env.DATABASE_URL)"
   ```

4. **Check logs:**
   - Development: Check terminal output
   - Production: Check Vercel logs or server logs

---

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)

---

## Quick Start Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL installed and running
- [ ] Database created
- [ ] `.env.local` file created with all variables
- [ ] `DATABASE_URL` configured correctly
- [ ] `JWT_SECRET` generated and set (32+ characters)
- [ ] Google OAuth credentials obtained
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID` set
- [ ] `NEXT_PUBLIC_APP_URL` set to `http://localhost:3000`
- [ ] Dependencies installed (`npm install`)
- [ ] Prisma migrations run (`npx prisma migrate dev`)
- [ ] Development server started (`npm run dev`)
- [ ] Application accessible at http://localhost:3000

---

## Support

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review error messages in terminal/console
3. Check Prisma logs: `npx prisma migrate dev --verbose`
4. Verify all environment variables are set correctly
5. Ensure database is accessible and migrations are applied

---

**Last Updated:** 2025-01-27
**Version:** 1.0.0

