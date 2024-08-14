import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./NewDonation.css";
import Switch from "react-switch";
import PaymentMethodSelector from "./PaymentMethod";
import Navbar from "./Navbar";

const DonationForm = ({ donorId, charityId }) => {
  const [donationData, setDonationData] = useState({
    donor_id: donorId,
    charity_id: charityId,
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    is_anonymous: false,
    is_recurring: false,
    recurring_frequency: "",
    payment_method_id: null,
  });
  const [message, setMessage] = useState("");
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(false);

  const showMessage = (messageText, isError = false) => {
    setMessage(messageText);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setDonationData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleToggleAnonymous = () => {
    setDonationData((prevData) => ({
      ...prevData,
      is_anonymous: !prevData.is_anonymous,
    }));
  };

  const handleAmountChange = (amount) => {
    setDonationData((prevData) => ({ ...prevData, amount }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !donationData.donor_id ||
      !donationData.charity_id ||
      donationData.amount === 0 ||
      !donationData.date ||
      !donationData.payment_method_id
    ) {
      showMessage(
        "Please fill in all required fields and select a payment method.",
        true
      );
      return;
    }

    try {
      const response = await axios.post("/donations", donationData);
      showMessage(
        `Donation submitted successfully! ${JSON.stringify(response.data)}`
      );
    } catch (error) {
      console.error(
        "There was an error!",
        error.response ? error.response.data : error
      );
      showMessage("An error occurred. Please try again.", true);
    }
  };

  const handlePaymentSubmit = (event) => {
    event.preventDefault();
    if (!paymentMethodSelected) {
      showMessage("Please select a payment method before proceeding.", true);
      return;
    }
    handleSubmit(event);
  };

  const handlePaymentClick = () => {
    localStorage.setItem("donationAmount", donationData.amount);
  };

  return (
    <>
      <div className="newdonation-container">
        <div>
          <Navbar isSticky={true} isLoggedIn={true} />
        </div>
        {message && (
          <div
            className={`message-container ${
              message.includes("error") ? "error" : "success"
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handlePaymentSubmit} className="donation-form">
          <div className="select-donations">
            <h3>Select Donation Amount</h3>
            {[50000, 100000, 150000, 200000, 250000, 500000].map((amount) => (
              <button
                className="select-donation"
                key={amount}
                type="button"
                onClick={() => handleAmountChange(amount)}
              >
                KES {amount}
              </button>
            ))}
          </div>
          <div className="date-container">
            <label htmlFor="date" className="date">
              Date:
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={donationData.date}
              onChange={handleChange}
              required
              className="date-input"
            />
          </div>
          <div className="anonymous">
            <Switch
              name="is_anonymous"
              checked={donationData.is_anonymous}
              onChange={handleToggleAnonymous}
              color="default"
            />
            <label>Display my name publicly on the fundraiser</label>
          </div>
          <div className="anonymous checkbox">
            <input
              id="recurring"
              name="is_recurring"
              type="checkbox"
              checked={donationData.is_recurring}
              onChange={handleChange}
              className="large-checkbox"
            />

            <label>Recurring Donation?</label>
          </div>
          {donationData.is_recurring && (
            <div className="frequency">
              <label htmlFor="frequency">Recurring Frequency:</label>
              <select
                id="frequency"
                name="recurring_frequency"
                value={donationData.recurring_frequency}
                onChange={handleChange}
                required={donationData.is_recurring}
                className="frequency-select"
              >
                <option value="">Select...</option>
                <option value="daily">Weekly</option>
                <option value="weekly">Monthly</option>
                <option value="monthly">Annually</option>
              </select>
            </div>
          )}
          <div className="dues">
            <h3>Your Total Donation is: </h3>
            <p>Total Due: KSH {donationData.amount}</p>
            <Link
              to="/payment"
              className="next-button payment-btn"
              onClick={handlePaymentClick}
            >
              Make Payment
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default DonationForm;
