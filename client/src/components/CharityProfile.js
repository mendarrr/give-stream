import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./CharityProfile.css";
import { useParams } from "react-router-dom";
import { FaLink, FaFacebookF, FaTwitter, FaEnvelope } from "react-icons/fa";

const CharityProfile = () => {
  const { id } = useParams();
  const [charity, setCharity] = useState(null);
  const [stories, setStories] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [newStory, setNewStory] = useState({ title: "", content: "" });
  const [newInventory, setNewInventory] = useState({
    item_name: "",
    quantity: 0,
  });
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: "",
    description: "",
  });

  const fetchCharityData = useCallback(async () => {
    try {
      const response = await axios.get(`/charities/${id}`);
      setCharity(response.data);
    } catch (error) {
      console.error("Error fetching charity data:", error);
    }
  }, [id]);

  const fetchStories = useCallback(async () => {
    try {
      const response = await axios.get("/stories");
      setStories(response.data.filter((story) => story.charity_id === id));
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  }, [id]);

  const fetchInventories = useCallback(async () => {
    try {
      const response = await axios.get("/inventory");
      setInventories(response.data.filter((item) => item.charity_id === id));
    } catch (error) {
      console.error("Error fetching inventories:", error);
    }
  }, [id]);

  const fetchBeneficiaries = useCallback(async () => {
    try {
      const response = await axios.get("/beneficiaries");
      setBeneficiaries(
        response.data.filter((beneficiary) => beneficiary.charity_id === id)
      );
    } catch (error) {
      console.error("Error fetching beneficiaries:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchCharityData();
    fetchStories();
    fetchInventories();
    fetchBeneficiaries();
  }, [
    id,
    fetchCharityData,
    fetchStories,
    fetchInventories,
    fetchBeneficiaries,
  ]);

  const handleAddStory = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/stories", { ...newStory, charity_id: id });
      setNewStory({ title: "", content: "" });
      fetchStories();
    } catch (error) {
      console.error("Error adding story:", error);
    }
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/inventory", {
        ...newInventory,
        charity_id: id,
      });
      setNewInventory({ item_name: "", quantity: 0 });
      fetchInventories();
    } catch (error) {
      console.error("Error adding inventory:", error);
    }
  };

  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/beneficiaries", {
        ...newBeneficiary,
        charity_id: id,
      });
      setNewBeneficiary({ name: "", description: "" });
      fetchBeneficiaries();
    } catch (error) {
      console.error("Error adding beneficiary:", error);
    }
  };

  if (!charity) return <div>Loading...</div>;

  return (
    <div className="charity-profile">
      <div className="charity-info">
        <img src={charity.image_url} alt={charity.name} />
        <h1>{charity.name}</h1>
        <p>{charity.description}</p>
      </div>
      <div className="charity-content-wrapper">
        <div className="fundraising-card">
          <div className="fundraising-progress">
            <h2>KES {charity.goal_amount}</h2>
            <p>raised of KES {charity.needed_donation} goal</p>
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${
                    (charity.goal_amount / charity.needed_donation) * 100
                  }%`,
                }}
              ></div>
            </div>
            <p>{charity.recentDonationCount} donations</p>
          </div>
          <button className="donate-button">Close Campaign</button>
          <div className="recent-donors">
            <h3>{charity.recentDonors.length} people just donated</h3>
            {charity.recentDonors.map((donor, index) => (
              <div key={index} className="donor">
                <div className="donor-initials">{donor.name.charAt(0)}</div>
                <div className="donor-info">
                  <p>{donor.name}</p>
                  <p>KES {donor.amount}</p>
                  <p>{donor.type}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="share-fundraiser">
            <h3>Share this fundraiser</h3>
            <div className="share-buttons">
              <button className="share-button">
                <FaLink />
              </button>
              <button className="share-button">
                <FaFacebookF />
              </button>
              <button className="share-button">
                <FaTwitter />
              </button>
              <button className="share-button">
                <FaEnvelope />
              </button>
              <button className="share-button">•••</button>
            </div>
          </div>
          <div className="view-buttons">
            <button className="view-button">See all</button>
            <button className="view-button">★ See top</button>
          </div>
        </div>
        <div className="charity-content">
          <div className="stories card">
            <h2>Stories</h2>
            {stories.map((story) => (
              <div key={story.id} className="story">
                <h3>{story.title}</h3>
                <p>{story.content}</p>
              </div>
            ))}
            <form onSubmit={handleAddStory}>
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
              <button type="submit">Add Story</button>
            </form>
          </div>
          <div className="inventories card">
            <h2>Inventories</h2>
            {inventories.map((item) => (
              <div key={item.id} className="inventory-item">
                <p>
                  {item.item_name}: {item.quantity}
                </p>
              </div>
            ))}
            <form onSubmit={handleAddInventory}>
              <input
                type="text"
                placeholder="Item Name"
                value={newInventory.item_name}
                onChange={(e) =>
                  setNewInventory({
                    ...newInventory,
                    item_name: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newInventory.quantity}
                onChange={(e) =>
                  setNewInventory({
                    ...newInventory,
                    quantity: parseInt(e.target.value),
                  })
                }
              />
              <button type="submit">Add Inventory Item</button>
            </form>
          </div>
          <div className="beneficiaries card">
            <h2>Beneficiaries</h2>
            {beneficiaries.map((beneficiary) => (
              <div key={beneficiary.id} className="beneficiary">
                <h3>{beneficiary.name}</h3>
                <p>{beneficiary.description}</p>
              </div>
            ))}
            <form onSubmit={handleAddBeneficiary}>
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
        </div>
      </div>
    </div>
  );
};

export default CharityProfile;
