/* --- 1. CONFIG SUPABASE --- */
const PROJECT_URL = 'https://qahpepjvksxrhugmxpgg.supabase.co';
const PROJECT_KEY = 'sb_publishable_nsjM78oxiVSKQrjpRzcg-Q_4lFeDNVO';

let dbClient;
if (typeof supabase !== 'undefined') {
    dbClient = supabase.createClient(PROJECT_URL, PROJECT_KEY);
}

let currentLang = localStorage.getItem('userLang') || 'en';
let currentUser = null;
let favoritePlaceIds = new Set();

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
        "filter-promenades": "🚶‍♂️ Περιπάτοι",
        "nav-login": "Σύνδεση",
        "nav-logout": "Αποσύνδεση",
        "auth-title-login": "Σύνδεση",
        "auth-title-signup": "Εγγραφή",
        "auth-email": "Email",
        "auth-password": "Κωδικός",
        "auth-submit-login": "Σύνδεση",
        "auth-submit-signup": "Δημιουργία λογαριασμού",
        "auth-switch-to-signup": "Δεν έχετε λογαριασμό; Εγγραφή",
        "auth-switch-to-login": "Έχετε ήδη λογαριασμό; Σύνδεση",
        "auth-check-email": "Ελέγξτε το email σας για επιβεβαίωση.",
        "auth-error": "Κάτι πήγε στραβά. Δοκιμάστε ξανά.",
        "nav-favorites": "Αγαπημένα",
        "fav-save": "Αποθήκευση",
        "fav-saved": "Αποθηκευμένο",
        "fav-login-required": "Συνδεθείτε για να αποθηκεύσετε αγαπημένα.",
        "fav-empty": "Δεν έχετε αποθηκεύσει ακόμα μέρη.",
        "fav-title": "Τα Αγαπημένα μου"
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
        "filter-promenades": "🚶‍♂️ Promenades",
        "nav-login": "Login",
        "nav-logout": "Logout",
        "auth-title-login": "Log in",
        "auth-title-signup": "Sign up",
        "auth-email": "Email",
        "auth-password": "Password",
        "auth-submit-login": "Log in",
        "auth-submit-signup": "Create account",
        "auth-switch-to-signup": "No account? Sign up",
        "auth-switch-to-login": "Already have an account? Log in",
        "auth-check-email": "Check your email to confirm your account.",
        "auth-error": "Something went wrong. Please try again.",
        "nav-favorites": "Favorites",
        "fav-save": "Save",
        "fav-saved": "Saved",
        "fav-login-required": "Log in to save favorites.",
        "fav-empty": "You have not saved any places yet.",
        "fav-title": "My Favorites"
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
        "filter-promenades": "🚶‍♂️ Прогулки",
        "nav-login": "Войти",
        "nav-logout": "Выйти",
        "auth-title-login": "Вход",
        "auth-title-signup": "Регистрация",
        "auth-email": "Email",
        "auth-password": "Пароль",
        "auth-submit-login": "Войти",
        "auth-submit-signup": "Создать аккаунт",
        "auth-switch-to-signup": "Нет аккаунта? Регистрация",
        "auth-switch-to-login": "Уже есть аккаунт? Войти",
        "auth-check-email": "Проверьте email для подтверждения.",
        "auth-error": "Что-то пошло не так. Попробуйте снова.",
        "nav-favorites": "Избранное",
        "fav-save": "Сохранить",
        "fav-saved": "Сохранено",
        "fav-login-required": "Войдите, чтобы сохранять избранное.",
        "fav-empty": "Вы ещё ничего не сохранили.",
        "fav-title": "Моё избранное"
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
        "filter-promenades": "🚶‍♂️ 散步",
        "nav-login": "登录",
        "nav-logout": "退出",
        "auth-title-login": "登录",
        "auth-title-signup": "注册",
        "auth-email": "邮箱",
        "auth-password": "密码",
        "auth-submit-login": "登录",
        "auth-submit-signup": "创建账户",
        "auth-switch-to-signup": "没有账户？注册",
        "auth-switch-to-login": "已有账户？登录",
        "auth-check-email": "请查收邮箱以确认账户。",
        "auth-error": "出错了，请重试。",
        "nav-favorites": "收藏",
        "fav-save": "收藏",
        "fav-saved": "已收藏",
        "fav-login-required": "请登录后收藏。",
        "fav-empty": "你还没有收藏任何地点。",
        "fav-title": "我的收藏"
    }
};

/* --- 2b. AUTH (LOGIN / SIGN UP / LOGOUT) --- */
function t(key) {
    return (staticTranslations[currentLang] && staticTranslations[currentLang][key]) ||
        (staticTranslations.en[key] || key);
}

function injectAuthUI() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && !document.getElementById('favorites-nav-item')) {
        const favLi = document.createElement('li');
        favLi.id = 'favorites-nav-item';
        favLi.innerHTML = `<a href="favorites.html" data-i18n="nav-favorites">${t('nav-favorites')}</a>`;
        navLinks.appendChild(favLi);
    }
    if (navLinks && !document.getElementById('auth-nav-item')) {
        const li = document.createElement('li');
        li.id = 'auth-nav-item';
        li.innerHTML = `
            <button type="button" id="auth-nav-btn" class="auth-nav-btn" data-i18n="nav-login">${t('nav-login')}</button>
            <span id="auth-user-email" class="auth-user-email" hidden></span>
        `;
        navLinks.appendChild(li);
    }

    if (document.getElementById('authModal')) return;

    const modal = document.createElement('div');
    modal.id = 'authModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content auth-modal-content">
            <span class="close-btn" id="auth-close-btn">&times;</span>
            <h2 id="auth-modal-title" data-i18n="auth-title-login">${t('auth-title-login')}</h2>
            <form id="auth-form" class="auth-form">
                <label for="auth-email">
                    <span data-i18n="auth-email">${t('auth-email')}</span>
                    <input type="email" id="auth-email" name="email" required autocomplete="email">
                </label>
                <label for="auth-password">
                    <span data-i18n="auth-password">${t('auth-password')}</span>
                    <div class="password-field">
                        <input type="password" id="auth-password" name="password" required minlength="6" autocomplete="current-password">
                        <button type="button" id="auth-password-toggle" class="password-toggle" aria-label="Show password" title="Show password">
                            <i class="fa-regular fa-eye" aria-hidden="true"></i>
                        </button>
                    </div>
                </label>
                <button type="submit" id="auth-submit-btn" class="btn auth-submit-btn" data-i18n="auth-submit-login">${t('auth-submit-login')}</button>
            </form>
            <p id="auth-message" class="auth-message" hidden></p>
            <button type="button" id="auth-switch-btn" class="auth-switch-btn" data-i18n="auth-switch-to-signup">${t('auth-switch-to-signup')}</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('auth-nav-btn').addEventListener('click', handleAuthNavClick);
    document.getElementById('auth-close-btn').addEventListener('click', closeAuthModal);
    document.getElementById('auth-switch-btn').addEventListener('click', toggleAuthMode);
    document.getElementById('auth-form').addEventListener('submit', handleAuthSubmit);
    document.getElementById('auth-password-toggle').addEventListener('click', togglePasswordVisibility);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAuthModal();
    });
}

function openAuthModal(mode = 'login') {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    closeMobileMenu();
    modal.dataset.mode = mode;
    setAuthMode(mode);
    clearAuthMessage();
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    const form = document.getElementById('auth-form');
    if (form) form.reset();
    const passwordInput = document.getElementById('auth-password');
    if (passwordInput) passwordInput.type = 'password';
    const toggleBtn = document.getElementById('auth-password-toggle');
    if (toggleBtn) {
        toggleBtn.setAttribute('aria-label', 'Show password');
        toggleBtn.title = 'Show password';
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fa-regular fa-eye';
    }
    clearAuthMessage();
}

function setAuthMode(mode) {
    const isSignup = mode === 'signup';
    const title = document.getElementById('auth-modal-title');
    const submit = document.getElementById('auth-submit-btn');
    const switchBtn = document.getElementById('auth-switch-btn');
    const password = document.getElementById('auth-password');

    if (title) {
        title.setAttribute('data-i18n', isSignup ? 'auth-title-signup' : 'auth-title-login');
        title.innerText = t(isSignup ? 'auth-title-signup' : 'auth-title-login');
    }
    if (submit) {
        submit.setAttribute('data-i18n', isSignup ? 'auth-submit-signup' : 'auth-submit-login');
        submit.innerText = t(isSignup ? 'auth-submit-signup' : 'auth-submit-login');
    }
    if (switchBtn) {
        switchBtn.setAttribute('data-i18n', isSignup ? 'auth-switch-to-login' : 'auth-switch-to-signup');
        switchBtn.innerText = t(isSignup ? 'auth-switch-to-login' : 'auth-switch-to-signup');
    }
    if (password) {
        password.autocomplete = isSignup ? 'new-password' : 'current-password';
    }
}

function toggleAuthMode() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    const next = modal.dataset.mode === 'signup' ? 'login' : 'signup';
    modal.dataset.mode = next;
    setAuthMode(next);
    clearAuthMessage();
}

function showAuthMessage(text, type = 'error') {
    const el = document.getElementById('auth-message');
    if (!el) return;
    el.hidden = false;
    el.className = `auth-message auth-message-${type}`;
    el.innerText = text;
}

function clearAuthMessage() {
    const el = document.getElementById('auth-message');
    if (!el) return;
    el.hidden = true;
    el.innerText = '';
}

function togglePasswordVisibility() {
    const input = document.getElementById('auth-password');
    const btn = document.getElementById('auth-password-toggle');
    if (!input || !btn) return;

    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    btn.title = showing ? 'Show password' : 'Hide password';
    const icon = btn.querySelector('i');
    if (icon) {
        icon.className = showing ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash';
    }
}

async function handleAuthNavClick() {
    if (currentUser) {
        await handleLogout();
        return;
    }
    openAuthModal('login');
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    if (!dbClient) return;

    const modal = document.getElementById('authModal');
    const mode = modal?.dataset.mode || 'login';
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const submitBtn = document.getElementById('auth-submit-btn');

    if (submitBtn) submitBtn.disabled = true;
    clearAuthMessage();

    try {
        if (mode === 'signup') {
            const { data, error } = await dbClient.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/index.html`
                }
            });
            if (error) throw error;

            if (data.session) {
                currentUser = data.user;
                updateAuthUI();
                closeAuthModal();
            } else {
                showAuthMessage(t('auth-check-email'), 'success');
            }
        } else {
            const { data, error } = await dbClient.auth.signInWithPassword({ email, password });
            if (error) throw error;
            currentUser = data.user;
            updateAuthUI();
            closeAuthModal();
        }
    } catch (err) {
        showAuthMessage(err.message || t('auth-error'), 'error');
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}

async function handleLogout() {
    if (!dbClient) return;
    const { error } = await dbClient.auth.signOut();
    if (error) {
        console.error('Logout error:', error);
        return;
    }
    currentUser = null;
    updateAuthUI();
}

function updateAuthUI() {
    const btn = document.getElementById('auth-nav-btn');
    const emailEl = document.getElementById('auth-user-email');
    if (!btn) return;

    if (currentUser) {
        btn.setAttribute('data-i18n', 'nav-logout');
        btn.innerText = t('nav-logout');
        btn.classList.add('is-logged-in');
        if (emailEl) {
            emailEl.hidden = false;
            emailEl.innerText = currentUser.email || '';
        }
    } else {
        btn.setAttribute('data-i18n', 'nav-login');
        btn.innerText = t('nav-login');
        btn.classList.remove('is-logged-in');
        if (emailEl) {
            emailEl.hidden = true;
            emailEl.innerText = '';
        }
    }
}

async function initAuth() {
    if (!dbClient) return;
    injectAuthUI();

    const { data: { session } } = await dbClient.auth.getSession();
    currentUser = session?.user ?? null;
    updateAuthUI();
    await loadFavoriteIds();

    // Clean auth tokens from the URL after email confirmation / magic link
    if (window.location.hash && /access_token|refresh_token|type=/.test(window.location.hash)) {
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    }

    dbClient.auth.onAuthStateChange(async (_event, session) => {
        currentUser = session?.user ?? null;
        updateAuthUI();
        await loadFavoriteIds();
        refreshFavoriteButtons();
        if (document.getElementById('favorites-container')) loadFavoritesPage();
    });
}

/* --- 2c. FAVORITES --- */
async function loadFavoriteIds() {
    favoritePlaceIds = new Set();
    if (!dbClient || !currentUser) return;

    const { data, error } = await dbClient
        .from('user_favorites')
        .select('place_id');

    if (error) {
        console.error('Error loading favorites:', error);
        return;
    }

    (data || []).forEach(row => favoritePlaceIds.add(row.place_id));
}

function isFavorite(placeId) {
    return favoritePlaceIds.has(placeId);
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getPlaceIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('id');
    if (fromQuery) return fromQuery;

    // Backup if clean-URL tools strip ?id= but keep the hash
    const hash = window.location.hash.replace(/^#/, '');
    if (hash && !hash.includes('access_token') && !hash.includes('type=')) {
        return decodeURIComponent(hash);
    }

    // /details/amara style paths
    const parts = window.location.pathname.replace(/\.html$/i, '').split('/').filter(Boolean);
    if (parts[0] === 'details' && parts[1]) return decodeURIComponent(parts[1]);

    return null;
}

function detailsUrl(placeId) {
    const id = encodeURIComponent(placeId);
    // Query for normal hosts + hash backup if ?id= gets stripped locally
    return `details.html?id=${id}#${id}`;
}

function favoriteButtonHtml(placeId) {
    const saved = isFavorite(placeId);
    const iconClass = saved ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    const label = saved ? t('fav-saved') : t('fav-save');
    const safeId = escapeHtml(placeId);
    return `
        <button type="button"
            class="fav-btn${saved ? ' is-saved' : ''}"
            data-place-id="${safeId}"
            aria-label="${escapeHtml(label)}"
            title="${escapeHtml(label)}">
            <i class="${iconClass}"></i>
        </button>
    `;
}

function refreshFavoriteButtons() {
    document.querySelectorAll('.fav-btn[data-place-id]').forEach(btn => {
        const placeId = btn.getAttribute('data-place-id');
        const saved = isFavorite(placeId);
        btn.classList.toggle('is-saved', saved);
        btn.setAttribute('aria-label', saved ? t('fav-saved') : t('fav-save'));
        btn.title = saved ? t('fav-saved') : t('fav-save');
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = saved ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
        }
    });
}

async function toggleFavorite(event, placeId) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (!placeId) {
        const btn = event?.currentTarget || event?.target?.closest?.('.fav-btn');
        placeId = btn?.getAttribute('data-place-id');
    }
    if (!placeId || !dbClient) return;

    if (!currentUser) {
        openAuthModal('login');
        return;
    }

    const btn = event?.currentTarget?.classList?.contains('fav-btn')
        ? event.currentTarget
        : event?.target?.closest?.('.fav-btn');
    if (btn) btn.disabled = true;

    try {
        if (isFavorite(placeId)) {
            const { error } = await dbClient
                .from('user_favorites')
                .delete()
                .eq('user_id', currentUser.id)
                .eq('place_id', placeId);
            if (error) throw error;
            favoritePlaceIds.delete(placeId);
        } else {
            const { error } = await dbClient
                .from('user_favorites')
                .insert({ user_id: currentUser.id, place_id: placeId });
            if (error) throw error;
            favoritePlaceIds.add(placeId);
        }

        refreshFavoriteButtons();
        if (document.getElementById('favorites-container')) loadFavoritesPage();
    } catch (err) {
        console.error('Favorite toggle failed:', err);
        alert(err.message || t('auth-error'));
    } finally {
        if (btn) btn.disabled = false;
    }
}

function renderPlaceCard(place, { show = true } = {}) {
    const title = place[`title_${currentLang}`] || place.title_en || "No Title";
    const description = place[`desc_${currentLang}`] || place.desc_en || "";
    let finalUrl = place.image_url || "";
    if (finalUrl.includes('cloudinary.com')) {
        finalUrl = finalUrl.replace('/upload/', '/upload/f_auto,q_auto/');
    }

    const subCatClass = place.subcategory ? escapeHtml(place.subcategory) : "";
    const showClass = show ? "show" : "";
    const safeTitle = escapeHtml(title);
    const safeDesc = escapeHtml(description);
    const safeImg = escapeHtml(finalUrl || place.image_url || "");

    return `
        <div class="item-card ${subCatClass} ${showClass}">
            ${favoriteButtonHtml(place.id)}
            <a href="${detailsUrl(place.id)}" class="item-card-link" data-place-id="${escapeHtml(place.id)}">
                <img src="${safeImg}" alt="${safeTitle}">
                <div class="item-info">
                    <h3>${safeTitle}</h3>
                    <p>${safeDesc}</p>
                    <div style="margin-top: auto; color: #3cc6cb; font-weight: bold;">
                        <span>${t('btn-more')}</span> →
                    </div>
                </div>
            </a>
        </div>
    `;
}

async function loadFavoritesPage() {
    const container = document.getElementById('favorites-container');
    if (!container || !dbClient) return;

    if (!currentUser) {
        container.innerHTML = `
            <div class="favorites-empty">
                <p data-i18n="fav-login-required">${t('fav-login-required')}</p>
                <button type="button" class="btn" onclick="openAuthModal('login')" data-i18n="nav-login">${t('nav-login')}</button>
            </div>
        `;
        return;
    }

    const { data, error } = await dbClient
        .from('user_favorites')
        .select('place_id, created_at, places(*)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading favorites page:', error);
        container.innerHTML = `<p class="favorites-empty">${t('auth-error')}</p>`;
        return;
    }

    const places = (data || []).map(row => row.places).filter(Boolean);
    favoritePlaceIds = new Set((data || []).map(row => row.place_id));

    if (places.length === 0) {
        container.innerHTML = `<p class="favorites-empty" data-i18n="fav-empty">${t('fav-empty')}</p>`;
        return;
    }

    container.innerHTML = places.map(place => renderPlaceCard(place, { show: true })).join('');
}

/* --- 3. ΦΟΡΤΩΣΗ ΚΑΤΗΓΟΡΙΩΝ (ΟΛΕΣ ΟΙ ΕΙΚΟΝΕΣ & ΠΕΡΙΓΡΑΦΕΣ) --- */
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

    container.innerHTML = (places || []).map(place => renderPlaceCard(place, { show: true })).join('');
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
        const desc = place[`desc_${currentLang}`] || place.desc_en; // Διορθώθηκε το ID
        
        let finalUrl = place.image_url || "";
        if (finalUrl.includes('cloudinary.com')) {
            finalUrl = finalUrl.replace('/upload/', '/upload/f_auto,q_auto/');
        }

        container.innerHTML += `
            <div class="month-card">
                ${favoriteButtonHtml(place.id)}
                <a href="${detailsUrl(place.id)}" class="month-layout" data-place-id="${escapeHtml(place.id)}" style="text-decoration: none; color: inherit; display: flex;">
                    <img src="${escapeHtml(finalUrl)}" alt="${escapeHtml(title)}">
                    <div style="padding: 20px;">
                        <h3>${escapeHtml(title)}</h3>
                        <p>${escapeHtml(desc)}</p>
                    </div>
                </a>
            </div>`;
    });
}

/* --- 5. ΣΕΛΙΔΑ ΛΕΠΤΟΜΕΡΕΙΩΝ (DETAILS) --- */
async function loadFullDetails(id) {
    if (!dbClient) return;
    id = id || getPlaceIdFromUrl();
    if (!id) {
        const content = document.querySelector('.details-content');
        const header = document.getElementById('details-header');
        if (header) header.style.display = 'none';
        if (content) {
            content.innerHTML = `
                <p>No place selected.</p>
                <a class="btn" href="index.html">Home</a>
            `;
        }
        return;
    }

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
    const favSlot = document.getElementById('details-fav-slot');

    if (headerEl) headerEl.style.backgroundImage = `url('${imgUrl}')`;
    if (titleEl) titleEl.innerText = title;
    if (descEl) descEl.innerHTML = description; // Χρησιμοποιούμε innerHTML για να πιάνει τυχόν αλλαγές γραμμής
    if (favSlot) favSlot.innerHTML = favoriteButtonHtml(place.id);

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
    if (document.getElementById('favorites-container')) loadFavoritesPage();

    if (document.getElementById('place-title') || document.getElementById('details-header')) {
        loadFullDetails(getPlaceIdFromUrl());
    }
}

/* --- ΠΡΟΣΘΗΚΗ ΦΙΛΤΡΩΝ --- */
function filterSelection(category) {
    const cards = document.getElementsByClassName("item-card");
    
    // Αν δεν υπάρχουν κάρτες ακόμα (λόγω καθυστέρησης της Supabase), σταμάτα
    if (cards.length === 0) return;

    for (let i = 0; i < cards.length; i++) {
        // Αφαιρούμε την κλάση show για να "κλείσουν" όλες οι κάρτες
        cards[i].classList.remove("show");
        
        // Αν επιλέξαμε 'all' ή αν η κάρτα έχει την κλάση της υποκατηγορίας
        if (category === "all" || cards[i].classList.contains(category)) {
            cards[i].classList.add("show");
        }
    }
    
    // Διαχείριση του "Active" κουμπιού για να ξέρει ο χρήστης τι πάτησε
    const btns = document.querySelectorAll(".filter-btn");
    btns.forEach(btn => {
        btn.classList.remove("active");
        // Αν το κείμενο ή το onclick του κουμπιού ταιριάζει με την κατηγορία
        if (btn.getAttribute('onclick').includes(`'${category}'`)) {
            btn.classList.add("active");
        }
    });
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

function ensureNavBackdrop() {
    let backdrop = document.getElementById('nav-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'nav-backdrop';
        backdrop.className = 'nav-backdrop';
        backdrop.addEventListener('click', closeMobileMenu);
        document.body.appendChild(backdrop);
    }
    return backdrop;
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    const backdrop = document.getElementById('nav-backdrop');
    if (navLinks) navLinks.classList.remove('active');
    if (hamburger) hamburger.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove('menu-open');
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    if (!navLinks) return;

    const backdrop = ensureNavBackdrop();
    const willOpen = !navLinks.classList.contains('active');
    navLinks.classList.toggle('active', willOpen);
    if (hamburger) hamburger.classList.toggle('is-open', willOpen);
    backdrop.classList.toggle('active', willOpen);
    document.body.classList.toggle('menu-open', willOpen);
}

/* --- 7. ΕΚΚΙΝΗΣΗ --- */
document.addEventListener("click", (event) => {
    const favBtn = event.target.closest('.fav-btn');
    if (favBtn) {
        toggleFavorite(event, favBtn.getAttribute('data-place-id'));
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    getWeather();
    await initAuth();
    const saved = localStorage.getItem('userLang') || 'en';
    setLanguage(saved);

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
});