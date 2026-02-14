import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Skeleton from '../components/Skeleton';
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length > 6) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[!@#$%^&*]/.test(pass)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength(formData.password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="poster-mosaic">
        <div className="mosaic-overlay"></div>
        <div className="mosaic-grid">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="mosaic-poster" style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w200/edv5CZvR0Ki9snvFWSTPZero9lr.jpg)`,
              animationDelay: `${i * 0.15}s`
            }}></div>
          ))}
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-box glass-card fade-in-scale">
          <h1 className="auth-logo">StreamFlix</h1>
          <h2 className="auth-title">Create Account</h2>

          {error && <div className="auth-error shake">
            <span className="error-icon">❌</span> {error}
          </div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {pageLoading ? (
              <div className="skeleton-form">
                <Skeleton height="55px" className="mb-4" />
                <Skeleton height="55px" className="mb-4" />
                <Skeleton height="55px" className="mb-4" />
                <Skeleton height="55px" className="mb-4" />
                <Skeleton height="50px" className="mb-4" />
              </div>
            ) : (
              <>
                <div className="floating-group">
                  <input type="text" id="name" name="name" placeholder=" " value={formData.name} onChange={handleChange} required className="auth-input floating-input" />
                  <label htmlFor="name" className="floating-label">Full Name</label>
                </div>

                <div className="floating-group">
                  <input type="email" id="email" name="email" placeholder=" " value={formData.email} onChange={handleChange} required className="auth-input floating-input" />
                  <label htmlFor="email" className="floating-label">Email Address</label>
                  {formData.email && <span className="validation-icon">{formData.email.includes('@') ? '✔' : '❌'}</span>}
                </div>

                <div className="floating-group password-group">
                  <input type={showPassword ? "text" : "password"} id="password" name="password" placeholder=" " value={formData.password} onChange={handleChange} required className="auth-input floating-input" />
                  <label htmlFor="password" className="floating-label">Password</label>
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>

                {formData.password && (
                  <div className="password-meter">
                    <div className="meter-blocks">
                      {[1, 2, 3, 4].map(b => (
                        <div key={b} className={`block ${strength >= b ? 'active' : ''} strength-${strength}`} />
                      ))}
                    </div>
                    <span className="meter-text">{strengthLabels[strength - 1] || 'Very Weak'}</span>
                  </div>
                )}

                <div className="floating-group">
                  <input type="password" id="confirmPassword" name="confirmPassword" placeholder=" " value={formData.confirmPassword} onChange={handleChange} required className="auth-input floating-input" />
                  <label htmlFor="confirmPassword" className="floating-label">Confirm Password</label>
                </div>

                <button type="submit" disabled={loading} className="auth-btn primary-btn">
                  {loading ? <span className="spinner"></span> : 'Sign Up'}
                </button>
              </>
            )}
          </form>

          <div className="auth-footer">
            <p>Already have an account?
              <Link to="/login" className="auth-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;