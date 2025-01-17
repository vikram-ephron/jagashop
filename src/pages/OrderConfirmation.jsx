import React, { useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { usePDF } from 'react-to-pdf';
import '../styles/OrderConfirmation.css';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  const contentRef = useRef();
  const { toPDF, targetRef } = usePDF({filename: `order-${order?.id}.pdf`});

  if (!order) {
    return navigate('/shop');
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-box" ref={targetRef}>
        <div className="order-header">
          <img src="/images/logo.png" alt="Vizon Workshop Logo" className="invoice-logo" />
          <div className="company-details">
            <h2>Vizon Workshop</h2>
            <p>123 Mechanic Street, City</p>
            <p>Phone: +1 234 567 8900</p>
            <p>Email: info@vizonworkshop.com</p>
          </div>
        </div>

        <div className="invoice-details">
          <div className="invoice-row">
            <span>Invoice No:</span>
            <span>#{order.id}</span>
          </div>
          <div className="invoice-row">
            <span>Date:</span>
            <span>{formatDate(order.date)}</span>
          </div>
          <div className="invoice-row">
            <span>Payment Method:</span>
            <span>{order.paymentMethod.toUpperCase()}</span>
          </div>
        </div>

        <div className="order-details">
          <h3>Order Details</h3>
          <table className="order-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="item-info">
                      <i className={item.iconClass}></i>
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3">Total Amount</td>
                <td>₹{order.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="thank-you-message">
          <p>Thank you for your purchase!</p>
          <p>For any queries, please contact our support team.</p>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={() => toPDF()} className="download-pdf">
          <i className="fas fa-download"></i> Download Invoice
        </button>
        <Link to="/shop" className="continue-shopping">
          Continue Shopping
        </Link>
        <Link to="/orders" className="view-orders">
          View Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation; 