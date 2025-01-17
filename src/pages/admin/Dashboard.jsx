import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Admin.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();

  useEffect(() => {
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));
    if (!adminUser || adminUser.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    // Check if login time is more than 30 minutes ago
    const loginTime = new Date(adminUser.loginTime);
    const now = new Date();
    const timeDiff = now.getTime() - loginTime.getTime();
    const minutesDiff = Math.floor(timeDiff / 1000 / 60);

    if (minutesDiff > 30) {
      localStorage.removeItem('adminUser');
      navigate('/admin/login');
      return;
    }

    // Load users and their orders
    const usersData = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(usersData);

    // Collect all orders
    const allOrders = usersData.reduce((acc, user) => {
      const userOrders = (user.orders || []).map(order => ({
        ...order,
        userEmail: user.email,
        userName: user.name
      }));
      return [...acc, ...userOrders];
    }, []);

    setOrders(allOrders.sort((a, b) => b.id - a.id));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const updateLoginTime = () => {
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));
    if (adminUser) {
      adminUser.loginTime = new Date().toISOString();
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
    }
  };

  useEffect(() => {
    const handleActivity = () => {
      updateLoginTime();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        {/* <h1>Admin Dashboard</h1> */}
        {/* <button onClick={handleLogout} className="logout-btn">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button> */}
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <i className="fas fa-users"></i>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p>{users.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-shopping-bag"></i>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p>{orders.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-rupee-sign"></i>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p>₹{orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="tab-buttons">
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="fas fa-users"></i> Users
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="fas fa-shopping-bag"></i> Orders
          </button>
        </div>

        {activeTab === 'users' ? (
          <div className="users-table">
            <h2>Registered Users</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Join Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.email}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.orders?.length || 0}</td>
                    <td>₹{user.orders?.reduce((sum, order) => sum + order.total, 0).toFixed(2) || '0.00'}</td>
                    <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="orders-table">
            <h2>Recent Orders</h2>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.userName}</td>
                    <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</td>
                    <td>₹{order.total.toFixed(2)}</td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 