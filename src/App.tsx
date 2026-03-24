import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { NetworkGuard } from './components/NetworkGuard';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Markets } from './pages/Markets';
import { MarketDetail } from './pages/MarketDetail';
import { CreateMarket } from './pages/CreateMarket';
import { Portfolio } from './pages/Portfolio';
import { Resolve } from './pages/Resolve';

export default function App() {
  return (
    <WalletProvider>
      <NetworkGuard>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/market/:id" element={<MarketDetail />} />
              <Route path="/create" element={<CreateMarket />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/resolve" element={<Resolve />} />
              <Route path="/resolve/:id" element={<Resolve />} />
            </Routes>
          </Layout>
        </Router>
      </NetworkGuard>
    </WalletProvider>
  );
}
