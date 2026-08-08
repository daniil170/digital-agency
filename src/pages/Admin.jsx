import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, RefreshCw, Send, Lock, Clock, 
  CheckCircle2, AlertCircle, Filter, LogOut, KeyRound
} from 'lucide-react';
import { 
  fetchLeads, updateLeadStatus, checkIsAdminAuthenticated, loginAdmin, logoutAdmin 
} from '../firebase/config';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Section } from '../components/ui/Section';
import './Admin.css';

export const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const authState = checkIsAdminAuthenticated();
    setIsAuthenticated(authState);
    if (authState) {
      loadLeads();
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const success = loginAdmin(pinInput);
    if (success) {
      setIsAuthenticated(true);
      setPinError(false);
      loadLeads();
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setPinInput('');
  };

  const loadLeads = async () => {
    setLoading(true);
    const data = await fetchLeads();
    setLeads(data);
    setLoading(false);
  };

  const handleStatusChange = async (leadId, newStatus) => {
    const updated = await updateLeadStatus(leadId, newStatus);
    if (updated) {
      setLeads(updated);
    } else {
      loadLeads();
    }
  };

  const filteredLeads = leads.filter(l => {
    if (statusFilter === 'all') return true;
    return l.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="status-tag tag-new"><AlertCircle size={12} /> Новый</span>;
      case 'in_progress':
        return <span className="status-tag tag-progress"><Clock size={12} /> В работе</span>;
      case 'closed':
        return <span className="status-tag tag-closed"><CheckCircle2 size={12} /> Завершен</span>;
      default:
        return <span className="status-tag tag-new">Новый</span>;
    }
  };

  const formatContactLink = (contact) => {
    if (!contact) return '#';
    if (contact.startsWith('@')) {
      return `https://t.me/${contact.replace('@', '')}`;
    }
    const cleanPhone = contact.replace(/[^0-9]/g, '');
    if (cleanPhone.length >= 10) {
      return `https://wa.me/${cleanPhone}`;
    }
    return `https://t.me/cunicad`;
  };

  // If NOT Authenticated: Show PIN Login Form
  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <Section id="admin-login" className="admin-login-section">
          <Card className="admin-login-card">
            <div className="admin-login-header">
              <div className="lock-icon-circle">
                <Lock size={28} />
              </div>
              <h2>Защищенный вход в админку</h2>
              <p>WEBORA AGENCY — Панель управления лидами</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="admin-login-form">
              <div className="form-group">
                <label htmlFor="adminPin">Введите PIN-код доступа:</label>
                <input 
                  type="password" 
                  id="adminPin"
                  required
                  placeholder="****"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                />
              </div>

              {pinError && (
                <p className="pin-error-msg">
                  Неверный PIN-код доступа! Обратитесь к администратору @cunicad.
                </p>
              )}

              <Button type="submit" variant="primary" icon={KeyRound} className="w-100">
                Войти в систему
              </Button>
            </form>
          </Card>
        </Section>
      </div>
    );
  }

  // If Authenticated: Show Admin Dashboard
  return (
    <div className="admin-page">
      <Section
        id="admin-dashboard"
        badge="Защищенный доступ"
        title="Панель управления лидами (WEBORA)"
        description="Конфиденциальный список клиентов и заявок с вашего сайта. Доступ разрешен только администратору."
        className="admin-section"
      >
        <div className="admin-top-action-bar">
          <Button variant="outline" size="small" icon={LogOut} onClick={handleLogout}>
            Выйти из админки
          </Button>
        </div>

        <div className="admin-controls">
          <div className="admin-stats-summary">
            <div className="stat-card">
              <span className="stat-val">{leads.length}</span>
              <span className="stat-lbl">Всего заявок</span>
            </div>
            <div className="stat-card accent">
              <span className="stat-val">{leads.filter(l => l.status === 'new').length}</span>
              <span className="stat-lbl">Новых лидов</span>
            </div>
            <div className="stat-card progress">
              <span className="stat-val">{leads.filter(l => l.status === 'in_progress').length}</span>
              <span className="stat-lbl">В работе</span>
            </div>
          </div>

          <div className="admin-filter-bar">
            <div className="filter-group">
              <Filter size={16} />
              <span>Фильтр по статусу:</span>
              <button 
                className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                Все ({leads.length})
              </button>
              <button 
                className={`filter-pill ${statusFilter === 'new' ? 'active' : ''}`}
                onClick={() => setStatusFilter('new')}
              >
                Новые
              </button>
              <button 
                className={`filter-pill ${statusFilter === 'in_progress' ? 'active' : ''}`}
                onClick={() => setStatusFilter('in_progress')}
              >
                В работе
              </button>
              <button 
                className={`filter-pill ${statusFilter === 'closed' ? 'active' : ''}`}
                onClick={() => setStatusFilter('closed')}
              >
                Завершенные
              </button>
            </div>

            <Button variant="secondary" size="small" icon={RefreshCw} onClick={loadLeads}>
              Обновить данные
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">
            <RefreshCw className="spin-icon" size={32} />
            <p>Загрузка заявок из Firebase...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <Card className="empty-leads">
            <p>Заявок с выбранным фильтром не найдено.</p>
          </Card>
        ) : (
          <div className="leads-grid">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className={`lead-card lead-border-${lead.status}`}>
                <div className="lead-header">
                  <h3 className="lead-name">{lead.name || 'Анонимный клиент'}</h3>
                  {getStatusBadge(lead.status)}
                </div>

                <div className="lead-meta">
                  <p><strong>Ниша/город:</strong> {lead.businessType || 'Не указано'}</p>
                  <p><strong>Контакты:</strong> <span className="lead-contact-text">{lead.contact}</span></p>
                  {lead.budget && <p><strong>Бюджет (₸):</strong> {lead.budget}</p>}
                  <p className="lead-time">
                    <Clock size={12} /> {lead.createdAt ? new Date(lead.createdAt).toLocaleString('ru-RU') : 'Недавно'}
                  </p>
                </div>

                <div className="lead-actions">
                  <a 
                    href={formatContactLink(lead.contact)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="lead-chat-btn"
                  >
                    <Send size={14} /> Написать клиенту
                  </a>

                  <div className="status-dropdown">
                    <select 
                      value={lead.status || 'new'} 
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    >
                      <option value="new">Новый</option>
                      <option value="in_progress">В работе</option>
                      <option value="closed">Завершен</option>
                    </select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};
