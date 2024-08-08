import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CharityProfile.css";

const CharityProfile = () => {
  const [charity, setCharity] = useState(null);
  const [donors, setDonors] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);
  const [anonymousDonations, setAnonymousDonations] = useState(0);
  const [stories, setStories] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [newStory, setNewStory] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    // Fetch charity data
    const fetchCharityData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/charities/1`);
        setCharity(response.data);

        // Fetch donor data
        const donorsResponse = await axios.get(`http://127.0.0.1:5000/donors`);
        setDonors(donorsResponse.data);

        // Fetch donation data
        const donationsResponse = await axios.get(
          `http://127.0.0.1:5000/donations/charity/1`
        );
        setTotalDonations(donationsResponse.data.total_amount);
        setAnonymousDonations(
          donationsResponse.data.donations
            .filter((donation) => donation.is_anonymous)
            .reduce((total, donation) => total + donation.amount, 0)
        );

        // Fetch story data
        const storiesResponse = await axios.get(
          `http://127.0.0.1:5000/stories?charity_id=1`
        );
        setStories(storiesResponse.data);

        // Fetch beneficiary data
        const beneficiariesResponse = await axios.get(
          `http://127.0.0.1:5000/beneficiaries?charity_id=1`
        );
        setBeneficiaries(beneficiariesResponse.data);

        // Fetch inventory data
        const inventoryResponse = await axios.get(
          `http://127.0.0.1:5000/inventory?charity_id=1`
        );
        setInventory(inventoryResponse.data);
      } catch (error) {
        console.error("Error fetching charity data:", error);
      }
    };
    fetchCharityData();
  }, []);

  const handleStorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://127.0.0.1:5000/stories`, {
        ...newStory,
        charity_id: charity.id,
      });
      setStories([...stories, response.data]);
      setNewStory({ title: "", content: "" });
    } catch (error) {
      console.error("Error submitting story:", error);
    }
  };

  if (!charity) return <div>Loading...</div>;

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
        {stories.map((story) => (
          <div key={story.id} className="story-card">
            <h3>{story.title}</h3>
            <p>{story.content}</p>
            <p>Posted on: {new Date(story.date_posted).toLocaleString()}</p>
          </div>
        ))}
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
        {beneficiaries.map((beneficiary) => (
          <div key={beneficiary.id} className="beneficiary-card">
            <h3>{beneficiary.name}</h3>
            <p>{beneficiary.description}</p>
          </div>
        ))}
      </div>

      <div className="inventory">
        <h2>Inventory</h2>
        {inventory.map((item) => (
          <div key={item.id} className="inventory-card">
            <h3>{item.item_name}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Last Updated: {new Date(item.last_updated).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharityProfile;
