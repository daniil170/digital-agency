import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Section } from '../components/ui/Section';
import { realProjects, demoCategories, agencyWorkflow } from '../data/siteData';
import './Home.css';

export const Home = ({ onOpenContactModal }) => {
  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-background-glow"></div>
        <div className="container hero-container">
          <div className="hero-content">
            <span className="badge badge-accent fade-in">Digital Agency & Design Studio</span>
            <h1 className="hero-title fade-in">
              Создаем сайты, которые <span className="text-gradient">растут вместе с вашим бизнесом</span>
            </h1>
            <p className="hero-description fade-in">
              Разрабатываем высококонверсионные интернет-магазины, сервисные сайты и сложные платформы. 
              Премиальный тёмный минимализм, максимальная скорость загрузки и адаптивность под мобильные устройства.
            </p>
            <div className="hero-cta fade-in">
              <Button variant="primary" size="large" onClick={onOpenContactModal} icon={ArrowRight}>
                Обсудить проект
              </Button>
              <Link to="/demo">
                <Button variant="outline" size="large">
                  Смотреть демо-примеры
                </Button>
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">40+</span>
                <span className="stat-label">Запущенных проектов</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Адаптивность под Mobile</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5 дн.</span>
                <span className="stat-label">Скорость запуска</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <Section
        id="workflow"
        subtitle="Процесс"
        title="Как мы работаем"
        description="Прозрачный процесс от первичного брифа до первого клиента с вашего нового сайта."
        centered
      >
        <div className="workflow-grid">
          {agencyWorkflow.map((item, idx) => (
            <Card key={idx} className="workflow-card">
              <span className="workflow-step">{item.step}</span>
              <h3 className="workflow-title">{item.title}</h3>
              <p className="workflow-desc">{item.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* REAL PROJECTS PREVIEW */}
      <Section
        id="portfolio-preview"
        subtitle="Портфолио"
        title="Реальные проекты"
        description="Примеры разработанных сайтов с высокой скоростью и удобной архитектурой."
      >
        <div className="projects-grid">
          {realProjects.map((project) => (
            <Card key={project.id} className="project-card">
              <div className="project-img-wrapper">
                <img src={project.image} alt={project.title} className="project-img" />
                <div className="project-category-tag">{project.category}</div>
              </div>
              <div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((t, i) => (
                    <span key={i} className="project-tag">{t}</span>
                  ))}
                </div>
                {project.isReal ? (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                    Перейти на сайт <ArrowRight size={16} />
                  </a>
                ) : (
                  <button onClick={onOpenContactModal} className="project-link placeholder-btn">
                    Заказать подобный проект <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
        <div className="section-footer-cta">
          <Link to="/portfolio">
            <Button variant="secondary" icon={ArrowRight}>
              Все проекты в портфолио
            </Button>
          </Link>
        </div>
      </Section>

      {/* DEMO CATEGORIES PREVIEW */}
      <Section
        id="demo-categories"
        subtitle="Демо-макеты"
        title="Готовые концепты под вашу нишу"
        description="Изучите интерактивные образцы сайтов для разных типов бизнеса."
        centered
      >
        <div className="categories-grid">
          {demoCategories.map((cat) => (
            <Link key={cat.id} to={`/demo/${cat.slug}`} className="category-card-link">
              <Card className="category-card">
                <div className="category-image-wrap">
                  <img src={cat.image} alt={cat.title} className="category-image" />
                  <div className="category-badge">Демо</div>
                </div>
                <div className="category-body">
                  <h3 className="category-title">{cat.title}</h3>
                  <p className="category-desc">{cat.description}</p>
                  <span className="category-cta">
                    Открыть демо-сайт <ArrowRight size={16} />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* WHY CHOOSE US */}
      <Section id="benefits" title="Почему выбирают нас" subtitle="Преимущества" centered>
        <div className="benefits-grid">
          <div className="benefit-item">
            <Sparkles className="benefit-icon" size={32} />
            <h3>Тёмный чистый стиль</h3>
            <p>Премиальная эстетика без мусора, подчеркивающая статус вашего продукта.</p>
          </div>
          <div className="benefit-item">
            <Zap className="benefit-icon" size={32} />
            <h3>Высокая скорость</h3>
            <p>Загрузка менее 1 секунды, безупречные показатели Google PageSpeed.</p>
          </div>
          <div className="benefit-item">
            <ShieldCheck className="benefit-icon" size={32} />
            <h3>Гарантия конверсий</h3>
            <p>Продуманные сценарии захвата внимания и лидогенерации на всех устройствах.</p>
          </div>
        </div>
      </Section>
    </div>
  );
};
