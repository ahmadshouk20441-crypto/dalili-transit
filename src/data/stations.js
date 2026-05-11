// Station positions extracted from dalili-map.svg
// Each (x, y) is the TOP-LEFT corner of the station badge (318×68 units).
// The clickable center = (x + 159, y + 34).
// SVG viewBox: 0 0 2250 1800

export const stations = [
  // ── Row 1  Y≈118–135  (northern strip) ──────────────────────────
  { id:'st-01', name:'الشيخ مقصود',   x: 253, y: 133, lineIds:['line-teal'],      description:'محطة حي الشيخ مقصود' },
  { id:'st-02', name:'الأشرفية',      x: 431, y: 133, lineIds:['line-teal'],      description:'محطة حي الأشرفية' },
  { id:'st-03', name:'الليرمون',      x: 668, y: 135, lineIds:['line-teal'],      description:'محطة حي الليرمون' },
  { id:'st-04', name:'حلب الجديدة',   x: 861, y: 118, lineIds:['line-teal','line-yellow'], description:'محطة حلب الجديدة الرئيسية' },
  { id:'st-05', name:'الجميلية',      x:1048, y: 133, lineIds:['line-teal'],      description:'محطة حي الجميلية' },
  { id:'st-06', name:'العزيزية',      x:1218, y: 133, lineIds:['line-teal','line-red'], description:'محطة حي العزيزية' },

  // ── Row 2  Y≈289–290  (main central row, longest) ─────────────────
  { id:'st-07', name:'الراشدين',      x: 157, y: 290, lineIds:['line-red'],        description:'محطة حي الراشدين' },
  { id:'st-08', name:'الزهراء',       x: 336, y: 290, lineIds:['line-red','line-blue'], description:'محطة حي الزهراء' },
  { id:'st-09', name:'السبيل',        x: 497, y: 290, lineIds:['line-red','line-blue'], description:'محطة السبيل' },
  { id:'st-10', name:'صلاح الدين',    x: 664, y: 290, lineIds:['line-red'],        description:'محطة حي صلاح الدين' },
  { id:'st-11', name:'الفردوس',       x: 858, y: 290, lineIds:['line-red','line-green'], description:'محطة حي الفردوس' },
  { id:'st-12', name:'باب قنسرين',    x:1045, y: 290, lineIds:['line-red'],        description:'محطة باب قنسرين' },
  { id:'st-13', name:'الكلاسة',       x:1221, y: 290, lineIds:['line-red'],        description:'محطة حي الكلاسة' },
  { id:'st-14', name:'الفرافرة',      x:1339, y: 290, lineIds:['line-blue'],       description:'محطة حي الفرافرة' },
  { id:'st-15', name:'باب النصر',     x:1494, y: 290, lineIds:['line-blue'],       description:'محطة باب النصر' },
  { id:'st-16', name:'باب الجنان',    x:1632, y: 290, lineIds:['line-blue'],       description:'محطة باب الجنان' },
  { id:'st-17', name:'المدينة القديمة',x:1774, y: 290, lineIds:['line-blue'],      description:'محطة المدينة القديمة' },
  { id:'st-18', name:'القلعة',        x:1889, y: 290, lineIds:['line-blue','line-magenta'], description:'محطة قلعة حلب' },
  { id:'st-19', name:'بستان القصر',   x:1983, y: 289, lineIds:['line-blue'],       description:'محطة بستان القصر' },

  // ── Row 3  Y≈384–478 ───────────────────────────────────────────────
  { id:'st-20', name:'الحمدانية',     x: 157, y: 396, lineIds:['line-blue'],       description:'محطة حي الحمدانية' },
  { id:'st-21', name:'سيف الدولة',    x: 323, y: 398, lineIds:['line-green'],      description:'محطة حي سيف الدولة' },
  { id:'st-22', name:'الجلاء',        x: 657, y: 403, lineIds:['line-green'],      description:'محطة شارع الجلاء' },
  { id:'st-23', name:'الجامعة',       x: 842, y: 386, lineIds:['line-green','line-yellow'], description:'محطة المدينة الجامعية' },
  { id:'st-24', name:'المشفى الوطني', x:1048, y: 401, lineIds:['line-yellow'],     description:'محطة المشفى الوطني' },
  { id:'st-25', name:'الشعار',        x:1124, y: 478, lineIds:['line-green'],      description:'محطة حي الشعار' },
  { id:'st-26', name:'الميسر',        x:1488, y: 505, lineIds:['line-yellow'],     description:'محطة حي الميسر' },
  { id:'st-27', name:'المحافظة',      x:2039, y: 384, lineIds:['line-magenta'],    description:'محطة مبنى المحافظة' },
  { id:'st-28', name:'هنانو',         x:2039, y: 505, lineIds:['line-magenta'],    description:'محطة حي هنانو' },

  // ── Row 4  Y≈522–531 ───────────────────────────────────────────────
  { id:'st-29', name:'الأزمة',        x: 157, y: 522, lineIds:['line-blue'],       description:'محطة منطقة الأزمة' },
  { id:'st-30', name:'الحمراء',       x: 321, y: 525, lineIds:['line-blue','line-red'], description:'محطة حي الحمراء' },
  { id:'st-31', name:'المنشية',       x: 447, y: 525, lineIds:['line-magenta'],    description:'محطة المنشية' },
  { id:'st-32', name:'الساعة',        x: 586, y: 525, lineIds:['line-blue','line-red','line-magenta'], description:'محطة ساعة حلب - تقاطع رئيسي' },
  { id:'st-33', name:'باب الفرج',     x: 712, y: 525, lineIds:['line-magenta','line-yellow'], description:'محطة باب الفرج' },
  { id:'st-34', name:'السريان',       x:1060, y: 523, lineIds:['line-yellow'],     description:'محطة حي السريان' },
  { id:'st-35', name:'قاضي عسكر',     x:1184, y: 528, lineIds:['line-magenta'],   description:'محطة قاضي عسكر' },
  { id:'st-36', name:'الصاخور',       x:1335, y: 531, lineIds:['line-magenta'],   description:'محطة حي الصاخور' },
  { id:'st-37', name:'النيرب',        x:1735, y: 522, lineIds:['line-darkgreen'], description:'محطة حي النيرب' },

  // ── Row 5  Y≈646–704 ───────────────────────────────────────────────
  { id:'st-38', name:'الأنصاري',      x: 157, y: 702, lineIds:['line-darkgreen'], description:'محطة حي الأنصاري' },
  { id:'st-39', name:'طريق الباب',    x: 316, y: 702, lineIds:['line-darkgreen'], description:'محطة طريق الباب' },
  { id:'st-40', name:'المرجة',        x: 447, y: 646, lineIds:['line-magenta'],   description:'محطة المرجة' },
  { id:'st-41', name:'مساكن هنانو',   x: 758, y: 701, lineIds:['line-purple'],    description:'محطة مساكن هنانو' },
  { id:'st-42', name:'الميدان',       x:1184, y: 697, lineIds:['line-magenta'],   description:'محطة حي الميدان' },
  { id:'st-43', name:'الزبدية',       x:1347, y: 704, lineIds:['line-maroon'],    description:'محطة حي الزبدية' },
  { id:'st-44', name:'السكري',        x:1505, y: 702, lineIds:['line-magenta'],   description:'محطة حي السكري' },
  { id:'st-45', name:'المعادي',       x:1623, y: 702, lineIds:['line-magenta'],   description:'محطة المعادي' },
  { id:'st-46', name:'بعيدين',        x:1734, y: 701, lineIds:['line-darkgreen'], description:'محطة بعيدين' },
  { id:'st-47', name:'الشيخ خضر',     x:1891, y: 704, lineIds:['line-magenta'],  description:'محطة حي الشيخ خضر' },
  { id:'st-48', name:'الكلاسة الشرقية',x:2046,y: 701, lineIds:['line-purple'],   description:'محطة الكلاسة الشرقية' },

  // ── Row 6  Y≈807–818 ───────────────────────────────────────────────
  { id:'st-49', name:'طريق السفيرة',  x: 443, y: 807, lineIds:['line-maroon'],   description:'محطة طريق السفيرة' },
  { id:'st-50', name:'الراموسة',      x: 884, y: 818, lineIds:['line-green','line-maroon'], description:'محطة الراموسة' },
  { id:'st-51', name:'الخالدية',      x:1347, y: 816, lineIds:['line-maroon'],   description:'محطة حي الخالدية' },

  // ── Row 7  Y≈897 ───────────────────────────────────────────────────
  { id:'st-52', name:'عين التل',      x:1736, y: 897, lineIds:['line-darkgreen'], description:'محطة عين التل' },
  { id:'st-53', name:'تلة الحمدانية', x:1891, y: 897, lineIds:['line-darkgreen'], description:'محطة تلة الحمدانية' },

  // ── Row 8  Y≈941–950 ───────────────────────────────────────────────
  { id:'st-54', name:'نيال',          x: 160, y: 950, lineIds:['line-darkgreen'], description:'محطة نيال' },
  { id:'st-55', name:'خان طومان',     x: 316, y: 947, lineIds:['line-darkgreen'], description:'محطة خان طومان' },
  { id:'st-56', name:'الحاضر',        x: 447, y: 947, lineIds:['line-maroon'],   description:'محطة الحاضر' },
  { id:'st-57', name:'كفر حمرة',      x: 766, y: 947, lineIds:['line-maroon'],   description:'محطة كفر حمرة' },
  { id:'st-58', name:'تل رفعت',       x: 885, y: 946, lineIds:['line-green'],    description:'محطة تل رفعت' },
  { id:'st-59', name:'دير حافر',      x:1347, y: 941, lineIds:['line-maroon'],   description:'محطة دير حافر' },
  { id:'st-60', name:'السفيرة',       x:2033, y: 942, lineIds:['line-maroon'],   description:'محطة مدينة السفيرة' },

  // ── Row 9  Y≈1066–1146 ─────────────────────────────────────────────
  { id:'st-61', name:'خناصر',         x: 444, y:1083, lineIds:['line-maroon'],   description:'محطة خناصر' },
  { id:'st-62', name:'أثريا',         x: 598, y:1082, lineIds:['line-maroon'],   description:'محطة أثريا' },
  { id:'st-63', name:'إثريا',         x: 766, y:1080, lineIds:['line-maroon'],   description:'محطة إثريا' },
  { id:'st-64', name:'رسم الحرمل',    x: 885, y:1070, lineIds:['line-maroon'],  description:'محطة رسم الحرمل' },
  { id:'st-65', name:'العيس',         x:1347, y:1066, lineIds:['line-maroon'],  description:'محطة العيس' },
  { id:'st-66', name:'تادف',          x:1625, y:1066, lineIds:['line-maroon'],  description:'محطة تادف' },
  { id:'st-67', name:'الباب',         x:1743, y:1068, lineIds:['line-maroon'],  description:'محطة مدينة الباب' },
  { id:'st-68', name:'كوكب',          x:1891, y:1070, lineIds:['line-maroon'],  description:'محطة كوكب' },
  { id:'st-69', name:'الأتارب',       x:1349, y:1146, lineIds:['line-maroon'],  description:'محطة الأتارب' },

  // ── Row 10  Y≈1200–1220 ────────────────────────────────────────────
  { id:'st-70', name:'خربة الغزالة',  x: 313, y:1210, lineIds:['line-maroon'],  description:'محطة خربة الغزالة' },
  { id:'st-71', name:'تل حيفا',       x: 443, y:1212, lineIds:['line-maroon'],  description:'محطة تل حيفا' },
  { id:'st-72', name:'معارة الأرتيق', x: 598, y:1201, lineIds:['line-maroon'],  description:'محطة معارة الأرتيق' },
  { id:'st-73', name:'سراقب',         x: 764, y:1200, lineIds:['line-maroon'],  description:'محطة سراقب' },
  { id:'st-74', name:'البيضا',        x: 884, y:1201, lineIds:['line-maroon'],  description:'محطة البيضا' },
  { id:'st-75', name:'الرقة',         x:1347, y:1220, lineIds:['line-maroon'],  description:'محطة الرقة' },

  // ── Row 11  Y≈1291–1355 ────────────────────────────────────────────
  { id:'st-76', name:'دير الزور',     x:1347, y:1291, lineIds:['line-maroon'],  description:'محطة دير الزور' },
  { id:'st-77', name:'الميادين',      x:1347, y:1355, lineIds:['line-maroon'],  description:'محطة الميادين' },
]

// Badge dimensions in SVG units
export const BADGE_W = 318
export const BADGE_H = 68

// Center point of each badge
export const uniqueStations = stations.map(s => ({
  ...s,
  cx: s.x + BADGE_W / 2,   // horizontal center of badge
  cy: s.y + BADGE_H / 2,   // vertical center of badge
}))
