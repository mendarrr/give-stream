import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const PaymentMethodSelector = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAmount = localStorage.getItem('donationAmount');
    if (storedAmount) {
      setAmount(parseInt(storedAmount, 10));
    } else {
      navigate('/donation-form');
    }
  }, [navigate]);

  const paymentMethods = [
    { name: 'PayPal', logo: '/paypal.png' },
    { name: 'Google Pay', logo: '/gpayicon.png' },
    { name: 'M-Pesa', logo: '/mpesa.png' },
  ];

  const handleMethodClick = async (method) => {
    try {
      const response = await axios.post('/payment-methods', {
        name: method.name,
        description: `Payment of ${amount} made via ${method.name}`,
      });
      console.log('Payment method added:', response.data);
      setSelectedMethod(method);
      setInputValue('');
      setPaymentStatus(null);
    } catch (error) {
      console.error('Error adding payment method:', error);
      setPaymentStatus('Error selecting payment method. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedMethod.name === 'M-Pesa') {
      try {
        const response = await axios.post('/mpesa-payment', {
          phone_number: inputValue,
          amount: amount,
        });
        console.log('M-Pesa payment initiated:', response.data);
        if (response.data.CheckoutRequestID) {
          setPaymentStatus('Payment initiated. Please check your phone for the M-Pesa prompt.');
          setCheckoutRequestId(response.data.CheckoutRequestID);
          // Start checking payment status
          //checkPaymentStatus(response.data.CheckoutRequestID);
        } else {
          setPaymentStatus('Failed to initiate payment. Please try again.');
        }
      } catch (error) {
        console.error('Error initiating M-Pesa payment:', error);
        setPaymentStatus('Error initiating payment. Please try again.');
      }
    } else {
      setPaymentStatus('This payment method is not implemented yet.');
    }
    
  };
  
  

  const styles = {
    container: {
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '18px',
      marginBottom: '10px',
      textAlign: 'center',
    },
    amount: {
      fontSize: '16px',
      marginBottom: '15px',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    methodsGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    methodRow: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    methodButton: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: '10px',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      background: 'none',
      cursor: 'pointer',
      width: 'calc(50% - 5px)',
      transition: 'background-color 0.3s',
    },
    methodImage: {
      width: '100px',
      height: '40px',
      marginBottom: '5px',
      objectFit: 'contain',
    },
    methodName: {
      fontSize: '12px',
    },
    selectedMethodHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '15px',
    },
    selectedMethodLogo: {
      width: '60px',
      height: '30px',
      marginRight: '10px',
      objectFit: 'contain',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    input: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    backButton: {
      marginTop: '10px',
      padding: '8px',
      backgroundColor: '#f8f9fa',
      border: '1px solid #ccc',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  return (
    <>
    <div>
        <Navbar isSticky={true} isLoggedIn={true} />
    </div>
    <div style={styles.container}>
      {!selectedMethod ? (
        <div>
          <h2 style={styles.title}>Select Payment Method</h2>
          <div style={styles.methodsGrid}>
            {[...Array(Math.ceil(paymentMethods.length / 2))].map((_, rowIndex) => (
              <div key={rowIndex} style={styles.methodRow}>
                {paymentMethods.slice(rowIndex * 2, rowIndex * 2 + 2).map((method) => (
                  <button
                    key={method.name}
                    style={styles.methodButton}
                    onClick={() => handleMethodClick(method)}
                  >
                    <img src={method.logo} alt={method.name} style={styles.methodImage} />
                    <span style={styles.methodName}>{method.name}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div style={styles.selectedMethodHeader}>
            <img src={selectedMethod.logo} alt={selectedMethod.name} style={styles.selectedMethodLogo} />
            <h2 style={styles.title}>{selectedMethod.name}</h2>
          </div>
          <p style={styles.amount}>Total Amount: {amount}</p>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={`Enter your ${selectedMethod.name === 'M-Pesa' ? 'M-Pesa number' : 'details'}`}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Pay {amount}</button>
          </form>
          <button onClick={() => setSelectedMethod(null)} style={styles.backButton}>
            Back to Methods
          </button>
        </div>
      )}
      {paymentStatus && <p>{paymentStatus}</p>}
    </div>
    </>
  );
};

export default PaymentMethodSelector;
