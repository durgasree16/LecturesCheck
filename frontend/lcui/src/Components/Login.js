import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'
const Login = () => {
  // State to store user input
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add code to handle authentication, such as sending the credentials to a server
    console.log('Username:', username);
    console.log('Password:', password);
    // After handling authentication, you can redirect the user to another page
  };

  return (
    <div className="login-container">
      <div className="background-image"></div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Link to="/navbar">Login</Link>
      </form>
      <p>
      </p>
    </div>
  );
};

export default Login;