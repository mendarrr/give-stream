import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./CharityDetails.css";

function CharityDetails() {
  const [charity, setCharity] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchCharityDetails = async () => {
      try {
        console.log(`Fetching charity with ID: ${id}`);
        const response = await fetch(`http://127.0.0.1:5000/charities/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);
        setCharity(data);
      } catch (error) {
        console.error("Error fetching charity details:", error);
        setError("Failed to fetch charity details. Please try again later.");
      }
    };

    fetchCharityDetails();
  }, [id]);

  const successStories = [
    {
      title: "SDA Mbotela Camp Meeting Expenses",
      raised: 331200,
      donations: 591,
      goal: 600000,
      image: "path_to_image1.jpg",
    },
    {
      title: "Qiya's Journey of Hope",
      raised: 255300,
      donations: 132,
      goal: 1000000,
      image: "path_to_image2.jpg",
    },
    {
      title: "Makongeni Camp 2024",
      raised: 611945,
      donations: 1203,
      goal: 700000,
      image: "path_to_image3.jpg",
    },
    {
      title: "Feeding Program 2024",
      raised: 450000,
      donations: 789,
      goal: 800000,
      image: "path_to_image4.jpg",
    },
  ];

  const comments = [
    {
      name: "Umbra Foundation",
      amount: 15000,
      comment: "Hope the kids get their food",
      time: "1 hr",
    },
    {
      name: "Amy Bhoke",
      amount: 5000,
      comment: "When I saw this I had to make a contribution",
      time: "1 d",
    },
    {
      name: "Mary Omondi",
      amount: 2000,
      comment: "Lovely",
      time: "2 d",
    },
    {
      name: "Naman Parkesh",
      amount: 3000,
      comment: "Let's support our children",
      time: "2 d",
    },
    {
      name: "Hadid Faraka",
      amount: 500,
      comment: "Hope this helps, keep sending updates our way",
      time: "2 d",
    },
    {
      name: "Sylvia Nefartiti",
      amount: 100,
      comment:
        "It's not much but I hope my contribution makes a difference no matter how small it may be.",
      time: "2 d",
    },
  ];

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth;
      if (direction === "left") {
        carouselRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      } else {
        carouselRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!charity) return <div>Loading...</div>;

  return (
    <div className="charity-details">
      <h2>{charity.name}</h2>
      <div className="charity-content">
        <div className="charity-info">
          <div className="progress-card">
            <h3>KES {charity.raisedAmount.toLocaleString()}</h3>
            <p>raised of KES {charity.goalAmount.toLocaleString()} goal</p>
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
            <p>{charity.donationCount.toLocaleString()} donations</p>
            <button className="donate-button">Donate Now</button>
            <div className="recent-activity">
              <p>{charity.recentDonationCount} people just donated</p>
            </div>
            <div className="recent-donors">
              {charity.recentDonors &&
                charity.recentDonors.map((donor, index) => (
                  <div key={index} className="donor">
                    <span className="donor-initial">{donor.name[0]}</span>
                    <span className="donor-name">{donor.name}</span>
                    <span className="donor-amount">
                      KES {donor.amount.toLocaleString()}
                    </span>
                    <span className="donation-type">{donor.type}</span>
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
            style={{ width: "25%" }}
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
                    <p>RAISED: KES {story.raised.toLocaleString()}</p>
                    <p>Donations: {story.donations}</p>
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{
                          width: `${(story.raised / story.goal) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p>
                      KES {story.raised.toLocaleString()} funds raised of KES{" "}
                      {story.goal.toLocaleString()} goal
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
                    KES {comment.amount.toLocaleString()}
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
