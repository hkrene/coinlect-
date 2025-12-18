# Prisma Accelerate Configuration Guide

## Database Credentials

Your Prisma Accelerate and PostgreSQL database have been configured. Use the following credentials:

### Environment Variables

Add these to your `.env.local` file:

```env
# ============================================
# DATABASE CONFIGURATION (Prisma Accelerate)
# ============================================

# Prisma Accelerate URL - Used for database queries with connection pooling
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza192ck9VZ1dBVHFKcGo0dEo3R29DVEEiLCJhcGlfa2V5IjoiMDFLQ003U1BHWkoyTjRYSzcyRUtFUlo5MzIiLCJ0ZW5hbnRfaWQiOiI0N2ZhYWM1MDJkYzZmZWVlNjE5YWIwYzY2MTY4NTVhNzExYjgxNDcxZjE0MzRmMGUyNWRmMDI0MzdiZjQ4NGQxIiwiaW50ZXJuYWxfc2VjcmV0IjoiZWM5YTMzNGUtMDI2OS00MDExLWFiYTYtZDA0YmYwNjllNWE2In0.RqHfkqlFDLq9aCXi9Ra9MDstJvbGoJolsldPrFabAxA"

# Direct PostgreSQL URL - Used for migrations only
POSTGRES_URL="postgres://47faac502dc6feee619ab0c6616855a711b81471f1434f0e25df02437bf484d1:sk_vrOUgWATqJpj4tJ7GoCTA@db.prisma.io:5432/postgres?sslmode=require"

# ============================================
# OTHER REQUIRED VARIABLES
# ============================================

# JWT Secret - Generate using: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google OAuth (if using)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Gemini AI (optional)
GEMINI_API_KEY=your-gemini-api-key-here
```

## What Changed

### 1. Prisma Schema (`prisma/schema.prisma`)
- Updated for Prisma 7.x compatibility
- Removed `url` and `directUrl` from schema (now in config file)
- Clean datasource configuration with only provider specified

### 2. Prisma Configuration (`prisma/prisma.config.ts`)
- **NEW FILE** - Created for Prisma 7.x
- Configures database URLs for Accelerate and direct connections
- Separates configuration from schema for better security

### 3. Prisma Client (`lib/prisma.ts`)
- Added `@prisma/extension-accelerate` integration
- Updated to use `datasourceUrl` parameter
- Optimized logging for development and production
- Configured connection pooling via Accelerate extension

### 4. Environment Configuration
- Created `.env.example` with template for all required variables
- Configured for Prisma Accelerate production setup

### 5. Dependencies
- Added `@prisma/extension-accelerate` package
- Updated to Prisma 7.1.0

## Setup Instructions

### 1. Update Environment Variables

Create or update your `.env.local` file in the project root with the credentials above:

```bash
# In the project root directory
nano .env.local  # or use your preferred editor
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

This generates the Prisma Client based on your schema with Accelerate support.

### 3. Run Database Migrations

```bash
npx prisma migrate deploy
```

Or for development:

```bash
npx prisma migrate dev
```

### 4. Verify Database Connection

Test your database connection:

```bash
npx prisma db pull
```

### 5. View Database (Optional)

Open Prisma Studio to view your database:

```bash
npx prisma studio
```

## Benefits of Prisma Accelerate

1. **Global Edge Caching** - Faster query responses
2. **Connection Pooling** - Efficient database connections
3. **Scalability** - Handles high traffic loads
4. **Built-in Caching** - Automatic query result caching

## Troubleshooting

### Connection Issues

If you encounter connection issues:

1. Verify `DATABASE_URL` and `POSTGRES_URL` are correctly set
2. Check that SSL mode is enabled (`?sslmode=require`)
3. Ensure the Accelerate API key is valid

### Migration Errors

If migrations fail:

```bash
# Check current migration status
npx prisma migrate status

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Apply migrations
npx prisma migrate deploy
```

### Cache Issues

Prisma Accelerate caches queries by default. To bypass cache:

```typescript
// In your API routes
const result = await prisma.user.findMany({
  cacheStrategy: { ttl: 60 }, // Cache for 60 seconds
});
```

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add `DATABASE_URL` to environment variables
2. Add `POSTGRES_URL` to environment variables
3. Add all other required environment variables
4. The build process will automatically run `prisma generate`

## Additional Resources

- [Prisma Accelerate Documentation](https://www.prisma.io/docs/accelerate)
- [Prisma Migration Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Connection Pooling Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

---

**Configuration Date:** 2025-12-17
**Prisma Version:** 7.1.0
