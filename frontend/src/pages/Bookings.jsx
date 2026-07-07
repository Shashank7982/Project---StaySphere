import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBookings } from '../api';
import './SimplePages.css';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookings()
      .then(({ data }) => setBookings(data.bookings || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-page"><div className="spinner"/></div>
  );

  return (
    <div className="ss-simple page-wrapper">
      <div className="ss-simple__header container">
        <h1 className="display-md">My Bookings</h1>
        <p className="ss-simple__sub">Your reserved stays and travel details</p>
      </div>

      <div className="container ss-simple__content">
        {bookings.length === 0 ? (
          <div className="ss-simple__empty">
            <span>✈️</span>
            <h2>No bookings yet</h2>
            <p>Your reserved stays will appear here once you book a stay.</p>
            <Link to="/homes" className="btn btn-primary">Start Exploring</Link>
          </div>
        ) : (
          <div className="bookings-list" style={{ display: 'grid', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
            {bookings.map(b => (
              <div key={b._id} className="booking-card glass" style={{
                display: 'flex',
                gap: '20px',
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                alignItems: 'center',
                background: 'var(--bg-card)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                {b.home?.photo && (
                  <img src={b.home.photo} alt={b.home.houseName} style={{
                    width: '120px',
                    height: '90px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-md)'
                  }} />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    {b.home?.houseName || 'Unknown Property'}
                  </h3>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    📍 {b.home?.location || 'Unknown Location'}
                  </p>
                  <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem' }}>
                    <div>
                      <strong style={{ color: 'var(--text-secondary)' }}>Check-in:</strong> {b.checkIn}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-secondary)' }}>Check-out:</strong> {b.checkOut}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-secondary)' }}>Guests:</strong> {b.guests}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '3px' }}>Total Price</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-orange)' }}>
                    ₹{Number(b.totalPrice).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
