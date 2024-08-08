import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CharityProfile.css";

const CharityProfile = () => {
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
        const response = await axios.get("http://127.0.0.1:5000/charities/1");
        setCharity(response.data);

        const donationsResponse = await axios.get(
          "http://127.0.0.1:5000/donations/charity/1"
        );
        setTotalDonations(donationsResponse.data.total_amount);
        setAnonymousDonations(
          donationsResponse.data.donations
            .filter((donation) => donation.is_anonymous)
            .reduce((total, donation) => total + donation.amount, 0)
        );

        const storiesResponse = await axios.get(
          "http://127.0.0.1:5000/stories?charity_id=1"
        );
        setStories(storiesResponse.data);

        const beneficiariesResponse = await axios.get(
          "http://127.0.0.1:5000/beneficiaries?charity_id=1"
        );
        setBeneficiaries(beneficiariesResponse.data);

        const inventoryResponse = await axios.get(
          "http://127.0.0.1:5000/inventory?charity_id=1"
        );
        setInventory(inventoryResponse.data);
      } catch (error) {
        setError("Error fetching charity data");
        console.error("Error fetching charity data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharityData();
  }, []);

  const handleStorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/stories", {
        ...newStory,
        charity_id: charity.id,
      });
      setStories([...stories, response.data]);
      setNewStory({ title: "", content: "" });
    } catch (error) {
      console.error("Error submitting story:", error);
    }
  };

  const handleBeneficiarySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/beneficiaries", {
        ...newBeneficiary,
        charity_id: charity.id,
      });
      setBeneficiaries([...beneficiaries, response.data]);
      setNewBeneficiary({ name: "", description: "" });
    } catch (error) {
      console.error("Error submitting beneficiary:", error);
    }
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/inventory", {
        ...newInventoryItem,
        charity_id: charity.id,
      });
      setInventory([...inventory, response.data]);
      setNewInventoryItem({ item_name: "", quantity: 0 });
    } catch (error) {
      console.error("Error submitting inventory item:", error);
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
        <p>Needed Donation: ${charity.needed_donation}</p>
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
