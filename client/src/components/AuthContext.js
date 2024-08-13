import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsLoggedIn(!!accessToken);
  }, []);

  const logout = () => {
    // Clear the access token and role from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Set isLoggedIn to false
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
