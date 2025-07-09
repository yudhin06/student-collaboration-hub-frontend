import React from 'react';
import { Link } from 'react-router-dom';

const Rules = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-top">
          <Link to="/" className="back-btn">
            ← Back to Dashboard
          </Link>
          <Link to="/signin" className="logout-btn">Logout</Link>
        </div>
        <h1>Rules</h1>
      </div>

      <div className="page-content">
        <ul className="main-list">
          <li>Respect all members and resources.</li>
          <li>Use resources responsibly and ethically.</li>
          <li>Keep your account information secure.</li>
          <li>Report any issues or inappropriate content.</li>
        </ul>
      </div>
    </div>
  );
};

export default Rules; 