import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchMovies } from '../api/api';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowMenu(false);
  };

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchValue(val);
    if (onSearch) onSearch(val);

    if (val.length > 1) {
      try {
        const movies = await fetchMovies();
        const filtered = movies.filter(m =>
          m.title.toLowerCase().includes(val.toLowerCase())
        ).slice(0, 5);
        setSuggestions(filtered);
        setShowSuggestions(true);
      } catch (e) { }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        navigate(`/movie/${suggestions[activeIndex].slug}`);
        setShowSuggestions(false);
        setSearchValue('');
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const highlightText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase()
            ? <span key={i} className="search-highlight">{part}</span>
            : part
        )}
      </span>
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">StreamFlix</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        {user && <li><Link to="/watchlist">Watchlist</Link></li>}
        {user?.role === 'admin' && <li><Link to="/admin">Dashboard</Link></li>}
      </ul>
      <div style={{ flex: 1 }} />
      <div className="navbar-right">
        <div className="navbar-search" ref={searchRef}>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onFocus={() => searchValue.length > 1 && setShowSuggestions(true)}
            aria-label="Search movies"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions glass-card fade-in">
              {suggestions.map((movie, index) => (
                <div
                  key={movie._id}
                  className={`suggestion-item ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => {
                    navigate(`/movie/${movie.slug}`);
                    setShowSuggestions(false);
                    setSearchValue('');
                  }}
                >
                  <img src={movie.posterUrl} alt="" className="suggestion-thumb" />
                  <div className="suggestion-info">
                    <span className="suggestion-title">{highlightText(movie.title, searchValue)}</span>
                    <span className="suggestion-year">{new Date(movie.releaseDate).getFullYear()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="navbar-notifications">
          <button className="icon-btn" aria-label="Notifications">
            <span className="bell-icon">🔔</span>
            <span className="notification-dot"></span>
          </button>
        </div>

        <div className="navbar-profile">
          {user ? (
            <div className="profile-dropdown-container">
              <button
                className="user-button"
                onClick={() => setShowMenu(!showMenu)}
                aria-haspopup="true"
                aria-expanded={showMenu}
              >
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=8b5cf6&color=fff`} alt="" className="nav-avatar" />
                <span className="user-name">{user.name}</span>
              </button>
              {showMenu && (
                <div className="navbar-profile-dropdown glass-card fade-in">
                  <div className="dropdown-item user-info">
                    <strong>{user.name}</strong>
                    <p>{user.email}</p>
                  </div>
                  <Link to="/profile" className="dropdown-link" onClick={() => setShowMenu(false)}>My Profile</Link>
                  <Link to="/watchlist" className="dropdown-link" onClick={() => setShowMenu(false)}>Watchlist</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="dropdown-link" onClick={() => setShowMenu(false)}>Dashboard</Link>
                  )}
                  <button
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="navbar-auth-link">Login</Link>
              <Link to="/register" className="navbar-auth-link register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;