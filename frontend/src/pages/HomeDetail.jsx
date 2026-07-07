import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getHomeById, addToFavourites, createBooking } from '../api';
import { useAuth } from '../context/AuthContext';
import './HomeDetail.css';

export default function HomeDetail() {
  const { homeId } = useParams();
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favMsg, setFavMsg] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [isReserved, setIsReserved] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getHomeById(homeId)
      .then(({ data }) => setHome(data.home))
      .catch(() => navigate('/homes'))
      .finally(() => setLoading(false));
  }, [homeId]);

  const handleFavourite = async () => {
    if (!isLoggedIn) return navigate('/login');
    try {
      await addToFavourites(homeId);
      setFavMsg('Saved to favourites!');
      setTimeout(() => setFavMsg(''), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const getNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end - start;
    if (diff <= 0) return 1;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleReserve = async () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates.');
      return;
    }
    try {
      await createBooking({
        homeId: home._id,
        checkIn,
        checkOut,
        guests,
        totalPrice
      });
      setIsReserved(true);
      alert(`Booking Reserved successfully!\nStay: ${home.houseName}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nGuests: ${guests}\nTotal Price: ₹${totalPrice.toLocaleString('en-IN')}`);
      setTimeout(() => {
        navigate('/bookings');
      }, 1500);
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to reserve booking.');
    }
  };


  if (loading) return (
    <div className="loading-page"><div className="spinner"/></div>
  );

  if (!home) return null;

  const rating = parseFloat(home.rating) || 0;
  const nights = getNights();
  const totalPrice = Number(home.price) * guests * nights;


  return (
    <div className="ss-detail page-wrapper">
      {/* Hero Image */}
      <div className="ss-detail__hero">
        <img src={home.photo} alt={home.houseName} className="ss-detail__img"/>
        <div className="ss-detail__hero-overlay"/>
        <button className="ss-detail__back btn btn-glass" onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        {favMsg && <div className="toast">{favMsg}</div>}
      </div>

      <div className="container ss-detail__body">
        {/* Left: details */}
        <div className="ss-detail__info">
          <div className="ss-detail__header">
            <div>
              <div className="ss-detail__badges">
                <span className="badge badge-glass">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {home.location}
                </span>
                {home.category && <span className="badge badge-orange">{home.category}</span>}
              </div>
              <h1 className="ss-detail__title">{home.houseName}</h1>
            </div>

            <div className="ss-detail__rating">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{color:'var(--accent-amber)'}}>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span>{rating.toFixed(1)}</span>
              {rating >= 4.8 && <span className="badge badge-amber">Superhost</span>}
            </div>
          </div>

          <div className="ss-detail__divider"/>

          <div className="ss-detail__section">
            <h2>About this place</h2>
            <p>{home.description || 'No description provided.'}</p>
          </div>

          <div className="ss-detail__section">
            <h2>What this place offers</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '15px' }}>
              {home.amenities && home.amenities.length > 0 ? (
                home.amenities.map((amenity, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    <span style={{ fontSize: '1.2rem', color: 'var(--accent-orange)' }}>✦</span>
                    {amenity}
                  </div>
                ))
              ) : (
                <p>Standard amenities included.</p>
              )}
            </div>
          </div>

          <div className="ss-detail__section">
            <h2>Guest Reviews ({home.reviews ? home.reviews.length : 0})</h2>
            <div style={{ display: 'grid', gap: '15px', marginTop: '15px' }}>
              {home.reviews && home.reviews.length > 0 ? (
                home.reviews.map((review, idx) => (
                  <div key={idx} className="glass" style={{ padding: '15px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{review.author}</strong>
                      <span style={{ color: 'var(--accent-amber)', fontSize: '0.9rem' }}>
                        {'★'.repeat(Math.round(review.rating))} ({review.rating}/5)
                      </span>
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      "{review.comment}"
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{review.date}</span>
                  </div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>
          </div>

          {home.rulesPdf && isLoggedIn && (
            <div className="ss-detail__section">
              <h2>House Rules</h2>
              <a
                href={`/api/store/rulesPdf/${home._id}`}
                className="btn btn-glass"
                download="Rules.pdf"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L12 16M12 16l-4-4m4 4l4-4M2 20h20"/>
                </svg>
                Download Rules PDF
              </a>
            </div>
          )}
        </div>

        {/* Right: booking card */}
        <aside className="ss-detail__booking glass">
          <div className="ss-detail__price-row">
            <span className="ss-detail__price">₹{Number(home.price).toLocaleString('en-IN')}</span>
            <span className="ss-detail__price-unit">/ night</span>
          </div>

          <div className="ss-detail__booking-inputs">
            <div className="form-group">
              <label className="form-label">Check-in *</label>
              <input type="date" className="form-input" id="detail-checkin" value={checkIn} onChange={e => setCheckIn(e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">Check-out *</label>
              <input type="date" className="form-input" id="detail-checkout" value={checkOut} onChange={e => setCheckOut(e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">Guests *</label>
              <input type="number" min="1" value={guests} onChange={e => setGuests(parseInt(e.target.value) || 1)} className="form-input" id="detail-guests"/>
            </div>
          </div>

          <div className="ss-detail__price-eval" style={{ margin: '15px 0', fontSize: '0.9rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>₹{Number(home.price).toLocaleString('en-IN')} x {guests} guests</span>
              <span>₹{(Number(home.price) * guests).toLocaleString('en-IN')} / night</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Nights</span>
              <span>{nights}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '8px', marginTop: '5px', color: 'var(--text-primary)' }}>
              <span>Total Price</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {isLoggedIn ? (
            <button className="btn btn-primary" style={{width:'100%'}} id="book-btn" onClick={handleReserve} disabled={isReserved}>
              {isReserved ? 'Stay Reserved' : 'Reserve Now'}
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{width:'100%', textAlign:'center'}} id="book-login-btn">
              Log in to Book
            </Link>
          )}

          {isLoggedIn && user?.userType === 'guest' && (
            <button className="btn btn-glass" style={{width:'100%'}} onClick={handleFavourite} id="save-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
              Save to Favourites
            </button>
          )}

          <p className="ss-detail__booking-note">You won't be charged yet</p>
        </aside>
      </div>
    </div>
  );
}
