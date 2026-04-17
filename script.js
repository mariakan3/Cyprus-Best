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
        const subCatClass = place.subcategory ? place.subcategory : "";

        // Τώρα ολόκληρη η κάρτα είναι ένα <a> tag
        const cardHtml = `
            <a href="details.html?id=${place.id}" class="item-card ${subCatClass} show" style="text-decoration: none; color: inherit;">
                <img src="${place.image_url}" alt="${title}">
                <div class="item-info">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <div style="margin-top: auto; color: #3cc6cb; font-weight: bold; font-size: 0.9rem;">
                        <span data-i18n="btn-more">${staticTranslations[currentLang]["btn-more"]}</span> →
                    </div>
                </div>
            </a>`;
        container.innerHTML += cardHtml;
    });
}

/* --- 4. DETAILS PAGE (details.html) --- */
async function loadEverything() {
    // Φέρνουμε όλα τα ενεργά μέρη με τη μία
    const { data: allPlaces, error } = await dbClient
        .from('places')
        .select('id, title_el, title_en, desc_el, desc_en, image_url, category, is_best_of_month')
        .limit(50); // Ένα λογικό όριο για την αρχική

    if (error) return;

    // Μετά, μοιράζουμε τα δεδομένα στα containers τοπικά (0ms καθυστέρηση)
    renderCategory(allPlaces.filter(p => p.category === 'hotels'), 'hotels-container');
    renderCategory(allPlaces.filter(p => p.category === 'restaurants'), 'restaurants-container');
    renderCategory(allPlaces.filter(p => p.category === 'views'), 'views-container');
    renderCategory(allPlaces.filter(p => p.category === 'realestate'), 'realestate-container');
    renderCategory(allPlaces.filter(p => p.category === 'things'), 'things-container');
    renderCategory(allPlaces.filter(p => p.category === 'services'), 'services-container');
    renderCategory(allPlaces.filter(p => p.is_best_of_month), 'month-recommendation');
}

/* --- 5. BEST OF MONTH --- */
async function loadBestOfMonth() {
    const container = document.getElementById('month-recommendation');
    if (!container || !dbClient) return;

    // 1. Τραβάμε όλα τα στοιχεία από τη βάση που είναι Best of Month
    const { data: items, error } = await dbClient
        .from('places')
        .select('*')
        .eq('is_best_of_month', true);

    // 2. Αν υπάρχει σφάλμα ή δεν βρέθηκε τίποτα, δείξε το μήνυμα
    if (error || !items || items.length === 0) {
        console.log("No best of month items found.");
        container.innerHTML = "<p>Coming soon...</p>";
        return;
    }

    // 3. Καθαρίζουμε το container πριν βάλουμε τα νέα στοιχεία
    container.innerHTML = '';

    // 4. Δημιουργούμε μια κάρτα για ΚΑΘΕ στοιχείο που βρήκαμε
    items.forEach(place => {
        const title = place[`title_${currentLang}`] || place.title_en;
        const desc = place[`desc_${currentLang}`] || place.desc_en;

        const itemHtml = `
            <a href="details.html?id=${place.id}" class="month-layout" style="text-decoration: none; color: inherit; display: flex; align-items: stretch; cursor: pointer; margin-bottom: 30px; border: 1px solid #eee; border-radius: 12px; overflow: hidden; background: #f0f4f8; transition: transform 0.3s ease;">
                <img src="${place.image_url}" alt="${title}" style="width: 300px; height: 200px; object-fit: cover;">
                <div class="month-info" style="padding: 20px; flex: 1; display: flex; flex-direction: column;">
                    <h3 style="margin-top: 0; color: #333;">${title}</h3>
                    <p style="color: #555;">${desc}</p>
                    <div style="color: #3cc6cb; font-weight: bold; margin-top: auto;">
                        <span data-i18n="btn-more">${staticTranslations[currentLang]["btn-more"]}</span> →
                    </div>
                </div>
            </a>
        `;
        container.innerHTML += itemHtml;
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
    
    // Κάλεσε αυτή τη συνάρτηση για να φορτώσουν όλα ακαριαία
    loadEverything(); 
});

// Αυτή η συνάρτηση "σχεδιάζει" τις κάρτες στην οθόνη
function renderCategory(places, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = ''; // Καθαρισμός
    
    places.forEach(place => {
        const title = place[`title_${currentLang}`] || place.title_en;
        const description = place[`desc_${currentLang}`] || place.desc_en || '';
        
        // IQ 250 Trick: Αν η εικόνα είναι από Cloudinary, πρόσθεσε αυτόματα το f_auto,q_auto
        let optimizedUrl = place.image_url;
        if (optimizedUrl.includes('cloudinary.com')) {
            optimizedUrl = optimizedUrl.replace('/upload/', '/upload/f_auto,q_auto/');
        }

        const cardHtml = `
            <a href="details.html?id=${place.id}" class="item-card show" style="text-decoration: none; color: inherit;">
                <img src="${optimizedUrl}" alt="${title}" loading="lazy">
                <div class="item-info">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <div style="margin-top: auto; color: #3cc6cb; font-weight: bold; font-size: 0.9rem;">
                        <span>${staticTranslations[currentLang]["btn-more"]}</span> →
                    </div>
                </div>
            </a>`;
        container.innerHTML += cardHtml;
    });
}