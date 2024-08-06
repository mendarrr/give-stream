document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://127.0.0.1:5000/stories';

    // Function to fetch all stories
    const fetchStories = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const stories = await response.json();
            console.log('Fetched stories:', stories);
            // Process stories here
        } catch (error) {
            console.error('Error fetching stories:', error);
        }
    };

    // Function to add a new story
    const addStory = async (title, content) => {
        const story = { title, content };
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(story)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const newStory = await response.json();
            console.log('Story created:', newStory);
            // Update the story list or UI here
        } catch (error) {
            console.error('Error creating story:', error);
        }
    };

    // Function to update an existing story
    const updateStory = async (id, title, content) => {
        const story = { title, content };
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(story)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const updatedStory = await response.json();
            console.log('Story updated:', updatedStory);
            // Update the story list or UI here
        } catch (error) {
            console.error('Error updating story:', error);
        }
    };

    // Initial fetch
    fetchStories();
});
