<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Coinlect - Crypto Learning Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

A Next.js application for crypto education and community.
</div>

## Run Locally

**Prerequisites:**  Node.js 18+


1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

Quick steps:
1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Configure environment variables (see `.env.example`)
4. Run database migrations
5. Deploy!

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NEXT_PUBLIC_APP_URL` - Your application URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (server-side)

See `.env.example` for all available options.

## Database Setup

1. Create a PostgreSQL database
2. Run migrations:
   ```bash
   npx prisma migrate dev
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **React Context** - State management (Theme, Auth, Language)
