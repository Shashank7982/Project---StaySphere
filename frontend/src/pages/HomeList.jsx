import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';
import { getHomes, searchHomes, addToFavourites } from '../api';
import { useAuth } from '../context/AuthContext';
import './HomeList.css';

export default function HomeList() {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useAuth();

  const searchQuery = searchParams.get('location') || '';

  useEffect(() => {
    setLoading(true);
    const fetchFn = searchQuery
      ? searchHomes({ location: searchQuery })
      : getHomes(category);

    fetchFn
      .then(({ data }) => setHomes(data.homes || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, searchQuery]);

  const handleFavourite = async (homeId) => {
    if (!isLoggedIn) return;
    try { await addToFavourites(homeId); } catch (e) { console.error(e); }
  };

  return (
    <div className="ss-homelist page-wrapper">
      <div className="ss-homelist__hero">
        <div className="container">
          <h1 className="display-md animate-fade-up">
            {searchQuery ? `Results for "${searchQuery}"` : 'Explore All Stays'}
          </h1>
          <p className="ss-homelist__sub animate-fade-up delay-1">
            {homes.length} {homes.length === 1 ? 'property' : 'properties'} available
          </p>
          <div className="ss-homelist__search animate-fade-up delay-2">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="container ss-homelist__content">
        {!searchQuery && (
          <CategoryFilter current={category} onChange={setCategory} />
        )}

        {loading ? (
          <div className="ss-homelist__loading">
            <div className="spinner"/>
          </div>
        ) : homes.length === 0 ? (
          <div className="ss-homelist__empty">
            <span className="ss-homelist__empty-icon">🔍</span>
            <h2>No homes found</h2>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid-properties ss-homelist__grid">
            {homes.map((home, i) => (
              <div key={home._id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <PropertyCard home={home} onFavourite={isLoggedIn ? handleFavourite : null} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
