import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="ss-footer">
      <div className="container">
        <div className="ss-footer__grid">
          <div className="ss-footer__brand">
            <div className="ss-footer__logo">
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="footerGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f97316"/>
                    <stop offset="100%" stopColor="#fbbf24"/>
                  </linearGradient>
                  <radialGradient id="footerGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(249,115,22,0.15)"/>
                    <stop offset="100%" stopColor="rgba(249,115,22,0)"/>
                  </radialGradient>
                </defs>
                <circle cx="18" cy="18" r="17" fill="url(#footerGlow)"/>
                <circle cx="18" cy="18" r="12" stroke="url(#footerGrad)" strokeWidth="1.5" fill="none" opacity="0.5"/>
                <ellipse cx="18" cy="18" rx="12" ry="5" stroke="url(#footerGrad)" strokeWidth="1.2" fill="none" opacity="0.35"/>
                <line x1="18" y1="6" x2="18" y2="30" stroke="url(#footerGrad)" strokeWidth="1.2" opacity="0.35"/>
                <path d="M18 8C14.686 8 12 10.686 12 14C12 18.5 18 26 18 26C18 26 24 18.5 24 14C24 10.686 21.314 8 18 8Z" fill="url(#footerGrad)"/>
                <circle cx="18" cy="14" r="2.5" fill="white" opacity="0.9"/>
              </svg>
              <span>StaySphere</span>
            </div>
            <p className="ss-footer__tagline">Find your perfect stay at the best price. Premium rentals worldwide.</p>
          </div>

          <div className="ss-footer__col">
            <h4>Explore</h4>
            <Link to="/homes">All Homes</Link>
            <Link to="/homes?category=beachfront">Beachfront</Link>
            <Link to="/homes?category=luxe">Luxe</Link>
            <Link to="/homes?category=cabins">Cabins</Link>
          </div>

          <div className="ss-footer__col">
            <h4>Account</h4>
            <Link to="/login">Log In</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/bookings">My Trips</Link>
            <Link to="/favourites">Saved</Link>
          </div>

          <div className="ss-footer__col">
            <h4>Hosting</h4>
            <Link to="/host/add">List Your Home</Link>
            <Link to="/host/dashboard">Dashboard</Link>
          </div>
        </div>

        <div className="ss-footer__bottom">
          <p>© {new Date().getFullYear()} StaySphere. All rights reserved.</p>
          <p>Built with ❤️ for travelers worldwide</p>
        </div>
      </div>
    </footer>
  );
}
