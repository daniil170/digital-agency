import React, { useState, useEffect } from 'react';
import { Search, Loader2, AlertTriangle, CheckCircle2, Info, Sparkles, Building2, MapPin, Globe } from 'lucide-react';
import { executeLeadFinderOverpass, CATEGORY_TAG_PRESETS, getEnvVariable } from '../../services/leadFinder';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const DEFAULT_CITIES = [
  'Алматы',
  'Астана',
  'Шымкент',
  'Караганда',
  'Актобе'
];

export const LeadFinderForm = ({ onLeadsUpdated }) => {
  const [city, setCity] = useState('Алматы');
  const [customCity, setCustomCity] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['beauty', 'auto']);
  const [customCategory, setCustomCategory] = useState('');
  const [maxLeads, setMaxLeads] = useState(50);

  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [logs, setLogs] = useState([]);
  const [errorBanner, setErrorBanner] = useState(null);
  const [successBanner, setSuccessBanner] = useState(null);

  const [hasGroqKey, setHasGroqKey] = useState(true);

  useEffect(() => {
    const groqKey = getEnvVariable('GROQ_API_KEY');
    setHasGroqKey(!!groqKey);
  }, []);

  const handleCategoryToggle = (catId) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter(c => c !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleAddCustomCategory = (e) => {
    e.preventDefault();
    if (customCategory.trim() && !selectedCategories.includes(customCategory.trim())) {
      setSelectedCategories([...selectedCategories, customCategory.trim()]);
      setCustomCategory('');
    }
  };

  const handleStartSearch = async (e) => {
    e.preventDefault();
    const finalCity = customCity.trim() || city;

    if (!finalCity) {
      setErrorBanner('Пожалуйста, укажите город для поиска.');
      return;
    }

    if (selectedCategories.length === 0) {
      setErrorBanner('Пожалуйста, выберите хотя бы одну категорию бизнеса.');
      return;
    }

    setLoading(true);
    setErrorBanner(null);
    setSuccessBanner(null);
    setLogs([]);
    setProgressMsg('Подключение к бесплатным серверам Overpass API (OpenStreetMap)...');

    try {
      const result = await executeLeadFinderOverpass(
        finalCity, 
        selectedCategories, 
        (progress) => setProgressMsg(progress.message),
        maxLeads
      );

      setLogs(result.log || []);
      const addedCount = result.addedLeads?.length || 0;

      if (addedCount > 0) {
        setSuccessBanner(`Успешно найдено и сохранено во Firestore ${addedCount} новых лидов с контактами!`);
        if (onLeadsUpdated) onLeadsUpdated();
      } else {
        setSuccessBanner('Поиск завершен. Новых лидов по данным критериям не найдено (организации либо уже есть в вашей базе, либо не имеют номера телефона/уже обладают сайтом).');
      }
    } catch (err) {
      console.error('Lead Finder Exception:', err);
      setErrorBanner(`Не удалось выполнить поиск: ${err.message || 'Сервер недоступен'}`);
    } finally {
      setLoading(false);
      setProgressMsg('');
    }
  };

  return (
    <Card className="lead-finder-card">
      <div className="lead-finder-header">
        <div className="lead-finder-title">
          <Sparkles className="accent-icon" size={24} />
          <div>
            <h3>Поиск лидов без сайта (Overpass API / OpenStreetMap)</h3>
            <p className="lead-finder-subtitle">
              Бесплатный открытый поиск организаций без сайта по тегам OSM (shop=*, amenity=*, craft=*) с фильтрацией лидов с номерами телефонов и генерацией AI-офферов (Groq).
            </p>
          </div>
        </div>
      </div>

      {/* Info notice about Overpass API and Groq Key */}
      <div className="api-keys-notice">
        <Globe size={18} />
        <div>
          <p>
            <strong>Источник данных: Overpass API (OpenStreetMap)</strong> — 100% бесплатный сервис без ограничений и платных API-ключей.
          </p>
          {!hasGroqKey && (
            <p className="mt-1">
              <strong>GROQ_API_KEY не обнаружен:</strong> Будет использован встроенный экспертный шаблон холодного оффера WEBORA.
            </p>
          )}
        </div>
      </div>

      {errorBanner && (
        <div className="alert-banner alert-error">
          <AlertTriangle size={18} />
          <span>{errorBanner}</span>
        </div>
      )}

      {successBanner && (
        <div className="alert-banner alert-success">
          <CheckCircle2 size={18} />
          <span>{successBanner}</span>
        </div>
      )}

      <form onSubmit={handleStartSearch} className="lead-finder-form">
        {/* City selection */}
        <div className="form-section">
          <label className="form-label">
            <MapPin size={16} /> Выберите или введите город:
          </label>
          <div className="city-inputs-grid">
            <select 
              value={city} 
              onChange={(e) => {
                setCity(e.target.value);
                setCustomCity('');
              }}
              className="admin-input-select"
              disabled={loading}
            >
              {DEFAULT_CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input 
              type="text"
              placeholder="Или укажите любой другой город..."
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              className="admin-input-text"
              disabled={loading}
            />
          </div>
        </div>

        {/* Category checkboxes mapped to OSM tags */}
        <div className="form-section">
          <label className="form-label">
            <Building2 size={16} /> Выберите категории бизнеса (OSM теги):
          </label>
          <div className="categories-checkboxes-grid">
            {CATEGORY_TAG_PRESETS.map((cat) => {
              const isChecked = selectedCategories.includes(cat.id);
              return (
                <label 
                  key={cat.id} 
                  className={`category-checkbox-pill ${isChecked ? 'active' : ''}`}
                >
                  <input 
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCategoryToggle(cat.id)}
                    disabled={loading}
                  />
                  <span>{cat.label}</span>
                </label>
              );
            })}
          </div>

          {/* Add custom category input */}
          <div className="add-custom-cat-row">
            <input 
              type="text"
              placeholder="Добавить свой тег/категорию (напр. bakery, optician)..."
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="admin-input-text small"
              disabled={loading}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="small" 
              onClick={handleAddCustomCategory}
              disabled={loading || !customCategory.trim()}
            >
              Добавить
            </Button>
          </div>
        </div>

        {/* Selected categories pills */}
        {selectedCategories.length > 0 && (
          <div className="selected-cats-summary">
            <span className="summary-label">Выбрано рубрик ({selectedCategories.length}):</span>
            <div className="cat-tags-list">
              {selectedCategories.map((catId) => {
                const preset = CATEGORY_TAG_PRESETS.find(p => p.id === catId);
                const label = preset ? preset.label : catId;
                return (
                  <span key={catId} className="cat-tag">
                    {label}
                    <button 
                      type="button" 
                      onClick={() => handleCategoryToggle(catId)}
                      disabled={loading}
                    >
                      &times;
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Max Leads Limit */}
        <div className="form-section">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px' }}>Максимальное количество лидов для добавления (лимит):</span>
          </label>
          <input 
            type="number"
            min="1"
            max="1000"
            value={maxLeads}
            onChange={(e) => setMaxLeads(parseInt(e.target.value) || 50)}
            className="admin-input-text"
            disabled={loading}
            style={{ maxWidth: '150px' }}
          />
        </div>

        {/* Submit action button */}
        <div className="form-submit-row">
          <Button 
            type="submit" 
            variant="primary" 
            icon={loading ? Loader2 : Search}
            disabled={loading}
            className="w-100 search-btn-lg"
          >
            {loading ? 'Поиск организаций через Overpass API...' : 'Запустить поиск лидов'}
          </Button>
        </div>
      </form>

      {/* Progress & Logs UI */}
      {loading && (
        <div className="lead-finder-progress">
          <Loader2 size={24} className="spin-icon" />
          <span>{progressMsg || 'Обработка данных...'}</span>
        </div>
      )}

      {logs.length > 0 && (
        <div className="lead-finder-logs">
          <h4 className="logs-title">Журнал работы Overpass API & Firestore:</h4>
          <ul className="logs-list">
            {logs.map((logLine, idx) => (
              <li key={idx}>{logLine}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
