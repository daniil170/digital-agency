import React from 'react';
import { ExternalLink, ArrowRight, PlusCircle } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { realProjects } from '../data/siteData';
import './Portfolio.css';

export const Portfolio = ({ onOpenContactModal }) => {
  return (
    <div className="portfolio-page">
      <Section
        id="portfolio-hero"
        badge="Наши работы"
        title="Портфолио проектов"
        description="Кейсы реальных клиентов и демонстрационные макеты. Для каждого проекта разработана уникальная структура, адаптированная под мобильные устройства и SEO."
        className="portfolio-hero-section"
      >
        <div className="portfolio-grid">
          {realProjects.map((project) => (
            <Card key={project.id} className="portfolio-item-card">
              <div className="portfolio-img-container">
                <img src={project.image} alt={project.title} className="portfolio-img" />
                <span className="portfolio-cat-badge">{project.category}</span>
              </div>

              <div className="portfolio-content">
                <div className="portfolio-header-row">
                  <h3 className="portfolio-item-title">{project.title}</h3>
                  {project.isPlaceholder && (
                    <span className="badge badge-accent placeholder-pill">Свободное место</span>
                  )}
                </div>

                <p className="portfolio-item-desc">{project.description}</p>

                <div className="portfolio-tags-list">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="portfolio-tag-chip">{tag}</span>
                  ))}
                </div>

                <div className="portfolio-action-row">
                  {project.isReal ? (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="portfolio-external-btn"
                    >
                      Перейти на сайт <ExternalLink size={16} />
                    </a>
                  ) : (
                    <Button 
                      variant="primary" 
                      size="small" 
                      onClick={onOpenContactModal} 
                      icon={PlusCircle}
                    >
                      Разместить ваш проект
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="portfolio-cta" title="Хотите сайт с подобной конверсией?" subtitle="Старт работ" centered>
        <p className="portfolio-cta-desc">
          Мы разрабатываем сайты с индивидуальным дизайном под ключ за 2-3 недели. Оставьте заявку для расчета сметы.
        </p>
        <Button variant="primary" size="large" onClick={onOpenContactModal} icon={ArrowRight}>
          Обсудить вашу задачу
        </Button>
      </Section>
    </div>
  );
};
