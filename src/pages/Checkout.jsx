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

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setLoading(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order object
    const order = {
      id: Date.now(),
      items: cart,
      total: total,
      date: new Date().toISOString(),
      paymentMethod,
      status: 'Completed'
    };

    // Update user's orders in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === user.email);
    
    if (userIndex >= 0) {
      users[userIndex].orders = users[userIndex].orders || [];
      users[userIndex].orders.push(order);
      users[userIndex].cart = []; // Clear cart
      localStorage.setItem('users', JSON.stringify(users));
      updateUserCart([]); // Update cart context
    }

    setLoading(false);
    setOrderPlaced(true);

    // Navigate to order confirmation after 2 seconds
    setTimeout(() => {
      navigate('/order-confirmation', { state: { order } });
    }, 2000);
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

        <div className="payment-section">
          <h2>Payment Method</h2>
          <div className="payment-options">
            <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="card"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <i className="fas fa-credit-card"></i>
              <span>Credit/Debit Card</span>
            </label>

            <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="upi"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <i className="fas fa-mobile-alt"></i>
              <span>UPI</span>
            </label>

            <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="payment"
                value="cod"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <i className="fas fa-money-bill-wave"></i>
              <span>Cash on Delivery</span>
            </label>
          </div>

          <button 
            className={`pay-button ${loading ? 'loading' : ''}`}
            onClick={handlePayment}
            disabled={loading || !paymentMethod}
          >
            {loading ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 