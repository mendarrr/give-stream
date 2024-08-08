import React, { useState, useEffect } from 'react';

const apiUrl = '/stories';

const formatStoryContent = (text) => {
    const wordsPerLine = 9;
    const words = text.split(' ');
    const lines = [];

    for (let i = 0; i < words.length; i += wordsPerLine) {
        lines.push(words.slice(i, i + wordsPerLine).join(' '));
    }

    return lines.join('<br>');
};

const Stories = () => {
    const [stories, setStories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch all stories
    const fetchStories = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setStories(data);
            if (data.length > 0) {
                setCurrentIndex(0); // Start at the first story
            }
        } catch (error) {
            console.error('Error fetching stories:', error);
        }
    };

    // Navigate to the next or previous story
    const handleNavigation = (direction) => {
        if (direction === 'next') {
            setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, stories.length - 1));
        } else if (direction === 'prev') {
            setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    return (
        <div className="story-container">
            <div className="story-display">
                {stories.length > 0 && (
                    <div className="story-item">
                        <strong>{stories[currentIndex].title}</strong>
                        <p dangerouslySetInnerHTML={{ __html: formatStoryContent(stories[currentIndex].content) }} />
                    </div>
                )}
                <div className="navigation-symbols">
                    <span
                        className="symbol prev-symbol"
                        onClick={() => handleNavigation('prev')}
                        style={{ visibility: currentIndex === 0 ? 'hidden' : 'visible' }}
                    >
                        &lt;
                    </span>
                    <span
                        className="symbol next-symbol"
                        onClick={() => handleNavigation('next')}
                        style={{ visibility: currentIndex === stories.length - 1 ? 'hidden' : 'visible' }}
                    >
                        &gt;
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Stories;
