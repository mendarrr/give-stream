import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Switch from 'react-switch';
import PaymentMethodSelector from './PaymentMethod';

const DonationForm = () => {
  const [donationData, setDonationData] = useState({
    donor_id: '',
    charity_id: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    is_anonymous: false,
    is_recurring: false,
    recurring_frequency: '',
    payment_method_id: null
  });
  const [message, setMessage] = useState('');
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(false);

  const showMessage = (messageText, isError = false) => {
    setMessage(messageText);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setDonationData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggleAnonymous = () => {
    setDonationData(prevData => ({ ...prevData, is_anonymous: !prevData.is_anonymous }));
  };

  const handleAmountChange = (amount) => {
    setDonationData(prevData => ({ ...prevData, amount }));
  };

  const handlePaymentMethodChange = (selectedPaymentMethod) => {
    console.log('Selected payment method:', selectedPaymentMethod);
    setDonationData(prevData => ({
      ...prevData,
      payment_method_id: selectedPaymentMethod.id
    }));
    setPaymentMethodSelected(true); // Indicate that a payment method has been selected
    console.log('Updated donation data:', donationData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Ensure that all required fields are filled and a payment method is selected
    if (!donationData.donor_id || !donationData.charity_id || donationData.amount === 0 || !donationData.date || !donationData.payment_method_id) {
      showMessage('Please fill in all required fields and select a payment method.', true);
      return;
    }

    try {
      console.log('Submitting donation data:', donationData);
      const response = await axios.post('/donations', donationData);
      showMessage(`Donation submitted successfully! ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error('There was an error!', error.response ? error.response.data : error);
      showMessage('An error occurred. Please try again.', true);
    }
  };
  

  const handlePaymentSubmit = (event) => {
    event.preventDefault();
    if (!paymentMethodSelected) {
      showMessage('Please select a payment method before proceeding.', true);
      return;
    }
    handleSubmit(event); // Submit the form if a payment method is selected
  };

  return (
    <>
      {message && (
        <div className={`message-container ${message.includes('error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handlePaymentSubmit}>
        <div>
          <label htmlFor="donorId">Donor ID:</label>
          <input
            id="donorId"
            name="donor_id"
            type="text"
            value={donationData.donor_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="charityId">Charity ID:</label>
          <input
            id="charityId"
            name="charity_id"
            type="text"
            value={donationData.charity_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <h3>Select Donation Amount</h3>
          {[500, 1000, 2000, 5000, 10000].map(amount => (
            <button key={amount} type="button" onClick={() => handleAmountChange(amount)}>
              Donate KSH {amount}
            </button>
          ))}
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            id="date"
            name="date"
            type="date"
            value={donationData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>
            Anonymous?
            <Switch
              name="is_anonymous"
              checked={donationData.is_anonymous}
              onChange={handleToggleAnonymous}
              color="default"
            />
          </label>
        </div>
        <div>
          <label>
            Recurring Donation?
            <input
              id="recurring"
              name="is_recurring"
              type="checkbox"
              checked={donationData.is_recurring}
              onChange={handleChange}
            />
          </label>
        </div>
        {donationData.is_recurring && (
          <div>
            <label htmlFor="frequency">Recurring Frequency:</label>
            <select
              id="frequency"
              name="recurring_frequency"
              value={donationData.recurring_frequency}
              onChange={handleChange}
              required={donationData.is_recurring}
            >
              <option value="">Select...</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        )}
        <div>
          <h3>Your Donation</h3>
          <p>Total Due: KSH {donationData.amount}</p>
          <Link to="/payment" className='payment-btn'>Make Payment</Link>
          <PaymentMethodSelector userId={donationData.donor_id} amount={donationData.amount} />

        </div>
        
        <button 
          type="submit" 
          disabled={!donationData.donor_id || !donationData.charity_id || donationData.amount === 0 || !donationData.date || !donationData.payment_method_id}
        >
          Submit Donation
        </button>
      </form>
    </>
  );
};

export default DonationForm;
