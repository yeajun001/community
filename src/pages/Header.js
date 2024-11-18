// pages/Header.js
import React from "react";
import { useNavigate } from 'react-router-dom';
import './header.css';

function Header() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleCategoryClick = (category) => {
    navigate(`/?category=${category}`);
  };

  return (
    <div className="header-container">
      <div className="logo-search-container">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          건전 커뮤니티
        </div>
      </div>
      <div className="header">
        <div>
          <p onClick={() => handleCategoryClick("갤러리")}>갤러리</p>
          <p onClick={() => handleCategoryClick("인물갤")}>인물갤</p>
          <p onClick={() => handleCategoryClick("미니갤")}>미니갤</p>
        </div>
      </div>
    </div>
  );
}

export default Header;
