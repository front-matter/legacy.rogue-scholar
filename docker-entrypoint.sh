#!/bin/sh

# Replace placeholder values in built JavaScript files with runtime environment variables
echo "Replacing environment variables at runtime..."

# Find and replace in all JS files
find /app/.next -type f \( -name '*.js' -o -name '*.html' \) -exec sed -i \
  -e "s|https://placeholder.example.com|${NEXT_PUBLIC_SITE_URL}|g" \
  -e "s|https://api.placeholder.example.com|${NEXT_PUBLIC_API_URL}|g" \
  -e "s|https://placeholder.supabase.co|${NEXT_PUBLIC_SUPABASE_URL}|g" \
  -e "s|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk5OTk5OTksImV4cCI6MTk2NTU3NTk5OX0.placeholder|${NEXT_PUBLIC_SUPABASE_ANON_KEY}|g" {} \;

echo "Environment variables replaced successfully"
echo "NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}"
echo "NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}"
echo "NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL}"

# Start the Next.js server
exec node server.js
