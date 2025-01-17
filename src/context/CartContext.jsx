import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser) {
        setUser(currentUser);
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userCart = users.find(u => u.email === currentUser.email)?.cart || [];
        setCart(userCart);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setCart([]);
    navigate('/');
  };

  const updateUserCart = (newCart) => {
    try {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex(u => u.email === user.email);
      
      if (userIndex >= 0) {
        users[userIndex].cart = newCart;
        localStorage.setItem('users', JSON.stringify(users));
        setCart(newCart);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const addToCart = (product) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    const safeProduct = {
      ...product,
      image: undefined,
      iconClass: product.iconClass
    };

    const newCart = [...cart];
    const itemIndex = newCart.findIndex(item => item.id === safeProduct.id);

    if (itemIndex >= 0) {
      newCart[itemIndex].quantity += 1;
    } else {
      newCart.push({ ...safeProduct, quantity: 1 });
    }

    updateUserCart(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    updateUserCart(newCart);
  };

  const updateQuantity = (productId, quantity) => {
    const newCart = cart.map(item => 
      item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
    ).filter(item => item.quantity > 0);
    
    updateUserCart(newCart);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart,
      updateQuantity,
      updateUserCart,
      user, 
      setUser,
      logout,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext); 