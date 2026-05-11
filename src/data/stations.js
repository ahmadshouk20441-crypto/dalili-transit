export const stations = [
  // Line 1 - Red
  { id: 'st-01', name: 'الجميلية', lineIds: ['line-1'], x: 120, y: 80,  description: 'محطة حي الجميلية الرئيسية' },
  { id: 'st-02', name: 'النيل',     lineIds: ['line-1'], x: 160, y: 110, description: 'محطة شارع النيل' },
  { id: 'st-03', name: 'القلعة',   lineIds: ['line-1', 'line-3'], x: 210, y: 150, description: 'محطة قلعة حلب الأثرية - تقاطع خطوط' },
  { id: 'st-04', name: 'باب النصر', lineIds: ['line-1'], x: 250, y: 175, description: 'محطة باب النصر بالمدينة القديمة' },
  { id: 'st-05', name: 'الكلاسة',  lineIds: ['line-1'], x: 290, y: 160, description: 'محطة حي الكلاسة' },
  { id: 'st-06', name: 'الشيخ مقصود', lineIds: ['line-1'], x: 340, y: 100, description: 'محطة حي الشيخ مقصود' },

  // Line 2 - Blue
  { id: 'st-07', name: 'الحمدانية', lineIds: ['line-2'], x: 80,  y: 300, description: 'محطة حي الحمدانية' },
  { id: 'st-08', name: 'الأزمة',    lineIds: ['line-2'], x: 130, y: 270, description: 'محطة منطقة الأزمة' },
  { id: 'st-09', name: 'السبيل',    lineIds: ['line-2', 'line-5'], x: 185, y: 240, description: 'محطة السبيل - تقاطع خطوط' },
  { id: 'st-10', name: 'الساعة',    lineIds: ['line-2', 'line-3'], x: 235, y: 230, description: 'محطة ساعة حلب - تقاطع خطوط' },
  { id: 'st-11', name: 'المدينة الجديدة', lineIds: ['line-2'], x: 290, y: 250, description: 'محطة المدينة الجديدة' },
  { id: 'st-12', name: 'الجامعة',   lineIds: ['line-2'], x: 350, y: 270, description: 'محطة المدينة الجامعية' },

  // Line 3 - Green
  { id: 'st-13', name: 'العزيزية', lineIds: ['line-3'], x: 100, y: 180, description: 'محطة حي العزيزية' },
  { id: 'st-14', name: 'الفردوس',  lineIds: ['line-3'], x: 145, y: 190, description: 'محطة حي الفردوس' },
  { id: 'st-15', name: 'القلعة',   lineIds: ['line-1', 'line-3'], x: 210, y: 150, description: 'محطة قلعة حلب الأثرية - تقاطع خطوط' },
  { id: 'st-16', name: 'الساعة',   lineIds: ['line-2', 'line-3'], x: 235, y: 230, description: 'محطة ساعة حلب - تقاطع خطوط' },
  { id: 'st-17', name: 'السريان',  lineIds: ['line-3'], x: 305, y: 190, description: 'محطة حي السريان' },

  // Line 4 - Orange/Yellow
  { id: 'st-18', name: 'الزهراء',  lineIds: ['line-4'], x: 90,  y: 380, description: 'محطة حي الزهراء' },
  { id: 'st-19', name: 'المنشية',  lineIds: ['line-4'], x: 150, y: 360, description: 'محطة منطقة المنشية' },
  { id: 'st-20', name: 'باب الفرج', lineIds: ['line-4', 'line-6'], x: 210, y: 330, description: 'محطة باب الفرج - تقاطع خطوط' },
  { id: 'st-21', name: 'هنانو',    lineIds: ['line-4'], x: 280, y: 340, description: 'محطة حي هنانو' },
  { id: 'st-22', name: 'النيرب',   lineIds: ['line-4'], x: 360, y: 360, description: 'محطة حي النيرب' },

  // Line 5 - Purple
  { id: 'st-23', name: 'سيف الدولة', lineIds: ['line-5'], x: 70, y: 220, description: 'محطة حي سيف الدولة' },
  { id: 'st-24', name: 'الجلاء',     lineIds: ['line-5'], x: 115, y: 235, description: 'محطة شارع الجلاء' },
  { id: 'st-25', name: 'السبيل',     lineIds: ['line-2', 'line-5'], x: 185, y: 240, description: 'محطة السبيل - تقاطع خطوط' },
  { id: 'st-26', name: 'المرجة',     lineIds: ['line-5'], x: 265, y: 310, description: 'محطة المرجة' },
  { id: 'st-27', name: 'الراشدين',   lineIds: ['line-5'], x: 60,  y: 400, description: 'محطة حي الراشدين' },

  // Line 6 - Pink
  { id: 'st-28', name: 'صلاح الدين', lineIds: ['line-6'], x: 140, y: 420, description: 'محطة حي صلاح الدين' },
  { id: 'st-29', name: 'العامودي',   lineIds: ['line-6'], x: 175, y: 390, description: 'محطة العامودي' },
  { id: 'st-30', name: 'باب الفرج',  lineIds: ['line-4', 'line-6'], x: 210, y: 330, description: 'محطة باب الفرج - تقاطع خطوط' },
  { id: 'st-31', name: 'الميدان',    lineIds: ['line-6'], x: 255, y: 400, description: 'محطة الميدان' },
]

// deduplicate stations that appear in multiple lines (share same x,y)
export const uniqueStations = stations.reduce((acc, s) => {
  const existing = acc.find(e => e.x === s.x && e.y === s.y)
  if (existing) {
    existing.lineIds = [...new Set([...existing.lineIds, ...s.lineIds])]
    return acc
  }
  return [...acc, { ...s }]
}, [])
