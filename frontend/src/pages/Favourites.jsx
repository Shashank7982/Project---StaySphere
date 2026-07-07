import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFavourites, removeFromFavourites } from '../api';
import PropertyCard from '../components/PropertyCard';
import './SimplePages.css';

export default function Favourites() {
  const [homes, setHomes]   = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getFavourites()
      .then(({ data }) => setHomes(data.favouriteHomes || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleRemove = async (homeId) => {
    await removeFromFavourites(homeId);
    setHomes(h => h.filter(x => x._id !== homeId));
  };

  return (
    <div className="ss-simple page-wrapper">
      <div className="ss-simple__header container">
        <h1 className="display-md">Saved Places</h1>
        <p className="ss-simple__sub">{homes.length} saved {homes.length === 1 ? 'property' : 'properties'}</p>
      </div>

      <div className="container ss-simple__content">
        {loading ? (
          <div className="ss-simple__loading"><div className="spinner"/></div>
        ) : homes.length === 0 ? (
          <div className="ss-simple__empty">
            <span>💔</span>
            <h2>No saved places</h2>
            <p>Start exploring and save your favourite stays.</p>
            <Link to="/homes" className="btn btn-primary">Explore Stays</Link>
          </div>
        ) : (
          <div className="grid-properties">
            {homes.map(home => (
              <PropertyCard key={home._id} home={home} onFavourite={handleRemove} isFavourited />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
