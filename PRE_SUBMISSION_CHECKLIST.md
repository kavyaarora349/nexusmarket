# ✅ SharPredict Hackathon Pre-Submission Checklist

Use this checklist to ensure your project is submission-ready for all evaluation categories.

## Phase 1: Local Development (Before Deployment)

- [ ] Clone/sync latest code
- [ ] `cd SharPredict && npm install`
- [ ] `npm run compile` - All contracts compile without errors
- [ ] `npm run test` - All tests pass
  - [ ] MarketFactory tests pass
  - [ ] PredictionMarket tests pass

## Phase 2: Smart Contract Deployment

### Setup Environment
- [ ] Create `SharPredict/.env` file
- [ ] Add `DEPLOYER_PRIVATE_KEY=<your_key>`
- [ ] Get test SHM from faucet: https://faucet.shardeum.org/
- [ ] Have minimum 1 SHM for deployment

### Deploy
- [ ] Run `npm run deploy`
- [ ] Wait for deployment confirmation
- [ ] Check console for deployed addresses
- [ ] Verify `deployments.json` created with addresses and ABIs
- [ ] Note `MarketFactory` address: `0x...`

### Verify Deployment
- [ ] Run `npm run verify`
- [ ] All checks pass
- [ ] `src/utils/contract.ts` updated with correct address

## Phase 3: Backend Setup

### Configure Database
- [ ] MongoDB running: `mongod --dbpath ./data`
- [ ] Database listening on `localhost:27017`

### Configure Indexer
- [ ] Create `SharPredict/.env` with:
  ```env
  MONGO_URI=mongodb://localhost:27017/sharpredict
  PORT=3001
  RPC_URL=https://api-testnet.shardeum.org/
  MARKET_FACTORY_ADDRESS=0x... (from deployments.json)
  DEPLOYER_ADDRESS=0x...
  ```
- [ ] Save file

### Start Indexer
- [ ] Run `node indexer/server.js`
- [ ] See "Connected to MongoDB" message
- [ ] See "Listener started" message
- [ ] No errors in console

### Test API
- [ ] GET `http://localhost:3001/` returns `{"status":"..."}`
- [ ] GET `http://localhost:3001/api/markets` returns `[]` (empty initially)

## Phase 4: Frontend Setup

### Configure Frontend
- [ ] Create `.env.local` in project root with:
  ```env
  VITE_SUPABASE_URL=<your_supabase_url>
  VITE_SUPABASE_ANON_KEY=<your_key>
  ```
- [ ] Note: Contract address auto-loads from `src/utils/contract.ts`

### Start Frontend
- [ ] Run `npm run dev` from project root
- [ ] No build errors
- [ ] App loads on `http://localhost:3000`
- [ ] UI renders correctly (no console errors)

### Test Frontend
- [ ] Can see "Markets" page
- [ ] Can see "Create Market" button
- [ ] Wallet connect button visible
- [ ] Terminal-style UI looks good

## Phase 5: Integration Testing

### Create Test Market
- [ ] Click "Create Market"
- [ ] Fill in:
  - Title: "Will ETH reach $5000?"
  - Description: "Test market"
  - Category: "Crypto"
  - End Time: Future date
- [ ] Send transaction
- [ ] Confirm transaction in wallet
- [ ] Market appears in list

### Place Test Bets
- [ ] Click on market
- [ ] Click "Bet YES" or "Bet NO"
- [ ] Enter amount: 0.1 SHM
- [ ] Send transaction
- [ ] Confirm in wallet
- [ ] Bet appears in "Odds" section

### Verify Database Sync
- [ ] Check MongoDB: Database has market entry
- [ ] Call `/api/markets` - Returns your market
- [ ] Call `/api/markets/:id/bets` - Returns your bets

## Phase 6: Presentation Readiness

### Create Demo Data
- [ ] Create 3-5 sample markets
- [ ] Place bets on multiple sides
- [ ] Test market resolution
- [ ] Test reward claiming

### Performance Check
- [ ] Frontend loads in <3 seconds
- [ ] API responds in <500ms
- [ ] No console errors
- [ ] No database errors

### Documentation Review
- [ ] README.md has setup instructions
- [ ] HACKATHON_SETUP.md is accessible
- [ ] COMPLETION_SUMMARY.md reviewed
- [ ] All commands tested and working

## Phase 7: Evaluation Criteria Verification

### Third Place Checklist
- [ ] **Smart Contract Tests**
  - `npm run test` produces passing tests
  - Tests verify core functionality
  - Code has proper error handling

- [ ] **Presentable UI**
  - React components load without errors
  - UI is responsive and styled
  - User can navigate all pages
  - Market cards display correctly

### Second Place Checklist
- [ ] **Smart Contract Integration**
  - Frontend imports correct ABI
  - Contract address auto-loaded from env
  - Transactions are properly signed/sent
  - Events are emitted correctly

- [ ] **Database Connection**
  - MongoDB is running
  - Indexer API is responding
  - All database queries work
  - Event listener syncs blockchain → DB

### First Place Checklist
- [ ] **Deployed Smart Contracts**
  - MarketFactory deployed to Shardeum
  - Address recorded in deployments.json
  - Can view contract on block explorer

- [ ] **Fully Integrated System**
  - Frontend → Backend → Blockchain flow works
  - Create market → API creates record → DB stores
  - Place bet → Smart contract executes → DB updates
  - Market resolution → Event → DB update
  - Reward claiming → Transfer → User receives SHM

- [ ] **Complete Functionality**
  - Market creation works with initial liquidity
  - Betting calculates odds dynamically
  - Community voting possible (if selected)
  - Market resolution with evidence URI
  - Reward claiming with proper calculations
  - 2% fee routing to treasury

## Phase 8: Final Checks (Day Before Submission)

- [ ] Fresh deployment test
- [ ] All three services running (Frontend, Backend, Contracts)
- [ ] Demo works without errors
- [ ] Screenshots/video of working system
- [ ] Code is committed and pushed
- [ ] HACKATHON_SETUP.md reviewed for accuracy
- [ ] Wallet has sufficient balance for demo
- [ ] Network connection stable

## Emergency Troubleshooting

### If contract deployment fails:
```bash
# Check balance (need >1 SHM)
# Check private key format
# Try with different RPC endpoint
# Verify network is Shardeum (8083)
```

### If frontend doesn't load:
```bash
# Hard refresh: Ctrl+Shift+R
# Check browser console for errors
# Verify CONTRACT_ADDRESS in src/utils/contract.ts
# Clear .env cache if needed
```

### If database errors:
```bash
# Start fresh MongoDB: mongod --dbpath ./data
# Delete collections if corrupted
# Restart listener: node indexer/server.js
```

### If API not responding:
```bash
# Port 3001 in use? Change with PORT=3002
# Check MongoDB connection string
# Verify MARKET_FACTORY_ADDRESS in .env
```

---

## Success Indicators

✅ **You're ready to submit when:**
- [ ] All tests pass
- [ ] Contract deployed successfully  
- [ ] Backend API responding on port 3001
- [ ] Frontend running on port 3000
- [ ] Demo flow: Create → Bet → Resolve → Claim works end-to-end
- [ ] Database contains live data
- [ ] No errors in any console

---

## Contact/Support

If you encounter issues review:
1. HACKATHON_SETUP.md → Troubleshooting section
2. README.md → Running Locally section  
3. Contract tests → For expected behavior
4. API routes → For database schema

---

**Good luck! You've got this! 🚀**
