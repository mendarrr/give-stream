import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import components
import HomePage from "./components/Homepage";
import CharityList from "./components/CharityList";
import CharityDetails from "./components/CharityDetails";
import CharityProfile from "./components/CharityProfile";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/charities" element={<CharityList />} />
          <Route path="/charity/:id" element={<CharityDetails />} />
          <Route path="/charity-profile/:id" element={<CharityProfile />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
