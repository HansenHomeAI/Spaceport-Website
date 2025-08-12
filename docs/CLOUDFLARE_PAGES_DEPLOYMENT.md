## Cloudflare Pages deployment (SSR / Next-on-Pages)

This project deploys the Next.js app to Cloudflare Pages using `@cloudflare/next-on-pages` and Wrangler.

- Branch routing
  - development → `v0-spaceport-website-preview2` (preview)
  - main → `v0-spaceport-website-prod-fresh` (production)

- Build and deploy
  - Build: `npm run build` then `npx @cloudflare/next-on-pages`
  - Deploy path: `.vercel/output/static` (ensures `_worker.js` is at the upload root so the site is recognized as a Pages Function and SSR works)

- Why `.vercel/output/static`
  - If `_worker.js` is not at the deploy root, Cloudflare treats the site as static, causing 404 responses and no tail logs. Deploying the `static` directory places the worker at the root and enables SSR/Edge routes.

- Token permissions for CI and log tailing (Account scope unless noted)
  - Cloudflare Pages: Read, Edit
  - Workers Scripts: Read
  - Workers Tail: Read
  - Account Settings: Read
  - Account Analytics: Read (optional)
  - Billing: Read (optional)
  - Notifications: Read (optional)
  - Access: Organizations, Identity Providers, and Groups: Read
  - User → Memberships: Read
  - User → User Details: Read
  - Limit to the specific account in “Account Resources”.

- Tailing deployment logs
  - Get latest deployment ID: `wrangler pages deployment list --project-name <project>`
  - Tail: `wrangler pages deployment tail --project-name <project> <deployment_id> --format pretty --status error --sampling-rate 0.5`
  - If tailing errors with "no Pages Function", the deploy was static; confirm deploy path is `.vercel/output/static`.

- Troubleshooting symptoms
  - 404 for `/` and static files, 500 on `/api/*`, and tail refusal → deployment recognized as static → fix deploy path.


