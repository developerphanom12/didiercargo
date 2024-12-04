import React, { useState } from 'react';
import axios from 'axios';

const UpdatePriceComponent = () => {
  const [productId, setProductId] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const updateProductPrice = async (productId, newPrice) => {
    try {
      const response = await axios.put('/correct-update-price', {
        product_id: productId,
        price: newPrice,
      });

      if (response.data.success) {
        alert('Product price updated successfully');
      } else {
        alert('Failed to update product price');
      }
    } catch (error) {
      alert('An error occurred while updating the product price');
    }
  };

  const handleUpdatePrice = () => {
    if (productId && newPrice) {
      updateProductPrice(productId, newPrice);
    } else {
      alert('Please enter both product ID and new price');
    }
  };

  return (
    <div>
      <h2>Update Product Price</h2>
      <input
        type="text"
        placeholder="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />
      <input
        type="text"
        placeholder="New Price"
        value={newPrice}
        onChange={(e) => setNewPrice(e.target.value)}
      />
      <button onClick={handleUpdatePrice}>Update Price</button>
    </div>
  );
};

export default UpdatePriceComponent;
