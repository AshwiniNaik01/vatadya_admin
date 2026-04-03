import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("adminData");
      if (savedUser) {
        setCurrentUser({ user: JSON.parse(savedUser) });
      }
    } catch (error) {
      console.error("Failed to parse user:", error);
      localStorage.removeItem("adminData");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("adminData", JSON.stringify(userData));
    setCurrentUser({ user: userData });
  };

  const logout = () => {
    localStorage.removeItem("adminData");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
