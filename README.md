# Nexus Market

Nexus Market is a Shardeum-based prediction market frontend focused on fast wallet-driven trading flows. The app lets users browse markets, place single-market bets, build parlays from the live market list, allocate funds to syndicates, and track their activity in a portfolio view backed by Supabase authentication and per-user bet history.

The current product is a frontend-first implementation: market inventory and odds are served from the app layer, wallet interactions are executed through MetaMask using native SHM on Shardeum EVM Testnet, and authenticated account history is persisted in Supabase.

## What The App Does

The app currently includes these user-facing flows:

- `Markets`: browse the live in-app market inventory
- `Market Detail`: inspect a market and place a YES or NO trade
- `Parlays`: combine multiple open markets into a single ticket
- `Syndicates`: allocate SHM into curated strategy buckets
- `Create`: create a market form flow in the UI
- `Portfolio`: view wallet-linked account stats and saved trade history
- `Authentication`: sign up and sign in with Supabase

## How It Works

### Wallet Layer

Wallet connectivity is handled with `ethers` in the React app. The wallet flow:

1. Connects through MetaMask
2. Checks the active chain
3. Switches the wallet to Shardeum EVM Testnet if needed
4. Reads the connected address balance in native SHM
5. Refreshes the balance after transactions and account changes

The configured network is:

- Network: `Shardeum EVM Testnet`
- Chain ID: `8119`
- RPC: `https://api-mezame.shardeum.org`
- Explorer: `https://explorer-mezame.shardeum.org`

Relevant files:

- [WalletContext.tsx](/c:/Users/91767/nexusmarket/src/context/WalletContext.tsx)
- [shardeum.ts](/c:/Users/91767/nexusmarket/src/utils/shardeum.ts)

### Trading Flows

The app currently uses wallet-signed SHM transfers to simulate live protocol execution from the UI. A successful transaction is then recorded in the account layer with metadata such as:

- trade type
- side
- amount
- estimated payout
- transaction hash
- optional details for parlay and syndicate entries

Relevant files:

- [BetPanel.tsx](/c:/Users/91767/nexusmarket/src/components/BetPanel.tsx)
- [Parlay.tsx](/c:/Users/91767/nexusmarket/src/pages/Parlay.tsx)
- [Syndicates.tsx](/c:/Users/91767/nexusmarket/src/pages/Syndicates.tsx)

### Account History

Account history is managed centrally in the account context.

- Signed-in users: history is saved in Supabase
- Guest users: history falls back to local storage

The portfolio page reads from that shared account store, so market bets, parlays, and syndicate allocations appear in one history stream.

Relevant files:

- [AccountContext.tsx](/c:/Users/91767/nexusmarket/src/context/AccountContext.tsx)
- [Portfolio.tsx](/c:/Users/91767/nexusmarket/src/pages/Portfolio.tsx)
- [schema.sql](/c:/Users/91767/nexusmarket/supabase/schema.sql)

### Market Inventory

The app currently uses an in-app market source through `useMarkets()`. That hook powers:

- the Markets page
- Market Detail pages
- the Parlay builder

This means the app is internally consistent even without an external market API.

Relevant file:

- [useMarkets.ts](/c:/Users/91767/nexusmarket/src/hooks/useMarkets.ts)

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Ethers.js
- Supabase
- React Router

## Repository Structure

### Frontend App

- `src/components/` reusable UI and trade panels
- `src/context/` auth, wallet, and account state
- `src/hooks/` shared market data hooks
- `src/pages/` route-level pages
- `src/utils/` network config, contract data, and Supabase client

### Supabase

- `supabase/schema.sql` database schema and row-level security policies for saved bets

### Contract Workspace

- `SharPredict/` contains a separate smart-contract and indexer workspace, including contracts, scripts, tests, and generated artifacts

This folder is useful for contract-side work, but the deployed frontend experience described in this README does not depend on running a separate backend service.

## Local Development

### Prerequisites

- Node.js 18+
- MetaMask
- A Supabase project

### Environment Variables

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Optional:

```env
GEMINI_API_KEY=your_key_if_you_still_use_the_ai_feature
```

### Install Dependencies

```bash
npm install
```

### Start The App

```bash
npm run dev
```

The app will run on:

- `http://localhost:3000`

### Type Check

```bash
npm run lint
```

### Production Build

```bash
npm run build
```

## Supabase Setup

To enable authentication and per-user history:

1. Create a Supabase project
2. Open the SQL editor
3. Run [schema.sql](/c:/Users/91767/nexusmarket/supabase/schema.sql)
4. Copy your project URL and anon key into `.env.local`

The schema creates:

- `public.bets`
- an index for recent user history lookups
- row-level security policies for authenticated reads and inserts

## Deployment

The frontend is configured for Vercel.

### Deploy To Vercel

1. Import the repository into Vercel
2. Set the environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy

The repo includes [vercel.json](/c:/Users/91767/nexusmarket/vercel.json) so client-side routes like `/market/c10`, `/parlay`, and `/portfolio` continue to work on refresh.

## Current Product Notes

- The app uses native SHM balance from the connected wallet
- Bet persistence is tied to the authenticated Supabase user
- Guests can still use the UI, but their history is only stored locally
- The Oracle route has been removed from the user-facing app
- The `Shardeum-kit/` local workspace is not required for the deployed frontend

## Important Files

- [App.tsx](/c:/Users/91767/nexusmarket/src/App.tsx)
- [Layout.tsx](/c:/Users/91767/nexusmarket/src/components/Layout.tsx)
- [WalletContext.tsx](/c:/Users/91767/nexusmarket/src/context/WalletContext.tsx)
- [AccountContext.tsx](/c:/Users/91767/nexusmarket/src/context/AccountContext.tsx)
- [AuthContext.tsx](/c:/Users/91767/nexusmarket/src/context/AuthContext.tsx)
- [BetPanel.tsx](/c:/Users/91767/nexusmarket/src/components/BetPanel.tsx)
- [Parlay.tsx](/c:/Users/91767/nexusmarket/src/pages/Parlay.tsx)
- [Syndicates.tsx](/c:/Users/91767/nexusmarket/src/pages/Syndicates.tsx)
- [Portfolio.tsx](/c:/Users/91767/nexusmarket/src/pages/Portfolio.tsx)
- [useMarkets.ts](/c:/Users/91767/nexusmarket/src/hooks/useMarkets.ts)
- [supabase.ts](/c:/Users/91767/nexusmarket/src/utils/supabase.ts)
- [schema.sql](/c:/Users/91767/nexusmarket/supabase/schema.sql)
