import React from 'react';
import { useNavigate } from 'react-router-dom';
import lmsImage from '../assets/lms1.png';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/get-started');
  };

  return (
    <div className="home-container">
      <img src={lmsImage} alt="Lectures Check" className="home-image" />
      <button className="get-started-button" onClick={handleGetStarted}>Get Started</button>
    </div>
  );
};

export default Home;
