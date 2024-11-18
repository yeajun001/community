import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = (e) => {
    e.preventDefault();
    console.log('아이디:', id);
    console.log('비밀번호:', '*'.repeat(password.length));
  };

  return (
    <div className='App'>
      <div className="login-container">
        <div className="left-section">
          <img
            src={`${process.env.PUBLIC_URL}/laptop.png`}
            alt="Computer with mail"
            className="login-image"
          />
        </div>

        <div className="right-section">
          <form className="login-form">
            <h3>로그인</h3>

            <label htmlFor="id">ID:</label>
            <input
              type="text"
              id="id"
              name="id"
              placeholder="ID"
              required
              value={id}
              onChange={(e) => setId(e.target.value)}
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="login-button" onClick={handleClick}>
              Login
            </button>


            <p className="signup-link">회원가입<a href="/Signup" onClick={Login}>signup</a></p>

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

export default Login;
