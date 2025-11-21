import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';


const Navbar = ({ onSearch }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);


  const handleLogout = () => {
    logout();
    navigate('/');
    setShowMenu(false);
  };

  const handleSearch = (e) => {
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Stream<span style={{color:'#fff'}}>Flix</span></Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        {user && (
          <li>
            <Link to="/watchlist">Watchlist</Link>
          </li>
        )}
        {user?.role === 'admin' && (
          <li>
            <Link to="/admin">Dashboard</Link>
          </li>
        )}
      </ul>
      <div style={{flex:1}} />
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search movies..."
          onChange={handleSearch}
        />
      </div>
      <div className="navbar-profile">
        {user ? (
          <div style={{position:'relative'}}>
            <button 
              className="user-button"
              onClick={() => setShowMenu(!showMenu)}
              style={{background:'none',border:'none',color:'#fff',fontWeight:600,fontSize:'1rem',display:'flex',alignItems:'center',gap:'0.5rem',cursor:'pointer'}}>
              <span className="user-icon" style={{fontSize:'1.5rem'}}>👤</span>
              <span className="user-name">{user.name}</span>
            </button>
            {showMenu && (
              <div className="navbar-profile-dropdown">
                <div className="dropdown-item user-info">
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                  {user.role === 'admin' && <p className="admin-badge">Admin</p>}
                </div>
                <button 
                  className="dropdown-item logout-btn"
                  onClick={handleLogout}
                  style={{width:'100%',background:'none',border:'none',color:'#fff',padding:'0.7rem 1rem',textAlign:'left',cursor:'pointer'}}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="navbar-auth-link">Login</Link>
            <Link to="/register" className="navbar-auth-link register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;