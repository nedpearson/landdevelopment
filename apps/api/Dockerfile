# Multi-stage Dockerfile for Express API Server in pnpm Monorepo
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.0.8 --activate

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./

COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/
COPY packages/domain/package.json ./packages/domain/
COPY packages/integrations/package.json ./packages/integrations/
COPY packages/ui/package.json ./packages/ui/

RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages ./packages

COPY . .

ENV NODE_ENV production

# Generate Prisma Client & Build Monorepo Packages
RUN pnpm --filter @land-intelligence/database run db:generate || true
RUN pnpm run build

# Stage 3: Production Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 4000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

# Copy dependencies, built monorepo packages, and API dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist

USER expressjs

EXPOSE 4000

CMD ["node", "apps/api/dist/main.js"]
