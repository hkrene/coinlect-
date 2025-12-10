# Newsletter System Documentation

## Overview

A complete newsletter management system with subscriber management, campaign creation, email delivery, and analytics.

## Features

### 1. Subscriber Management
- Email-based subscriptions with explicit opt-in
- Subscription status tracking (ACTIVE, UNSUBSCRIBED)
- Subscription source tracking (DASHBOARD, WEBSITE, COURSE_SIGNUP)
- Support for email-only subscribers and user-linked subscriptions

### 2. Newsletter Campaigns
- Admin CRUD for campaigns
- Campaign fields:
  - Title
  - Subject
  - HTML content
  - Plain-text fallback
  - Status (DRAFT, SCHEDULED, SENT)
  - Scheduled send timestamp
- Batch sending with delivery tracking
- Prevents duplicate sends

### 3. Email Delivery
- Provider-agnostic abstraction layer
- Supported providers:
  - **Console** (development/testing)
  - **Resend** (production)
  - **SendGrid** (production)
  - **Amazon SES** (production - requires AWS SDK)
- Provider selection via `EMAIL_PROVIDER` environment variable

### 4. Unsubscribe Flow
- Secure, tokenized unsubscribe links
- One-click unsubscribe endpoint (no auth required)
- Idempotent unsubscribe behavior
- Clear confirmation UI

### 5. Analytics & Tracking
- Per-campaign analytics:
  - Emails sent count
  - Successful delivery count
  - Open tracking support
  - Failed delivery tracking

## Database Schema

### NewsletterSubscriber
- `id`: UUID
- `email`: String (unique)
- `status`: ACTIVE | UNSUBSCRIBED
- `source`: DASHBOARD | WEBSITE | COURSE_SIGNUP
- `userId`: Optional link to User
- `subscribedAt`: DateTime
- `unsubscribedAt`: DateTime?
- `unsubscribeToken`: UUID (unique, for secure unsubscribe links)

### NewsletterCampaign
- `id`: UUID
- `title`: String
- `subject`: String
- `htmlContent`: Text
- `plainTextContent`: Text?
- `status`: DRAFT | SCHEDULED | SENT
- `scheduledAt`: DateTime?
- `sentAt`: DateTime?

### CampaignSendLog
- `id`: UUID
- `campaignId`: UUID (FK)
- `subscriberId`: UUID (FK)
- `status`: PENDING | SENT | FAILED | BOUNCED
- `sentAt`: DateTime?
- `openedAt`: DateTime?
- `errorMessage`: String?

## API Routes

### Public Routes
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `GET /api/newsletter/unsubscribe/[token]` - Get unsubscribe info
- `POST /api/newsletter/unsubscribe/[token]` - Unsubscribe

### Admin Routes (Require Authentication)
- `GET /api/newsletter/subscribers` - List subscribers (with filters)
- `GET /api/newsletter/campaigns` - List campaigns
- `POST /api/newsletter/campaigns` - Create campaign
- `GET /api/newsletter/campaigns/[id]` - Get campaign details
- `PATCH /api/newsletter/campaigns/[id]` - Update campaign
- `DELETE /api/newsletter/campaigns/[id]` - Delete campaign (DRAFT only)
- `POST /api/newsletter/campaigns/[id]/send` - Send campaign

## Environment Variables

```env
# Email Provider Configuration
EMAIL_PROVIDER=console  # console | resend | sendgrid | ses
EMAIL_FROM=noreply@coinlect.com
EMAIL_FROM_NAME=Coinlect

# Resend (if using Resend)
RESEND_API_KEY=your_resend_api_key

# SendGrid (if using SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key

# Amazon SES (if using SES)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# App URL (for unsubscribe links)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google OAuth (for authentication)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_ID=your_google_client_id
```

## Setup Instructions

### 1. Database Migration

Run Prisma migrations to create the newsletter tables:

```bash
npx prisma migrate dev --name add_newsletter_system
```

### 2. Configure Email Provider

Choose your email provider and set the appropriate environment variables in `.env.local`:

**For Development (Console):**
```env
EMAIL_PROVIDER=console
```

**For Production (Resend):**
```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Your App Name
```

### 3. Configure Google OAuth

1. Create a Google OAuth 2.0 Client ID in Google Cloud Console
2. Add authorized redirect URIs:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
3. Set environment variables:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

## Usage

### Subscribing to Newsletter

**Public Component:**
```tsx
import { NewsletterSubscribe } from '@/components/NewsletterSubscribe';

<NewsletterSubscribe source="WEBSITE" />
```

**API Call:**
```typescript
const res = await fetch('/api/newsletter/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    source: 'WEBSITE', // or 'DASHBOARD' or 'COURSE_SIGNUP'
    userId: 'optional-user-id',
  }),
});
```

### Creating a Campaign

1. Navigate to `/admin/newsletter`
2. Click "Create Campaign"
3. Fill in title, subject, and HTML content
4. Use `{{UNSUBSCRIBE_URL}}` placeholder for unsubscribe link
5. Save as draft or schedule for later

### Sending a Campaign

1. Go to campaign detail page
2. Click "Send Now" (for drafts)
3. Campaign will be sent to all active subscribers
4. Track delivery status in campaign analytics

### Unsubscribe Flow

1. Each email includes an unsubscribe link: `{{UNSUBSCRIBE_URL}}`
2. Link format: `/unsubscribe/[token]`
3. User clicks link → confirmation page → unsubscribe

## UI Components

### Admin Dashboard
- `/admin/newsletter` - Main dashboard with stats and campaign/subscriber lists
- `/admin/newsletter/campaigns/new` - Create new campaign
- `/admin/newsletter/campaigns/[id]` - View/edit campaign

### Public Pages
- `/unsubscribe/[token]` - Unsubscribe confirmation page
- Newsletter subscription form component (can be added anywhere)

## Security Considerations

1. **Unsubscribe Tokens**: Each subscriber has a unique UUID token for secure unsubscribe links
2. **Admin Routes**: All admin routes require authentication and admin/editor role
3. **Email Provider Keys**: Never expose API keys to client-side code
4. **Rate Limiting**: Consider adding rate limiting for send endpoints in production
5. **Email Validation**: Server-side validation for all email inputs

## Testing

### Test Email Send
```typescript
// Send test email before full send
const res = await fetch(`/api/newsletter/campaigns/${campaignId}/send`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    testEmail: 'test@example.com',
  }),
});
```

## Troubleshooting

### Emails Not Sending
1. Check `EMAIL_PROVIDER` environment variable
2. Verify API keys are set correctly
3. Check email provider dashboard for errors
4. Review server logs for error messages

### Google OAuth Not Working
1. Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set
2. Check authorized redirect URIs in Google Console
3. Ensure Google Identity Services script loads correctly

### Database Errors
1. Run `npx prisma generate` to regenerate Prisma client
2. Run `npx prisma migrate dev` to apply migrations
3. Check database connection string in `.env.local`

