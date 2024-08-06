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
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [updateId, setUpdateId] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);

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

    // Update an existing story
    const updateStory = async () => {
        try {
            const response = await fetch(`${apiUrl}/${updateId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const updatedStory = await response.json();
            setStories(stories.map(story => story.id === updateId ? updatedStory : story));
            setTitle('');
            setContent('');
            setUpdateId('');
            setIsUpdating(false); // Hide the update form after successful update
        } catch (error) {
            console.error('Error updating story:', error);
        }
    };

    // Delete a story
    const deleteStory = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Network response was not ok');
            setStories(stories.filter(story => story.id !== id));
            if (currentIndex >= stories.length - 1) {
                setCurrentIndex(stories.length - 2); // Adjust index if needed
            }
        } catch (error) {
            console.error('Error deleting story:', error);
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

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        updateStory();
    };

    // Handle canceling the update
    const handleCancel = () => {
        setTitle('');
        setContent('');
        setUpdateId('');
        setIsUpdating(false); // Hide the update form
    };

    useEffect(() => {
        fetchStories();
    }, []);

    // Handle story selection for editing
    const handleEdit = (story) => {
        setTitle(story.title);
        setContent(story.content);
        setUpdateId(story.id);
        setIsUpdating(true); // Show the update form
    };

    return (
        <div className="story-container">
            <h1>Stories</h1>
            {isUpdating && (
                <form onSubmit={handleSubmit} className="update-form">
                    <input
                        type="hidden"
                        value={updateId}
                        onChange={(e) => setUpdateId(e.target.value)}
                    />
                    <label>
                        Title:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Content:
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Update Story</button>
                    <button type="button" onClick={handleCancel} className="cancel-button">
                        Cancel Update
                    </button>
                </form>
            )}
            <div className="story-display">
                {stories.length > 0 && (
                    <div className="story-item">
                        <strong>{stories[currentIndex].title}</strong>
                        <p dangerouslySetInnerHTML={{ __html: formatStoryContent(stories[currentIndex].content) }} />
                        <button onClick={() => handleEdit(stories[currentIndex])} className="update-button">
                            Update
                        </button>
                        <button onClick={() => deleteStory(stories[currentIndex].id)} className="delete-button">
                            Delete
                        </button>
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
