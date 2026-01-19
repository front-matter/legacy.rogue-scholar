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
RUN pnpm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Runtime environment variables - will be overridden by docker run -e flags
ENV NEXT_PUBLIC_SITE_URL=""
ENV NEXT_PUBLIC_API_URL=""
ENV NEXT_PUBLIC_SUPABASE_URL=""
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=""
ENV NEXT_PUBLIC_POCKETBASE_URL=""

LABEL org.opencontainers.image.source="https://github.com/front-matter/legacy.rogue-scholar"

# If using output: "standalone"
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3000
CMD ["/app/docker-entrypoint.sh"]
