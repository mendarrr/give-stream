import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./CharityDashboard.css";
import { Edit, Save, Trash } from 'lucide-react';

function CharityDetails() {
  const [charity, setCharity] = useState(null);
  const [successStories, setSuccessStories] = useState([]);
  const [donations, setDonations] = useState([]);    
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
                    <BeneficiaryStory story={story} />
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
        </div>
      </div>
    </div>
  );
}

function BeneficiaryStory({ story }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(story.title);
  const [editedContent, setEditedContent] = useState(story.content);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/stories/${story.id}`, {
        method: 'POST', // Use POST method
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedStory = await response.json();

      // Update the story with the response from the server
      setEditedTitle(updatedStory.title);
      setEditedContent(updatedStory.content);
      setIsEditing(false);

    } catch (error) {
      console.error("Error updating story:", error);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedTitle(story.title); // Reset to original title
    setEditedContent(story.content); // Reset to original content
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };

  return (
    <Card className="story-card">
      <CardHeader>
        {isEditing ? (
          <Input
            value={editedTitle}
            onChange={handleTitleChange}
            placeholder="Edit Title"
          />
        ) : (
          <CardTitle>{story.title}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={handleContentChange}
            placeholder="Edit Content"
          />
        ) : (
          <p>{story.content}</p>
        )}
      </CardContent>
      <div className="edit-buttons">
        {isEditing ? (
          <>
            <Button onClick={handleSaveClick}><Save className="icon" /> Save</Button>
            <Button onClick={handleCancelClick}><Trash className="icon" /> Cancel</Button>
          </>
        ) : (
          <Button onClick={handleEditClick}><Edit className="icon" /> Edit</Button>
        )}
      </div>
    </Card>
  );
}

export default CharityDetails;
