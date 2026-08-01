# DNS Setup Quick Reference

For complete step-by-step instructions on deploying Land Intelligence OS and setting up DNS for **`Landdevelopments.bridgebox.ai`**, see [RAILWAY_DNS_SETUP.md](file:///c:/dev/github/business/LandDevelopment/RAILWAY_DNS_SETUP.md).

## Quick CNAME Configuration Table

| Host / Name | Record Type | Target / Value | TTL |
| :--- | :--- | :--- | :--- |
| `Landdevelopments` | `CNAME` | `<your-railway-target>.up.railway.app` | Auto / 300s |
| `api-landdevelopments` (optional) | `CNAME` | `<your-api-railway-target>.up.railway.app` | Auto / 300s |
