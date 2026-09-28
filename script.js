/* --- 1. CONFIG SUPABASE --- */
const PROJECT_URL = 'https://qahpepjvksxrhugmxpgg.supabase.co';
const PROJECT_KEY = 'sb_publishable_nsjM78oxiVSKQrjpRzcg-Q_4lFeDNVO';

let dbClient;
if (typeof supabase !== 'undefined') {
    dbClient = supabase.createClient(PROJECT_URL, PROJECT_KEY);
}

function resolvePlaceImage(url) {
    let finalUrl = (url || '').trim();
    if (!finalUrl) return '';
    if (finalUrl.includes('cloudinary.com')) {
        finalUrl = finalUrl.replace('/upload/', '/upload/f_auto,q_auto/');
    }
    if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith('data:')) {
        finalUrl = '/' + finalUrl.replace(/^\/+/, '');
    }
    return finalUrl;
}

let currentLang = localStorage.getItem('userLang') || 'en';
let currentUser = null;
let signupAvatar = null;
let profileAvatar = null;
let profileAvatarRemoved = false;
let favoritePlaceIds = new Set();
let categoryMap = null;
let categoryMarkerLayer = null;
let categoryPlacesCache = [];
let homeMap = null;
let homeMarkerLayer = null;
let homePlacesCache = [];
let favoritesMap = null;
let favoritesMarkerLayer = null;
let favoritesPlacesCache = [];
let detailsMap = null;
let leafletLoader = null;
let activeMapFilter = 'all';
let activeTypeFilter = 'all';
let activeTownFilter = 'all';
let activeCategoryFilter = 'all';
let markerIconCache = {};

/* --- 2. ΠΛΗΡΕΣ ΛΕΞΙΚΟ (ΟΛΕΣ ΟΙ ΓΛΩΣΣΕΣ - 100% COMPLETE) --- */
const staticTranslations = {
    el: { 
        "nav-home": "Αρχική", 
        "nav-hotels": "Ξενοδοχεία", 
        "nav-restaurants": "Εστιατόρια", 
        "nav-views": "Θέα", 
        "nav-beaches": "Παραλίες",
        "nav-realestate": "Ακίνητα", 
        "nav-things": "Δραστηριότητες", 
        "nav-services": "Υπηρεσίες",
        "hero-title": "Ανακάλυψε την Κύπρο", 
        "hero-desc": "Τα καλύτερα του νησιού, προτεινόμενα από ντόπιους.",
        "explore-btn": "Εξερεύνηση",
        "slider-label": "Κατηγορίες",
        "slider-prev": "Προηγούμενη κατηγορία",
        "slider-next": "Επόμενη κατηγορία",
        "categories-title": "Οι Κατηγορίες Μας",
        "card-hotels-title": "Καλύτερα Ξενοδοχεία",
        "card-restaurants-title": "Καλύτερα Εστιατόρια",
        "card-views-title": "Καλύτερες Θέες",
        "card-beaches-title": "Καλύτερες Παραλίες",
        "card-realestate-title": "Καλύτερα Ακίνητα",
        "card-things-title": "Καλύτερες Δραστηριότητες",
        "card-services-title": "Καλύτερες Υπηρεσίες",
        "card-hotels": "Πολυτέλεια και φιλοξενία.",
        "card-restaurants": "Γεύσεις που μαγεύουν.",
        "card-views": "Τα ωραιότερα ηλιοβασιλέματα.",
        "card-beaches": "Κρυστάλλινα νερά και χρυσή άμμος.",
        "card-realestate": "Τα καλύτερα ακίνητα.",
        "card-things": "Δραστηριότητες και εμπειρίες.",
        "card-services": "Υπηρεσίες που εμπιστεύονται οι ντόπιοι.",
        "cat-hotels-title": "Καλύτερα Ξενοδοχεία",
        "cat-restaurants-title": "Καλύτερα Εστιατόρια",
        "cat-views-title": "Καλύτερες Θέες",
        "cat-beaches-title": "Καλύτερες Παραλίες",
        "cat-realestate-title": "Καλύτερα Ακίνητα",
        "cat-things-title": "Δραστηριότητες",
        "cat-services-title": "Καλύτερες Υπηρεσίες",
        "best-of": "Το καλύτερο του",
        "month-0": "Ιανουαρίου",
        "month-1": "Φεβρουαρίου",
        "month-2": "Μαρτίου",
        "month-3": "Απριλίου",
        "month-4": "Μαΐου",
        "month-5": "Ιουνίου",
        "month-6": "Ιουλίου",
        "month-7": "Αυγούστου",
        "month-8": "Σεπτεμβρίου",
        "month-9": "Οκτωβρίου",
        "month-10": "Νοεμβρίου",
        "month-11": "Δεκεμβρίου",
        "weather-label": "Καιρός Κύπρου:",
        "footer-tagline": "Τα καλύτερα του νησιού, προτεινόμενα από ντόπιους.",
        "footer-copyright": "© 2026 Cyprus Best. Με επιφύλαξη παντός δικαιώματος.",
        "map-show": "Εμφάνιση χάρτη",
        "map-hide": "Απόκρυψη χάρτη",
        "map-title": "Χάρτης",
        "map-empty": "Δεν υπάρχουν τοποθεσίες στον χάρτη.",
        "home-map-title": "Εξερεύνησε την Κύπρο στον χάρτη",
        "home-map-desc": "Όλα τα προτεινόμενα μέρη σε μία προβολή.",
        "map-legend-places": "Μέρη",
        "map-legend-favorites": "Τα αγαπημένα σου",
        "fav-map-title": "Τα αγαπημένα σου στον χάρτη",
        "btn-more": "Περισσότερα", 
        "loading": "Φόρτωση δεδομένων...", 
        "lbl-phone": "📞 Τηλέφωνο:", 
        "lbl-website": "🌍 Website", 
        "lbl-map": "📍 Άνοιγμα Χάρτη", 
        "btn-back": "Πίσω",
        "filter-all": "Όλα",
        "filter-towns": "Πόλη",
        "town-paphos": "Πάφος",
        "town-limassol": "Λεμεσός",
        "town-larnaca": "Λάρνακα",
        "town-nicosia": "Λευκωσία",
        "town-ayia_napa": "Αγία Νάπα",
        "town-protaras": "Πρωταράς",
        "town-famagusta": "Αμμόχωστος",
        "town-other": "Άλλο",
        "filter-safari": "🚙 Σαφάρι", 
        "filter-boat": "🛥️ Σκάφος", 
        "filter-diving": "🤿 Κατάδυση",
        "filter-watersports": "🏊‍♂️ Υδροσκάφηση",
        "filter-ski": "⛷️ Σκι", 
        "filter-culture": "🏛️ Πολιτισμός", 
        "filter-wine": "🍷 Κρασί", 
        "filter-yoga": "🧘🏻‍♀️ Γιόγκα",
        "filter-trad": "🍲 Παραδοσιακά", 
        "filter-fine": "🍷 Πολυτελή", 
        "filter-asian": "🥢 Ασιατικά",
        "filter-mexican": "🌮 Μεξικάνικα", 
        "filter-law": "⚖️ Νομικά",
        "filter-medical": "🏥 Ιατρικά", 
        "filter-accounting": "📊 Λογιστικά", 
        "filter-architects": "🏗️ Αρχιτέκτονες",
        "filter-flowers": "🌸 Ανθοπωλεία", 
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
        "auth-check-email": "Σας στείλαμε email επιβεβαίωσης. Ανοίξτε τον σύνδεσμο για να ενεργοποιηθεί ο λογαριασμός.",
        "auth-error": "Κάτι πήγε στραβά. Δοκιμάστε ξανά.",
        "auth-forgot": "Ξεχάσατε τον κωδικό;",
        "auth-title-forgot": "Επαναφορά κωδικού",
        "auth-submit-forgot": "Αποστολή email",
        "auth-reset-sent": "Σας στείλαμε email με σύνδεσμο για νέο κωδικό.",
        "auth-back-to-login": "Επιστροφή στη σύνδεση",
        "auth-title-recovery": "Νέος κωδικός",
        "auth-new-password": "Νέος κωδικός",
        "auth-submit-recovery": "Αποθήκευση κωδικού",
        "auth-password-updated": "Ο κωδικός άλλαξε. Είστε συνδεδεμένοι.",
        "auth-reset-link-invalid": "Ο σύνδεσμος έληξε ή δεν είναι έγκυρος. Ζητήστε νέο.",
        "auth-email-not-confirmed": "Επιβεβαιώστε πρώτα το email σας για να συνδεθείτε.",
        "auth-already-registered": "Υπάρχει ήδη λογαριασμός με αυτό το email.",
        "auth-resend": "Αποστολή email ξανά",
        "auth-resend-sent": "Σας στείλαμε ξανά το email επιβεβαίωσης.",
        "auth-username": "Όνομα χρήστη",
        "auth-username-invalid": "Το όνομα χρήστη χρειάζεται 3–20 χαρακτήρες: γράμματα, αριθμοί, τελεία, παύλα ή κάτω παύλα.",
        "auth-avatar": "Φωτογραφία προφίλ",
        "auth-avatar-optional": "Προαιρετική",
        "auth-avatar-invalid": "Επιλέξτε εικόνα έως 8 MB.",
        "profile-title": "Προφίλ",
        "profile-save": "Αποθήκευση",
        "profile-saved": "Το προφίλ αποθηκεύτηκε.",
        "profile-remove-photo": "Αφαίρεση φωτογραφίας",
        "profile-settings": "Ρυθμίσεις",
        "profile-section-profile": "Προφίλ",
        "profile-section-email": "Email",
        "profile-section-password": "Κωδικός",
        "profile-email-hint": "Θα στείλουμε σύνδεσμο επιβεβαίωσης στο νέο email.",
        "profile-email-sent": "Ελέγξτε το νέο email και ανοίξτε τον σύνδεσμο για να ολοκληρωθεί η αλλαγή.",
        "profile-email-saved": "Το email άλλαξε.",
        "profile-email-same": "Αυτό είναι ήδη το email σας.",
        "profile-email-invalid": "Γράψτε ένα έγκυρο email.",
        "profile-save-email": "Αποθήκευση email",
        "profile-password-new": "Νέος κωδικός",
        "profile-password-confirm": "Επιβεβαίωση κωδικού",
        "profile-password-mismatch": "Οι κωδικοί δεν είναι ίδιοι.",
        "profile-password-short": "Ο κωδικός χρειάζεται τουλάχιστον 6 χαρακτήρες.",
        "profile-password-saved": "Ο κωδικός άλλαξε.",
        "profile-save-password": "Αποθήκευση κωδικού",
        "profile-password-nonce": "Κωδικός επιβεβαίωσης",
        "profile-password-reauth": "Σας στείλαμε email με κωδικό επιβεβαίωσης. Γράψτε τον και πατήστε ξανά αποθήκευση.",
        "nav-favorites": "Αγαπημένα",
        "fav-save": "Αποθήκευση",
        "fav-saved": "Αποθηκευμένο",
        "fav-login-required": "Συνδεθείτε για να αποθηκεύσετε αγαπημένα.",
        "fav-empty": "Δεν έχετε αποθηκεύσει ακόμα μέρη.",
        "fav-filter-empty": "Δεν υπάρχουν αγαπημένα για αυτό το φίλτρο.",
        "fav-title": "Τα Αγαπημένα μου"
    },
    en: { 
        "nav-home": "Home", 
        "nav-hotels": "Hotels", 
        "nav-restaurants": "Restaurants", 
        "nav-views": "Views", 
        "nav-beaches": "Beaches",
        "nav-realestate": "Real Estate", 
        "nav-things": "Things to Do", 
        "nav-services": "Services",
        "hero-title": "Explore Cyprus", 
        "hero-desc": "The best of the island, recommended by locals.",
        "explore-btn": "Explore Now",
        "slider-label": "Categories",
        "slider-prev": "Previous category",
        "slider-next": "Next category",
        "categories-title": "Our Categories",
        "card-hotels-title": "Best Hotels",
        "card-restaurants-title": "Best Restaurants",
        "card-views-title": "Best Views",
        "card-beaches-title": "Best Beaches",
        "card-realestate-title": "Best Real Estate",
        "card-things-title": "Best Things to Do",
        "card-services-title": "Best Services",
        "card-hotels": "Luxury and hospitality.",
        "card-restaurants": "Flavors that captivate.",
        "card-views": "The most beautiful sunsets.",
        "card-beaches": "Crystal waters and golden sand.",
        "card-realestate": "The best properties.",
        "card-things": "Activities and experiences.",
        "card-services": "Services locals trust.",
        "cat-hotels-title": "Best Hotels",
        "cat-restaurants-title": "Best Restaurants",
        "cat-views-title": "Best Views",
        "cat-beaches-title": "Best Beaches",
        "cat-realestate-title": "Best Real Estate",
        "cat-things-title": "Things to Do",
        "cat-services-title": "Best Services",
        "best-of": "Best of",
        "month-0": "January",
        "month-1": "February",
        "month-2": "March",
        "month-3": "April",
        "month-4": "May",
        "month-5": "June",
        "month-6": "July",
        "month-7": "August",
        "month-8": "September",
        "month-9": "October",
        "month-10": "November",
        "month-11": "December",
        "weather-label": "Cyprus Weather:",
        "footer-tagline": "The best of the island, recommended by locals.",
        "footer-copyright": "© 2026 Cyprus Best. All rights reserved.",
        "map-show": "Show map",
        "map-hide": "Hide map",
        "map-title": "Map",
        "map-empty": "No locations to show on the map.",
        "home-map-title": "Explore Cyprus on the Map",
        "home-map-desc": "All recommended places in one view.",
        "map-legend-places": "Places",
        "map-legend-favorites": "Your favorites",
        "fav-map-title": "Your favorites on the map",
        "btn-more": "More Info", 
        "loading": "Loading data...",
        "lbl-phone": "📞 Phone:", 
        "lbl-website": "🌍 Website", 
        "lbl-map": "📍 Open Map", 
        "btn-back": "Back",
        "filter-all": "All",
        "filter-towns": "Town",
        "town-paphos": "Paphos",
        "town-limassol": "Limassol",
        "town-larnaca": "Larnaca",
        "town-nicosia": "Nicosia",
        "town-ayia_napa": "Ayia Napa",
        "town-protaras": "Protaras",
        "town-famagusta": "Famagusta",
        "town-other": "Other",
        "filter-safari": "🚙 Safari", 
        "filter-boat": "🛥️ Boat Trips", 
        "filter-diving": "🤿 Diving",
        "filter-watersports": "🏊‍♂️ Water Sports",
        "filter-ski": "⛷️ Ski", 
        "filter-culture": "🏛️ Culture", 
        "filter-wine": "🍷 Wine", 
        "filter-yoga": "🧘🏻‍♀️ Yoga",
        "filter-trad": "🍲 Traditional", 
        "filter-fine": "🍷 Fine Dining", 
        "filter-asian": "🥢 Asian",
        "filter-mexican": "🌮 Mexican", 
        "filter-law": "⚖️ Legal",
        "filter-medical": "🏥 Medical", 
        "filter-accounting": "📊 Accounting", 
        "filter-architects": "🏗️ Architects",
        "filter-flowers": "🌸 Florists", 
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
        "auth-check-email": "We sent a confirmation email. Open the link to activate your account.",
        "auth-error": "Something went wrong. Please try again.",
        "auth-forgot": "Forgot password?",
        "auth-title-forgot": "Reset password",
        "auth-submit-forgot": "Send reset email",
        "auth-reset-sent": "We sent you an email with a link to set a new password.",
        "auth-back-to-login": "Back to log in",
        "auth-title-recovery": "New password",
        "auth-new-password": "New password",
        "auth-submit-recovery": "Save password",
        "auth-password-updated": "Your password was updated. You are signed in.",
        "auth-reset-link-invalid": "This link has expired or is invalid. Request a new one.",
        "auth-email-not-confirmed": "Confirm your email before logging in.",
        "auth-already-registered": "An account with this email already exists.",
        "auth-resend": "Send confirmation again",
        "auth-resend-sent": "We sent the confirmation email again.",
        "auth-username": "Username",
        "auth-username-invalid": "Username must be 3–20 characters: letters, numbers, dot, hyphen, or underscore.",
        "auth-avatar": "Profile photo",
        "auth-avatar-optional": "Optional",
        "auth-avatar-invalid": "Choose an image up to 8 MB.",
        "profile-title": "Profile",
        "profile-save": "Save",
        "profile-saved": "Profile saved.",
        "profile-remove-photo": "Remove photo",
        "profile-settings": "Settings",
        "profile-section-profile": "Profile",
        "profile-section-email": "Email",
        "profile-section-password": "Password",
        "profile-email-hint": "We will send a confirmation link to the new email.",
        "profile-email-sent": "Check the new email and open the link to finish the change.",
        "profile-email-saved": "Your email was updated.",
        "profile-email-same": "This is already your email.",
        "profile-email-invalid": "Enter a valid email.",
        "profile-save-email": "Save email",
        "profile-password-new": "New password",
        "profile-password-confirm": "Confirm password",
        "profile-password-mismatch": "Passwords do not match.",
        "profile-password-short": "Password must be at least 6 characters.",
        "profile-password-saved": "Your password was updated.",
        "profile-save-password": "Save password",
        "profile-password-nonce": "Confirmation code",
        "profile-password-reauth": "We emailed you a confirmation code. Enter it and save again.",
        "nav-favorites": "Favorites",
        "fav-save": "Save",
        "fav-saved": "Saved",
        "fav-login-required": "Log in to save favorites.",
        "fav-empty": "You have not saved any places yet.",
        "fav-filter-empty": "No favorites match this filter.",
        "fav-title": "My Favorites"
    },
    ru: { 
        "nav-home": "Главная", 
        "nav-hotels": "Отели", 
        "nav-restaurants": "Рестораны", 
        "nav-views": "Виды", 
        "nav-beaches": "Пляжи",
        "nav-realestate": "Недвижимость", 
        "nav-things": "Развлечения", 
        "nav-services": "Услуги",
        "hero-title": "Исследуйте Кипр", 
        "hero-desc": "Лучшее на острове, рекомендовано местными жителями.",
        "explore-btn": "Исследовать",
        "slider-label": "Категории",
        "slider-prev": "Предыдущая категория",
        "slider-next": "Следующая категория",
        "categories-title": "Наши категории",
        "card-hotels-title": "Лучшие отели",
        "card-restaurants-title": "Лучшие рестораны",
        "card-views-title": "Лучшие виды",
        "card-beaches-title": "Лучшие пляжи",
        "card-realestate-title": "Лучшая недвижимость",
        "card-things-title": "Лучшие развлечения",
        "card-services-title": "Лучшие услуги",
        "card-hotels": "Роскошь и гостеприимство.",
        "card-restaurants": "Вкусы, которые покоряют.",
        "card-views": "Самые красивые закаты.",
        "card-beaches": "Лазурное море и золотой песок.",
        "card-realestate": "Лучшая недвижимость.",
        "card-things": "Активности и впечатления.",
        "card-services": "Услуги, которым доверяют местные.",
        "cat-hotels-title": "Лучшие отели",
        "cat-restaurants-title": "Лучшие рестораны",
        "cat-views-title": "Лучшие виды",
        "cat-beaches-title": "Лучшие пляжи",
        "cat-realestate-title": "Лучшая недвижимость",
        "cat-things-title": "Развлечения",
        "cat-services-title": "Лучшие услуги",
        "best-of": "Лучшее за",
        "month-0": "январь",
        "month-1": "февраль",
        "month-2": "март",
        "month-3": "апрель",
        "month-4": "май",
        "month-5": "июнь",
        "month-6": "июль",
        "month-7": "август",
        "month-8": "сентябрь",
        "month-9": "октябрь",
        "month-10": "ноябрь",
        "month-11": "декабрь",
        "weather-label": "Погода на Кипре:",
        "footer-tagline": "Лучшее на острове, рекомендовано местными жителями.",
        "footer-copyright": "© 2026 Cyprus Best. Все права защищены.",
        "map-show": "Показать карту",
        "map-hide": "Скрыть карту",
        "map-title": "Карта",
        "map-empty": "Нет мест для отображения на карте.",
        "home-map-title": "Исследуйте Кипр на карте",
        "home-map-desc": "Все рекомендованные места на одном экране.",
        "map-legend-places": "Места",
        "map-legend-favorites": "Ваше избранное",
        "fav-map-title": "Ваше избранное на карте",
        "btn-more": "Подробнее", 
        "loading": "Загрузка данных...",
        "lbl-phone": "📞 Телефон:", 
        "lbl-website": "🌍 Веб-сайт", 
        "lbl-map": "📍 Открыть карту", 
        "btn-back": "Назад",
        "filter-all": "Все",
        "filter-towns": "Город",
        "town-paphos": "Пафос",
        "town-limassol": "Лимассол",
        "town-larnaca": "Ларнака",
        "town-nicosia": "Никосия",
        "town-ayia_napa": "Айя-Напа",
        "town-protaras": "Протарас",
        "town-famagusta": "Фамагуста",
        "town-other": "Другое",
        "filter-safari": "🚙 Сафари", 
        "filter-boat": "🛥️ Лодки", 
        "filter-diving": "🤿 Дайвинг",
        "filter-watersports": "🏊‍♂️ Водные виды спорта",
        "filter-ski": "⛷️ Лыжи", 
        "filter-culture": "🏛️ Культура", 
        "filter-wine": "🍷 Вино", 
        "filter-yoga": "🧘🏻‍♀️ Йога",
        "filter-trad": "🍲 Традиционные", 
        "filter-fine": "🍷 Изысканные", 
        "filter-asian": "🥢 Азиатские",
        "filter-mexican": "🌮 Мексиканские", 
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
        "auth-check-email": "Мы отправили письмо для подтверждения. Откройте ссылку, чтобы активировать аккаунт.",
        "auth-error": "Что-то пошло не так. Попробуйте снова.",
        "auth-forgot": "Забыли пароль?",
        "auth-title-forgot": "Сброс пароля",
        "auth-submit-forgot": "Отправить письмо",
        "auth-reset-sent": "Мы отправили письмо со ссылкой для нового пароля.",
        "auth-back-to-login": "Вернуться ко входу",
        "auth-title-recovery": "Новый пароль",
        "auth-new-password": "Новый пароль",
        "auth-submit-recovery": "Сохранить пароль",
        "auth-password-updated": "Пароль изменён. Вы вошли в аккаунт.",
        "auth-reset-link-invalid": "Ссылка недействительна или истекла. Запросите новую.",
        "auth-email-not-confirmed": "Сначала подтвердите email, чтобы войти.",
        "auth-already-registered": "Аккаунт с этим email уже существует.",
        "auth-resend": "Отправить письмо снова",
        "auth-resend-sent": "Мы снова отправили письмо для подтверждения.",
        "auth-username": "Имя пользователя",
        "auth-username-invalid": "Имя пользователя: 3–20 символов (буквы, цифры, точка, дефис или подчёркивание).",
        "auth-avatar": "Фото профиля",
        "auth-avatar-optional": "Необязательно",
        "auth-avatar-invalid": "Выберите изображение до 8 МБ.",
        "profile-title": "Профиль",
        "profile-save": "Сохранить",
        "profile-saved": "Профиль сохранён.",
        "profile-remove-photo": "Удалить фото",
        "profile-settings": "Настройки",
        "profile-section-profile": "Профиль",
        "profile-section-email": "Email",
        "profile-section-password": "Пароль",
        "profile-email-hint": "Мы отправим ссылку подтверждения на новый email.",
        "profile-email-sent": "Откройте письмо на новом email, чтобы завершить смену.",
        "profile-email-saved": "Email изменён.",
        "profile-email-same": "Это уже ваш email.",
        "profile-email-invalid": "Введите корректный email.",
        "profile-save-email": "Сохранить email",
        "profile-password-new": "Новый пароль",
        "profile-password-confirm": "Подтвердите пароль",
        "profile-password-mismatch": "Пароли не совпадают.",
        "profile-password-short": "Пароль должен быть не короче 6 символов.",
        "profile-password-saved": "Пароль изменён.",
        "profile-save-password": "Сохранить пароль",
        "profile-password-nonce": "Код подтверждения",
        "profile-password-reauth": "Мы отправили код подтверждения на email. Введите его и сохраните снова.",
        "nav-favorites": "Избранное",
        "fav-save": "Сохранить",
        "fav-saved": "Сохранено",
        "fav-login-required": "Войдите, чтобы сохранять избранное.",
        "fav-empty": "Вы ещё ничего не сохранили.",
        "fav-filter-empty": "Нет избранного по этому фильтру.",
        "fav-title": "Моё избранное"
    },
    zh: { 
        "nav-home": "首页", 
        "nav-hotels": "酒店", 
        "nav-restaurants": "餐厅", 
        "nav-views": "景色", 
        "nav-beaches": "海滩",
        "nav-realestate": "房地产", 
        "nav-things": "休闲活动", 
        "nav-services": "服务",
        "hero-title": "探索塞浦路斯", 
        "hero-desc": "岛上最好的地方，由当地人推荐。",
        "explore-btn": "立即探索",
        "slider-label": "类别",
        "slider-prev": "上一类别",
        "slider-next": "下一类别",
        "categories-title": "我们的类别",
        "card-hotels-title": "最佳酒店",
        "card-restaurants-title": "最佳餐厅",
        "card-views-title": "最佳景色",
        "card-beaches-title": "最佳海滩",
        "card-realestate-title": "最佳房产",
        "card-things-title": "最佳活动",
        "card-services-title": "最佳服务",
        "card-hotels": "奢华与款待。",
        "card-restaurants": "令人着迷的美味。",
        "card-views": "最美的日落。",
        "card-beaches": "碧海与金色沙滩。",
        "card-realestate": "精选优质房产。",
        "card-things": "活动与体验。",
        "card-services": "当地人信赖的服务。",
        "cat-hotels-title": "最佳酒店",
        "cat-restaurants-title": "最佳餐厅",
        "cat-views-title": "最佳景色",
        "cat-beaches-title": "最佳海滩",
        "cat-realestate-title": "最佳房产",
        "cat-things-title": "休闲活动",
        "cat-services-title": "最佳服务",
        "best-of": "精选",
        "month-0": "一月",
        "month-1": "二月",
        "month-2": "三月",
        "month-3": "四月",
        "month-4": "五月",
        "month-5": "六月",
        "month-6": "七月",
        "month-7": "八月",
        "month-8": "九月",
        "month-9": "十月",
        "month-10": "十一月",
        "month-11": "十二月",
        "weather-label": "塞浦路斯天气：",
        "footer-tagline": "岛上最好的地方，由当地人推荐。",
        "footer-copyright": "© 2026 Cyprus Best. 版权所有。",
        "map-show": "显示地图",
        "map-hide": "隐藏地图",
        "map-title": "地图",
        "map-empty": "地图上暂无地点。",
        "home-map-title": "在地图上探索塞浦路斯",
        "home-map-desc": "一屏查看所有推荐地点。",
        "map-legend-places": "地点",
        "map-legend-favorites": "你的收藏",
        "fav-map-title": "地图上的收藏",
        "btn-more": "更多信息", 
        "loading": "加载数据...",
        "lbl-phone": "📞 电话:", 
        "lbl-website": "🌍 网站", 
        "lbl-map": "📍 打开地图", 
        "btn-back": "返回",
        "filter-all": "全部",
        "filter-towns": "城镇",
        "town-paphos": "帕福斯",
        "town-limassol": "利马索尔",
        "town-larnaca": "拉纳卡",
        "town-nicosia": "尼科西亚",
        "town-ayia_napa": "阿亚纳帕",
        "town-protaras": "普罗塔拉斯",
        "town-famagusta": "法马古斯塔",
        "town-other": "其他",
        "filter-safari": "🚙 野生动物园", 
        "filter-boat": "🛥️ 乘船游览", 
        "filter-diving": "🤿 潜水",
        "filter-watersports": "🏊‍♂️ 水上运动",
        "filter-ski": "⛷️ 滑雪", 
        "filter-culture": "🏛️ 文化", 
        "filter-wine": "🍷 葡萄酒", 
        "filter-yoga": "🧘🏻‍♀️ 瑜伽",
        "filter-trad": "🍲 传统", 
        "filter-fine": "🍷 高级餐饮", 
        "filter-asian": "🥢 亚洲",
        "filter-mexican": "🌮 墨西哥", 
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
        "auth-check-email": "我们已发送确认邮件。请打开链接以激活账户。",
        "auth-error": "出错了，请重试。",
        "auth-forgot": "忘记密码？",
        "auth-title-forgot": "重置密码",
        "auth-submit-forgot": "发送邮件",
        "auth-reset-sent": "我们已发送邮件，请通过链接设置新密码。",
        "auth-back-to-login": "返回登录",
        "auth-title-recovery": "新密码",
        "auth-new-password": "新密码",
        "auth-submit-recovery": "保存密码",
        "auth-password-updated": "密码已更新，您已登录。",
        "auth-reset-link-invalid": "链接已失效或已过期，请重新申请。",
        "auth-email-not-confirmed": "请先确认邮箱后再登录。",
        "auth-already-registered": "该邮箱已注册账户。",
        "auth-resend": "重新发送确认邮件",
        "auth-resend-sent": "我们已再次发送确认邮件。",
        "auth-username": "用户名",
        "auth-username-invalid": "用户名需为 3–20 个字符：字母、数字、点、连字符或下划线。",
        "auth-avatar": "头像",
        "auth-avatar-optional": "可选",
        "auth-avatar-invalid": "请选择不超过 8 MB 的图片。",
        "profile-title": "个人资料",
        "profile-save": "保存",
        "profile-saved": "个人资料已保存。",
        "profile-remove-photo": "移除照片",
        "profile-settings": "设置",
        "profile-section-profile": "个人资料",
        "profile-section-email": "邮箱",
        "profile-section-password": "密码",
        "profile-email-hint": "我们会向新邮箱发送确认链接。",
        "profile-email-sent": "请查收新邮箱并打开链接以完成更改。",
        "profile-email-saved": "邮箱已更新。",
        "profile-email-same": "这已经是你的邮箱。",
        "profile-email-invalid": "请输入有效的邮箱。",
        "profile-save-email": "保存邮箱",
        "profile-password-new": "新密码",
        "profile-password-confirm": "确认密码",
        "profile-password-mismatch": "两次密码不一致。",
        "profile-password-short": "密码至少需要 6 个字符。",
        "profile-password-saved": "密码已更新。",
        "profile-save-password": "保存密码",
        "profile-password-nonce": "确认码",
        "profile-password-reauth": "我们已发送确认码到邮箱。请输入后再保存。",
        "nav-favorites": "收藏",
        "fav-save": "收藏",
        "fav-saved": "已收藏",
        "fav-login-required": "请登录后收藏。",
        "fav-empty": "你还没有收藏任何地点。",
        "fav-filter-empty": "没有符合此筛选的收藏。",
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
            <button type="button" id="profile-nav-btn" class="profile-nav-btn" hidden>
                <span id="profile-nav-avatar" class="profile-nav-avatar" aria-hidden="true">
                    <img alt="" hidden>
                    <span class="profile-avatar-letter"></span>
                </span>
                <span id="profile-nav-name" class="profile-nav-name"></span>
            </button>
            <button type="button" id="auth-nav-btn" class="auth-nav-btn" data-i18n="nav-login">${t('nav-login')}</button>
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
                <div id="auth-avatar-field" class="auth-avatar-field" hidden>
                    <button type="button" id="auth-avatar-btn" class="profile-photo-btn profile-photo-btn-sm">
                        <img alt="" hidden>
                        <span class="profile-avatar-letter">?</span>
                        <span class="profile-photo-edit" aria-hidden="true"><i class="fa-solid fa-camera"></i></span>
                    </button>
                    <span class="auth-avatar-copy">
                        <span data-i18n="auth-avatar">${t('auth-avatar')}</span>
                        <small data-i18n="auth-avatar-optional">${t('auth-avatar-optional')}</small>
                    </span>
                    <input type="file" id="auth-avatar-input" accept="image/*" hidden>
                </div>
                <label for="auth-username" id="auth-username-label" hidden>
                    <span data-i18n="auth-username">${t('auth-username')}</span>
                    <input type="text" id="auth-username" name="username" minlength="3" maxlength="20" autocomplete="username" autocapitalize="off" spellcheck="false">
                </label>
                <label for="auth-email" id="auth-email-label">
                    <span data-i18n="auth-email">${t('auth-email')}</span>
                    <input type="email" id="auth-email" name="email" required autocomplete="email">
                </label>
                <label for="auth-password" id="auth-password-label">
                    <span id="auth-password-label-text" data-i18n="auth-password">${t('auth-password')}</span>
                    <div class="password-field">
                        <input type="password" id="auth-password" name="password" required minlength="6" autocomplete="current-password">
                        <button type="button" id="auth-password-toggle" class="password-toggle" aria-label="Show password" title="Show password">
                            <i class="fa-regular fa-eye" aria-hidden="true"></i>
                        </button>
                    </div>
                </label>
                <button type="button" id="auth-forgot-btn" class="auth-forgot-btn" data-i18n="auth-forgot">${t('auth-forgot')}</button>
                <button type="submit" id="auth-submit-btn" class="btn auth-submit-btn" data-i18n="auth-submit-login">${t('auth-submit-login')}</button>
            </form>
            <p id="auth-message" class="auth-message" hidden></p>
            <button type="button" id="auth-resend-btn" class="auth-switch-btn" data-i18n="auth-resend" hidden>${t('auth-resend')}</button>
            <button type="button" id="auth-switch-btn" class="auth-switch-btn" data-i18n="auth-switch-to-signup">${t('auth-switch-to-signup')}</button>
        </div>
    `;
    document.body.appendChild(modal);

    const profileModal = document.createElement('div');
    profileModal.id = 'profileModal';
    profileModal.className = 'modal-overlay';
    profileModal.innerHTML = `
        <div class="modal-content auth-modal-content profile-settings">
            <span class="close-btn" id="profile-close-btn">&times;</span>
            <h2 data-i18n="profile-settings">${t('profile-settings')}</h2>
            <form id="profile-form" class="auth-form profile-section">
                <h3 data-i18n="profile-section-profile">${t('profile-section-profile')}</h3>
                <div class="profile-photo-row">
                    <button type="button" id="profile-photo-btn" class="profile-photo-btn" aria-label="${t('auth-avatar')}">
                        <img alt="" hidden>
                        <span class="profile-avatar-letter">?</span>
                        <span class="profile-photo-edit" aria-hidden="true"><i class="fa-solid fa-camera"></i></span>
                    </button>
                    <input type="file" id="profile-photo-input" accept="image/*" hidden>
                    <button type="button" id="profile-photo-remove" class="profile-remove-btn" data-i18n="profile-remove-photo" hidden>${t('profile-remove-photo')}</button>
                </div>
                <label for="profile-username">
                    <span data-i18n="auth-username">${t('auth-username')}</span>
                    <input type="text" id="profile-username" name="username" required minlength="3" maxlength="20" autocomplete="username" autocapitalize="off" spellcheck="false">
                </label>
                <p id="profile-message" class="auth-message" hidden></p>
                <button type="submit" id="profile-submit-btn" class="btn auth-submit-btn" data-i18n="profile-save">${t('profile-save')}</button>
            </form>
            <form id="profile-email-form" class="auth-form profile-section">
                <h3 data-i18n="profile-section-email">${t('profile-section-email')}</h3>
                <label for="profile-email-input">
                    <span data-i18n="auth-email">${t('auth-email')}</span>
                    <input type="email" id="profile-email-input" name="email" required autocomplete="email">
                </label>
                <p class="profile-hint" data-i18n="profile-email-hint">${t('profile-email-hint')}</p>
                <p id="profile-email-message" class="auth-message" hidden></p>
                <button type="submit" id="profile-email-submit" class="btn auth-submit-btn" data-i18n="profile-save-email">${t('profile-save-email')}</button>
            </form>
            <form id="profile-password-form" class="auth-form profile-section">
                <h3 data-i18n="profile-section-password">${t('profile-section-password')}</h3>
                <label for="profile-new-password">
                    <span data-i18n="profile-password-new">${t('profile-password-new')}</span>
                    <div class="password-field">
                        <input type="password" id="profile-new-password" name="new-password" required minlength="6" autocomplete="new-password">
                        <button type="button" id="profile-new-password-toggle" class="password-toggle" aria-label="Show password" title="Show password">
                            <i class="fa-regular fa-eye" aria-hidden="true"></i>
                        </button>
                    </div>
                </label>
                <label for="profile-confirm-password">
                    <span data-i18n="profile-password-confirm">${t('profile-password-confirm')}</span>
                    <div class="password-field">
                        <input type="password" id="profile-confirm-password" name="confirm-password" required minlength="6" autocomplete="new-password">
                        <button type="button" id="profile-confirm-password-toggle" class="password-toggle" aria-label="Show password" title="Show password">
                            <i class="fa-regular fa-eye" aria-hidden="true"></i>
                        </button>
                    </div>
                </label>
                <label for="profile-password-nonce" id="profile-nonce-label" hidden>
                    <span data-i18n="profile-password-nonce">${t('profile-password-nonce')}</span>
                    <input type="text" id="profile-password-nonce" name="nonce" inputmode="numeric" autocomplete="one-time-code">
                </label>
                <p id="profile-password-message" class="auth-message" hidden></p>
                <button type="submit" id="profile-password-submit" class="btn auth-submit-btn" data-i18n="profile-save-password">${t('profile-save-password')}</button>
            </form>
        </div>
    `;
    document.body.appendChild(profileModal);

    document.getElementById('auth-nav-btn').addEventListener('click', handleAuthNavClick);
    document.getElementById('profile-nav-btn').addEventListener('click', openProfileModal);
    document.getElementById('auth-close-btn').addEventListener('click', closeAuthModal);
    document.getElementById('auth-switch-btn').addEventListener('click', toggleAuthMode);
    document.getElementById('auth-forgot-btn').addEventListener('click', showForgotPassword);
    document.getElementById('auth-resend-btn').addEventListener('click', handleResendConfirmation);
    document.getElementById('auth-form').addEventListener('submit', handleAuthSubmit);
    document.getElementById('auth-password-toggle').addEventListener('click', togglePasswordVisibility);
    document.getElementById('auth-avatar-btn').addEventListener('click', () => {
        document.getElementById('auth-avatar-input').click();
    });
    document.getElementById('auth-avatar-input').addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        try {
            signupAvatar = await readAvatarFile(file);
            paintAvatarPreview(document.getElementById('auth-avatar-btn'), signupAvatar.dataUrl, '');
        } catch (err) {
            signupAvatar = null;
            showAuthMessage(t('auth-avatar-invalid'), 'error');
        }
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAuthModal();
    });

    document.getElementById('profile-close-btn').addEventListener('click', closeProfileModal);
    document.getElementById('profile-form').addEventListener('submit', handleProfileSubmit);
    document.getElementById('profile-email-form').addEventListener('submit', handleEmailSettings);
    document.getElementById('profile-password-form').addEventListener('submit', handlePasswordSettings);
    document.getElementById('profile-new-password-toggle').addEventListener('click', () => {
        togglePasswordField(
            document.getElementById('profile-new-password'),
            document.getElementById('profile-new-password-toggle')
        );
    });
    document.getElementById('profile-confirm-password-toggle').addEventListener('click', () => {
        togglePasswordField(
            document.getElementById('profile-confirm-password'),
            document.getElementById('profile-confirm-password-toggle')
        );
    });
    document.getElementById('profile-photo-btn').addEventListener('click', () => {
        document.getElementById('profile-photo-input').click();
    });
    document.getElementById('profile-photo-input').addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        try {
            profileAvatar = await readAvatarFile(file);
            profileAvatarRemoved = false;
            paintAvatarPreview(document.getElementById('profile-photo-btn'), profileAvatar.dataUrl, '');
            const removeBtn = document.getElementById('profile-photo-remove');
            if (removeBtn) removeBtn.hidden = false;
        } catch (err) {
            showProfileMessage(t('auth-avatar-invalid'), 'error');
        }
    });
    document.getElementById('profile-photo-remove').addEventListener('click', () => {
        profileAvatar = null;
        profileAvatarRemoved = true;
        const input = document.getElementById('profile-photo-input');
        if (input) input.value = '';
        const profile = userProfile(currentUser);
        paintAvatarPreview(document.getElementById('profile-photo-btn'), '', profileInitial(profile));
        const removeBtn = document.getElementById('profile-photo-remove');
        if (removeBtn) removeBtn.hidden = true;
    });
    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) closeProfileModal();
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
    signupAvatar = null;
    const avatarInput = document.getElementById('auth-avatar-input');
    if (avatarInput) avatarInput.value = '';
    paintAvatarPreview(document.getElementById('auth-avatar-btn'), '', '?');
    const toggleBtn = document.getElementById('auth-password-toggle');
    if (toggleBtn) {
        toggleBtn.setAttribute('aria-label', 'Show password');
        toggleBtn.title = 'Show password';
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fa-regular fa-eye';
    }
    clearAuthMessage();
}

function authLang() {
    return staticTranslations[currentLang] ? currentLang : 'en';
}

function authRedirectUrl() {
    return `https://www.cyprusbest.com/?l=${authLang()}`;
}

function applyLangFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('l') || params.get('lang');
    if (lang && staticTranslations[lang] && lang !== currentLang) setLanguage(lang);
}

function setAuthText(el, key) {
    if (!el) return;
    el.setAttribute('data-i18n', key);
    el.innerText = t(key);
}

function setResendVisible(visible) {
    const btn = document.getElementById('auth-resend-btn');
    if (btn) btn.hidden = !visible;
}

function setAuthMode(mode) {
    const modal = document.getElementById('authModal');
    if (modal) modal.dataset.mode = mode;

    const isSignup = mode === 'signup';
    const isForgot = mode === 'forgot';
    const isRecovery = mode === 'recovery';
    const title = document.getElementById('auth-modal-title');
    const submit = document.getElementById('auth-submit-btn');
    const switchBtn = document.getElementById('auth-switch-btn');
    const password = document.getElementById('auth-password');
    const passwordLabel = document.getElementById('auth-password-label');
    const passwordLabelText = document.getElementById('auth-password-label-text');
    const emailLabel = document.getElementById('auth-email-label');
    const email = document.getElementById('auth-email');
    const forgotBtn = document.getElementById('auth-forgot-btn');
    const usernameLabel = document.getElementById('auth-username-label');
    const usernameInput = document.getElementById('auth-username');
    const avatarField = document.getElementById('auth-avatar-field');

    const titleKey = isRecovery ? 'auth-title-recovery'
        : isForgot ? 'auth-title-forgot'
        : isSignup ? 'auth-title-signup'
        : 'auth-title-login';
    const submitKey = isRecovery ? 'auth-submit-recovery'
        : isForgot ? 'auth-submit-forgot'
        : isSignup ? 'auth-submit-signup'
        : 'auth-submit-login';
    const switchKey = (isForgot || isRecovery) ? 'auth-back-to-login'
        : isSignup ? 'auth-switch-to-login'
        : 'auth-switch-to-signup';

    setAuthText(title, titleKey);
    setAuthText(submit, submitKey);
    setAuthText(switchBtn, switchKey);
    setAuthText(passwordLabelText, isRecovery ? 'auth-new-password' : 'auth-password');

    if (emailLabel) emailLabel.hidden = isRecovery;
    if (usernameLabel) usernameLabel.hidden = !isSignup;
    if (avatarField) avatarField.hidden = !isSignup;
    if (passwordLabel) passwordLabel.hidden = isForgot;
    if (forgotBtn) forgotBtn.hidden = mode !== 'login';
    if (usernameInput) {
        usernameInput.required = isSignup;
        usernameInput.disabled = !isSignup;
    }
    if (email) {
        email.required = !isRecovery;
        email.disabled = isRecovery;
    }
    if (password) {
        password.required = !isForgot;
        password.disabled = isForgot;
        password.autocomplete = (isSignup || isRecovery) ? 'new-password' : 'current-password';
    }
    setResendVisible(false);
}

function toggleAuthMode() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    const next = modal.dataset.mode === 'login' ? 'signup' : 'login';
    setAuthMode(next);
    clearAuthMessage();
}

function showForgotPassword() {
    setAuthMode('forgot');
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

function togglePasswordField(input, btn) {
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

function togglePasswordVisibility() {
    togglePasswordField(
        document.getElementById('auth-password'),
        document.getElementById('auth-password-toggle')
    );
}

async function handleAuthNavClick() {
    if (currentUser) {
        await handleLogout();
        return;
    }
    openAuthModal('login');
}

function isEmailNotConfirmed(err) {
    const code = err?.code || '';
    const msg = (err?.message || '').toLowerCase();
    return code === 'email_not_confirmed' || msg.includes('email not confirmed');
}

function isAlreadyRegistered(err) {
    const code = err?.code || '';
    const msg = (err?.message || '').toLowerCase();
    return code === 'user_already_exists' || msg.includes('already registered') || msg.includes('already been registered');
}

function authErrorMessage(err) {
    if (isEmailNotConfirmed(err)) return t('auth-email-not-confirmed');
    if (isAlreadyRegistered(err)) return t('auth-already-registered');
    return err?.message || t('auth-error');
}

function normalizeUsername(value) {
    return String(value || '').trim().replace(/\s+/g, '');
}

function isValidUsername(value) {
    return /^[\p{L}\p{N}._-]{3,20}$/u.test(value);
}

function avatarStorageKey(userId) {
    return `cyprusbest-avatar:${userId}`;
}

function readLocalAvatar(userId) {
    try {
        return localStorage.getItem(avatarStorageKey(userId)) || '';
    } catch (err) {
        return '';
    }
}

function writeLocalAvatar(userId, dataUrl) {
    try {
        if (dataUrl) localStorage.setItem(avatarStorageKey(userId), dataUrl);
        else localStorage.removeItem(avatarStorageKey(userId));
    } catch (err) {
        console.warn('Could not store profile photo locally:', err);
    }
}

function userProfile(user) {
    const meta = user?.user_metadata || {};
    const username = normalizeUsername(meta.username || '');
    const remoteAvatar = String(meta.avatar_url || '').trim();
    const localAvatar = user ? readLocalAvatar(user.id) : '';
    const emailName = (user?.email || '').split('@')[0];
    return {
        username,
        avatarUrl: remoteAvatar || localAvatar,
        displayName: username || emailName || ''
    };
}

function profileInitial(profile) {
    const source = profile?.username || profile?.displayName || '?';
    return source.charAt(0).toUpperCase() || '?';
}

function suggestedUsername(user) {
    const existing = normalizeUsername(user?.user_metadata?.username || '');
    if (isValidUsername(existing)) return existing;
    const local = (user?.email || '').split('@')[0].replace(/[^\p{L}\p{N}._-]/gu, '').slice(0, 20);
    return isValidUsername(local) ? local : '';
}

function paintAvatarPreview(button, url, letter) {
    if (!button) return;
    const img = button.querySelector('img');
    const fallback = button.querySelector('.profile-avatar-letter');
    if (url && img) {
        img.src = url;
        img.hidden = false;
        if (fallback) fallback.hidden = true;
        return;
    }
    if (img) {
        img.removeAttribute('src');
        img.hidden = true;
    }
    if (fallback) {
        fallback.hidden = false;
        fallback.textContent = letter || '?';
    }
}

function loadImageElement(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('image'));
        };
        img.src = url;
    });
}

async function compressImageFile(file) {
    const img = await loadImageElement(file);
    const size = 160;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const scale = Math.max(size / img.width, size / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.72));
    const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
    if (!blob || !dataUrl) throw new Error('image');
    return { blob, dataUrl };
}

async function readAvatarFile(file) {
    if (!file || !file.type || !file.type.startsWith('image/')) throw new Error('type');
    if (file.size > 8 * 1024 * 1024) throw new Error('size');
    return compressImageFile(file);
}

async function saveAvatar(user, blob, dataUrl) {
    let publicUrl = '';
    try {
        const path = `${user.id}/avatar.jpg`;
        const { error } = await dbClient.storage.from('avatars').upload(path, blob, {
            upsert: true,
            contentType: 'image/jpeg',
            cacheControl: '3600'
        });
        if (!error) {
            const { data } = dbClient.storage.from('avatars').getPublicUrl(path);
            if (data?.publicUrl) publicUrl = `${data.publicUrl}?t=${Date.now()}`;
        }
    } catch (err) {
        console.warn('Avatar upload failed:', err);
    }

    if (publicUrl) {
        writeLocalAvatar(user.id, '');
        return publicUrl;
    }

    writeLocalAvatar(user.id, dataUrl);
    return '';
}

async function removeStoredAvatar(user) {
    writeLocalAvatar(user.id, '');
    try {
        await dbClient.storage.from('avatars').remove([`${user.id}/avatar.jpg`]);
    } catch (err) {
        console.warn('Avatar remove failed:', err);
    }
}

async function attachSignupAvatar(user) {
    if (!user || !signupAvatar) return user;
    const remote = await saveAvatar(user, signupAvatar.blob, signupAvatar.dataUrl);
    if (!remote) return user;
    const { data, error } = await dbClient.auth.updateUser({ data: { avatar_url: remote } });
    if (!error && data?.user) return data.user;
    return user;
}

async function applyPendingAvatar(user) {
    if (!user) return user;
    let dataUrl = '';
    try {
        dataUrl = localStorage.getItem('cyprusbest-pending-avatar') || '';
        if (dataUrl) localStorage.removeItem('cyprusbest-pending-avatar');
    } catch (err) {
        return user;
    }
    if (!dataUrl) return user;

    writeLocalAvatar(user.id, dataUrl);
    try {
        const blob = await (await fetch(dataUrl)).blob();
        const remote = await saveAvatar(user, blob, dataUrl);
        if (remote) {
            const { data, error } = await dbClient.auth.updateUser({ data: { avatar_url: remote } });
            if (!error && data?.user) return data.user;
        }
    } catch (err) {
        console.warn('Pending avatar failed:', err);
    }
    return user;
}

function showProfileMessage(text, type = 'error', which = 'profile') {
    const id = which === 'email' ? 'profile-email-message'
        : which === 'password' ? 'profile-password-message'
        : 'profile-message';
    const el = document.getElementById(id);
    if (!el) return;
    el.hidden = false;
    el.className = `auth-message auth-message-${type}`;
    el.innerText = text;
}

function clearProfileMessage(which) {
    const names = which ? [which] : ['profile', 'email', 'password'];
    names.forEach((name) => {
        const id = name === 'email' ? 'profile-email-message'
            : name === 'password' ? 'profile-password-message'
            : 'profile-message';
        const el = document.getElementById(id);
        if (!el) return;
        el.hidden = true;
        el.innerText = '';
    });
}

function resetProfilePasswordFields() {
    ['profile-new-password', 'profile-confirm-password'].forEach((id, index) => {
        const input = document.getElementById(id);
        const btn = document.getElementById(index === 0 ? 'profile-new-password-toggle' : 'profile-confirm-password-toggle');
        if (input) input.type = 'password';
        if (btn) {
            btn.setAttribute('aria-label', 'Show password');
            btn.title = 'Show password';
            const icon = btn.querySelector('i');
            if (icon) icon.className = 'fa-regular fa-eye';
        }
    });
    const nonceLabel = document.getElementById('profile-nonce-label');
    const nonceInput = document.getElementById('profile-password-nonce');
    if (nonceLabel) nonceLabel.hidden = true;
    if (nonceInput) {
        nonceInput.required = false;
        nonceInput.value = '';
    }
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function needsReauthentication(err) {
    const code = err?.code || '';
    const msg = (err?.message || '').toLowerCase();
    return code === 'reauthentication_needed' || msg.includes('reauthentication');
}

function openProfileModal() {
    if (!currentUser) return;
    closeMobileMenu();
    const modal = document.getElementById('profileModal');
    if (!modal) return;
    const profile = userProfile(currentUser);
    const usernameInput = document.getElementById('profile-username');
    const emailInput = document.getElementById('profile-email-input');
    const passwordForm = document.getElementById('profile-password-form');
    profileAvatar = null;
    profileAvatarRemoved = false;
    if (usernameInput) usernameInput.value = profile.username || suggestedUsername(currentUser);
    if (emailInput) emailInput.value = currentUser.email || '';
    if (passwordForm) passwordForm.reset();
    resetProfilePasswordFields();
    paintAvatarPreview(document.getElementById('profile-photo-btn'), profile.avatarUrl, profileInitial(profile));
    const removeBtn = document.getElementById('profile-photo-remove');
    if (removeBtn) removeBtn.hidden = !profile.avatarUrl;
    const fileInput = document.getElementById('profile-photo-input');
    if (fileInput) fileInput.value = '';
    clearProfileMessage();
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    profileAvatar = null;
    profileAvatarRemoved = false;
    resetProfilePasswordFields();
    clearProfileMessage();
}

async function handleProfileSubmit(e) {
    e.preventDefault();
    if (!dbClient || !currentUser) return;

    const username = normalizeUsername(document.getElementById('profile-username').value);
    if (!isValidUsername(username)) {
        showProfileMessage(t('auth-username-invalid'), 'error');
        return;
    }

    const submitBtn = document.getElementById('profile-submit-btn');
    if (submitBtn) submitBtn.disabled = true;
    clearProfileMessage('profile');

    try {
        let avatarUrl = String(currentUser.user_metadata?.avatar_url || '').trim();
        if (profileAvatarRemoved) {
            await removeStoredAvatar(currentUser);
            avatarUrl = '';
        } else if (profileAvatar) {
            avatarUrl = await saveAvatar(currentUser, profileAvatar.blob, profileAvatar.dataUrl);
        }

        const { data, error } = await dbClient.auth.updateUser({
            data: { username, avatar_url: avatarUrl }
        });
        if (error) throw error;
        currentUser = data.user;
        updateAuthUI();
        showProfileMessage(t('profile-saved'), 'success');
    } catch (err) {
        showProfileMessage(authErrorMessage(err), 'error');
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}

async function handleEmailSettings(e) {
    e.preventDefault();
    if (!dbClient || !currentUser) return;

    const email = document.getElementById('profile-email-input').value.trim();
    if (!isValidEmail(email)) {
        showProfileMessage(t('profile-email-invalid'), 'error', 'email');
        return;
    }
    if (email.toLowerCase() === String(currentUser.email || '').toLowerCase()) {
        showProfileMessage(t('profile-email-same'), 'error', 'email');
        return;
    }

    const submitBtn = document.getElementById('profile-email-submit');
    if (submitBtn) submitBtn.disabled = true;
    clearProfileMessage('email');

    try {
        const { data, error } = await dbClient.auth.updateUser(
            { email },
            { emailRedirectTo: authRedirectUrl() }
        );
        if (error) throw error;
        if (data?.user) currentUser = data.user;
        updateAuthUI();
        const pending = data?.user?.new_email;
        showProfileMessage(t(pending ? 'profile-email-sent' : 'profile-email-saved'), 'success', 'email');
    } catch (err) {
        showProfileMessage(authErrorMessage(err), 'error', 'email');
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}

async function handlePasswordSettings(e) {
    e.preventDefault();
    if (!dbClient || !currentUser) return;

    const password = document.getElementById('profile-new-password').value;
    const confirm = document.getElementById('profile-confirm-password').value;
    const nonce = document.getElementById('profile-password-nonce').value.trim();

    if (password.length < 6) {
        showProfileMessage(t('profile-password-short'), 'error', 'password');
        return;
    }
    if (password !== confirm) {
        showProfileMessage(t('profile-password-mismatch'), 'error', 'password');
        return;
    }

    const submitBtn = document.getElementById('profile-password-submit');
    if (submitBtn) submitBtn.disabled = true;
    clearProfileMessage('password');

    try {
        const attributes = { password };
        if (nonce) attributes.nonce = nonce;
        const { data, error } = await dbClient.auth.updateUser(attributes);
        if (error) {
            if (needsReauthentication(error)) {
                const { error: reauthError } = await dbClient.auth.reauthenticate();
                if (reauthError) throw reauthError;
                const nonceLabel = document.getElementById('profile-nonce-label');
                const nonceInput = document.getElementById('profile-password-nonce');
                if (nonceLabel) nonceLabel.hidden = false;
                if (nonceInput) {
                    nonceInput.required = true;
                    nonceInput.focus();
                }
                showProfileMessage(t('profile-password-reauth'), 'success', 'password');
                return;
            }
            throw error;
        }

        if (data?.user) currentUser = data.user;
        const passwordForm = document.getElementById('profile-password-form');
        if (passwordForm) passwordForm.reset();
        resetProfilePasswordFields();
        showProfileMessage(t('profile-password-saved'), 'success', 'password');
    } catch (err) {
        showProfileMessage(authErrorMessage(err), 'error', 'password');
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
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
    setResendVisible(false);

    try {
        if (mode === 'forgot') {
            const { error } = await dbClient.auth.resetPasswordForEmail(email, {
                redirectTo: authRedirectUrl()
            });
            if (error) throw error;
            showAuthMessage(t('auth-reset-sent'), 'success');
        } else if (mode === 'recovery') {
            const { error } = await dbClient.auth.updateUser({ password });
            if (error) throw error;
            showAuthMessage(t('auth-password-updated'), 'success');
            updateAuthUI();
        } else if (mode === 'signup') {
            const username = normalizeUsername(document.getElementById('auth-username').value);
            if (!isValidUsername(username)) {
                showAuthMessage(t('auth-username-invalid'), 'error');
                return;
            }

            const { data, error } = await dbClient.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: authRedirectUrl(),
                    data: { lang: authLang(), username }
                }
            });
            if (error) throw error;

            const alreadyExists = data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0;
            if (alreadyExists) {
                showAuthMessage(t('auth-already-registered'), 'error');
                return;
            }

            const confirmed = Boolean(data.user?.email_confirmed_at);
            if (data.session && confirmed) {
                currentUser = await attachSignupAvatar(data.user);
                updateAuthUI();
                closeAuthModal();
                return;
            }

            if (signupAvatar?.dataUrl) {
                try {
                    localStorage.setItem('cyprusbest-pending-avatar', signupAvatar.dataUrl);
                } catch (err) {
                    console.warn('Could not keep profile photo for after confirmation:', err);
                }
            }

            if (data.session) {
                await dbClient.auth.signOut();
                currentUser = null;
                updateAuthUI();
            }
            const passwordInput = document.getElementById('auth-password');
            if (passwordInput) passwordInput.value = '';
            showAuthMessage(t('auth-check-email'), 'success');
            setResendVisible(true);
        } else {
            const { data, error } = await dbClient.auth.signInWithPassword({ email, password });
            if (error) throw error;
            currentUser = await applyPendingAvatar(data.user);
            updateAuthUI();
            closeAuthModal();
        }
    } catch (err) {
        showAuthMessage(authErrorMessage(err), 'error');
        if (isEmailNotConfirmed(err)) setResendVisible(true);
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}

async function handleResendConfirmation() {
    if (!dbClient) return;
    const email = document.getElementById('auth-email').value.trim();
    const btn = document.getElementById('auth-resend-btn');
    if (!email) return;

    if (btn) btn.disabled = true;
    clearAuthMessage();
    try {
        const { error } = await dbClient.auth.resend({
            type: 'signup',
            email,
            options: { emailRedirectTo: authRedirectUrl() }
        });
        if (error) throw error;
        showAuthMessage(t('auth-resend-sent'), 'success');
    } catch (err) {
        showAuthMessage(authErrorMessage(err), 'error');
    } finally {
        if (btn) btn.disabled = false;
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
    const profileBtn = document.getElementById('profile-nav-btn');
    const nameEl = document.getElementById('profile-nav-name');
    const avatarEl = document.getElementById('profile-nav-avatar');
    if (!btn) return;

    if (currentUser) {
        const profile = userProfile(currentUser);
        btn.setAttribute('data-i18n', 'nav-logout');
        btn.innerText = t('nav-logout');
        btn.classList.add('is-logged-in');
        if (profileBtn) {
            profileBtn.hidden = false;
            profileBtn.setAttribute('aria-label', t('profile-settings'));
        }
        if (nameEl) nameEl.textContent = profile.displayName;
        paintAvatarPreview(avatarEl, profile.avatarUrl, profileInitial(profile));
    } else {
        btn.setAttribute('data-i18n', 'nav-login');
        btn.innerText = t('nav-login');
        btn.classList.remove('is-logged-in');
        if (profileBtn) profileBtn.hidden = true;
        if (nameEl) nameEl.textContent = '';
        paintAvatarPreview(avatarEl, '', '');
    }
}

async function consumeEmailLink() {
    const params = new URLSearchParams(window.location.search);
    const tokenHash = params.get('token_hash');
    const otpType = params.get('type');
    const allowed = ['recovery', 'signup', 'email', 'invite', 'magiclink'];
    if (!tokenHash || !allowed.includes(otpType)) return null;

    const { data, error } = await dbClient.auth.verifyOtp({
        token_hash: tokenHash,
        type: otpType
    });
    window.history.replaceState({}, document.title, window.location.pathname);
    return { data, error, otpType };
}

async function initAuth() {
    if (!dbClient) return;
    injectAuthUI();
    applyLangFromUrl();

    const authCallbackType = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('type');
    const emailLink = await consumeEmailLink();

    const { data: { session } } = await dbClient.auth.getSession();
    currentUser = session?.user ?? null;
    if (currentUser) currentUser = await applyPendingAvatar(currentUser);
    updateAuthUI();
    await loadFavoriteIds();

    if (emailLink) {
        const recovery = emailLink.otpType === 'recovery';
        if (emailLink.error || (recovery && !session?.user)) {
            openAuthModal(recovery ? 'forgot' : 'login');
            showAuthMessage(t(recovery ? 'auth-reset-link-invalid' : 'auth-error'), 'error');
        } else if (recovery) {
            openAuthModal('recovery');
        }
    } else if (authCallbackType === 'recovery') {
        if (session?.user) {
            openAuthModal('recovery');
        } else {
            openAuthModal('forgot');
            showAuthMessage(t('auth-reset-link-invalid'), 'error');
        }
    }

    // Clean auth tokens from the URL after email confirmation / password recovery
    if (window.location.hash && /access_token|refresh_token|type=/.test(window.location.hash)) {
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    }

    dbClient.auth.onAuthStateChange(async (_event, session) => {
        currentUser = session?.user ?? null;
        updateAuthUI();
        await loadFavoriteIds();
        refreshFavoriteButtons();
        refreshMapFavoriteMarkers();
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

function truncateText(value, maxLength = 110) {
    const text = String(value ?? '').replace(/\s+/g, ' ').trim();
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + '…';
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
        refreshMapFavoriteMarkers();
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
    let finalUrl = resolvePlaceImage(place.image_url);

    const subCat = place.subcategory ? String(place.subcategory) : "";
    const category = place.category ? String(place.category) : "";
    const town = normalizeTown(place);
    const subCatClass = subCat ? escapeHtml(subCat) : "";
    const townClass = town ? `town-${escapeHtml(town)}` : "";
    const showClass = show ? "show" : "";
    const safeTitle = escapeHtml(title);
    const safeDesc = escapeHtml(truncateText(description, 110));
    const safeImg = escapeHtml(finalUrl || place.image_url || "");

    return `
        <div class="item-card ${subCatClass} ${townClass} ${showClass}" data-category="${escapeHtml(category)}" data-subcategory="${escapeHtml(subCat)}" data-town="${escapeHtml(town)}">
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

function setFavoritesSideMapVisible(visible) {
    const layout = document.querySelector('.category-layout.favorites-layout');
    const fab = document.querySelector('.show-map-fab');
    if (layout) layout.classList.toggle('is-hidden', !visible);
    if (fab) fab.classList.toggle('is-hidden', !visible);
    if (!visible) document.body.classList.remove('map-open');
}

function ensureFavoritesMapLayout(listContainer) {
    if (!listContainer) return;

    let layout = document.querySelector('.category-layout.favorites-layout');
    if (layout) return;

    layout = document.createElement('div');
    layout.className = 'category-layout favorites-layout';

    const main = document.createElement('div');
    main.className = 'category-main';

    listContainer.parentNode.insertBefore(layout, listContainer);
    main.appendChild(listContainer);
    layout.appendChild(main);

    const panel = document.createElement('aside');
    panel.className = 'category-map-panel';
    panel.innerHTML = `
        <div class="category-map-toolbar">
            <strong data-i18n="fav-map-title">${t('fav-map-title')}</strong>
            <button type="button" class="map-panel-close" aria-label="${t('map-hide')}" data-i18n="map-hide">${t('map-hide')}</button>
        </div>
        <div class="map-legend map-legend--panel">
            <span class="map-legend-item">
                <i class="map-legend-dot map-legend-dot--fav"></i>
                <span data-i18n="map-legend-favorites">${t('map-legend-favorites')}</span>
            </span>
        </div>
        <div id="favorites-map" class="places-map" role="region" aria-label="${t('fav-map-title')}"></div>
        <p class="map-empty-msg" id="favorites-map-empty" hidden data-i18n="map-empty">${t('map-empty')}</p>
    `;
    layout.appendChild(panel);

    if (!document.querySelector('.show-map-fab')) {
        const fab = document.createElement('button');
        fab.type = 'button';
        fab.className = 'show-map-fab';
        fab.setAttribute('data-i18n', 'map-show');
        fab.innerText = t('map-show');
        fab.addEventListener('click', () => {
            document.body.classList.add('map-open');
            setTimeout(() => {
                (favoritesMap || categoryMap)?.invalidateSize();
            }, 50);
        });
        document.body.appendChild(fab);
    }

    panel.querySelector('.map-panel-close')?.addEventListener('click', () => {
        document.body.classList.remove('map-open');
    });
}

async function renderFavoritesMap(places) {
    const listContainer = document.getElementById('favorites-container');
    if (!listContainer) return;

    favoritesPlacesCache = places || [];
    const mappable = favoritesPlacesCache.filter(hasCoords);

    if (!mappable.length) {
        setFavoritesSideMapVisible(false);
        return;
    }

    ensureFavoritesMapLayout(listContainer);
    setFavoritesSideMapVisible(true);

    const mapEl = document.getElementById('favorites-map');
    const emptyEl = document.getElementById('favorites-map-empty');
    if (!mapEl) return;

    const titleEl = document.querySelector('.favorites-layout [data-i18n="fav-map-title"]');
    if (titleEl) titleEl.innerText = t('fav-map-title');

    try {
        await loadLeaflet();
    } catch (err) {
        console.error('Leaflet failed to load:', err);
        return;
    }

    if (!favoritesMap) {
        favoritesMap = L.map(mapEl, { scrollWheelZoom: true }).setView(CYPRUS_CENTER, 8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; OpenStreetMap'
        }).addTo(favoritesMap);
        favoritesMarkerLayer = L.layerGroup().addTo(favoritesMap);
        setTimeout(() => favoritesMap.invalidateSize(), 100);
    }

    updateFavoritesMapMarkers();
    if (emptyEl) emptyEl.hidden = favoritesPlacesCache.some(place => hasCoords(place) && placeMatchesActiveFilters(place));
}

async function loadFavoritesPage() {
    const container = document.getElementById('favorites-container');
    if (!container || !dbClient) return;
    renderFavoriteTypeFilters();

    if (!currentUser) {
        setFavoritesSideMapVisible(false);
        container.innerHTML = `
            <div class="favorites-empty">
                <p data-i18n="fav-login-required">${t('fav-login-required')}</p>
                <button type="button" class="btn" onclick="openAuthModal('login')" data-i18n="nav-login">${t('nav-login')}</button>
            </div>
        `;
        updateFavoritesFilterEmpty();
        return;
    }

    await ensureExtraPlaces();

    const { data, error } = await dbClient
        .from('user_favorites')
        .select('place_id, created_at, places(*)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading favorites page:', error);
        setFavoritesSideMapVisible(false);
        container.innerHTML = `<p class="favorites-empty">${t('auth-error')}</p>`;
        updateFavoritesFilterEmpty();
        return;
    }

    const places = (data || [])
        .map(row => applyExtraGeo(row.places))
        .filter(place => place && !isRemovedPlace(place));
    favoritePlaceIds = new Set((data || []).map(row => row.place_id));

    if (places.length === 0) {
        setFavoritesSideMapVisible(false);
        favoritesPlacesCache = [];
        container.innerHTML = `<p class="favorites-empty" data-i18n="fav-empty">${t('fav-empty')}</p>`;
        updateFavoritesFilterEmpty();
        return;
    }

    container.innerHTML = places.map(place => renderPlaceCard(place, { show: true })).join('');
    applyFilters();
    renderFavoritesMap(places);
}

/* --- 3. ΦΟΡΤΩΣΗ ΚΑΤΗΓΟΡΙΩΝ (ΟΛΕΣ ΟΙ ΕΙΚΟΝΕΣ & ΠΕΡΙΓΡΑΦΕΣ) --- */
const PINNED_PLACE_IDS = ['melania', 'yoga'];
const CYPRUS_CENTER = [34.9, 33.0];
const EXTRA_PLACES = [
    {
        id: 'coralbay',
        category: 'beaches',
        image_url: 'images/coralbay.jpg',
        phone: null,
        website: null,
        map_link: 'https://maps.google.com/?q=34.8540839,32.3693757',
        title_en: 'Coral Bay',
        desc_en: 'Located in Peyia near Paphos, Coral Bay is a stunning crescent-shaped cove renowned for its soft golden sand and calm, shallow turquoise waters. Sheltered by dramatic limestone headlands, it holds a prestigious Blue Flag certification and offers a complete array of sunbeds, beach bars, and water sports, making it the perfect destination for both families and sunseekers.',
        title_el: 'Κόλπος των Κοραλλίων (Coral Bay)',
        desc_el: 'Στην Πέγεια της Πάφου, ο Κόλπος των Κοραλλίων (Coral Bay) είναι ένας πανέμορφος ημικυκλικός όρμος, διάσημος για την απαλή χρυσή άμμο και τα ήρεμα, ρηχά τιρκουάζ νερά του. Προστατευμένη από επιβλητικά ασβεστολιθικά ακρωτήρια και βραβευμένη με Γαλάζια Σημαία, η παραλία προσφέρει οργανωμένες ξαπλώστρες, beach bars και θαλάσσια σπορ, αποτελώντας ιδανική επιλογή για οικογένειες και χαλάρωση.',
        title_ru: 'Коралловый залив (Coral Bay)',
        desc_ru: 'Коралловый залив (Coral Bay), расположенный в Пейе близ Пафоса, представляет собой великолепную полукруглую бухту с мелким золотистым песком и спокойными мелководными бирюзовыми водами. Защищенный живописными скалами и отмеченный Голубым флагом, пляж предлагает развитую инфраструктуру с шезлонгами, пляжными барами и водными видами спорта, что делает его отличным выбором как для семейного отдыха, так и для любителей солнца.',
        title_zh: '珊瑚湾 (Coral Bay)',
        desc_zh: '珊瑚湾 (Coral Bay) 位于帕福斯附近的佩亚 (Peyia)，是一处令人叹为观止的新月形海湾，以柔软细腻的金色沙滩和平静清澈的浅海绿松石色水域而闻名。海湾受壮丽的石灰岩海岬庇护，荣获“蓝旗”殊荣，配有完善的日光浴躺椅、海滩酒吧和丰富的水上运动，是家庭出游与海滨度假者的完美目的地。',
        subcategory: null,
        is_best_of_month: false,
        lat: 34.8540839,
        lng: 32.3693757,
        town: 'paphos'
    }
];

let extraPlacesCache = EXTRA_PLACES;

async function ensureExtraPlaces() {
    if (extraPlacesCache.length > EXTRA_PLACES.length) return extraPlacesCache;
    const extras = [];
        for (const file of ['extra-beaches.json', 'extra-views.json', 'extra-restaurants.json', 'extra-hotels.json', 'extra-realestate.json', 'extra-things.json']) {
        try {
            const res = await fetch(file + '?v=list30');
            if (res.ok) extras.push(...(await res.json()).filter(place => !isRemovedPlace(place)));
        } catch (err) {
            console.warn(file + ' not loaded', err);
        }
    }
    extraPlacesCache = [...EXTRA_PLACES, ...extras];
    return extraPlacesCache;
}

function normalizeTown(place) {
    let town = place && place.town ? String(place.town).trim().toLowerCase() : '';
    if (town === 'ayia_napa' || town === 'protaras' || town === 'paralimni' || town === 'ammochostos') {
        return 'famagusta';
    }
    if (town && town !== 'other') return town;

    const lat = Number(place && place.lat);
    const lng = Number(place && place.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return '';
    if (lng >= 33.75) return 'famagusta';
    if (lat >= 35.05 && lng >= 33.15 && lng < 33.55) return 'nicosia';
    if (lng < 32.72) return 'paphos';
    if (lng < 33.25) return 'limassol';
    return 'larnaca';
}

const PLACE_ID_ALIASES = {
    cyprusmuseum: 'museum-nic',
    liopetri: 'liopetri-river',
    dodekapente: 'nicosia-walk',
    omodos: 'wine',
    troodosjeep: 'sunshine'
};

const REMOVED_PLACE_IDS = new Set(['duomo', 'musecafe', 'karmadevelopers', 'giovanihomes', 'medousa', 'medusa']);

function isRemovedPlace(placeOrId) {
    const id = typeof placeOrId === 'string' ? placeOrId : (placeOrId && placeOrId.id);
    return REMOVED_PLACE_IDS.has(id);
}

function canonicalPlaceId(id) {
    return PLACE_ID_ALIASES[id] || id;
}

function listingTitleKey(place) {
    return String(place && (place.title_en || place.title_el) || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\b(the|and|a|an|tour|visit|walk|exploration|experience|archaeological|municipal)\b/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function isSameListing(a, b) {
    if (!a || !b) return false;
    if (canonicalPlaceId(a.id) === canonicalPlaceId(b.id)) return true;
    if (a.category && b.category && a.category !== b.category) return false;
    const ka = listingTitleKey(a);
    const kb = listingTitleKey(b);
    if (!ka || !kb) return false;
    return ka === kb || ka.includes(kb) || kb.includes(ka);
}

function overlayExtraFields(place, extra) {
    if (!place || !extra) return place;
    if (hasCoords(extra)) {
        place.lat = extra.lat;
        place.lng = extra.lng;
    }
    if (extra.map_link) place.map_link = extra.map_link;
    ['title_en', 'title_el', 'title_ru', 'title_zh', 'desc_en', 'desc_el', 'desc_ru', 'desc_zh', 'image_url', 'phone', 'website', 'subcategory', 'town'].forEach((key) => {
        if (extra[key]) place[key] = extra[key];
    });
    return place;
}

function applyExtraGeo(place) {
    if (!place) return place;
    const extra = extraPlacesCache.find(item => canonicalPlaceId(item.id) === canonicalPlaceId(place.id) && (!place.category || item.category === place.category))
        || extraPlacesCache.find(item => canonicalPlaceId(item.id) === canonicalPlaceId(place.id))
        || extraPlacesCache.find(item => isSameListing(item, place) && (!place.category || item.category === place.category));
    overlayExtraFields(place, extra);
    place.town = normalizeTown(place);
    return place;
}

function mergeExtraPlaces(places, categoryName) {
    const list = (places || [])
        .filter(place => !PLACE_ID_ALIASES[place.id] && !isRemovedPlace(place))
        .map(place => ({ ...place, id: canonicalPlaceId(place.id) }));

    extraPlacesCache.forEach(place => {
        if (isRemovedPlace(place)) return;
        if (categoryName && place.category !== categoryName) return;
        const extra = { ...place, id: canonicalPlaceId(place.id) };
        if (list.some(existing => isSameListing(existing, extra))) return;
        list.push(extra);
    });

    const deduped = [];
    list.forEach((place) => {
        const idx = deduped.findIndex(existing => isSameListing(existing, place));
        if (idx === -1) {
            deduped.push(place);
            return;
        }
        const extra = extraPlacesCache.find(item => isSameListing({ ...item, id: canonicalPlaceId(item.id) }, deduped[idx]));
        overlayExtraFields(deduped[idx], extra || place);
        deduped[idx].id = canonicalPlaceId(deduped[idx].id);
    });
    return deduped.map(applyExtraGeo);
}

function placeSortTitle(place) {
    return (place[`title_${currentLang}`] || place.title_en || place.id || '').toString().trim();
}

function sortPlacesWithPinnedFirst(places) {
    return [...(places || [])].sort((a, b) => {
        const aPin = PINNED_PLACE_IDS.indexOf(a.id);
        const bPin = PINNED_PLACE_IDS.indexOf(b.id);
        const aPinned = aPin !== -1;
        const bPinned = bPin !== -1;

        // Pinned items stay first, in PINNED_PLACE_IDS order
        if (aPinned && bPinned) return aPin - bPin;
        if (aPinned) return -1;
        if (bPinned) return 1;

        // Everything else: alphabetical by current-language title
        return placeSortTitle(a).localeCompare(placeSortTitle(b), currentLang || 'en', {
            sensitivity: 'base',
            numeric: true
        });
    });
}

function hasCoords(place) {
    if (!place || place.lat == null || place.lng == null || place.lat === '' || place.lng === '') {
        return false;
    }
    const lat = Number(place.lat);
    const lng = Number(place.lng);
    // Reject Null Island / missing coords (Number(null) === 0)
    return Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0);
}

function googleMapsHref(place) {
    if (hasCoords(place)) {
        return `https://maps.google.com/?q=${Number(place.lat)},${Number(place.lng)}`;
    }
    if (place.map_link && /maps\.|goo\.gl|2gis/i.test(place.map_link)) {
        return place.map_link;
    }
    return '';
}

function getMarkerIcon(isFavoriteMarker = false) {
    if (!window.L) return null;
    const key = isFavoriteMarker ? 'fav' : 'place';
    if (markerIconCache[key]) return markerIconCache[key];

    markerIconCache[key] = L.divIcon({
        className: `cb-marker${isFavoriteMarker ? ' cb-marker--fav' : ''}`,
        html: `<span class="cb-marker-pin" aria-hidden="true"></span>`,
        iconSize: [28, 36],
        iconAnchor: [14, 34],
        popupAnchor: [0, -30]
    });
    return markerIconCache[key];
}

function createPlaceMarker(place, { onClick, forceFavorite = false } = {}) {
    const fav = forceFavorite || isFavorite(place.id);
    const marker = L.marker([Number(place.lat), Number(place.lng)], {
        icon: getMarkerIcon(fav),
        zIndexOffset: fav ? 200 : 0
    });
    marker.bindPopup(placePopupHtml(place));
    if (onClick) marker.on('click', onClick);
    return marker;
}

function configureLeafletIcons() {
    if (!window.L) return;
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
    });
}

function loadLeaflet() {
    if (window.L) {
        configureLeafletIcons();
        return Promise.resolve(window.L);
    }
    if (leafletLoader) return leafletLoader;

    leafletLoader = new Promise((resolve, reject) => {
        if (!document.querySelector('link[data-leaflet]')) {
            const css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            css.setAttribute('data-leaflet', '1');
            document.head.appendChild(css);
        }

        const finish = () => {
            configureLeafletIcons();
            resolve(window.L);
        };

        const existing = document.querySelector('script[data-leaflet]');
        if (existing) {
            if (window.L) return finish();
            existing.addEventListener('load', finish);
            existing.addEventListener('error', reject);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.setAttribute('data-leaflet', '1');
        script.onload = finish;
        script.onerror = reject;
        document.head.appendChild(script);
    });

    return leafletLoader;
}

function ensureCategoryMapLayout(listContainer) {
    if (!listContainer || document.querySelector('.category-layout')) return;

    const layout = document.createElement('div');
    layout.className = 'category-layout';

    const main = document.createElement('div');
    main.className = 'category-main';

    const typeFilters = document.getElementById('myBtnContainer');
    const townFilters = document.getElementById('townFilterContainer');
    const townBlock = townFilters && townFilters.closest('.filter-block');
    const firstFilter = typeFilters || townBlock || townFilters;

    if (firstFilter && firstFilter.parentNode) {
        firstFilter.parentNode.insertBefore(layout, firstFilter);
    } else {
        listContainer.parentNode.insertBefore(layout, listContainer);
    }

    if (typeFilters) main.appendChild(typeFilters);
    if (townBlock) main.appendChild(townBlock);
    else if (townFilters) main.appendChild(townFilters);

    main.appendChild(listContainer);
    layout.appendChild(main);

    const panel = document.createElement('aside');
    panel.className = 'category-map-panel';
    panel.innerHTML = `
        <div class="category-map-toolbar">
            <strong data-i18n="map-title">${t('map-title')}</strong>
            <button type="button" class="map-panel-close" aria-label="${t('map-hide')}" data-i18n="map-hide">${t('map-hide')}</button>
        </div>
        <div class="map-legend map-legend--panel">
            <span class="map-legend-item">
                <i class="map-legend-dot map-legend-dot--place"></i>
                <span data-i18n="map-legend-places">${t('map-legend-places')}</span>
            </span>
            <span class="map-legend-item">
                <i class="map-legend-dot map-legend-dot--fav"></i>
                <span data-i18n="map-legend-favorites">${t('map-legend-favorites')}</span>
            </span>
        </div>
        <div id="category-map" class="places-map" role="region" aria-label="${t('map-title')}"></div>
        <p class="map-empty-msg" id="category-map-empty" hidden data-i18n="map-empty">${t('map-empty')}</p>
    `;
    layout.appendChild(panel);

    if (!document.querySelector('.show-map-fab')) {
        const fab = document.createElement('button');
        fab.type = 'button';
        fab.className = 'show-map-fab';
        fab.setAttribute('data-i18n', 'map-show');
        fab.innerText = t('map-show');
        fab.addEventListener('click', () => {
            document.body.classList.add('map-open');
            setTimeout(() => {
                (categoryMap || favoritesMap)?.invalidateSize();
            }, 50);
        });
        document.body.appendChild(fab);
    }

    panel.querySelector('.map-panel-close')?.addEventListener('click', () => {
        document.body.classList.remove('map-open');
    });
}

function categoryLabel(category) {
    const map = {
        hotels: 'nav-hotels',
        restaurants: 'nav-restaurants',
        views: 'nav-views',
        beaches: 'nav-beaches',
        realestate: 'nav-realestate',
        things: 'nav-things',
        services: 'nav-services'
    };
    return map[category] ? t(map[category]) : '';
}

function placePopupHtml(place) {
    const title = place[`title_${currentLang}`] || place.title_en || place.id;
    const img = resolvePlaceImage(place.image_url);
    const thumb = img.includes('cloudinary.com')
        ? img.replace('/upload/', '/upload/f_auto,q_auto,w_120,h_80,c_fill/')
        : img;
    const cat = categoryLabel(place.category);
    const favBadge = isFavorite(place.id)
        ? `<span class="map-popup-fav">${escapeHtml(t('map-legend-favorites'))}</span>`
        : '';
    return `
        <div class="map-popup">
            ${thumb ? `<img src="${escapeHtml(thumb)}" alt="">` : ''}
            ${cat ? `<span class="map-popup-cat">${escapeHtml(cat)}</span>` : ''}
            <strong>${escapeHtml(title)}</strong>
            ${favBadge}
            <a href="${detailsUrl(place.id)}">${escapeHtml(t('btn-more'))} →</a>
        </div>
    `;
}

function fitMapToMarkers(map, markers) {
    if (!map || !markers.length) {
        map?.setView(CYPRUS_CENTER, 8);
        return;
    }
    if (markers.length === 1) {
        map.setView(markers[0].getLatLng(), 13);
        return;
    }
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.18));
}

async function renderCategoryMap(places) {
    const listContainer = document.querySelector('.items-list[id$="-container"]');
    if (!listContainer) return;

    ensureCategoryMapLayout(listContainer);
    const mapEl = document.getElementById('category-map');
    const emptyEl = document.getElementById('category-map-empty');
    if (!mapEl) return;

    try {
        await loadLeaflet();
    } catch (err) {
        console.error('Leaflet failed to load:', err);
        return;
    }

    if (!categoryMap) {
        categoryMap = L.map(mapEl, { scrollWheelZoom: true }).setView(CYPRUS_CENTER, 8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; OpenStreetMap'
        }).addTo(categoryMap);
        categoryMarkerLayer = L.layerGroup().addTo(categoryMap);
        setTimeout(() => categoryMap.invalidateSize(), 100);
    }

    updateCategoryMapMarkers();
    if (emptyEl) emptyEl.hidden = places.some(hasCoords);
}

function placeMatchesActiveFilters(place) {
    const onFavorites = !!document.getElementById('favCategoryContainer');
    const categoryOk = !onFavorites || activeCategoryFilter === 'all' || place.category === activeCategoryFilter;
    const typeOk = activeTypeFilter === 'all' || place.subcategory === activeTypeFilter;
    const townOk = activeTownFilter === 'all' || normalizeTown(place) === activeTownFilter;
    return categoryOk && typeOk && townOk;
}

function updateFavoritesMapMarkers() {
    if (!favoritesMap || !favoritesMarkerLayer) return;

    favoritesMarkerLayer.clearLayers();
    const markers = [];

    favoritesPlacesCache.forEach(place => {
        if (!hasCoords(place) || !placeMatchesActiveFilters(place)) return;
        const marker = createPlaceMarker(place, {
            forceFavorite: true,
            onClick: () => {
                document.querySelectorAll('.item-card.is-map-active').forEach(el => el.classList.remove('is-map-active'));
                const card = [...document.querySelectorAll('.item-card-link[data-place-id]')]
                    .find(el => el.getAttribute('data-place-id') === place.id)
                    ?.closest('.item-card');
                if (card) {
                    card.classList.add('is-map-active');
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });
        favoritesMarkerLayer.addLayer(marker);
        markers.push(marker);
    });

    const emptyEl = document.getElementById('favorites-map-empty');
    if (emptyEl) emptyEl.hidden = markers.length > 0;
    fitMapToMarkers(favoritesMap, markers);
    setTimeout(() => favoritesMap.invalidateSize(), 50);
}

function updateCategoryMapMarkers() {
    activeMapFilter = activeTypeFilter;
    if (!categoryMap || !categoryMarkerLayer) return;

    categoryMarkerLayer.clearLayers();
    const markers = [];

    categoryPlacesCache.forEach(place => {
        if (!hasCoords(place)) return;
        if (!placeMatchesActiveFilters(place)) return;

        const marker = createPlaceMarker(place, {
            onClick: () => {
                document.querySelectorAll('.item-card.is-map-active').forEach(el => el.classList.remove('is-map-active'));
                const card = [...document.querySelectorAll('.item-card-link[data-place-id]')]
                    .find(el => el.getAttribute('data-place-id') === place.id)
                    ?.closest('.item-card');
                if (card) {
                    card.classList.add('is-map-active');
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });
        categoryMarkerLayer.addLayer(marker);
        markers.push(marker);
    });

    const emptyEl = document.getElementById('category-map-empty');
    if (emptyEl) emptyEl.hidden = markers.length > 0;
    fitMapToMarkers(categoryMap, markers);
    setTimeout(() => categoryMap.invalidateSize(), 50);
}

function updateHomeMapMarkers() {
    if (!homeMap || !homeMarkerLayer) return;

    homeMarkerLayer.clearLayers();
    const markers = [];

    homePlacesCache.forEach(place => {
        if (!hasCoords(place)) return;
        const marker = createPlaceMarker(place);
        homeMarkerLayer.addLayer(marker);
        markers.push(marker);
    });

    fitMapToMarkers(homeMap, markers);
    setTimeout(() => homeMap.invalidateSize(), 50);
}

async function loadHomeMap() {
    const mapEl = document.getElementById('home-map');
    if (!mapEl || !dbClient) return;
    await ensureExtraPlaces();

    try {
        await loadLeaflet();
    } catch (err) {
        console.error('Leaflet failed to load:', err);
        return;
    }

    const { data: places, error } = await dbClient
        .from('places')
        .select('id, category, image_url, lat, lng, title_en, title_el, title_ru, title_zh, subcategory');

    if (error) {
        console.error('Error loading home map places:', error);
        return;
    }

    homePlacesCache = mergeExtraPlaces(places).filter(hasCoords);

    if (!homeMap) {
        homeMap = L.map(mapEl, { scrollWheelZoom: false }).setView(CYPRUS_CENTER, 8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; OpenStreetMap'
        }).addTo(homeMap);
        homeMarkerLayer = L.layerGroup().addTo(homeMap);
        homeMap.on('focus', () => homeMap.scrollWheelZoom.enable());
        homeMap.on('blur', () => homeMap.scrollWheelZoom.disable());
        mapEl.addEventListener('mouseenter', () => homeMap.scrollWheelZoom.enable());
        mapEl.addEventListener('mouseleave', () => homeMap.scrollWheelZoom.disable());
    }

    updateHomeMapMarkers();
}

function refreshMapFavoriteMarkers() {
    if (homeMap) updateHomeMapMarkers();
    if (categoryMap) updateCategoryMapMarkers();
    if (favoritesMap && document.getElementById('favorites-map')) {
        renderFavoritesMap(favoritesPlacesCache.filter(place => isFavorite(place.id)));
    }
}

async function renderDetailsMap(place) {
    const wrap = document.getElementById('details-map-wrap');
    const mapEl = document.getElementById('details-map');
    if (!wrap || !mapEl) return;

    if (!hasCoords(place)) {
        wrap.style.display = 'none';
        if (detailsMap) {
            detailsMap.remove();
            detailsMap = null;
        }
        return;
    }

    wrap.style.display = 'block';
    const titleEl = wrap.querySelector('[data-i18n="map-title"]');
    if (titleEl) titleEl.innerText = t('map-title');

    try {
        await loadLeaflet();
    } catch (err) {
        console.error('Leaflet failed to load:', err);
        return;
    }

    if (detailsMap) {
        detailsMap.remove();
        detailsMap = null;
    }

    detailsMap = L.map(mapEl, { scrollWheelZoom: false }).setView([Number(place.lat), Number(place.lng)], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap'
    }).addTo(detailsMap);

    const marker = L.marker([Number(place.lat), Number(place.lng)]).addTo(detailsMap);
    marker.bindPopup(escapeHtml(place[`title_${currentLang}`] || place.title_en || place.id));
    setTimeout(() => detailsMap.invalidateSize(), 100);
}

async function loadCategory(categoryName, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !dbClient) return;
    await ensureExtraPlaces();

    const { data: places, error } = await dbClient
        .from('places')
        .select('*')
        .eq('category', categoryName);
    
    if (error) {
        console.error("Error loading category:", error);
        return;
    }

    const ordered = sortPlacesWithPinnedFirst(mergeExtraPlaces(places, categoryName));
    categoryPlacesCache = ordered;
    activeTypeFilter = 'all';
    activeTownFilter = 'all';
    activeMapFilter = 'all';
    container.innerHTML = ordered.map(place => renderPlaceCard(place, { show: true })).join('');
    renderCategoryMap(ordered);
    applyFilters();
}

/* --- 4. BEST OF MONTH --- */
async function loadBestOfMonth() {
    const container = document.getElementById('month-recommendation');
    if (!container || !dbClient) return;

    const { data: items, error } = await dbClient.from('places').select('*').eq('is_best_of_month', true);
    if (error || !items) return;

    container.innerHTML = '';
    items.filter(place => !isRemovedPlace(place)).forEach(place => {
        const title = place[`title_${currentLang}`] || place.title_en;
        const desc = place[`desc_${currentLang}`] || place.desc_en; // Διορθώθηκε το ID
        
        let finalUrl = resolvePlaceImage(place.image_url);

        container.innerHTML += `
            <article class="month-card">
                ${favoriteButtonHtml(place.id)}
                <a href="${detailsUrl(place.id)}" class="month-layout" data-place-id="${escapeHtml(place.id)}">
                    <div class="month-media">
                        <img src="${escapeHtml(finalUrl)}" alt="${escapeHtml(title)}" loading="lazy">
                    </div>
                    <div class="month-info">
                        <span class="month-badge" data-i18n="best-of">${t('best-of')}</span>
                        <h3>${escapeHtml(title)}</h3>
                        <p>${escapeHtml(truncateText(desc, 160))}</p>
                        <span class="month-cta">${t('btn-more')} →</span>
                    </div>
                </a>
            </article>`;
    });
}

/* --- 5. ΣΕΛΙΔΑ ΛΕΠΤΟΜΕΡΕΙΩΝ (DETAILS) --- */
async function loadFullDetails(id) {
    if (!dbClient) return;
    id = id || getPlaceIdFromUrl();
    if (isRemovedPlace(id)) id = '';
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
    const { data, error } = await dbClient
        .from('places')
        .select('*')
        .eq('id', id)
        .single();

    await ensureExtraPlaces();
    const place = applyExtraGeo(data || extraPlacesCache.find(item => item.id === id) || null);

    if (!place) {
        console.error("Place not found:", error);
        return;
    }

    // 1. Τίτλος: Ψάχνει title_el, title_en κλπ
    const title = place[`title_${currentLang}`] || place.title_en || place.id;
    
    // 2. ΠΕΡΙΓΡΑΦΗ: Ψάχνει desc_el, desc_en (όπως το SQL σου)
    const description = place[`desc_${currentLang}`] || place.desc_en || "";

    // 3. Εικόνα: Προσθέτει και το Cloudinary Optimization αν είναι link από εκεί
    let imgUrl = resolvePlaceImage(place.image_url);

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
    const mapBtn = document.getElementById('map-link');
    if (mapBtn) {
        const mapsHref = googleMapsHref(place);
        if (mapsHref) {
            mapBtn.href = mapsHref;
            mapBtn.style.display = 'inline-block';
        } else {
            mapBtn.style.display = 'none';
        }
    }

    renderDetailsMap(place);
}

/* --- 6. UTILITIES (ΓΛΩΣΣΑ, ΚΑΙΡΟΣ κλπ) --- */
function updateMonthHeading() {
    const monthEl = document.getElementById('current-month-name');
    if (!monthEl) return;
    monthEl.innerText = t(`month-${new Date().getMonth()}`);
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('userLang', lang);

    document.querySelectorAll('.language-bar button').forEach(btn => {
        const match = (btn.getAttribute('onclick') || '').includes(`'${lang}'`);
        btn.classList.toggle('is-active', match);
    });
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (staticTranslations[lang] && staticTranslations[lang][key]) {
            el.innerText = staticTranslations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        const label = staticTranslations[lang] && staticTranslations[lang][key];
        if (label) el.setAttribute('aria-label', label);
    });

    updateMonthHeading();
    refreshAllData();
    updateAuthUI();
}

function refreshAllData() {
    const categories = ['hotels', 'restaurants', 'views', 'beaches', 'realestate', 'things', 'services'];
    categories.forEach(cat => {
        if (document.getElementById(`${cat}-container`)) loadCategory(cat, `${cat}-container`);
    });
    if (document.getElementById('month-recommendation')) loadBestOfMonth();
    if (document.getElementById('favorites-container')) loadFavoritesPage();
    if (document.getElementById('home-map')) loadHomeMap();

    if (document.getElementById('place-title') || document.getElementById('details-header')) {
        loadFullDetails(getPlaceIdFromUrl());
    }
}

/* --- ΠΡΟΣΘΗΚΗ ΦΙΛΤΡΩΝ (type + town) --- */
function setTypeFilter(value) {
    activeTypeFilter = value || 'all';
    applyFilters();
}

function setTownFilter(value) {
    activeTownFilter = value || 'all';
    applyFilters();
}

function setCategoryFilter(value) {
    activeCategoryFilter = value || 'all';
    activeTypeFilter = 'all';
    renderFavoriteTypeFilters();
    applyFilters();
}

const FAVORITE_TYPE_FILTERS = {
    restaurants: [
        ['all', 'filter-all'],
        ['traditional', 'filter-trad'],
        ['fine_dining', 'filter-fine'],
        ['asian', 'filter-asian'],
        ['mexican', 'filter-mexican']
    ],
    things: [
        ['all', 'filter-all'],
        ['safari', 'filter-safari'],
        ['sea', 'filter-boat'],
        ['diving', 'filter-diving'],
        ['watersports', 'filter-watersports'],
        ['ski', 'filter-ski'],
        ['culture', 'filter-culture'],
        ['wine', 'filter-wine'],
        ['yoga', 'filter-yoga'],
        ['promenades', 'filter-promenades']
    ],
    services: [
        ['all', 'filter-all'],
        ['law', 'filter-law'],
        ['medical', 'filter-medical'],
        ['accounting', 'filter-accounting'],
        ['architects', 'filter-architects'],
        ['flowers', 'filter-flowers'],
        ['taxi', 'filter-taxi']
    ]
};

function renderFavoriteTypeFilters() {
    const block = document.getElementById('favTypeFilterBlock');
    const row = document.getElementById('myBtnContainer');
    if (!block || !row || !document.getElementById('favCategoryContainer')) return;

    const options = FAVORITE_TYPE_FILTERS[activeCategoryFilter];
    if (!options) {
        block.hidden = true;
        row.innerHTML = '';
        return;
    }

    block.hidden = false;
    row.innerHTML = options.map(([value, key]) => {
        const active = value === activeTypeFilter ? ' active' : '';
        return `<button type="button" class="filter-btn${active}" onclick="filterSelection('${value}')" data-i18n="${key}">${t(key)}</button>`;
    }).join('');
}

function updateFavoritesFilterEmpty() {
    const note = document.getElementById('fav-filter-empty');
    if (!note) return;
    const cards = document.querySelectorAll('#favorites-container .item-card');
    if (!cards.length) {
        note.hidden = true;
        return;
    }
    note.hidden = [...cards].some(card => card.classList.contains('show'));
}

function filterSelection(category) {
    setTypeFilter(category);
}

function syncFilterButtonState(containerSelector, activeValue) {
    document.querySelectorAll(`${containerSelector} .filter-btn`).forEach(btn => {
        const onclick = btn.getAttribute('onclick') || '';
        const isActive = onclick.includes(`'${activeValue}'`) || onclick.includes(`"${activeValue}"`);
        btn.classList.toggle('active', isActive);
    });
}

function applyFilters() {
    const cards = document.getElementsByClassName('item-card');
    const onFavorites = !!document.getElementById('favCategoryContainer');

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const type = card.getAttribute('data-subcategory') || '';
        const town = card.getAttribute('data-town') || '';
        const category = card.getAttribute('data-category') || '';
        const categoryOk = !onFavorites || activeCategoryFilter === 'all' || category === activeCategoryFilter;
        const typeOk = activeTypeFilter === 'all' || type === activeTypeFilter || card.classList.contains(activeTypeFilter);
        const townOk = activeTownFilter === 'all' || town === activeTownFilter;
        card.classList.toggle('show', categoryOk && typeOk && townOk);
    }

    syncFilterButtonState('#myBtnContainer', activeTypeFilter);
    syncFilterButtonState('#townFilterContainer', activeTownFilter);
    syncFilterButtonState('#favCategoryContainer', activeCategoryFilter);
    updateCategoryMapMarkers();
    updateFavoritesMapMarkers();
    updateFavoritesFilterEmpty();
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

function initHeroSlider() {
    const root = document.getElementById('hero-slider');
    if (!root) return;

    const slides = Array.from(root.querySelectorAll('.hero-slide'));
    const dots = Array.from(root.querySelectorAll('.hero-dot'));
    const prev = root.querySelector('.hero-prev');
    const next = root.querySelector('.hero-next');
    if (!slides.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hoverPause = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const DELAY = 4000;
    let index = Math.max(0, slides.findIndex(slide => slide.classList.contains('is-active')));
    let timer = null;

    function render(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            const active = i === index;
            slide.classList.toggle('is-active', active);
            slide.setAttribute('aria-hidden', active ? 'false' : 'true');
            slide.toggleAttribute('inert', !active);
        });
        dots.forEach((dot, i) => {
            const active = i === index;
            dot.classList.toggle('is-active', active);
            if (active) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
        });
    }

    function stop() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    function shouldPause() {
        if (document.hidden) return true;
        if (hoverPause && root.matches(':hover')) return true;
        const active = document.activeElement;
        if (!active || active === document.body || !root.contains(active)) return false;
        return active.matches(':focus-visible');
    }

    function sync() {
        if (reduceMotion || shouldPause()) {
            stop();
            return;
        }
        if (timer) return;
        timer = setInterval(() => render(index + 1), DELAY);
    }

    function userGo(deltaOrIndex, absolute) {
        render(absolute ? deltaOrIndex : index + deltaOrIndex);
        stop();
        sync();
    }

    prev?.addEventListener('click', () => userGo(-1));
    next?.addEventListener('click', () => userGo(1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => userGo(i, true)));

    root.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        userGo(event.key === 'ArrowRight' ? 1 : -1);
    });

    let startX = 0;
    let startY = 0;
    let tracking = false;
    root.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        if (event.target.closest('a, button')) return;
        tracking = true;
        startX = event.clientX;
        startY = event.clientY;
    });
    root.addEventListener('pointerup', (event) => {
        if (!tracking) return;
        tracking = false;
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
        userGo(dx < 0 ? 1 : -1);
    });
    root.addEventListener('pointercancel', () => { tracking = false; });

    ['mouseenter', 'mouseleave', 'focusin', 'focusout'].forEach((name) => {
        root.addEventListener(name, sync);
    });
    document.addEventListener('visibilitychange', sync);

    render(index);
    sync();
}

document.addEventListener("DOMContentLoaded", async () => {
    initHeroSlider();
    getWeather();
    await initAuth();
    const saved = localStorage.getItem('userLang') || 'en';
    setLanguage(saved);

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
});