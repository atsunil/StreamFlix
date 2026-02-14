import React, { useState, useEffect } from 'react';
import './MovieForm.css';

const MovieForm = ({ initialData, onSubmit, userToken }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    genres: [],
    tags: [],
    releaseDate: '',
    runtimeMinutes: '',
    director: '',
    language: 'English',
    posterUrl: '',
    trailerUrl: '',
    isPublished: true
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Suggestions Data
  const SUGGESTED_GENRES = ["Action", "Thriller", "Sci-Fi", "Romance", "Horror", "Drama"];
  const SUGGESTED_TAGS = ["Time Travel", "Psychological", "Heist", "Space", "AI"];

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        genres: initialData.genres || [],
        tags: initialData.tags || [],
        releaseDate: initialData.releaseDate ? new Date(initialData.releaseDate).toISOString().split('T')[0] : ''
      });
    }
  }, [initialData]);

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;

    // Runtime numeric validation
    if (name === 'runtimeMinutes') {
      finalValue = value.replace(/\D/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const toggleItem = (listName, item) => {
    setFormData(prev => {
      const list = prev[listName];
      const newList = list.includes(item)
        ? list.filter(i => i !== item)
        : [...list, item];
      return { ...prev, [listName]: newList };
    });
  };

  const isYouTubeUrl = (url) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!isYouTubeUrl(url)) return null;
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const autoSuggestByAI = () => {
    if (!formData.description) return;
    const text = (formData.description + ' ' + formData.title).toLowerCase();
    const suggested = { genres: [], tags: [] };

    // Simple keyword mapping demo
    const genreMap = {
      "Action": ["fight", "battle", "hero", "spy", "chase", "shoot", "war"],
      "Sci-Fi": ["space", "alien", "robot", "future", "star", "tech", "sci-fi", "planet"],
      "Thriller": ["dark", "murder", "crime", "mystery", "hunt", "killer", "secret"],
      "Romance": ["love", "heart", "date", "romantic", "kiss", "feelings"],
      "Horror": ["scary", "ghost", "blood", "death", "haunted", "fear"]
    };

    const tagMap = {
      "Time Travel": ["time", "past", "future", "portal", "clock"],
      "AI": ["robot", "intelligence", "computing", "silicon", "neural"],
      "Psychological": ["mind", "brain", "trauma", "memory", "dream"],
      "Space": ["universe", "galaxy", "asteroid", "rocket", "void"]
    };

    Object.entries(genreMap).forEach(([genre, keywords]) => {
      if (keywords.some(k => text.includes(k))) suggested.genres.push(genre);
    });
    Object.entries(tagMap).forEach(([tag, keywords]) => {
      if (keywords.some(k => text.includes(k))) suggested.tags.push(tag);
    });

    setFormData(prev => ({
      ...prev,
      genres: [...new Set([...prev.genres, ...suggested.genres])],
      tags: [...new Set([...prev.tags, ...suggested.tags])]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.trailerUrl && !isYouTubeUrl(formData.trailerUrl)) {
      setError('Trailer URL must be a valid YouTube link.');
      setLoading(false);
      return;
    }
    if (formData.movieUrl && !isYouTubeUrl(formData.movieUrl)) {
      setError('Movie URL must be a valid YouTube link.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        runtimeMinutes: parseInt(formData.runtimeMinutes)
      };

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const url = initialData
        ? `${API_URL}/admin/movies/${initialData._id}`
        : `${API_URL}/admin/movies`;

      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Action failed');
      onSubmit();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const releaseYear = formData.releaseDate ? new Date(formData.releaseDate).getFullYear() : 'YYYY';
  const trailerEmbedUrl = getYouTubeEmbedUrl(formData.trailerUrl);
  const movieEmbedUrl = getYouTubeEmbedUrl(formData.movieUrl);

  return (
    <div className="movie-wizard-container">
      <div className="wizard-form-side">
        <form onSubmit={handleSubmit} className="wizard-form">
          <h2 className="section-main-title">Cinematic Submission</h2>
          {error && <div className="form-error shake">{error}</div>}

          {/* Section 1: Basic Info */}
          <div className="form-section card-style fade-in">
            <h3 className="section-title">Section 1: Basic Info</h3>
            <div className="floating-group">
              <input type="text" id="title" placeholder=" " value={formData.title} onChange={handleTitleChange} required className="wizard-input floating-input" />
              <label htmlFor="title" className="floating-label">Movie Title</label>
              {formData.title && <span className="validation-icon">✔</span>}
            </div>
            <div className="floating-group">
              <input type="text" id="slug" placeholder=" " value={formData.slug} disabled className="wizard-input floating-input disabled-input" />
              <label htmlFor="slug" className="floating-label">Auto-generated Slug</label>
            </div>
            <div className="floating-group">
              <textarea id="description" placeholder=" " name="description" value={formData.description} onChange={handleChange} rows="4" required className="wizard-input floating-input" />
              <label htmlFor="description" className="floating-label">Description</label>
            </div>
          </div>

          {/* Section 2: Movie Details */}
          <div className="form-section card-style fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="section-title">Section 2: Movie Details</h3>
            <div className="form-row">
              <div className="floating-group">
                <input type="text" id="director" placeholder=" " name="director" value={formData.director} onChange={handleChange} required className="wizard-input floating-input" />
                <label htmlFor="director" className="floating-label">Director</label>
              </div>
              <div className="floating-group">
                <input type="date" id="releaseDate" name="releaseDate" value={formData.releaseDate} onChange={handleChange} required className="wizard-input floating-input" />
                <label htmlFor="releaseDate" className="floating-label">Release Date ({releaseYear})</label>
              </div>
            </div>

            <div className="form-row">
              <div className="floating-group">
                <input type="url" id="trailerUrl" placeholder=" " name="trailerUrl" value={formData.trailerUrl} onChange={handleChange} required className="wizard-input floating-input" />
                <label htmlFor="trailerUrl" className="floating-label">Trailer YouTube URL</label>
                {trailerEmbedUrl && (
                  <div className="youtube-preview mt-2">
                    <iframe src={trailerEmbedUrl} title="Trailer Preview" frameBorder="0" allowFullScreen style={{ width: '100%', height: '150px', borderRadius: '8px' }}></iframe>
                  </div>
                )}
              </div>
              <div className="floating-group">
                <input type="url" id="movieUrl" placeholder=" " name="movieUrl" value={formData.movieUrl} onChange={handleChange} required className="wizard-input floating-input" />
                <label htmlFor="movieUrl" className="floating-label">Full Movie YouTube URL</label>
                {movieEmbedUrl && (
                  <div className="youtube-preview mt-2">
                    <iframe src={movieEmbedUrl} title="Movie Preview" frameBorder="0" allowFullScreen style={{ width: '100%', height: '150px', borderRadius: '8px' }}></iframe>
                  </div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="floating-group runtime-group">
                <input type="text" id="runtime" placeholder=" " name="runtimeMinutes" value={formData.runtimeMinutes} onChange={handleChange} required className="wizard-input floating-input" />
                <label htmlFor="runtime" className="floating-label">Runtime</label>
                <span className="input-suffix">minutes</span>
              </div>
              <div className="floating-group">
                <select id="language" name="language" value={formData.language} onChange={handleChange} className="wizard-input floating-input">
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Hindi">Hindi</option>
                </select>
                <label htmlFor="language" className="floating-label">Language</label>
              </div>
            </div>
          </div>

          {/* Section 3: Categories & Topics */}
          <div className="form-section card-style fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="section-title">Section 3: Categories & Topics</h3>
            <div className="ai-suggestion-box">
              <div className="ai-header-row">
                <p className="ai-label">✨ AI Suggested Genres & Tags</p>
                <button type="button" className="ai-magic-btn" onClick={autoSuggestByAI} title="Auto-suggest based on description">
                  🪄 Magic Suggest
                </button>
              </div>
              <div className="suggestion-group">
                <label>Genres</label>
                <div className="suggestion-chips">
                  {SUGGESTED_GENRES.map(g => (
                    <button key={g} type="button"
                      className={`chip ${formData.genres.includes(g) ? 'active' : ''}`}
                      onClick={() => toggleItem('genres', g)}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="suggestion-group">
                <label>Tags</label>
                <div className="suggestion-chips">
                  {SUGGESTED_TAGS.map(t => (
                    <button key={t} type="button"
                      className={`chip tag-chip ${formData.tags.includes(t) ? 'active' : ''}`}
                      onClick={() => toggleItem('tags', t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="floating-group mt-4">
              <input type="url" id="posterUrl" placeholder=" " name="posterUrl" value={formData.posterUrl} onChange={handleChange} required className="wizard-input floating-input" />
              <label htmlFor="posterUrl" className="floating-label">Poster URL</label>
            </div>

            <div className="form-check-group mt-4">
              <label className="checkbox-container">
                <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} />
                <span className="checkmark"></span>
                Launch to Public
              </label>
            </div>
          </div>

          <div className="wizard-actions sticky-actions">
            <button type="submit" className="btn primary-btn" disabled={loading}>
              {loading ? "Processing..." : initialData ? "Confirm Update" : "Launch Masterpiece"}
            </button>
          </div>
        </form>
      </div>

      <div className="preview-side">
        <p className="preview-label">Live Preview Dashboard</p>
        <div className="preview-card glass-card fade-in">
          <div className="preview-poster" style={{ backgroundImage: `url(${formData.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'})` }}>
            <div className="preview-overlay">
              <button className="play-btn">▶</button>
            </div>
          </div>
          <div className="preview-info">
            <span className="preview-year">{releaseYear}</span>
            <h3>{formData.title || "Untitled Masterpiece"}</h3>
            <p className="preview-genres">
              {formData.genres.length > 0 ? formData.genres.join(' • ') : "Genre Selection"}
            </p>
            <p className="preview-desc">
              {formData.description ? formData.description.substring(0, 120) + '...' : "Plot details will appear here as you type."}
            </p>
            <div className="preview-tags">
              {formData.tags.map(t => <span key={t} className="tag-badge">#{t.replace(/\s+/g, '')}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieForm;