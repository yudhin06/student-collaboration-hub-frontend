import React from 'react';
import { Link } from 'react-router-dom';

const dashboardFeatures = [
  { label: 'Question Papers', icon: '📄', link: '/question-papers', isRoute: true },
  { label: 'Textbooks', icon: '📚', link: '/textbooks', isRoute: true },
  { label: 'Groups', icon: '👥', link: '/groups', isRoute: true },
  { label: 'Posts', icon: '📝', link: '/posts', isRoute: true },
  { label: 'Student Info', icon: '👤', link: '/student-info', isRoute: true },
  { label: 'Rules', icon: '📋', link: '/rules', isRoute: true },
  { label: 'FAQ', icon: '❓', link: '/faq', isRoute: true },
  { label: 'Contact', icon: '☎️', link: '/contact', isRoute: true },
  { label: 'About', icon: 'ℹ️', link: '/about', isRoute: true },
];

const questionPapers = [
  { name: 'AI-ML Midterm 2023', subject: 'AI-ML', year: 2023, url: '#' },
  { name: 'Communications End Sem 2022', subject: 'Communications', year: 2022, url: '#' },
  { name: 'Data Structures Midterm 2021', subject: 'Data Structures', year: 2021, url: '#' },
  { name: 'Computer Networks End Sem 2023', subject: 'Computer Networks', year: 2023, url: '#' },
];

const textbooks = [
  { name: 'Introduction to Machine Learning', subject: 'AI-ML', author: 'Tom Mitchell', url: '#' },
  { name: 'Pattern Recognition and Machine Learning', subject: 'AI-ML', author: 'Christopher Bishop', url: '#' },
  { name: 'Introduction to Algorithms', subject: 'DSA', author: 'Thomas H. Cormen', url: '#' },
  { name: 'Data Structures and Algorithms', subject: 'DSA', author: 'Robert Lafore', url: '#' },
  { name: 'Effective Java', subject: 'Java', author: 'Joshua Bloch', url: '#' },
  { name: 'Head First Java', subject: 'Java', author: 'Kathy Sierra', url: '#' },
  { name: 'Python Crash Course', subject: 'Python', author: 'Eric Matthes', url: '#' },
  { name: 'Fluent Python', subject: 'Python', author: 'Luciano Ramalho', url: '#' },
];

const trendingTags = [
  '#AI-ML', '#Programming', '#StudyTips', '#Career', '#Groups', '#Textbooks', '#QuestionPapers'
];
const motivationalQuote = "Success is the sum of small efforts, repeated day in and day out.";

const MainPage = ({ darkMode, setDarkMode }) => {
  return (
    <div className={`main-bg${darkMode ? ' dark' : ''}`}> 
      {/* Navbar */}
      <nav className="main-navbar">
        <div className="main-navbar-left">
          <span className="main-logo">Student Collaboration Hub</span>
        </div>
        <div className="main-navbar-right">
          <Link to="/student-info" className="main-nav-link">Profile</Link>
          <button className="dark-mode-toggle" onClick={() => setDarkMode(dm => !dm)}>
            {darkMode ? '🌙 Dark' : '☀️ Light'}
          </button>
          <Link to="/signin" className="logout-btn">Logout</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="main-hero">
        <h1 className="main-hero-title">Welcome to Student Collaboration Hub</h1>
        <p className="main-hero-sub">Your one-stop platform for question papers, textbooks, student info, and more!</p>
      </header>

      {/* Dashboard Section */}
      <section id="dashboard" className="dashboard-section">
        <div className="dashboard-grid">
          {dashboardFeatures.map((feature) => (
            <Link key={feature.label} to={feature.link} className="dashboard-card">
              <span className="dashboard-icon">{feature.icon}</span>
              <span className="dashboard-label">{feature.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        &copy; {new Date().getFullYear()} Student Collaboration Hub. All Rights Reserved.
      </footer>
    </div>
  );
};

export default MainPage; 