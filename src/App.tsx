import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { NetworkGuard } from './components/NetworkGuard';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Markets } from './pages/Markets';
import { MarketDetail } from './pages/MarketDetail';
import { CreateMarket } from './pages/CreateMarket';
import { Portfolio } from './pages/Portfolio';
import { Parlay } from './pages/Parlay';
import { Syndicates } from './pages/Syndicates';

import { AuthProvider } from './context/AuthContext';
import { AccountProvider } from './context/AccountContext';

export default function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <AccountProvider>
          <NetworkGuard>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/markets" element={<Markets />} />
                  <Route path="/market/:id" element={<MarketDetail />} />
                  <Route path="/create" element={<CreateMarket />} />
                  <Route path="/parlay" element={<Parlay />} />
                  <Route path="/syndicates" element={<Syndicates />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                </Routes>
              </Layout>
            </Router>
          </NetworkGuard>
        </AccountProvider>
      </WalletProvider>
    </AuthProvider>
  );
}
