import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [charityApplications, setCharityApplications] = useState([]);
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    fetchCharityApplications();
    fetchCharities();
  }, []);

  const fetchCharityApplications = async () => {
    const response = await fetch("/charity-applications");
    const data = await response.json();
    setCharityApplications(data);
  };

  const fetchCharities = async () => {
    const response = await fetch("/charities");
    const data = await response.json();
    setCharities(data);
  };

  const handleApprove = async (application) => {
    const response = await fetch(`/charity-applications/${application.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });

    if (response.ok) {
      fetchCharityApplications();
      fetchCharities();
    }
  };

  const handleReject = async (application) => {
    const response = await fetch(`/charity-applications/${application.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" }),
    });

    if (response.ok) {
      fetchCharityApplications();
    }
  };

  const handleDeleteCharity = async (charityId) => {
    const response = await fetch(`/charities/${charityId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchCharities();
    }
  };

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard__title">Admin Dashboard</h1>

      <section className="admin-dashboard__applications">
        <h2 className="admin-dashboard__section-title">Charity Applications</h2>
        <ul className="admin-dashboard__application-list">
          {charityApplications.map((application) => (
            <li
              key={application.id}
              className="admin-dashboard__application-item"
            >
              <h3 className="admin-dashboard__application-name">
                {application.name}
              </h3>
              <p className="admin-dashboard__application-description">
                {application.description}
              </p>
              <div className="admin-dashboard__application-actions">
                <button
                  className="admin-dashboard__approve-btn"
                  onClick={() => handleApprove(application)}
                >
                  Approve
                </button>
                <button
                  className="admin-dashboard__reject-btn"
                  onClick={() => handleReject(application)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="admin-dashboard__charities">
        <h2 className="admin-dashboard__section-title">Approved Charities</h2>
        <ul className="admin-dashboard__charity-list">
          {charities.map((charity) => (
            <li key={charity.id} className="admin-dashboard__charity-item">
              <h3 className="admin-dashboard__charity-name">{charity.name}</h3>
              <p className="admin-dashboard__charity-description">
                {charity.description}
              </p>
              <button
                className="admin-dashboard__delete-btn"
                onClick={() => handleDeleteCharity(charity.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
