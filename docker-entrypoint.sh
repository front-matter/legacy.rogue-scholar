#!/bin/sh

# Replace placeholder values in built JavaScript files with runtime environment variables
echo "Replacing environment variables at runtime..."

# Find and replace in all JS files
find /app/.next -type f \( -name '*.js' -o -name '*.html' \) -exec sed -i \
  -e "s|__NEXT_PUBLIC_SITE_URL__|${NEXT_PUBLIC_SITE_URL}|g" \
  -e "s|__NEXT_PUBLIC_API_URL__|${NEXT_PUBLIC_API_URL}|g" \
  -e "s|__NEXT_PUBLIC_SUPABASE_URL__|${NEXT_PUBLIC_SUPABASE_URL}|g" \
  -e "s|__NEXT_PUBLIC_SUPABASE_ANON_KEY__|${NEXT_PUBLIC_SUPABASE_ANON_KEY}|g" {} \;

echo "Environment variables replaced successfully"
echo "NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}"
echo "NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}"
echo "NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL}"

# Start the Next.js server
exec node server.js
