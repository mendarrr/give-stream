import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./NewDonation.css";

const PaymentMethodSelector = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [amount, setAmount] = useState(0);
  const [showMethodsModal, setShowMethodsModal] = useState(true);
  const [showInputModal, setShowInputModal] = useState(false);
  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAmount = localStorage.getItem("donationAmount");
    if (storedAmount) {
      setAmount(parseInt(storedAmount, 10));
    } else {
      navigate("/donation-form");
    }
  }, [navigate]);

  const paymentMethods = [
    { name: "PayPal", logo: "/paypal.png" },
    { name: "Google Pay", logo: "/gpayicon.png" },
    { name: "M-Pesa", logo: "/mpesa.png" },
  ];

  const handleMethodClick = async (method) => {
    try {
      const response = await axios.post("/payment-methods", {
        name: method.name,
        description: `Payment of ${amount} made via ${method.name}`,
      });
      console.log("Payment method added:", response.data);
      setSelectedMethod(method);
      setInputValue("");
      setPaymentStatus(null);
      setShowMethodsModal(false);
      setShowInputModal(true);
    } catch (error) {
      console.error("Error adding payment method:", error);
      setPaymentStatus("Error selecting payment method. Please try again.");
    }
  };

  const handleExit = () => {
    navigate("/");
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowInputModal(false);
    setShowPaymentStatusModal(true);
    if (selectedMethod.name === "M-Pesa") {
      try {
        const response = await axios.post("/mpesa-payment", {
          phone_number: inputValue,
          amount: amount,
        });
        console.log("M-Pesa payment initiated:", response.data);
        if (response.data.CheckoutRequestID) {
          setPaymentStatus(
            "Payment initiated. Please check your phone for the M-Pesa prompt."
          );
          setCheckoutRequestId(response.data.CheckoutRequestID);
        } else {
          setPaymentStatus("Failed to initiate payment. Please try again.");
        }
      } catch (error) {
        console.error("Error initiating M-Pesa payment:", error);
        setPaymentStatus("Error initiating payment. Please try again.");
      }
    } else {
      setPaymentStatus("This payment method is not implemented yet.");
    }

    // Show thank you modal after payment status
    setTimeout(() => {
      setShowPaymentStatusModal(false);
      setShowThankYouModal(true);
    }, 5000);

    setTimeout(() => {
      navigate("/");
    }, 10000);
  };

  const closeModal = () => {
    setShowMethodsModal(false);
    setShowInputModal(false);
    setShowPaymentStatusModal(false);
  };

  return (
    <>
      <div>
        <Navbar isSticky={true} isLoggedIn={true} />
      </div>
      {showMethodsModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2 className="payment-title">Select Payment Method</h2>
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <button
                  key={method.name}
                  className="method-button"
                  onClick={() => handleMethodClick(method)}
                >
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="method-image"
                  />
                  <span className="method-name">{method.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {showInputModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2 className="selectedmethod-title">{selectedMethod.name}</h2>
            <form onSubmit={handleSubmit} className="pay-form">
              <input
                className="pay-input"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={`Enter your ${
                  selectedMethod.name === "M-Pesa" ? "M-Pesa number" : "details"
                }`}
                required
              />
              <button type="submit" className="pay-btn">
                Pay {amount}
              </button>
            </form>
          </div>
        </div>
      )}
      {showPaymentStatusModal && (
        <div className="modal status">
          <div className="modal-content status-content">
            {paymentStatus && (
              <p
                className={`payment-status ${
                  paymentStatus.includes("successful") ? "success" : "error"
                }`}
              >
                {paymentStatus}
              </p>
            )}
            {!paymentStatus && <p>Processing payment...</p>}
          </div>
        </div>
      )}
      {showThankYouModal && (
        <div className="modal">
          <div className="modal-content thankss">
            <h2>Thank You for Your Donation!</h2>
            <p>Your generosity makes a difference.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentMethodSelector;
