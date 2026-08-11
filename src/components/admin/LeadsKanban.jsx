import React, { useState } from 'react';
import { Phone, MapPin, Send, CheckCircle2, Clock, AlertCircle, XCircle, Trash2, Copy, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { bulkDeleteLeads } from '../../firebase/config';

export const LeadsKanban = ({ leads, onStatusChange, onRefresh, loading }) => {
  const [copiedId, setCopiedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const COLUMNS = [
    { id: 'new', title: 'Новые', icon: <AlertCircle size={14} />, color: '#8b5cf6' },
    { id: 'contacted', title: 'Связались', icon: <Send size={14} />, color: '#60a5fa' },
    { id: 'replied', title: 'Ответили', icon: <CheckCircle2 size={14} />, color: '#10b981' },
    { id: 'in_progress', title: 'В работе', icon: <Clock size={14} />, color: '#f59e0b' },
    { id: 'closed', title: 'Успех', icon: <CheckCircle2 size={14} />, color: '#10b981' },
    { id: 'declined', title: 'Отказ', icon: <XCircle size={14} />, color: '#ef4444' }
  ];

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
      if (cleanDigits.startsWith('8')) {
        return `https://wa.me/7${cleanDigits.substring(1)}`;
      }
      return `https://wa.me/${cleanDigits}`;
    }
    return '#';
  };

  const handleBulkDelete = async (columnId, columnLeads) => {
    if (columnLeads.length === 0) return;
    const confirmMessage = `ВЫ УВЕРЕНЫ? Вы хотите безвозвратно удалить все лиды (${columnLeads.length} шт.) из колонки?`;
      
    if (window.confirm(confirmMessage)) {
      setIsDeleting(true);
      try {
        const idsToDelete = columnLeads.map(l => l.id);
        await bulkDeleteLeads(idsToDelete);
        if (onRefresh) await onRefresh();
      } catch (error) {
        alert('Ошибка при удалении лидов. Подробности в консоли.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <Card className="table-loading-card">
        <p>Загрузка списка лидов из базы данных...</p>
      </Card>
    );
  }

  return (
    <div className="kanban-board-container">
      <div className="kanban-scroll-wrapper">
        {COLUMNS.map(col => {
          const colLeads = leads.filter(l => (l.status || 'new') === col.id);
          
          return (
            <div key={col.id} className="kanban-column">
              <div className="kanban-column-header" style={{ borderBottomColor: col.color }}>
                <div className="kanban-header-title">
                  <span className="col-icon" style={{ color: col.color }}>{col.icon}</span>
                  <span className="col-title">{col.title}</span>
                  <span className="col-count">{colLeads.length}</span>
                </div>
                {colLeads.length > 0 && (
                  <button 
                    className="col-delete-btn" 
                    title="Очистить колонку"
                    onClick={() => handleBulkDelete(col.id, colLeads)}
                    disabled={isDeleting}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              
              <div className="kanban-column-body">
                {colLeads.map(lead => {
                  const businessTitle = lead.businessName || lead.name || 'Без названия';
                  const sphereText = lead.sphere || lead.businessType || 'Общий бизнес';
                  const phoneText = lead.phone || lead.contact || 'Не указан';
                  const messageText = lead.message || 'Сообщение не сгенерировано';
                  const addressText = lead.address || lead.city || '';

                  return (
                    <div key={lead.id} className="kanban-card">
                      <div className="kanban-card-header">
                        <strong>{businessTitle}</strong>
                        <select 
                          className="kanban-status-select"
                          value={col.id}
                          onChange={(e) => onStatusChange(lead.id, e.target.value)}
                        >
                          {COLUMNS.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                      </div>
                      <div className="kanban-card-meta">
                        <span className="b-sphere">{sphereText}</span>
                        {addressText && <span className="b-address"><MapPin size={10} /> {addressText}</span>}
                      </div>
                      
                      <div className="kanban-card-contact">
                        <span className="phone-num"><Phone size={11} /> {phoneText}</span>
                        {phoneText !== 'Не указан' && (
                          <a 
                            href={formatPhoneForChat(phoneText)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="whatsapp-quick-link"
                          >
                            <Send size={10} /> WA
                          </a>
                        )}
                      </div>
                      
                      <div className="kanban-card-actions">
                        <button 
                          className={`copy-msg-btn-small ${copiedId === lead.id ? 'copied' : ''}`}
                          onClick={() => handleCopyMessage(lead.id, messageText)}
                        >
                          {copiedId === lead.id ? <Check size={11} /> : <Copy size={11} />} Скопировать текст
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
