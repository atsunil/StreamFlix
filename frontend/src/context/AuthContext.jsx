import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get(`${API_URL}/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser({ ...response.data, token });
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const userData = response.data.user;
            const token = response.data.token;
            setUser({ ...userData, token });
            localStorage.setItem('token', token);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    const register = async (name, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
            const userData = response.data.user;
            const token = response.data.token;
            setUser({ ...userData, token });
            localStorage.setItem('token', token);
            return response.data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    };

    const addToUserWatchlist = async (movieId) => {
        if (!user || !user.token) return;
        try {
            // Optimistic update
            const currentWatchlist = user.watchlist || [];
            if (!currentWatchlist.includes(movieId)) {
                setUser(prev => ({
                    ...prev,
                    watchlist: [...(prev.watchlist || []), movieId]
                }));
            }

            // Call API
            await axios.post(`${API_URL}/users/watchlist`, { movieId }, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            // We could update from response, but optimistic is faster. 
            // If API fails, we should revert, but for now let's assume success or toast error handles it.
        } catch (error) {
            console.error('Error adding to watchlist:', error);
            // Revert if needed, or just let the user retry.
            throw error;
        }
    };

    const removeFromUserWatchlist = async (movieId) => {
        if (!user || !user.token) return;
        try {
            // Optimistic update
            setUser(prev => ({
                ...prev,
                watchlist: (prev.watchlist || []).filter(id => id !== movieId)
            }));

            await axios.delete(`${API_URL}/users/watchlist/${movieId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
        } catch (error) {
            console.error('Error removing from watchlist:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, addToUserWatchlist, removeFromUserWatchlist }}>
            {children}
        </AuthContext.Provider>
    );
};