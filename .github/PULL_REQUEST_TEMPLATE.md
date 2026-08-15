---
name: Pull request
about: Pull request template for code changes
---

### What it does
- Adds a full scaffold for a CoinHub-like site using Next.js (App Router) + TypeScript, Tailwind CSS, SWR, Chart.js, and NextAuth (stub).
- Implements markets list, coin detail, watchlist, compare, alerts, theme toggle, and CoinGecko API proxy routes.

### How to test
1. Checkout branch: `git checkout feature/coin-hub-scaffold`
2. Install: `npm install`
3. Add `.env.local` as described in the README/pr_body.md
4. `npm run dev` → open http://localhost:3000 and test the flows described in the PR body.

### Checklist
- [ ] Code compiles and runs locally
- [ ] Key flows work: markets list, coin detail, watchlist, compare, alerts
- [ ] No secrets in the commit
- [ ] README updated with setup & deployment notes

### Notes
- This PR is primarily a scaffold + MVP feature set. Follow-up PRs will add tests, accessibility fixes, and server-side persistence (DB) for watchlist/alerts if desired.
