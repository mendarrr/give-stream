import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import NewDonorForm from './components/NewDonor';
import DonorList from './components/AllDonors';
import HomePage from './components/HomePage';
import About from './components/About';

function App() {
  return (
    <div>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}

export default App;
