import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import CategoryFilter from '../components/CategoryFilter';
import { getHomes } from '../api';
import './Home.css';

export default function Home() {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    setLoading(true);
    getHomes(category)
      .then(({ data }) => setHomes(data.homes || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="ss-home">
      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="ss-hero" id="hero">
        {/* Background video */}
        <div className="ss-hero__bg">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="ss-hero__video"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="ss-hero__bg-overlay"/>
        </div>

        {/* Hero content */}
        <div className="ss-hero__content">
          <div className="ss-hero__badges animate-fade-up">
            <span className="badge badge-orange">✦ Premium Stays</span>
            <span className="badge badge-glass">🌍 Worldwide</span>
          </div>

          <h1 className="ss-hero__headline animate-fade-up delay-1">
            Find Your Perfect Stay<br/>
            <span className="text-gradient">at the Best Price.</span>
          </h1>

          <p className="ss-hero__sub animate-fade-up delay-2">
            Discover handpicked villas, cabins, and luxury escapes in the world's most stunning destinations.
          </p>

          {/* Search bar */}
          <div className="ss-hero__search animate-fade-up delay-3">
            <SearchBar />
          </div>

          {/* Quick stats */}
          <div className="ss-hero__stats animate-fade-up delay-4">
            {[
              { num: '10K+', label: 'Properties' },
              { num: '50+',  label: 'Countries' },
              { num: '4.9★', label: 'Rating' },
            ].map(stat => (
              <div key={stat.label} className="ss-hero__stat">
                <span className="ss-hero__stat-num">{stat.num}</span>
                <span className="ss-hero__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="ss-hero__scroll-hint">
          <div className="ss-hero__scroll-dot"/>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ── Properties Section ───────────────────────────────── */}
      <section className="ss-home__listings container">
        <div className="ss-home__listings-header">
          <div>
            <h2 className="display-md">Featured Stays</h2>
            <p className="ss-home__listings-sub">Handpicked properties for your next escape</p>
          </div>
          <Link to="/homes" className="btn btn-glass">View All →</Link>
        </div>

        <CategoryFilter current={category} onChange={setCategory} />

        {loading ? (
          <div className="ss-home__loading">
            <div className="spinner"/>
          </div>
        ) : homes.length === 0 ? (
          <div className="ss-home__empty">
            <div className="ss-home__empty-icon">🏠</div>
            <h3>No homes available</h3>
            <p>Check back soon for new listings.</p>
          </div>
        ) : (
          <div className="grid-properties ss-home__grid">
            {homes.slice(0, 8).map((home, i) => (
              <div key={home._id} className="animate-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <PropertyCard home={home} />
              </div>
            ))}
          </div>
        )}

        {homes.length > 0 && (
          <div className="ss-home__view-all">
            <Link to="/homes" className="btn btn-primary btn-lg">
              Explore All {homes.length}+ Properties →
            </Link>
          </div>
        )}
      </section>

      {/* ── Why StaySphere ───────────────────────────────────── */}
      <section className="ss-features container">
        <h2 className="display-md ss-features__title">Why StaySphere?</h2>
        <div className="ss-features__grid">
          {[
            { icon: '🏆', title: 'Best Price Guarantee', desc: 'We match any lower price you find — guaranteed.' },
            { icon: '🔒', title: 'Secure Booking',       desc: 'Your payment and data are always protected.' },
            { icon: '🌟', title: 'Curated Quality',      desc: 'Every property is verified for quality and comfort.' },
            { icon: '💬', title: '24/7 Support',         desc: 'Our team is always here to help you.' },
          ].map(f => (
            <div key={f.title} className="ss-feature-card glass">
              <span className="ss-feature-card__icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
