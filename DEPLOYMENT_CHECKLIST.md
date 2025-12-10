# Pre-Deployment Checklist

Use this checklist before deploying to Vercel to ensure everything is configured correctly.

## ✅ Code Quality

- [x] All lint errors fixed
- [x] TypeScript compilation successful
- [x] Build completes without errors
- [x] No unused dependencies (react-router-dom removed)
- [x] All imports resolved correctly

## ✅ Configuration Files

- [x] `package.json` - Updated with postinstall script for Prisma
- [x] `next.config.ts` - Optimized for production
- [x] `.env.example` - Created with all required variables
- [x] `.gitignore` - Updated to exclude .env files
- [x] `VERCEL_DEPLOYMENT.md` - Complete deployment guide created

## ⚠️ Required Environment Variables

Before deploying, ensure these are set in Vercel:

### Critical (Required)
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `JWT_SECRET` - Strong random string (min 32 characters)
- [ ] `NEXT_PUBLIC_APP_URL` - Your Vercel deployment URL
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID (server-side)

### Email Configuration (Choose One)
- [ ] `EMAIL_PROVIDER` - `console` | `resend` | `sendgrid` | `ses`
- [ ] `EMAIL_FROM` - Sender email address
- [ ] `EMAIL_FROM_NAME` - Sender name

**If using Resend:**
- [ ] `RESEND_API_KEY`

**If using SendGrid:**
- [ ] `SENDGRID_API_KEY`

**If using Amazon SES:**
- [ ] `AWS_REGION`
- [ ] `AWS_ACCESS_KEY_ID`
- [ ] `AWS_SECRET_ACCESS_KEY`

### Optional
- [ ] `GEMINI_API_KEY` - For AI chat features

## ⚠️ Database Setup

- [ ] PostgreSQL database created
- [ ] Database connection string obtained
- [ ] Prisma migrations ready to run
- [ ] Plan for running migrations after deployment

## ⚠️ Google OAuth Setup

- [ ] Google Cloud Console project created
- [ ] OAuth 2.0 credentials created
- [ ] Authorized redirect URIs configured:
  - Production: `https://your-app.vercel.app/api/auth/google/callback`
  - Development: `http://localhost:3000/api/auth/google/callback`

## ⚠️ Pre-Deployment Steps

1. [ ] Test build locally: `npm run build`
2. [ ] Verify all environment variables documented in `.env.example`
3. [ ] Review `VERCEL_DEPLOYMENT.md` guide
4. [ ] Ensure code is committed and pushed to Git repository

## ⚠️ Post-Deployment Steps

1. [ ] Run database migrations: `npx prisma migrate deploy`
2. [ ] Verify environment variables are set in Vercel dashboard
3. [ ] Test application functionality:
   - [ ] User registration/login
   - [ ] Google OAuth
   - [ ] Newsletter subscription
   - [ ] Admin dashboard access
4. [ ] Check application logs in Vercel dashboard
5. [ ] Verify email sending works (test newsletter)

## 📝 Notes

- The build process automatically runs `prisma generate` via the `postinstall` script
- Database migrations must be run manually after first deployment
- All environment variables should be set before deployment
- Google OAuth redirect URIs must match your deployment URL exactly

## 🚨 Common Issues

**Build fails:**
- Check that all environment variables are set
- Verify `DATABASE_URL` format is correct
- Ensure Prisma schema is valid

**Database connection errors:**
- Verify `DATABASE_URL` is correct
- Check database allows connections from Vercel
- Ensure database is accessible (not behind firewall)

**OAuth not working:**
- Verify redirect URIs match exactly
- Check both `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID` are set
- Ensure OAuth consent screen is configured

**Email not sending:**
- Verify email provider credentials are correct
- Check `EMAIL_PROVIDER` matches your provider
- Test with `EMAIL_PROVIDER=console` first for debugging

