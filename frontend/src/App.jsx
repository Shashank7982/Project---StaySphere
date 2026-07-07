import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home         from './pages/Home';
import HomeList     from './pages/HomeList';
import HomeDetail   from './pages/HomeDetail';
import Login        from './pages/Login';
import Signup       from './pages/Signup';
import Bookings     from './pages/Bookings';
import Favourites   from './pages/Favourites';
import HostDashboard from './pages/HostDashboard';
import EditHome     from './pages/EditHome';
import NotFound     from './pages/NotFound';

// Protected route wrapper
function Protected({ children, requiredType }) {
  const { isLoggedIn, user, loading } = useAuth();
  if (loading) return <div className="loading-page"><div className="spinner"/></div>;
  if (!isLoggedIn) return <Navigate to="/login" replace/>;
  if (requiredType && user?.userType !== requiredType) return <Navigate to="/" replace/>;
  return children;
}

// Auth route: redirect logged-in users away
function AuthRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div className="loading-page"><div className="spinner"/></div>;
  if (isLoggedIn) return <Navigate to="/" replace/>;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"          element={<Home/>} />
        <Route path="/homes"     element={<HomeList/>} />
        <Route path="/homes/search" element={<HomeList/>} />
        <Route path="/homes/:homeId" element={<HomeDetail/>} />

        {/* Auth */}
        <Route path="/login"  element={<AuthRoute><Login/></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><Signup/></AuthRoute>} />

        {/* Guest protected */}
        <Route path="/bookings"   element={<Protected requiredType="guest"><Bookings/></Protected>} />
        <Route path="/favourites" element={<Protected requiredType="guest"><Favourites/></Protected>} />

        {/* Host protected */}
        <Route path="/host/dashboard" element={<Protected requiredType="host"><HostDashboard/></Protected>} />
        <Route path="/host/add"       element={<Protected requiredType="host"><EditHome editing={false}/></Protected>} />
        <Route path="/host/edit/:homeId" element={<Protected requiredType="host"><EditHome editing={true}/></Protected>} />

        {/* 404 */}
        <Route path="*" element={<NotFound/>} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
