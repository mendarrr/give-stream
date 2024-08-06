import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
    <div>
      <Routes>
      </Routes>
    </div>
    <div className='footer'>
      <Footer/>
    </div> 
    </BrowserRouter>
  )
}

export default App;
