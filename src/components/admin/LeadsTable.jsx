import React, { useState } from 'react';
import { 
  Copy, Check, Send, Phone, MapPin, Building, Filter, 
  AlertCircle, CheckCircle2, XCircle, MessageSquare, Clock, Trash2 
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { bulkDeleteLeads } from '../../firebase/config';

export const LeadsTable = ({ leads, onStatusChange, onRefresh, loading }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyMessage = (leadId, text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(leadId);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const formatPhoneForChat = (phone) => {
    if (!phone) return '#';
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length >= 10) {
      const formatted = cleanDigits.startsWith('8') ? '7' + cleanDigits.substring(1) : cleanDigits;
      return `https://wa.me/${formatted}`;
    }
    return '#';
  };

  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest' | 'status'

  const filteredLeads = leads.filter(l => {
    if (statusFilter === 'all') return true;
    return (l.status || 'new') === statusFilter;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortOrder === 'status') {
      const statusA = a.status || 'new';
      const statusB = b.status || 'new';
      return statusA.localeCompare(statusB);
    }
    
    // Sort by date (createdAt)
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    
    if (sortOrder === 'oldest') {
      return dateA - dateB;
    }
    return dateB - dateA; // default newest
  });

  const handleBulkDelete = async () => {
    if (filteredLeads.length === 0) return;
    const confirmMessage = statusFilter === 'all' 
      ? `ВЫ УВЕРЕНЫ? Это безвозвратно удалит ВСЕ ${leads.length} лидов из базы!` 
      : `Удалить все отфильтрованные лиды (${filteredLeads.length} шт.)?`;
      
    if (window.confirm(confirmMessage)) {
      setIsDeleting(true);
      try {
        const idsToDelete = filteredLeads.map(l => l.id);
        await bulkDeleteLeads(idsToDelete);
        if (onRefresh) await onRefresh();
      } catch (error) {
        alert('Ошибка при удалении лидов. Подробности в консоли.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="status-badge badge-new"><AlertCircle size={12} /> Новый</span>;
      case 'contacted':
        return <span className="status-badge badge-contacted"><Send size={12} /> Связались</span>;
      case 'replied':
        return <span className="status-badge badge-replied"><CheckCircle2 size={12} /> Ответил</span>;
      case 'declined':
        return <span className="status-badge badge-declined"><XCircle size={12} /> Отказ</span>;
      case 'in_progress':
        return <span className="status-badge badge-progress"><Clock size={12} /> В работе</span>;
      case 'closed':
        return <span className="status-badge badge-closed"><CheckCircle2 size={12} /> Завершен</span>;
      default:
        return <span className="status-badge badge-new">Новый</span>;
    }
  };

  return (
    <div className="leads-table-wrapper">
      {/* Controls & Filter Bar */}
      <div className="table-controls-bar">
        <div className="filter-pills-row">
          <Filter size={16} className="filter-icon" />
          <span className="filter-label">Фильтр:</span>
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
            Новые ({leads.filter(l => (l.status || 'new') === 'new').length})
          </button>
          <button 
            className={`filter-pill ${statusFilter === 'contacted' ? 'active' : ''}`}
            onClick={() => setStatusFilter('contacted')}
          >
            Связались ({leads.filter(l => l.status === 'contacted').length})
          </button>
          <button 
            className={`filter-pill ${statusFilter === 'replied' ? 'active' : ''}`}
            onClick={() => setStatusFilter('replied')}
          >
            Ответили ({leads.filter(l => l.status === 'replied').length})
          </button>
          <button 
            className={`filter-pill ${statusFilter === 'declined' ? 'active' : ''}`}
            onClick={() => setStatusFilter('declined')}
          >
            Отказ ({leads.filter(l => l.status === 'declined').length})
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="status-select-dropdown"
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
            <option value="status">Сортировка по статусу</option>
          </select>
          {onRefresh && (
            <Button variant="secondary" size="small" onClick={onRefresh} disabled={loading || isDeleting}>
              Обновить
            </Button>
          )}
          <Button 
            variant="danger" 
            size="small" 
            onClick={handleBulkDelete} 
            disabled={loading || isDeleting || filteredLeads.length === 0}
            style={{ backgroundColor: '#ef4444', color: 'white', border: 'none' }}
          >
            <Trash2 size={14} style={{ marginRight: '6px' }} />
            {isDeleting ? 'Удаление...' : 'Очистить'}
          </Button>
        </div>
      </div>

      {loading ? (
        <Card className="table-loading-card">
          <p>Загрузка списка лидов из базы данных...</p>
        </Card>
      ) : sortedLeads.length === 0 ? (
        <Card className="table-empty-card">
          <p>Лидов с выбранным статусом не найдено.</p>
        </Card>
      ) : (
        <div className="responsive-table-container">
          <table className="leads-data-table">
            <thead>
              <tr>
                <th>Организация / Сфера</th>
                <th>Телефон / Контакт</th>
                <th className="th-message">Персонализированное сообщение (AI)</th>
                <th>Статус</th>
                <th className="text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {sortedLeads.map((lead) => {
                const businessTitle = lead.businessName || lead.name || 'Без названия';
                const sphereText = lead.sphere || lead.businessType || 'Общий бизнес';
                const phoneText = lead.phone || lead.contact || 'Не указан';
                const messageText = lead.message || 'Сообщение не сгенерировано';
                const addressText = lead.address || lead.city || '';
                const statusVal = lead.status || 'new';

                return (
                  <tr key={lead.id} className={`lead-row row-status-${statusVal}`}>
                    {/* Column 1: Business / Sphere */}
                    <td className="td-business">
                      <div className="business-name-box">
                        <strong className="b-title">{businessTitle}</strong>
                        <span className="b-sphere">{sphereText}</span>
                        {addressText && (
                          <span className="b-address">
                            <MapPin size={11} /> {addressText}
                          </span>
                        )}
                        {lead.source && (
                          <span className="b-source-tag">{lead.source}</span>
                        )}
                      </div>
                    </td>

                    {/* Column 2: Phone / Contact */}
                    <td className="td-phone">
                      <div className="phone-contact-box">
                        <span className="phone-num">
                          <Phone size={13} /> {phoneText}
                        </span>
                        {phoneText !== 'Не указан' && (
                          <a 
                            href={formatPhoneForChat(phoneText)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="whatsapp-quick-link"
                            title="Открыть чат в WhatsApp"
                          >
                            <Send size={12} /> WhatsApp
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Column 3: Message */}
                    <td className="td-message">
                      <div className="message-content-box">
                        <p className="message-text">{messageText}</p>
                        <button 
                          className={`copy-msg-btn ${copiedId === lead.id ? 'copied' : ''}`}
                          onClick={() => handleCopyMessage(lead.id, messageText)}
                          title="Скопировать сообщение"
                        >
                          {copiedId === lead.id ? (
                            <>
                              <Check size={13} /> Скопировано!
                            </>
                          ) : (
                            <>
                              <Copy size={13} /> Скопировать
                            </>
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Column 4: Status */}
                    <td className="td-status">
                      <div className="status-cell-box">
                        {getStatusBadge(statusVal)}
                      </div>
                    </td>

                    {/* Column 5: Action (Select) */}
                    <td className="td-actions text-right">
                      <div className="status-select-wrapper">
                        <select 
                          value={statusVal} 
                          onChange={(e) => onStatusChange(lead.id, e.target.value)}
                          className="status-select-dropdown"
                        >
                          <option value="new">Новый</option>
                          <option value="contacted">Связались</option>
                          <option value="replied">Ответил</option>
                          <option value="declined">Отказ</option>
                          <option value="in_progress">В работе</option>
                          <option value="closed">Завершен</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
