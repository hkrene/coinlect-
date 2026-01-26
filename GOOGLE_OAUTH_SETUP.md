# Google OAuth Setup Guide

## Fixing "redirect_uri_mismatch" Error

If you're seeing the error:
```
Error 400: redirect_uri_mismatch
Access blocked: This app's request is invalid
```

This means the redirect URI is not registered in your Google Cloud Console OAuth client configuration.

## Step-by-Step Fix

### 1. Identify Your Redirect URI

The redirect URI format is:
- **Development**: `http://localhost:3000/api/auth/google/callback`
- **Production**: `https://your-domain.com/api/auth/google/callback`

Check your browser console (in development) to see the exact redirect URI being used.

### 2. Add Redirect URI to Google Cloud Console

1. **Go to Google Cloud Console:**
   - Visit [https://console.cloud.google.com](https://console.cloud.google.com)
   - Select your project

2. **Navigate to OAuth Credentials:**
   - Go to **APIs & Services** → **Credentials**
   - Find your OAuth 2.0 Client ID (the one matching your `NEXT_PUBLIC_GOOGLE_CLIENT_ID`)
   - Click on it to edit

3. **Add Authorized Redirect URIs:**
   - Scroll down to **Authorized redirect URIs**
   - Click **+ ADD URI**
   - Add the exact redirect URI:
     - For development: `http://localhost:3000/api/auth/google/callback`
     - For production: `https://your-production-domain.com/api/auth/google/callback`
   - **Important**: The URI must match **exactly** (including `http://` vs `https://`, port numbers, trailing slashes, etc.)

4. **Save Changes:**
   - Click **SAVE** at the bottom
   - Wait a few minutes for changes to propagate (can take up to 5 minutes)

### 3. Verify Configuration

After saving, try the Google Sign-In again. The error should be resolved.

## Common Issues

### Issue: Still getting redirect_uri_mismatch after adding URI

**Solutions:**
- Double-check the URI matches **exactly** (case-sensitive, no trailing slashes)
- Wait 2-5 minutes for Google's servers to update
- Clear browser cache and try again
- Verify you're editing the correct OAuth client (check the Client ID matches your `.env` file)

### Issue: Different ports or domains

If you're running on a different port (e.g., `localhost:3001`), make sure to add that specific URI:
- `http://localhost:3001/api/auth/google/callback`

For production, ensure your production domain is added:
- `https://your-actual-domain.com/api/auth/google/callback`

### Issue: Multiple environments

You can add multiple redirect URIs:
- `http://localhost:3000/api/auth/google/callback` (development)
- `http://localhost:3001/api/auth/google/callback` (alternative dev port)
- `https://staging.yourdomain.com/api/auth/google/callback` (staging)
- `https://yourdomain.com/api/auth/google/callback` (production)

## Required Redirect URIs

Based on your setup, you should have at least:

1. **Development:**
   ```
   http://localhost:3000/api/auth/google/callback
   ```

2. **Production (if deployed):**
   ```
   https://your-production-domain.com/api/auth/google/callback
   ```

## Additional Notes

- **OAuth Consent Screen**: Make sure your OAuth consent screen is configured (APIs & Services → OAuth consent screen)
- **Client ID vs Client Secret**: 
  - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` = Client ID (public, used in frontend)
  - `GOOGLE_CLIENT_ID` = Client ID (used in backend, same as above)
  - `GOOGLE_CLIENT_SECRET` = Client Secret (private, backend only)
- **Testing**: After adding URIs, wait a few minutes before testing to ensure Google's servers have updated

## Quick Checklist

- [ ] Redirect URI added to Google Cloud Console
- [ ] URI matches exactly (including protocol, port, path)
- [ ] Changes saved in Google Cloud Console
- [ ] Waited 2-5 minutes for propagation
- [ ] Cleared browser cache (if needed)
- [ ] Verified correct OAuth client is being used
- [ ] OAuth consent screen is configured
