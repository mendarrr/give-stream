import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DonationForm.css'; // Make sure to create this CSS file

const DonationForm = () => {
  const [donationAmount, setDonationAmount] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');
  const [giveStreamTip, setGiveStreamTip] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const navigate = useNavigate();

  const donationAmounts = [500, 2500, 5000, 10000, 25000, 50000];

  useEffect(() => {
    //check if user is logged in and has selected a charity
    const donor = JSON.parse(localStorage.getItem('donor'));
    const charity = JSON.parse(localStorage.getItem('selectedCharity'));
    if (!donor || !charity) {
     navigate('/login');
    } else {
      setSelectedCharity(charity);
   }
  }, [navigate]);

  const handleDonationAmount = (amount) => {
    setDonationAmount(amount);
    calculateTotalDue(amount);
  };

  const handleAnonymous = () => {
    setIsAnonymous(!isAnonymous);
  };

  const handleRecurring = () => {
    setIsRecurring(!isRecurring);
  };

  const handleRecurringFrequency = (e) => {
    setRecurringFrequency(e.target.value);
  };

  const handleGiveStreamTip = (e) => {
    const tip = parseFloat(e.target.value) || 0;
    setGiveStreamTip(tip);
    calculateTotalDue(donationAmount, tip);
  };

  const calculateTotalDue = (amount, tip = giveStreamTip) => {
    const total = amount + tip;
    setTotalDue(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const donor = JSON.parse(localStorage.getItem('donor'));
      const response = await axios.post('/donations', {
        donor_id: donor.id,
        charity_id: selectedCharity.id,
        amount: donationAmount,
        date: new Date().toISOString().split('T')[0],
        is_anonymous: isAnonymous,
        is_recurring: isRecurring,
        recurring_frequency: recurringFrequency,
      });

      console.log('Donation successful:', response.data);
      // Handle successful donation (e.g., show success message, redirect)
    } catch (err) {
      setError('An error occurred while processing your donation. Please try again.');
      console.error('Donation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedCharity) {
    return <p>Loading...</p>;
  }

  return (
    <div className="donation-form">
      <h2>Donate to {selectedCharity.name}</h2>
      
      <div className="donation-amounts">
        {donationAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => handleDonationAmount(amount)}
            className={donationAmount === amount ? 'selected' : ''}
          >
            ${amount}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="donation-summary">
          <h3>Your Donation</h3>
          <p>Donation Amount: ${donationAmount}</p>
          <label>
            Give Stream Tip:
            <input
              type="number"
              value={giveStreamTip}
              onChange={handleGiveStreamTip}
              min="0"
            />
          </label>
          <p><strong>Total Due: ${totalDue}</strong></p>
        </div>

        <div className="donor-options">
          <div className="toggle-switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={handleAnonymous}
              />
              <span className="slider round"></span>
            </label>
            <span>Donate Anonymously</span>
          </div>
          <label>
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={handleRecurring}
            />
            Make this a recurring donation
          </label>
          {isRecurring && (
            <select value={recurringFrequency} onChange={handleRecurringFrequency}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
            </select>
          )}
        </div>

        <button type="submit" disabled={isLoading || donationAmount === 0}>
          {isLoading ? 'Processing...' : 'Donate Now'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default DonationForm;