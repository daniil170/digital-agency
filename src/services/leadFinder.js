import { db } from '../firebase/config';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

// Helper to delay execution for rate limiting
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to get environment variables (supports standard env or VITE_ prefix in Vite)
export const getEnvVariable = (key) => {
  const viteKey = `VITE_${key}`;
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env[key]) return import.meta.env[key];
    if (import.meta.env[viteKey]) return import.meta.env[viteKey];
  }
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[key]) return process.env[key];
    if (process.env[viteKey]) return process.env[viteKey];
  }
  return '';
};

// Normalize phone number for deduplication check
export const normalizePhone = (phoneStr) => {
  if (!phoneStr) return '';
  const digits = phoneStr.replace(/\D/g, '');
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    return digits.substring(1);
  }
  return digits;
};

// Check existing phones in Firestore leads collection for deduplication
export const getExistingLeadPhones = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'leads'));
    const phoneSet = new Set();
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const rawPhone = data.phone || data.contact;
      if (rawPhone) {
        const norm = normalizePhone(rawPhone);
        if (norm) phoneSet.add(norm);
      }
    });
    return phoneSet;
  } catch (err) {
    console.error('Error getting existing lead phones from Firestore:', err);
    return new Set();
  }
};

// Generate personalized cold outreach message via Groq API
let isGroqApiBroken = false;

export const generateGroqMessage = async (businessName, sphere, city, groqKey) => {
  if (!groqKey || isGroqApiBroken) {
    return `Здравствуйте! Нашли компанию "${businessName}" (${sphere}, ${city}). У вас замечательные отзывы, но отсутствует веб-сайт. Агентство WEBORA разработает удобный сайт под ключ и настроит привлечение клиентов. Напишите нам для расчета стоимости!`;
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Ты — коммерческий писатель веб-агентства WEBORA. Пиши вежливые, короткие (2-3 предложения), убедительные холодные предложения в WhatsApp для бизнеса без сайта.'
          },
          {
            role: 'user',
            content: `Сгенерируй короткое холодное сообщение для бизнеса "${businessName}" (сфера: ${sphere}, город: ${city}). Предложи разработку сайта от агентства WEBORA для привлечения клиентов. Без приветственных вводных фраз ("Конечно, вот предложение"), сразу готовый текст сообщений.`
          }
        ],
        temperature: 0.7,
        max_tokens: 220
      })
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403 || response.status === 429) {
        isGroqApiBroken = true; // Отключаем Groq до перезагрузки страницы, если ключ неверный или лимит
      }
      console.warn('Groq API error:', response.status);
      throw new Error(`Groq API Error (${response.status})`);
    }

    const data = await response.json();
    const messageContent = data.choices?.[0]?.message?.content?.trim();
    if (messageContent) {
      return messageContent;
    }
  } catch (error) {
    console.error('Failed to generate Groq message:', error);
  }

  return `Здравствуйте! Нашли компанию "${businessName}" (${sphere}, ${city}). У вас замечательные отзывы, но отсутствует веб-сайт. Агентство WEBORA разработает удобный сайт под ключ и настроит привлечение клиентов. Напишите нам для расчета стоимости!`;
};

// Rich OSM tag mapping for category presets
export const CATEGORY_TAG_PRESETS = [
  { 
    id: 'cafe', 
    label: 'Кафе и рестораны', 
    sphere: 'Кафе и рестораны',
    tags: [
      { key: 'amenity', val: 'cafe' },
      { key: 'amenity', val: 'restaurant' },
      { key: 'amenity', val: 'fast_food' }
    ] 
  },
  { 
    id: 'beauty', 
    label: 'Салоны красоты', 
    sphere: 'Салоны красоты',
    tags: [
      { key: 'shop', val: 'beauty' },
      { key: 'shop', val: 'hairdresser' },
      { key: 'shop', val: 'cosmetics' }
    ] 
  },
  { 
    id: 'auto', 
    label: 'Автосервисы и мойки', 
    sphere: 'Автосервисы',
    tags: [
      { key: 'shop', val: 'car_repair' },
      { key: 'shop', val: 'car_parts' },
      { key: 'amenity', val: 'car_wash' }
    ] 
  },
  { 
    id: 'shops', 
    label: 'Магазины и ритейл', 
    sphere: 'Магазины',
    tags: [
      { key: 'shop', val: 'clothes' },
      { key: 'shop', val: 'shoes' },
      { key: 'shop', val: 'supermarket' },
      { key: 'shop', val: 'convenience' },
      { key: 'shop', val: 'hardware' }
    ] 
  },
  { 
    id: 'dentist', 
    label: 'Стоматологии и клиники', 
    sphere: 'Стоматологии',
    tags: [
      { key: 'amenity', val: 'dentist' },
      { key: 'healthcare', val: 'dentist' },
      { key: 'amenity', val: 'clinic' }
    ] 
  },
  { 
    id: 'fitness', 
    label: 'Фитнес-клубы', 
    sphere: 'Фитнес',
    tags: [
      { key: 'leisure', val: 'fitness_centre' },
      { key: 'leisure', val: 'sports_centre' }
    ] 
  },
  { 
    id: 'repair', 
    label: 'Ремонт техники и сервисы', 
    sphere: 'Ремонт техники',
    tags: [
      { key: 'shop', val: 'electronics_repair' },
      { key: 'craft', val: 'electrician' },
      { key: 'craft', val: 'shoemaker' }
    ] 
  },
  { 
    id: 'flowers', 
    label: 'Цветы и флористика', 
    sphere: 'Цветы',
    tags: [
      { key: 'shop', val: 'florist' }
    ] 
  },
  {
    id: 'cleaning',
    label: 'Клининг компании',
    sphere: 'Клининг',
    tags: [
      { key: 'office', val: 'cleaning' },
      { key: 'craft', val: 'cleaning' },
      { key: 'shop', val: 'cleaning' },
      { key: 'service', val: 'cleaning' },
      { key: 'amenity', val: 'cleaning' }
    ]
  }
];

const OVERPASS_ENDPOINTS = [
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter'
];

/**
 * Execute Overpass query against endpoints with fallback
 */
export const queryOverpassWithFallback = async (queryBody) => {
  let lastError = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 40000); // 40s timeout

      const response = await fetch(endpoint, {
        method: 'POST',
        body: `data=${encodeURIComponent(queryBody)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return { data, endpoint };
      } else {
        lastError = new Error(`Сервер ${new URL(endpoint).hostname} перегружен (статус ${response.status})`);
      }
    } catch (err) {
      lastError = err;
      console.warn(`Overpass endpoint ${endpoint} failed:`, err.message);
    }
  }

  throw lastError || new Error('Все бесплатные сервера Overpass API сейчас перегружены. Попробуйте другой город или повторите попытку через 5 минут.');
};

/**
 * Query Overpass for a specific set of tags and city
 */
export const fetchOverpassForCategory = async (city, tagList) => {
  // Construct Overpass QL selector block
  const selectors = tagList.map(t => `
    node["${t.key}"="${t.val}"](area.searchArea);
    way["${t.key}"="${t.val}"](area.searchArea);
  `).join('');

  const queryBody = `
    [out:json][timeout:40];
    area["name"="${city}"]->.searchArea;
    (
      ${selectors}
    );
    out center;
  `;

  const { data, endpoint } = await queryOverpassWithFallback(queryBody);
  const elements = data?.elements || [];

  const validBusinesses = [];

  for (const el of elements) {
    const tags = el.tags || {};
    
    // 1. Check Website: Must NOT have website / contact:website / url
    const hasWebsite = !!(tags.website || tags['contact:website'] || tags.url);
    if (hasWebsite) continue;

    // 2. Check Phone: MUST HAVE phone / contact:phone (Without phone, lead is useless)
    const phone = tags.phone || tags['contact:phone'] || tags['phone:mobile'] || tags['contact:mobile'] || '';
    if (!phone || phone.trim().length < 5) continue;

    // 3. Name requirement
    const name = tags.name || tags['brand'] || tags['operator'] || tags['name:ru'] || tags['name:en'] || '';
    if (!name) continue;

    // 4. Construct Address
    const street = tags['addr:street'] || tags['street'] || '';
    const housenumber = tags['addr:housenumber'] || tags['housenumber'] || '';
    let address = city;
    if (street) {
      address = `${street}${housenumber ? ' ' + housenumber : ''}, ${city}`.trim();
    } else if (tags['addr:full']) {
      address = tags['addr:full'];
    }

    validBusinesses.push({
      businessName: name,
      phone: phone.trim(),
      address,
      endpointUsed: endpoint
    });
  }

  return validBusinesses;
};

/**
 * Main Lead Finder Workflow using Overpass API
 * @param {string} city 
 * @param {string[]} selectedCategoryIds Preset IDs or custom terms
 * @param {function} onProgress Status update callback
 * @param {number} maxLeads Maximum number of leads to generate
 */
export const executeLeadFinderOverpass = async (city, selectedCategoryIds, onProgress = () => {}, maxLeads = 50) => {
  const groqApiKey = getEnvVariable('GROQ_API_KEY');

  onProgress({ stage: 'init', message: 'Считывание имеющихся лидов из Firestore для дедупликации...' });
  const existingPhones = await getExistingLeadPhones();

  const allDiscoveredLeads = [];
  const log = [];

  // Group tags for selected presets
  const categoriesToProcess = [];
  for (const catId of selectedCategoryIds) {
    const preset = CATEGORY_TAG_PRESETS.find(p => p.id === catId || p.sphere === catId);
    if (preset) {
      categoriesToProcess.push(preset);
    } else {
      // Custom category term
      categoriesToProcess.push({
        id: catId,
        label: catId,
        sphere: catId,
        tags: [
          { key: 'shop', val: catId },
          { key: 'amenity', val: catId },
          { key: 'craft', val: catId }
        ]
      });
    }
  }

  for (let i = 0; i < categoriesToProcess.length; i++) {
    if (allDiscoveredLeads.length >= maxLeads) {
      log.push(`Достигнут лимит в ${maxLeads} лидов. Поиск остановлен.`);
      break;
    }

    const cat = categoriesToProcess[i];
    onProgress({ stage: 'search', message: `Отправка Overpass QL-запроса по категории "${cat.label}" в г. ${city}...` });

    // Rate Limiting Pause between queries to prevent IP banning
    if (i > 0) {
      onProgress({ stage: 'pause', message: `Пауза между запросами к Overpass API (Rate Limiting)...` });
      await sleep(1500);
    }

    let rawBusinesses = [];
    try {
      rawBusinesses = await fetchOverpassForCategory(city, cat.tags);
      log.push(`Overpass API: Найдено ${rawBusinesses.length} организаций с телефоном и без сайта в рубрике "${cat.label}".`);
    } catch (err) {
      console.error(`Error querying Overpass for category ${cat.label}:`, err);
      log.push(`Ошибка Overpass API (${cat.label}): ${err.message}`);
      continue;
    }

    let addedCount = 0;
    let duplicateCount = 0;

    for (const b of rawBusinesses) {
      if (allDiscoveredLeads.length >= maxLeads) {
        break;
      }

      const normP = normalizePhone(b.phone);
      
      // Deduplication check by phone number
      if (normP && existingPhones.has(normP)) {
        duplicateCount++;
        continue;
      }

      onProgress({ stage: 'generating', message: `Генерация AI-оффера (Groq) для "${b.businessName}"...` });

      const message = await generateGroqMessage(b.businessName, cat.sphere, city, groqApiKey);

      const leadDoc = {
        businessName: b.businessName,
        sphere: cat.sphere,
        phone: b.phone,
        address: b.address,
        city: city,
        message: message,
        status: 'new',
        source: 'Overpass API (OSM)',
        createdAt: new Date().toISOString()
      };

      try {
        const docRef = await addDoc(collection(db, 'leads'), {
          ...leadDoc,
          createdAt: serverTimestamp()
        });

        if (normP) existingPhones.add(normP);

        allDiscoveredLeads.push({ id: docRef.id, ...leadDoc });
        addedCount++;
      } catch (saveErr) {
        console.error('Error writing lead to Firestore:', saveErr);
        log.push(`Ошибка записи "${b.businessName}" в Firestore: ${saveErr.message}`);
      }
    }

    log.push(`ИТОГ по категории "${cat.label}": Добавлено лидов: ${addedCount}, пропущено дубликатов: ${duplicateCount}.`);
  }

  onProgress({ stage: 'complete', message: `Поиск завершен. Всего создано новых лидов: ${allDiscoveredLeads.length}` });

  return {
    addedLeads: allDiscoveredLeads,
    log
  };
};
