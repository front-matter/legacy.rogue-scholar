#!/bin/sh

# Generate runtime configuration file
echo "Generating runtime configuration..."

cat > /app/public/env-config.js << EOF
window.__RUNTIME_CONFIG__ = {
  NEXT_PUBLIC_SITE_URL: "${NEXT_PUBLIC_SITE_URL}",
  NEXT_PUBLIC_API_URL: "${NEXT_PUBLIC_API_URL}",
  NEXT_PUBLIC_SUPABASE_URL: "${NEXT_PUBLIC_SUPABASE_URL}",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
};
EOF

echo "Runtime configuration generated successfully"
echo "NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}"
echo "NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}"
echo "NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL}"

# Start the Next.js server
exec node server.js
