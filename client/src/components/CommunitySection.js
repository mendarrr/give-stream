import React, { useState, useEffect } from "react";

const CommunitiesSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [joinedCommunities, setJoinedCommunities] = useState({});

  useEffect(() => {
    fetchCommunities();
  }, [searchTerm]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const moveLeft = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const moveRight = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, communities.length - (isMobile ? 1 : 3))
    );
  };

  const visibleCommunities = isMobile
    ? communities.slice(currentIndex, currentIndex + 1)
    : communities.slice(currentIndex, currentIndex + 3);

  const fetchCommunities = async () => {
    try {
      const response = await fetch(`/communities?search=${searchTerm}`);
      const data = await response.json();
      setCommunities(data);
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  const handleCommunityClick = async (id) => {
    try {
      const response = await fetch(`/communities/${id}`);
      const data = await response.json();
      // Ensure impactStories and events are arrays
      data.impactStories = Array.isArray(data.impactStories)
        ? data.impactStories
        : [];
      data.events = Array.isArray(data.events) ? data.events : [];
      setSelectedCommunity(data);
    } catch (error) {
      console.error("Error fetching community details:", error);
    }
  };

  const joinCommunity = async (id) => {
    try {
      const response = await fetch(`/communities/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "join" }),
      });
      if (!response.ok) {
        throw new Error("Failed to join community");
      }
      const updatedCommunity = await response.json();
      console.log("Community members updated:", updatedCommunity);
      // Update the communities state here
    } catch (error) {
      console.error("Error joining community:", error);
    }
  };

  const toggleCommunityMembership = async (id) => {
    const isJoined = joinedCommunities[id];
    try {
      const response = await fetch(`/communities/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: isJoined ? "leave" : "join" }),
      });
      if (!response.ok) {
        throw new Error(`Failed to ${isJoined ? "leave" : "join"} community`);
      }
      const updatedCommunity = await response.json();
      console.log("Community members updated:", updatedCommunity);
      setJoinedCommunities((prev) => ({ ...prev, [id]: !isJoined }));
      // Update the communities state here
    } catch (error) {
      console.error(
        `Error ${isJoined ? "leaving" : "joining"} community:`,
        error
      );
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const categories = [
    "Arts",
    "Education",
    "Health",
    "Environment",
    "Local Causes",
  ];

  return (
    <div className="communities-section">
      {!selectedCommunity && (
        <div className="community-categories">
          <h2>Browse by Category</h2>
          <select className="category-dropdown">
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="community-container">
        <div className="communities-text">
          <h4>Explore Communities</h4>
          <p>
            Connect with like-minded individuals, support specific causes, or
            create your own community.
          </p>
        </div>
        <div className="search-bar community-search">
          <input
            type="text"
            placeholder="Search for communities..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        {!selectedCommunity && (
          <div className="featured-communities">
            <h2>Featured Communities</h2>
            <div className="community-list-container">
              <button
                className="nav-button left community-left"
                onClick={moveLeft}
                disabled={currentIndex === 0}
              >
                &lt;
              </button>
              <div className="community-list">
                {visibleCommunities.map((community) => (
                  <div
                    key={community.id}
                    className="community-card charity-card"
                    onClick={() => handleCommunityClick(community.id)}
                  >
                    <div className="community-profile">
                      <div
                        className="community-banner"
                        style={{ backgroundImage: `url(${community.banner})` }}
                      ></div>
                    </div>
                    <h3>{community.name}</h3>
                    <p>{community.description}</p>
                    <p>Members: {community.members}</p>
                    <button
                      className={`membership-button ${
                        joinedCommunities[community.id] ? "leave" : "join"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCommunityMembership(community.id);
                      }}
                    >
                      {joinedCommunities[community.id]
                        ? "Leave Community"
                        : "Join Community"}
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="nav-button right community-right"
                onClick={moveRight}
                disabled={
                  currentIndex >= communities.length - (isMobile ? 1 : 3)
                }
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
      {selectedCommunity && (
        <div className="community-detail">
          <button onClick={() => setSelectedCommunity(null)}>
            Back to Communities
          </button>
          <h2>{selectedCommunity.name}</h2>
          <img
            src={selectedCommunity.banner}
            alt={`${selectedCommunity.name} banner`}
          />
          <p>{selectedCommunity.description}</p>
          <h3>Impact Stories</h3>
          <ul>
            {selectedCommunity.impactStories.map((story, index) => (
              <li key={index}>{story}</li>
            ))}
          </ul>
          <h3>Upcoming Events</h3>
          <ul>
            {selectedCommunity.events.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
          <button>Donate</button>
        </div>
      )}
    </div>
  );
};

export default CommunitiesSection;
