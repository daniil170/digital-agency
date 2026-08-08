import React from 'react';
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import './DemoBanner.css';

export const DemoBanner = ({ categoryTitle, onOpenContactModal }) => {
  return (
    <div className="demo-banner-wrapper">
      <div className="container">
        <div className="demo-banner">
          <div className="demo-banner-content">
            <div className="demo-banner-badge">
              <Zap size={14} className="banner-icon" />
              Это демо-пример — так может выглядеть ваш сайт
            </div>
            <p className="demo-banner-note">
              Выберите оптимальный подход для вашей задачи ({categoryTitle}):
            </p>
          </div>

          <div className="demo-banner-options">
            <div className="banner-option">
              <div className="option-title">
                <CheckCircle2 size={16} className="opt-icon" />
                Готовое решение на основе шаблона
              </div>
              <p className="option-desc">Быстрый запуск от 5 дней и доступная цена</p>
            </div>

            <div className="banner-option option-highlight">
              <div className="option-title">
                <CheckCircle2 size={16} className="opt-icon opt-accent" />
                Кастомный дизайн под ваш бренд
              </div>
              <p className="option-desc">Полностью уникальный сайт, функция за функцией</p>
            </div>
          </div>

          <div className="demo-banner-footer">
            <span className="price-disclaimer">
              * Точная стоимость обсуждается индивидуально после заполнения брифа
            </span>
            <Button 
              variant="primary" 
              size="small" 
              icon={ArrowRight}
              onClick={() => onOpenContactModal(categoryTitle)}
            >
              Обсудить этот проект
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
