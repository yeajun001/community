import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/signup', formData);
      alert(response.data);
      navigate('/'); // 회원가입 성공 시 Home 페이지로 이동
    } catch (error) {
      console.error('There was an error!', error);
      alert('Failed to register');
    }
  };

  return (
    <div className="app-container">
      <div className="signup-container">  

        <div className="right-section">
          <form className="signup-form" onSubmit={handleSubmit}>
            <h3>회원가입</h3>
            
            <label htmlFor="username">이름:</label>
            <input type="text" id="username" name="username" placeholder="id" onChange={handleChange} required />
            
            <label htmlFor="id">아이디:</label>
            <input type="text" id="id" name="id" placeholder="ID를 입력하세요." onChange={handleChange} required />

            <label htmlFor="password">패스워드:</label>
            <input type="password" id="password" name="password" placeholder="Password" onChange={handleChange} required />

            <label htmlFor="confirm-password">패스워드 확인:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />

            <label htmlFor="email">이메일:</label>
            <input type="email" id="email" name="email" placeholder="Email" onChange={handleChange} required />

            <button type="submit" className="register-button">회원가입</button>

            <div className="social-icons">
              <a href="/facebook"><i className="fab fa-facebook"></i></a>
              <a href="/whatsapp"><i className="fab fa-whatsapp"></i></a>
              <a href="/telegram"><i className="fab fa-telegram"></i></a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
