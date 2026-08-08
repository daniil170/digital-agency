// Mock data for real agency projects in Kazakhstan
export const realProjects = [
  {
    id: 'yourwayy-ai',
    title: 'YOURWAYY',
    category: 'EdTech / AI-Платформа курсов',
    description: 'Интеллектуальная образовательная платформа, которая генерирует интерактивные курсы и строит граф знаний для каждого студента.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
    tags: ['AI Courses', 'React', 'Interactive Graphs', 'EdTech'],
    link: 'https://beta.yourwayy.co',
    isReal: true
  },
  {
    id: 'veiryx-store',
    title: 'VEYRIX STORE',
    category: 'E-Commerce / Онлайн-магазин',
    description: 'Современный онлайн-магазин трендовой одежды и аксессуаров с быстрым чекаутом и доставкой по всему Казахстану.',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1000&auto=format&fit=crop',
    tags: ['E-Commerce', 'Fashion', 'Online Store', 'KZ Delivery'],
    link: 'https://veyrix-store.com',
    isReal: true
  },
  {
    id: 'babushka-shop',
    title: 'BABUSHKA SHOP',
    category: 'E-Commerce / Магазин свитеров',
    description: 'Атмосферный онлайн-магазин теплых уютных свитеров ручной работы с удобным выбором размеров и доставкой.',
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1000&auto=format&fit=crop',
    tags: ['E-Commerce', 'Свитеры', 'Knitwear', 'KZ Delivery'],
    link: 'https://babushka-shop.web.app/',
    isReal: true
  },
  {
    id: 'placeholder-project-kz',
    title: 'ВАШ ПРОЕКТ ЗДЕСЬ',
    category: 'Ваша ниша в Казахстане',
    description: 'Плейсхолдер для вашего будущего сайта. Нажмите, чтобы оставить заявку на разработку под ключ в Казахстане.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    tags: ['Казахстан', 'Разработка под ключ', 'Заявка'],
    link: '#contact',
    isPlaceholder: true
  }
];

// Mock data for demo niche categories in Kazakhstan (Prices in ₸)
export const demoCategories = [
  {
    id: 'store',
    slug: 'store',
    title: 'Интернет-магазин',
    subtitle: 'High-Conversion E-Commerce Platform (₸)',
    iconName: 'ShoppingBag',
    description: 'Современный интернет-магазин с каталогом, фильтрацией товаров, корзиной и быстрым чекаутом для продаж по всему Казахстану.',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1000&auto=format&fit=crop',
    features: ['Фильтрация и поиск', 'Интерактивная корзина', 'Мобильный чекаут', 'Интеграция с Kaspi / Halyk'],
    heroTitle: 'Магазин дизайнерской мебели & декора в Казахстане',
    heroDescription: 'Премиальное качество для вашего дома. Бесплатная доставка по Алматы и Астане при заказе от 50 000 ₸.',
    products: [
      { id: 1, name: 'Кресло Lounge Minimal', price: '185 000 ₸', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600&auto=format&fit=crop', tag: 'Хит' },
      { id: 2, name: 'Стильный торшер NORDIC', price: '75 000 ₸', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop', tag: 'Новинка' },
      { id: 3, name: 'Стол из массива дуба', price: '360 000 ₸', image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?q=80&w=600&auto=format&fit=crop', tag: 'Премиум' },
      { id: 4, name: 'Диван Loft Velvet', price: '490 000 ₸', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop', tag: 'Топ' }
    ]
  },
  {
    id: 'education',
    slug: 'education',
    title: 'Образовательная платформа / Курсы',
    subtitle: 'EdTech Learning Experience (₸)',
    iconName: 'GraduationCap',
    description: 'Интерактивный лендинг курсов или онлайн-школы с презентацией программы, спикеров и системой записи.',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1000&auto=format&fit=crop',
    features: ['Модули обучения', 'Карточки экспертов', 'Тарифная сетка (₸)', 'Форма бронирования места'],
    heroTitle: 'Курс: Продуктовый Дизайнер 2026',
    heroDescription: 'Освойте профессию с нуля до Middle+ за 6 месяцев с гарантией стажировки в продуктовых компаниях Казахстана.',
    modules: [
      { num: '01', title: 'Основы UX/UI и исследование пользователей', duration: '4 недели' },
      { num: '02', title: 'Прототипирование и Figma Masterclass', duration: '6 недель' },
      { num: '03', title: 'Анимация и дизайн-системы', duration: '4 недели' },
      { num: '04', title: 'Дипломный проект и собеседования', duration: '6 недель' }
    ]
  },
  {
    id: 'services',
    slug: 'services',
    title: 'Сайт услуг (B2B / B2C)',
    subtitle: 'Modern Business Service Website (₸)',
    iconName: 'Briefcase',
    description: 'Универсальный корпоративный сайт для бизнеса услуг с фокусом на доверие, экспертность и захват лидов.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop',
    features: ['Блок преимуществ', 'Прайс-лист / калькулятор', 'Кейсы и отзывы', 'Конверсионная форма'],
    heroTitle: 'Комплексный консалтинг & Автоматизация бизнеса в Казахстане',
    heroDescription: 'Помогаем компаниям масштабировать выручку и внедрять современное ПО за 30 дней.',
    servicesList: [
      { title: 'Аудит бизнес-процессов', desc: 'Поиск узких мест и составляющих эффективности вашей команды.' },
      { title: 'Внедрение CRM & ERP', desc: 'Настройка автоматизированного учета и контроля продаж.' },
      { title: 'Стратегический маркетинг', desc: 'Привлечение целевого трафика с прогнозируемым ROI.' },
      { title: 'IT-поддержка 24/7', desc: 'Бесперебойная работа вашей цифровой инфраструктуры.' }
    ]
  },
  {
    id: 'clinic',
    slug: 'clinic',
    title: 'Клиника / Медицинский центр',
    subtitle: 'Trust-focused Healthcare Platform (₸)',
    iconName: 'Activity',
    description: 'Премиальный медицинский сайт с записью к врачам, каталогом услуг, лицензиями и отзывами пациентов.',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1000&auto=format&fit=crop',
    features: ['Запись к врачу', 'Профили специалистов', 'Спецпредложения / Чек-апы', 'Лицензии РК'],
    heroTitle: 'Центр современной медицины и косметологии в Алматы',
    heroDescription: 'Забота о вашем здоровье на уровне мировых стандартов. Опытные врачи экспертного класса.',
    doctors: [
      { name: 'Др. Александр Смирнов', spec: 'Главный врач, Хирург-ортопед', exp: 'Стаж 18 лет' },
      { name: 'Др. Елена Соколова', spec: 'Врач-дерматокосметолог', exp: 'Стаж 12 лет' },
      { name: 'Др. Михаил Лебедев', spec: 'Кардиолог, д.м.н.', exp: 'Стаж 22 года' }
    ]
  },
  {
    id: 'cleaning',
    slug: 'cleaning',
    title: 'Клининговые услуги',
    subtitle: 'High-Converting Cleaning Service Site (₸)',
    iconName: 'Sparkles',
    description: 'Динамичный сайт клининговой компании с быстрым калькулятором стоимости, описанием услуг и гарантией чистоты.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop',
    features: ['Быстрый расчет площади', 'Безопасная эко-химия', 'Страхование имущества', 'Выезд за 60 минут'],
    heroTitle: 'Профессиональный клининг квартир и офисов в Казахстане',
    heroDescription: 'Идеальная чистота без вашего участия. Используем эко-средства и немецкое оборудование Kärcher.',
    servicesList: [
      { title: 'Генеральная уборка', desc: 'Тщательная очистка всех поверхностей, мебели и труднодоступных мест.' },
      { title: 'Уборка после ремонта', desc: 'Удаление строительной пыли, следов краски и затирки под ключ.' },
      { title: 'Химчистка диванов и ковров', desc: 'Глубокая выведение пятен и запахов профессиональным экстрактором.' },
      { title: 'Мойка окон и фасадов', desc: 'Кристальная прозрачность без разводов на любой высоте.' }
    ]
  }
];

export const agencyWorkflow = [
  {
    step: '01',
    title: 'Бриф & Аналитика',
    description: 'Изучаем ваш бизнес, конкурентов в Казахстане и целевую аудиторию. Формируем структуру будущего сайта.'
  },
  {
    step: '02',
    title: 'Дизайн & UX',
    description: 'Создаем уникальный visual-концепт в Figma. Продумываем удобный пользовательский опыт и сценарии конверсии.'
  },
  {
    step: '03',
    title: 'Разработка & Firebase',
    description: 'Верстаем быстрый, адаптивный сайт на React. Интегрируем Firebase для сбора лидов, CRM и формы.'
  },
  {
    step: '04',
    title: 'Запуск & SEO',
    description: 'Тестируем сайт на всех устройствах, оптимизируем скорость загрузки, проводим базовую SEO-подготовку и запускаем.'
  }
];
