# Land Intelligence OS - Railway Deployment & DNS CNAME Setup Guide

This document provides a comprehensive guide for deploying the **Land Intelligence OS** monorepo (`apps/web` and `apps/api`) to **Railway** and configuring the custom domain **`Landdevelopments.bridgebox.ai`**.

---

## 1. System Architecture Overview

The Land Intelligence OS is structured as a `pnpm` monorepo containing:
- **`apps/web`**: Next.js 14 Web Application (Default Port: `3000`)
- **`apps/api`**: Express TypeScript API Engine (Default Port: `4000`)
- **`packages/database`**: Prisma ORM with PostgreSQL + PostGIS extension
- **`packages/domain`**: Business logic, underwriting, deal scoring
- **`packages/integrations`**: Parcel data provider & Grounded AI Model Gateway

```
                             +------------------------------------------+
                             |   Custom Domain:                        |
                             |   Landdevelopments.bridgebox.ai          |
                             +--------------------+---------------------+
                                                  |
                                                  v
                                     +------------+------------+
                                     |   Railway Edge Router   |
                                     |   (Let's Encrypt SSL)   |
                                     +------------+------------+
                                                  |
                         +------------------------+------------------------+
                         |                                                 |
                         v                                                 v
        +---------------------------------+               +---------------------------------+
        |      Service 1: Web App         |               |      Service 2: API Engine      |
        |      (`apps/web`)               |               |      (`apps/api`)               |
        |  Next.js Standalone Container   |               |  Express Node.js Container      |
        +---------------------------------+               +---------------------------------+
                         |                                                 |
                         +------------------------+------------------------+
                                                  |
                                                  v
                                     +------------+------------+
                                     |   Railway PostgreSQL    |
                                     |   (with PostGIS Ext)    |
                                     +-------------------------+
```

---

## 2. Railway Project Provisioning

### Step 1: Create a Railway Project
1. Log in to [Railway Dashboard](https://railway.app/).
2. Click **+ New Project** -> **Deploy from GitHub repo**.
3. Select your repository (`LandDevelopment`).

### Step 2: Add PostgreSQL Database Service
1. Inside your Railway project workspace, click **+ New** -> **Database** -> **Add PostgreSQL**.
2. Once created, click on the PostgreSQL service -> **Variables**.
3. Copy `DATABASE_URL` or `POSTGRES_URL`.
4. Go to **Data** / **Query** tab or run via CLI to enable PostGIS for parcel mapping:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

### Step 3: Configure `apps/web` Service
1. Click **+ New** -> **GitHub Repo** -> select `LandDevelopment`.
2. Rename service to `land-intelligence-web`.
3. Go to **Settings**:
   - **Root Directory**: Leave blank (monorepo root) or `/`
   - **Build Builder**: `Dockerfile`
   - **Dockerfile Path**: `apps/web/Dockerfile`
   - **Watch Paths**: `apps/web/**`, `packages/**`, `package.json`, `pnpm-lock.yaml`
4. Go to **Variables** and add:
   ```env
   NODE_ENV=production
   PORT=3000
   NEXT_PUBLIC_APP_NAME=Land Intelligence OS
   NEXT_PUBLIC_APP_URL=https://Landdevelopments.bridgebox.ai
   NEXT_PUBLIC_API_URL=https://Landdevelopments.bridgebox.ai/api
   ```

### Step 4: Configure `apps/api` Service
1. Click **+ New** -> **GitHub Repo** -> select `LandDevelopment`.
2. Rename service to `land-intelligence-api`.
3. Go to **Settings**:
   - **Build Builder**: `Dockerfile`
   - **Dockerfile Path**: `apps/api/Dockerfile`
   - **Watch Paths**: `apps/api/**`, `packages/**`, `package.json`, `pnpm-lock.yaml`
4. Go to **Variables** and reference the PostgreSQL plugin variable:
   ```env
   NODE_ENV=production
   PORT=4000
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   CORS_ORIGIN=https://Landdevelopments.bridgebox.ai
   JWT_SECRET=your-production-jwt-secret-key-32-chars
   GROUNDED_AI_MODEL_KEY=your-grounded-ai-key
   OPENAI_API_KEY=sk-proj-your-openai-api-key
   ```

---

## 3. DNS CNAME Configuration for `Landdevelopments.bridgebox.ai`

To point your custom domain `Landdevelopments.bridgebox.ai` to Railway, follow these steps in your DNS provider (e.g. Cloudflare, Route53, GoDaddy, Namecheap):

### Step 1: Generate Railway CNAME Target
1. In Railway, open the `land-intelligence-web` service settings.
2. Go to **Networking** -> **Custom Domains**.
3. Enter custom domain: `Landdevelopments.bridgebox.ai`.
4. Railway will generate a unique target CNAME record (e.g., `land-intelligence-web-production.up.railway.app` or `dns.railway.app`).

### Step 2: Add CNAME Record in DNS Provider

| Record Type | Host / Name | Target / Value | TTL | Proxy Status (Cloudflare) |
| :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `Landdevelopments` | `<your-railway-target>.up.railway.app` | Auto / 300s | **DNS Only (Grey Cloud)** |

*Note: If using Cloudflare DNS, set Proxy status to **DNS Only** during SSL certificate issuance so Railway / Let's Encrypt can perform ACME HTTP-01 challenge verification.*

### Step 3: (Optional) API Subdomain Configuration

If hosting the API on a dedicated subdomain (e.g., `api-landdevelopments.bridgebox.ai`):

1. In Railway `land-intelligence-api` service settings -> **Networking** -> **Custom Domains**.
2. Enter: `api-landdevelopments.bridgebox.ai`.
3. Add the following record to your DNS manager:

| Record Type | Host / Name | Target / Value | TTL | Proxy Status |
| :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `api-landdevelopments` | `<your-api-railway-target>.up.railway.app` | Auto / 300s | **DNS Only** |

4. Update `NEXT_PUBLIC_API_URL` on Web service to:
   ```env
   NEXT_PUBLIC_API_URL=https://api-landdevelopments.bridgebox.ai
   ```

---

## 4. Environment Variables Reference

| Variable Name | Required By | Description | Example Value |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | API & DB | PostgreSQL Connection String | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV` | Web & API | Environment mode | `production` |
| `PORT` | Web & API | HTTP server listen port | `3000` (Web) / `4000` (API) |
| `NEXT_PUBLIC_APP_URL` | Web | Client-side public URL | `https://Landdevelopments.bridgebox.ai` |
| `NEXT_PUBLIC_API_URL` | Web | Client-side API backend endpoint | `https://Landdevelopments.bridgebox.ai/api` |
| `CORS_ORIGIN` | API | Allowed origin header | `https://Landdevelopments.bridgebox.ai` |
| `JWT_SECRET` | API | Secret key for auth tokens | `min-32-character-secret` |
| `GROUNDED_AI_MODEL_KEY`| API | AI Gateway access key | `ai-model-gateway-key` |
| `OPENAI_API_KEY` | API | OpenAI API Key for Grounded AI | `sk-proj-...` |
| `PARCEL_DATA_API_KEY` | API | Parcel Data Provider API key | `regrid-api-key` |

---

## 5. Verification & Testing Commands

### Verify DNS Propagation
Run from your terminal or command prompt:
```bash
# Check DNS CNAME resolution
nslookup Landdevelopments.bridgebox.ai

# Or using dig
dig CNAME Landdevelopments.bridgebox.ai +short
```

### Verify SSL & Health Endpoints
```bash
# Test Web App HTTP status
curl -I https://Landdevelopments.bridgebox.ai

# Test API Health Check Endpoint
curl https://Landdevelopments.bridgebox.ai/api/v1/health
```

Expected API Response:
```json
{
  "status": "ok",
  "system": "Land Intelligence OS API Server",
  "version": "1.0.0-production-grade",
  "timestamp": "2026-07-31T21:55:00.000Z",
  "provider": { "status": "healthy" }
}
```

---

## 6. Troubleshooting Guide

- **SSL Pending / Certificate Error**:
  Ensure the CNAME record points directly to Railway's provided domain. If using Cloudflare, toggle proxy mode to **DNS Only (Grey Cloud)** until the certificate status in Railway turns Active.
- **CORS Error in Browser**:
  Verify `CORS_ORIGIN` in `apps/api` environment variables matches `https://Landdevelopments.bridgebox.ai` exactly (including protocol `https://` without trailing slash).
- **Prisma Client Missing in Container**:
  Ensure `pnpm --filter @land-intelligence/database run db:generate` ran during build stage (included automatically in provided `Dockerfile` and `nixpacks.toml`).
