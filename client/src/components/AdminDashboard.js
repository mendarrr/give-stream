import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import defaultProfileImage from "../assets/defaultProfile.png";

const AdminDashboard = () => {
  const [charityApplications, setCharityApplications] = useState([]);
  const [charities, setCharities] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    fetchCharityApplications();
    fetchCharities();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchCharityApplications = async () => {
    try {
      const response = await fetch("/charity-applications");
      const data = await response.json();
      setCharityApplications(data);
    } catch (error) {
      console.error("Error fetching charity applications:", error);
    }
  };

  const fetchCharities = async () => {
    try {
      const response = await fetch("/charities");
      const data = await response.json();
      console.log("Fetched charities:", data);
      setCharities(data);
    } catch (error) {
      console.error("Error fetching charities:", error);
    }
  };

  const handleApprove = async (application) => {
    try {
      const response = await fetch(`/charity-applications/${application.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });

      if (response.ok) {
        fetchCharityApplications();
        fetchCharities();
      } else {
        console.error("Failed to approve application");
      }
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleReject = async (application) => {
    try {
      const response = await fetch(`/charity-applications/${application.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });

      if (response.ok) {
        fetchCharityApplications();
      } else {
        console.error("Failed to reject application");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  const handleDeleteCharity = async (charityId) => {
    try {
      const response = await fetch(`/charities/${charityId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCharities();
      } else {
        console.error("Failed to delete charity");
      }
    } catch (error) {
      console.error("Error deleting charity:", error);
    }
  };

  const moveLeft = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const moveRight = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, charities.length - (isMobile ? 1 : 3))
    );
  };

  const visibleCharities = isMobile
    ? charities.slice(currentIndex, currentIndex + 1)
    : charities.slice(currentIndex, currentIndex + 3);

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
        <div className="admin-dashboard__charity-list-container">
          <button
            className="admin-dashboard__nav-button left"
            onClick={moveLeft}
            disabled={currentIndex === 0}
          >
            &lt;
          </button>
          <div className="admin-dashboard__charity-list">
            {visibleCharities.map((charity) => (
              <div key={charity.id} className="admin-dashboard__charity-card">
                <div className="admin-dashboard__charity-image">
                  <img
                    src={charity.image_url || defaultProfileImage}
                    alt={charity.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultProfileImage;
                    }}
                  />
                </div>
                <h3 className="admin-dashboard__charity-name">
                  {charity.name}
                </h3>
                <p className="admin-dashboard__charity-description">
                  {charity.description}
                </p>
                <button
                  className="admin-dashboard__delete-btn"
                  onClick={() => handleDeleteCharity(charity.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <button
            className="admin-dashboard__nav-button right"
            onClick={moveRight}
            disabled={currentIndex >= charities.length - (isMobile ? 1 : 3)}
          >
            &gt;
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
