import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Watch from './pages/Watch';
import Login from './pages/Login';
import Register from './pages/Register';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import Navbar from './components/Navbar';
import './styles/globals.css';

// Simple global error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // Log error if needed
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#ff6b6b' }}>
          <h2>Something went wrong.</h2>
          <pre style={{ color: '#fff', background: '#222', padding: '1rem', borderRadius: '8px', margin: '2rem auto', maxWidth: '600px', overflow: 'auto' }}>{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const GlobalLoadingOverlay = ({ show }) => show ? (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ color: '#fff', fontSize: '2rem', fontWeight: 600, letterSpacing: '2px', background: '#181818cc', padding: '2rem 3rem', borderRadius: '16px', boxShadow: '0 8px 32px #000a' }}>
      <span className="spinner" style={{ marginRight: '1rem', verticalAlign: 'middle', display: 'inline-block', width: '2rem', height: '2rem', border: '4px solid #fff', borderTop: '4px solid #e50914', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
      Loading...
    </div>
    <style>{`@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
  </div>
) : null;

const AppContent = () => {
  const [search, setSearch] = useState("");
  const { user, loading } = useContext(AuthContext);

  if (loading) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="skeleton" style={{ width: '200px', height: '40px', borderRadius: '20px' }} />
    </div>
  );

  return (
    <>
      <Navbar onSearch={setSearch} />
      <Routes>
        <Route path="/" element={<Home search={search} />} />
        <Route path="/movie/:slug" element={<MovieDetail />} />
        <Route path="/watch/:slug" element={<Watch />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <Router>
        <AuthProvider>
          <ToastProvider>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </ToastProvider>
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;