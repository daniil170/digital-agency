import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Phone, MessageSquare, ArrowUpRight } from 'lucide-react';
import './Footer.css';

export const Footer = ({ onOpenContactModal }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <span className="logo-accent">NEBULA</span>
              <span className="logo-sub">AGENCY</span>
            </Link>
            <p className="footer-tagline">
              Разрабатываем высококонверсионные сайты и цифровые сервисы для развития вашего бизнеса.
            </p>
          </div>

          <div className="footer-columns">
            <div className="footer-col">
              <h4 className="footer-col-title">Навигация</h4>
              <ul className="footer-links">
                <li><Link to="/">Главная</Link></li>
                <li><Link to="/portfolio">Портфолио</Link></li>
                <li><Link to="/demo">Демо-примеры</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Демо-решения</h4>
              <ul className="footer-links">
                <li><Link to="/demo/store">Интернет-магазин</Link></li>
                <li><Link to="/demo/education">Курсы / EdTech</Link></li>
                <li><Link to="/demo/services">Сайт услуг</Link></li>
                <li><Link to="/demo/clinic">Клиника</Link></li>
                <li><Link to="/demo/cleaning">Клининг</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Контакты</h4>
              <ul className="footer-contacts">
                <li>
                  <Phone size={16} className="contact-icon" />
                  <a href="tel:+79000000000">+7 (900) 000-00-00</a>
                </li>
                <li>
                  <Send size={16} className="contact-icon" />
                  <a href="https://t.me/telegram" target="_blank" rel="noopener noreferrer">Telegram: @nebula_agency</a>
                </li>
                <li>
                  <MessageSquare size={16} className="contact-icon" />
                  <a href="https://wa.me/79000000000" target="_blank" rel="noopener noreferrer">WhatsApp: +7 (900) 000-00-00</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NEBULA AGENCY. Все права защищены.</p>
          <div className="footer-bottom-links">
            <button className="footer-modal-trigger" onClick={onOpenContactModal}>
              Оставить заявку <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
