import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Skeleton from '../components/Skeleton';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    // Simulate page load for skeleton demo
    const timer = setTimeout(() => setPageLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length > 6) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[!@#$%^&*]/.test(pass)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="poster-mosaic">
        <div className="mosaic-overlay"></div>
        <div className="mosaic-grid">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="mosaic-poster" style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w200/edv5CZvR0Ki9snvFWSTPZero9lr.jpg)`,
              animationDelay: `${i * 0.1}s`
            }}></div>
          ))}
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-box glass-card fade-in-scale">
          <h1 className="auth-logo">StreamFlix</h1>
          <h2 className="auth-title">Welcome Back</h2>

          {error && <div className="auth-error shake">
            <span className="error-icon">❌</span> {error}
          </div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {pageLoading ? (
              <div className="skeleton-form">
                <Skeleton height="55px" className="mb-4" />
                <Skeleton height="55px" className="mb-4" />
                <Skeleton height="55px" className="mb-4" />
                <Skeleton height="45px" className="mb-4" />
              </div>
            ) : (
              <>
                <div className="floating-group">
                  <input
                    type="email"
                    id="email"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="auth-input floating-input"
                  />
                  <label htmlFor="email" className="floating-label">Email Address</label>
                  {email && (
                    <span className="validation-icon">
                      {email.includes('@') ? '✔' : '❌'}
                    </span>
                  )}
                </div>

                <div className="floating-group password-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="auth-input floating-input"
                  />
                  <label htmlFor="password" className="floating-label">Password</label>
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <span title="Hide Password">👁️</span>
                    ) : (
                      <span title="Show Password">👁️‍🗨️</span>
                    )}
                  </button>
                </div>

                {password && (
                  <div className="password-meter">
                    <div className="meter-blocks">
                      {[1, 2, 3, 4].map(b => (
                        <div key={b} className={`block ${strength >= b ? 'active' : ''} strength-${strength}`} />
                      ))}
                    </div>
                    <span className="meter-text">{strengthLabels[strength - 1] || 'Very Weak'}</span>
                  </div>
                )}

                <div className="form-extras">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password" procedure="none" className="forgot-link">Forgot Password?</Link>
                </div>

                <button type="submit" disabled={loading} className="auth-btn primary-btn">
                  {loading ? <span className="spinner"></span> : 'Sign In'}
                </button>
              </>
            )}
          </form>

          <div className="auth-divider"><span>OR CONTINUE WITH</span></div>

          <div className="social-logins">
            <button className="social-btn google">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
              Google
            </button>
          </div>

          <div className="auth-footer">
            <p>New to StreamFlix?
              <Link to="/register" className="auth-link">Sign up now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;