import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addHome, getEditHome, editHome } from '../api';
import './EditHome.css';

const CATEGORIES = ['all','beachfront','amazing-views','cabins','last-minute','trending','countryside','luxe','design','luxury'];

export default function EditHome({ editing = false }) {
  const { homeId } = useParams();
  const navigate   = useNavigate();
  const [form, setForm] = useState({
    houseName: '', location: '', price: '', rating: '', description: '', category: 'all',
    amenities: '', reviews: []
  });
  const [newReview, setNewReview] = useState({ author: '', rating: 5, comment: '' });
  const [photo, setPhoto]       = useState(null);
  const [rulesPdf, setRulesPdf] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [preview, setPreview]   = useState('');

  useEffect(() => {
    if (editing && homeId) {
      getEditHome(homeId)
        .then(({ data }) => {
          if (data.home) {
            const h = data.home;
            setForm({
              houseName: h.houseName, location: h.location, price: h.price,
              rating: h.rating, description: h.description || '', category: h.category || 'all',
              amenities: h.amenities ? h.amenities.join(', ') : '',
              reviews: h.reviews || []
            });
            setPreview(h.photo);
          }
        })
        .catch(console.error);
    }
  }, [editing, homeId]);

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleAddReview = () => {
    if (!newReview.author || !newReview.comment) return alert('Please enter both author name and comment.');
    setForm(f => ({
      ...f,
      reviews: [...f.reviews, { ...newReview, date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) }]
    }));
    setNewReview({ author: '', rating: 5, comment: '' });
  };

  const handleRemoveReview = (idx) => {
    setForm(f => ({
      ...f,
      reviews: f.reviews.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const fd = new FormData();
    
    // Append fields
    fd.append('houseName', form.houseName);
    fd.append('location', form.location);
    fd.append('price', form.price);
    fd.append('rating', form.rating);
    fd.append('description', form.description);
    fd.append('category', form.category);
    if (editing) fd.append('id', homeId);

    // Convert amenities to array and append as JSON
    const amArr = form.amenities.split(',').map(s => s.trim()).filter(Boolean);
    fd.append('amenities', JSON.stringify(amArr));

    // Append reviews as JSON
    fd.append('reviews', JSON.stringify(form.reviews));

    if (photo)    fd.append('photo', photo);
    if (rulesPdf) fd.append('rulesPdf', rulesPdf);

    try {
      if (editing) await editHome(fd);
      else         await addHome(fd);
      navigate('/host/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ss-edit page-wrapper">
      <div className="ss-edit__header container">
        <h1 className="display-md">{editing ? 'Edit Property' : 'List Your Home'}</h1>
        <p className="ss-edit__sub">
          {editing ? 'Update your listing details below.' : 'Share your space with travelers worldwide.'}
        </p>
      </div>

      <div className="container ss-edit__body">
        <form onSubmit={handleSubmit} className="ss-edit__form glass" id="home-form" encType="multipart/form-data">
          {error && (
            <div className="ss-auth__errors" style={{marginBottom:0}}>
              <p className="form-error">⚠ {error}</p>
            </div>
          )}

          <div className="ss-edit__row">
            <div className="form-group">
              <label className="form-label" htmlFor="home-name">Property Name *</label>
              <input id="home-name" type="text" className="form-input" placeholder="e.g. Lakeside Villa"
                value={form.houseName} onChange={update('houseName')} required/>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="home-location">Location *</label>
              <input id="home-location" type="text" className="form-input" placeholder="e.g. Goa, India"
                value={form.location} onChange={update('location')} required/>
            </div>
          </div>

          <div className="ss-edit__row">
            <div className="form-group">
              <label className="form-label" htmlFor="home-price">Price per Night (₹) *</label>
              <input id="home-price" type="number" className="form-input" placeholder="5000"
                value={form.price} onChange={update('price')} required min="1"/>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="home-rating">Rating (0–5) *</label>
              <input id="home-rating" type="number" className="form-input" placeholder="4.5"
                value={form.rating} onChange={update('rating')} required min="0" max="5" step="0.1"/>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="home-category">Category</label>
            <select id="home-category" className="form-select" value={form.category} onChange={update('category')}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="home-desc">Description</label>
            <textarea id="home-desc" className="form-input ss-edit__textarea"
              placeholder="Describe your property..."
              value={form.description} onChange={update('description')} rows={4}/>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="home-amenities">Amenities / Facilities (comma-separated)</label>
            <input id="home-amenities" type="text" className="form-input"
              placeholder="e.g. High-speed Wi-Fi, Swimming pool, Air conditioning"
              value={form.amenities} onChange={update('amenities')}/>
          </div>

          <div className="form-group" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', marginTop: '20px' }}>
            <label className="form-label">Manage Reviews</label>
            
            {/* List of existing reviews */}
            <div style={{ display: 'grid', gap: '10px', marginBottom: '15px' }}>
              {form.reviews && form.reviews.map((rev, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{rev.author} ({rev.rating}★)</strong>
                    <p style={{ margin: '3px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{rev.comment}</p>
                  </div>
                  <button type="button" className="btn btn-ghost btn-sm" style={{ color: '#f87171', padding: '4px 8px' }} onClick={() => handleRemoveReview(idx)}>Remove</button>
                </div>
              ))}
            </div>

            {/* Add new review */}
            <div className="glass" style={{ padding: '15px', borderRadius: 'var(--radius-md)', display: 'grid', gap: '10px', background: 'rgba(255,255,255,0.01)' }}>
              <h4 style={{ margin: '0', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Add a Guest Review</h4>
              <div className="ss-edit__row" style={{ marginBottom: '5px' }}>
                <div className="form-group">
                  <input type="text" className="form-input" placeholder="Author Name"
                    value={newReview.author} onChange={e => setNewReview(r => ({ ...r, author: e.target.value }))}/>
                </div>
                <div className="form-group">
                  <select className="form-select" value={newReview.rating} onChange={e => setNewReview(r => ({ ...r, rating: parseInt(e.target.value) || 5 }))}>
                    {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <textarea className="form-input" rows={2} placeholder="Review Comment..."
                  value={newReview.comment} onChange={e => setNewReview(r => ({ ...r, comment: e.target.value }))}/>
              </div>
              <button type="button" className="btn btn-glass btn-sm" style={{ width: 'fit-content' }} onClick={handleAddReview}>Add Review</button>
            </div>
          </div>

          <div className="ss-edit__row">
            <div className="form-group">
              <label className="form-label" htmlFor="home-photo">
                {editing ? 'Change Photo' : 'Property Photo *'}
              </label>
              {preview && (
                <div className="ss-edit__preview">
                  <img src={preview} alt="preview"/>
                </div>
              )}
              <input id="home-photo" type="file" accept="image/*" className="ss-edit__file"
                onChange={e => { setPhoto(e.target.files[0]); if (e.target.files[0]) setPreview(URL.createObjectURL(e.target.files[0])); }}
                required={!editing}/>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="home-pdf">House Rules PDF (optional)</label>
              <input id="home-pdf" type="file" accept="application/pdf" className="ss-edit__file"
                onChange={e => setRulesPdf(e.target.files[0])}/>
            </div>
          </div>

          <div className="ss-edit__actions">
            <button type="button" className="btn btn-glass" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} id="home-submit">
              {loading
                ? <span className="spinner" style={{width:20,height:20,borderWidth:2}}/>
                : (editing ? 'Save Changes' : 'List Property')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
