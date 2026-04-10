/* --- 1. CONFIG SUPABASE --- */
const PROJECT_URL = 'https://qahpepjvksxrhugmxpgg.supabase.co';
const PROJECT_KEY = 'sb_publishable_nsjM78oxiVSKQrjpRzcg-Q_4lFeDNVO';

let dbClient;
if (typeof supabase !== 'undefined') {
    dbClient = supabase.createClient(PROJECT_URL, PROJECT_KEY);
}

let currentLang = 'en'; 

/* --- 2. ΠΛΗΡΕΣ ΛΕΞΙΚΟ (ΟΛΕΣ ΟΙ ΓΛΩΣΣΕΣ - 100% COMPLETE) --- */
const staticTranslations = {
    el: { 
        "nav-home": "Αρχική", 
        "nav-hotels": "Ξενοδοχεία", 
        "nav-restaurants": "Εστιατόρια", 
        "nav-views": "Θέα", 
        "nav-realestate": "Ακίνητα", 
        "nav-things": "Δραστηριότητες", 
        "nav-services": "Υπηρεσίες",
        "hero-title": "Ανακάλυψε την Κύπρο", 
        "hero-desc": "Τα καλύτερα του νησιού, προτεινόμενα από ντόπιους.",
        "explore-btn": "Εξερεύνηση",
        "categories-title": "Οι Κατηγορίες Μας",
        "card-hotels": "Πολυτέλεια και φιλοξενία.",
        "card-rest": "Γεύσεις από την παράδοση.",
        "card-views": "Τα ωραιότερα ηλιοβασιλέματα.",
        "card-real": "Επενδυτικές ευκαιρίες.",
        "card-things": "Δραστηριότητες και εμπειρίες.",
        "card-serv": "Επαγγελματικές υπηρεσίες.",
        "btn-more": "Περισσότερα", 
        "loading": "Φόρτωση δεδομένων...", 
        "lbl-phone": "📞 Τηλέφωνο:", 
        "lbl-website": "🌍 Website", 
        "lbl-map": "📍 Άνοιγμα Χάρτη", 
        "btn-back": "Πίσω",
        "filter-all": "Όλα", 
        "filter-safari": "🚙 Σαφάρι", 
        "filter-boat": "🛥️ Σκάφος", 
        "filter-diving": "🤿 Κατάδυση",
        "filter-ski": "⛷️ Σκι", 
        "filter-culture": "🏛️ Πολιτισμός", 
        "filter-wine": "🍷 Κρασί", 
        "filter-yoga": "🧘🏻‍♀️ Γιόγκα",
        "filter-trad": "🍲 Παραδοσιακά", 
        "filter-fine": "🍷 Πολυτελή", 
        "filter-asian": "🥢 Ασιατικά", 
        "filter-law": "⚖️ Νομικά",
        "filter-medical": "🏥 Ιατρικά", 
        "filter-accounting": "📊 Λογιστικά", 
        "filter-architects": "🏗️ Αρχιτέκτονες",
        "filter-flowers": "🌸 Λουλούδια", 
        "filter-taxi": "🚕 Ταξί", 
        "filter-promenades": "🚶‍♂️ Περιπάτοι"
    },
    en: { 
        "nav-home": "Home", 
        "nav-hotels": "Hotels", 
        "nav-restaurants": "Restaurants", 
        "nav-views": "Views", 
        "nav-realestate": "Real Estate", 
        "nav-things": "Things to Do", 
        "nav-services": "Services",
        "hero-title": "Explore Cyprus", 
        "hero-desc": "The best of the island, recommended by locals.",
        "explore-btn": "Explore Now",
        "categories-title": "Our Categories",
        "card-hotels": "Luxury and hospitality.",
        "card-rest": "Taste the tradition.",
        "card-views": "The most beautiful sunsets.",
        "card-real": "Investment opportunities.",
        "card-things": "Activities and experiences.",
        "card-serv": "Professional services.",
        "btn-more": "More Info", 
        "loading": "Loading data...",
        "lbl-phone": "📞 Phone:", 
        "lbl-website": "🌍 Website", 
        "lbl-map": "📍 Open Map", 
        "btn-back": "Back",
        "filter-all": "All", 
        "filter-safari": "🚙 Safari", 
        "filter-boat": "🛥️ Boat Trips", 
        "filter-diving": "🤿 Diving",
        "filter-ski": "⛷️ Ski", 
        "filter-culture": "🏛️ Culture", 
        "filter-wine": "🍷 Wine", 
        "filter-yoga": "🧘🏻‍♀️ Yoga",
        "filter-trad": "🍲 Traditional", 
        "filter-fine": "🍷 Fine Dining", 
        "filter-asian": "🥢 Asian", 
        "filter-law": "⚖️ Law",
        "filter-medical": "🏥 Medical", 
        "filter-accounting": "📊 Accounting", 
        "filter-architects": "🏗️ Architects",
        "filter-flowers": "🌸 Flowers", 
        "filter-taxi": "🚕 Taxi", 
        "filter-promenades": "🚶‍♂️ Promenades"
    },
    ru: { 
        "nav-home": "Главная", 
        "nav-hotels": "Отели", 
        "nav-restaurants": "Рестораны", 
        "nav-views": "Виды", 
        "nav-realestate": "Недвижимость", 
        "nav-things": "Развлечения", 
        "nav-services": "Услуги",
        "hero-title": "Исследуйте Кипр", 
        "hero-desc": "Лучшее на острове, рекомендовано местными жителями.",
        "explore-btn": "Исследовать",
        "categories-title": "Наши категории",
        "card-hotels": "Роскошь и гостеприимство.",
        "card-rest": "Вкус традиций.",
        "card-views": " Самые красивые закаты.",
        "card-real": "Инвестиционные возможности.",
        "card-things": "Мероприятия и опыт.",
        "card-serv": "Профессиональные услуги.",
        "btn-more": "Подробнее", 
        "loading": "Загрузка данных...",
        "lbl-phone": "📞 Телефон:", 
        "lbl-website": "🌍 Веб-сайт", 
        "lbl-map": "📍 Открыть карту", 
        "btn-back": "Назад",
        "filter-all": "Все", 
        "filter-safari": "🚙 Сафари", 
        "filter-boat": "🛥️ Лодки", 
        "filter-diving": "🤿 Дайвинг",
        "filter-ski": "⛷️ Лыжи", 
        "filter-culture": "🏛️ Культура", 
        "filter-wine": "🍷 Вино", 
        "filter-yoga": "🧘🏻‍♀️ Йога",
        "filter-trad": "🍲 Традиционные", 
        "filter-fine": "🍷 Изысканные", 
        "filter-asian": "🥢 Азиатские", 
        "filter-law": "⚖️ Юридические",
        "filter-medical": "🏥 Медицинские", 
        "filter-accounting": "📊 Бухгалтерские", 
        "filter-architects": "🏗️ Архитекторы",
        "filter-flowers": "🌸 Цветы", 
        "filter-taxi": "🚕 Такси", 
        "filter-promenades": "🚶‍♂️ Прогулки"
    },
    zh: { 
        "nav-home": "首页", 
        "nav-hotels": "酒店", 
        "nav-restaurants": "餐厅", 
        "nav-views": "景色", 
        "nav-realestate": "房地产", 
        "nav-things": "休闲活动", 
        "nav-services": "服务",
        "hero-title": "探索塞浦路斯", 
        "hero-desc": "岛上最好的地方，由当地人推荐。",
        "explore-btn": "立即探索",
        "categories-title": "我们的类别",
        "card-hotels": "奢华与款待。",
        "card-rest": "品尝传统。",
        "card-views": "最美的日落。",
        "card-real": "投资机会。",
        "card-things": "活动与体验。",
        "card-serv": "专业服务。",
        "btn-more": "更多信息", 
        "loading": "加载数据...",
        "lbl-phone": "📞 电话:", 
        "lbl-website": "🌍 网站", 
        "lbl-map": "📍 打开地图", 
        "btn-back": "返回",
        "filter-all": "全部", 
        "filter-safari": "🚙 野生动物园", 
        "filter-boat": "🛥️ 乘船游览", 
        "filter-diving": "🤿 潜水",
        "filter-ski": "⛷️ 滑雪", 
        "filter-culture": "🏛️ 文化", 
        "filter-wine": "🍷 葡萄酒", 
        "filter-yoga": "🧘🏻‍♀️ 瑜伽",
        "filter-trad": "🍲 传统", 
        "filter-fine": "🍷 高级餐饮", 
        "filter-asian": "🥢 亚洲", 
        "filter-law": "⚖️ 法律",
        "filter-medical": "🏥 医疗", 
        "filter-accounting": "📊 财务", 
        "filter-architects": "🏗️ 建筑师",
        "filter-flowers": "🌸 花卉", 
        "filter-taxi": "🚕 出租车", 
        "filter-promenades": "🚶‍♂️ 散步"
    }
};
/* --- 3. LOAD DATA & CARDS --- */
async function loadCategory(categoryName, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !dbClient) return;

    container.innerHTML = `<p style="text-align:center; width:100%;">${staticTranslations[currentLang]["loading"]}</p>`;

    const { data: places, error } = await dbClient.from('places').select('*').eq('category', categoryName);
    if (error) return;

    // PINNED ITEMS LOGIC
    const pinnedIds = { 'things': 'yoga', 'restaurants': 'melania' };
    const pinnedId = pinnedIds[categoryName];
    if (pinnedId && places) {
        const idx = places.findIndex(item => item.id === pinnedId);
        if (idx > -1) {
            const item = places.splice(idx, 1)[0];
            places.unshift(item);
        }
    }

    container.innerHTML = ''; 
    places.forEach(place => {
        const title = place[`title_${currentLang}`] || place.title_en; 
        const description = place[`desc_${currentLang}`] || place.desc_en || '';
        const btnText = staticTranslations[currentLang]["btn-more"];
        const subCatClass = place.subcategory ? place.subcategory : "";

        const cardHtml = `
            <div class="item-card ${subCatClass} show">
                <img src="${place.image_url}" alt="${title}">
                <div class="item-info">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <div class="quick-links" style="margin: 10px 0; display: flex; justify-content: center; gap: 20px; min-height: 24px;">
                        ${(place.phone && place.phone !== '-' && place.phone !== 'null') ? `<a href="tel:${place.phone}"><i class="fas fa-phone"></i></a>` : ''}
                        ${(place.map_link && place.map_link !== '#') ? `<a href="${place.map_link}" target="_blank"><i class="fas fa-map-marker-alt"></i></a>` : ''}
                        ${(place.website && place.website !== '-' && place.website !== 'null') ? `<a href="${place.website}" target="_blank"><i class="fas fa-external-link-alt"></i></a>` : ''}
                    </div>
                    <a href="details.html?id=${place.id}" class="btn-small">${btnText}</a>
                </div>
            </div>`;
        container.innerHTML += cardHtml;
    });
}

/* --- 4. DETAILS PAGE (details.html) --- */
async function loadFullDetails(id) {
    if (!dbClient) return;
    const { data: place, error } = await dbClient.from('places').select('*').eq('id', id).single();
    if (error || !place) return;

    document.getElementById('place-title').innerText = place[`title_${currentLang}`] || place.title_en;
    const fullDesc = place[`long_description_${currentLang}`] || place[`desc_${currentLang}`] || place.desc_en;
    document.getElementById('place-description').innerText = fullDesc;

    if (place.image_url) document.getElementById('details-header').style.backgroundImage = `url(${place.image_url})`;

    if (place.phone && place.phone !== '-' && place.phone !== 'null') {
        document.getElementById('place-phone').innerText = place.phone;
        document.getElementById('phone-wrapper').style.display = 'block';
    }
    if (place.website && place.website !== '-' && place.website !== 'null') {
        const webBtn = document.getElementById('web-link');
        webBtn.href = place.website; webBtn.style.display = 'inline-block';
    }
    if (place.map_link && place.map_link !== '#' && place.map_link !== 'null') {
        const mapBtn = document.getElementById('map-link');
        mapBtn.href = place.map_link; mapBtn.style.display = 'inline-block';
    }
}

/* --- 5. BEST OF MONTH --- */
async function loadBestOfMonth() {
    const container = document.getElementById("month-recommendation");
    if (!container || !dbClient) return;

    const { data: bestItems, error } = await dbClient.from('places').select('*').eq('is_best_of_month', true);
    if (error || !bestItems) return;

    container.innerHTML = '';
    bestItems.forEach(place => {
        const title = place[`title_${currentLang}`] || place.title_en;
        const desc = place[`desc_${currentLang}`] || place.desc_en;
        container.innerHTML += `
            <div class="month-layout">
                <img src="${place.image_url}" alt="${title}">
                <div class="month-info">
                    <h3>${title}</h3>
                    <p>${desc}</p>
                    <a href="details.html?id=${place.id}" class="btn-small">${staticTranslations[currentLang]["btn-more"]}</a>
                </div>
            </div>`;
    });
}

/* --- 6. UTILITIES --- */
function getWeather() {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=34.68&longitude=33.04&current_weather=true")
        .then(res => res.json())
        .then(data => {
            const temp = Math.round(data.current_weather.temperature);
            const el = document.getElementById('weather-temp');
            if (el) el.innerText = temp + "°C";
        }).catch(err => console.log(err));
}

function filterSelection(category) {
    const cards = document.getElementsByClassName("item-card");
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove("show");
        if (category === "all" || cards[i].classList.contains(category)) cards[i].classList.add("show");
    }
    const btns = document.getElementsByClassName("filter-btn");
    for (let i = 0; i < btns.length; i++) btns[i].classList.remove("active");
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('userLang', lang);
    
    // Αυτό μεταφράζει όλα τα data-i18n αυτόματα
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (staticTranslations[lang] && staticTranslations[lang][key]) {
            el.innerText = staticTranslations[lang][key];
        }
    });
    
    refreshAllData();
}

function refreshAllData() {
    // 1. Ανανέωση των κατηγοριών στην αρχική σελίδα
    if (document.getElementById('hotels-container')) loadCategory('hotels', 'hotels-container');
    if (document.getElementById('restaurants-container')) loadCategory('restaurants', 'restaurants-container');
    if (document.getElementById('views-container')) loadCategory('views', 'views-container');
    if (document.getElementById('realestate-container')) loadCategory('realestate', 'realestate-container');
    if (document.getElementById('things-container')) loadCategory('things', 'things-container');
    if (document.getElementById('services-container')) loadCategory('services', 'services-container');
    if (document.getElementById('month-recommendation')) loadBestOfMonth();

    // 2. ΠΡΟΣΘΗΚΗ ΓΙΑ ΤΙΣ ΛΕΠΤΟΜΕΡΕΙΕΣ:
    // Αν ο χρήστης είναι στη σελίδα details.html, ξαναφόρτωσε τα δεδομένα στη νέα γλώσσα
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id && document.getElementById('place-title')) {
        loadFullDetails(id);
    }
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) navLinks.classList.toggle('active');
}

/* --- 7. STARTUP --- */
document.addEventListener("DOMContentLoaded", () => {
    getWeather();
    const saved = localStorage.getItem('userLang') || 'en';
    setLanguage(saved);
});