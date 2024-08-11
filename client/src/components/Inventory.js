import React, { useState, useEffect } from "react";

// API URL
const apiUrl = "/inventories";

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newItem, setNewItem] = useState({
    charity_id: "",
    item_name: "",
    quantity: "",
  });
  const [editItem, setEditItem] = useState(null);
  const [error, setError] = useState("");

  // Fetch inventory items from the backend
  const fetchInventoryItems = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setInventoryItems(data);
    } catch (error) {
      setError("Failed to fetch inventory items.");
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setInventoryItems([...inventoryItems, data]);
      setNewItem({ charity_id: "", item_name: "", quantity: "" });
    } catch (error) {
      setError("Failed to add inventory item.");
    }
  };

  // Edit an existing inventory item
  const handleEditItem = async () => {
    try {
      const response = await fetch(`${apiUrl}/${editItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editItem),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setInventoryItems(
        inventoryItems.map((item) => (item.id === data.id ? data : item))
      );
      setEditItem(null);
    } catch (error) {
      setError("Failed to update inventory item.");
    }
  };

  // Delete an inventory item
  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Network response was not ok");
      setInventoryItems(inventoryItems.filter((item) => item.id !== id));
    } catch (error) {
      setError("Failed to delete inventory item.");
    }
  };

  return (
    <div className="inventory-container">
      <h2>Inventory Management</h2>
      {error && <p className="error">{error}</p>}

      <div className="add-item-form">
        <h3>Add New Item</h3>
        <input
          type="number"
          name="charity_id"
          value={newItem.charity_id}
          onChange={(e) => handleInputChange(e)}
          placeholder="Charity ID"
        />
        <input
          type="text"
          name="item_name"
          value={newItem.item_name}
          onChange={(e) => handleInputChange(e)}
          placeholder="Item Name"
        />
        <input
          type="number"
          name="quantity"
          value={newItem.quantity}
          onChange={(e) => handleInputChange(e)}
          placeholder="Quantity"
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      {editItem && (
        <div className="edit-item-form">
          <h3>Edit Item</h3>
          <input
            type="number"
            name="charity_id"
            value={editItem.charity_id}
            onChange={(e) => handleInputChange(e, editItem)}
            placeholder="Charity ID"
          />
          <input
            type="text"
            name="item_name"
            value={editItem.item_name}
            onChange={(e) => handleInputChange(e, editItem)}
            placeholder="Item Name"
          />
          <input
            type="number"
            name="quantity"
            value={editItem.quantity}
            onChange={(e) => handleInputChange(e, editItem)}
            placeholder="Quantity"
          />
          <button onClick={handleEditItem}>Update Item</button>
        </div>
      )}

      <div className="inventory-list">
        <h3>Inventory Items</h3>
        <ul>
          {inventoryItems.map((item) => (
            <li key={item.id}>
              <span>
                {item.item_name} (Qty: {item.quantity})
              </span>
              <button onClick={() => setEditItem(item)}>Edit</button>
              <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Inventory;

