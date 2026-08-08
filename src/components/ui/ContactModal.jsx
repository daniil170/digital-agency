import React, { useState } from 'react';
import { X, Send, CheckCircle, MessageSquare, Phone } from 'lucide-react';
import { Button } from '../ui/Button';
import './ContactModal.css';

export const ContactModal = ({ isOpen, onClose, initialNiche = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    businessType: initialNiche || '',
    contact: '',
    budget: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after success
    }, 4000);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close Modal">
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <div className="modal-header">
              <span className="badge badge-accent">Обсудить проект</span>
              <h3 className="modal-title">Начните работу с нами</h3>
              <p className="modal-desc">
                Заполните форму, и мы свяжемся с вами в течение 30 минут для обсуждения задач и расчета точной стоимости.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Ваше имя *</label>
                <input 
                  type="text" 
                  id="name" 
                  required 
                  placeholder="Иван Петров"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="businessType">Тип бизнеса / Ниша</label>
                <input 
                  type="text" 
                  id="businessType" 
                  placeholder="Интернет-магазин, Клиника, Услуги..."
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact">Telegram / Телефон *</label>
                <input 
                  type="text" 
                  id="contact" 
                  required 
                  placeholder="@username или +7 (999) 000-00-00"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="budget">Ориентировочный бюджет (необязательно)</label>
                <select 
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                >
                  <option value="">Выберите диапазон</option>
                  <option value="ready">Готовое решение (до 100k ₽)</option>
                  <option value="custom">Кастомный сайт под ключ (100k - 250k ₽)</option>
                  <option value="premium">Сложная система / Экосистема (250k+ ₽)</option>
                </select>
              </div>

              <Button type="submit" variant="primary" icon={Send} className="modal-submit-btn">
                Отправить заявку
              </Button>
            </form>

            <div className="modal-direct-contacts">
              <p className="direct-title">Или напишите напрямую:</p>
              <div className="direct-buttons">
                <a href="https://t.me/telegram" target="_blank" rel="noopener noreferrer" className="direct-link tg">
                  <Send size={16} /> Telegram
                </a>
                <a href="https://wa.me/79000000000" target="_blank" rel="noopener noreferrer" className="direct-link wa">
                  <MessageSquare size={16} /> WhatsApp
                </a>
              </div>
            </div>
          </>
        ) : (
          <div className="modal-success">
            <CheckCircle size={56} className="success-icon" />
            <h3>Заявка успешно отправлена!</h3>
            <p>Спасибо! Мы уже изучили ваши вводные и свяжемся с вами совсем скоро.</p>
            <Button variant="secondary" onClick={handleReset}>
              Закрыть
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
