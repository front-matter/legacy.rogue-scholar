# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

# Public environment variables - embedded at build time
ENV NEXT_PUBLIC_SITE_URL="https://legacy.rogue-scholar.org"
ENV NEXT_PUBLIC_API_URL="https://api.rogue-scholar.org"
ENV NEXT_PUBLIC_SUPABASE_URL="https://bosczcmeodcrajtcaddf.supabase.co"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc2N6Y21lb2RjcmFqdGNhZGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNjI3MzIsImV4cCI6MjA1NDgzODczMn0.JnIO2PUGBHpP0ejlC2h_BfhAjvOkiAisdLFMS9wz6WI"

RUN pnpm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

LABEL org.opencontainers.image.source="https://github.com/front-matter/legacy.rogue-scholar"

# If using output: "standalone"
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
