import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import HomePage from './components/HomePage';

function App() {
  return (
    <BrowserRouter>
    <div>
      <Routes>
      <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
    <div className='footer'>
      <Footer/>
    </div> 
    </BrowserRouter>
  )
}

export default App;
