// Add or update a movie in user's recently watched list
export const updateRecentlyWatched = async (movieId, position, token) => {
    const response = await axios.post(
        `${API_URL}/users/recently-watched`,
        { movieId, position },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

// Get recommendations for the current user
export const fetchRecommendations = async (token) => {
    const response = await axios.get(
        `${API_URL}/users/recommendations`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
};

// Aliases for convenience
export const register = registerUser;
export const login = loginUser;

export const fetchMovies = async (filters) => {
    const response = await axios.get(`${API_URL}/movies`, { params: filters });
    return response.data;
};

export const getMovies = fetchMovies;

export const fetchMovieDetails = async (slug) => {
    const response = await axios.get(`${API_URL}/movies/${slug}`);
    return response.data;
};

export const deleteMovie = async (movieId, token) => {
    const response = await axios.delete(`${API_URL}/movies/${movieId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const addToWatchlist = async (movieId, token) => {
    const response = await axios.post(`${API_URL}/users/watchlist`, { movieId }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const removeFromWatchlist = async (movieId, token) => {
    const response = await axios.delete(`${API_URL}/users/watchlist/${movieId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const fetchWatchlist = async (token) => {
    const response = await axios.get(`${API_URL}/users/watchlist`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export default axios;