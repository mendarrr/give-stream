import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import About from './components/About';

function App() {
  return (
    <BrowserRouter>
    <div>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />
      </Routes>
    </div>
    <div className='footer'>
      <Footer/>
    </div> 
    </BrowserRouter>
  )
}

export default App;
