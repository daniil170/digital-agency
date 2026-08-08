import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ContactModal } from './components/ui/ContactModal';

import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { DemoList } from './pages/DemoList';
import { DemoDetail } from './pages/DemoDetail';
import { Admin } from './pages/Admin';

import './styles/variables.css';

export default function App() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [initialNiche, setInitialNiche] = useState('');
  const location = useLocation();

  const handleOpenContactModal = (nicheName = '') => {
    if (typeof nicheName === 'string') {
      setInitialNiche(nicheName);
    } else {
      setInitialNiche('');
    }
    setIsContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
    setInitialNiche('');
  };

  return (
    <>
      <Header onOpenContactModal={handleOpenContactModal} />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home onOpenContactModal={handleOpenContactModal} />} />
          <Route path="/portfolio" element={<Portfolio onOpenContactModal={handleOpenContactModal} />} />
          <Route path="/demo" element={<DemoList onOpenContactModal={handleOpenContactModal} />} />
          <Route path="/demo/:niche" element={<DemoDetail onOpenContactModal={handleOpenContactModal} />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <Footer onOpenContactModal={handleOpenContactModal} />

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={handleCloseContactModal}
        initialNiche={initialNiche}
      />
    </>
  );
}
