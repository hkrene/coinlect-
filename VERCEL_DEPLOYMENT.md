# Vercel Deployment Guide

This guide will help you deploy the Coinlect application to Vercel.

## Prerequisites

1. A Vercel account ([vercel.com](https://vercel.com))
2. A PostgreSQL database (recommended: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or [Neon](https://neon.tech))
3. Google OAuth credentials (for authentication)
4. Email service credentials (Resend, SendGrid, or AWS SES)

## Step 1: Prepare Your Repository

1. Ensure all code is committed and pushed to your Git repository (GitHub, GitLab, or Bitbucket)
2. Verify the build works locally:
   ```bash
   npm run build
   ```

## Step 2: Set Up Database

### Option A: Vercel Postgres (Recommended)

1. In your Vercel project dashboard, go to **Storage**
2. Click **Create Database** → Select **Postgres**
3. Copy the connection string (it will be automatically added as `POSTGRES_URL`)

### Option B: External Database (Neon, Supabase, etc.)

1. Create a PostgreSQL database with your provider
2. Copy the connection string
3. You'll add this as `DATABASE_URL` in Vercel environment variables

### Run Migrations

After setting up the database, run Prisma migrations:

```bash
# Locally (if you have DATABASE_URL set)
npx prisma migrate deploy

# Or use Vercel CLI
vercel env pull
npx prisma migrate deploy
```

## Step 3: Deploy to Vercel

### Via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Vercel will auto-detect Next.js
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

### Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

## Step 4: Configure Environment Variables

In your Vercel project dashboard, go to **Settings** → **Environment Variables** and add:

### Required Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Application URL (your Vercel domain)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Email Configuration

Choose one email provider:

**For Resend:**
```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Coinlect
```

**For SendGrid:**
```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxx
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Coinlect
```

**For Amazon SES:**
```env
EMAIL_PROVIDER=ses
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Coinlect
```

**For Development/Testing:**
```env
EMAIL_PROVIDER=console
```

### Optional Variables

```env
# Gemini AI (for chat features)
GEMINI_API_KEY=your-gemini-api-key
```

## Step 5: Run Database Migrations

After deployment, you need to run Prisma migrations:

### Option 1: Vercel CLI

```bash
vercel env pull .env.local
npx prisma migrate deploy
```

### Option 2: Vercel Postgres Console

If using Vercel Postgres, you can run migrations via the Vercel dashboard or use the Vercel CLI.

### Option 3: Add to Build Script

You can also add migrations to your build process by updating `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

**Note:** This requires `DATABASE_URL` to be available during build time.

## Step 6: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `https://your-app.vercel.app/api/auth/google/callback`
   - `http://localhost:3000/api/auth/google/callback` (for local dev)
4. Copy the Client ID and add it to Vercel environment variables

## Step 7: Verify Deployment

1. Visit your deployed URL: `https://your-app.vercel.app`
2. Test key features:
   - User registration/login
   - Google OAuth
   - Newsletter subscription
   - Admin dashboard (if you have admin users)

## Step 8: Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `DATABASE_URL` is correct
- Check that Prisma client is generated (`prisma generate`)

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check database allows connections from Vercel IPs
- For Vercel Postgres, ensure the database is in the same region

### Environment Variables Not Working

- Ensure variables are set for the correct environment (Production, Preview, Development)
- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)

### Prisma Client Not Found

- Ensure `postinstall` script runs: `"postinstall": "prisma generate"`
- Check that `@prisma/client` is in dependencies
- Verify Prisma schema is valid

## Post-Deployment Checklist

- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] Google OAuth working
- [ ] Email service configured and tested
- [ ] Admin user created (if needed)
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Analytics/monitoring set up (optional)

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

