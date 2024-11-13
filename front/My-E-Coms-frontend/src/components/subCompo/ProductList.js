import React, { useState, useEffect } from 'react';
import '../css/ProductList.css';
import Delete from './Delete';
import Update from './Update';
import Search from './Search';

function ProductList({ url }) {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [sortOrder, setSortOrder] = useState('initial');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch products from the API
  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Fetching Failed');
      const data = await response.json();
      setProducts(data.data);
      setDisplayedProducts(data.data); // Initialize displayed products
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for filtering
  const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/products/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Fetching Categories Failed');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError(error.message);
    }
  };

  // Filter and Sort products
  useEffect(() => {
    let filteredProducts = [...products];

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (sortOrder === 'ascending') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'descending') {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    setDisplayedProducts(filteredProducts);
  }, [sortOrder, selectedCategory, products]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [url]);

  // Handle search input
  const handleSearchResults = (searchResults) => {
    if (searchResults.length === 0) {
      setDisplayedProducts(products); // Reset to full product list
    } else {
      setDisplayedProducts(searchResults);
    }
    setSortOrder('initial');
    setSelectedCategory('');
  };

  const handleDeleteSuccess = (deletedId) => {
    const updatedProducts = products.filter((product) => product.id !== deletedId);
    setProducts(updatedProducts);
    setDisplayedProducts(updatedProducts);
  };

  const handleUpdateSuccess = () => {
    fetchProducts();
    setShowUpdate(false);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const openUpdateModal = (product) => {
    setSelectedProduct(product);
    setShowUpdate(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="product-list-container">
      {/* Search Component */}
      <Search onSearchResults={handleSearchResults} />

      <div className="filters">
        <label htmlFor="sortOrder">Sort By Price:</label>
        <select id="sortOrder" value={sortOrder} onChange={handleSortChange}>
          <option value="initial">Initial Order</option>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>

        <label htmlFor="categoryFilter">Filter By Category:</label>
        <select id="categoryFilter" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.category}>
              {category.category}
            </option>
          ))}
        </select>
      </div>

      {displayedProducts.length === 0 ? (
        <p>No products available</p>
      ) : (
        <div className="product-cards">
          {displayedProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Category: {product.category}</p>
              <Delete productId={product.id} onDeleteSuccess={handleDeleteSuccess} />
              <button className="update-btn" onClick={() => openUpdateModal(product)}>
                Update
              </button>
            </div>
          ))}
        </div>
      )}

      {showUpdate && selectedProduct && (
        <div className="modal">
          <Update product={selectedProduct} onClose={() => setShowUpdate(false)} onUpdateSuccess={handleUpdateSuccess} />
        </div>
      )}
    </div>
  );
}

export default ProductList;
