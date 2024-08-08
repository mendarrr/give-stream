import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DonationForm = ({ donorId, selectedCharity }) => {
  const [formData, setFormData] = useState({
    donor_id: donorId,
    charity_id: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    is_anonymous: false,
    is_recurring: false,
    recurring_frequency: 'monthly',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedCharity && selectedCharity.id) {
      setFormData(prevData => ({
        ...prevData,
        charity_id: selectedCharity.id
      }));
    }
  }, [selectedCharity]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/donations', formData);
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
    return <p>Please select a charity to donate to.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Donate to {selectedCharity.name}</h2>
      
      <div>
        <label htmlFor="amount">Donation Amount ($):</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          min="1"
          step="0.01"
        />
      </div>

      {/* ... (rest of the form fields remain the same) ... */}

      {error && <p className="error">{error}</p>}
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Donate Now'}
      </button>
    </form>
  );
};

export default DonationForm;