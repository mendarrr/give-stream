import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CharityDashboard.css";

function CharityDetails() {
  const [charity, setCharity] = useState(null);
  const [stories, setStories] = useState([]);
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const fetchData = async (url, setter, errorMessage) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setter(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(`Error fetching ${errorMessage}:`, error);
        setError(`Failed to fetch ${errorMessage}. Please try again later.`);
      }
    };

    fetchData(
      `http://127.0.0.1:5000/charities/${id}`,
      setCharity,
      "charity details"
    );
    fetchData("http://127.0.0.1:5000/stories", setStories, "success stories");
    fetchData("http://127.0.0.1:5000/donations", setDonations, "donations");

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
      Math.min(prev + 1, stories.length - (isMobile ? 1 : 2))
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
  if (!charity || donations.length === 0 || stories.length === 0)
    return <div>Loading...</div>;

  const formatNumber = (number) => (number ? number.toLocaleString() : "0");

  const visibleStories = Array.isArray(stories)
    ? isMobile
      ? stories.slice(currentIndex, currentIndex + 1)
      : stories.slice(currentIndex, currentIndex + 2)
    : [];

  return (
    <div className="charity-details">
      <h2>{charity.name}</h2>
      <div className="charity-content">
        <CharityInfo
          charity={charity}
          donations={donations}
          formatNumber={formatNumber}
          onDonateClick={handleDonateClick}
        />
        <CharityDescription
          charity={charity}
          successStories={visibleStories}
          formatNumber={formatNumber}
          moveLeft={moveLeft}
          moveRight={moveRight}
          currentIndex={currentIndex}
          storiesLength={stories.length}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}

function CharityInfo({ charity, donations, formatNumber, onDonateClick }) {
  const topDonations = donations.slice(0, 10);

  return (
    <div className="charity-info">
      <div className="progress-card">
        <h3>KES {formatNumber(charity.raisedAmount)}</h3>
        <p>raised of KES {formatNumber(charity.goalAmount)} goal</p>
        <ProgressBar
          progress={(charity.raisedAmount / charity.goalAmount) * 100}
        />
        <p>{formatNumber(charity.donationCount)} donations</p>
        <button className="donate-button" onClick={onDonateClick}>
          Donate Now
        </button>
        <RecentActivity recentDonationCount={charity.recentDonationCount} />
        <RecentDonors donations={topDonations} formatNumber={formatNumber} />
        <ShareFundraiser />
        <div className="see-buttons">
          <button className="see-all">See all</button>
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
      <p>{recentDonationCount} people just donated</p>
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
        {["Copy link", "Facebook", "X", "Email", "More"].map(
          (button, index) => (
            <button
              key={index}
              className={`share-button ${button.toLowerCase()}`}
            >
              <i
                className={`fas fa-${
                  button === "X" ? "times" : button.toLowerCase()
                }`}
              ></i>
              <span>{button}</span>
            </button>
          )
        )}
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
      <img
        src={charity.imageUrl}
        alt={charity.name}
        className="charity-image"
      />
      <p>{charity.organizer} is organizing this fundraiser.</p>
      <div className="donation-protected">
        <span>Donation protected</span>
      </div>
      <h3>Support Malnourished School Children in Moyale</h3>
      <p>{charity.description}</p>
      {successStories.length > 0 ? (
        <SuccessStories
          stories={successStories}
          formatNumber={formatNumber}
          moveLeft={moveLeft}
          moveRight={moveRight}
          currentIndex={currentIndex}
          storiesLength={storiesLength}
          isMobile={isMobile}
        />
      ) : (
        <p>No success stories available.</p>
      )}
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
      <h3>Success Stories</h3>
      <div className="stories-carousel-container">
        <button
          className="carousel-arrow left"
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
        <button
          className="carousel-arrow right"
          onClick={moveRight}
          disabled={currentIndex >= storiesLength - (isMobile ? 1 : 2)}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}

function StoryCard({ story, formatNumber }) {
  return (
    <div className="story-card">
      <h4>{story.title}</h4>
      <p>{story.content}</p>
      <p>Date Posted: {new Date(story.date_posted).toLocaleDateString()}</p>
    </div>
  );
}

function BeneficiaryStory({ story }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newStory, setNewStory] = useState(story.story);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = () => {
    // Save logic
    setIsEditing(false);
  };

  return (
    <div className="beneficiary-story">
      <h5>Beneficiary Story</h5>
      {isEditing ? (
        <>
          <textarea
            value={newStory}
            onChange={(e) => setNewStory(e.target.value)}
          />
          <button onClick={handleSaveClick}>Save</button>
        </>
      ) : (
        <>
          <p>{story.story}</p>
          <button onClick={handleEditClick}>Edit</button>
        </>
      )}
    </div>
  );
}

export default CharityDetails;
