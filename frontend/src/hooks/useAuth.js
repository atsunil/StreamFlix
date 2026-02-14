import { useState, useEffect } from 'react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api/api';

const useAuth = () => {
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (name, email, password) => {
    try {
      await api.post('/auth/register', { name, email, password });
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Optionally, you can decode the token to get user info
      // and set it in the context
    }
    setLoading(false);
  }, [setIsAuthenticated]);

  return { login, register, logout, loading };
};

export default useAuth;