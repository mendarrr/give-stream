import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./CharityProfile.css";

const CharityProfile = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCharityData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/charities/${id}`);
        setCharity(response.data);

        const donationsResponse = await axios.get(`/donations/charity/${id}`);
        const donationsData = donationsResponse.data || {};
        setTotalDonations(parseFloat(donationsData.total_amount) || 0);
        setAnonymousDonations(
          (donationsData.donations || [])
            .filter((donation) => donation.is_anonymous)
            .reduce((total, donation) => total + (donation.amount || 0), 0)
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
  }, [id]);

  const handleStorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/stories", {
        ...newStory,
        charity_id: id,
      });
      setStories([...stories, response.data]);
      setNewStory({ title: "", content: "" });
    } catch (error) {
      console.error("Error submitting story:", error);
      setError("Error submitting story. Please try again later.");
    }
  };

  const handleBeneficiarySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/beneficiaries", {
        ...newBeneficiary,
        charity_id: id,
      });
      setBeneficiaries([...beneficiaries, response.data]);
      setNewBeneficiary({ name: "", description: "" });
    } catch (error) {
      console.error("Error submitting beneficiary:", error);
      setError("Error submitting beneficiary. Please try again later.");
    }
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...newInventoryItem,
      charity_id: id,
      quantity: parseInt(newInventoryItem.quantity, 10) || 0,
    };
    try {
      const response = await axios.post("/inventory", data);
      setInventory([...inventory, response.data]);
      setNewInventoryItem({ item_name: "", quantity: 0 });
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!charity) return <div>No charity data available</div>;

  return (
    <div className="charity-profile-container">
      <div className="charity-info">
        <h1>{charity.name}</h1>
        <p>{charity.description}</p>
        <p>
          Needed Donation: ${parseFloat(charity.needed_donation).toFixed(2)}
        </p>
        <p>Total Donations: ${totalDonations.toFixed(2)}</p>
        <p>Anonymous Donations: ${anonymousDonations.toFixed(2)}</p>
      </div>

      <div className="stories">
        <h2>Stories</h2>
        {stories.length > 0 ? (
          <div className="story-container">
            <button className="story-nav-btn" onClick={handlePreviousStory}>
              &lt;
            </button>
            <div className="story-card">
              <h3>{stories[currentStoryIndex]?.title || "No Title"}</h3>
              <p>{stories[currentStoryIndex]?.content || "No Content"}</p>
              <p>
                Posted on:{" "}
                {stories[currentStoryIndex]?.date_posted
                  ? new Date(
                      stories[currentStoryIndex].date_posted
                    ).toLocaleString()
                  : "Unknown Date"}
              </p>
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
          <button type="submit">Submit Story</button>
        </form>
      </div>

      <div className="beneficiaries">
        <h2>Beneficiaries</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {beneficiaries.map((beneficiary) => (
              <tr key={beneficiary.id}>
                <td>{beneficiary.name}</td>
                <td>{beneficiary.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
          <button type="submit">Add Beneficiary</button>
        </form>
      </div>

      <div className="inventory">
        <h2>Inventory</h2>
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.item_name}</td>
                <td>{item.quantity}</td>
                <td>{new Date(item.last_updated).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
          <button type="submit">Add Inventory Item</button>
        </form>
      </div>
    </div>
  );
};

export default CharityProfile;
