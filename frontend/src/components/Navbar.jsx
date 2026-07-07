import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropRef = useRef(null);

  const isHero = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`ss-navbar ${isHero ? 'ss-navbar--hero' : 'ss-navbar--solid'} ${scrolled ? 'ss-navbar--scrolled' : ''}`}>
      <div className="container">
        <nav className="ss-navbar__inner">
          {/* Logo */}
          <Link to="/" className="ss-navbar__logo">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradA" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f97316"/>
                  <stop offset="100%" stopColor="#fbbf24"/>
                </linearGradient>
                <radialGradient id="logoGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(249,115,22,0.18)"/>
                  <stop offset="100%" stopColor="rgba(249,115,22,0)"/>
                </radialGradient>
              </defs>
              {/* Glow circle */}
              <circle cx="18" cy="18" r="17" fill="url(#logoGlow)"/>
              {/* Globe ring outer */}
              <circle cx="18" cy="18" r="12" stroke="url(#logoGradA)" strokeWidth="1.5" fill="none" opacity="0.5"/>
              {/* Globe horizontal equator */}
              <ellipse cx="18" cy="18" rx="12" ry="5" stroke="url(#logoGradA)" strokeWidth="1.2" fill="none" opacity="0.35"/>
              {/* Globe vertical meridian */}
              <line x1="18" y1="6" x2="18" y2="30" stroke="url(#logoGradA)" strokeWidth="1.2" opacity="0.35"/>
              {/* Location pin */}
              <path d="M18 8C14.686 8 12 10.686 12 14C12 18.5 18 26 18 26C18 26 24 18.5 24 14C24 10.686 21.314 8 18 8Z" fill="url(#logoGradA)"/>
              {/* Pin inner circle */}
              <circle cx="18" cy="14" r="2.5" fill="white" opacity="0.9"/>
            </svg>
            <span className="ss-navbar__brand">StaySphere</span>
          </Link>

          {/* Desktop Nav */}
          <div className="ss-navbar__links">
            {isLoggedIn && user?.userType === 'guest' && (
              <>
                <Link to="/homes" className={`ss-navbar__link ${isActive('/homes') ? 'active' : ''}`}>Homes</Link>
                <Link to="/favourites" className={`ss-navbar__link ${isActive('/favourites') ? 'active' : ''}`}>Saved</Link>
                <Link to="/bookings" className={`ss-navbar__link ${isActive('/bookings') ? 'active' : ''}`}>My Bookings</Link>
              </>
            )}
            {isLoggedIn && user?.userType === 'host' && (
              <>
                <Link to="/host/dashboard" className={`ss-navbar__link ${isActive('/host/dashboard') ? 'active' : ''}`}>Dashboard</Link>
                <Link to="/host/add" className={`ss-navbar__link ${isActive('/host/add') ? 'active' : ''}`}>List Home</Link>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="ss-navbar__actions">
            {isLoggedIn ? (
              <div className="ss-navbar__user-menu" ref={dropRef}>
                <button
                  className="ss-navbar__avatar-btn"
                  onClick={(e) => { e.stopPropagation(); setDropOpen(d => !d); }}
                >
                  <span className="ss-navbar__avatar">
                    {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                {dropOpen && (
                  <div className="ss-navbar__dropdown animate-scale-in">
                    <div className="ss-navbar__dropdown-header">
                      <p className="ss-navbar__dropdown-name">{user?.firstName} {user?.lastName}</p>
                      <p className="ss-navbar__dropdown-email">{user?.email}</p>
                    </div>
                    <button className="ss-navbar__dropdown-item ss-navbar__dropdown-item--danger" onClick={handleLogout}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                      </svg>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="ss-navbar__auth">
                <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button className="ss-navbar__mobile-toggle" onClick={() => setMenuOpen(m => !m)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen
                  ? <path d="M6 18L18 6M6 6l12 12"/>
                  : <path d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="ss-navbar__mobile animate-fade-up">
            {isLoggedIn && user?.userType === 'guest' && (
              <>
                <Link to="/homes" className="ss-navbar__mobile-link" onClick={() => setMenuOpen(false)}>Homes</Link>
                <Link to="/favourites" className="ss-navbar__mobile-link" onClick={() => setMenuOpen(false)}>Saved</Link>
                <Link to="/bookings" className="ss-navbar__mobile-link" onClick={() => setMenuOpen(false)}>My Bookings</Link>
              </>
            )}
            {isLoggedIn && user?.userType === 'host' && (
              <>
                <Link to="/host/dashboard" className="ss-navbar__mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/host/add" className="ss-navbar__mobile-link" onClick={() => setMenuOpen(false)}>List Home</Link>
              </>
            )}
            {isLoggedIn ? (
              <button className="ss-navbar__mobile-link ss-navbar__mobile-link--danger" onClick={handleLogout}>Log out</button>
            ) : (
              <>
                <Link to="/login" className="ss-navbar__mobile-link" onClick={() => setMenuOpen(false)}>Log in</Link>
                <Link to="/signup" className="ss-navbar__mobile-link ss-navbar__mobile-link--cta" onClick={() => setMenuOpen(false)}>Sign up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
