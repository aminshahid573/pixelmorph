import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import "../styles/FormatSearch.css"

const FormatSearch = ({ formats, onFilterChange }) => {
  const [fromFormat, setFromFormat] = useState('');
  const [toFormat, setToFormat] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onFilterChange({
      fromFormat,
      toFormat,
      searchTerm
    });
  };

  const clearFilters = () => {
    setFromFormat('');
    setToFormat('');
    setSearchTerm('');
    onFilterChange({
      fromFormat: '',
      toFormat: '',
      searchTerm: ''
    });
  };

  return (
    <div className="format-search-container">
      <div className="search-filters">
        <select 
          value={fromFormat} 
          onChange={(e) => setFromFormat(e.target.value)}
          className="format-select from-select"
        >
          <option value="">From Format</option>
          {formats.map(format => (
            <option key={format} value={format}>
              {format.toUpperCase()}
            </option>
          ))}
        </select>

        <div className="arrow-icon">→</div>

        <select 
          value={toFormat} 
          onChange={(e) => setToFormat(e.target.value)}
          className="format-select to-select"
        >
          <option value="">To Format</option>
          {formats.map(format => (
            <option key={format} value={format}>
              {format.toUpperCase()}
            </option>
          ))}
        </select>

        <div className="search-input-wrapper">
          <input 
            type="text" 
            placeholder="Search conversions"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Search className="search-icon" />
        </div>

        {(fromFormat || toFormat || searchTerm) && (
          <button 
            onClick={clearFilters} 
            className="clear-filters-btn"
            title="Clear Filters"
          >
            <X size={20} />
          </button>
        )}

        <button 
          onClick={handleSearch} 
          className="search-button"
        >
          Filter
        </button>
      </div>
    </div>
  );
};

export default FormatSearch;