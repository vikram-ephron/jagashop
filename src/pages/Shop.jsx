import React, { useState } from 'react';
import '../styles/Shop.css';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const products = [
    {
      id: 1,
      name: 'Motorcycle Helmet',
      category: 'bike-accessories',
      price: 89.99,
      image: <i className="fas fa-helmet-safety"></i>,
      description: 'High-quality safety helmet with ventilation'
    },
    {
      id: 2,
      name: 'Bike Chain Lube',
      category: 'bike-accessories',
      price: 12.99,
      image: <i className="fas fa-oil-can"></i>,
      description: 'Premium chain lubricant for smooth operation'
    },
    {
      id: 3,
      name: 'Car Phone Mount',
      category: 'car-accessories',
      price: 24.99,
      image: <i className="fas fa-mobile-alt"></i>,
      description: 'Universal phone holder for dashboard'
    },
    {
      id: 4,
      name: 'LED Headlight Bulbs',
      category: 'car-accessories',
      price: 49.99,
      image: <i className="fas fa-lightbulb"></i>,
      description: 'Bright LED replacement bulbs'
    },
    {
      id: 5,
      name: 'Bike Cover',
      category: 'bike-accessories',
      price: 34.99,
      image: <i className="fas fa-shield-alt"></i>,
      description: 'Waterproof cover for motorcycles'
    },
    {
      id: 6,
      name: 'Car Air Freshener',
      category: 'car-accessories',
      price: 7.99,
      image: <i className="fas fa-spray-can"></i>,
      description: 'Long-lasting fresh scent'
    }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <div className="shop-container">
      <h1>Shop Accessories</h1>
      
      <div className="shop-categories">
        <button 
          className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All Products
        </button>
        <button 
          className={`category-btn ${activeCategory === 'bike-accessories' ? 'active' : ''}`}
          onClick={() => setActiveCategory('bike-accessories')}
        >
          Bike Accessories
        </button>
        <button 
          className={`category-btn ${activeCategory === 'car-accessories' ? 'active' : ''}`}
          onClick={() => setActiveCategory('car-accessories')}
        >
          Car Accessories
        </button>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.image}
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-price">₹{product.price}</div>
              <button className="add-to-cart">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop; 