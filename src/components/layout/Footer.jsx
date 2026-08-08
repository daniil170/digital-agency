import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Phone, MessageSquare, ArrowUpRight, Shield } from 'lucide-react';
import './Footer.css';

export const Footer = ({ onOpenContactModal }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <span className="logo-accent">WEBORA</span>
              <span className="logo-sub">AGENCY</span>
            </Link>
            <p className="footer-tagline">
              Разрабатываем высококонверсионные сайты и цифровые сервисы на React & Firebase для развития бизнеса по всему Казахстану.
            </p>
          </div>

          <div className="footer-columns">
            <div className="footer-col">
              <h4 className="footer-col-title">Навигация</h4>
              <ul className="footer-links">
                <li><Link to="/">Главная</Link></li>
                <li><Link to="/portfolio">Портфолио</Link></li>
                <li><Link to="/demo">Демо-примеры</Link></li>
                <li><Link to="/admin">Панель управления (Admin)</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Демо-решения (₸)</h4>
              <ul className="footer-links">
                <li><Link to="/demo/store">Интернет-магазин</Link></li>
                <li><Link to="/demo/education">Курсы / EdTech</Link></li>
                <li><Link to="/demo/services">Сайт услуг</Link></li>
                <li><Link to="/demo/clinic">Клиника</Link></li>
                <li><Link to="/demo/cleaning">Клининг</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Контакты (Казахстан)</h4>
              <ul className="footer-contacts">
                <li>
                  <Phone size={16} className="contact-icon" />
                  <a href="tel:+77714400971">+7 (771) 440-0971</a>
                </li>
                <li>
                  <Send size={16} className="contact-icon" />
                  <a href="https://t.me/cunicad" target="_blank" rel="noopener noreferrer">Telegram: @cunicad</a>
                </li>
                <li>
                  <MessageSquare size={16} className="contact-icon" />
                  <a href="https://wa.me/77714400971" target="_blank" rel="noopener noreferrer">WhatsApp: +7 (771) 440-0971</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} WEBORA AGENCY. Работаем по всему Казахстану.</p>
          <div className="footer-bottom-links">
            <Link to="/admin" className="footer-admin-link">
              <Shield size={14} /> Панель лидов
            </Link>
            <button className="footer-modal-trigger" onClick={onOpenContactModal}>
              Оставить заявку <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
