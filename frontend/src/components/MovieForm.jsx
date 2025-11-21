import React, { useState, useEffect } from 'react';
import './MovieForm.css';

const MovieForm = ({ initialData, onSubmit, userToken }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    genres: [],
    releaseDate: '',
    runtimeMinutes: '',
    cast: [],
    director: '',
    language: 'English',
    posterUrl: '',
    trailerUrl: '',
    videoUrl: '',
    isPublished: true
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        genres: initialData.genres || [],
        cast: Array.isArray(initialData.cast) ? initialData.cast.join(', ') : initialData.cast || '',
        releaseDate: initialData.releaseDate ? new Date(initialData.releaseDate).toISOString().split('T')[0] : ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGenresChange = (e) => {
    const genresString = e.target.value;
    setFormData(prev => ({
      ...prev,
      genres: genresString.split(',').map(g => g.trim()).filter(g => g)
    }));
  };

  const handleCastChange = (e) => {
    setFormData(prev => ({
      ...prev,
      cast: e.target.value
    }));
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        cast: typeof formData.cast === 'string' 
          ? formData.cast.split(',').map(c => c.trim()).filter(c => c)
          : formData.cast,
        runtimeMinutes: parseInt(formData.runtimeMinutes)
      };

      const url = initialData 
        ? `http://localhost:5000/api/admin/movies/${initialData._id}`
        : 'http://localhost:5000/api/admin/movies';

      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorMessage = 'Failed to submit movie';
        try {
          const data = await response.json();
          errorMessage = data.error || data.message || errorMessage;
          if (data.details && Array.isArray(data.details)) {
            errorMessage = data.details.join(', ');
          }
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      alert(initialData ? 'Movie updated successfully' : 'Movie added successfully');
      onSubmit();
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="movie-form">
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label>Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleTitleChange}
          placeholder="Movie title"
          required
        />
      </div>

      <div className="form-group">
        <label>Slug</label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="URL slug"
          disabled
        />
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Movie description"
          rows="4"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Director *</label>
          <input
            type="text"
            name="director"
            value={formData.director}
            onChange={handleChange}
            placeholder="Director name"
            required
          />
        </div>

        <div className="form-group">
          <label>Release Date *</label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Runtime (minutes) *</label>
          <input
            type="number"
            name="runtimeMinutes"
            value={formData.runtimeMinutes}
            onChange={handleChange}
            placeholder="Runtime"
            required
          />
        </div>

        <div className="form-group">
          <label>Language</label>
          <input
            type="text"
            name="language"
            value={formData.language}
            onChange={handleChange}
            placeholder="Language"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Genres (comma separated) *</label>
        <input
          type="text"
          value={formData.genres.join(', ')}
          onChange={handleGenresChange}
          placeholder="e.g., Action, Drama, Sci-Fi"
          required
        />
      </div>

      <div className="form-group">
        <label>Cast (comma separated) *</label>
        <textarea
          value={formData.cast}
          onChange={handleCastChange}
          placeholder="e.g., Actor 1, Actor 2, Actor 3"
          rows="2"
          required
        />
      </div>

      <div className="form-group">
        <label>Poster URL *</label>
        <input
          type="url"
          name="posterUrl"
          value={formData.posterUrl}
          onChange={handleChange}
          placeholder="https://example.com/poster.jpg"
          required
        />
      </div>

      <div className="form-group">
        <label>Trailer URL *</label>
        <input
          type="url"
          name="trailerUrl"
          value={formData.trailerUrl}
          onChange={handleChange}
          placeholder="https://youtube.com/embed/..."
          required
        />
      </div>

      <div className="form-group">
        <label>Video URL</label>
        <input
          type="url"
          name="videoUrl"
          value={formData.videoUrl}
          onChange={handleChange}
          placeholder="https://example.com/video.mp4"
        />
      </div>

      <div className="form-group form-checkbox">
        <label>
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
          />
          <span>Publish this movie</span>
        </label>
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-submit"
          disabled={loading}
        >
          {loading ? 'Submitting...' : (initialData ? 'Update Movie' : 'Add Movie')}
        </button>
      </div>
    </form>
  );
};

export default MovieForm;