import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = join(root, 'images');
const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function place(p) {
  return {
    is_best_of_month: false,
    ...p,
    map_link: p.map_link || `https://maps.google.com/?q=${p.lat},${p.lng}`
  };
}

const restaurants = [
  place({
    id: 'tocayo', category: 'restaurants', image_url: 'images/tocayo.jpg',
    phone: '+357 22 100800', website: 'https://tocayo.com.cy/',
    title_en: 'Tocayo', desc_en: 'Located in the heart of Nicosia, Tocayo offers a chic, minimalist setting and an innovative Asian fusion menu. Known for its exquisite tapas-style dishes, creative cocktails, and vibrant atmosphere, it is the perfect spot for a sophisticated night out in the capital.',
    title_el: 'Tocayo', desc_el: 'Στην καρδιά της Λευκωσίας, το Tocayo προσφέρει ένα κομψό, μινιμαλιστικό περιβάλλον και ένα καινοτόμο μενού ασιατικής fusion κουζίνας. Γνωστό για τα εξαιρετικά πιάτα τύπου τάπας, τα δημιουργικά κοκτέιλ και τη ζωντανή ατμόσφαιρα, είναι το ιδανικό μέρος για μια εκλεπτυσμένη βραδινή έξοδο στην πρωτεύουσα.',
    title_ru: 'Tocayo', desc_ru: 'Расположенный в самом сердце Никосии, ресторан Tocayo предлагает элегантную минималистичную обстановку и инновационное меню азиатской кухни фьюжн. Известный своими изысканными блюдами в стиле тапас, креативными коктейлями и оживленной атмосферой, это идеальное место для изысканного вечера в столице.',
    title_zh: 'Tocayo', desc_zh: 'Tocayo 位于尼科西亚市中心，提供别致、极简的环境和创新的亚洲融合菜单。这里以其精致的塔帕斯风格菜肴、创意鸡尾酒和充满活力的氛围而闻名，是首都享受精致夜晚的完美去处。',
    subcategory: 'asian', lat: 35.1694, lng: 33.3618, town: 'nicosia'
  }),
  place({
    id: 'dionysusmansion', category: 'restaurants', image_url: 'images/dionysusmansion.jpg',
    phone: '+357 25 222210', website: 'https://dionysusmansion.com/',
    title_en: 'Dionysus Mansion', desc_en: 'Situated in a beautifully restored historic house in Limassol, Dionysus Mansion elevates traditional Cypriot cuisine with modern culinary techniques. Featuring a stunning, fairy-lit garden for outdoor dining, it provides a magical atmosphere and a menu filled with authentic, localized flavors and premium local wines.',
    title_el: 'Dionysus Mansion', desc_el: 'Στεγασμένο σε ένα όμορφα αναπαλαιωμένο ιστορικό αρχοντικό στη Λεμεσό, το Dionysus Mansion απογειώνει την παραδοσιακή κυπριακή κουζίνα με σύγχρονες γαστρονομικές τεχνικές. Διαθέτοντας έναν μαγευτικό, φωταγωγημένο κήπο για δείπνο σε ανοιχτό χώρο, προσφέρει μια παραμυθένια ατμόσφαιρα και ένα μενού γεμάτο αυθεντικές γεύσεις και κορυφαία τοπικά κρασιά.',
    title_ru: 'Dionysus Mansion', desc_ru: 'Расположенный в прекрасно отреставрированном историческом особняке в Лимассоле, Dionysus Mansion возвышает традиционную кипрскую кухню с помощью современных кулинарных техник. Потрясающий сад, украшенный гирляндами для ужина на свежем воздухе, создает волшебную атмосферу и предлагает меню, полное аутентичных вкусов и первоклассных местных вин.',
    title_zh: 'Dionysus Mansion', desc_zh: 'Dionysus Mansion 坐落于利马索尔一栋经过精美修复的历史建筑内，采用现代烹饪技术提升了传统的塞浦路斯美食。这里拥有一个令人惊叹的、灯光闪烁的户外用餐花园，提供神奇的氛围以及充满地道风味和优质当地葡萄酒的菜单。',
    subcategory: 'traditional', lat: 34.6756, lng: 33.0448, town: 'limassol'
  }),
  place({
    id: 'maqamalsultan', category: 'restaurants', image_url: 'images/maqamalsultan.jpg',
    phone: '+357 24 628282', website: 'https://www.maqamalsultan.com/',
    title_en: 'Maqam Al Sultan', desc_en: 'Set right on the lively Finikoudes promenade in Larnaca, Maqam Al Sultan delivers a highly authentic Lebanese dining experience. Guests can enjoy a rich array of traditional mezzes, perfectly grilled meats, and shisha, all accompanied by spectacular views of the Mediterranean Sea and warm Middle Eastern hospitality.',
    title_el: 'Maqam Al Sultan', desc_el: 'Πάνω στον πολυσύχναστο πεζόδρομο των Φοινικούδων στη Λάρνακα, το Maqam Al Sultan προσφέρει μια εξαιρετικά αυθεντική λιβανέζικη γαστρονομική εμπειρία. Οι επισκέπτες μπορούν να απολαύσουν μια πλούσια ποικιλία από παραδοσιακούς μεζέδες, καλοψημένα κρέατα και ναργιλέ, με εκπληκτική θέα στη Μεσόγειο και ζεστή ανατολίτικη φιλοξενία.',
    title_ru: 'Maqam Al Sultan', desc_ru: 'Расположенный прямо на оживленной набережной Финикудес в Ларнаке, Maqam Al Sultan предлагает по-настоящему аутентичный опыт ливанской кухни. Гости могут насладиться богатым выбором традиционных мезе, идеально приготовленным на гриле мясом и кальяном в сопровождении захватывающего вида на Средиземное море и теплого ближневосточного гостеприимства.',
    title_zh: 'Maqam Al Sultan', desc_zh: 'Maqam Al Sultan 坐落于拉纳卡热闹的菲尼库德斯 (Finikoudes) 海滨长廊上，提供极其地道的黎巴嫩餐饮体验。客人可以享用丰富多样的传统小吃 (Meze)、完美的烤肉和水烟，同时欣赏地中海的壮丽景色并感受中东的热情好客。',
    subcategory: 'traditional', lat: 34.9163, lng: 33.6378, town: 'larnaca'
  }),
  place({
    id: 'glasshouse', category: 'restaurants', image_url: 'images/glasshouse.jpg',
    phone: '+357 23 724000', website: 'https://www.adams.com.cy/',
    title_en: 'Glasshouse Lounge Restaurant', desc_en: 'Perched on the top floor of the Adams Beach Hotel in Ayia Napa, the Glasshouse Lounge offers a spectacular fine-dining experience with panoramic views of Nissi Bay. With its striking glass-themed décor and an innovative international menu, it is the ultimate destination for special occasions and luxury sunset dinners.',
    title_el: 'Glasshouse Lounge Restaurant', desc_el: 'Στον τελευταίο όροφο του Adams Beach Hotel στην Αγία Νάπα, το Glasshouse Lounge προσφέρει μια θεαματική fine-dining εμπειρία με πανοραμική θέα στον κόλπο του Nissi. Με εντυπωσιακή διακόσμηση από γυαλί και ένα καινοτόμο διεθνές μενού, αποτελεί τον απόλυτο προορισμό για ειδικές περιστάσεις και πολυτελή δείπνα στο ηλιοβασίλεμα.',
    title_ru: 'Glasshouse Lounge Restaurant', desc_ru: 'Расположенный на верхнем этаже отеля Adams Beach в Айя-Напе, ресторан Glasshouse Lounge предлагает захватывающие впечатления от высокой кухни с панорамным видом на залив Нисси. Яркий декор в стеклянном стиле и инновационное интернациональное меню делают его идеальным местом для особых случаев и роскошных ужинов на закате.',
    title_zh: 'Glasshouse Lounge Restaurant', desc_zh: 'Glasshouse Lounge 坐落于圣纳帕 (Ayia Napa) 亚当斯海滩酒店 (Adams Beach Hotel) 的顶层，提供壮观的高级餐饮体验，可欣赏尼斯湾 (Nissi Bay) 的全景。凭借其引人注目的玻璃主题装饰和创新的国际菜单，它是举办特殊场合和豪华日落晚餐的终极目的地。',
    subcategory: 'fine_dining', lat: 34.9874, lng: 33.9597, town: 'famagusta'
  }),
  place({
    id: 'pyxida', category: 'restaurants', image_url: 'images/pyxida.jpg',
    phone: '+357 22 671129', website: 'https://www.pyxidafishtavern.com/',
    title_en: 'Pyxida Fish Tavern', desc_en: 'Located in the center of Nicosia, Pyxida is a top-tier seafood restaurant renowned for its fresh fish and elegant atmosphere. From classic fish meze to gourmet seafood pasta, it offers an unforgettable culinary journey for seafood lovers in the capital.',
    title_el: 'Pyxida Fish Tavern', desc_el: 'Βρίσκεται στο κέντρο της Λευκωσίας, η Pyxida είναι ένα κορυφαίο εστιατόριο θαλασσινών, φημισμένο για τα φρέσκα ψάρια και την κομψή του ατμόσφαιρα. Από τον κλασικό ψαρομεζέ μέχρι τις γκουρμέ μακαρονάδες θαλασσινών, προσφέρει ένα αξέχαστο γαστρονομικό ταξίδι στην πρωτεύουσα.',
    title_ru: 'Pyxida Fish Tavern', desc_ru: 'Расположенный в центре Никосии, Pyxida — это первоклассный рыбный ресторан, известный своей свежей рыбой и элегантной атмосферой. От классического рыбного мезе до изысканной пасты с морепродуктами — он предлагает незабываемое кулинарное путешествие.',
    title_zh: 'Pyxida Fish Tavern', desc_zh: 'Pyxida 位于尼科西亚市中心，是一家顶级的海鲜餐厅，以其新鲜的鱼类和优雅的氛围而闻名。从经典的海鲜小吃到美味的海鲜意大利面，它为首都的海鲜爱好者提供了一次难忘的烹饪之旅。',
    subcategory: 'fine_dining', lat: 35.1698, lng: 33.3602, town: 'nicosia'
  }),
  place({
    id: 'epsilon', category: 'restaurants', image_url: 'images/epsilon.jpg',
    phone: '+357 25 020200', website: 'https://www.limassolmarina.com/dining/epsilon',
    title_en: 'Epsilon Resto Bar', desc_en: 'Situated in the luxurious Limassol Marina, Epsilon Resto Bar offers a chic dining experience with mesmerizing views of the Mediterranean. Its modern menu features creative international dishes, premium sushi, and signature cocktails, making it a hotspot for trendy and sophisticated dining.',
    title_el: 'Epsilon Resto Bar', desc_el: 'Στην πολυτελή Μαρίνα Λεμεσού, το Epsilon Resto Bar προσφέρει μια κομψή γαστρονομική εμπειρία με μαγευτική θέα στη Μεσόγειο. Το μοντέρνο μενού του περιλαμβάνει δημιουργικά διεθνή πιάτα, premium σούσι και signature κοκτέιλ, καθιστώντας το ένα hotspot για μοντέρνα διασκέδαση.',
    title_ru: 'Epsilon Resto Bar', desc_ru: 'Ресторан и бар Epsilon, расположенный в роскошной гавани Лимассола, предлагает шикарный ужин с завораживающим видом на Средиземное море. Его современное меню включает креативные блюда международной кухни, суши премиум-класса и фирменные коктейли.',
    title_zh: 'Epsilon Resto Bar', desc_zh: 'Epsilon Resto Bar 位于豪华的利马索尔码头，提供别致的用餐体验，可欣赏地中海的迷人景色。其现代菜单以创意的国际菜肴、优质寿司和招牌鸡尾酒为特色，使其成为时尚精致餐饮的热门地点。',
    subcategory: 'asian', lat: 34.6729, lng: 33.0436, town: 'limassol'
  }),
  place({
    id: 'militzis', category: 'restaurants', image_url: 'images/militzis.jpg',
    phone: '+357 24 655867', website: 'https://militzis.com/',
    title_en: 'Militzis Traditional Tavern', desc_en: 'A true Larnaca landmark overlooking the sea, Militzis has been serving authentic Cypriot cuisine for decades. Famous for its traditional wood-fired oven dishes, tender kleftiko, and local wines, this rustic tavern guarantees a genuine and hearty taste of Cyprus.',
    title_el: 'Ταβέρνα Μιλίτζης', desc_el: 'Ένα πραγματικό ορόσημο της Λάρνακας με θέα στη θάλασσα, ο Μιλίτζης σερβίρει αυθεντική κυπριακή κουζίνα εδώ και δεκαετίες. Φημισμένη για τα παραδοσιακά πιάτα στον ξυλόφουρνο, το τρυφερό κλέφτικο και τα τοπικά κρασιά, αυτή η ρουστίκ ταβέρνα εγγυάται μια γνήσια γεύση της Κύπρου.',
    title_ru: 'Таверна Militzis', desc_ru: 'Настоящая достопримечательность Ларнаки с видом на море, таверна Militzis десятилетиями подает аутентичные блюда кипрской кухни. Эта деревенская таверна, известная своими традиционными блюдами из дровяной печи, нежным клефтико и местными винами, гарантирует настоящий вкус Кипра.',
    title_zh: 'Militzis Traditional Tavern', desc_zh: 'Militzis 是拉纳卡真正的地标建筑，俯瞰大海，几十年来一直供应正宗的塞浦路斯美食。这家质朴的酒馆以其传统的燃木烤炉菜肴、嫩滑的 Kleftiko 和当地葡萄酒而闻名，保证让您品尝到纯正而丰盛的塞浦路斯风味。',
    subcategory: 'traditional', lat: 34.9118, lng: 33.6379, town: 'larnaca'
  }),
  place({
    id: 'kalamiesrestaurant', category: 'restaurants', image_url: 'images/kalamiesrestaurant.jpg',
    phone: '+357 23 831370', website: 'https://www.kalamiesrestaurant.com/',
    title_en: 'Kalamies Restaurant', desc_en: 'Set on a picturesque sandy bay in Protaras, right next to a charming white-domed chapel, Kalamies is an iconic seaside restaurant. It has been delighting guests since 1976 with its exceptional fresh seafood, Mediterranean flavors, and romantic ambiance by the water\'s edge.',
    title_el: 'Εστιατόριο Καλαμιές', desc_el: 'Πάνω σε έναν γραφικό αμμώδη κόλπο στον Πρωταρά, ακριβώς δίπλα σε ένα λευκό εκκλησάκι, το Καλαμιές είναι ένα εμβληματικό παραθαλάσσιο εστιατόριο. Ενθουσιάζει τους επισκέπτες από το 1976 με τα εξαιρετικά φρέσκα θαλασσινά, τις μεσογειακές γεύσεις και τη ρομαντική ατμόσφαιρα δίπλα στο κύμα.',
    title_ru: 'Ресторан Kalamies', desc_ru: 'Знаменитый прибрежный ресторан Kalamies расположен в живописной песчаной бухте в Протарасе, рядом с очаровательной часовней с белым куполом. С 1976 года он радует гостей свежайшими морепродуктами, средиземноморскими вкусами и романтической атмосферой у самой кромки воды.',
    title_zh: 'Kalamies Restaurant', desc_zh: 'Kalamies 是一家标志性的海滨餐厅，位于普罗塔拉斯风景如画的沙滩海湾，紧邻一座迷人的白顶小教堂。自 1976 年以来，这里一直以其卓越的新鲜海鲜、地中海风味和水边的浪漫氛围而令客人流连忘返。',
    subcategory: 'traditional', lat: 35.0124, lng: 34.0582, town: 'famagusta'
  })
];

const beaches = [
  place({
    id: 'bluelagoon', category: 'beaches', image_url: 'images/bluelagoon.jpg',
    title_en: 'Blue Lagoon', desc_en: 'Located on the stunning Akamas Peninsula, the Blue Lagoon is the crown jewel of Paphos and one of the most breathtaking natural spots in Cyprus. Famous for its crystal-clear, shallow turquoise waters, it offers a magical setting for swimming and snorkeling. Accessible primarily by boat trips departing from the picturesque Latchi harbor or via rugged off-road routes, this pristine bay promises an unforgettable Mediterranean escape.',
    title_el: 'Γαλάζια Λίμνη (Blue Lagoon)', desc_el: 'Βρίσκεται στη μαγευτική χερσόνησο του Ακάμα, η Γαλάζια Λίμνη (Blue Lagoon) είναι το απόλυτο στολίδι της Πάφου και ένα από τα πιο εντυπωσιακά φυσικά σημεία στην Κύπρο. Φημισμένη για τα κρυστάλλινα, ρηχά τιρκουάζ νερά της, προσφέρει ένα μαγευτικό σκηνικό για κολύμπι και εξερεύνηση με μάσκα. Με προσβασιμότητα κυρίως μέσω εκδρομών με σκάφος από το γραφικό λιμανάκι στο Λατσί ή μέσω χωματόδρομων, αυτός ο παρθένος κόλπος υπόσχεται μια αξέχαστη μεσογειακή απόδραση.',
    title_ru: 'Голубая лагуна (Blue Lagoon)', desc_ru: 'Расположенная на потрясающем полуострове Акамас, Голубая лагуна является жемчужиной Пафоса и одним из самых захватывающих природных мест на Кипре. Известная своими кристально чистыми мелководными бирюзовыми водами, она предлагает волшебную обстановку для плавания и сноркелинга. Добраться сюда можно преимущественно на лодках из живописной гавани Лачи или по грунтовым дорогам, и этот первозданный залив обещает незабываемый средиземноморский отдых.',
    title_zh: '蓝礁湖 (Blue Lagoon)', desc_zh: '蓝礁湖 (Blue Lagoon) 位于迷人的阿卡马斯半岛 (Akamas Peninsula)，是帕福斯皇冠上的明珠，也是塞浦路斯最令人叹为观止的自然景点之一。这里以清澈见底的浅海绿松石色海水而闻名，为游泳和浮潜提供了神奇的环境。主要通过从风景如画的拉奇 (Latchi) 港口出发的游船或越野路线到达，这片原始的海湾保证为您带来难忘的地中海度假体验。',
    lat: 35.0772, lng: 32.3164, town: 'paphos'
  })
];

const things = [
  place({
    id: 'avakas', category: 'things', image_url: 'images/avakas.jpg',
    title_en: 'Avakas Gorge Exploration', desc_en: 'Hike through the breathtaking Avakas Gorge, a natural marvel carved by a river over limestone rock. Surrounded by towering vertical cliffs and lush vegetation, it offers an adventurous trail for nature lovers and hikers exploring the wild west coast of Cyprus.',
    title_el: 'Εξερεύνηση Φαραγγιού Αβάκα', desc_el: 'Κάντε πεζοπορία μέσα στο εντυπωσιακό Φαράγγι του Αβάκα, ένα φυσικό αριστούργημα που έχει σμιλευτεί από ποταμό μέσα σε ασβεστολιθικά πετρώματα. Περιτριγυρισμένο από ψηλούς κάθετους βράχους και πλούσια βλάστηση, προσφέρει ένα περιπετειώδες μονοπάτι για τους λάτρεις της φύσης και της πεζοπορίας που εξερευνούν τη δυτική ακτή της Κύπρου.',
    title_ru: 'Ущелье Авакас', desc_ru: 'Совершите пеший поход по захватывающему дух ущелью Авакас, природному чуду, высеченному рекой в известковых скалах. Окруженное высокими отвесными скалами и пышной растительностью, оно предлагает приключенческую тропу для любителей природы и пеших прогулок.',
    title_zh: '阿瓦卡斯峡谷探索', desc_zh: '徒步穿越令人叹为观止的阿瓦卡斯峡谷（Avakas Gorge），这是一处由河流在石灰岩上冲刷而成的自然奇观。四周环绕着高耸的垂直悬崖和郁郁葱葱的植被，为探索塞浦路斯西海岸的自然爱好者和徒步旅行者提供了一条充满冒险的步道。',
    subcategory: 'promenades', lat: 34.9204, lng: 32.3431, town: 'paphos'
  }),
  place({
    id: 'tombsofthekings', category: 'things', image_url: 'images/tombsofthekings.jpg',
    title_en: 'Tombs of the Kings Archaeological Tour', desc_en: 'Step back in time at the Tombs of the Kings, an impressive UNESCO World Heritage site dating back to the 4th century BC. Carved entirely out of solid rock and decorated with Doric pillars, this vast underground necropolis was built for high-ranking officials and aristocracy.',
    title_el: 'Αρχαιολογική Ξενάγηση στους Τάφους των Βασιλέων', desc_el: 'Ταξιδέψτε πίσω στον χρόνο στους Τάφους των Βασιλέων, έναν εντυπωσιακό αρχαιολογικό χώρο παγκόσμιας κληρονομιάς της UNESCO που χρονολογείται από τον 4ο αιώνα π.Χ. Σκαλισμένη εξ ολοκλήρου από συμπαγή βράχο και διακοσμημένη με δωρικούς κίονες, αυτή η τεράστια υπόγεια νεκρόπολη χτίστηκε για υψηλόβαθμους αξιωματούχους και αριστοκράτες.',
    title_ru: 'Царские гробницы', desc_ru: 'Перенеситесь в прошлое в Царских гробницах — впечатляющем объекте Всемирного наследия ЮНЕСКО, восходящем к IV веку до нашей эры. Высеченный целиком из цельной скалы и украшенный дорическими колоннами, этот огромный подземный некрополь был построен для высокопоставленных чиновников.',
    title_zh: '国王陵墓考古之旅', desc_zh: '在国王陵墓（Tombs of the Kings）追溯历史，这是一处可追溯至公元前 4 世纪的宏伟联合国教科文组织世界遗产。这座巨大的地下大墓地完全由坚固的岩石雕刻而成，并饰有多立克式石柱，是为高官显贵和贵族建造的。',
    subcategory: 'culture', lat: 34.7753, lng: 32.4073, town: 'paphos'
  }),
  place({
    id: 'larabay', category: 'things', image_url: 'images/larabay.jpg',
    title_en: 'Lara Bay Turtle Conservation Visit', desc_en: 'Visit the remote and unspoiled Lara Bay on the Akamas Peninsula, a dedicated sanctuary for endangered green and loggerhead sea turtles. Walk along the protected nesting grounds and learn about local conservation efforts while enjoying one of the island\'s most peaceful and untouched shores.',
    title_el: 'Επίσκεψη στον Σταθμό Προστασίας Χελωνών Λάρας', desc_el: 'Επισκεφθείτε την απομακρυσμένη και παρθένα παραλία της Λάρας στη χερσόνησο του Ακάμα, ένα αφοσιωμένο καταφύγιο για τις απειλούμενες πράσινες χελώνες και καρέτα-καρέτα. Περπατήστε κατά μήκος των προστατευμένων περιοχών ωοτοκίας και ενημερωθείτε για τις τοπικές προσπάθειες διατήρησης απολαμβάνοντας μια από τις πιο ήσυχες ακτές.',
    title_ru: 'Заповедник черепах Лара', desc_ru: 'Посетите удаленный и нетронутый пляж Лара на полуострове Акамас, являющийся заповедником для находящихся под угрозой исчезновения морских черепах. Прогуляйтесь по охраняемым местам гнездования и узнайте о местных природоохранных мероприятиях, наслаждаясь одним из самых тихих и нетронутых побережий.',
    title_zh: '拉拉湾海龟保护探访', desc_zh: '参观阿卡马斯半岛偏远且未受破坏的拉拉海滩（Lara Bay），这里是濒危绿海龟和蠵龟的专属保护区。沿着受保护的筑巢地漫步，了解当地的保护工作，同时享受岛上最宁静、原始的海岸线。',
    subcategory: 'sea', lat: 34.9533, lng: 32.3092, town: 'paphos'
  }),
  place({
    id: 'adonisbaths', category: 'things', image_url: 'images/adonisbaths.jpg',
    title_en: 'Adonis Baths Waterfalls Experience', desc_en: 'Discover the mythical Adonis Baths Waterfalls, located in a lush green valley hidden away in the hills of Paphos. Take a refreshing swim in the natural pool surrounded by impressive rock formations, statues of ancient Greek gods, and tranquil waterfalls.',
    title_el: 'Εμπειρία στους Καταρράκτες Λουτρών του Άδωνη', desc_el: 'Ανακαλύψτε τους μυθικούς Καταρράκτες των Λουτρών του Άδωνη, που βρίσκονται σε μια καταπράσινη κοιλάδα κρυμμένη στους λόφους της Πάφου. Κάντε μια δροσερή βουτιά στη φυσική πισίνα που περιβάλλεται από εντυπωσιακούς βραχώδεις σχηματισμούς, αγάλματα αρχαίων Ελλήνων θεών και γαλήνιους καταρράκτες.',
    title_ru: 'Водопады бань Адониса', desc_ru: 'Откройте для себя мифические водопады бань Адониса, расположенные в пышной зеленой долине, спрятанной в холмах Пафоса. Освежитесь в природном бассейне, окруженном впечатляющими скальными образованиями, статуями древнегреческих богов и водопадами.',
    title_zh: '阿多尼斯浴场瀑布体验', desc_zh: '探索神话中的阿多尼斯浴场瀑布（Adonis Baths Waterfalls），它坐落在帕福斯群山中隐蔽的郁郁葱葱的绿色山谷里。在周围环绕着令人印象深刻的岩石地貌、古希腊神灵雕像和宁静瀑布的天然水池中清凉畅游。',
    subcategory: 'promenades', lat: 34.8824, lng: 32.4711, town: 'paphos'
  }),
  place({
    id: 'sunshine', category: 'things', image_url: 'images/troodosjeep.jpg',
    title_en: 'Troodos Mountain Jeep Safari Adventure', desc_en: 'Leave the city behind and head into the rugged terrain of the Troodos Mountains with an off-road jeep safari. Drive through dense pine forests, cross mountain streams, and discover hidden waterfalls and traditional mountain communities.',
    title_el: 'Περιπέτεια Jeep Safari στα Όρη Τροόδους', desc_el: 'Αφήστε πίσω την πόλη και κατευθυνθείτε προς το τραχύ έδαφος των Ορέων Τροόδους με ένα off-road jeep safari. Οδηγήστε μέσα από πυκνά πευκοδάση, διασχίστε ορεινούς χειμάρρους και ανακαλύψτε κρυφούς καταρράκτες και παραδοσιακές ορεινές κοινότητες.',
    title_ru: 'Джип-сафари в горах Троодос', desc_ru: 'Покиньте город и отправляйтесь в суровую местность гор Троодос на джип-сафари по бездорожью. Проедьте через густые сосновые леса, пересеките горные ручьи и откройте для себя скрытые водопады и традиционные горные общины.',
    title_zh: '特罗多斯山脉吉普探险', desc_zh: '离开城市，乘坐越野吉普车探险，深入特罗多斯山脉（Troodos Mountains）崎岖的地形。穿梭于茂密的松林，跨越山间溪流，探索隐藏的瀑布和传统的山地社区。',
    subcategory: 'safari', lat: 34.9241, lng: 32.8797, town: 'limassol'
  }),
  place({
    id: 'wine', category: 'things', image_url: 'images/omodos.jpg',
    title_en: 'Omodos Village Cultural Walk', desc_en: 'Explore the picturesque wine-producing village of Omodos, nestled in the foothills of Troodos. Wander through charming cobblestone streets, visit the historic Timios Stavros Monastery, and sample authentic local wines in traditional family-run cellars.',
    title_el: 'Πολιτιστικός Περίπατος στο Χωριό Όμοδος', desc_el: 'Εξερευνήστε το γραφικό οινοπαραγωγικό χωριό Όμοδος, χτισμένο στους πρόποδες του Τροόδους. Περιπλανηθείτε σε γοητευτικά πλακόστρωτα σοκάκια, επισκεφθείτε το ιστορικό Μοναστήρι του Τιμίου Σταυρού και δοκιμάστε αυθεντικά τοπικά κρασιά σε παραδοσιακές οικογενειακές κάβες.',
    title_ru: 'Прогулка по деревне Омодос', desc_ru: 'Исследуйте живописную винодельческую деревню Омодос, расположенную у подножия Троодоса. Прогуляйтесь по очаровательным мощеным улочкам, посетите исторический монастырь Тимиос Ставрос и отведайте аутентичные местные вина в традиционных погребах.',
    title_zh: '奥莫多斯村庄文化漫步', desc_zh: '探索坐落在特罗多斯山麓风景如画的产酒村奥莫多斯（Omodos）。漫步于迷人的鹅卵石街道，参观历史悠久的提米奥斯·斯塔夫罗斯修道院（Timios Stavros Monastery），并在传统的家庭酒窖中品尝地道的当地葡萄酒。',
    subcategory: 'wine', lat: 34.8483, lng: 32.8081, town: 'limassol'
  }),
  place({
    id: 'kolossi', category: 'things', image_url: 'images/kolossi.jpg',
    title_en: 'Kolossi Medieval Castle Visit', desc_en: 'Discover the fascinating history of the Knights Templar at Kolossi Castle, a remarkable military architecture monument just outside Limassol. Climb to the roof for panoramic views of the surrounding vineyards and learn about the origins of the famous Commandaria wine.',
    title_el: 'Επίσκεψη στο Μεσαιωνικό Κάστρο Κολλοσίου', desc_el: 'Ανακαλύψτε τη συναρπαστική ιστορία των Ναϊτών Ιπποτών στο Κάστρο Κολλοσίου, ένα αξιοσημείωτο μνημείο στρατιωτικής αρχιτεκτονικής λίγο έξω από τη Λεμεσό. Ανεβείτε στην ταράτσα για πανοραμική θέα στους γύρω αμπελώνες και μάθετε για τις ρίζες του διάσημου κρασιού Κουμανταρία.',
    title_ru: 'Средневековый замок Колосси', desc_ru: 'Откройте для себя захватывающую историю тамплиеров в замке Колосси, замечательном памятнике военной архитектуры недалеко от Лимассола. Поднимитесь на крышу, чтобы насладиться панорамным видом на виноградники и узнать об истоках знаменитого вина Коммандария.',
    title_zh: '科洛西中世纪城堡参观', desc_zh: '在位于利马索尔郊外的非凡军事建筑古迹——科洛西城堡（Kolossi Castle）探索圣殿骑士团迷人的历史。登上屋顶欣赏周围葡萄园的全景，并了解著名康曼达里亚酒的起源。',
    subcategory: 'culture', lat: 34.6653, lng: 32.9341, town: 'limassol'
  }),
  place({
    id: 'caledonia', category: 'things', image_url: 'images/caledonia.jpg',
    title_en: 'Caledonia Waterfalls Nature Trail', desc_en: 'Hike along the tranquil Caledonia Nature Trail near Platres village, leading through a dense forest full of rich flora. Follow the trickling stream up to the stunning Caledonia Waterfall, one of the most picturesque and refreshing natural escapes in the Troodos region.',
    title_el: 'Μονοπάτι Φύσης Καταρράκτη Καληδονιών', desc_el: 'Κάντε πεζοπορία κατά μήκος του γαλήνιου μονοπατιού της φύσης Καληδονιών κοντά στο χωριό Πλάτρες, το οποίο διασχίζει ένα πυκνό δάσος γεμάτο πλούσια χλωρίδα. Ακολουθήστε το ρυάκι μέχρι τον εκπληκτικό καταρράκτη των Καληδονιών, μια από τις πιο γραφικές φυσικές αποδράσεις στο Τροόδους.',
    title_ru: 'Тропа водопада Каледония', desc_ru: 'Совершите поход по тихой природной тропе Каледония возле деревни Платрес, пролегающей через густой лес. Следуйте вдоль ручья до потрясающего водопада Каледония, одного из самых живописных и освежающих уголков природы в регионе Троодос.',
    title_zh: '卡莱多尼亚瀑布自然步道', desc_zh: '沿着普拉特雷斯村（Platres）附近宁静的卡莱多尼亚自然步道徒步旅行，穿过郁郁葱葱的繁茂森林。沿着涓涓细流一直走到令人叹为观止的卡莱多尼亚瀑布，这是特罗多斯地区最风景优美、最令人神清气爽的自然胜地之一。',
    subcategory: 'promenades', lat: 34.8934, lng: 32.8632, town: 'limassol'
  }),
  place({
    id: 'lefkara', category: 'things', image_url: 'images/lefkara.jpg',
    title_en: 'Lefkara Village Handicraft & Silver Tour', desc_en: 'Wander through the charming stone-built village of Lefkara, famous worldwide for its traditional lace embroidery (Lefkaritika) and intricate handmade silver crafts. Walk down the picturesque narrow alleys and meet local artisans preserving centuries-old cultural traditions.',
    title_el: 'Περιήγηση Χειροτεχνίας & Ασημικών στα Λεύκαρα', desc_el: 'Περιπλανηθείτε στο γοητευτικό πετρόχτιστο χωριό των Λευκάρων, παγκοσμίως διάσημο για τα παραδοσιακά κεντήματα (Λευκαρίτικα) και την περίτεχνη αργυροχοΐα. Περπατήστε στα γραφικά στενά σοκάκια και γνωρίστε ντόπιους τεχνίτες που διατηρούν αιώνιες πολιτιστικές παραδόσεις.',
    title_ru: 'Ремесла и серебро Лефкары', desc_ru: 'Прогуляйтесь по очаровательной каменной деревне Лефкара, всемирно известной своим традиционным кружевом (лефкаритика) и сложным серебряным ремеслом. Пройдитесь по живописным узким улочкам и познакомьтесь с местными мастерами, сохраняющими вековые традиции.',
    title_zh: '莱夫卡拉手工艺与银器之旅', desc_zh: '漫步于迷人的石头村庄莱夫卡拉（Lefkara），这里以其传统的蕾丝刺绣（Lefkaritika）和精美的手工银器工艺闻名于世。走过风景如画的狭窄小巷，结识传承数百年文化传统的当地工匠。',
    subcategory: 'culture', lat: 34.8672, lng: 33.3074, town: 'larnaca'
  }),
  place({
    id: 'choirokoitia', category: 'things', image_url: 'images/choirokoitia.jpg',
    title_en: 'Choirokoitia Neolithic Settlement Tour', desc_en: 'Explore the Choirokoitia Neolithic Settlement, an exceptionally well-preserved prehistoric site and UNESCO World Heritage monument. Step inside the reconstructed circular stone houses to experience how early human communities lived in Cyprus over 9,000 years ago.',
    title_el: 'Ξενάγηση στον Νεολιθικό Οικισμό Χοιροκοιτίας', desc_el: 'Εξερευνήστε τον Νεολιθικό Οικισμό της Χοιροκοιτίας, έναν εξαιρετικά διατηρημένο προϊστορικό χώρο και μνημείο παγκόσμιας κληρονομιάς της UNESCO. Μπείτε μέσα στα ανασυσταθέντα κυκλικά πέτρινα σπίτια για να ζήσετε πώς ζούσαν οι πρώτες ανθρώπινες κοινότητες στην Κύπρο πριν από 9.000 χρόνια.',
    title_ru: 'Неолитическое поселение Хирокития', desc_ru: 'Исследуйте неолитическое поселение Хирокития, прекрасно сохранившийся доисторический памятник и объект Всемирного наследия ЮНЕСКО. Загляните внутрь реконструированных круглых каменных домов, чтобы узнать, как жили люди на Кипре 9 000 лет назад.',
    title_zh: '希罗科蒂亚新石器聚落参观', desc_zh: '探索希罗科蒂亚（Choirokoitia）新石器时代定居点，这是一处保存极其完好的史前遗址和联合国教科文组织世界遗产。走进重建的圆形石屋，体验 9000 多年前早期人类社群在塞浦路斯的生活方式。',
    subcategory: 'culture', lat: 34.7967, lng: 33.3436, town: 'larnaca'
  }),
  place({
    id: 'camelpark', category: 'things', image_url: 'images/camelpark.jpg',
    title_en: 'Camel Park Mazotos Family Day', desc_en: 'Enjoy a fun-filled family day out at the Camel Park in Mazotos, located just a short drive from Larnaca. Ride gentle camels, feed various farm animals, enjoy the swimming pool, and explore the relaxing recreational areas designed for visitors of all ages.',
    title_el: 'Οικογενειακή Μέρα στο Camel Park Μαζωτού', desc_el: 'Απολαύστε μια διασκεδαστική οικογενειακή μέρα στο Camel Park στο Μαζωτό, σε κοντινή απόσταση οδικώς από τη Λάρνακα. Κάντε βόλτα με ήρεμες καμήλες, ταΐστε διάφορα ζώα φάρμας, απολαύστε την πισίνα και εξερευνήστε τους χώρους αναψυχής για επισκέπτες όλων των ηλικιών.',
    title_ru: 'Парк верблюдов в Мазотосе', desc_ru: 'Проведите веселый семейный день в Парке верблюдов в Мазотосе, расположенном всего в нескольких минутах езды от Ларнаки. Покатитесь на спокойных верблюдах, покормите животных, искупайтесь в бассейне и отдохните в зонах отдыха.',
    title_zh: '马佐托斯骆驼公园家庭日', desc_zh: '在距离拉纳卡仅车程之遥的马佐托斯（Mazotos）骆驼公园享受充满乐趣的家庭日。骑着温顺的骆驼，喂养各种农场动物，享受游泳池，并探索专为所有年龄段游客设计的放松休闲区。',
    subcategory: 'promenades', lat: 34.8024, lng: 33.4906, town: 'larnaca'
  }),
  place({
    id: 'angeloktisti', category: 'things', image_url: 'images/angeloktisti.jpg',
    title_en: 'Angeloktisti Church Architectural Tour', desc_en: 'Visit the remarkable 11th-century Church of Panagia Angeloktisti in Kiti village, famous worldwide for its rare 6th-century Byzantine mosaic of the Virgin Mary. Admire its unique early Christian architecture and priceless historical religious art.',
    title_el: 'Αρχιτεκτονική Περιήγηση στην Εκκλησία Παναγίας Αγγελόκτιστης', desc_el: 'Επισκεφθείτε την αξιοσημείωτη Εκκλησία της Παναγίας Αγγελόκτιστης του 11ου αιώνα στο χωριό Κίτι, παγκοσμίως διάσημη για το σπάνιο βυζαντινό ψηφιδωτό της Παναγίας του 6ου αιώνα. Θαυμάστε τη μοναδική πρωτοχριστιανική αρχιτεκτονική και την ανεκτίμητη θρησκευτική τέχνη.',
    title_ru: 'Церковь Панагия Ангелоктисти', desc_ru: 'Посетите замечательную церковь Панагия Ангелоктисти XI века в деревне Кити, всемирно известную своей редкой византийской мозаикой Девы Марии VI века. Полюбуйтесь уникальной архитектурой и бесценным искусством.',
    title_zh: '安格洛克蒂斯蒂教堂建筑之旅', desc_zh: '参观基蒂村（Kiti）建于 11 世纪卓越的帕纳吉亚·安格洛克蒂斯蒂教堂（Panagia Angeloktisti Church），该教堂以其罕见的 6 世纪圣母拜占庭马赛克而闻名于世。欣赏其独特的早期基督教建筑和无价的历史宗教艺术。',
    subcategory: 'culture', lat: 34.8473, lng: 33.5718, town: 'larnaca'
  }),
  place({
    id: 'thalassa', category: 'things', image_url: 'images/thalassa.jpg',
    title_en: 'Thalassa Municipal Museum Maritime Tour', desc_en: 'Immerse yourself in the maritime history of Cyprus at the Thalassa Museum in Ayia Napa. Explore fascinating exhibits, including a life-size replica of an ancient Greek merchant ship that sank off the coast, alongside rich marine fossils and historical artifacts.',
    title_el: 'Ναυτική Περιήγηση στο Δημοτικό Μουσείο Θάλασσα', desc_el: 'Βυθιστείτε στη ναυτική ιστορία της Κύπρου στο Μουσείο Θάλασσα στην Αγία Νάπα. Εξερευνήστε συναρπαστικά εκθέματα, συμπεριλαμβανομένου ενός αντιγράφου σε φυσικό μέγεθος ενός αρχαίου ελληνικού εμπορικού πλοίου που ναυάγησε στις ακτές, καθώς και πλούσια θαλάσσια απολιθώματα.',
    title_ru: 'Музей Таласса', desc_ru: 'Погрузитесь в морскую историю Кипра в музее Таласса в Айя-Напе. Исследуйте увлекательные экспонаты, включая полноразмерную копию древнегреческого торгового судна, затонувшего у берегов, а также морские окаменелости.',
    title_zh: '塔拉萨海事博物馆参观', desc_zh: '在圣纳帕的塔拉萨博物馆（Thalassa Museum）沉浸在塞浦路斯的航海历史中。探索引人入胜的展品，包括在海岸附近沉没的古希腊商船的实物大小复制品，以及丰富的海洋化石。',
    subcategory: 'culture', lat: 34.9877, lng: 33.9991, town: 'famagusta'
  }),
  place({
    id: 'sculpturepark', category: 'things', image_url: 'images/sculpturepark.jpg',
    title_en: 'Ayia Napa Sculpture & Cactus Park Walk', desc_en: 'Stroll through the unique open-air Ayia Napa Sculpture Park and the adjacent Cactus Park, situated on a coastal hill. Discover impressive contemporary artworks created by international sculptors contrasted against a massive collection of desert plants and sweeping sea views.',
    title_el: 'Βόλτα στα Πάρκα Γλυπτικής και Κάκτων Αγίας Νάπας', desc_el: 'Κάντε έναν περίπατο στο μοναδικό υπαίθριο Πάρκο Γλυπτικής της Αγίας Νάπας και στο διπλανό Πάρκο Κάκτων, χτισμένα σε παραθαλάσσιο λόφο. Ανακαλύψτε εντυπωσιακά σύγχρονα έργα τέχνης από διεθνείς γλύπτες σε αντίθεση με μια τεράστια συλλογή φυτών ερήμου και πανοραμική θέα στη θάλασσα.',
    title_ru: 'Парк скульптур и кактусов', desc_ru: 'Прогуляйтесь по уникальному парку скульптур под открытым небом в Айя-Напе и соседнему парку кактусов, расположенным на прибрежном холме. Откройте для себя современные произведения искусства и огромную коллекцию пустынных растений.',
    title_zh: '圣纳帕雕塑与仙人掌公园漫步', desc_zh: '漫步于独具特色的露天圣纳帕雕塑公园和毗邻的仙人掌公园，它们坐落在一座海滨小山上。探索由国际雕塑家创作的令人印象深刻的当代艺术品，并与庞大的沙漠植物收藏和壮丽的海景交相辉映。',
    subcategory: 'promenades', lat: 34.9872, lng: 34.0014, town: 'famagusta'
  }),
  place({
    id: 'liopetri-river', category: 'things', image_url: 'images/liopetri.jpg',
    title_en: 'Liopetri River & Fishing Shelter Visit', desc_en: 'Visit the peaceful and picturesque Liopetri River, a natural estuary often referred to as a hidden paradise. Admire the traditional wooden fishermen\'s shacks, watch local boats glide across calm waters, and enjoy a quiet escape away from busy tourist spots.',
    title_el: 'Επίσκεψη στον Ποταμό & Ψαρολίμανο Λιοπετρίου', desc_el: 'Επισκεφθείτε τον γαλήνιο και γραφικό Ποταμό Λιοπετρίου, ένα φυσικό εκβολικό τοπίο που συχνά αποκαλείται κρυφός παράδεισος. Θαυμάστε τις παραδοσιακές ξύλινες καλύβες ψαράδων, παρακολουθήστε τις βάρκες να γλιστρούν στα ήρεμα νερά και απολαύστε μια ήσυχη απόδραση μακριά από τα πολυσύχναστα τουριστικά σημεία.',
    title_ru: 'Река Лиопетри', desc_ru: 'Посетите мирную и живописную реку Лиопетри, естественный эстуарий, который часто называют скрытым раем. Полюбуйтесь традиционными деревянными рыбацкими хижинами, понаблюдайте за лодками на спокойной воде.',
    title_zh: '利奥佩特里河与渔港探访', desc_zh: '参观宁静优美的利奥佩特里河（Liopetri River），这是一个常被称为隐蔽天堂的天然入海口。欣赏传统的木制渔夫小屋，看着当地的小船在平静的水面上滑行，享受远离繁忙旅游景点的宁静度假。',
    subcategory: 'promenades', lat: 35.0071, lng: 33.8927, town: 'famagusta'
  }),
  place({
    id: 'deryneia', category: 'things', image_url: 'images/deryneia.jpg',
    title_en: 'Deryneia Cultural & Viewpoint Stop', desc_en: 'Discover the cultural heritage of the Famagusta region in Deryneia. Visit traditional local craft workshops and stop by the special observatory viewpoint to learn about the history of the area and view the fenced ghost town of Varosha from a distance.',
    title_el: 'Σταθμός Πολιτισμού & Θέασης στη Δερύνεια', desc_el: 'Ανακαλύψτε την πολιτιστική κληρονομιά της περιοχής Αμμοχώστου στη Δερύνεια. Επισκεφθείτε παραδοσιακά τοπικά εργαστήρια χειροτεχνίας και σταθείτε στο ειδικό σημείο παρατήρησης για να μάθετε την ιστορία της περιοχής και να δείτε από μακριά την περιφραγμένη πόλη-φάντασμα των Βαρωσίων.',
    title_ru: 'Смотровая площадка Деринеи', desc_ru: 'Откройте для себя культурное наследие региона Фамагуста в Деринее. Посетите традиционные мастерские и остановитесь у специальной смотровой площадки, чтобы узнать историю региона и увидеть огороженный город-призрак Вароша.',
    title_zh: '德里尼亚文化与观景停留', desc_zh: '探索德里尼亚（Deryneia）法马古斯塔地区的文化遗产。参观传统的当地手工艺作坊，并在特殊的观景台驻足，了解该地区的历史，并从远处眺望被围起来的鬼城瓦罗莎（Varosha）。',
    subcategory: 'culture', lat: 35.0758, lng: 33.9608, town: 'famagusta'
  }),
  place({
    id: 'leventis', category: 'things', image_url: 'images/leventis.jpg',
    title_en: 'Leventis Municipal Museum Cultural Walk', desc_en: 'Explore the Leventis Municipal Museum of Nicosia, dedicated entirely to the rich history and social life of the capital from ancient times to the present day. Located in the old town, it offers fascinating insights into the city\'s unique multicultural heritage.',
    title_el: 'Πολιτιστικός Περίπατος στο Δημοτικό Μουσείο Λεβέντη', desc_el: 'Εξερευνήστε το Λεβέντειο Δημοτικό Μουσείο Λευκωσίας, αφιερωμένο εξ ολοκλήρου στην πλούσια ιστορία και την κοινωνική ζωή της πρωτεύουσας από την αρχαιότητα έως σήμερα. Βρίσκεται στην παλιά πόλη και προσφέρει συναρπαστικές ματιές στη μοναδική πολυπολιτισμική κληρονομιά της πόλης.',
    title_ru: 'Муниципальный музей Левентис', desc_ru: 'Исследуйте муниципальный музей Левентис в Никосии, посвященный богатой истории и социальной жизни столицы с древнейших времен до наших дней. Расположенный в старом городе, он предлагает увлекательное знакомство с наследием.',
    title_zh: '莱文蒂斯市博物馆文化漫步', desc_zh: '探索尼科西亚莱文蒂斯市博物馆（Leventis Municipal Museum），该博物馆完全致力于展示首都从古代到今天丰富的历史和社会生活。它位于老城区，让您深入了解这座城市独特的多元文化遗产。',
    subcategory: 'culture', lat: 35.1719, lng: 33.3634, town: 'nicosia'
  }),
  place({
    id: 'buyukhan', category: 'things', image_url: 'images/buyukhan.jpg',
    title_en: 'Buyuk Han Ottoman Architecture Tour', desc_en: 'Step inside the magnificent Buyuk Han, the largest and most impressive Ottoman caravanserai in Cyprus, built in 1572. Wander through its historic arcaded courtyard, which now hosts thriving artisan shops, art galleries, and cozy traditional coffee houses.',
    title_el: 'Περιήγηση στην Οθωμανική Αρχιτεκτονική του Μπουγιούκ Χαν', desc_el: 'Μπείτε μέσα στο μεγαλοπρεπές Μπουγιούκ Χαν, το μεγαλύτερο και πιο εντυπωσιακό οθωμανικό χάνι στην Κύπρο, που χτίστηκε το 1572. Περιπλανηθείτε στην ιστορική εσωτερική αυλή του, η οποία φιλοξενεί τώρα ακμάζοντα εργαστήρια τεχνιτών, γκαλερί τέχνης και ζεστά παραδοσιακά καφενεία.',
    title_ru: 'Буюк-Хан', desc_ru: 'Зайдите в великолепный Буюк-Хан, самый большой и впечатляющий османский караван-сарай на Кипре, построенный в 1572 году. Прогуляйтесь по его историческому внутреннему двору, где теперь работают ремесленные мастерские и кафе.',
    title_zh: '布于克汗奥斯曼建筑之旅', desc_zh: '走进宏伟的布于克汗（Buyuk Han），这是塞浦路斯最大、最令人印象深刻的奥斯曼帝国商队旅馆，建于 1572 年。漫步于其历史悠久的拱形庭院中，这里现在拥有繁荣的手工艺品店、艺术画廊和温馨的传统咖啡馆。',
    subcategory: 'culture', lat: 35.1765, lng: 33.3617, town: 'nicosia'
  }),
  place({
    id: 'museum-nic', category: 'things', image_url: 'images/cyprusmuseum.jpg',
    title_en: 'Cyprus Museum Archaeological Exploration', desc_en: 'Discover an unmatched collection of antiquities at the Cyprus Museum in Nicosia, the oldest and largest archaeological museum on the island. Marvel at priceless artifacts spanning from the Neolithic period through the Bronze Age and the Roman era.',
    title_el: 'Αρχαιολογική Εξερεύνηση στο Κυπριακό Μουσείο', desc_el: 'Ανακαλύψτε μια ασύγκριτη συλλογή αρχαιοτήτων στο Κυπριακό Μουσείο στη Λευκωσία, το παλαιότερο και μεγαλύτερο αρχαιολογικό μουσείο του νησιού. Θαυμάστε ανεκτίμητα αντικείμενα που εκτείνονται από τη νεολιθική εποχή, την εποχή του Χαλκού έως τη ρωμαϊκή περίοδο.',
    title_ru: 'Кипрский музей', desc_ru: 'Откройте для себя непревзойденную коллекцию древностей в Кипрском музее в Никосии, старейшем и крупнейшем археологическом музее острова. Полюбуйтесь бесценными артефактами от неолита до римской эпохи.',
    title_zh: '塞浦路斯博物馆考古探索', desc_zh: '在尼科西亚的塞浦路斯博物馆（Cyprus Museum）探索无与伦比的古代文物收藏，这是岛上最古老、最大的考古博物馆。惊叹于从新石器时代、青铜时代到罗马时代的无价文物。',
    subcategory: 'culture', lat: 35.1714, lng: 33.3554, town: 'nicosia'
  }),
  place({
    id: 'nicosia-walk', category: 'things', image_url: 'images/dodekapente.jpg',
    title_en: 'Dodeka Pente Local Food & Art Quarter Walk', desc_en: 'Stroll through the charming old neighborhoods of Nicosia near the Chrysaliniotissa area, known for its creative community, restored traditional houses, hidden local art studios, and authentic neighborhood tavernas offering a true taste of capital life.',
    title_el: 'Βόλτα στη Γειτονιά Τέχνης & Γεύσης', desc_el: 'Κάντε έναν περίπατο στις γοητευτικές παλιές γειτονιές της Λευκωσίας κοντά στην περιοχή της Χρυσαλινιώτισσας, γνωστή για τη δημιουργική της κοινότητα, τα αναπαλαιωμένα παραδοσιακά σπίτια, τα κρυμμένα καλλιτεχνικά στούντιο και τις αυθεντικές ταβέρνες.',
    title_ru: 'Квартал еды и искусства', desc_ru: 'Прогуляйтесь по очаровательным старым кварталам Никосии возле района Хрисалиниотисса, известного своим творческим сообществом, отреставрированными домами, художественными студиями и аутентичными тавернами.',
    title_zh: '美食与艺术街区漫步', desc_zh: '漫步于尼科西亚 Chrysaliniotissa 地区附近迷人的老街区，这里以其充满创意的社区、修复的传统房屋、隐蔽的当地艺术工作室和提供地道首都生活风味的传统小酒馆而闻名。',
    subcategory: 'promenades', lat: 35.1743, lng: 33.3686, town: 'nicosia'
  })
];

function upsert(file, items) {
  const p = join(root, file);
  const current = existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : [];
  const byId = new Map(current.map((item) => [item.id, item]));
  for (const item of items) byId.set(item.id, item);
  const next = [...byId.values()];
  writeFileSync(p, JSON.stringify(next, null, 2) + '\n');
  console.log('wrote', file, next.length);
}

upsert('extra-restaurants.json', restaurants);
upsert('extra-beaches.json', beaches);
writeFileSync(join(root, 'extra-things.json'), JSON.stringify(things, null, 2) + '\n');
console.log('wrote extra-things.json', things.length);

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': ua }, redirect: 'follow' });
  if (!res.ok) throw new Error(res.status + ' ' + url);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000) throw new Error('tiny ' + buf.length + ' ' + url);
  writeFileSync(dest, buf);
  return buf.length;
}

async function commons(fileName) {
  const api = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' + encodeURIComponent('File:' + fileName) + '&prop=imageinfo&iiprop=url&iiurlwidth=1600&format=json';
  const res = await fetch(api, { headers: { 'User-Agent': ua } });
  const data = await res.json();
  const page = Object.values(data.query.pages)[0];
  const url = page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url;
  if (!url) throw new Error('no commons url ' + fileName);
  return url;
}

const commonsMap = {
  bluelagoon: ['Blue Lagoon Akamas.jpg', 'Akamas Blue Lagoon.jpg', 'Blue Lagoon Cyprus.jpg'],
  avakas: ['Avakas Gorge.jpg', 'Avakas gorge Cyprus.jpg'],
  tombsofthekings: ['Tombs of the Kings Paphos.jpg', 'Paphos Tombs of the Kings.jpg'],
  larabay: ['Lara Bay Cyprus.jpg', 'Lara Beach Akamas.jpg'],
  adonisbaths: ['Adonis Baths.jpg', 'Adonis baths Paphos.jpg'],
  troodosjeep: ['Troodos Mountains Cyprus.jpg', 'Troodos forest.jpg'],
  omodos: ['Omodos village.jpg', 'Omodos Cyprus.jpg'],
  kolossi: ['Kolossi Castle.jpg', 'Kolossi castle Cyprus.jpg'],
  caledonia: ['Caledonia Waterfall.jpg', 'Caledonia falls Cyprus.jpg'],
  lefkara: ['Lefkara village.jpg', 'Pano Lefkara.jpg'],
  choirokoitia: ['Choirokoitia.jpg', 'Khirokitia.jpg'],
  camelpark: ['Camel Cyprus.jpg'],
  angeloktisti: ['Panagia Angeloktisti.jpg', 'Angeloktisti Kiti.jpg'],
  thalassa: ['Ayia Napa harbour.jpg', 'Ayia Napa marina.jpg'],
  sculpturepark: ['Ayia Napa Sculpture Park.jpg', 'Cape Greco view.jpg'],
  liopetri: ['Liopetri river.jpg', 'Potamos Liopetriou.jpg'],
  deryneia: ['Deryneia.jpg', 'Famagusta view.jpg'],
  leventis: ['Nicosia old town street.jpg', 'Ledra street Nicosia.jpg'],
  buyukhan: ['Büyük Han.jpg', 'Buyuk Han Nicosia.jpg'],
  cyprusmuseum: ['Cyprus Museum Nicosia.jpg', 'Cyprus Archaeological Museum.jpg'],
  dodekapente: ['Nicosia old town.jpg', 'Chrysaliniotissa.jpg'],
  maqamalsultan: ['Finikoudes Larnaca.jpg', 'Phinikoudes.jpg'],
  militzis: ['Larnaca seafront.jpg', 'Larnaca promenade.jpg'],
  kalamiesrestaurant: ['Protaras chapel.jpg', 'Agios Nikolaos Protaras.jpg'],
  glasshouse: ['Nissi Bay.jpg', 'Ayia Napa beach.jpg'],
  epsilon: ['Limassol Marina.jpg', 'Limassol marina night.jpg'],
  dionysusmansion: ['Limassol old town.jpg'],
  tocayo: ['Nicosia nightlife.jpg', 'Onasagorou Street.jpg'],
  pyxida: ['Nicosia restaurant street.jpg', 'Nicosia old town cafe.jpg']
};

async function ogImage(pageUrl) {
  const res = await fetch(pageUrl, { headers: { 'User-Agent': ua, Accept: 'text/html' }, redirect: 'follow' });
  if (!res.ok) throw new Error('og ' + res.status);
  const html = await res.text();
  const m = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i) || html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (!m) throw new Error('no og ' + pageUrl);
  return m[1];
}

const ogPages = {
  tocayo: 'https://tocayo.com.cy/',
  dionysusmansion: 'https://dionysusmansion.com/',
  maqamalsultan: 'https://www.maqamalsultan.com/',
  pyxida: 'https://www.pyxidafishtavern.com/',
  militzis: 'https://militzis.com/'
};

const allItems = [...restaurants, ...beaches, ...things];
for (const item of allItems) {
  const dest = join(root, item.image_url);
  if (existsSync(dest) && readFileSync(dest).length > 20000) {
    console.log('have', item.image_url);
    continue;
  }
  let ok = false;
  if (ogPages[item.id]) {
    try {
      const url = await ogImage(ogPages[item.id]);
      const n = await download(url, dest);
      console.log('OG', item.id, n);
      ok = true;
    } catch (err) {
      console.log('OG fail', item.id, err.message);
    }
  }
  if (!ok) {
    for (const fileName of commonsMap[item.id] || []) {
      try {
        const url = await commons(fileName);
        const n = await download(url, dest);
        console.log('COMMONS', item.id, fileName, n);
        ok = true;
        break;
      } catch (err) {
        console.log('COMMONS fail', item.id, fileName, err.message);
      }
    }
  }
  if (!ok) console.log('MISSING IMAGE', item.id);
}

function dollar(id, suffix, value) {
  return `$${id}${suffix}$${value}$${id}${suffix}$`;
}
function sqlStr(value) {
  if (value == null || value === '') return 'null';
  return `'${String(value).replace(/'/g, "''")}'`;
}

const sqlItems = [...restaurants, ...beaches, ...things];
const rows = sqlItems.map((h) => `(
  '${h.id}',
  '${h.category}',
  ${sqlStr(h.image_url)},
  ${sqlStr(h.phone)},
  ${sqlStr(h.website)},
  ${sqlStr(h.map_link)},
  ${dollar(h.id, 'en_t', h.title_en)},
  ${dollar(h.id, 'en', h.desc_en)},
  ${dollar(h.id, 'el_t', h.title_el)},
  ${dollar(h.id, 'el', h.desc_el)},
  ${dollar(h.id, 'ru_t', h.title_ru)},
  ${dollar(h.id, 'ru', h.desc_ru)},
  ${dollar(h.id, 'zh_t', h.title_zh)},
  ${dollar(h.id, 'zh', h.desc_zh)},
  ${sqlStr(h.subcategory)},
  false,
  ${h.lat},
  ${h.lng},
  ${sqlStr(h.town)}
)`).join(',\n');

writeFileSync(join(root, 'tools', 'insert-new-listings.sql'), `insert into public.places (
  id, category, image_url, phone, website, map_link,
  title_en, desc_en, title_el, desc_el, title_ru, desc_ru, title_zh, desc_zh,
  subcategory, is_best_of_month, lat, lng, town
) values
${rows}
on conflict (id) do update set
  category = excluded.category,
  image_url = excluded.image_url,
  phone = excluded.phone,
  website = excluded.website,
  map_link = excluded.map_link,
  title_en = excluded.title_en,
  desc_en = excluded.desc_en,
  title_el = excluded.title_el,
  desc_el = excluded.desc_el,
  title_ru = excluded.title_ru,
  desc_ru = excluded.desc_ru,
  title_zh = excluded.title_zh,
  desc_zh = excluded.desc_zh,
  subcategory = excluded.subcategory,
  lat = excluded.lat,
  lng = excluded.lng,
  town = excluded.town;
`);
console.log('SQL', sqlItems.length);
