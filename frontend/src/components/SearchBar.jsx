import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

export default function SearchBar({ className = '' }) {
  const [location, setLocation] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [guests, setGuests] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (checkin)  params.set('checkin', checkin);
    if (checkout) params.set('checkout', checkout);
    if (guests)   params.set('guests', guests);
    navigate(`/homes/search?${params.toString()}`);
  };

  return (
    <form className={`ss-search ${className}`} onSubmit={handleSearch} id="hero-search-form">
      <div className="ss-search__group">
        <div className="ss-search__field">
          <label className="ss-search__label">Where</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Search destinations"
            className="ss-search__input"
            id="search-location"
          />
        </div>

        <div className="ss-search__divider"/>

        <div className="ss-search__field">
          <label className="ss-search__label">Check in</label>
          <input
            type="date"
            value={checkin}
            onChange={e => setCheckin(e.target.value)}
            className="ss-search__input"
            id="search-checkin"
          />
        </div>

        <div className="ss-search__divider"/>

        <div className="ss-search__field">
          <label className="ss-search__label">Check out</label>
          <input
            type="date"
            value={checkout}
            onChange={e => setCheckout(e.target.value)}
            className="ss-search__input"
            id="search-checkout"
          />
        </div>

        <div className="ss-search__divider"/>

        <div className="ss-search__field ss-search__field--guests">
          <label className="ss-search__label">Guests</label>
          <input
            type="number"
            min="1"
            value={guests}
            onChange={e => setGuests(e.target.value)}
            placeholder="Add guests"
            className="ss-search__input"
            id="search-guests"
          />
        </div>

        <button type="submit" className="ss-search__btn" id="search-submit-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <span>Search</span>
        </button>
      </div>
    </form>
  );
}
