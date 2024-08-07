import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
// import NewDonorForm from './components/NewDonor';
// import DonorList from './components/AllDonors';
import HomePage from './components/HomePage';
import About from './components/About';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App;
