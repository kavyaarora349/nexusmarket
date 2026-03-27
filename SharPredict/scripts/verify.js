#!/usr/bin/env node
/**
 * SharPredict Deployment Verification Script
 * Run this after deploying to verify all systems are working
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('\n🔍 SharPredict Deployment Verification\n');
console.log('=' .repeat(50));

let allGood = true;

// Check 1: deployments.json exists
console.log('\n✓ Checking deployment artifacts...');
const deploymentsPath = path.join(__dirname, 'deployments.json');
if (fs.existsSync(deploymentsPath)) {
  const deployments = JSON.parse(fs.readFileSync(deploymentsPath, 'utf-8'));
  console.log(`  ✅ deployments.json found`);
  console.log(`  📍 MarketFactory: ${deployments.MarketFactory?.address || 'NOT SET'}`);
  console.log(`  🕐 Deployed: ${deployments.deploymentTime || 'unknown'}`);
  console.log(`  🔗 Network: ${deployments.network || 'unknown'}`);
} else {
  console.log(`  ❌ deployments.json NOT FOUND - Run: npx hardhat run scripts/deploy.js --network shardeum`);
  allGood = false;
}

// Check 2: Frontend contract.ts updated
console.log('\n✓ Checking frontend contract integration...');
const contractTsPath = path.join(__dirname, '../src/utils/contract.ts');
if (fs.existsSync(contractTsPath)) {
  const contractContent = fs.readFileSync(contractTsPath, 'utf-8');
  if (contractContent.includes(`MARKET_FACTORY_ABI`) && contractContent.includes(`PREDICTION_MARKET_ABI`)) {
    console.log(`  ✅ Frontend contract.ts updated with ABIs`);
    if (contractContent.includes('process.env.VITE_CONTRACT_ADDRESS')) {
      console.log(`  ✅ Contract address will load from env variable`);
    }
  } else {
    console.log(`  ⚠️  Contract ABIs may not be fully defined`);
  }
} else {
  console.log(`  ❌ src/utils/contract.ts NOT FOUND`);
  allGood = false;
}

// Check 3: Test files exist
console.log('\n✓ Checking test coverage...');
const marketFactoryTestPath = path.join(__dirname, 'test/MarketFactory.test.js');
const predictionMarketTestPath = path.join(__dirname, 'test/PredictionMarket.test.js');
if (fs.existsSync(marketFactoryTestPath)) {
  console.log(`  ✅ MarketFactory.test.js found`);
} else {
  console.log(`  ⚠️  MarketFactory.test.js not found`);
}
if (fs.existsSync(predictionMarketTestPath)) {
  console.log(`  ✅ PredictionMarket.test.js found`);
} else {
  console.log(`  ⚠️  PredictionMarket.test.js not found`);
}

// Check 4: Indexer files exist
console.log('\n✓ Checking backend indexer...');
const serverPath = path.join(__dirname, 'indexer/server.js');
const listenerPath = path.join(__dirname, 'indexer/listener.js');
if (fs.existsSync(serverPath)) {
  console.log(`  ✅ indexer/server.js found`);
} else {
  console.log(`  ❌ indexer/server.js NOT FOUND`);
  allGood = false;
}
if (fs.existsSync(listenerPath)) {
  console.log(`  ✅ indexer/listener.js found`);
} else {
  console.log(`  ❌ indexer/listener.js NOT FOUND`);
  allGood = false;
}

// Check 5: Environment files
console.log('\n✓ Checking environment configuration...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  if (envContent.includes('DEPLOYER_PRIVATE_KEY')) {
    console.log(`  ✅ .env file configured (SharPredict)`);
  } else {
    console.log(`  ⚠️  .env found but may be incomplete`);
  }
} else {
  console.log(`  ⚠️  .env file not found - Create from .env.example`);
}

const frontendEnvPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(frontendEnvPath)) {
  console.log(`  ✅ Frontend .env.local found`);
} else {
  console.log(`  ⚠️  Frontend .env.local not found - Create with VITE_CONTRACT_ADDRESS`);
}

// Check 6: Package.json scripts
console.log('\n✓ Checking package.json scripts...');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const scripts = packageJson.scripts || {};
  if (scripts.test && scripts.test !== 'echo "Error: no test specified" && exit 1') {
    console.log(`  ✅ Test script configured`);
  } else {
    console.log(`  ⚠️  Test script not properly configured`);
  }
  if (scripts.deploy) {
    console.log(`  ✅ Deploy script configured`);
  } else {
    console.log(`  ⚠️  Deploy script not configured`);
  }
} else {
  console.log(`  ❌ package.json NOT FOUND`);
  allGood = false;
}

// Final summary
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('\n✅ All checks passed! Project is ready for deployment.\n');
  console.log('Next steps:');
  console.log('1. npm run test              # Verify contracts');
  console.log('2. npm run deploy            # Deploy to Shardeum');
  console.log('3. node indexer/server.js    # Start indexer');
  console.log('4. npm run dev               # Start frontend\n');
} else {
  console.log('\n⚠️  Some checks failed. Please review the issues above.\n');
}

process.exit(allGood ? 0 : 1);
