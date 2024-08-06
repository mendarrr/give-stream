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

    // Initial fetch
    fetchStories();
});
