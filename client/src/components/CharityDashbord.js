import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import Login from "./components/Login";
import "./CharityDetails.css";

function CharityDashboard() {
  const [charity, setCharity] = useState(null);
  const [successStories, setSuccessStories] = useState([]);
  const [donations, setDonations] = useState([]);
  const [comments, setComments] = useState([
    // ... (comments data remains the same)
  ]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { id } = useParams();
  const carouselRef = useRef(null);

  const fetchData = useCallback(async (url, setter) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      setError(`Failed to fetch data. Please try again later.`);
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchData(`http://127.0.0.1:5000/charities/${id}`, setCharity),
        fetchData("http://127.0.0.1:5000/stories", setSuccessStories),
        fetchData("http://127.0.0.1:5000/donations", setDonations)
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, [id, fetchData]);

  const scrollCarousel = useCallback((direction) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  const handleLogin = (success) => {
    if (success) {
      setIsLoggedIn(true);
      setShowLogin(false);
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (loading) return <div>Loading...</div>;

  const formatNumber = (number) => (number ? number.toLocaleString() : "0");

  return (
    <div className="charity-details">
      <h2>{charity.name}</h2>
      <div className="charity-content">
        <CharityInfo 
          charity={charity} 
          donations={donations} 
          formatNumber={formatNumber}
          isLoggedIn={isLoggedIn}
          setShowLogin={setShowLogin}
        />
        <CharityDescription
          charity={charity}
          successStories={successStories}
          comments={comments}
          formatNumber={formatNumber}
          scrollCarousel={scrollCarousel}
          carouselRef={carouselRef}
        />
      </div>
      {showLogin && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowLogin(false)}>×</button>
            <Login onLogin={handleLogin} />
          </div>
        </div>
      )}
    </div>
  );
}

function CharityInfo({ charity, donations, formatNumber, isLoggedIn, setShowLogin }) {
  return (
    <div className="charity-info">
      <div className="progress-card">
        <h3>KES {formatNumber(charity.raisedAmount)}</h3>
        <p>raised of KES {formatNumber(charity.goalAmount)} goal</p>
        <div className="progress-bar">
          <div
            className="progress"
            style={{
              width: `${(charity.raisedAmount / charity.goalAmount) * 100}%`,
            }}
          ></div>
        </div>
        <p>{formatNumber(charity.donationCount)} donations</p>
        {isLoggedIn ? (
          <button className="donate-button">Donate Now</button>
        ) : (
          <div className="signup-prompt">
            <p>Sign up to donate and make a difference!</p>
            <button className="signup-button" onClick={() => setShowLogin(true)}>Sign Up</button>
            <button className="login-button" onClick={() => setShowLogin(true)}>Log In</button>
          </div>
        )}
        <div className="recent-activity">
          <p>{charity.recentDonationCount} people just donated</p>
        </div>
        <div className="recent-donors">
          {donations.map((donation, index) => (
            <DonorInfo key={index} donation={donation} formatNumber={formatNumber} />
          ))}
        </div>
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

function DonorInfo({ donation, formatNumber }) {
  return (
    <div className="donor">
      <span className="donor-initial">{donation.name && donation.name[0]}</span>
      <span className="donor-name">{donation.name}</span>
      <span className="donor-amount">KES {formatNumber(donation.amount)}</span>
      <span className="donation-type">{donation.type}</span>
    </div>
  );
}

function ShareFundraiser() {
  return (
    <div className="share-fundraiser">
      <h4>Share this fundraiser</h4>
      <div className="share-buttons">
        {['copy-link', 'facebook', 'twitter', 'email', 'more'].map((type) => (
          <ShareButton key={type} type={type} />
        ))}
      </div>
    </div>
  );
}

function ShareButton({ type }) {
  const icons = {
    'copy-link': 'fas fa-link',
    'facebook': 'fab fa-facebook-f',
    'twitter': 'fab fa-twitter',
    'email': 'fas fa-envelope',
    'more': 'fas fa-ellipsis-h'
  };
  const labels = {
    'copy-link': 'Copy link',
    'facebook': 'Facebook',
    'twitter': 'X',
    'email': 'Email',
    'more': 'More'
  };

  return (
    <button className={`share-button ${type}`}>
      <i className={icons[type]}></i>
      <span>{labels[type]}</span>
    </button>
  );
}

function CharityDescription({ charity, successStories, comments, formatNumber, scrollCarousel, carouselRef }) {
  return (
    <div className="charity-description">
      <img src={charity.imageUrl} alt={charity.name} className="charity-image" />
      <p>{charity.organizer} is organizing this fundraiser.</p>
      <div className="donation-protected">
        <span>Donation protected</span>
      </div>
      <h3>Support Malnourished School Children in Moyale</h3>
      <p>{charity.description}</p>
      <SuccessStories
        stories={successStories}
        formatNumber={formatNumber}
        scrollCarousel={scrollCarousel}
        carouselRef={carouselRef}
      />
      <CommentsSection comments={comments} formatNumber={formatNumber} />
    </div>
  );
}
function SuccessStories({ stories, formatNumber, scrollCarousel, carouselRef }) {
  return (
    <div className="success-stories">
      <h3>Success Stories</h3>
      <div className="stories-carousel-container">
        <button className="carousel-arrow left" onClick={() => scrollCarousel("left")}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="stories-carousel" ref={carouselRef}>
          {stories.map((story, index) => (
            <StoryCard key={index} story={story} formatNumber={formatNumber} />
          ))}
        </div>
        <button className="carousel-arrow right" onClick={() => scrollCarousel("right")}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}
function StoryCard({ story, formatNumber }) {
  return (
    <div className="story-card">
      <img src={story.image} alt={story.title} />
      <h4>{story.title}</h4>
      <p>RAISED: KES {formatNumber(story.raised)}</p>
      <p>Donations: {formatNumber(story.donations)}</p>
      <div className="progress-bar">
        <div
          className="progress"
          style={{
            width: `${(story.raised / story.goal) * 100}%`,
          }}
        ></div>
      </div>
      <p>
        KES {formatNumber(story.raised)} funds raised of KES{" "}
        {formatNumber(story.goal)} goal
      </p>
      <button className="donate-button">DONATE</button>
    </div>
  );
}
function CommentsSection({ comments, formatNumber }) {
  return (
    <div className="comments-section">
      <h3>Comments and Insights ({comments.length})</h3>
      {comments.map((comment, index) => (
        <Comment key={index} comment={comment} formatNumber={formatNumber} />
      ))}
      <button className="report-button">
        <i className="fas fa-flag"></i> Report Fundraiser
      </button>
      <p className="created-info">
        Created 5 d ago · <i className="fas fa-tag"></i> Humanitarian
      </p>
    </div>
  );
}
function Comment({ comment, formatNumber }) {
  return (
    <div className="comment">
      <div className="comment-header">
        <span className="commenter-initial">{comment.name[0]}</span>
        <span className="commenter-name">{comment.name}</span>
        <span className="comment-amount">
          KES {formatNumber(comment.amount)}
        </span>
        <span className="comment-time">{comment.time}</span>
      </div>
      <p className="comment-text">{comment.comment}</p>
    </div>
  );
}

export default CharityDashboard;