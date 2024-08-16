import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./CharityDashboard.css";
import Navbar from "./Navbar";

function CharityDetails() {
  const [charity, setCharity] = useState(null);
  const [successStories, setSuccessStories] = useState([]);
  const [donations, setDonations] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [beneficiariesPerPage] = useState(5);
  const { id } = useParams();
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDonationPage, setCurrentDonationPage] = useState(1);
  const [donationsPerPage] = useState(3);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const fetchData = async (url, setter, errorMessage) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setter(data);
      } catch (error) {
        console.error(`Error fetching ${errorMessage}:`, error);
        setError(`Failed to fetch ${errorMessage}. Please try again later.`);
      }
    };

    fetchData(`/charities/${id}`, setCharity, "charity details");
    fetchData("/stories", setSuccessStories, "success stories");
    fetchData("/donations", setDonations, "donations");
    fetchData("/beneficiaries", setBeneficiaries, "beneficiaries");

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [id]);

  const moveLeft = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const moveRight = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, successStories.length - (isMobile ? 1 : 3))
    );
  };

  const checkUserLoginStatus = () => {
    const token = localStorage.getItem("userToken");
    return !!token;
  };

  const handleDonateClick = () => {
    if (checkUserLoginStatus()) {
      navigate("/payment");
    } else {
      navigate("/signin");
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!charity || donations.length === 0 || successStories.length === 0)
    return <div>Loading...</div>;

  const formatNumber = (number) => (number ? number.toLocaleString() : "0");

  const visibleStories = isMobile
    ? successStories.slice(currentIndex, currentIndex + 1)
    : successStories.slice(currentIndex, currentIndex + 3);

  // Pagination logic for beneficiaries
  const indexOfLastBeneficiary = currentPage * beneficiariesPerPage;
  const indexOfFirstBeneficiary = indexOfLastBeneficiary - beneficiariesPerPage;
  const currentBeneficiaries = beneficiaries.slice(
    indexOfFirstBeneficiary,
    indexOfLastBeneficiary
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ... existing code ...

  const indexOfLastDonation = currentDonationPage * donationsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
  const currentDonations = donations.slice(
    indexOfFirstDonation,
    indexOfLastDonation
  );

  const paginateDonations = (pageNumber) => setCurrentDonationPage(pageNumber);

  return (
    <div className="charity-details">
      <div>
        <Navbar isSticky={true} isLoggedIn={true} />
      </div>
      <h2 className="charityname">{charity.name}</h2>
      <div className="charity-content">
        <div className="charity-left-column">
          <CharityInfo
            charity={charity}
            donations={currentDonations}
            formatNumber={formatNumber}
            onDonateClick={handleDonateClick}
            donationsPerPage={donationsPerPage}
            totalDonations={donations.length}
            paginateDonations={paginateDonations}
            currentDonationPage={currentDonationPage}
          />
        </div>

        <div className="charity-right-column">
          <CharityDescription
            charity={charity}
            successStories={visibleStories}
            formatNumber={formatNumber}
            moveLeft={moveLeft}
            moveRight={moveRight}
            currentIndex={currentIndex}
            storiesLength={successStories.length}
            isMobile={isMobile}
          />
          <BeneficiariesSection
            beneficiaries={currentBeneficiaries}
            beneficiariesPerPage={beneficiariesPerPage}
            totalBeneficiaries={beneficiaries.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
}
function CharityInfo({
  charity,
  donations,
  formatNumber,
  onDonateClick,
  donationsPerPage,
  totalDonations,
  paginateDonations,
  currentDonationPage,
}) {
  return (
    <div className="charity-info">
      <div className="progress-card">
        <h3>KES {formatNumber(charity.raisedAmount)}</h3>
        <p className="raised">
          raised of<span> KES {formatNumber(charity.goalAmount)} </span> goal
        </p>
        <ProgressBar
          progress={(charity.raisedAmount / charity.goalAmount) * 100}
        />
        <p className="donations">
          {formatNumber(charity.donationCount)} donations
        </p>
        <button className="donate-button" onClick={onDonateClick}>
          Donate Now
        </button>
        <RecentActivity recentDonationCount={charity.recentDonationCount} />
        <RecentDonors
          donations={donations}
          formatNumber={formatNumber}
          donationsPerPage={donationsPerPage}
          totalDonations={totalDonations}
          paginateDonations={paginateDonations}
          currentDonationPage={currentDonationPage}
        />
        <ShareFundraiser />
        <div className="see-buttons">
          <button className="see-top">
            <i className="fa-solid fa-list"></i> See all
          </button>
          <button className="see-top">
            <i className="fas fa-star"></i> See top
          </button>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ progress }) {
  return (
    <div className="progress-bar">
      <div className="progress" style={{ width: `${progress}%` }}></div>
    </div>
  );
}

function RecentActivity({ recentDonationCount }) {
  return (
    <div className="recent-activity">
      <p className="recents">{recentDonationCount} people just donated</p>
    </div>
  );
}

function RecentDonors({ donations, formatNumber }) {
  return (
    <div className="recent-donors">
      {donations.map((donation, index) => (
        <div key={index} className="donor">
          <span className="donor-initial">
            {donation.name && donation.name[0]}
          </span>
          <span className="donor-name">{donation.name}</span>
          <span className="donor-amount">
            KES {formatNumber(donation.amount)}
          </span>
          <span className="donation-type">{donation.type}</span>
        </div>
      ))}
    </div>
  );
}

function ShareFundraiser() {
  return (
    <div className="share-fundraiser">
      <h4>Share this fundraiser</h4>
      <div className="share-buttons">
        <button className="share-button copy-link">
          <i className="fas fa-link"></i>
          <span>Copy link</span>
        </button>
        <button className="share-button facebook">
          <i className="fab fa-facebook-f"></i>
          <span>Facebook</span>
        </button>
        <button className="share-button instagram">
          <i className="fab fa-instagram"></i>
          <span>Instagram</span>
        </button>
        <button className="share-button x">
          <i className="fab fa-x-twitter"></i>
          <span>X</span>
        </button>
      </div>
    </div>
  );
}

function CharityDescription({
  charity,
  successStories,
  formatNumber,
  moveLeft,
  moveRight,
  currentIndex,
  storiesLength,
  isMobile,
}) {
  return (
    <div className="charity-description">
      <div className="img-container">
        <img src={charity.image} alt={charity.name} className="charity-image" />
      </div>
      <p className="organiser">
        <span className="organiser-name">{charity.organizer}</span> is
        organizing this fundraiser
      </p>
      <div className="donation-protected">
        <span>
          <i className="fa-solid fa-shield"></i> Donation protected
        </span>
      </div>
      <h3 className="description">{charity.description}</h3>
      <p className="description-paragraph">
        {" "}
        Welcome to <span className="charity-name">{charity.name}'s</span>{" "}
        profile. Scroll down to view success stories, and see our list of
        beneficiaries. On the left, you'll find our fundraising progress and
        options to donate or share this campaign. If you have any questions,
        please don't hesitate to reach out to us directly..
      </p>
      <SuccessStories
        stories={successStories}
        formatNumber={formatNumber}
        moveLeft={moveLeft}
        moveRight={moveRight}
        currentIndex={currentIndex}
        storiesLength={storiesLength}
        isMobile={isMobile}
      />
    </div>
  );
}

function SuccessStories({
  stories,
  formatNumber,
  moveLeft,
  moveRight,
  currentIndex,
  storiesLength,
  isMobile,
}) {
  return (
    <div className="success-stories">
      <h3 className="success">Success Stories</h3>
      <div className="stories-carousel-container">
        <button
          className="admin-dashboard__nav-button left"
          onClick={moveLeft}
          disabled={currentIndex === 0}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="stories-carousel">
          {stories.map((story, index) => (
            <StoryCard key={index} story={story} formatNumber={formatNumber} />
          ))}
        </div>
        <div className="nav-butons">
          <button
            className="nav-button-left"
            onClick={moveLeft}
            disabled={currentIndex === 0}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            className="nav-button-right"
            onClick={moveRight}
            disabled={currentIndex >= storiesLength - (isMobile ? 1 : 2)}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

function StoryCard({ story, formatNumber }) {
  return (
    <div className="story-card1">
      <h4>{story.title}</h4>
      <p>{story.content}</p>
      <p>Date Posted: {new Date(story.date_posted).toLocaleDateString()}</p>
    </div>
  );
}
function BeneficiariesSection({
  beneficiaries,
  beneficiariesPerPage,
  totalBeneficiaries,
  paginate,
  currentPage,
}) {
  if (!beneficiaries || beneficiaries.length === 0) {
    return <div className="beneficiaries-section">No beneficiaries found.</div>;
  }

  return (
    <div className="beneficiaries-section">
      <h3>Beneficiaries</h3>
      <ul className="beneficiaries-list">
        {beneficiaries.map((beneficiary) => (
          <li key={beneficiary.id} className="beneficiary-item">
            <h4>{beneficiary.name}</h4>
            <p>{beneficiary.description}</p>
          </li>
        ))}
      </ul>
      <Pagination
        beneficiariesPerPage={beneficiariesPerPage}
        totalBeneficiaries={totalBeneficiaries}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
}

function Pagination({
  beneficiariesPerPage,
  totalBeneficiaries,
  paginate,
  currentPage,
}) {
  const pageNumbers = [];

  if (beneficiariesPerPage && totalBeneficiaries) {
    for (
      let i = 1;
      i <= Math.ceil(totalBeneficiaries / beneficiariesPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }
  }

  if (pageNumbers.length <= 1) {
    return null; // Don't render pagination if there's only one page or less
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "active" : ""}`}
          >
            <button
              onClick={() => paginate(number)}
              className="page-link"
              aria-current={currentPage === number ? "page" : undefined}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default CharityDetails;
