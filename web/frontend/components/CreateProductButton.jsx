import React, { useState } from 'react';
import styled from "styled-components";

export function CreateProductButton  ()  {
  const handleCreateProduct = async () => {
    try {
      const response = await fetch('/create-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // You can send additional data if needed
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Product created successfully:', result);
        alert('Product created successfully!');
      } else {
        console.error('Error creating product:', result);
        alert('Error creating product: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating product: ' + error.message);
    }
  };

  const [rate, setRate] = useState(0); // Initial state for the number

  // Handler for increasing the rate
  const handleIncrease = () => {
    setRate(prevRate => prevRate + 1);
  };

  // Handler for decreasing the rate
  const handleDecrease = () => {
    if (rate > 0) {
      setRate(prevRate => prevRate - 1);
    }
  };

  // Handler for saving the rate (you can define what happens when you save)
  const handleSave = () => {
    alert(`Rate saved: ${rate}`);
    // Here, you can add logic to save the rate, such as calling an API
  };
  return (
    <Root>
    <div className="Bills">
      <form>
        <div className="Bills_div">
          <div className="cols">
            <label>
              <div className="split-bills">
                <span>Rates</span>
              </div>
              <div className="rate-control">
                <button type="button" onClick={handleDecrease}>-</button>
                <input
                  type="number"
                  className="field"
                  placeholder="Rate"
                  value={rate}
                  readOnly
                />
                <button type="button" onClick={handleIncrease}>+</button>
              </div>
              <button type="button" onClick={handleSave} className="save-button">
                Save
              </button>
            </label>
          </div>
        </div>
      </form>
    </div>
    <button onClick={handleCreateProduct}>
      Create Product
    </button>
</Root>
  );
};


const Root = styled.section`

.rate-control {
  display: flex;
  align-items: center;
}

.rate-control button {
  width: 30px;
  height: 30px;
  margin: 0 5px;
}

.field {
  width: 60px;
  text-align: center;
}

.save-button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: blue;
  color: white;
  border: none;
  cursor: pointer;
}


`
