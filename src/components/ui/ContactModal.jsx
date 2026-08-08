import React, { useState } from 'react';
import { X, Send, CheckCircle, MessageSquare, Phone } from 'lucide-react';
import { Button } from '../ui/Button';
import { createLead } from '../../firebase/config';
import './ContactModal.css';

export const ContactModal = ({ isOpen, onClose, initialNiche = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    businessType: initialNiche || '',
    contact: '',
    budget: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await createLead({
      ...formData,
      businessType: formData.businessType || initialNiche || 'Общий запрос',
      country: 'Казахстан'
    });

    setLoading(false);
    setSubmitted(true);
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
              <span className="badge badge-accent">Обсудить проект в Казахстане</span>
              <h3 className="modal-title">Начните работу с нами</h3>
              <p className="modal-desc">
                Заполните форму, и мы свяжемся с вами в течение 15 минут для обсуждения задач и расчета стоимости в тенге (₸).
              </p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Ваше имя *</label>
                <input 
                  type="text" 
                  id="name" 
                  required 
                  placeholder="Ануар / Динара"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="businessType">Тип бизнеса / Город в Казахстане</label>
                <input 
                  type="text" 
                  id="businessType" 
                  placeholder="Интернет-магазин, Клиника (Алматы / Астана)..."
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact">Telegram / WhatsApp / Телефон *</label>
                <input 
                  type="text" 
                  id="contact" 
                  required 
                  placeholder="@username или +7 (771) 440-0971"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="budget">Ориентировочный бюджет (в тенге ₸)</label>
                <select 
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                >
                  <option value="">Выберите диапазон стоимости</option>
                  <option value="ready">Готовое решение (до 450 000 ₸)</option>
                  <option value="custom">Кастомный сайт под ключ (450 000 - 1 200 000 ₸)</option>
                  <option value="premium">Сложная экосистема / AI-платформа (1 200 000+ ₸)</option>
                </select>
              </div>

              <Button type="submit" variant="primary" icon={Send} disabled={loading} className="modal-submit-btn">
                {loading ? 'Отправка в базы данных...' : 'Отправить заявку'}
              </Button>
            </form>

            <div className="modal-direct-contacts">
              <p className="direct-title">Или напишите нам напрямую в Казахстане:</p>
              <div className="direct-buttons">
                <a href="https://t.me/cunicad" target="_blank" rel="noopener noreferrer" className="direct-link tg">
                  <Send size={16} /> @cunicad
                </a>
                <a href="https://wa.me/77714400971" target="_blank" rel="noopener noreferrer" className="direct-link wa">
                  <MessageSquare size={16} /> WhatsApp
                </a>
              </div>
            </div>
          </>
        ) : (
          <div className="modal-success">
            <CheckCircle size={56} className="success-icon" />
            <h3>Заявка успешно сохранена в Firebase!</h3>
            <p>Спасибо! Мы уже изучили ваши вводные и свяжемся с вами в Telegram или WhatsApp совсем скоро.</p>
            <Button variant="secondary" onClick={handleReset}>
              Закрыть
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
