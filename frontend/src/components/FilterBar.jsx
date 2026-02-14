import React from 'react';
import './FilterBar.css';

const FilterBar = ({
    genres = [],
    selectedGenres = [],
    onToggleGenre,
    sortBy,
    onSortChange,
    language,
    onLanguageChange,
    yearRange,
    onYearChange
}) => {
    return (
        <div className="filter-bar glass-card fade-in">
            {/* Left: Scrollable Genres */}
            <div className="filter-left">
                <div className="genre-scroll">
                    <button
                        className={`filter-chip ${selectedGenres.length === 0 ? 'active' : ''}`}
                        onClick={() => selectedGenres.forEach(g => onToggleGenre(g))} // clear all logic if needed, or just visual
                    >
                        All
                    </button>
                    {genres.map(g => (
                        <button
                            key={g}
                            className={`filter-chip ${selectedGenres.includes(g) ? 'active' : ''}`}
                            onClick={() => onToggleGenre(g)}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Actions */}
            <div className="filter-right">
                <div className="filter-input-group">
                    <span className="input-icon">🌐</span>
                    <select value={language} onChange={(e) => onLanguageChange(e.target.value)}>
                        <option value="All">All Languages</option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Tamil">Tamil</option>
                        <option value="French">French</option>
                    </select>
                </div>

                <div className="filter-input-group">
                    <span className="input-icon">📅</span>
                    <select value={yearRange} onChange={(e) => onYearChange(Number(e.target.value))}>
                        <option value={2026}>All Years</option>
                        <option value={2025}>Up to 2025</option>
                        <option value={2024}>Up to 2024</option>
                        <option value={2023}>Up to 2023</option>
                        <option value={2022}>Up to 2022</option>
                        <option value={2021}>Up to 2021</option>
                        <option value={2020}>Up to 2020</option>
                        <option value={2015}>Up to 2015</option>
                        <option value={2010}>Up to 2010</option>
                        <option value={2000}>Up to 2000</option>
                        <option value={1990}>Up to 1990</option>
                    </select>
                </div>

                <div className="filter-input-group">
                    <span className="input-icon">⇅</span>
                    <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
                        <option value="newest">Newest</option>
                        <option value="popular">Popular</option>
                        <option value="rating">Top Rated</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
