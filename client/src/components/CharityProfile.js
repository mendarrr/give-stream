import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CharityProfile.css";
import Navbar from "./Navbar";

const CharityProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [charity, setCharity] = useState(null);
  const [totalDonations, setTotalDonations] = useState(0);
  const [anonymousDonations, setAnonymousDonations] = useState(0);
  const [stories, setStories] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [newStory, setNewStory] = useState({ title: "", content: "" });
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: "",
    description: "",
  });
  const [newInventoryItem, setNewInventoryItem] = useState({
    item_name: "",
    quantity: 0,
  });
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentBeneficiaryPage, setCurrentBeneficiaryPage] = useState(1);
  const [currentInventoryPage, setCurrentInventoryPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchCharityData = async () => {
      setLoading(true);
      try {
        if (!id) {
          throw new Error("Charity ID is missing");
        }
        const response = await axios.get(`/charities/${id}`);
        setCharity(response.data);
        setTotalDonations(parseFloat(response.data.total_donations) || 0);
        setAnonymousDonations(
          parseFloat(response.data.anonymous_donations) || 0
        );

        const storiesResponse = await axios.get(`/stories?charity_id=${id}`);
        setStories(storiesResponse.data || []);

        const beneficiariesResponse = await axios.get(
          `/beneficiaries?charity_id=${id}`
        );
        setBeneficiaries(beneficiariesResponse.data || []);

        const inventoryResponse = await axios.get(
          `/inventory?charity_id=${id}`
        );
        setInventory(inventoryResponse.data || []);
      } catch (error) {
        console.error("Error fetching charity data:", error);
        setError("Error fetching charity data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharityData();
  }, [id, navigate]);

  const handleStorySubmit = async (e) => {
    e.preventDefault();
    if (!newStory.title.trim() || !newStory.content.trim()) {
      setError("Story title and content are required.");
      return;
    }
    try {
      if (newStory.id) {
        // Update existing story
        const response = await axios.put(`/stories/${newStory.id}`, newStory);
        setStories(
          stories.map((story) =>
            story.id === newStory.id ? response.data : story
          )
        );
      } else {
        // Create new story
        const response = await axios.post("/stories", {
          ...newStory,
          charity_id: id,
        });
        setStories([...stories, response.data]);
      }
      setNewStory({ title: "", content: "" });
      setError("");
    } catch (error) {
      console.error("Error submitting story:", error);
      setError("Error submitting story. Please try again later.");
    }
  };

  const handleBeneficiarySubmit = async (e) => {
    e.preventDefault();
    if (!newBeneficiary.name.trim()) {
      setError("Beneficiary name is required.");
      return;
    }
    try {
      if (newBeneficiary.id) {
        // Update existing beneficiary
        const response = await axios.put(
          `/beneficiaries/${newBeneficiary.id}`,
          newBeneficiary
        );
        setBeneficiaries(
          beneficiaries.map((b) =>
            b.id === newBeneficiary.id ? response.data : b
          )
        );
      } else {
        // Create new beneficiary
        const response = await axios.post("/beneficiaries", {
          ...newBeneficiary,
          charity_id: id,
        });
        setBeneficiaries([...beneficiaries, response.data]);
      }
      setNewBeneficiary({ name: "", description: "" });
      setError("");
    } catch (error) {
      console.error("Error submitting beneficiary:", error);
      setError("Error submitting beneficiary. Please try again later.");
    }
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();
    if (!newInventoryItem.item_name.trim()) {
      setError("Item name is required.");
      return;
    }
    if (isNaN(newInventoryItem.quantity) || newInventoryItem.quantity < 0) {
      setError("Quantity must be a non-negative number.");
      return;
    }
    const data = {
      ...newInventoryItem,
      charity_id: id,
      quantity: parseInt(newInventoryItem.quantity, 10),
    };
    try {
      if (newInventoryItem.id) {
        // Update existing inventory item
        const response = await axios.put(
          `/inventory/${newInventoryItem.id}`,
          data
        );
        setInventory(
          inventory.map((item) =>
            item.id === newInventoryItem.id ? response.data : item
          )
        );
      } else {
        // Create new inventory item
        const response = await axios.post("/inventory", data);
        setInventory([...inventory, response.data]);
      }
      setNewInventoryItem({ item_name: "", quantity: 0 });
      setError("");
    } catch (error) {
      console.error("Error submitting inventory item:", error);
      setError("Error submitting inventory item. Please try again later.");
    }
  };

  const handlePreviousStory = () => {
    setCurrentStoryIndex((prevIndex) =>
      prevIndex === 0 ? stories.length - 1 : prevIndex - 1
    );
  };

  const handleNextStory = () => {
    setCurrentStoryIndex((prevIndex) =>
      prevIndex === stories.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleEditStory = (story) => {
    setNewStory({ id: story.id, title: story.title, content: story.content });
  };

  const handleDeleteStory = async (storyId) => {
    try {
      await axios.delete(`/stories/${storyId}`);
      setStories(stories.filter((story) => story.id !== storyId));
    } catch (error) {
      console.error("Error deleting story:", error);
      setError("Error deleting story. Please try again later.");
    }
  };

  const handleEditBeneficiary = (beneficiary) => {
    setNewBeneficiary({
      id: beneficiary.id,
      name: beneficiary.name,
      description: beneficiary.description,
    });
  };

  const handleDeleteBeneficiary = async (beneficiaryId) => {
    try {
      await axios.delete(`/beneficiaries/${beneficiaryId}`);
      setBeneficiaries(beneficiaries.filter((b) => b.id !== beneficiaryId));
    } catch (error) {
      console.error("Error deleting beneficiary:", error);
      setError("Error deleting beneficiary. Please try again later.");
    }
  };

  const handleEditInventoryItem = (item) => {
    setNewInventoryItem({
      id: item.id,
      item_name: item.item_name,
      quantity: item.quantity,
    });
  };

  const handleDeleteInventoryItem = async (itemId) => {
    try {
      await axios.delete(`/inventory/${itemId}`);
      setInventory(inventory.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      setError("Error deleting inventory item. Please try again later.");
    }
  };

  const indexOfLastBeneficiary = currentBeneficiaryPage * itemsPerPage;
  const indexOfFirstBeneficiary = indexOfLastBeneficiary - itemsPerPage;
  const currentBeneficiaries = beneficiaries.slice(
    indexOfFirstBeneficiary,
    indexOfLastBeneficiary
  );

  const indexOfLastInventoryItem = currentInventoryPage * itemsPerPage;
  const indexOfFirstInventoryItem = indexOfLastInventoryItem - itemsPerPage;
  const currentInventoryItems = inventory.slice(
    indexOfFirstInventoryItem,
    indexOfLastInventoryItem
  );

  const paginateBeneficiaries = (pageNumber) =>
    setCurrentBeneficiaryPage(pageNumber);
  const paginateInventory = (pageNumber) => setCurrentInventoryPage(pageNumber);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!charity) return <div>No charity data available</div>;

  return (
    <div className="charity-profile-container">
      <Navbar />
      <div className="charity-info">
        <h1>{charity.name}</h1>
        <p>{charity.description}</p>
        <div className="donation-info">
          <div className="donation-item">
            <h3>Needed Donation</h3>
            <p>${parseFloat(charity.needed_donation).toFixed(2)}</p>
          </div>
          <div className="donation-item">
            <h3>Total Donations</h3>
            <p>${totalDonations.toFixed(2)}</p>
          </div>
          <div className="donation-item">
            <h3>Anonymous Donations</h3>
            <p>${anonymousDonations.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="stories-section">
        <h2>Stories</h2>
        {stories.length > 0 ? (
          <div className="story-container">
            <button className="story-nav-btn" onClick={handlePreviousStory}>
              &lt;
            </button>
            <div className="story-card">
              <h3>{stories[currentStoryIndex]?.title || "No Title"}</h3>
              <p>{stories[currentStoryIndex]?.content || "No Content"}</p>
              <p className="story-date">
                Posted on:{" "}
                {stories[currentStoryIndex]?.date_posted
                  ? new Date(
                      stories[currentStoryIndex].date_posted
                    ).toLocaleString()
                  : "Unknown Date"}
              </p>
              <button
                onClick={() => handleEditStory(stories[currentStoryIndex])}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteStory(stories[currentStoryIndex].id)}
              >
                Delete
              </button>
            </div>
            <button className="story-nav-btn" onClick={handleNextStory}>
              &gt;
            </button>
          </div>
        ) : (
          <p>No stories available</p>
        )}
        <form onSubmit={handleStorySubmit} className="story-form">
          <input
            type="text"
            placeholder="Story Title"
            value={newStory.title}
            onChange={(e) =>
              setNewStory({ ...newStory, title: e.target.value })
            }
          />
          <textarea
            placeholder="Story Content"
            value={newStory.content}
            onChange={(e) =>
              setNewStory({ ...newStory, content: e.target.value })
            }
          ></textarea>
          <button type="submit">
            {newStory.id ? "Update Story" : "Submit Story"}
          </button>
        </form>
      </div>

      <div className="beneficiaries-section">
        <h2>Beneficiaries</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBeneficiaries.map((beneficiary) => (
              <tr key={beneficiary.id}>
                <td>{beneficiary.name}</td>
                <td>{beneficiary.description}</td>
                <td>
                  <button onClick={() => handleEditBeneficiary(beneficiary)}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBeneficiary(beneficiary.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from(
            { length: Math.ceil(beneficiaries.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => paginateBeneficiaries(i + 1)}
                className={currentBeneficiaryPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
        <form onSubmit={handleBeneficiarySubmit} className="beneficiary-form">
          <input
            type="text"
            placeholder="Beneficiary Name"
            value={newBeneficiary.name}
            onChange={(e) =>
              setNewBeneficiary({ ...newBeneficiary, name: e.target.value })
            }
          />
          <textarea
            placeholder="Beneficiary Description"
            value={newBeneficiary.description}
            onChange={(e) =>
              setNewBeneficiary({
                ...newBeneficiary,
                description: e.target.value,
              })
            }
          ></textarea>
          <button type="submit">
            {newBeneficiary.id ? "Update Beneficiary" : "Add Beneficiary"}
          </button>
        </form>
      </div>

      <div className="inventory-section">
        <h2>Inventory</h2>
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentInventoryItems.map((item) => (
              <tr key={item.id}>
                <td>{item.item_name}</td>
                <td>{item.quantity}</td>
                <td>{new Date(item.last_updated).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleEditInventoryItem(item)}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteInventoryItem(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from(
            { length: Math.ceil(inventory.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => paginateInventory(i + 1)}
                className={currentInventoryPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
        <form onSubmit={handleInventorySubmit} className="inventory-form">
          <input
            type="text"
            placeholder="Item Name"
            value={newInventoryItem.item_name}
            onChange={(e) =>
              setNewInventoryItem({
                ...newInventoryItem,
                item_name: e.target.value,
              })
            }
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newInventoryItem.quantity}
            onChange={(e) =>
              setNewInventoryItem({
                ...newInventoryItem,
                quantity: e.target.value,
              })
            }
          />
          <button type="submit">
            {newInventoryItem.id ? "Update Item" : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default CharityProfile;
