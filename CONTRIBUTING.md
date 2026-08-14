# Contributing to Coinlect

Thank you for your interest in contributing to Coinlect, the Web3 & Crypto learning platform built with Next.js 15, Prisma, and PostgreSQL.

This project is open source and welcomes thoughtful improvements, bug fixes, features, documentation updates, and community-driven ideas.

By contributing, you agree that your work will be published under the project's MIT License.

## Code of Conduct

We expect contributors to be respectful, constructive, and collaborative. Please keep discussions focused on the project, the codebase, and the goals of improving Coinlect for the broader learning community.

## Ways to Contribute

You can contribute by:

- Reporting bugs and edge cases
- Improving documentation
- Fixing frontend or backend issues
- Adding or refining course, article, or community features
- Improving accessibility, performance, and security
- Suggesting enhancements and product improvements
- Reviewing pull requests and participating in design discussions

## Getting Started

### 1. Fork and clone the repository

```bash
git clone https://github.com/<your-username>/coinlect.git
cd coinlect
```

If you are contributing to the main project repository rather than a fork, make sure you have proper repository access and follow the maintainers' branch conventions.

### 2. Install dependencies

This project uses npm.

```bash
npm install
```

### 3. Create a feature branch

Use a descriptive branch name that reflects the change:

```bash
git checkout -b feature/add-course-progress-tracking
git checkout -b fix/login-session-refresh
git checkout -b docs/contribution-guide
```

Keep branch names concise and specific.

## Local Environment Setup

Before running the app locally, copy the example environment file and configure your local values:

```bash
cp .env.example .env.local
```

Then update the placeholders in `.env.local` with your local credentials, including:

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_ID`
- `GEMINI_API_KEY`

If you are using PostgreSQL locally, make sure your database is running and the connection string is valid.

### Local development run

```bash
npm run dev
```

If you need to generate the Prisma client after installation or schema changes:

```bash
npx prisma generate
```

## Database Setup and Migrations

This project uses Prisma with PostgreSQL.

### Create or update the database schema

After making Prisma schema changes, generate and apply migration files:

```bash
npx prisma migrate dev
```

If you want to name the migration explicitly:

```bash
npx prisma migrate dev --name add_new_feature
```

### Useful Prisma commands

```bash
npx prisma generate
npx prisma studio
npx prisma db push
```

Please ensure migration files are included in your PR when schema changes are introduced.

## Development Workflow

### Recommended flow

1. Fork the repository and create your branch.
2. Install dependencies with `npm install`.
3. Configure `.env.local` using `.env.example`.
4. Run the app locally.
5. Make a focused change with tests or verification when applicable.
6. Update docs or comments if the behavior changes.
7. Run relevant checks before opening a PR.
8. Submit a PR with a clear description and verification notes.

### Validation

Before submitting a PR, run relevant checks such as:

```bash
npm run lint
npm run build
```

If your change affects the database, make sure Prisma migrations are correctly generated and that the schema remains valid.

## Pull Request Rules

The repository enforces the following pull request rules:

- Direct pushes to `main` are disabled.
- All changes must be submitted through a pull request.
- Every PR requires maintainer review and approval before merge.
- PR titles should be clear and descriptive.
- PR descriptions should include:
  - a summary of the change
  - the reasoning behind it
  - testing or verification performed
  - any relevant screenshots or links
  - migration requirements when applicable

Maintainers may request changes before approval. Please be prepared to revise your PR based on feedback.

## Coding Standards

Please follow these conventions to keep the codebase consistent and maintainable:

- Use TypeScript for application logic and UI code.
- Prefer clear, self-documenting names and straightforward implementations.
- Keep components and functions focused and reasonably small.
- Match the existing project structure and naming conventions.
- Avoid introducing unnecessary dependencies.
- Use async/await consistently for database and network operations.
- Handle errors gracefully and avoid leaking sensitive details in logs or user-facing responses.
- Preserve existing patterns unless a change clearly improves the codebase.

### Frontend conventions

- Prefer React Server Components where appropriate.
- Keep client-side logic isolated to the necessary components and hooks.
- Ensure pages and components remain readable and maintainable.

### Backend conventions

- Validate inputs before writing to the database.
- Use Prisma queries responsibly and avoid redundant database calls.
- Keep security-sensitive logic under review.

## Security and Secrets

Never commit secrets, API keys, or environment data to the repository.

This includes:

- `DATABASE_URL` values with credentials
- JWT secrets
- Google OAuth client secrets or tokens
- Gemini API keys
- Email provider API keys
- Private keys or internal deployment credentials

Before committing, check for accidental exposure in:

- `.env` files
- `.env.local`
- logs
- screenshots or copied terminal output
- configuration files or docs with real credentials

If a credential is accidentally committed, rotate it immediately and remove it from the repository history through the appropriate cleanup process.

## Commit Guidance

We recommend small, reviewable commits with clear messages. Good examples:

```bash
git commit -m "feat: add user profile onboarding flow"
git commit -m "fix: correct JWT validation for expired tokens"
git commit -m "docs: expand local setup instructions"
```

## Licensing

By contributing to Coinlect, you agree that your contributions will fall under the project's MIT License.

This project is distributed under the MIT License. See the repository's `LICENSE` file for full details.

## Need Help?

If you are unsure about the right approach, open a discussion or ask a maintainer before making larger changes. Clear communication helps keep the project healthy and makes it easier to review contributions.

Thank you for helping build Coinlect.
