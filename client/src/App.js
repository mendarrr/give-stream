import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
// Import other components
import HomePage from './components/HomePage';
import About from './components/About';
import AccessibilityStatement from './components/AccessibilityStatement';
import PrivacyPolicy from './components/PrivacyPolicy';
import YourPrivacyChoices from './components/YourPrivacyChoices';
import CookiePolicy from './components/CookiePolicy';
import PrivacyNotice from './components/PrivacyNotice';
import TermsOfUse from './components/TermsOfUse';
import Legal from './components/Legal';
import FAQ from './components/FAQ';
import CompletedCharitiesList from './components/CompletedCharitiesList';
import CharityApplications from './components/CharityApplications'; // Import CharityApplications component

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/accessibility" element={<AccessibilityStatement />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/privacy-choices" element={<YourPrivacyChoices />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/privacy" element={<PrivacyNotice />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/completed-charities" element={<CompletedCharitiesList />} />
          <Route path="/create-campaign" element={<CharityApplications />} /> {/* Add this route */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
