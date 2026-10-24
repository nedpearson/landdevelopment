#!/bin/sh
set -e

echo "=== Land Intelligence OS Container Entrypoint ==="

# 1. Resolve and export DATABASE_URL with multi-tier fallback
if [ -z "$DATABASE_URL" ]; then
  echo "[entrypoint] DATABASE_URL not in environment. Attempting discovery..."
  if [ -n "$POSTGRES_URL" ]; then
    echo "[entrypoint] Found POSTGRES_URL, using as DATABASE_URL"
    export DATABASE_URL="$POSTGRES_URL"
  elif [ -n "$DATABASE_PUBLIC_URL" ]; then
    echo "[entrypoint] Found DATABASE_PUBLIC_URL, using as DATABASE_URL"
    export DATABASE_URL="$DATABASE_PUBLIC_URL"
  elif [ -f "/app/.env" ]; then
    echo "[entrypoint] Reading from /app/.env..."
    ENV_URL=$(grep '^DATABASE_URL=' /app/.env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
    if [ -n "$ENV_URL" ]; then
      export DATABASE_URL="$ENV_URL"
    fi
  elif [ -f "/app/packages/database/.env" ]; then
    echo "[entrypoint] Reading from /app/packages/database/.env..."
    ENV_URL=$(grep '^DATABASE_URL=' /app/packages/database/.env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
    if [ -n "$ENV_URL" ]; then
      export DATABASE_URL="$ENV_URL"
    fi
  fi
fi

# 2. Hardened fallback to Railway internal Postgres if still empty
if [ -z "$DATABASE_URL" ]; then
  echo "[entrypoint] Falling back to default Railway internal Postgres connection"
  export DATABASE_URL="postgresql://postgres:XJZIVLwkXhsZCrceONUUaIAvcbuzTNzH@postgres.railway.internal:5432/railway"
fi

echo "[entrypoint] DATABASE_URL configured successfully (host: $(echo "$DATABASE_URL" | sed -e 's/.*@//' -e 's/\/.*//'))"

# Ensure .env exists for Prisma CLI loaders
mkdir -p /app/packages/database
echo "DATABASE_URL=\"$DATABASE_URL\"" > /app/.env
echo "DATABASE_URL=\"$DATABASE_URL\"" > /app/packages/database/.env

# 3. Synchronize Prisma database schema
echo "[entrypoint] Running database synchronization..."
npx prisma db push --schema=packages/database/prisma/schema.prisma || {
  echo "[entrypoint] WARNING: prisma db push exited with non-zero status. Proceeding with application boot..."
}

# 4. Boot Next.js Standalone Production Server
export HOSTNAME="0.0.0.0"
export PORT="${PORT:-8080}"

echo "[entrypoint] Launching Next.js on port $PORT..."
exec node apps/web/.next/standalone/apps/web/server.js
