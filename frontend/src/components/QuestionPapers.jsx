import React from 'react';
import { Link } from 'react-router-dom';

const questionPapers = [
  { name: 'AI-ML Midterm 2023', subject: 'AI-ML', year: 2023, filename: 'ai_ml_midterm_2023.pdf' },
  { name: 'Communications End Sem 2022', subject: 'Communications', year: 2022, filename: 'communications_endsem_2022.pdf' },
  { name: 'Data Structures Midterm 2021', subject: 'Data Structures', year: 2021, filename: 'data_structures_midterm_2021.pdf' },
  { name: 'Computer Networks End Sem 2023', subject: 'Computer Networks', year: 2023, filename: 'computer_networks_endsem_2023.pdf' },
  { name: 'Digital Communications Midterm 2023', subject: 'Telecommunications', year: 2023, filename: 'digital_communications_midterm_2023.pdf' },
  { name: 'Wireless Communications End Sem 2022', subject: 'Telecommunications', year: 2022, filename: 'wireless_communications_endsem_2022.pdf' },
  { name: 'Optical Communications Midterm 2021', subject: 'Telecommunications', year: 2021, filename: 'optical_communications_midterm_2021.pdf' },
  { name: 'Satellite Communications End Sem 2023', subject: 'Telecommunications', year: 2023, filename: 'satellite_communications_endsem_2023.pdf' },
  { name: 'Mobile Communications Midterm 2022', subject: 'Telecommunications', year: 2022, filename: 'mobile_communications_midterm_2022.pdf' },
  { name: 'Network Security End Sem 2021', subject: 'Telecommunications', year: 2021, filename: 'network_security_endsem_2021.pdf' },
  { name: 'Signal Processing Midterm 2023', subject: 'Telecommunications', year: 2023, filename: 'signal_processing_midterm_2023.pdf' },
  { name: 'Antenna Theory End Sem 2022', subject: 'Telecommunications', year: 2022, filename: 'antenna_theory_endsem_2022.pdf' },
];

const QuestionPapers = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-top">
          <Link to="/" className="back-btn">
            ← Back to Dashboard
          </Link>
          <Link to="/signin" className="logout-btn">Logout</Link>
        </div>
        <h1>Previous Year Question Papers</h1>
      </div>

      <div className="page-content">
        <div className="table-responsive">
          <table className="papers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Year</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {questionPapers.map((paper, idx) => (
                <tr key={idx}>
                  <td>{paper.name}</td>
                  <td>{paper.subject}</td>
                  <td>{paper.year}</td>
                  <td>
                    <a 
                      href={`http://localhost:8000/api/papers/${paper.filename}`} 
                      download 
                      className="download-link"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuestionPapers; 