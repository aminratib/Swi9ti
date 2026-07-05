/* ===========================================================
   CASABTATA — app.js
   =========================================================== */

/* ---------- 0. PRELOADER ---------- */
(function initPreloader() {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  const bar = document.getElementById('preloaderBar');
  document.body.style.overflow = 'hidden';

  const DURATION = 3000; // ⬅️ 3 ثواني — ثابتة، حتى لو الصفحة تحمّلت بزربة

  bar.style.transition = `width ${DURATION}ms linear`;
  requestAnimationFrame(() => { bar.style.width = '100%'; });

  setTimeout(() => {
    pre.style.opacity = '0';
    pre.style.pointerEvents = 'none';
    setTimeout(() => {
      pre.remove();
      document.body.style.overflow = '';
    }, 500); // مدة الـ fade out
  }, DURATION);
})();

/* ---------- 1. DONNÉES PRODUITS ---------- */
// Ces valeurs servent de "secours" (affichage instantané au chargement + si Google Sheet
// est injoignable). Une fois le Sheet configuré (voir section 1bis), les prix affichés
// sont ceux du Sheet.
let PRODUCTS = [
  { id: 'p1',  name: 'طماطم كبيرة',      darija: 'طماطم كبيرة',   emoji: '🍅', category: 'legumes', price: 0,  unit: 'كيلو', query: 'tomato',            promo: true  },
  { id: 'p2',  name: 'بطاطا',              darija: 'بطاطا',         emoji: '🥔', category: 'racines', price: 0,  unit: 'كيلو', query: 'potato',            promo: false },
  { id: 'p3',  name: 'بصل صفر',            darija: 'بصل صفر',       emoji: '🧅', category: 'racines', price: 0,  unit: 'كيلو', query: 'onion',             promo: false },
  { id: 'p4',  name: 'جزر',               darija: 'جزر',           emoji: '🥕', category: 'racines', price: 0,  unit: 'كيلو', query: 'carrot',            promo: false },
  { id: 'p5',  name: 'كوسة',              darija: 'كوسة',          emoji: '🥒', category: 'legumes', price: 0,  unit: 'كيلو', query: 'zucchini',          promo: false },
  { id: 'p6',  name: 'فلفل ملون',         darija: 'فلفل ملون',     emoji: '🫑', category: 'legumes', price: 0,  unit: 'كيلو', query: 'bell pepper',       promo: true  },
  { id: 'p7',  name: 'خيار',              darija: 'خيار',          emoji: '🥒', category: 'legumes', price: 0,  unit: 'كيلو', query: 'cucumber',          promo: false },
  { id: 'p8',  name: 'دنجال',             darija: 'دنجال',         emoji: '🍆', category: 'legumes', price: 0,  unit: 'كيلو', query: 'eggplant',          promo: false },
  { id: 'p9',  name: 'سبانخ',             darija: 'سبانخ',         emoji: '🥬', category: 'feuilles', price: 0, unit: 'بوكاية', query: 'spinach',          promo: false },
  { id: 'p10', name: 'معدنوس',            darija: 'معدنوس',        emoji: '🌿', category: 'herbes',  price: 0,  unit: 'بوكاية', query: 'parsley',          promo: false },
  { id: 'p11', name: 'قزبر',              darija: 'قزبر',          emoji: '🌿', category: 'herbes',  price: 0,  unit: 'بوكاية', query: 'coriander leaves', promo: false },
  { id: 'p12', name: 'ليمون',             darija: 'ليمون',         emoji: '🍋', category: 'agrumes', price: 0,  unit: 'كيلو', query: 'lemon',             promo: true  },
  { id: 'p13', name: 'تومة',              darija: 'تومة',          emoji: '🧄', category: 'racines', price: 0, unit: 'كيلو', query: 'garlic',            promo: false },
  { id: 'p14', name: 'خس',               darija: 'خس',            emoji: '🥬', category: 'feuilles', price: 0, unit: 'رأس',  query: 'lettuce',           promo: false },
  { id: 'p15', name: 'كرنب',              darija: 'كرنب',          emoji: '🥬', category: 'feuilles', price: 0, unit: 'كيلو', query: 'cabbage',           promo: false },
  { id: 'p16', name: 'فلفل أحمر حار',     darija: 'فلفل حار',      emoji: '🌶️', category: 'legumes', price: 0, unit: 'كيلو', query: 'green chili pepper', promo: false },
  { id: 'p17', name: 'قرعة حمرة',         darija: 'قرعة حمرة',     emoji: '🎃', category: 'legumes', price: 0, unit: 'كيلو', query: 'pumpkin',          promo: false },
  { id: 'p18', name: 'جلبانة',            darija: 'جلبانة',        emoji: '🫛', category: 'legumes', price: 0, unit: 'كيلو', query: 'peas',              promo: false },
  { id: 'p19', name: 'لوبيا خضراء',       darija: 'لوبيا',         emoji: '🌱', category: 'legumes', price: 0, unit: 'كيلو', query: 'green beans',       promo: false },
  { id: 'p20', name: 'فول أخضر',          darija: 'فول',           emoji: '🫘', category: 'legumes', price: 0, unit: 'كيلو', query: 'fava beans',        promo: false },

  /* ---- Fruits (20 الأكثر طلبا) ---- */
  { id: 'p21', name: 'تفاح أحمر',         darija: 'تفاح',          emoji: '🍎', category: 'fruits', price: 0, unit: 'كيلو', query: 'apple',            promo: true  },
  { id: 'p22', name: 'موز',               darija: 'موز',           emoji: '🍌', category: 'fruits', price: 0, unit: 'كيلو', query: 'banana',           promo: false },
  { id: 'p23', name: 'برتقال',            darija: 'برتقال',        emoji: '🍊', category: 'fruits', price: 0, unit: 'كيلو', query: 'orange',           promo: false },
  { id: 'p24', name: 'عنب أبيض',          darija: 'عنب',           emoji: '🍇', category: 'fruits', price: 0, unit: 'كيلو', query: 'grapes',           promo: false },
  { id: 'p25', name: 'بطيخ أحمر',         darija: 'دلاح',          emoji: '🍉', category: 'fruits', price: 0, unit: 'كيلو', query: 'watermelon',       promo: true  },
  { id: 'p26', name: 'شمام',              darija: 'شمام',          emoji: '🍈', category: 'fruits', price: 0, unit: 'كيلو', query: 'melon',            promo: false },
  { id: 'p27', name: 'فراولة',            darija: 'فراولة',        emoji: '🍓', category: 'fruits', price: 0, unit: 'كيلو', query: 'strawberry',       promo: true  },
  { id: 'p28', name: 'خوخ',               darija: 'خوخ',           emoji: '🍑', category: 'fruits', price: 0, unit: 'كيلو', query: 'peach',            promo: false },
  { id: 'p29', name: 'مشماش',             darija: 'مشماش',         emoji: '🟠', category: 'fruits', price: 0, unit: 'كيلو', query: 'apricot',          promo: false },
  { id: 'p30', name: 'كيوي',              darija: 'كيوي',          emoji: '🥝', category: 'fruits', price: 0, unit: 'كيلو', query: 'kiwi',             promo: false },
  { id: 'p31', name: 'أناناس',            darija: 'أناناس',        emoji: '🍍', category: 'fruits', price: 0, unit: 'حبة',  query: 'pineapple',        promo: false },
  { id: 'p32', name: 'مانجو',             darija: 'مانجو',         emoji: '🥭', category: 'fruits', price: 0, unit: 'كيلو', query: 'mango',            promo: false },
  { id: 'p33', name: 'رمان',              darija: 'رمان',          emoji: '🟣', category: 'fruits', price: 0, unit: 'كيلو', query: 'pomegranate',      promo: false },
  { id: 'p34', name: 'كمثرى',             darija: 'بوصنينة',       emoji: '🍐', category: 'fruits', price: 0, unit: 'كيلو', query: 'pear',             promo: false },
  { id: 'p35', name: 'كرز',               darija: 'حب الملوك',     emoji: '🍒', category: 'fruits', price: 0, unit: 'كيلو', query: 'cherry',           promo: false },
  { id: 'p36', name: 'تمر',               darija: 'تمر',           emoji: '🌴', category: 'fruits', price: 0, unit: 'كيلو', query: 'dates',            promo: false },
  { id: 'p37', name: 'كرموس (تين شوكي)',  darija: 'كرموس',         emoji: '🌵', category: 'fruits', price: 0, unit: 'كيلو', query: 'prickly pear',     promo: false },
  { id: 'p38', name: 'كليمونتين',         darija: 'كليمونتين',     emoji: '🍊', category: 'fruits', price: 0, unit: 'كيلو', query: 'clementine',       promo: false },
  { id: 'p39', name: 'جوز الهند',         darija: 'جوز الهند',     emoji: '🥥', category: 'fruits', price: 0, unit: 'حبة',  query: 'coconut',          promo: false },
  { id: 'p40', name: 'أفوكا',             darija: 'أفوكا',         emoji: '🥑', category: 'fruits', price: 0, unit: 'كيلو', query: 'avocado',          promo: false },
];

/* ---- ملاحظة على الصور ----
   دابا كل المنتجات (p1 → p40) صورهم كيجيو بروابط من الويب — والو محلي، والو
   فمجلد images/. راجع دالة getProductImage() فوق قليل (القسم 3): كتبني رابط
   الصورة أوتوماتيكيا حسب حقل query ديال كل منتج، بلا ما تكون خاصك تدير حتى
   حاجة يدويا. إلا صورة ما طلعاتش لسبب ما، الموقع كيرجع تلقائيا للإيموجي 🍎
   بلا ما يبان أي خطأ للزبون. وتقدر فأي وقت تبدل صورة منتج معين برابط خاص
   بيك، غير زيد عمود "img" فـ Google Sheet ديالك وحطو الرابط لي بغيتي — الموقع
   كيقرا هاد العمود تلقائيا (شوف rowsToProducts فوق) وكيولي هو الأولوية. */

/* كل صنف عندو تسمية بالدارجة وإيموجي مقترح. إلا كتبتي فـ Google Sheet صنف
   جديد ماشي موجود هنا (مثلاً "champignons")، الموقع غايبني ليه شيب تلقائيا
   بإيموجي 🧺 عام والاسم بحال ما كتبتيه بالضبط فـ Sheet — بلا ما تلمس الكود. */
const CATEGORY_META = {
  legumes:  { label: 'خضرة',                  emoji: '🍅' },
  racines:  { label: 'جذور ودرنات',            emoji: '🥔' },
  feuilles: { label: 'أوراق',                  emoji: '🥬' },
  herbes:   { label: 'عشاب وتوابل',            emoji: '🌿' },
  agrumes:  { label: 'حوامض',                  emoji: '🍋' },
  fruits:   { label: 'فواكه',                  emoji: '🍎' },
};

let CATEGORIES = [];
function computeCategories() {
  const present = [...new Set(PRODUCTS.map(p => String(p.category || '').trim()).filter(Boolean))];
  CATEGORIES = [
    { id: 'tout', label: 'الكل', emoji: '🧺' },
    ...present.map(id => ({
      id,
      label: CATEGORY_META[id]?.label || id,
      emoji: CATEGORY_META[id]?.emoji || '🧺',
    })),
    { id: 'promo', label: 'بروموسيون', emoji: '🔥' },
  ];
}
computeCategories();

/* ---------- 1bis. SYNCHRONISATION GOOGLE SHEET — Sheet = المصدر الوحيد للمنتجات ----------
   هاد الـ Sheet ماشي غير للأثمنة، هو لي كيبني الكتالوگ كامل ديال المنتجات فـ
   الموقع (زيد، بدل، حيد) — راه الدالة rowsToProducts() تحت كتقرا الـ Sheet
   وكتعوض PRODUCTS بأكملها فـ كل مزامنة، بلا ما تبقى حتى حاجة "ثابتة" فالكود.

   الأعمدة (بالضبط بهاد الترتيب، سطر 1 = رؤوس الأعمدة):
   id | name | darija | emoji | category | price | unit | query | promo | img

   • id       : معرف فريد، ما يتكررش (p1, p2... ولا أي تسمية، المهم يبقى وحيد)
   • name     : الاسم اللي كيبان فالكارد
   • darija   : بالدارجة (كيدخل فالبحث)
   • emoji    : إيموجي احتياطي إلا الصورة ما طلعاتش
   • category : أي كلمة بغيتي (legumes, fruits, herbes...) — إلا كتبتي صنف
                جديد ماشي موجود، الموقع كيدير ليه شيب تلقائيا وحدو (شوف
                CATEGORY_META فوق قليل إلا بغيتي تزيدو ترجمة/إيموجي مخصص ليه)
   • price    : رقم بلا رمز الدرهم (مثلاً 12 ولا 12.5)
   • unit     : كيلو / بوكاية / حبة / رأس...
   • query    : كلمة بالإنجليزية كتستعمل باش تبني رابط الصورة أوتوماتيكيا
                (شوف getProductImage فالقسم 3) إلا ماكتبتيش رابط فـ img
   • img      : (اختياري) رابط صورة مباشر ديالك — إلا عمرتيه، كيولي هو
                الأولوية على الصورة الأوتوماتيكية

   ➕ زيادة منتج    : زيد سطر جديد فالـ Sheet بـ id جديد.
   ✏️ تبديل منتج    : بدل أي خانة (الثمن، الاسم، الصورة...) — كيتبدل فالموقع.
   ❌ حذف منتج      : حيد السطر بأكمله (ولا فرغ خانة "price" ديالو، rowsToProducts
                      كيشد غير الأسطر لي فيهم id + name + price).
   الترتيب ديال الأسطر فـ Sheet = هو نفسو الترتيب لي غادي يبان بيه الصنف الأول
   مرة فالفلاتر (شيبس الأصناف فوق).

   كيفاش تربط الـ Sheet:
   1) Google Sheet بهاد الأعمدة بالضبط (فوق).
   2) ملف → مشاركة → نشر على الويب → اختار الورقة → صيغة CSV → "نشر".
   3) نسخ الرابط (كيبان بحال:
      https://docs.google.com/spreadsheets/d/e/XXXXXXXXXXXX/pub?output=csv)
   4) لصقو فـ SHEET_CSV_URL تحت.
   الموقع كيتحدث وحدو كل 5 دقايق (ولا مانوال بـ loadProductsFromSheet() فـ
   console ديال المتصفح). */

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR12tPAT6hzYjzT_lZIbcJD1O9upGZrrYSd6-Vz1V5rpc1ypZ2sixYDE9yfrlL7zkB-kaYoUiNgvyBo/pub?output=csv';

function normalizeBool(v) {
  if (typeof v === 'boolean') return v;
  const s = String(v || '').trim().toLowerCase();
  return s === 'true' || s === 'vrai' || s === '1' || s === 'oui' || s === 'yes';
}

function rowsToProducts(rows) {
  return rows
    .filter(r => r.id && r.name && r.price !== undefined && String(r.price).trim() !== '')
    .map(r => ({
      id: String(r.id).trim(),
      name: String(r.name).trim(),
      darija: String(r.darija || r.name).trim(),
      emoji: String(r.emoji || '🥬').trim(),
      category: String(r.category || 'legumes').trim(),
      price: Number(String(r.price).replace(',', '.').trim()) || 0,
      unit: String(r.unit || 'كيلو').trim(),
      query: String(r.query || '').trim(),
      promo: normalizeBool(r.promo),
      ...(r.img && String(r.img).trim() ? { img: String(r.img).trim() } : {}),
    }));
}

function loadProductsFromSheet() {
  if (!SHEET_CSV_URL || SHEET_CSV_URL.includes('COLLEZ_ICI')) {
    console.warn('Swi9ti: SHEET_CSV_URL ماشي معمر بعد — كيتصاوبو بالأثمنة الافتراضية ديال app.js.');
    return;
  }
  if (typeof Papa === 'undefined') {
    console.warn('Swi9ti: PapaParse ماشي محمل — تأكد أن index.html فيه الـ <script> ديالو قبل app.js.');
    return;
  }

  Papa.parse(`${SHEET_CSV_URL}${SHEET_CSV_URL.includes('?') ? '&' : '?'}t=${Date.now()}`, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const fresh = rowsToProducts(results.data || []);
      if (fresh.length === 0) {
        console.warn('Swi9ti: الـ Sheet رجع فارغ ولا ماشي مصايب — تبقاو بالأثمنة القديمة.');
        return;
      }
      PRODUCTS = fresh;
      computeCategories();
      if (!CATEGORIES.some(c => c.id === state.category)) state.category = 'tout';
      renderCategories();
      renderProducts();
      renderCartBadges();
      renderCartDrawer();
    },
    error: (err) => {
      console.warn('Swi9ti: ما قدرناش نجيبو الأثمنة من Google Sheet.', err);
    }
  });
}

/* ---------- 2. ÉTAT ---------- */
const state = {
  query: '',
  category: 'tout',
  cart: JSON.parse(localStorage.getItem('casabtata_cart') || '{}'),
  selectedSlot: '',
  selectedDay: '',
  formStep: 1,
  geo: null, // { lat, lng } إلا الزبون قبل يشارك الموقع ديالو
};

const TOTAL_STEPS = 6;
const STEP_LABELS = {
  1: 'الاسم',
  2: 'رقم الهاتف',
  3: 'العنوان والموقع',
  4: 'يوم التوصيل',
  5: 'الفترة المناسبة',
  6: 'تأكيد الطلبية',
};
const DAY_OPTIONS = ['اليوم', 'غدا', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];

const saveCart  = () => localStorage.setItem('casabtata_cart', JSON.stringify(state.cart));

/* ---------- 3. صور المنتجات (كلها روابط من الويب، بلا تخزين محلي) ---------- */
// كل منتج (p1 → p40) عندو حقل query بالإنجليزية، وكنستعملوه باش نبنيو رابط
// صورة حقيقية من LoremFlickr (خدمة صور مجانية كتخدم بالكلمة المفتاحية، خفيفة
// وموثوقة، ماشي بحال روابط ثابتة لي تقدر تنكسر). الـ lock=رقم كيخلي نفس
// الصورة تبقى ثابتة لكل منتج (ماشي عشوائية فكل مرة كترفرش الصفحة).
function getProductImageRaw(product) {
  if (product.img) return product.img; // أولوية لأي رابط مخصص جا من عمود "img" فـ Google Sheet
  const lockNumber = parseInt(String(product.id).replace(/\D/g, ''), 10) || 1;
  const keyword = encodeURIComponent(product.query || product.darija || product.name);
  return `S`;
}

// ---- Proxy d'optimisation (images.weserv.nl) ----
// كنمرو أي صورة (LoremFlickr ولا رابط من Google Sheet) من هاد الخدمة المجانية
// باش: 1) تصغر لقدّ لي محتاجينه بالضبط (ماشي 600×600 كل مرة) 2) تتحول لـ WebP
// (وزن أقل بكثير من JPEG) 3) تقدر تولي مبلورة (blur) باش نصاوبو تأثير
// "blur-up" — نعرضو نسخة صغيرة مبلورة فبضع كيلوبايت قبل ما توصل النسخة الكاملة.
function optimizedImg(rawUrl, { w, q = 75, blur = 0 } = {}) {
  const params = new URLSearchParams({ url: rawUrl, output: 'webp', q: String(q) });
  if (w) params.set('w', String(w));
  if (blur) params.set('blur', String(blur));
  return `https://images.weserv.nl/?${params.toString()}`;
}

// الصورة الكاملة (تتعرض فالكارطة/الكارت/اللايتبوكس) — حجم قابل للتخصيص
function getProductImage(product, size = 480) {
  return optimizedImg(getProductImageRaw(product), { w: size, q: 76 });
}

// نسخة صغيرة جدا ومبلورة (~1-2 كيلوبايت) كتتحمل بزربة وكتبان كـ"blur-up"
// placeholder قبل ما توصل الصورة الحقيقية
function getProductImagePlaceholder(product) {
  return optimizedImg(getProductImageRaw(product), { w: 24, q: 40, blur: 3 });
}

/* ---------- 4. CATÉGORIES ---------- */
// إيموجيات الخضرة والفواكه (🍅🥔🥬...) خاصهم يبقاو — هوما لي كيمثلو نوع المنتج
// بصريا للزبون. غير الأصناف "النظامية" (الكل / بروموسيون) لي كنبدلوهم
// بـ Heroicons باش مايبانش الموقع فيه إيموجي كيبورد عشوائي.
const CATEGORY_ICONS = {
  tout:  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/></svg>`,
  promo: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.048 8.287 8.287 0 0 0 9 9.6a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"/></svg>`,
};
function categoryGlyph(cat) {
  return CATEGORY_ICONS[cat.id] || `<span>${cat.emoji}</span>`;
}
function renderCategories() {
  const row = document.getElementById('categoryRow');
  const drawerList = document.getElementById('categoryListDrawer');
  row.innerHTML = '';
  drawerList.innerHTML = '';

  CATEGORIES.forEach(cat => {
    const active = state.category === cat.id;
    const chip = document.createElement('button');
    chip.className = `shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border flex items-center gap-1.5 ${
      active ? 'bg-green-700 text-white border-green-700' : 'bg-white text-charcoal-800/70 border-charcoal-800/10 active:bg-charcoal-800/5'
    }`;
    chip.innerHTML = `${categoryGlyph(cat)}<span>${cat.label}</span>`;
    chip.onclick = () => { state.category = cat.id; renderCategories(); renderProducts(); };
    row.appendChild(chip);

    const item = document.createElement('button');
    item.className = `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition ${
      active ? 'bg-green-700 text-white' : 'text-charcoal-800/80 active:bg-charcoal-800/5'
    }`;
    item.innerHTML = `${categoryGlyph(cat)}<span>${cat.label}</span>`;
    item.onclick = () => { state.category = cat.id; renderCategories(); renderProducts(); closeCatDrawer(); };
    drawerList.appendChild(item);
  });
}

/* ---------- 4bis. LAZY LOADING + BLUR-UP للصور ---------- */
// كنستعملو IntersectionObserver باش ما نحملوش غير الصور لي قريبة من الشاشة
// (بدل ما نطلقو الـ 40 صورة فنفس الوقت وهو لي كان كيسبب الريطارد والزحمة على
// الشبكة). كل صورة كتبان أول مرة مبلورة (نسخة صغيرة خفيفة) ثم كتولي واضحة
// بمجرد ما تكمل التحميل الكامل — تأثير "blur-up" بلا وميض ولا فراغ.
let _imgObserver = null;
const _imgObserverTargets = new WeakMap(); // slot(HTMLElement) -> product

function getImgObserver() {
  if (_imgObserver) return _imgObserver;
  if (!('IntersectionObserver' in window)) return null;
  _imgObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const slot = entry.target;
      const product = _imgObserverTargets.get(slot);
      obs.unobserve(slot);
      if (product) loadCardImage(slot, product);
    });
  }, { rootMargin: '500px 0px', threshold: 0.01 });
  return _imgObserver;
}

function observeCardImage(slot, product) {
  _imgObserverTargets.set(slot, product);
  const obs = getImgObserver();
  if (obs) {
    obs.observe(slot);
  } else {
    // Fallback (متصفح قديم بلا IntersectionObserver) — نحملو مباشرة
    loadCardImage(slot, product);
  }
}

function loadCardImage(slot, p) {
  const skel = slot.parentElement ? slot.parentElement.querySelector('[data-skel]') : null;
  const fullSrc = getProductImage(p);
  const placeholderSrc = getProductImagePlaceholder(p);

  const img = document.createElement('img');
  img.alt = p.name;
  img.decoding = 'async';
  img.loading = 'lazy';
  img.className = 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105';
  img.style.opacity = '0';
  img.style.filter = 'blur(18px)';
  img.style.transform = 'scale(1.1)';
  img.style.transition = 'opacity .35s ease, filter .5s ease, transform .5s ease';

  // 1) نسخة صغيرة مبلورة — توصل بزربة (بضع كيلوبايت) وتغطي الفراغ فوريا
  const ph = new Image();
  ph.onload = () => {
    if (img.src === fullSrc) return; // الصورة الكاملة سبقات وصلات
    img.src = placeholderSrc;
    if (!img.isConnected) slot.appendChild(img);
    requestAnimationFrame(() => { img.style.opacity = '1'; });
  };
  ph.src = placeholderSrc;

  // 2) الصورة الكاملة فالخلفية — بمجرد ما توصل، كتبدل الـ blur وكتبان واضحة
  const full = new Image();
  full.onload = () => {
    img.src = fullSrc;
    if (!img.isConnected) slot.appendChild(img);
    img.style.opacity = '1';
    img.style.filter = 'blur(0)';
    img.style.transform = 'scale(1)';
    if (skel) skel.remove();
  };
  full.onerror = () => {
    // الصورة ما وصلاتش — نخليو الإيموجي (skeleton) بادي عوض ما نبقاو بفراغ
    if (skel) skel.removeAttribute('data-skel');
  };
  full.src = fullSrc;
}

/* ---------- 5. GRILLE PRODUITS ---------- */
function filteredProducts() {
  return PRODUCTS.filter(p => {
    const matchCat = state.category === 'tout' ? true : state.category === 'promo' ? p.promo : p.category === state.category;
    const matchQuery = p.name.toLowerCase().includes(state.query.trim().toLowerCase()) ||
                       p.darija.includes(state.query.trim());
    return matchCat && matchQuery;
  });
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  const empty = document.getElementById('emptyState');
  const list = filteredProducts();
  const titleMap = Object.fromEntries(CATEGORIES.map(c => [c.id, c.label]));
  document.getElementById('sectionTitle').textContent = state.category === 'tout' ? 'كل الخضرة' : titleMap[state.category];
  document.getElementById('resultCount').textContent = list.length ? `${list.length} منتج` : '';

  grid.innerHTML = '';
  empty.classList.toggle('hidden', list.length > 0);

  list.forEach((p, i) => {
    const qty = state.cart[p.id] || 0;
    const card = document.createElement('div');
    card.className = 'rise-in group bg-white rounded-2xl shadow-crate ring-1 ring-charcoal-800/[0.04] overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:ring-charcoal-800/[0.08]';
    card.style.animationDelay = `${Math.min(i * 35, 300)}ms`;
    card.innerHTML = `
      <div data-lightbox-trigger="${p.id}" class="relative aspect-square bg-sand-100 overflow-hidden cursor-zoom-in active:scale-[0.97] transition-transform" role="button" tabindex="0" aria-label="كبّر صورة ${p.name}">
        <div data-skel class="absolute inset-0 flex items-center justify-center text-5xl">${p.emoji}</div>
        <div data-img-slot="${p.id}" class="absolute inset-0"></div>
        ${p.promo ? `<span class="absolute top-2 left-2 bg-terracotta-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">بروم</span>` : ''}
        <span class="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-charcoal-800/35 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m-3-3h6"/></svg>
        </span>
      </div>
      <div class="p-3 flex flex-col gap-2 flex-1">
        <h3 class="font-semibold text-sm leading-tight text-charcoal-800">${p.name}</h3>
        <p class="text-green-700 font-bold text-sm"> ${p.price} MAD <span class="text-charcoal-800/40 font-normal text-xs">/ ${p.unit}</span></p>
        <div class="mt-auto pt-1" data-qty-zone="${p.id}">
          ${qty > 0 ? qtyStepperHTML(p.id, qty, p.unit) : addButtonHTML(p.id)}
        </div>
      </div>
    `;
    grid.appendChild(card);

    // Image chargée en lazy (IntersectionObserver) + effet blur-up progressif —
    // voir observeCardImage()/loadCardImage() dans la section 4bis plus haut.
    const slot = card.querySelector(`[data-img-slot="${p.id}"]`);
    if (slot) observeCardImage(slot, p);

    // Tap the image → open a zoomed-in lightbox so the client can see the product clearly
    const trigger = card.querySelector(`[data-lightbox-trigger="${p.id}"]`);
    if (trigger) {
      trigger.onclick = () => openLightbox(p);
      trigger.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(p); } };
    }
  });

  attachQtyHandlers();
}

/* ---------- 5bis. LIGHTBOX — تكبير صورة المنتج ---------- */
function openLightbox(product) {
  const lightbox = document.getElementById('imgLightbox');
  const img = document.getElementById('lightboxImg');
  const lowSrc = getProductImage(product, 480);  // probablement déjà en cache (grille)
  const hiSrc  = getProductImage(product, 900);  // qualité haute pour le zoom
  img.src = lowSrc;
  img.alt = product.name;
  img.classList.remove('zoom-in');
  void img.offsetWidth; // reset animation
  img.classList.add('zoom-in');
  // Upgrade silencieux vers la haute résolution une fois chargée, sans à-coup
  const hi = new Image();
  hi.onload = () => { img.src = hiSrc; };
  hi.src = hiSrc;
  document.getElementById('lightboxName').textContent = `${product.emoji} ${product.name}`;
  document.getElementById('lightboxPrice').textContent = `${product.price} MAD / ${product.unit}`;
  lightbox.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('imgLightbox').classList.add('hidden');
  document.body.style.overflow = '';
}

/* Heroicon: plus */
const PLUS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>`;
/* Heroicon: minus */
const MINUS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"/></svg>`;

function addButtonHTML(id) {
  return `<button data-add="${id}" aria-label="زيد للسلة" class="w-full bg-green-700 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-full transition active:scale-95 flex items-center justify-center gap-1.5">
    ${PLUS_ICON} زيد للسلة
  </button>`;
}
function qtyStepperHTML(id, qty, unit) {
  return `<div class="flex items-center justify-between bg-green-50 rounded-full p-1">
    <button data-dec="${id}" aria-label="نقص" class="w-8 h-8 rounded-full bg-white text-green-700 flex items-center justify-center shadow-sm active:scale-90">${MINUS_ICON}</button>
    <span class="flex flex-col items-center leading-none px-1" aria-live="polite">
      <span class="text-sm font-semibold text-green-900">${qty}</span>
      ${unit ? `<span class="text-[9px] text-green-700/70 font-medium">${unit}</span>` : ''}
    </span>
    <button data-inc="${id}" aria-label="زيد" class="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center shadow-sm active:scale-90">${PLUS_ICON}</button>
  </div>`;
}

function attachQtyHandlers() {
  document.querySelectorAll('[data-add]').forEach(btn => btn.onclick = () => { updateQty(btn.dataset.add, 1); showToast(`تزاد للسلة!`); });
  document.querySelectorAll('[data-inc]').forEach(btn => btn.onclick = () => updateQty(btn.dataset.inc, 1));
  document.querySelectorAll('[data-dec]').forEach(btn => btn.onclick = () => updateQty(btn.dataset.dec, -1));
}

function productById(id) { return PRODUCTS.find(p => p.id === id); }

function updateQty(id, delta) {
  const current = state.cart[id] || 0;
  const next = Math.max(0, current + delta);
  if (next === 0) delete state.cart[id]; else state.cart[id] = next;
  saveCart();
  refreshQtyZone(id);
  renderCartBadges();
  renderCartDrawer();
}

function refreshQtyZone(id) {
  const zone = document.querySelector(`[data-qty-zone="${id}"]`);
  if (!zone) return;
  const qty = state.cart[id] || 0;
  const product = productById(id);
  zone.innerHTML = qty > 0 ? qtyStepperHTML(id, qty, product && product.unit) : addButtonHTML(id);
  attachQtyHandlers();
}

/* ---------- 6. PANIER ---------- */
function cartEntries() {
  let hadStaleItems = false;
  const entries = Object.entries(state.cart)
    .map(([id, qty]) => {
      const product = productById(id);
      if (!product) { hadStaleItems = true; return null; } // تحيد من Sheet (CRUD: حذف) → كنشيلوه من السلة تلقائيا
      return { ...product, qty };
    })
    .filter(Boolean);
  if (hadStaleItems) {
    Object.keys(state.cart).forEach(id => { if (!productById(id)) delete state.cart[id]; });
    saveCart();
  }
  return entries;
}
const DELIVERY = 20;
function cartTotal() {
  return cartEntries().reduce((sum, item) => sum + item.price * item.qty, 0) + DELIVERY;
}
function cartCount() {
  return Object.values(state.cart).reduce((a, b) => a + b, 0);
}

function renderCartBadges() {
  const count = cartCount();
  const total = cartTotal();
  const badge = document.getElementById('cartCount');
  badge.textContent = count;
  badge.classList.toggle('hidden', count === 0);
  if (count > 0) { badge.classList.remove('pop'); requestAnimationFrame(() => badge.classList.add('pop')); }
  const sticky = document.getElementById('stickyBar');
  sticky.classList.toggle('hidden', count === 0);
  document.getElementById('stickyCount').textContent = count;
  document.getElementById('stickyTotal').textContent = `${total} درهم`;
}

function renderCartDrawer() {
  const wrap = document.getElementById('cartItems');
  const entries = cartEntries();

  if (entries.length === 0) {
    wrap.innerHTML = `<div class="flex-1 flex flex-col items-center justify-center text-center py-10 fade-in">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor" class="w-14 h-14 mb-3 text-charcoal-800/25">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
      </svg>
      <p class="font-display text-green-900 font-semibold">السلة فارغة</p>
      <p class="text-sm text-charcoal-800/55 mt-1">زيد بعض الخضرة الطازجة!</p>
    </div>`;
  } else {
    wrap.innerHTML = entries.map(item => `
      <div class="flex items-center gap-3">
        <div class="w-14 h-14 rounded-xl bg-sand-100 shrink-0 overflow-hidden flex items-center justify-center text-2xl" id="cart-img-${item.id}">
          ${item.emoji}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-charcoal-800 truncate">${item.name}</p>
          <p class="text-xs text-charcoal-800/50">${item.price} درهم / ${item.unit}</p>
        </div>
        <div class="flex items-center gap-2 bg-green-50 rounded-full p-1 shrink-0">
          <button data-cart-dec="${item.id}" class="w-7 h-7 rounded-full bg-white text-green-700 flex items-center justify-center shadow-sm active:scale-90">${MINUS_ICON}</button>
          <span class="flex flex-col items-center leading-none w-8">
            <span class="text-sm font-semibold text-green-900">${item.qty}</span>
            <span class="text-[9px] text-green-700/70 font-medium">${item.unit}</span>
          </span>
          <button data-cart-inc="${item.id}" class="w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center shadow-sm active:scale-90">${PLUS_ICON}</button>
        </div>
      </div>
    `).join('');

    // Load images in cart — replace emoji only if image loads
    // (vignettes 56px → on demande une image déjà petite au proxy, pas 480px
    // redimensionnée par le navigateur : bien plus léger et rapide)
    entries.forEach(item => {
      const slot = document.getElementById(`cart-img-${item.id}`);
      if (!slot) return;
      const src = getProductImage(item, 112); // 2x pour écrans retina
      const img = new Image();
      img.onload = () => {
        slot.innerHTML = '';
        slot.classList.remove('flex', 'items-center', 'justify-center', 'text-2xl');
        const el = document.createElement('img');
        el.src = src;
        el.alt = item.name;
        el.decoding = 'async';
        el.className = 'w-full h-full object-cover';
        slot.appendChild(el);
      };
      img.src = src;
    });
  }

  document.querySelectorAll('[data-cart-inc]').forEach(b => b.onclick = () => updateQty(b.dataset.cartInc, 1));
  document.querySelectorAll('[data-cart-dec]').forEach(b => b.onclick = () => updateQty(b.dataset.cartDec, -1));

  const total = cartTotal();
  document.getElementById('cartSubtotal').textContent = `${total} درهم`;
  document.getElementById('cartTotal').textContent = `${total} درهم`;
  document.getElementById('checkoutBtn').disabled = entries.length === 0;
  document.getElementById('checkoutBtn').classList.toggle('opacity-40', entries.length === 0);
}

/* ---------- 7. WHATSAPP ORDER ---------- */
const WA_NUMBER = '212625185245';

// ⬅️ لصق هنا الرابط ديال Google Apps Script (Web App) لي عطاكم فـ الخطوة 2
// كيبان بحال: https://script.google.com/macros/s/XXXXXXXXXXXX/exec
const ORDERS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwhQ33c3ZEhrfUtb-zLVHj4_TLCzAfAqBOHPRFPf9sTH0o-mNo4gt8aj_ZxQ8kzEeiypg/exec';

function sendOrderToSheet(clientInfo) {
  if (!ORDERS_SCRIPT_URL || ORDERS_SCRIPT_URL.includes('COLLEZ_ICI')) {
    console.warn('Swi9ti: ORDERS_SCRIPT_URL ماشي معمر بعد — الطلبية غادي تبقى غير فـ WhatsApp، ماغاديش تتسجل فـ Sheet.');
    return;
  }

  const DELIVERY_FEE = 0;
  const entries = cartEntries();
  const cartDetails = entries
    .map(item => `${item.emoji} ${item.name} : ${item.qty} ${item.unit} — ${item.price * item.qty} DH`)
    .join('\n');
  const availability = `${clientInfo.day} — ${clientInfo.slot}`;
  const totalToPay = cartTotal() + DELIVERY_FEE;

  const payload = {
    name: clientInfo.name,
    // ⚠️ كنزيدو علامة الأبوستروف (') قبل رقم الهاتف: هادشي كيقول لـ Google
    // Sheets "خديه بحال نص/تيكست" ماشي رقم ولا صيغة (=SUM...) — بهاد الشكل
    // ما يبقاش +212 كيتقرا كخطأ #NAME? ولا كيبان بصيغة غريبة فالخانة. هاد
    // الأبوستروف كتبان غير فـ Sheet، ما عندهاش علاقة برسالة واتساب.
    phone: `'${clientInfo.phone}`,
    location: clientInfo.location,
    mapsLink: clientInfo.mapsLink || '',
    availability,
    cartDetails,
    totalToPay,
  };

  fetch(ORDERS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  }).catch(err => {
    console.warn('Swi9ti: ما قدرناش نسجلو الطلبية فـ Google Sheet.', err);
  });
}

function buildWhatsAppMessage(clientInfo) {
  const entries = cartEntries();
  const total = cartTotal();
  const now = new Date().toLocaleString('ar-MA', { dateStyle: 'short', timeStyle: 'short' });

  let msg = `🥕 *طلبية Swi9ti* 🥕\n`;
  msg += `━━━━━━━━━━━━━━━━\n`;
  entries.forEach(item => {
    msg += `• ${item.name} × ${item.qty} ${item.unit} = ${item.price * item.qty} درهم\n`;
  });
  msg += `━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *المجموع: ${total} درهم*\n`;
  msg += `🚚 التوصيل: *20 درهم* 🎉\n`;
  msg += `━━━━━━━━━━━━━━━━\n`;
  msg += `👤 *الاسم:* ${clientInfo.name}\n`;
  msg += `📞 *الهاتف:* ${clientInfo.phone}\n`;
  msg += `📍 *العنوان:* ${clientInfo.location}\n`;
  if (clientInfo.mapsLink) {
    msg += `🗺️ *الموقع الدقيق (خريطة):* ${clientInfo.mapsLink}\n`;
  }
  msg += `📅 *يوم التوصيل:* ${clientInfo.day}\n`;
  msg += `🕐 *الفترة المناسبة:* ${clientInfo.slot}\n`;
  msg += `━━━━━━━━━━━━━━━━\n`;
  msg += `🕐 ${now}\n\n`;
  msg += `شكرا على الطلبية! غادي نتواصلو معاك قريبا 🙏`;
  return msg;
}

/* ---- Multi-step wizard: خطوة وحدة فكل مرة، تقدم أوتوماتيكي، بار التقدم ---- */
function renderDayGrid() {
  const grid = document.getElementById('dayGrid');
  grid.innerHTML = DAY_OPTIONS.map(day => `
    <button type="button" data-day="${day}" class="day-btn py-3 rounded-xl text-xs font-medium border border-charcoal-800/10 bg-sand-50 text-charcoal-800/70 active:scale-95 transition">${day}</button>
  `).join('');
  document.querySelectorAll('.day-btn').forEach(btn => {
    btn.onclick = () => {
      state.selectedDay = btn.dataset.day;
      document.querySelectorAll('.day-btn').forEach(b => {
        b.classList.remove('bg-green-700', 'text-white', 'border-green-700');
        b.classList.add('bg-sand-50', 'text-charcoal-800/70', 'border-charcoal-800/10');
      });
      btn.classList.add('bg-green-700', 'text-white', 'border-green-700');
      btn.classList.remove('bg-sand-50', 'text-charcoal-800/70', 'border-charcoal-800/10');
      document.getElementById('formError').classList.add('hidden');
      setTimeout(nextStep, 280); // تقدم أوتوماتيكي لعندالخطوة لي مورا
    };
  });
}

function updateProgress() {
  const pct = Math.round((state.formStep / TOTAL_STEPS) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('stepPercent').textContent = pct + '%';
  document.getElementById('stepLabel').textContent = `الخطوة ${state.formStep} من ${TOTAL_STEPS} — ${STEP_LABELS[state.formStep]}`;
}

function goToStep(n) {
  state.formStep = n;
  document.querySelectorAll('.form-step').forEach(el => {
    el.classList.toggle('hidden', Number(el.dataset.step) !== n);
  });
  updateProgress();
  document.getElementById('formError').classList.add('hidden');

  const backBtn = document.getElementById('stepBackBtn');
  const nextBtn = document.getElementById('stepNextBtn');
  const sendBtn = document.getElementById('waConfirmBtn');

  backBtn.textContent = n === 1 ? 'لّا، رجع' : '‹ رجوع';
  nextBtn.classList.toggle('hidden', n === TOTAL_STEPS);
  sendBtn.classList.toggle('hidden', n !== TOTAL_STEPS);

  if (n === TOTAL_STEPS) renderReview();

  requestAnimationFrame(() => {
    if (n === 1) document.getElementById('clientName').focus();
    if (n === 2) document.getElementById('clientPhone').focus();
    if (n === 3) document.getElementById('clientLocation').focus();
  });
}

function currentStepValid() {
  const n = state.formStep;
  if (n === 1) return document.getElementById('clientName').value.trim().length >= 2;
  if (n === 2) return /^[0-9]{9}$/.test(document.getElementById('clientPhone').value.trim());
  // إلا الزبون حدد موقعه بالخريطة (GPS)، ما بقاش خاصو يعمر خانة العنوان يدويا
  if (n === 3) return !!state.geo || document.getElementById('clientLocation').value.trim().length >= 3;
  if (n === 4) return !!state.selectedDay;
  if (n === 5) return !!state.selectedSlot;
  return true;
}

function nextStep() {
  if (!currentStepValid()) {
    document.getElementById('formError').classList.remove('hidden');
    return;
  }
  document.getElementById('formError').classList.add('hidden');
  if (state.formStep < TOTAL_STEPS) goToStep(state.formStep + 1);
}

function prevStep() {
  if (state.formStep === 1) { hideWAModal(); return; }
  goToStep(state.formStep - 1);
}

/* Heroicons مستعملة فملخص المراجعة */
const REVIEW_ICONS = {
  user:     `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>`,
  phone:    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/></svg>`,
  pin:      `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0V11.25A2.25 2.25 0 0 1 5.25 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5"/></svg>`,
  clock:    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
  check:    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 shrink-0 text-green-600"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>`,
};

function renderReview() {
  const name = document.getElementById('clientName').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const typedLocation = document.getElementById('clientLocation').value.trim();
  const location = typedLocation || (state.geo ? 'الموقع محدد بدقة على الخريطة' : '');
  const rows = [
    [REVIEW_ICONS.user, 'الاسم', name],
    [REVIEW_ICONS.phone, 'الهاتف', `+212 ${phone}`],
    [REVIEW_ICONS.pin, 'العنوان', location],
    [REVIEW_ICONS.calendar, 'اليوم', state.selectedDay],
    [REVIEW_ICONS.clock, 'الفترة', state.selectedSlot],
  ];
  if (state.geo) rows.push([REVIEW_ICONS.check, 'الموقع على الخريطة', 'محدد بدقة']);
  document.getElementById('reviewSummary').innerHTML = rows.map(([icon, label, val]) => `
    <div class="flex items-start justify-between gap-3">
      <span class="text-charcoal-800/50 shrink-0 flex items-center gap-1.5">${icon} ${label}</span>
      <span class="font-semibold text-charcoal-800 text-left">${val}</span>
    </div>
  `).join('');
}

function captureLocation() {
  const btn = document.getElementById('geoBtn');
  const label = document.getElementById('geoBtnLabel');
  const statusEl = document.getElementById('geoStatus');
  const errorEl = document.getElementById('geoError');
  errorEl.classList.add('hidden');

  if (!navigator.geolocation) {
    errorEl.querySelector('span').textContent = 'الهاتف ديالك ما كيدعمش تحديد الموقع';
    errorEl.classList.remove('hidden');
    return;
  }

  label.textContent = 'كنحددو الموقع...';
  btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.geo = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      label.textContent = 'تم تحديد الموقع';
      statusEl.classList.remove('hidden');
      btn.disabled = false;
      btn.classList.add('ring-2', 'ring-green-600');
      document.getElementById('formError').classList.add('hidden');
      // ما خصوش يعمر العنوان يدويا — كنقدمو أوتوماتيكيا للخطوة لي مورا
      setTimeout(() => { if (state.formStep === 3) nextStep(); }, 650);
    },
    () => {
      btn.disabled = false;
      label.textContent = 'حدد موقعي بدقة على الخريطة';
      errorEl.classList.remove('hidden');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function showWAModal() {
  const entries = cartEntries();
  if (entries.length === 0) return;

  const summaryEl = document.getElementById('waOrderSummary');
  const total = cartTotal();
  summaryEl.innerHTML = entries.map(item =>
    `<div class="flex justify-between py-0.5"><span>${item.emoji} ${item.name} × ${item.qty}</span><span class="font-semibold">${item.price * item.qty} درهم</span></div>`
  ).join('') + `<div class="border-t border-charcoal-800/10 mt-2 pt-2 flex justify-between font-bold text-green-800"><span>المجموع</span><span>${total} درهم</span></div>`;

  // Reset wizard
  document.getElementById('clientName').value = '';
  document.getElementById('clientPhone').value = '';
  document.getElementById('clientLocation').value = '';
  document.getElementById('geoStatus').classList.add('hidden');
  document.getElementById('geoError').classList.add('hidden');
  document.getElementById('geoBtnLabel').textContent = 'حدد موقعي بدقة على الخريطة 📍';
  document.getElementById('geoBtn').classList.remove('ring-2', 'ring-green-600');
  state.geo = null;
  state.selectedDay = '';
  state.selectedSlot = '';
  document.querySelectorAll('.slot-btn').forEach(b => {
    b.classList.remove('bg-green-700', 'text-white', 'border-green-700');
    b.classList.add('bg-sand-50', 'text-charcoal-800/70', 'border-charcoal-800/10');
  });
  renderDayGrid();
  document.getElementById('formError').classList.add('hidden');

  goToStep(1);
  document.getElementById('waModal').classList.remove('hidden');
}

function hideWAModal() {
  document.getElementById('waModal').classList.add('hidden');
}

function sendToWhatsApp() {
  const name     = document.getElementById('clientName').value.trim();
  const phone    = document.getElementById('clientPhone').value.trim();
  const typedLocation = document.getElementById('clientLocation').value.trim();
  // إلا الزبون حدد الموقع بالـ GPS وما كتبش العنوان يدويا، كنستعملو وصف بديل
  const location = typedLocation || (state.geo ? 'الموقع محدد بدقة على الخريطة (شوف الرابط تحت)' : '');
  const day      = state.selectedDay;
  const slot     = state.selectedSlot;

  if (!name || !phone || !location || !day || !slot) {
    goToStep(!name ? 1 : !phone ? 2 : !location ? 3 : !day ? 4 : 5);
    document.getElementById('formError').classList.remove('hidden');
    return;
  }

  const mapsLink = state.geo ? `https://www.google.com/maps?q=${state.geo.lat},${state.geo.lng}` : '';
  const clientInfo = { name, phone: `+212 ${phone}`, location, day, slot, mapsLink };

  const msg = buildWhatsAppMessage(clientInfo);
  const encoded = encodeURIComponent(msg);
  const url = `https://wa.me/${WA_NUMBER}?text=${encoded}`;

  // كنسجلو الطلبية فـ Google Sheet وفـ نفس الوقت كنحلو WhatsApp
  sendOrderToSheet(clientInfo);
  window.open(url, '_blank');

  state.cart = {};
  saveCart();
  renderCartBadges();
  renderCartDrawer();
  renderProducts();
  hideWAModal();
  closeCartDrawer();
  showToast('الطلبية تسافرت! تبقا تستنا واتساب');
}

/* ---------- 8. TOAST ---------- */
const TOAST_CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" class="w-4 h-4 shrink-0 text-green-400"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>`;
let toastTimer;
function showToast(message, showIcon = true) {
  const toast = document.getElementById('toast');
  toast.innerHTML = `<span class="flex items-center gap-2">${showIcon ? TOAST_CHECK_ICON : ''}<span>${message}</span></span>`;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2200);
}

/* ---------- 9. DRAWERS ---------- */
function openCartDrawer() {
  document.getElementById('cartOverlay').classList.remove('hidden');
  document.getElementById('cartDrawer').classList.remove('translate-x-full');
  document.body.style.overflow = 'hidden';
}
function closeCartDrawer() {
  document.getElementById('cartOverlay').classList.add('hidden');
  document.getElementById('cartDrawer').classList.add('translate-x-full');
  document.body.style.overflow = '';
}
function openCatDrawer() {
  document.getElementById('catDrawerOverlay').classList.remove('hidden');
  document.getElementById('catDrawer').classList.remove('-translate-x-full');
  document.body.style.overflow = 'hidden';
}
function closeCatDrawer() {
  document.getElementById('catDrawerOverlay').classList.add('hidden');
  document.getElementById('catDrawer').classList.add('-translate-x-full');
  document.body.style.overflow = '';
}

/* ---------- 10. EVENTS ---------- */
function bindEvents() {
  document.getElementById('cartBtn').onclick = openCartDrawer;
  document.getElementById('cartClose').onclick = closeCartDrawer;
  document.getElementById('cartOverlay').onclick = closeCartDrawer;
  document.getElementById('stickyBarBtn').onclick = openCartDrawer;

  document.getElementById('menuBtn').onclick = openCatDrawer;
  document.getElementById('catDrawerClose').onclick = closeCatDrawer;
  document.getElementById('catDrawerOverlay').onclick = closeCatDrawer;

  document.getElementById('checkoutBtn').onclick = showWAModal;
  document.getElementById('waModalOverlay').onclick = hideWAModal;
  document.getElementById('waConfirmBtn').onclick = sendToWhatsApp;
  document.getElementById('stepBackBtn').onclick = prevStep;
  document.getElementById('stepNextBtn').onclick = nextStep;
  document.getElementById('geoBtn').onclick = captureLocation;
  document.getElementById('lightboxClose').onclick = closeLightbox;
  document.getElementById('imgLightbox').addEventListener('click', (e) => {
    if (e.target.id === 'imgLightbox') closeLightbox();
  });

  document.querySelectorAll('.slot-btn').forEach(btn => {
    btn.onclick = () => {
      state.selectedSlot = btn.dataset.slot;
      document.querySelectorAll('.slot-btn').forEach(b => {
        b.classList.remove('bg-green-700', 'text-white', 'border-green-700');
        b.classList.add('bg-sand-50', 'text-charcoal-800/70', 'border-charcoal-800/10');
      });
      btn.classList.add('bg-green-700', 'text-white', 'border-green-700');
      btn.classList.remove('bg-sand-50', 'text-charcoal-800/70', 'border-charcoal-800/10');
      document.getElementById('formError').classList.add('hidden');
      setTimeout(nextStep, 280); // تقدم أوتوماتيكي بعد اختيار الفترة
    };
  });

  // ── Auto-advance فالفورمولير: كتقدم للحقل لي مورا بلا ما تدوز بالإيد ──
  const nameInput = document.getElementById('clientName');
  nameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); nextStep(); }
  });

  const phoneInput = document.getElementById('clientPhone');
  phoneInput.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 9);
    if (e.target.value.length === 9) setTimeout(nextStep, 220); // كيقدم وحدو من غير زر
  });
  phoneInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); nextStep(); }
  });

  const locationInput = document.getElementById('clientLocation');
  locationInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); nextStep(); }
  });

  let debounce;
  const onSearch = (val) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { state.query = val; renderProducts(); }, 150);
  };
  document.getElementById('searchInput').addEventListener('input', e => onSearch(e.target.value));
  document.getElementById('searchInputMobile').addEventListener('input', e => {
    document.getElementById('searchInput').value = e.target.value;
    onSearch(e.target.value);
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!document.getElementById('imgLightbox').classList.contains('hidden')) closeLightbox();
    else if (!document.getElementById('waModal').classList.contains('hidden')) hideWAModal();
    else if (!document.getElementById('cartOverlay').classList.contains('hidden')) closeCartDrawer();
    else if (!document.getElementById('catDrawerOverlay').classList.contains('hidden')) closeCatDrawer();
  });
}

/* ---------- 11. INIT ---------- */
function init() {
  renderCategories();
  renderProducts();
  renderCartBadges();
  renderCartDrawer();
  bindEvents();

  // كنبداو بالأثمنة الافتراضية (فوق)، من بعد كنبدلوهم بالأثمنة الطرية من Google Sheet.
  loadProductsFromSheet();
  // تحديث تلقائي كل 5 دقايق، حسن باش إلا الصفحة بقات محلولة عند الزبون.
  setInterval(loadProductsFromSheet, 5 * 60 * 1000);
}

document.addEventListener('DOMContentLoaded', init);