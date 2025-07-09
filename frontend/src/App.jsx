import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from './components/MainPage';
import StudentInfo from './components/StudentInfo';
import QuestionPapers from './components/QuestionPapers';
import Textbooks from './components/Textbooks';
import Groups from './components/Groups';
import Post from './components/Post';
import Rules from './components/Rules';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import About from './components/About';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import UserProfile from './components/UserProfile';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`app-root${darkMode ? ' dark' : ''}`}>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/student-info" element={<StudentInfo />} />
          <Route path="/question-papers" element={<QuestionPapers />} />
          <Route path="/textbooks" element={<Textbooks />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/posts" element={<Post darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
