import React, { useState, useEffect } from 'react';
import '../css/Update.css';

const Update = ({ product, onClose, onUpdateSuccess }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantity);
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(product.description);
  const [showConfirmation, setShowConfirmation] = useState(false); // State for confirmation modal

  useEffect(() => {
    setName(product.name);
    setPrice(product.price);
    setQuantity(product.quantity);
    setCategory(product.category);
    setDescription(product.description);
  }, [product]);

  const updateProduct = async (e) => {
    e.preventDefault();
    setShowConfirmation(true); // Show confirmation modal when updating product

    // Confirmation modal can be handled here
  };

  const handleConfirmationYes = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/product/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price,
          quantity,
          category,
          description,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update product');

      alert(data.message || 'Product updated successfully');
      onUpdateSuccess(); // Notify ProductList to refresh the product list
      setShowConfirmation(false); // Close confirmation modal
      onClose(); // Close the update modal
    } catch (error) {
      alert(`Error: ${error.message}`);
      setShowConfirmation(false); // Close confirmation modal if there's an error
    }
  };

  const handleConfirmationNo = () => {
    setShowConfirmation(false); // Close the confirmation modal
  };

  const handleCancel = () => {
    onClose(); // Close the update modal when Cancel is clicked
  };

  return (
    <>
      <div className="UpdateForm">
        <form onSubmit={updateProduct}>
          <h2>Updating Product</h2>

          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Product Name" />
          <br />

          <label>Price</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Enter Product Price" />
          <br />

          <label>Quantity</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} placeholder="Enter Product Quantity" />
          <br />

          <label>Category</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Enter Product Category" />
          <br />

          <label>Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Product Description" />
          <br />

          <button type="submit" className="update-btn">Update Product</button>
          {/* Cancel button to close the modal */}
          <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="ConfirmationModal">
          <div className="ConfirmationModalContent">
            <h2>Are you sure you want to update this product?</h2>
            <button onClick={handleConfirmationYes} className="confirm-btn">Yes</button>
            <button onClick={handleConfirmationNo} className="cancel-btn">No</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Update;
