<div align="center">
<img width="1200" height="475" alt="Coinlect logo" src="https://res.cloudinary.com/drsd8adkq/image/upload/v1765185502/clclogo_p2v5bp.jpg" />
</div>

# Coinlect - Crypto Learning Platform

A Next.js application for crypto education, community learning, and Web3 onboarding.

## Open Source & Community

Coinlect welcomes contributions from developers, educators, and crypto enthusiasts.

- Contribution guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- License: [LICENSE](./LICENSE)
- Environment template: [.env.example](./.env.example)

We follow a pull-request workflow with maintainer review and approval. Direct pushes to `main` are not allowed.

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment template and update your local values:
   ```bash
   cp .env.example .env.local
   ```

3. Set your local environment variables in `.env.local` (including `GEMINI_API_KEY` and your PostgreSQL connection string):
   ```bash
   DATABASE_URL=postgresql://username:password@localhost:5432/coinlect_db
   JWT_SECRET=your-super-secret-jwt-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GEMINI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Backend Setup

Coinlect is designed to run with a PostgreSQL database and environment variables supplied at runtime. For an open-source repo, the backend configuration stays private and should never be committed to Git.

Typical setup:
1. Provision a PostgreSQL database.
2. Copy [.env.example](./.env.example) to `.env.local` and fill in your values.
3. Run Prisma migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
4. Start the app with your local or deployment environment secrets loaded.

Production deployment options:
- Vercel or similar hosting for the Next.js app
- Managed PostgreSQL database (for example Neon, Supabase, Railway, or a standard Postgres provider)
- Platform environment variables or secret manager for `DATABASE_URL`, `JWT_SECRET`, OAuth credentials, and `GEMINI_API_KEY`

Do not commit real credentials, API keys, or database URLs. Keep them in `.env.local` for local development and in your hosting platform's secret store for production.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NEXT_PUBLIC_APP_URL` - Your application URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID for the frontend
- `GOOGLE_CLIENT_ID` - Google OAuth client ID for server-side auth flows
- `GEMINI_API_KEY` - API key for the AI chat functionality

See [.env.example](./.env.example) for the full template.

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
