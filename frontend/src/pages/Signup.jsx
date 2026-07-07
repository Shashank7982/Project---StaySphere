import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Signup() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', userType: ''
  });
  const [errors, setErrors]   = useState([]);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate   = useNavigate();

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      await signup(form);
      navigate('/login');
    } catch (err) {
      const msgs = err.response?.data?.errors;
      setErrors(Array.isArray(msgs) ? msgs : ['Registration failed. Please try again.']);
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

      <div className="ss-auth__card ss-auth__card--wide glass animate-scale-in">
        <Link to="/" className="ss-auth__logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#f59e0b"/>
            </linearGradient></defs>
            <circle cx="16" cy="10" r="5" fill="url(#sg)"/>
            <path d="M16 16 C10 16 6 20 6 25 L26 25 C26 20 22 16 16 16Z" fill="url(#sg)" opacity="0.85"/>
          </svg>
          <span>StaySphere</span>
        </Link>

        <h1 className="ss-auth__title">Create account</h1>
        <p className="ss-auth__sub">Join thousands of travelers & hosts</p>

        {errors.length > 0 && (
          <div className="ss-auth__errors">
            {errors.map((e, i) => (
              <p key={i} className="form-error">⚠ {typeof e === 'string' ? e : e.msg}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="ss-auth__form" id="signup-form">
          <div className="ss-auth__row">
            <div className="form-group">
              <label className="form-label" htmlFor="signup-first">First Name</label>
              <input id="signup-first" type="text" className="form-input" placeholder="John"
                value={form.firstName} onChange={update('firstName')} required/>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-last">Last Name</label>
              <input id="signup-last" type="text" className="form-input" placeholder="Doe"
                value={form.lastName} onChange={update('lastName')}/>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email</label>
            <input id="signup-email" type="email" className="form-input" placeholder="you@example.com"
              value={form.email} onChange={update('email')} required autoComplete="email"/>
          </div>

          <div className="ss-auth__row">
            <div className="form-group">
              <label className="form-label" htmlFor="signup-pass">Password</label>
              <input id="signup-pass" type="password" className="form-input" placeholder="Min 8 characters"
                value={form.password} onChange={update('password')} required/>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
              <input id="signup-confirm" type="password" className="form-input" placeholder="Repeat password"
                value={form.confirmPassword} onChange={update('confirmPassword')} required/>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-type">I am a</label>
            <select id="signup-type" className="form-select" value={form.userType} onChange={update('userType')} required>
              <option value="" disabled>Select role</option>
              <option value="guest">Guest — I want to book stays</option>
              <option value="host">Host — I want to list my property</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}
            disabled={loading} id="signup-submit">
            {loading ? <span className="spinner" style={{width:20,height:20,borderWidth:2}}/> : 'Create Account'}
          </button>
        </form>

        <p className="ss-auth__footer">
          Already have an account?{' '}
          <Link to="/login" className="ss-auth__link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
