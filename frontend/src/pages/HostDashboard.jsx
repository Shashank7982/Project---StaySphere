import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHostHomes, deleteHome } from '../api';
import './HostDashboard.css';

export default function HostDashboard() {
  const [homes, setHomes]     = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getHostHomes()
      .then(({ data }) => setHomes(data.homes || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (homeId) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await deleteHome(homeId);
      setHomes(h => h.filter(x => x._id !== homeId));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="ss-host page-wrapper">
      <div className="ss-host__header container">
        <div>
          <h1 className="display-md">My Properties</h1>
          <p className="ss-host__sub">{homes.length} {homes.length === 1 ? 'listing' : 'listings'}</p>
        </div>
        <Link to="/host/add" className="btn btn-primary" id="add-home-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add Property
        </Link>
      </div>

      <div className="container">
        {loading ? (
          <div className="ss-host__loading"><div className="spinner"/></div>
        ) : homes.length === 0 ? (
          <div className="ss-host__empty">
            <span>🏠</span>
            <h2>No listings yet</h2>
            <p>Start earning by listing your first property.</p>
            <Link to="/host/add" className="btn btn-primary">List Your Home</Link>
          </div>
        ) : (
          <div className="ss-host__grid">
            {homes.map(home => (
              <div key={home._id} className="ss-host__card glass">
                <div className="ss-host__card-img">
                  <img src={home.photo} alt={home.houseName}/>
                  <span className="badge badge-glass ss-host__cat">{home.category || 'all'}</span>
                </div>
                <div className="ss-host__card-body">
                  <h3 className="ss-host__card-title">{home.houseName}</h3>
                  <p className="ss-host__card-location">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {home.location}
                  </p>
                  <div className="ss-host__card-meta">
                    <span className="ss-host__price">₹{Number(home.price).toLocaleString('en-IN')}<small>/night</small></span>
                    <span className="badge badge-amber">★ {home.rating}</span>
                  </div>
                  <div className="ss-host__actions">
                    <Link to={`/host/edit/${home._id}`} className="btn btn-glass btn-sm" id={`edit-${home._id}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </Link>
                    <button className="btn btn-sm ss-host__delete" onClick={() => handleDelete(home._id)} id={`delete-${home._id}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                      </svg>
                      Delete
                    </button>
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
