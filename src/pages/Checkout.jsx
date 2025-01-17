import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, user, updateUserCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [showUpiForm, setShowUpiForm] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateUpiId = (upiId) => {
    // Basic UPI ID validation
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    return upiRegex.test(upiId);
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (paymentMethod === 'upi' && !validateUpiId(upiId)) {
      alert('Please enter a valid UPI ID');
      return;
    }

    if (!address.street || !address.city || !address.state || !address.pincode || !address.phone) {
      alert('Please fill in all address details');
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order object
      const order = {
        id: Date.now(),
        items: cart,
        total: total,
        date: new Date().toISOString(),
        paymentMethod,
        status: paymentMethod === 'cod' ? 'Pending' : 'Completed',
        address,
        paymentDetails: paymentMethod === 'upi' ? { upiId } : null
      };

      // Update user's orders in localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex(u => u.email === user.email);
      
      if (userIndex >= 0) {
        users[userIndex].orders = users[userIndex].orders || [];
        users[userIndex].orders.push(order);
        users[userIndex].cart = [];
        localStorage.setItem('users', JSON.stringify(users));
        updateUserCart([]);
      }

      setOrderPlaced(true);

      // Navigate to order confirmation after 2 seconds
      setTimeout(() => {
        navigate('/order-confirmation', { state: { order } });
      }, 2000);
    } catch (error) {
      alert('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-success">
        <i className="fas fa-check-circle"></i>
        <h2>Payment Successful!</h2>
        <p>Redirecting to order confirmation...</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      <div className="checkout-sections">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cart.map(item => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  <i className={item.iconClass}></i>
                  <span>{item.name}</span>
                </div>
                <div className="item-details">
                  <span>{item.quantity} × ₹{item.price.toFixed(2)}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="order-total">
            <span>Total Amount:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="delivery-address">
          <h2>Delivery Address</h2>
          <div className="address-form">
            <input
              type="text"
              name="street"
              placeholder="Street Address"
              value={address.street}
              onChange={handleAddressChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleAddressChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={address.state}
              onChange={handleAddressChange}
              required
            />
            <input
              type="text"
              name="pincode"
              placeholder="PIN Code"
              value={address.pincode}
              onChange={handleAddressChange}
              pattern="[0-9]*"
              maxLength="6"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={address.phone}
              onChange={handleAddressChange}
              pattern="[0-9]*"
              maxLength="10"
              required
            />
          </div>
        </div>

        <div className="payment-section">
          <h2>Payment Method</h2>
          <div className="payment-options">
            <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="upi"
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setShowUpiForm(true);
                }}
              />
              <i className="fas fa-mobile-alt"></i>
              <span>UPI Payment</span>
            </label>

            <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="cod"
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setShowUpiForm(false);
                }}
              />
              <i className="fas fa-money-bill-wave"></i>
              <span>Cash on Delivery</span>
            </label>
          </div>

          {showUpiForm && (
            <div className="upi-form">
              <input
                type="text"
                placeholder="Enter UPI ID (e.g., name@upi)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
              />
            </div>
          )}

          <button 
            className={`pay-button ${loading ? 'loading' : ''}`}
            onClick={handlePayment}
            disabled={loading || !paymentMethod || (paymentMethod === 'upi' && !upiId)}
          >
            {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : `Pay ₹${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 