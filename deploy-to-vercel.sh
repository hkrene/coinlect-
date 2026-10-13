#!/bin/bash

# Coinlect App - Vercel Deployment Script
# This script helps deploy the frontend, backend, and database to Vercel

set -e

echo "🚀 Coinlect App - Vercel Deployment"
echo "===================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

echo ""
echo "📋 Step 1: Setting up Vercel Postgres Database"
echo "================================================"
echo "⚠️  Database must be created via Vercel Dashboard:"
echo "   1. Go to: https://vercel.com/dashboard"
echo "   2. Select your project: coinlect-app"
echo "   3. Go to Storage tab"
echo "   4. Click 'Create Database' → Select 'Postgres'"
echo "   5. Name it: coinlect-db"
echo "   6. Copy the connection strings (POSTGRES_URL and DATABASE_URL)"
echo ""
read -p "Press Enter once you've created the database and have the connection strings..."

echo ""
echo "📝 Step 2: Adding Environment Variables"
echo "========================================"
echo "We'll add the required environment variables now."
echo ""

# Generate JWT secret if not provided
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "Generated JWT_SECRET: $JWT_SECRET"
fi

# Get database URL
read -p "Enter DATABASE_URL (from Vercel Postgres): " DATABASE_URL
read -p "Enter POSTGRES_URL (from Vercel Postgres): " POSTGRES_URL

# Get app URL
read -p "Enter your Vercel app URL (e.g., https://coinlect-app.vercel.app): " APP_URL

# Get Google OAuth credentials
read -p "Enter NEXT_PUBLIC_GOOGLE_CLIENT_ID: " GOOGLE_CLIENT_ID
read -p "Enter GOOGLE_CLIENT_SECRET (optional, press Enter to skip): " GOOGLE_CLIENT_SECRET

# Get Gemini API key (optional)
read -p "Enter GEMINI_API_KEY (optional, press Enter to skip): " GEMINI_API_KEY

# Resend (transactional email). REQUIRED for signup confirmation and password
# reset emails — without it those flows fail with "the confirmation email could
# not be sent".
read -p "Enter RESEND_API_KEY (required for email verification): " RESEND_API_KEY
read -p "Enter RESEND_FROM (optional, e.g. 'Coinlect <hello@yourdomain>'): " RESEND_FROM

# Get Cloudflare Turnstile keys (optional but recommended — bot/CAPTCHA protection)
read -p "Enter NEXT_PUBLIC_TURNSTILE_SITE_KEY (optional, press Enter to skip): " TURNSTILE_SITE_KEY
read -p "Enter TURNSTILE_SECRET_KEY (optional, press Enter to skip): " TURNSTILE_SECRET_KEY

echo ""
echo "Adding environment variables to Vercel..."

# Add environment variables
vercel env add DATABASE_URL production <<< "$DATABASE_URL"
vercel env add POSTGRES_URL production <<< "$POSTGRES_URL"
vercel env add JWT_SECRET production <<< "$JWT_SECRET"
vercel env add NEXT_PUBLIC_APP_URL production <<< "$APP_URL"
vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID production <<< "$GOOGLE_CLIENT_ID"
vercel env add GOOGLE_CLIENT_ID production <<< "$GOOGLE_CLIENT_ID"

if [ ! -z "$GOOGLE_CLIENT_SECRET" ]; then
    vercel env add GOOGLE_CLIENT_SECRET production <<< "$GOOGLE_CLIENT_SECRET"
fi

if [ ! -z "$GEMINI_API_KEY" ]; then
    vercel env add GEMINI_API_KEY production <<< "$GEMINI_API_KEY"
fi

if [ ! -z "$TURNSTILE_SITE_KEY" ]; then
    vercel env add NEXT_PUBLIC_TURNSTILE_SITE_KEY production <<< "$TURNSTILE_SITE_KEY"
fi

if [ ! -z "$TURNSTILE_SECRET_KEY" ]; then
    vercel env add TURNSTILE_SECRET_KEY production <<< "$TURNSTILE_SECRET_KEY"
fi

# Use printf (no trailing newline) for secrets that must be byte-exact.
if [ ! -z "$RESEND_API_KEY" ]; then
    printf '%s' "$RESEND_API_KEY" | vercel env add RESEND_API_KEY production
fi

if [ ! -z "$RESEND_FROM" ]; then
    printf '%s' "$RESEND_FROM" | vercel env add RESEND_FROM production
fi

# Also add to preview and development
vercel env add DATABASE_URL preview <<< "$DATABASE_URL"
vercel env add POSTGRES_URL preview <<< "$POSTGRES_URL"
vercel env add JWT_SECRET preview <<< "$JWT_SECRET"
vercel env add NEXT_PUBLIC_APP_URL preview <<< "$APP_URL"
vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID preview <<< "$GOOGLE_CLIENT_ID"
vercel env add GOOGLE_CLIENT_ID preview <<< "$GOOGLE_CLIENT_ID"

if [ ! -z "$GOOGLE_CLIENT_SECRET" ]; then
    vercel env add GOOGLE_CLIENT_SECRET preview <<< "$GOOGLE_CLIENT_SECRET"
fi

if [ ! -z "$GEMINI_API_KEY" ]; then
    vercel env add GEMINI_API_KEY preview <<< "$GEMINI_API_KEY"
fi

if [ ! -z "$TURNSTILE_SITE_KEY" ]; then
    vercel env add NEXT_PUBLIC_TURNSTILE_SITE_KEY preview <<< "$TURNSTILE_SITE_KEY"
fi

if [ ! -z "$TURNSTILE_SECRET_KEY" ]; then
    vercel env add TURNSTILE_SECRET_KEY preview <<< "$TURNSTILE_SECRET_KEY"
fi

if [ ! -z "$RESEND_API_KEY" ]; then
    printf '%s' "$RESEND_API_KEY" | vercel env add RESEND_API_KEY preview
fi

if [ ! -z "$RESEND_FROM" ]; then
    printf '%s' "$RESEND_FROM" | vercel env add RESEND_FROM preview
fi

echo ""
echo "✅ Environment variables added!"
echo ""

echo "📦 Step 3: Deploying to Vercel"
echo "==============================="
vercel deploy --prod

echo ""
echo "🗄️  Step 4: Running Database Migrations"
echo "========================================"
echo "Pulling environment variables..."
vercel env pull .env.local

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Visit your app: $APP_URL"
echo "   2. Test user registration/login"
echo "   3. Test Google OAuth"
echo "   4. Create an admin user if needed"
echo ""
echo "🔗 Useful Links:"
echo "   - Vercel Dashboard: https://vercel.com/dashboard"
echo "   - Project Settings: https://vercel.com/dashboard/hirwarene6-8663s-projects/coinlect-app/settings"
echo ""
