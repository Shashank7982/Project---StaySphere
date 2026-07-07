import { Link } from 'react-router-dom';
import './SimplePages.css';

export default function NotFound() {
  return (
    <div className="ss-simple page-wrapper">
      <div className="container ss-simple__content">
        <div className="ss-simple__empty" style={{paddingTop: '120px'}}>
          <span style={{fontSize:'5rem'}}>404</span>
          <h2 style={{fontSize:'2rem'}}>Page not found</h2>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    </div>
  );
}
