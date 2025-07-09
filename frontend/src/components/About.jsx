import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const About = () => {
  const { logout } = useAuth();
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-top">
          <Link to="/" className="back-btn">
            ← Back to Dashboard
          </Link>
          <button onClick={() => logout()} className="logout-btn">Logout</button>
        </div>
        <h1>About</h1>
      </div>

      <div className="page-content">
        <p className="main-section-text">
          Student Collaboration Hub is designed to help students access previous year question papers, textbooks, and important resources in one place. Stay organized, informed, and ahead in your academic journey!
        </p>
      </div>
    </div>
  );
};

export default About; 