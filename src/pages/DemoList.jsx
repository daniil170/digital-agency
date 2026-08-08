import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, GraduationCap, Briefcase, Activity, Sparkles, ArrowRight, Check } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { demoCategories } from '../data/siteData';
import './DemoList.css';

const getCategoryIcon = (iconName) => {
  switch (iconName) {
    case 'ShoppingBag': return <ShoppingBag size={28} className="demo-cat-icon" />;
    case 'GraduationCap': return <GraduationCap size={28} className="demo-cat-icon" />;
    case 'Briefcase': return <Briefcase size={28} className="demo-cat-icon" />;
    case 'Activity': return <Activity size={28} className="demo-cat-icon" />;
    case 'Sparkles': return <Sparkles size={28} className="demo-cat-icon" />;
    default: return <Briefcase size={28} className="demo-cat-icon" />;
  }
};

export const DemoList = ({ onOpenContactModal }) => {
  return (
    <div className="demo-list-page">
      <Section
        id="demo-list-hero"
        badge="Каталог решений"
        title="Демо-макеты по нишам"
        description="Интерактивные шаблоны сайтов, адаптированные под требования конкретных отраслей бизнеса. Посмотрите, как может выглядеть ваш будущий проект."
        className="demo-hero-section"
      >
        <div className="demo-categories-grid">
          {demoCategories.map((cat) => (
            <Card key={cat.id} className="demo-niche-card">
              <div className="demo-niche-img-box">
                <img src={cat.image} alt={cat.title} className="demo-niche-img" />
                <div className="demo-niche-icon-pill">
                  {getCategoryIcon(cat.iconName)}
                </div>
              </div>

              <div className="demo-niche-content">
                <span className="demo-niche-subtitle">{cat.subtitle}</span>
                <h3 className="demo-niche-title">{cat.title}</h3>
                <p className="demo-niche-desc">{cat.description}</p>

                <div className="demo-niche-features">
                  {cat.features.map((feat, idx) => (
                    <div key={idx} className="niche-feat-item">
                      <Check size={14} className="feat-check" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="demo-niche-action">
                  <Link to={`/demo/${cat.slug}`} className="demo-open-link">
                    <Button variant="primary" size="medium" icon={ArrowRight}>
                      Просмотреть демо-сайт
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="demo-custom-cta" title="Не нашли свою нишу?" subtitle="Индивидуальное решение" centered>
        <p className="demo-custom-desc">
          Мы разрабатываем уникальные сайты с нуля под любую сферу бизнеса. Подготовим бесплатный концепт под ваши задачи.
        </p>
        <Button variant="outline" size="large" onClick={onOpenContactModal} icon={ArrowRight}>
          Обсудить индивидуальный проект
        </Button>
      </Section>
    </div>
  );
};
