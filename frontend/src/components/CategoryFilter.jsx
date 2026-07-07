import './CategoryFilter.css';

const CATEGORIES = [
  { id: 'all',          label: 'All Homes', icon: '🏠' },
  { id: 'trending',     label: 'Trending',  icon: '🔥' },
  { id: 'beachfront',   label: 'Beachfront',icon: '🏖️' },
  { id: 'amazing-views',label: 'Views',     icon: '🌄' },
  { id: 'cabins',       label: 'Cabins',    icon: '🪵' },
  { id: 'countryside',  label: 'Country',   icon: '🌿' },
  { id: 'luxe',         label: 'Luxe',      icon: '💎' },
  { id: 'luxury',       label: 'Luxury',    icon: '✨' },
  { id: 'design',       label: 'Design',    icon: '🎨' },
  { id: 'last-minute',  label: 'Last Min',  icon: '⚡' },
];

export default function CategoryFilter({ current, onChange }) {
  return (
    <div className="ss-filter">
      <div className="ss-filter__track hide-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`ss-filter__btn ${current === cat.id ? 'active' : ''}`}
            onClick={() => onChange(cat.id)}
            id={`filter-${cat.id}`}
          >
            <span className="ss-filter__icon">{cat.icon}</span>
            <span className="ss-filter__label">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
