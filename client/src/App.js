import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import NewDonorForm from './components/NewDonor';
import DonorList from './components/AllDonors';
import DonationForm from './components/NewDonation';

function App() {
  return (
    <div>
      <DonationForm/>
    </div>
  )
}

export default App;
