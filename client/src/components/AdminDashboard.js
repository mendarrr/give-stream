import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import Navbar from "./Navbar";
import defaultProfileImage from "../assets/defaultProfile.png";

const AdminDashboard = () => {
  const [charityApplications, setCharityApplications] = useState([]);
  const [charities, setCharities] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsPerPage] = useState(5);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [message, setMessage] = useState(null);

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
      const response = await fetch("/charity-applications?status=pending");
      const data = await response.json();
      setCharityApplications(data);
    } catch (error) {
      console.error("Error fetching charity applications:", error);
      setMessage({
        type: "error",
        text: "Failed to fetch charity applications. Please try again.",
      });
    }
  };

  const fetchCharities = async () => {
    try {
      const response = await fetch("/charities");
      const data = await response.json();
      setCharities(data);
    } catch (error) {
      console.error("Error fetching charities:", error);
      setMessage({
        type: "error",
        text: "Failed to fetch charities. Please try again.",
      });
    }
  };

  const handleApprove = async (application) => {
    try {
      const response = await fetch(`/charity-applications/${application.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "approved",
          name: application.name,
          email: application.email,
          description: application.description,
          country: application.country,
          city: application.city,
          zipcode: application.zipcode,
          fundraising_category: application.fundraising_category,
          username: application.username,
          target_amount: application.target_amount,
        }),
      });

      if (response.ok) {
        setCharityApplications(
          charityApplications.filter((app) => app.id !== application.id)
        );
        fetchCharities();
        setMessage({
          type: "success",
          text: "Application approved successfully.",
        });
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: `Failed to approve application: ${errorData.message}`,
        });
      }
    } catch (error) {
      console.error("Error approving application:", error);
      setMessage({
        type: "error",
        text: `Error approving application: ${error.message}`,
      });
    }
  };

  const handleReject = async (application) => {
    try {
      const response = await fetch(`/charity-applications/${application.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "rejected",
          name: application.name,
          email: application.email,
          description: application.description,
          country: application.country,
          city: application.city,
          zipcode: application.zipcode,
          fundraising_category: application.fundraising_category,
          username: application.username,
          target_amount: application.target_amount,
        }),
      });

      if (response.ok) {
        setCharityApplications(
          charityApplications.filter((app) => app.id !== application.id)
        );
        setMessage({
          type: "success",
          text: "Application rejected successfully.",
        });
      } else {
        setMessage({ type: "error", text: "Failed to reject application" });
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      setMessage({
        type: "error",
        text: `Error rejecting application: ${error.message}`,
      });
    }
  };

  const handleDeleteCharity = async (charityId) => {
    try {
      const response = await fetch(`/charities/${charityId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCharities();
        setMessage({ type: "success", text: "Charity deleted successfully." });
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: `Failed to delete charity: ${errorData.error}`,
        });
      }
    } catch (error) {
      console.error("Error deleting charity:", error);
      setMessage({
        type: "error",
        text: `Error deleting charity: ${error.message}`,
      });
    }
    setDeleteConfirmation(null);
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

  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = charityApplications.slice(
    indexOfFirstApplication,
    indexOfLastApplication
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-dashboard">
      <div>
        <Navbar isSticky={true} isLoggedIn={true} />
      </div>
      <h1 className="admin-dashboard__title">Admin Dashboard</h1>
      {message && (
        <div className={`admin-dashboard__message ${message.type}`}>
          {message.text}
          <button
            onClick={() => setMessage(null)}
            className="admin-dashboard__message-close"
          >
            &times;
          </button>
        </div>
      )}

      <section className="admin-dashboard__applications">
        <h2 className="admin-dashboard__section-title">Charity Applications</h2>
        {currentApplications.length > 0 ? (
          <>
            <ul className="admin-dashboard__application-list">
              {currentApplications.map((application) => (
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
            <div className="admin-dashboard__pagination">
              {Array.from({
                length: Math.ceil(
                  charityApplications.length / applicationsPerPage
                ),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`admin-dashboard__pagination-btn ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="admin-dashboard__no-applications">
            No pending applications at the moment.
          </p>
        )}
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
                  onClick={() => setDeleteConfirmation(charity.id)}
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

      {deleteConfirmation && (
        <div className="admin-dashboard__modal">
          <div className="admin-dashboard__modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this charity?</p>
            <div className="admin-dashboard__modal-actions">
              <button onClick={() => handleDeleteCharity(deleteConfirmation)}>
                Yes, Delete
              </button>
              <button onClick={() => setDeleteConfirmation(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
