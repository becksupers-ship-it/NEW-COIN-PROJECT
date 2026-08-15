# NEW-COIN-PROJECT

This repository contains the scaffold for a CoinHub-like site built with Next.js (App Router), TypeScript, Tailwind CSS, SWR, Chart.js and NextAuth for authentication. It includes a basic home list, coin detail page, sparklines, server-side proxy routes, watchlist (localStorage), compare page stubs, and deployment instructions for Vercel.

Setup

1. Install dependencies
   npm install

2. Run dev server
   npm run dev

Environment

- For auth (NextAuth) you'll need to set up environment variables in Vercel or .env.local (example):
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=your_secret
  GITHUB_ID=...
  GITHUB_SECRET=...

Deployment (Vercel)

1. Create a Vercel project and connect this GitHub repository.
2. Add environment variables in the Vercel dashboard (NEXTAUTH_SECRET, any OAuth keys).
3. Deploy — Vercel will build and publish automatically.

Branch & PR

This initial scaffold was committed to the default branch. I will create a feature branch with further UI and open a PR after this initial commit.
