import React, { useState } from 'react';
import '../css/Search.css';

function Search({ onSearchResults }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!searchTerm.trim()) {
      // If search term is cleared, reset to default
      onSearchResults([]); // Pass empty array to signal reset
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products/search?q=${encodeURIComponent(searchTerm)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      onSearchResults(data.data || []); // Send search results
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products (e.g., Honda)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <p className="error-message">Error: {error}</p>}
    </div>
  );
}

export default Search;
