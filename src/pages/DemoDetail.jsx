import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowRight, ShoppingBag, CheckCircle, Star, Phone, Send, 
  Clock, Shield, Award, Users, ChevronRight, HelpCircle
} from 'lucide-react';
import { DemoBanner } from '../components/demo/DemoBanner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Section } from '../components/ui/Section';
import { demoCategories } from '../data/siteData';
import './DemoDetail.css';

export const DemoDetail = ({ onOpenContactModal }) => {
  const { niche } = useParams();
  const category = demoCategories.find((c) => c.slug === niche) || demoCategories[0];
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="demo-detail-page">
      {/* Dynamic Niche Banner */}
      <DemoBanner 
        categoryTitle={category.title} 
        onOpenContactModal={onOpenContactModal} 
      />

      {/* NICHE SITE HEADER */}
      <div className="niche-site-container">
        <header className="niche-header">
          <div className="niche-logo">
            <span className="niche-logo-mark">{category.title.substring(0, 1)}</span>
            <span className="niche-logo-text">{category.title}</span>
          </div>

          <nav className="niche-nav">
            <a href="#hero">Главная</a>
            <a href="#catalog">Каталог/Услуги</a>
            <a href="#benefits">Преимущества</a>
            <a href="#reviews">Отзывы</a>
            <a href="#contact">Контакты</a>
          </nav>

          <div className="niche-header-action">
            {category.slug === 'store' && (
              <button className="niche-cart-btn" onClick={() => setCartCount(cartCount + 1)}>
                <ShoppingBag size={18} />
                <span>Корзина ({cartCount})</span>
              </button>
            )}
            <Button variant="primary" size="small" onClick={() => onOpenContactModal(category.title)}>
              Записаться / Заказать
            </Button>
          </div>
        </header>

        {/* NICHE HERO SECTION */}
        <section id="hero" className="niche-hero">
          <div className="niche-hero-grid">
            <div className="niche-hero-content">
              <span className="badge badge-accent mb-12">Демонстрация работы ниши</span>
              <h1 className="niche-hero-title">{category.heroTitle}</h1>
              <p className="niche-hero-desc">{category.heroDescription}</p>

              <div className="niche-hero-buttons">
                <Button variant="primary" icon={ArrowRight} onClick={() => onOpenContactModal(category.title)}>
                  Оставить заявку
                </Button>
                <a href="#catalog">
                  <Button variant="outline">Смотреть услуги</Button>
                </a>
              </div>

              <div className="niche-features-pills">
                {category.features.map((feat, i) => (
                  <span key={i} className="niche-pill">
                    <CheckCircle size={14} className="pill-check" /> {feat}
                  </span>
                ))}
              </div>
            </div>

            <div className="niche-hero-media">
              <img src={category.image} alt={category.heroTitle} className="niche-hero-img" />
            </div>
          </div>
        </section>

        {/* DYNAMIC CATALOG / CONTENT SECTION */}
        <section id="catalog" className="niche-section">
          <div className="niche-section-header">
            <h2 className="niche-section-title">
              {category.slug === 'store' ? 'Каталог популярных товаров' : 
               category.slug === 'education' ? 'Программа обучения' : 
               category.slug === 'clinic' ? 'Наши врачи и специалисты' : 'Услуги и решения'}
            </h2>
            <p className="niche-section-desc">Качественное решение с мгновенной обработкой заявок</p>
          </div>

          {/* STORE PRODUCTS */}
          {category.slug === 'store' && (
            <div className="niche-cards-grid">
              {category.products.map((item) => (
                <Card key={item.id} className="niche-product-card">
                  <div className="niche-card-img-box">
                    <img src={item.image} alt={item.name} />
                    <span className="product-tag-badge">{item.tag}</span>
                  </div>
                  <div className="niche-card-body">
                    <h4>{item.name}</h4>
                    <div className="product-price-row">
                      <span className="product-price">{item.price}</span>
                      <Button variant="primary" size="small" onClick={() => setCartCount(cartCount + 1)}>
                        В корзину
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* EDUCATION MODULES */}
          {category.slug === 'education' && (
            <div className="niche-list-stack">
              {category.modules.map((mod, i) => (
                <Card key={i} className="module-item-card">
                  <span className="mod-num">{mod.num}</span>
                  <div className="mod-info">
                    <h4>{mod.title}</h4>
                    <span className="mod-dur"><Clock size={14} /> {mod.duration}</span>
                  </div>
                  <Button variant="outline" size="small" onClick={() => onOpenContactModal(category.title)}>
                    Подробнее
                  </Button>
                </Card>
              ))}
            </div>
          )}

          {/* CLINIC DOCTORS */}
          {category.slug === 'clinic' && (
            <div className="niche-cards-grid">
              {category.doctors.map((doc, i) => (
                <Card key={i} className="doctor-card">
                  <div className="doctor-avatar">
                    <Users size={32} />
                  </div>
                  <h4>{doc.name}</h4>
                  <p className="doctor-spec">{doc.spec}</p>
                  <span className="doctor-exp">{doc.exp}</span>
                  <Button variant="secondary" size="small" onClick={() => onOpenContactModal(category.title)}>
                    Записаться на прием
                  </Button>
                </Card>
              ))}
            </div>
          )}

          {/* SERVICES LIST (SERVICES & CLEANING) */}
          {(category.slug === 'services' || category.slug === 'cleaning') && (
            <div className="niche-cards-grid">
              {category.servicesList?.map((serv, i) => (
                <Card key={i} className="service-card">
                  <Award className="service-icon" size={28} />
                  <h4>{serv.title}</h4>
                  <p>{serv.desc}</p>
                  <Button variant="outline" size="small" onClick={() => onOpenContactModal(category.title)}>
                    Заказать услугу
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* REVIEWS & TRUST */}
        <section id="reviews" className="niche-section niche-section-alt">
          <div className="niche-section-header">
            <h2 className="niche-section-title">Отзывы наших клиентов</h2>
            <p className="niche-section-desc">Нам доверяют более 500+ довольных клиентов</p>
          </div>

          <div className="niche-reviews-grid">
            <Card className="review-card">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="star-filled" />)}
              </div>
              <p className="review-text">«Прекрасный сервис и высокое качество! Сайт работает безупречно быстро, конверсия выросла на 40%.»</p>
              <span className="review-author">Ольга Маркова — Предприниматель</span>
            </Card>
            <Card className="review-card">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="star-filled" />)}
              </div>
              <p className="review-text">«Оформление заявки в 1 клик, клиенты хвалят удобную мобильную версию. Очень доволен!»</p>
              <span className="review-author">Дмитрий Васильев — Руководитель компании</span>
            </Card>
          </div>
        </section>

        {/* NICHE CONTACT FORM */}
        <section id="contact" className="niche-section">
          <Card className="niche-lead-box">
            <div className="niche-lead-info">
              <h3>Готовы обсудить ваш проект?</h3>
              <p>Оставьте контактные данные — мы перезвоним в течение 15 минут.</p>
              <div className="niche-lead-contacts">
                <span><Phone size={16} /> +7 (900) 000-00-00</span>
                <span><Send size={16} /> Telegram: @nebula_agency</span>
              </div>
            </div>

            <div className="niche-lead-form">
              <Button variant="primary" size="large" onClick={() => onOpenContactModal(category.title)}>
                Обсудить этот сайт под вашу нишу
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};
