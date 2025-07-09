import React from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-top">
          <Link to="/" className="back-btn">
            ← Back to Dashboard
          </Link>
          <Link to="/signin" className="logout-btn">Logout</Link>
        </div>
        <h1>FAQ</h1>
      </div>

      <div className="page-content">
        <div className="main-faq-list">
          <div className="main-faq-item">
            <strong>How do I access question papers?</strong>
            <p>Click on the 'Question Papers' card in the dashboard or use the navigation menu.</p>
          </div>
          <div className="main-faq-item">
            <strong>Can I download textbooks?</strong>
            <p>Yes, available textbooks can be downloaded from the 'Textbooks' section.</p>
          </div>
          <div className="main-faq-item">
            <strong>How do I update my student info?</strong>
            <p>Go to the 'Student Info' card and follow the instructions to update your details.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 