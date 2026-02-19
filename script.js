/* --- 1. RYZHISH SUPABASE --- */
const PROJECT_URL = 'https://qahpepjvksxrhugmxpgg.supabase.co';
const PROJECT_KEY = 'sb_publishable_nsjM78oxiVSKQrjpRzcg-Q_4lFeDNVO';

let dbClient;
if (typeof supabase !== 'undefined') {
    dbClient = supabase.createClient(PROJECT_URL, PROJECT_KEY);
}

/* --- 2. GLOBAL VARIABLES --- */
let currentLang = 'en'; 

/* --- 3. ΠΛΗΡΕΙΣ ΜΕΤΑΦΡΑΣΕΙΣ (Με Emojis στα Φίλτρα) --- */
const staticTranslations = {
    el: { 
        "nav-home": "Αρχική", "nav-hotels": "Ξενοδοχεία", "nav-restaurants": "Εστιατόρια", 
        "nav-views": "Θέα", "nav-realestate": "Ακίνητα", "nav-things": "Δραστηριότητες", "nav-services": "Υπηρεσίες",
        "btn-more": "Περισσότερα", "loading": "Φόρτωση δεδομένων...", 
        "hero-title": "Ανακάλυψε την Κύπρο", "hero-desc": "Τα καλύτερα του νησιού, προτεινόμενα από ντόπιους.", "btn-explore": "Εξερεύνηση",
        "section-categories": "Οι Κατηγορίες Μας",
        "cat-hotels-title": "Καλύτερα Ξενοδοχεία", "cat-hotels-desc": "Πολυτέλεια και φιλοξενία.",
        "cat-restaurants-title": "Καλύτερα Εστιατόρια", "cat-restaurants-desc": "Γεύσεις από την παράδοση.",
        "cat-views-title": "Καλύτερη Θέα", "cat-views-desc": "Τα ωραιότερα ηλιοβασιλέματα.",
        "cat-realestate-title": "Ακίνητα", "cat-realestate-desc": "Επενδυτικές ευκαιρίες.",
        "cat-things-title": "Δραστηριότητες", "cat-things-desc": "Εμπειρίες και περιπέτεια.",
        "cat-services-title": "Καλύτερες Υπηρεσίες", "cat-services-desc": "Επαγγελματικές υπηρεσίες.",
        "lbl-phone": "Τηλ:", "lbl-map": "Δείτε τον Χάρτη",


        // --- ΦΙΛΤΡΑ (Με Emojis) ---
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

    },
    en: { 
        "nav-home": "Home", "nav-hotels": "Hotels", "nav-restaurants": "Restaurants", 
        "nav-views": "Views", "nav-realestate": "Real Estate", "nav-things": "Things to Do", "nav-services": "Services",
        "btn-more": "More Info", "loading": "Loading data...",
        "hero-title": "Discover Cyprus", "hero-desc": "The best of the island, recommended by locals.", "btn-explore": "Explore",
        "section-categories": "Our Categories",
        "cat-hotels-title": "Best Hotels", "cat-hotels-desc": "Luxury and hospitality.",
        "cat-restaurants-title": "Best Restaurants", "cat-restaurants-desc": "Traditional flavors.",
        "cat-views-title": "Best Views", "cat-views-desc": "The most beautiful sunsets.",
        "cat-realestate-title": "Real Estate", "cat-realestate-desc": "Investment opportunities.",
        "cat-things-title": "Things to Do", "cat-things-desc": "Experiences and adventure.",
        "cat-services-title": "Best Services", "cat-services-desc": "Professional services.",
        "lbl-phone": "Tel:", "lbl-map": "Open Map",


        // --- FILTERS (With Emojis) ---
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
        'filter-architects': "🏗️ Architects",

    },
    ru: { 
        "nav-home": "Главная", "nav-hotels": "Отели", "nav-restaurants": "Рестораны", 
        "nav-views": "Виды", "nav-realestate": "Недвижимость", "nav-things": "Развлечения", "nav-services": "Услуги",
        "btn-more": "Подробнее", "loading": "Загрузка данных...",
        "hero-title": "Откройте для себя Кипр", "hero-desc": "Лучшее на острове, рекомендовано местными жителями.", "btn-explore": "Исследовать",
        "section-categories": "Наши Категории",
        "cat-hotels-title": "Лучшие Отели", "cat-hotels-desc": "Роскошь и гостеприимство.",
        "cat-restaurants-title": "Лучшие Рестораны", "cat-restaurants-desc": "Традиционные вкусы.",
        "cat-views-title": "Лучшие Виды", "cat-views-desc": "Самые красивые закаты.",
        "cat-realestate-title": "Недвижимость", "cat-realestate-desc": "Инвестиционные возможности.",
        "cat-things-title": "Развлечения", "cat-things-desc": "Опыт и приключения.",
        "cat-services-title": "Лучшие Услуги", "cat-services-desc": "Профессиональные услуги.",
        "lbl-phone": "Тел:", "lbl-map": "Открыть Карту",


        // --- FILTERS (With Emojis) ---
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
        'filter-architects': "🏗️ Архитекторы",

    },
    zh: { 
        "nav-home": "首页", "nav-hotels": "酒店", "nav-restaurants": "餐厅", 
        "nav-views": "景色", "nav-realestate": "房地产", "nav-things": "休闲活动", "nav-services": "服务",
        "btn-more": "更多信息", "loading": "加载数据...",
        "hero-title": "探索塞浦路斯", "hero-desc": "岛上最好的地方，由当地人推荐。", "btn-explore": "探索",
        "section-categories": "我们的类别",
        "cat-hotels-title": "最好的酒店", "cat-hotels-desc": "奢华与热情。",
        "cat-restaurants-title": "最好的餐厅", "cat-restaurants-desc": "传统风味。",
        "cat-views-title": "最好的景色", "cat-views-desc": "最美丽的日落。",
        "cat-realestate-title": "房地产", "cat-realestate-desc": "投资机会。",
        "cat-things-title": "休闲活动", "cat-things-desc": "体验与冒险。",
        "cat-services-title": "最好的服务", "cat-services-desc": "专业服务。",
        "lbl-phone": "电话:", "lbl-map": "打开地图",


        // --- FILTERS (With Emojis) ---
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
        "filter-accounting": "📊 物流",
        'filter-architects': "🏗️ 建筑师",

    }
};

/* --- 4. DATA FETCHING (Με Ταξινόμηση "Καρφίτσωμα") --- */
async function loadCategory(categoryName, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !dbClient) return;

    // Loading Message
    const loadingText = staticTranslations[currentLang]["loading"];
    container.innerHTML = `<p style="text-align:center; width:100%; margin-top:20px;">${loadingText}</p>`;

    // Ζητάμε τα δεδομένα από τη βάση
    const { data: places, error } = await dbClient
        .from('places')
        .select('*')
        .eq('category', categoryName);

    if (error) {
        console.error("Error loading:", error);
        container.innerHTML = "<p>Something went wrong...</p>";
        return;
    }

    // --- ΤΑΞΙΝΟΜΗΣΗ (PINNED ITEMS) ---
    // Εδώ ορίζουμε ποια θέλουμε να βγαίνουν ΠΑΝΤΑ πρώτα σε κάθε κατηγορία
    const pinnedIds = {
        'things': 'yoga',       // Στα Things to Do -> Πρώτο το Yoga
        'restaurants': 'melania' // Στα Restaurants -> Πρώτο το Melania
    };

    const pinnedId = pinnedIds[categoryName];

    if (pinnedId && places) {
        // Ψάχνουμε να βρούμε πού είναι στη λίστα
        const index = places.findIndex(item => item.id === pinnedId);
        
        // Αν το βρούμε, το μετακινούμε στην αρχή (θέση 0)
        if (index > -1) {
            const item = places.splice(index, 1)[0]; // Το βγάζουμε από εκεί που είναι
            places.unshift(item); // Το βάζουμε τέρμα πάνω
        }
    }
    // ------------------------------------

    container.innerHTML = ''; // Καθαρισμός

    places.forEach(place => {
        const title = place[`title_${currentLang}`] || place.title_en; 
        const desc = place[`desc_${currentLang}`] || place.desc_en;
        const btnText = staticTranslations[currentLang]["btn-more"];
        const subCatClass = place.subcategory ? place.subcategory : "";

        const cardHtml = `
            <div class="item-card ${subCatClass} show">
                <img src="${place.image_url}" alt="${title}">
                <div class="item-info">
                    <h3>${title}</h3>
                    <p>${desc}</p>
                    <button class="btn-small" onclick="openModal('${place.id}', '${place.phone}', '${place.website}', '${place.map_link}', '${title}')">
                        ${btnText}
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}

/* --- 5. BEST OF MONTH --- */
async function loadBestOfMonth() {
    const container = document.getElementById("month-recommendation");
    if (!container || !dbClient) return;

    // Loading Message
    container.innerHTML = `<p>${staticTranslations[currentLang]["loading"]}</p>`;

    const { data: bestItems, error } = await dbClient
        .from('places')
        .select('*')
        .eq('is_best_of_month', true);

    if (error || !bestItems) return;

    container.innerHTML = '';
    
    bestItems.forEach(place => {
        const title = place[`title_${currentLang}`] || place.title_en; 
        const desc = place[`desc_${currentLang}`] || place.desc_en;
        const btnText = staticTranslations[currentLang]["btn-more"];

        const html = `
        <div class="month-layout" style="display:flex; gap:20px; align-items:center; margin-bottom:20px; border-bottom:1px solid #ddd; padding-bottom:20px;">
            <img src="${place.image_url}" style="width:250px; height:180px; object-fit:cover; border-radius:10px;" alt="${title}">
            <div class="month-info">
                <h3 style="margin-top:0; color:#333333;">${title}</h3>
                <p>${desc}</p>
                <button class="btn-small" onclick="openModal('${place.id}', '${place.phone}', '${place.website}', '${place.map_link}', '${title}')">
                    ${btnText}
                </button>
            </div>
        </div>`;
        container.innerHTML += html;
    });
}

/* --- 6. WEATHER WIDGET (Επέστρεψε!) --- */
function getWeather() {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=34.68&longitude=33.04&current_weather=true")
        .then(response => response.json())
        .then(data => {
            const temp = Math.round(data.current_weather.temperature);
            const weatherElement = document.getElementById('weather-temp');
            
            if(weatherElement) {
                weatherElement.innerText = temp + "°C";
                const iconElement = document.getElementById('weather-icon');
                if (temp > 25) {
                    iconElement.innerText = "☀️"; 
                } else if (temp > 15) {
                    iconElement.innerText = "⛅"; 
                } else {
                    iconElement.innerText = "🌧️"; 
                }
            }
        })
        .catch(error => console.log("Weather error:", error));
}

/* --- 7. MODAL POPUP --- */
function openModal(id, phone, web, map, title) {
    document.getElementById('modal-title').innerText = title;
    
    const phoneEl = document.getElementById('modal-phone');
    if (phone && phone !== 'null' && phone !== '-') {
        phoneEl.innerText = phone;
        phoneEl.parentElement.style.display = 'block';
    } else {
        phoneEl.parentElement.style.display = 'none';
    }

    const webLink = document.getElementById('modal-web');
    if (web && web !== 'null' && web !== '-') {
        webLink.href = web;
        webLink.style.display = 'inline';
    } else {
        webLink.style.display = 'none';
    }

    document.getElementById('modal-map').href = map || "#";
    document.getElementById('infoModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('infoModal').style.display = 'none';
}

/* --- 8. ΓΛΩΣΣΑ & ΦΙΛΤΡΑ --- */
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('userLang', lang);
    
    // Αλλαγή στατικών κειμένων
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (staticTranslations[lang] && staticTranslations[lang][key]) {
            el.innerText = staticTranslations[lang][key];
        }
    });

    // Επαναφόρτωση δεδομένων για να αλλάξει η γλώσσα στις κάρτες
    refreshAllData();
}

function filterSelection(category) {
    const cards = document.getElementsByClassName("item-card");
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove("show");
        if (category === "all" || cards[i].classList.contains(category)) {
            cards[i].classList.add("show");
        }
    }
    const btns = document.getElementsByClassName("filter-btn");
    for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove("active");
        if (btns[i].getAttribute('onclick').includes(category)) {
            btns[i].classList.add("active");
        }
    }
}

/* --- 9. STARTUP (ΕΚΚΙΝΗΣΗ) - ΜΟΝΟ ΕΝΑ ΑΝΤΙΓΡΑΦΟ --- */
function refreshAllData() {
    if (document.getElementById('hotels-container')) loadCategory('hotels', 'hotels-container');
    if (document.getElementById('restaurants-container')) loadCategory('restaurants', 'restaurants-container');
    if (document.getElementById('views-container')) loadCategory('views', 'views-container');
    if (document.getElementById('realestate-container')) loadCategory('realestate', 'realestate-container');
    if (document.getElementById('things-container')) loadCategory('things', 'things-container');
    if (document.getElementById('services-container')) loadCategory('services', 'services-container');
    
    if (document.getElementById('month-recommendation')) loadBestOfMonth();
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. Φόρτωση Καιρού
    getWeather();
    
    // 2. ΕΛΕΓΧΟΣ ΜΝΗΜΗΣ ΠΡΩΤΑ
    const saved = localStorage.getItem('userLang');
    
    // 3. ΑΠΟΦΑΣΗ: Αν υπάρχει σωσμένη γλώσσα, βάλε αυτή. 
    // Αν όχι, βάλε 'en' ως αρχική επιλογή.
    if (saved) {
        setLanguage(saved);
    } else {
        setLanguage('en'); 
    }
});

// Κλείσιμο Modal όταν πατάμε έξω από αυτό
window.onclick = function(event) {
    const modal = document.getElementById('infoModal');
    if (event.target == modal) closeModal();
}

// Mobile Menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}