import React, { useState, useEffect } from 'react';
import CharityCard from './CharityCard';

const CharityList = () => {
    const [charities, setCharities] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/charities')
            .then(response => response.json())
            .then(data => setCharities(data));
    }, []);

    return (
        <div className="charity-list">
            {charities.map(charity => (
                <CharityCard key={charity.id} charity={charity} />
            ))}
        </div>
    );
};

export default CharityList;
