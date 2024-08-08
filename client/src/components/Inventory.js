import React, { useState, useEffect } from 'react';

// API URL
const apiUrl = '/inventories';

const Inventory = () => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [newItem, setNewItem] = useState({
        charity_id: '',
        item_name: '',
        quantity: ''
    });
    const [editItem, setEditItem] = useState(null);
    const [error, setError] = useState('');

    // Fetch inventory items from the backend
    const fetchInventoryItems = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setInventoryItems(data);
        } catch (error) {
            setError('Failed to fetch inventory items.');
        }
    };

    useEffect(() => {
        fetchInventoryItems();
    }, []);}


      // Handle input changes for new item and edit forms
      const handleInputChange = (e, item = null) => {
        const { name, value } = e.target;
        if (item) {
            setEditItem({ ...editItem, [name]: value });
        } else {
            setNewItem({ ...newItem, [name]: value });
        }
    };

    // Create a new inventory item
    const handleAddItem = async () => {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setInventoryItems([...inventoryItems, data]);
            setNewItem({ charity_id: '', item_name: '', quantity: '' });
        } catch (error) {
            setError('Failed to add inventory item.');
        }
    };


export default Inventory;




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Inventory = () => {
//   const [inventories, setInventories] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Function to fetch inventory data
//     const fetchInventories = async () => {
//       try {
//         const response = await axios.get('/api/inventories'); // Adjust the URL as needed
//         setInventories(response.data);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchInventories();
//   }, []);

//   return (
//     <div>
//       <h1>Inventory List</h1>
//       {error && <p>Error fetching inventories: {error}</p>}
//       <ul>
//         {inventories.map((inventory) => (
//           <li key={inventory.id}>
//             <strong>Item Name:</strong> {inventory.item_name} <br />
//             <strong>Quantity:</strong> {inventory.quantity} <br />
//             <strong>Last Updated:</strong> {new Date(inventory.last_updated).toLocaleString()} <br />
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Inventory;
