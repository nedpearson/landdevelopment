# DNS Setup Quick Reference - landintelligence.bridgebox.ai

The custom domain **`landintelligence.bridgebox.ai`** is configured on Railway.

To make the domain live, add the following two DNS records in your DNS provider (Cloudflare for `bridgebox.ai`):

## Required DNS Records

| Type | Name / Host | Target / Value | TTL | Proxy Status (Cloudflare) |
| :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `landintelligence` | `99rgqpta.up.railway.app` | Auto / 300s | **DNS only (Gray Cloud / Off)** |
| **TXT** | `_railway-verify.landintelligence` | `railway-verify=264adeecfa8617991bb7780aac78aab87172c918e6ef93eb366ad88a3a98d14d` | Auto / 300s | N/A |

> **Important**: In Cloudflare, make sure the CNAME record proxy status is set to **DNS only** (gray cloud) so Railway can issue and verify the SSL/TLS certificate.

