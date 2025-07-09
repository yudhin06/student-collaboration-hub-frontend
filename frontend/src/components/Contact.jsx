import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Contact = () => {
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
        <h1>Contact</h1>
      </div>

      <div className="page-content">
        <div className="main-contact-grid">
          <div>
            <h3>Support</h3>
            <p>Email: support@studenthub.com<br />Phone: 123-456-7890</p>
          </div>
          <div>
            <h3>Admin</h3>
            <p>Email: admin@studenthub.com<br />Phone: 987-654-3210</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 