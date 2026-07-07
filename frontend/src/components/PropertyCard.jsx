import { Link } from 'react-router-dom';
import './PropertyCard.css';

export default function PropertyCard({ home, onFavourite, isFavourited }) {
  const rating = parseFloat(home.rating) || 0;
  const isSuperhost = rating >= 4.8;

  return (
    <article className="ss-property-card">
      <Link to={`/homes/${home._id}`} className="ss-property-card__link">
        <div className="ss-property-card__image-wrap">
          <img
            src={home.photo}
            alt={home.houseName}
            loading="lazy"
            className="ss-property-card__image"
          />
          {/* Gradient overlay */}
          <div className="ss-property-card__overlay"/>

          {/* Badges */}
          <div className="ss-property-card__top">
            {isSuperhost && (
              <span className="badge badge-amber">⭐ Superhost</span>
            )}
          </div>

          <div className="ss-property-card__bottom">
            <span className="ss-property-card__category badge badge-glass">
              {home.category || 'All'}
            </span>
          </div>

          {/* Rating */}
          <div className="ss-property-card__rating">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span>{rating.toFixed(1)}</span>
          </div>

          {/* Favourite button */}
          {onFavourite && (
            <button
              className={`ss-property-card__fav ${isFavourited ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); onFavourite(home._id); }}
              title={isFavourited ? 'Remove from saved' : 'Save'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavourited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </button>
          )}
        </div>

        <div className="ss-property-card__info">
          <div className="ss-property-card__meta">
            <span className="ss-property-card__location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {home.location}
            </span>
          </div>
          <h3 className="ss-property-card__title">{home.houseName}</h3>
          <p className="ss-property-card__desc" style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            margin: '4px 0 8px 0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {home.description || 'No description available'}
          </p>
          <div className="ss-property-card__price">
            <span className="ss-property-card__price-amount">₹{Number(home.price).toLocaleString('en-IN')}</span>
            <span className="ss-property-card__price-unit">/ night</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
