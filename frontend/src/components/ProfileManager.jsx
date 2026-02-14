// ProfileManager component removed

import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './ProfileManager.css';


const ProfileManager = ({ onClose }) => {
  const { user, login } = useContext(AuthContext);
  const [profiles, setProfiles] = useState(user?.profiles || []);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper to refresh user context from backend
  const refreshUser = async () => {
    try {
      const token = user?.token || localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update AuthContext user (simulate login)
      if (login) await login(res.data.email, null, token); // null password, pass token
    } catch (e) {
      // ignore
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) return setError('Name required');
    setLoading(true);
    try {
      const res = await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/users/profiles',
        { name, avatar },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setProfiles(res.data);
      setName('');
      setAvatar('');
      setError('');
      await refreshUser();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to add profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (profileId) => {
    if (!window.confirm('Delete this profile?')) return;
    setLoading(true);
    try {
      const res = await axios.delete((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + `/users/profiles/${profileId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setProfiles(res.data);
      await refreshUser();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-manager-overlay">
      <div className="profile-manager-modal">
        <h2>Manage Profiles</h2>
        <div className="profile-list">
          {profiles.map(profile => (
            <div key={profile._id} className="profile-item">
              <div className="profile-avatar">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} />
                ) : (
                  <span role="img" aria-label="avatar">👤</span>
                )}
              </div>
              <div className="profile-name">{profile.name}</div>
              <button className="profile-delete-btn" onClick={() => handleDelete(profile._id)} disabled={loading}>
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="profile-add-form">
          <input
            type="text"
            placeholder="Profile name"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Avatar URL (optional)"
            value={avatar}
            onChange={e => setAvatar(e.target.value)}
            disabled={loading}
          />
          <button className="profile-add-btn" onClick={handleAdd} disabled={loading || !name.trim()}>
            Add Profile
          </button>
        </div>
        {error && <div className="profile-error">{error}</div>}
        <button className="profile-close-btn" onClick={onClose} disabled={loading}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileManager;
