feat: scaffold coin-hub (Next.js App Router + TypeScript) + watchlist/compare/alerts

Summary
- Adds an initial Next.js (App Router) scaffold (TypeScript) with Tailwind CSS, SWR, Chart.js (react-chartjs-2), and a NextAuth stub.
- Implements:
  - Home markets list (search, pagination, sparkline, add/remove watchlist)
  - Coin detail page with selectable price-history ranges and price+volume chart
  - Watchlist page (localStorage) and add/remove actions
  - Compare page (normalized charts)
  - Alerts UI (create/edit/remove) and background AlertsChecker (browser notifications)
  - Theme toggle (light/dark) and Auth button (NextAuth stub)
  - API proxy routes: app/api/coins/markets, app/api/coins/[id], app/api/coins/[id]/market_chart
  - NextAuth route stub: app/api/auth/[...nextauth]/route.ts

How to test locally
1. git checkout feature/coin-hub-scaffold
2. npm install
3. Create a local .env.local with the following variables (example):
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=<your_nextauth_secret>
   GITHUB_ID=<optional, for GitHub OAuth>
   GITHUB_SECRET=<optional, for GitHub OAuth>
4. npm run dev
5. Open http://localhost:3000 and test:
   - Markets: search, pagination, add/remove watchlist
   - Coin detail: select ranges (1/7/30/90/365), see price+volume chart, add/remove watchlist
   - Watchlist: view added coins
   - Compare: change coin ids and verify chart
   - Alerts: create/edit/remove alerts; grant Notification permission to see browser notifications when conditions are met

Notes & TODOs
- Chart micro-UX: tooltips, hover interactions, and mobile behavior need further polish.
- Compare: improve legend, color customization and multi-coin selection UI.
- Alerts: currently local (localStorage). Can add server-side monitoring and per-user persistence (requires a DB and enabling NextAuth providers).
- Watchlist: currently localStorage. Can persist per-user when auth + DB are configured.
- Tests and accessibility improvements still required.

Security
- Rotate any secrets shared in chat. Store secrets only in .env.local for local dev and in Vercel environment variables for production. Do not commit secrets to the repo.

Deployment (Vercel)
1. Create a Vercel project and connect this GitHub repo.
2. Add env vars (NEXTAUTH_URL, NEXTAUTH_SECRET, GITHUB_ID, GITHUB_SECRET) in the Vercel dashboard.
3. Vercel will build and deploy on push/merge automatically.

