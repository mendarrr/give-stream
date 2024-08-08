import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./CharityDetails.css";

function CharityDetails() {
  const [charity, setCharity] = useState(null);
  const [successStories, setSuccessStories] = useState([]);
  const [donations, setDonations] = useState([]);
  const [comments, setComments] = useState([
    {
      name: "Jane Doe",
      amount: 5000,
      time: "2 hours ago",
      comment: "This is a great cause!",
    },
    {
      name: "John Smith",
      amount: 2000,
      time: "1 day ago",
      comment: "Happy to contribute!",
    },
    {
      name: "Emily Johnson",
      amount: 750,
      time: "3 hours ago",
      comment: "Glad to support this charity. Keep up the great work!",
    },
    {
      name: "Lucas Wilson",
      amount: 800,
      time: "2 days ago",
      comment: "Every little bit helps. Keep making a difference!",
    },
    {
      name: "Olivia Martinez",
      amount: 1200,
      time: "3 days ago",
      comment: "Inspired by your mission. Happy to contribute!",
    },
  ]);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchCharityDetails = async () => {
      try {
        const response = await fetch(`/charities/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCharity(data);
      } catch (error) {
        console.error("Error fetching charity details:", error);
        setError("Failed to fetch charity details. Please try again later.");
      }
    };

    const fetchSuccessStories = async () => {
      try {
        const response = await fetch("/stories");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSuccessStories(data);
      } catch (error) {
        console.error("Error fetching success stories:", error);
        setError("Failed to fetch success stories. Please try again later.");
      }
    };

    const fetchDonations = async () => {
      try {
        const response = await fetch("/donations");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDonations(data);
      } catch (error) {
        console.error("Error fetching donations:", error);
        setError("Failed to fetch donations. Please try again later.");
      }
    };

    fetchCharityDetails();
    fetchSuccessStories();
    fetchDonations();
  }, [id]);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!charity || donations.length === 0 || successStories.length === 0)
    return <div>Loading...</div>;

  const formatNumber = (number) => (number ? number.toLocaleString() : "0");

  return (
    <div className="charity-details">
      <h2>{charity.name}</h2>
      <div className="charity-content">
        <div className="charity-info">
          <div className="progress-card">
            <h3>KES {formatNumber(charity.raisedAmount)}</h3>
            <p>raised of KES {formatNumber(charity.goalAmount)} goal</p>
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${
                    (charity.raisedAmount / charity.goalAmount) * 100
                  }%`,
                }}
              ></div>
            </div>
            <p>{formatNumber(charity.donationCount)} donations</p>
            <button className="donate-button">Donate Now</button>
            <div className="recent-activity">
              <p>{charity.recentDonationCount} people just donated</p>
            </div>
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
                <button className="share-button twitter">
                  <i className="fab fa-twitter"></i>
                  <span>X</span>
                </button>
                <button className="share-button email">
                  <i className="fas fa-envelope"></i>
                  <span>Email</span>
                </button>
                <button className="share-button more">
                  <i className="fas fa-ellipsis-h"></i>
                  <span>More</span>
                </button>
              </div>
            </div>
            <div className="see-buttons">
              <button className="see-all">See all</button>
              <button className="see-top">
                <i className="fas fa-star"></i> See top
              </button>
            </div>
          </div>
        </div>
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
          <div className="success-stories">
            <h3>Success Stories</h3>
            <div className="stories-carousel-container">
              <button
                className="carousel-arrow left"
                onClick={() => scrollCarousel("left")}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <div className="stories-carousel" ref={carouselRef}>
                {successStories.map((story, index) => (
                  <div key={index} className="story-card">
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
                ))}
              </div>
              <button
                className="carousel-arrow right"
                onClick={() => scrollCarousel("right")}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <div className="comments-section">
            <h3>Comments and Insights ({comments.length})</h3>
            {comments.map((comment, index) => (
              <div key={index} className="comment">
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
            ))}
            <button className="report-button">
              <i className="fas fa-flag"></i> Report Fundraiser
            </button>
            <p className="created-info">
              Created 5 d ago · <i className="fas fa-tag"></i> Humanitarian
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharityDetails;
