/* --- 1. CONFIG SUPABASE --- */
const PROJECT_URL = 'https://qahpepjvksxrhugmxpgg.supabase.co';
const PROJECT_KEY = 'sb_publishable_nsjM78oxiVSKQrjpRzcg-Q_4lFeDNVO';

let dbClient;
if (typeof supabase !== 'undefined') {
    dbClient = supabase.createClient(PROJECT_URL, PROJECT_KEY);
}

let currentLang = localStorage.getItem('userLang') || 'en';

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
};/* --- 3. ΦΟΡΤΩΣΗ ΚΑΤΗΓΟΡΙΩΝ (ΟΛΕΣ ΟΙ ΕΙΚΟΝΕΣ & ΠΕΡΙΓΡΑΦΕΣ) --- */
async function loadCategory(categoryName, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !dbClient) return;

    const { data: places, error } = await dbClient
        .from('places')
        .select('*')
        .eq('category', categoryName);
    
    if (error) {
        console.error("Error loading category:", error);
        return;
    }

    container.innerHTML = ''; 
    places.forEach(place => {
        // Χρήση των στηλών από το νέο SQL σου
        const title = place[`title_${currentLang}`] || place.title_en || "No Title";
        const description = place[`desc_${currentLang}`] || place.desc_en || "";
        const img = place.image_url || "";

        const cardHtml = `
            <a href="details.html?id=${place.id}" class="item-card show" style="text-decoration: none; color: inherit;">
                <img src="${img}" alt="${title}">
                <div class="item-info">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <div style="margin-top: auto; color: #3cc6cb; font-weight: bold;">
                        <span>Περισσότερα</span> →
                    </div>
                </div>
            </a>`;
        container.innerHTML += cardHtml;
    });
}

/* --- 4. BEST OF MONTH --- */
async function loadBestOfMonth() {
    const container = document.getElementById('month-recommendation');
    if (!container || !dbClient) return;

    const { data: items, error } = await dbClient.from('places').select('*').eq('is_best_of_month', true);

    if (error || !items) return;

    container.innerHTML = '';
    items.forEach(place => {
        const title = place[`title_${currentLang}`] || place.title_en;
        const desc = place[`description${currentLang}`] || place.desc_en;

        const itemHtml = `
            <a href="details.html?id=${place.id}" class="month-layout" style="text-decoration: none; color: inherit; display: flex;">
                <img src="${place.image_url}" alt="${title}" style="width: 250px; height: 180px; object-fit: cover; border-radius: 10px;">
                <div style="padding: 20px;">
                    <h3>${title}</h3>
                    <p>${desc}</p>
                </div>
            </a>`;
        container.innerHTML += itemHtml;
    });
}

/* --- 5. ΣΕΛΙΔΑ ΛΕΠΤΟΜΕΡΕΙΩΝ (DETAILS) --- */
async function loadFullDetails(id) {
    if (!dbClient || !id) return;

    // Τραβάμε τα δεδομένα για το συγκεκριμένο ID
    const { data: place, error } = await dbClient
        .from('places')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !place) {
        console.error("Place not found:", error);
        return;
    }

    // 1. Τίτλος: Ψάχνει title_el, title_en κλπ
    const title = place[`title_${currentLang}`] || place.title_en || place.id;
    
    // 2. ΠΕΡΙΓΡΑΦΗ: Ψάχνει desc_el, desc_en (όπως το SQL σου)
    const description = place[`desc_${currentLang}`] || place.desc_en || "";

    // 3. Εικόνα: Προσθέτει και το Cloudinary Optimization αν είναι link από εκεί
    let imgUrl = place.image_url;
    if (imgUrl && imgUrl.includes('cloudinary.com')) {
        imgUrl = imgUrl.replace('/upload/', '/upload/f_auto,q_auto/');
    }

    // Εμφάνιση των στοιχείων στη σελίδα
    const headerEl = document.getElementById('details-header');
    const titleEl = document.getElementById('place-title');
    const descEl = document.getElementById('place-description');

    if (headerEl) headerEl.style.backgroundImage = `url('${imgUrl}')`;
    if (titleEl) titleEl.innerText = title;
    if (descEl) descEl.innerHTML = description; // Χρησιμοποιούμε innerHTML για να πιάνει τυχόν αλλαγές γραμμής

    /// Έλεγχος για Τηλέφωνο
if (place.phone) {
    document.getElementById('place-phone').innerText = place.phone;
    document.getElementById('phone-wrapper').style.display = 'block';
}

// Έλεγχος για Website
if (place.website) {
    const webBtn = document.getElementById('web-link');
    webBtn.href = place.website;
    webBtn.style.display = 'inline-block'; // Το εμφανίζει
}

// Έλεγχος για Maps (πρόσεξε το όνομα της στήλης: map_link)
if (place.map_link) {
    const mapBtn = document.getElementById('map-link');
    mapBtn.href = place.map_link;
    mapBtn.style.display = 'inline-block'; // Το εμφανίζει
}
}

/* --- 6. UTILITIES (ΓΛΩΣΣΑ, ΚΑΙΡΟΣ κλπ) --- */
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('userLang', lang);
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (staticTranslations[lang] && staticTranslations[lang][key]) {
            el.innerText = staticTranslations[lang][key];
        }
    });
    
    refreshAllData();
}

function refreshAllData() {
    const categories = ['hotels', 'restaurants', 'views', 'realestate', 'things', 'services'];
    categories.forEach(cat => {
        if (document.getElementById(`${cat}-container`)) loadCategory(cat, `${cat}-container`);
    });
    if (document.getElementById('month-recommendation')) loadBestOfMonth();

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id && document.getElementById('place-title')) loadFullDetails(id);
}

function getWeather() {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=34.68&longitude=33.04&current_weather=true")
        .then(res => res.json())
        .then(data => {
            const temp = Math.round(data.current_weather.temperature);
            const el = document.getElementById('weather-temp');
            if (el) el.innerText = temp + "°C";
        }).catch(err => console.log(err));
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) navLinks.classList.toggle('active');
}

/* --- 7. ΕΚΚΙΝΗΣΗ --- */
document.addEventListener("DOMContentLoaded", () => {
    getWeather();
    const saved = localStorage.getItem('userLang') || 'en';
    setLanguage(saved);
});