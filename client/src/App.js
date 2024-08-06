import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Stories from './components/stories'; // Import the Stories component

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Stories />} /> {/* Add route for Stories */}
        </Routes>
      </div>
      <div className='footer'>
        <Footer />
      </div> 
    </BrowserRouter>
  );
}

export default App;
