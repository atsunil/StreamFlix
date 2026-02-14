// ProfileSelector component removed
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import './ProfileSelector.css';

const ProfileSelector = ({ onSelect }) => {
  const { user } = useContext(AuthContext);
  const [selected, setSelected] = useState(null);

  if (!user?.profiles || user.profiles.length === 0) return null;

  return (
    <div className="profile-selector-overlay">
      <div className="profile-selector-modal">
        <h2>Select Profile</h2>
        <div className="profile-list">
          {user.profiles.map(profile => (
            <div
              key={profile._id}
              className={`profile-item${selected === profile._id ? ' selected' : ''}`}
              onClick={() => setSelected(profile._id)}
            >
              <div className="profile-avatar">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} />
                ) : (
                  <span role="img" aria-label="avatar">👤</span>
                )}
              </div>
              <div className="profile-name">{profile.name}</div>
            </div>
          ))}
        </div>
        <button
          className="profile-select-btn"
          onClick={() => selected && onSelect(selected)}
          disabled={!selected}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ProfileSelector;
