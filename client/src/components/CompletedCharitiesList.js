import React, { useState, useEffect } from 'react';
import CharityCard from './CharityCard';
import './CharityCard.css';

const CompletedCharitiesList = ({ searchTerm }) => {
    const [completedCharities, setCompletedCharities] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);

    useEffect(() => {
        fetch('/charities')
            .then(response => response.json())
            .then(data => {
                const completedCharities = data.filter(charity => 
                    (charity.total_raised / charity.goal_amount) * 100 >= 100
                );
                setCompletedCharities(completedCharities);
            });
    }, []);
    

    const filteredCharities = completedCharities.filter(charity =>
        charity.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const moveLeft = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    const moveRight = () => {
        setCurrentIndex((prev) =>
          Math.min(prev + 1, filteredCharities.length - (isMobile ? 1 : 3))
        );
      };
    
      const visibleCharities = isMobile
      ? filteredCharities.slice(currentIndex, currentIndex + 1)
      : filteredCharities.slice(currentIndex, currentIndex + 3);

    return (
        <div className="charity-list-container completed">
            <h4>.</h4>
            <button className="nav-button left" onClick={moveLeft} disabled={currentIndex === 0}>&lt;</button>
            <div className="charity-list">
                {visibleCharities.map(charity => (
                    <CharityCard key={charity.id} charity={charity} />
                ))}
            </div>
            <button className="nav-button right" onClick={moveRight} disabled={currentIndex >= filteredCharities.length - 3}>&gt;</button>
        </div>
    );    
};

export default CompletedCharitiesList;
