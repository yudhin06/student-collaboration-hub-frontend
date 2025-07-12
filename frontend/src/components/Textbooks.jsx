import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const textbooks = [
  { name: 'Introduction to Machine Learning', subject: 'AI-ML', author: 'rinaaz', url: '#' },
  { name: 'Pattern Recognition and Machine Learning', subject: 'AI-ML', author: 'Christopher Bishop', url: '#' },
  { name: 'Introduction to Algorithms', subject: 'DSA', author: 'Thomas H. Cormen', url: '#' },
  { name: 'Data Structures and Algorithms', subject: 'DSA', author: 'Robert Lafore', url: '#' },
  { name: 'Effective Java', subject: 'Java', author: 'Joshua Bloch', url: '#' },
  { name: 'Head First Java', subject: 'Java', author: 'Kathy Sierra', url: '#' },
  { name: 'Python Crash Course', subject: 'Python', author: 'Eric Matthes', url: '#' },
  { name: 'Fluent Python', subject: 'Python', author: 'mohitsar', url: '#' },
];

const Textbooks = () => {
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
        <h1>Textbooks</h1>
      </div>

      <div className="page-content">
        <div className="table-responsive">
          <table className="papers-table">
            <thead>
              <tr>
                <th>Book Name</th>
                <th>Subject</th>
                <th>Author</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {textbooks.map((book, idx) => (
                <tr key={idx}>
                  <td>{book.name}</td>
                  <td>{book.subject}</td>
                  <td>{book.author}</td>
                  <td>
                    <a href={book.url} download className="download-link">Download</a>
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

export default Textbooks; 