import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Sandbox from './Sandbox';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sandbox" element={<Sandbox />} />
      </Routes>
    </Router>
  );
}

export default App;
