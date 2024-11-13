import React, { useState } from 'react';
import ProductList from './subCompo/ProductList';
import Create from './subCompo/Create';
import './css/Dashboard.css';  // Existing styles
import './css/delete.css';     // Import delete modal styles

const Dashboard = () => {
  const [url, setUrl] = useState('http://127.0.0.1:8000/api/product');
  const [showCreate, setShowCreate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const toggleCreate = () => {
    setShowCreate(!showCreate);
  };

  const toggleDeleteConfirm = (productId) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(!showDeleteConfirm);
  };

  const handleDeleteSuccess = (productId) => {
    // Here, you can handle refreshing the product list after deletion if needed.
    setShowDeleteConfirm(false);
    alert(`Product with ID ${productId} has been deleted.`);
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1 className="dashboard-title">Product Dashboard</h1>
        <div className="add-product-header">
          <button className="add-product-button" onClick={toggleCreate}>
            <i className="fas fa-plus-circle"></i> Add New Product
          </button>
        </div>
      </div>

      <div className="header-search">
        <ProductList
          url={url}
          onDeleteClick={toggleDeleteConfirm} // Pass function to ProductList to handle delete button
        />
      </div>

      {showCreate && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="modal-title">Create New Product</h2>
            <Create onClose={toggleCreate} />
            <button className="close" onClick={toggleCreate}>Close</button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal">
          <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}></div>
          <div className="modal-content">
            <h2 className="modal-title">Are you sure you want to delete this product?</h2>
            <div className="modal-actions">
              <button className="confirm-button" onClick={() => {
                // Confirm deletion by calling delete function
                handleDeleteSuccess(productToDelete);
                setShowDeleteConfirm(false);
              }}>Yes</button>
              <button className="cancel-button" onClick={() => setShowDeleteConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
