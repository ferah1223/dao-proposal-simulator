# GovSim — DAO Proposal Simulator & Voting UI

A civic-tech inspired governance interface that makes voting feel consequential. Browse DAOs, explore proposals, and **simulate your vote impact** before casting it — all with real data from [Snapshot.org](https://snapshot.org).

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4)

## Features

- **Browse DAOs** — Search and explore hundreds of DAOs with real-time data from Snapshot
- **Proposal List** — View active, pending, and closed proposals with vote previews
- **Proposal Detail** — Full proposal description with markdown rendering, vote results, and voter history
- **Simulate Vote Impact** ★ — The key feature. Select a vote option and instantly see how your vote would shift the percentages before/after. No network call needed — pure client-side math in <500ms.
- **Quorum Tracking** — Visual progress bars showing quorum status
- **Responsive Design** — Mobile-first with sticky vote bar on small screens

## Tech Stack

- **Next.js 16** with App Router & Turbopack
- **React Query (TanStack Query)** — Data fetching with 2min stale time
- **GraphQL Request** — Snapshot Hub API client
- **Tailwind CSS** — Design tokens from civic-tech/editorial design system
- **React Markdown** — Render proposal descriptions with GFM support

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API

Uses the [Snapshot GraphQL API](https://docs.snapshot.org/tools/api):
- `hub.snapshot.org/graphql` — Spaces, proposals, votes
- `score.snapshot.org` — Voting power calculations

## Design System

The UI follows a civic-tech design language with:

- **Colors**: Democratic tricolor — Green (For), Red (Against), Purple (Abstain)
- **Typography**: DM Sans (headlines), Inter (body), JetBrains Mono (data)
- **Accessibility**: WCAG 2.1 Level A, color-blind safe voting icons (✓/✗/○)

## License

MIT
