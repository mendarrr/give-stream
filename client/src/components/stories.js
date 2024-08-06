import React, { useState, useEffect } from 'react';

const apiUrl = 'http://127.0.0.1:5000/stories';

const Stories = () => {
    const [stories, setStories] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [updateId, setUpdateId] = useState('');

    // Fetch all stories
    const fetchStories = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setStories(data);
        } catch (error) {
            console.error('Error fetching stories:', error);
        }
    };

    // Add a new story
    const addStory = async () => {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const newStory = await response.json();
            setStories([...stories, newStory]);
            setTitle('');
            setContent('');
        } catch (error) {
            console.error('Error creating story:', error);
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
        } catch (error) {
            console.error('Error deleting story:', error);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    return (
        <div>
            <h1>Stories</h1> {/* Updated title */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (updateId) {
                        updateStory();
                    } else {
                        addStory();
                    }
                }}
            >
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
                <button type="submit">{updateId ? 'Update' : 'Add'} Story</button>
            </form>
            <ul>
                {stories.map(story => (
                    <li key={story.id}>
                        <strong>{story.title}</strong>
                        <p>{story.content}</p>
                        <button onClick={() => {
                            setTitle(story.title);
                            setContent(story.content);
                            setUpdateId(story.id);
                        }}>Edit</button>
                        <button onClick={() => deleteStory(story.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Stories;
