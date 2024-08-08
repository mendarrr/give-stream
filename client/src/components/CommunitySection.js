import React, { useState, useEffect } from 'react';

const CommunitiesSection = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [communities, setCommunities] = useState([]);
    const [selectedCommunity, setSelectedCommunity] = useState(null);

    useEffect(() => {
        fetchCommunities();
    }, [searchTerm]);

    const fetchCommunities = async () => {
        const response = await fetch(`/communities?search=${searchTerm}`);
        const data = await response.json();
        setCommunities(data);
    };

    const handleCommunityClick = async (id) => {
        const response = await fetch(`/communities/${id}`);
        const data = await response.json();
        setSelectedCommunity(data);
    };

    const joinCommunity = async (id) => {
      const response = await fetch(`/community/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'join' }),
      });
  
      const updatedCommunity = await response.json();
      console.log('Community members updated:', updatedCommunity);
   };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const categories = ['Arts', 'Education', 'Health', 'Environment', 'Local Causes'];

    return (
      <div className="communities-section">
          <h1>Explore Communities</h1>
          <p>Connect with like-minded individuals, support specific causes, or create your own community.</p>
          <div className="community-search">
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
                  <div className="community-list">
                      {communities.map(community => (
                          <div 
                              key={community.id} 
                              className="community-card"
                              onClick={() => handleCommunityClick(community.id)}
                          >
                              <h3>{community.name}</h3>
                              <p>{community.description}</p>
                              <p>Members: {community.members}</p>
                              <button className="join-button" onClick={() => joinCommunity(community.id)}>Join Community</button>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {!selectedCommunity && (
              <div className="community-categories">
                  <h2>Browse by Category</h2>
                  <select className="category-dropdown">
                      <option value="">Select a category</option>
                      {categories.map((category, index) => (
                          <option key={index} value={category.toLowerCase()}>{category}</option>
                      ))}
                  </select>
              </div>
          )}

            {selectedCommunity && (
                <div className="community-detail">
                    <button onClick={() => setSelectedCommunity(null)}>Back to Communities</button>
                    <h2>{selectedCommunity.name}</h2>
                    <img src={selectedCommunity.banner} alt={`${selectedCommunity.name} banner`} />
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
