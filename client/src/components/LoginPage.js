// LoginPage.js

import React, { useState } from 'react';
import { Link, Navigate,useNavigate } from 'react-router-dom';
import {toast} from 'sonner';
import axios from 'axios';

const LoginPage = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('user',token);
      setToken(token);

      toast.success('Login Successful')
      navigate('/');

    } catch (error) {
      toast.success('Username or Password is incorrect')
      console.error('Login error:', error);
    }
  };

  return (
  <div className="login-container"> {/* Apply CSS class to the container */}
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="form-submit-button" type="submit">Login</button> {/* Apply CSS class to the button */}
    </form>
  </div>
  
  );
};

export default LoginPage;
