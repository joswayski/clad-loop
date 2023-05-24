### Make sure to set ENV vars in .env.local

NEXT_PUBLIC_SUPABASE_URL="https://YOURURL.supabase.co.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="superlongkeyhere"

## Root Cause

`middleware.ts` redirecting to /dashboard when on /dashboard causes infinite loop

Can also be triggered by a redirect after logging in to the dashboard which will crash the browser on that page
