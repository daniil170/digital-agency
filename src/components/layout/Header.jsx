import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/Button';
import './Header.css';

export const Header = ({ onOpenContactModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-container">
        <Link to="/" className="logo">
          <span className="logo-accent">WEBORA</span>
          <span className="logo-sub">AGENCY</span>
        </Link>

        <nav className={`nav-menu ${isMobileMenuOpen ? 'nav-mobile-open' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Главная
          </Link>
          <Link 
            to="/portfolio" 
            className={`nav-link ${location.pathname === '/portfolio' ? 'active' : ''}`}
          >
            Портфолио
          </Link>
          <Link 
            to="/demo" 
            className={`nav-link ${location.pathname.startsWith('/demo') ? 'active' : ''}`}
          >
            Демо-примеры
          </Link>
          
          <div className="nav-mobile-cta">
            <Button variant="primary" onClick={onOpenContactModal} icon={ArrowUpRight}>
              Обсудить проект
            </Button>
          </div>
        </nav>

        <div className="header-actions">
          <Button 
            variant="primary" 
            size="small" 
            onClick={onOpenContactModal} 
            icon={ArrowUpRight}
            className="desktop-cta"
          >
            Обсудить проект
          </Button>

          <button 
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};
