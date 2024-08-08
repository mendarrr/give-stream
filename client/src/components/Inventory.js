import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Inventory = () => {
  const [inventories, setInventories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch inventory data
    const fetchInventories = async () => {
      try {
        const response = await axios.get('/api/inventories'); // Adjust the URL as needed
        setInventories(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchInventories();
  }, []);

  return (
    <div>
      <h1>Inventory List</h1>
      {error && <p>Error fetching inventories: {error}</p>}
      <ul>
        {inventories.map((inventory) => (
          <li key={inventory.id}>
            <strong>Item Name:</strong> {inventory.item_name} <br />
            <strong>Quantity:</strong> {inventory.quantity} <br />
            <strong>Last Updated:</strong> {new Date(inventory.last_updated).toLocaleString()} <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inventory;
