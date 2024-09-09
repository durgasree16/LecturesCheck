// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import About from './Components/About';
import Upload from './Components/Upload';
import Info from './Components/Info';
import Login from './Components/Login';
import GetStarted from './Components/GetStarted';
import Feedback from './Components/Feedback';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar user={user} setIsAuthenticated={setIsAuthenticated} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/info" element={<Info />} />
          <Route path="/login"element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>}/>
          <Route path="/navbar" element={< Navbar />} />
          <Route path="/get-started" element={<GetStarted />} />
          < Route path ="/feedback" element={<Feedback />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
