#!/bin/sh

# Replace placeholder values in built JavaScript files with runtime environment variables
find /app/.next/standalone/.next/static -type f -name '*.js' -exec sed -i \
  -e "s|placeholder|${NEXT_PUBLIC_SITE_URL}|g" \
  -e "s|https://placeholder.supabase.co|${NEXT_PUBLIC_SUPABASE_URL}|g" {} \;

find /app/.next/static -type f -name '*.js' -exec sed -i \
  -e "s|placeholder|${NEXT_PUBLIC_SITE_URL}|g" \
  -e "s|https://placeholder.supabase.co|${NEXT_PUBLIC_SUPABASE_URL}|g" {} \;

# Start the Next.js server
exec node server.js
