import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/Skeleton';
import './Profile.css';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [preferences, setPreferences] = useState({
        genres: ['Action', 'Sci-Fi'],
        language: 'English',
        theme: 'dark'
    });

    // Mock viewing history
    const history = [
        { id: 1, movie: 'Inception', date: '2026-02-09', duration: 'Full' },
        { id: 2, movie: 'The Matrix', date: '2026-02-08', duration: '45m / 136m' },
        { id: 3, movie: 'Interstellar', date: '2026-02-05', duration: 'Full' }
    ];

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleSave = () => {
        showToast('Settings saved successfully!', 'success');
    };

    const toggleGenre = (genre) => {
        setPreferences(prev => ({
            ...prev,
            genres: prev.genres.includes(genre)
                ? prev.genres.filter(g => g !== genre)
                : [...prev.genres, genre]
        }));
    };

    if (loading) return (
        <div className="profile-page fade-in">
            <Skeleton width="300px" height="40px" className="mb-4" />
            <div className="profile-grid">
                <Skeleton height="400px" className="glass-card" />
                <Skeleton height="400px" className="glass-card" />
            </div>
        </div>
    );

    return (
        <div className="profile-page fade-in">
            <h1>Account Settings</h1>

            <div className="profile-grid">
                {/* Profile Section */}
                <div className="profile-section glass-card">
                    <div className="user-header">
                        <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=e50914&color=fff&size=128`} alt="" className="profile-avatar" />
                        <div className="user-details">
                            <h2>{user?.name}</h2>
                            <p>{user?.email}</p>
                            <span className="role-badge">{user?.role}</span>
                        </div>
                    </div>

                    <div className="preferences-form">
                        <h3>Preferences</h3>
                        <div className="pref-group">
                            <label>Language</label>
                            <select value={preferences.language} onChange={e => setPreferences({ ...preferences, language: e.target.value })}>
                                <option>English</option>
                                <option>Hindi</option>
                                <option>Tamil</option>
                            </select>
                        </div>

                        <div className="pref-group">
                            <label>Preferred Genres</label>
                            <div className="genre-options">
                                {['Action', 'Comedy', 'Sci-Fi', 'Horror', 'Drama', 'Romance'].map(g => (
                                    <button
                                        key={g}
                                        className={`genre-chip ${preferences.genres.includes(g) ? 'active' : ''}`}
                                        onClick={() => toggleGenre(g)}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="btn primary-btn mt-4" onClick={handleSave}>Save Changes</button>
                    </div>
                </div>

                {/* History Section */}
                <div className="history-section glass-card">
                    <h3>Viewing History</h3>
                    <div className="history-table-container">
                        <table className="web-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Movie</th>
                                    <th>Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.date}</td>
                                        <td className="strong">{item.movie}</td>
                                        <td>{item.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
