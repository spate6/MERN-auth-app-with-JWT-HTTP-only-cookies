import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to fetch profile (validates existing cookie)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/users/profile', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch {
        // Not authenticated
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  const updateUser = (updatedData) => setUser((prev) => ({ ...prev, ...updatedData }));

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
