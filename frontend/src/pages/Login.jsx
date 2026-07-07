import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      const data = await login(email, password);
      navigate('/');
    } catch (err) {
      const msgs = err.response?.data?.errors;
      setErrors(Array.isArray(msgs) ? msgs : ['Login failed. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ss-auth">
      {/* Background video */}
      <div className="ss-auth__bg">
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
        >
          <source src="/auth-bg.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="ss-auth__card glass animate-scale-in">
        {/* Logo */}
        <Link to="/" className="ss-auth__logo">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#f59e0b"/>
            </linearGradient></defs>
            <circle cx="16" cy="10" r="5" fill="url(#lg)"/>
            <path d="M16 16 C10 16 6 20 6 25 L26 25 C26 20 22 16 16 16Z" fill="url(#lg)" opacity="0.85"/>
          </svg>
          <span>StaySphere</span>
        </Link>

        <h1 className="ss-auth__title">Welcome back</h1>
        <p className="ss-auth__sub">Sign in to your account to continue</p>

        {errors.length > 0 && (
          <div className="ss-auth__errors">
            {errors.map((e, i) => (
              <p key={i} className="form-error">⚠ {typeof e === 'string' ? e : e.msg}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="ss-auth__form" id="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
            id="login-submit"
          >
            {loading ? <span className="spinner" style={{width:20,height:20,borderWidth:2}}/> : 'Sign In'}
          </button>
        </form>

        <p className="ss-auth__footer">
          Don't have an account?{' '}
          <Link to="/signup" className="ss-auth__link">Create one</Link>
        </p>
      </div>
    </div>
  );
}
