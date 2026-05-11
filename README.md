# دليلي | Dalili Transit

خريطة النقل الداخلي في مدينة حلب — Web App حديث وبسيط وسريع.

---

## البنية العامة

```
dalili-transit/
├── src/
│   ├── components/
│   │   ├── layout/       # Header
│   │   ├── map/          # TransitMap, MapLines, MapStations, MapBackground
│   │   ├── search/       # SearchBox
│   │   ├── station/      # StationCard, BottomSheet
│   │   └── ui/           # LineLegend, AlertBanner
│   ├── data/             # stations.js, lines.js, alerts.js, index.js (API abstraction)
│   ├── hooks/            # useDarkMode, useSearch, useFavorites
│   ├── styles/           # globals.css (Tailwind v4)
│   ├── App.jsx
│   └── main.jsx
├── public/               # manifest.json, favicon.svg
├── wordpress-plugin/
│   └── dalili-transit/
│       ├── dalili-transit.php   # Plugin entry point
│       └── includes/
│           ├── post-types.php   # CPTs: station, line, alert
│           ├── acf-fields.php   # ACF field groups
│           ├── rest-api.php     # REST endpoints
│           └── shortcode.php    # [dalili_transit_map]
└── dist/                # Production build output
```

---

## التشغيل المحلي

```bash
# 1. تثبيت الاعتماديات
npm install

# 2. تشغيل الخادم المحلي (http://localhost:3000)
npm run dev

# 3. بناء للإنتاج
npm run build

# 4. بناء داخل WordPress Plugin
npm run build:wp
```

---

## تثبيت WordPress Plugin

1. نفّذ `npm run build:wp` لبناء الملفات داخل `wordpress-plugin/dalili-transit/assets/dist/`
2. انسخ مجلد `wordpress-plugin/dalili-transit/` إلى `wp-content/plugins/`
3. فعّل البلجن من لوحة تحكم WordPress
4. تأكد من تثبيت **ACF Pro** أو **Advanced Custom Fields v6+**

---

## REST API Endpoints

| Endpoint | الوصف |
|----------|-------|
| `GET /wp-json/dalili/v1/stations` | جميع المحطات |
| `GET /wp-json/dalili/v1/stations/{id}` | محطة واحدة |
| `GET /wp-json/dalili/v1/lines` | جميع الخطوط |
| `GET /wp-json/dalili/v1/alerts` | التنبيهات النشطة |

---

## الاستخدام مع Elementor

أضف **Shortcode Widget** في Elementor وأدخل:

```
[dalili_transit_map]
```

خيارات متاحة:

```
[dalili_transit_map height="700px" theme="dark"]
[dalili_transit_map height="500px" theme="light"]
[dalili_transit_map height="600px" theme="auto"]
```

---

## الربط مع WordPress API

في ملف `.env` المحلي:

```
VITE_WP_API_URL=https://your-wordpress-site.com
```

عند وجود هذا المتغير يتحول التطبيق تلقائياً لاستخدام بيانات WordPress.

---

## التقنيات المستخدمة

| التقنية | الإصدار |
|---------|---------|
| React | 19 |
| Vite | 8 |
| Tailwind CSS | 4 |
| Framer Motion | 12 |
| Lucide React | أحدث |
| WordPress Plugin API | 6.0+ |
| ACF | 6.0+ |

---

## الميزات

- خريطة SVG تفاعلية (Zoom / Drag / Pinch)
- بحث سريع بالمحطات والخطوط
- بطاقة معلومات المحطة
- Bottom Sheet للموبايل
- Dark Mode كامل
- RTL Support
- PWA Ready
- WordPress Plugin + REST API
- Elementor Shortcode
- حفظ المفضلة في localStorage
- تنبيهات ديناميكية
