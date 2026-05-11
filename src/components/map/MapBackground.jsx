// Decorative city background shapes for Aleppo map
export default function MapBackground() {
  return (
    <g opacity="0.18">
      {/* City grid hint */}
      <rect x="50" y="50" width="380" height="420" rx="8" fill="none" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="4 4" />

      {/* Main roads */}
      <line x1="50" y1="250" x2="430" y2="250" stroke="#94a3b8" strokeWidth="1" />
      <line x1="215" y1="50" x2="215" y2="470" stroke="#94a3b8" strokeWidth="1" />
      <line x1="50" y1="150" x2="430" y2="150" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3 6" />
      <line x1="50" y1="350" x2="430" y2="350" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3 6" />
      <line x1="130" y1="50" x2="130" y2="470" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3 6" />
      <line x1="310" y1="50" x2="310" y2="470" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3 6" />

      {/* Citadel landmark */}
      <circle cx="210" cy="150" r="18" fill="#94a3b8" opacity="0.3" />
      <text x="210" y="155" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="Cairo, sans-serif">قلعة</text>

      {/* Old city area */}
      <rect x="170" y="120" width="80" height="70" rx="6" fill="none" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 3" />
      <text x="210" y="210" textAnchor="middle" fontSize="8" fill="#64748b" fontFamily="Cairo, sans-serif">المدينة القديمة</text>

      {/* University area */}
      <rect x="310" y="240" width="70" height="60" rx="6" fill="none" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 3" />
      <text x="345" y="295" textAnchor="middle" fontSize="8" fill="#64748b" fontFamily="Cairo, sans-serif">الجامعة</text>

      {/* Compass */}
      <g transform="translate(415, 65)">
        <circle cx="0" cy="0" r="10" fill="none" stroke="#94a3b8" strokeWidth="1" />
        <text x="0" y="-14" textAnchor="middle" fontSize="8" fill="#64748b" fontFamily="Cairo, sans-serif">ش</text>
        <line x1="0" y1="-8" x2="0" y2="8" stroke="#94a3b8" strokeWidth="1" />
        <line x1="-8" y1="0" x2="8" y2="0" stroke="#94a3b8" strokeWidth="1" />
        <polygon points="0,-8 -3,-2 3,-2" fill="#ef4444" opacity="0.7" />
      </g>
    </g>
  )
}
