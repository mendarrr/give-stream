import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
// import NewDonorForm from './components/NewDonor';
// import DonorList from './components/AllDonors';
import HomePage from "./components/HomePage";
import About from "./components/About";
import AccessibilityStatement from "./components/AccessibilityStatement";
import PrivacyPolicy from "./components/PrivacyPolicy";
import YourPrivacyChoices from "./components/YourPrivacyChoices";
import CookiePolicy from "./components/CookiePolicy";
import PrivacyNotice from "./components/PrivacyNotice";
import TermsOfUse from "./components/TermsOfUse";
import Legal from "./components/Legal";
import FAQ from "./components/FAQ";
import CompletedCharitiesList from "./components/CompletedCharitiesList";
import LoginPage from "./components/LoginForm";
import NewDonorForm from "./components/NewDonor";
import DonationForm from "./components/NewDonation";
import CharityList from "./components/CharityList";
import Inventory from "./components/Inventory";
import CharityDashboard from "./components/CharityDashbord";

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
          <Route
            path="/completed-charities"
            element={<CompletedCharitiesList />}
          />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/donor" element={<NewDonorForm />} />
          <Route path="/charities" element={<CharityList />} />
          <Route path="/donation" element={<DonationForm />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/charity-dashboard/:id" element={<CharityDashboard />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
