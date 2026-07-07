import { createContext, useContext, useState, useEffect } from 'react';
import { getAuthStatus, login as apiLogin, signup as apiSignup, logout as apiLogout } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuthStatus()
      .then(({ data }) => {
        setIsLoggedIn(data.isLoggedIn);
        setUser(data.user);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await apiLogin({ email, password });
    setIsLoggedIn(true);
    setUser(data.user);
    return data;
  };

  const signup = async (formData) => {
    const { data } = await apiSignup(formData);
    return data;
  };

  const logout = async () => {
    await apiLogout();
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
