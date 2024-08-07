import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DonorList.css';


const DonorList = () => {
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [donorsPerPage] = useState(5);
  const [editingDonor, setEditingDonor] = useState(null);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    is_anonymous: false
  });

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await axios.get('/donors');
      setDonors(response.data);
    } catch (error) {
      console.error('Error fetching donors:', error);
    }
  };

  const deleteDonor = async (id) => {
    try {
      await axios.delete(`/donors/${id}`);
      fetchDonors();
    } catch (error) {
      console.error('Error deleting donor:', error);
    }
  };

  const handleDonorClick = (donor) => {
    setSelectedDonor(donor);
    setEditingDonor(null);
  };

  const handleEditClick = (donor) => {
    setEditingDonor(donor);
    setEditForm({
      username: donor.username,
      email: donor.email,
      is_anonymous: donor.is_anonymous
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/donors/${editingDonor.id}`, editForm);
      fetchDonors();
      setEditingDonor(null);
    } catch (error) {
      console.error('Error updating donor:', error);
    }
  };

  // Get current donors
  const indexOfLastDonor = currentPage * donorsPerPage;
  const indexOfFirstDonor = indexOfLastDonor - donorsPerPage;
  const currentDonors = donors.slice(indexOfFirstDonor, indexOfLastDonor);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="donor-list-container">
      <div className="logo-container">
        <img src="./Screenshot_from_2024-08-06_07-21-51-removebg-preview.png" alt="GiveStream Logo" className="logo" />
      </div>
      <h1>Donor List</h1>
      <div className="table-container">
        <table className="donor-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Anonymous</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDonors.map((donor) => (
              <tr key={donor.id} onClick={() => handleDonorClick(donor)}>
                <td>{donor.username}</td>
                <td>{donor.email}</td>
                <td>{donor.is_anonymous ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(donor);
                  }}>Edit</button>
                   <span className="button-spacer"></span>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    deleteDonor(donor.id);
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Pagination
        donorsPerPage={donorsPerPage}
        totalDonors={donors.length}
        paginate={paginate}
        currentPage={currentPage}
      />
      
      {selectedDonor && !editingDonor && (
        <div className="donor-card">
          <h2>{selectedDonor.username}</h2>
          <p><strong>Email:</strong> {selectedDonor.email}</p>
          <p><strong>Anonymous:</strong> {selectedDonor.is_anonymous ? 'Yes' : 'No'}</p>
          <p><strong>ID:</strong> {selectedDonor.id}</p>
          <button onClick={() => setSelectedDonor(null)}>Close</button>
        </div>
      )}

      {editingDonor && (
        <div className="edit-form">
          <h2>Edit Donor</h2>
          <form onSubmit={handleEditSubmit}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={editForm.username}
                onChange={handleEditFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editForm.email}
                onChange={handleEditFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="is_anonymous">Anonymous:</label>
              <input
                type="checkbox"
                id="is_anonymous"
                name="is_anonymous"
                checked={editForm.is_anonymous}
                onChange={handleEditFormChange}
              />
            </div>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditingDonor(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

const Pagination = ({ donorsPerPage, totalDonors, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalDonors / donorsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className='pagination'>
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <a onClick={() => paginate(number)} href='#!' className='page-link'>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DonorList;