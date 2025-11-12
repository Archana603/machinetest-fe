import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('tp_user');
    return u ? JSON.parse(u) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('tp_token') || null);

  useEffect(() => {
    if(token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
  }, [token]);

// auth.jsx
const login = async (email, password) => {
  const res = await axios.post('/api/auth/login', { email, password });
  const { token, user } = res.data;

  setToken(token);
  setUser(user);

  localStorage.setItem('tp_token', token);
  localStorage.setItem('tp_user', JSON.stringify(user));

  return user; // ✅ very important for navigation after login
};



  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tp_token');
    localStorage.removeItem('tp_user');
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>
};

export const useAuth = () => useContext(AuthContext);
