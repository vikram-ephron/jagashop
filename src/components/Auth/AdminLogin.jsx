import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Auth.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const ADMIN_PIN = '9256'; // In a real app, this should be stored securely

  const handlePinChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPin(value);
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      localStorage.setItem('adminUser', JSON.stringify({ 
        role: 'admin',
        loginTime: new Date().toISOString()
      }));
      setPin(''); // Clear PIN
      navigate('/admin/dashboard');
    } else {
      setError('Invalid PIN');
      setPin(''); // Clear PIN on error
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box admin-login">
        <h2>Admin Access</h2>
        <div className="pin-icon">
          <i className="fas fa-lock"></i>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={handlePinChange}
              maxLength="4"
              pattern="\d*"
              inputMode="numeric"
              autoComplete="off"
              required
              className="pin-input"
            />
          </div>
          <div className="pin-dots">
            {[...Array(4)].map((_, index) => (
              <div 
                key={index} 
                className={`pin-dot ${index < pin.length ? 'filled' : ''}`}
              />
            ))}
          </div>
          <button 
            type="submit" 
            className="submit-button"
            disabled={pin.length !== 4}
          >
            Verify PIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 