import React, { useState, useEffect } from 'react';
import { 
  Lock, LogOut, KeyRound, Search, Table, RefreshCw, Sparkles, AlertCircle, Send, CheckCircle2
} from 'lucide-react';
import { 
  fetchLeads, updateLeadStatus, checkIsAdminAuthenticated, loginAdmin, logoutAdmin 
} from '../firebase/config';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Section } from '../components/ui/Section';
import { LeadFinderForm } from '../components/admin/LeadFinderForm';
import { LeadsTable } from '../components/admin/LeadsTable';
import { LeadsKanban } from '../components/admin/LeadsKanban';
import './Admin.css';
import '../components/admin/AdminLeads.css';

export const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('finder'); // 'finder' | 'table'

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
        description="Мониторинг заявок, парсинг бизнесов без сайтов (2GIS / Overpass) и генерация AI-офферов."
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
              <span className="stat-lbl">Всего лидов</span>
            </div>
            <div className="stat-card accent">
              <span className="stat-val">{leads.filter(l => (l.status || 'new') === 'new').length}</span>
              <span className="stat-lbl">Новых</span>
            </div>
            <div className="stat-card progress">
              <span className="stat-val">{leads.filter(l => ['contacted', 'in_progress', 'replied'].includes(l.status)).length}</span>
              <span className="stat-lbl">В работе / Связались</span>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="admin-tab-switcher">
            <button 
              className={`admin-tab-btn ${activeTab === 'finder' ? 'active' : ''}`}
              onClick={() => setActiveTab('finder')}
            >
              <Sparkles size={16} /> Поиск лидов (Lead Finder)
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'table' ? 'active' : ''}`}
              onClick={() => setActiveTab('table')}
            >
              <Table size={16} /> Таблица ({leads.length})
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'kanban' ? 'active' : ''}`}
              onClick={() => setActiveTab('kanban')}
            >
              <CheckCircle2 size={16} /> Доска (Канбан)
            </button>
          </div>
        </div>

        {/* Tab 1: Lead Finder & Main View */}
        {activeTab === 'finder' && (
          <div className="finder-tab-content">
            <LeadFinderForm onLeadsUpdated={loadLeads} />
            <div className="section-divider">
              <h3>База лидов</h3>
            </div>
            <LeadsTable 
              leads={leads} 
              onStatusChange={handleStatusChange}
              onRefresh={loadLeads}
              loading={loading}
            />
          </div>
        )}

        {/* Tab 2: Full Leads Table */}
        {activeTab === 'table' && (
          <div className="table-tab-content">
            <LeadsTable 
              leads={leads} 
              onStatusChange={handleStatusChange}
              onRefresh={loadLeads}
              loading={loading}
            />
          </div>
        )}

        {/* Tab 3: Kanban Board */}
        {activeTab === 'kanban' && (
          <div className="kanban-tab-content">
            <LeadsKanban 
              leads={leads} 
              onStatusChange={handleStatusChange}
              onRefresh={loadLeads}
              loading={loading}
            />
          </div>
        )}
      </Section>
    </div>
  );
};
