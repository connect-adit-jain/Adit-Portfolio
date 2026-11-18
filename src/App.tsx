import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { Cursor } from './components/Cursor/Cursor';
import { Preloader } from './components/Preloader/Preloader';
import { Home } from './pages/Home';
import { ProjectDetail } from './pages/ProjectDetail';
import { NotFound } from './pages/NotFound';

const AppContent: React.FC = () => {
  // Always show preloader on every page load/reload
  const [loading, setLoading] = useState(true);

  const handlePreloaderComplete = () => {
    setLoading(false);
    // Dispatch custom event so Home/Hero knows portrait should be settled
    window.dispatchEvent(new Event('preloader-complete'));
  };

  return (
    <div className="portfolio-app">
      {/* Accessible skip link */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Preloader */}
      {loading && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Custom Cursor */}
      <Cursor />

      {/* Persistent Navigation */}
      <Navbar />

      {/* React Router Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<ProjectDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Persistent Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
