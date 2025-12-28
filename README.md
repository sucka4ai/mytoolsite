# ConvertPro - File Conversion Platform

A subscription-based file conversion tools website with Google AdSense integration for revenue generation.

## Features

- **File Conversion Tools**: Convert documents, images, and media files between formats
- **Two-Tier System**:
  - **Free Plan**: 5 conversions/day, 10MB max file size, ad-supported
  - **Premium Plan**: Unlimited conversions, 100MB max file size, ad-free, $9.99/month
- **Authentication**: Supabase-powered user authentication with email/password
- **Stripe Integration**: Subscription management and billing
- **Google AdSense**: Monetization through ads for free users
- **Conversion History**: Track all file conversions with timestamps

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe Checkout & Billing Portal
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Analytics**: Vercel Analytics

## Setup Instructions

### 1. Database Setup

The database schema is automatically created when you run the SQL scripts:

- `scripts/001_create_users_and_subscriptions.sql` - Creates tables and RLS policies
- `scripts/002_create_profile_trigger.sql` - Auto-creates profiles on signup

These scripts will run automatically in the v0 environment.

### 2. Google AdSense Setup

To enable Google AdSense ads:

1. Sign up for Google AdSense at https://www.google.com/adsense
2. Get your Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
3. Update the following files with your Publisher ID:
   - `components/ad-script.tsx`
   - `components/ad-banner.tsx`
4. Create ad units in AdSense and update the slot IDs in your components

### 3. Stripe Webhook Setup

For production deployment:

1. Set up a Stripe webhook endpoint at `/api/webhooks/stripe`
2. Add the webhook signing secret as `STRIPE_WEBHOOK_SECRET` environment variable
3. Subscribe to these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

## Environment Variables

All required environment variables are already configured in this v0 project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET` (add this when deploying)
- `NEXT_PUBLIC_SITE_URL` (optional, defaults to localhost:3000)

## Key Features Implementation

### Ad Display Logic

Ads are only shown to free users:
- AdBanner component checks user subscription status
- Premium users see no ads
- Ads appear on the file conversion tools page and landing page

### Conversion Limits

Free users have daily limits enforced in the API:
- Maximum 5 conversions per day
- File size limited to 10MB
- Full conversion history tracked in database

### Subscription Flow

1. User signs up (gets free plan by default via trigger)
2. User upgrades via Stripe Checkout
3. Webhook updates subscription status
4. User gains premium features immediately
5. User can manage subscription via Stripe Billing Portal

## File Structure

```
app/
  ├── actions/stripe.ts          # Stripe server actions
  ├── api/
  │   ├── convert/route.ts       # File conversion API
  │   └── webhooks/stripe/route.ts # Stripe webhook handler
  ├── auth/                      # Authentication pages
  ├── checkout/                  # Stripe checkout flow
  ├── dashboard/                 # User dashboard
  ├── pricing/                   # Pricing page
  └── tools/                     # Conversion tools
components/
  ├── ad-banner.tsx             # Google AdSense banner
  ├── ad-script.tsx             # AdSense script loader
  ├── conversion-history.tsx    # Conversion history display
  ├── file-uploader.tsx         # File upload & conversion UI
  └── tools-client.tsx          # Tools page client component
lib/
  ├── products.ts               # Subscription plans config
  ├── stripe.ts                 # Stripe client
  └── supabase/                 # Supabase clients
scripts/
  ├── 001_create_users_and_subscriptions.sql
  └── 002_create_profile_trigger.sql
```

## Revenue Model

1. **Free Users**: Generate revenue through Google AdSense ads
2. **Premium Users**: Direct subscription revenue ($9.99/month via Stripe)
3. **Conversion**: Free users are encouraged to upgrade for:
   - No ads
   - Unlimited conversions
   - Larger file sizes (100MB vs 10MB)
   - Priority support

## Next Steps

1. **Replace AdSense Placeholder**: Update Publisher ID in ad components
2. **Implement Real File Conversion**: The current conversion API is a demo - integrate actual conversion libraries
3. **Add More File Formats**: Extend support for additional file types
4. **Batch Conversions**: Implement batch conversion feature for premium users
5. **Analytics Dashboard**: Add detailed analytics for admins
6. **Email Notifications**: Send conversion completion emails
