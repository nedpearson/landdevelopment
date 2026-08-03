# Security & Dependency Audit Report

## Dependency Vulnerabilities

A full `pnpm audit` was run on the monorepo. 25 vulnerabilities were found across the dependency tree (3 low, 14 moderate, 8 high). 

### Accepted Risks
- **Next.js (CVEs related to cache poisoning and DOS):** 
  - *Risk Level*: Moderate to High
  - *Current Version*: `14.2.35`
  - *Patched Version*: `>=15.5.16`
  - *Justification*: Upgrading from Next.js 14 to Next.js 15 is a major framework upgrade that introduces breaking changes to caching, routing, and React Server Components. Upgrading blindly without a multi-week regression test suite would violate the core directive to not break existing functionality. This risk is accepted temporarily.
  - *Owner*: DevOps/Security Team.

- **UUID (Missing buffer bounds check):**
  - *Risk Level*: Moderate
  - *Current Version*: `8.3.2` / `7.0.3`
  - *Patched Version*: `>=11.1.1`
  - *Justification*: This is a deep transitive dependency of `@expo/cli` and `xcode` in the `apps/mobile` package. Because it's only used during build/CLI tasks and not in the production runtime payload, it is not exploitable by external actors.
  - *Owner*: Mobile Team.

## Tenant Isolation & API Authorization

### Findings
- **Data Leakage Risk:** `getAllProperties()` and `getPropertyById()` in `propertyActions.ts` were found to query the database *without* filtering by the requesting user's `organizationId`. This was a P0 vulnerability that could allow any authenticated user to view properties belonging to another tenant by guessing the UUID.

### Remediation
- **Fixed:** All Prisma queries in `propertyActions.ts` have been updated to enforce tenant isolation. A `where: { organizationId: currentOrganizationId }` clause has been strictly applied to all read operations.
- **Future Proofing:** Moving forward, all Server Actions must wrap their execution in a central `withAuth` higher-order function that automatically intercepts and injects the `organizationId` into the Prisma client context.

## Secret Scanning (Mapbox & Integrations)
- **Mapbox Token:** The `NEXT_PUBLIC_MAPBOX_TOKEN` was successfully identified in the environment. Mapbox tokens are designed to be public (prefixed with `NEXT_PUBLIC_`), however they MUST be restricted by domain in the Mapbox Developer Dashboard. 
- **Recommendation:** Verify in the Mapbox dashboard that URL restriction is enabled for `landintelligenceos.bridgebox.ai`. No other hardcoded secrets (e.g., Stripe, SendGrid) were found committed in the repository files.
