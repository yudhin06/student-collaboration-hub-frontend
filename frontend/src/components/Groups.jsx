import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Groups = () => {
  const [activeTab, setActiveTab] = useState('study-groups');
  const [openChats, setOpenChats] = useState({});
  const [messages, setMessages] = useState({});
  const [newMessages, setNewMessages] = useState({});
  const [userGroups, setUserGroups] = useState([
    { 
      name: 'AI-ML Study Group', 
      members: 15, 
      subject: 'AI-ML', 
      description: 'Study group for AI and Machine Learning concepts',
      memberNames: ['Arjun Sharma', 'Priya Patel', 'Rahul Verma', 'Anjali Singh', 'Vikram Malhotra']
    },
    { 
      name: 'DSA Practice Group', 
      members: 22, 
      subject: 'Data Structures', 
      description: 'Practice data structures and algorithms together',
      memberNames: ['Dev Patel', 'Meera Iyer', 'Rohan Kapoor', 'Kavya Reddy', 'Aditya Gupta']
    },
    { 
      name: 'Java Programming Club', 
      members: 18, 
      subject: 'Java', 
      description: 'Learn and practice Java programming',
      memberNames: ['Krishna Kumar', 'Aisha Khan', 'Siddharth Joshi', 'Zara Ahmed', 'Rajesh Kumar']
    },
    { 
      name: 'Python Developers', 
      members: 25, 
      subject: 'Python', 
      description: 'Python programming and development projects',
      memberNames: ['Sneha Sharma', 'Dhruv Mehta', 'Riya Chopra', 'Mohan Das', 'Fatima Ali']
    },
    { 
      name: 'Telecommunications Lab', 
      members: 12, 
      subject: 'Telecommunications', 
      description: 'Lab work and practical sessions',
      memberNames: ['Amit Kumar', 'Jaya Reddy', 'Vishal Singh', 'Nisha Patel', 'Ravi Shankar']
    },
  ]);

  const projectTeams = [
    { 
      name: 'Web Development Team', 
      members: 5, 
      project: 'E-Learning Platform', 
      status: 'Active',
      memberNames: ['Sanjay Kumar', 'Neha Sharma', 'Lakshmi Devi', 'Deepak Singh', 'Pooja Patel']
    },
    { 
      name: 'Mobile App Team', 
      members: 4, 
      project: 'Student Portal App', 
      status: 'Planning',
      memberNames: ['Aryan Singh', 'Rashmi Verma', 'Tarun Kumar', 'Shweta Gupta']
    },
    { 
      name: 'AI Research Team', 
      members: 6, 
      project: 'ML Model Development', 
      status: 'Active',
      memberNames: ['Vivek Sharma', 'Maya Reddy', 'Kartik Patel', 'Ananya Singh', 'Chirag Malhotra', 'Esha Khan']
    },
    { 
      name: 'Database Team', 
      members: 3, 
      project: 'Student Database System', 
      status: 'Completed',
      memberNames: ['Dinesh Kumar', 'Jyoti Singh', 'Rakesh Sharma']
    },
  ];

  const discussionForums = [
    { 
      name: 'General Discussion', 
      topics: 45, 
      lastActivity: '2 hours ago', 
      description: 'General academic discussions',
      memberNames: ['Dr. Rajesh Kumar', 'Prof. Meera Iyer', 'Dr. Amit Singh', 'Rahul Verma', 'Priya Patel']
    },
    { 
      name: 'Technical Q&A', 
      topics: 32, 
      lastActivity: '1 day ago', 
      description: 'Technical questions and answers',
      memberNames: ['Prof. Vikram Malhotra', 'Dr. Anjali Sharma', 'Arjun Kumar', 'Kavya Reddy', 'Siddharth Joshi']
    },
    { 
      name: 'Career Guidance', 
      topics: 28, 
      lastActivity: '3 days ago', 
      description: 'Career advice and guidance',
      memberNames: ['Dr. Sunita Rao', 'Prof. Ramesh Kumar', 'Alumni Vivek', 'Alumni Sneha', 'Industry Expert Raj']
    },
    { 
      name: 'Project Showcase', 
      topics: 15, 
      lastActivity: '1 week ago', 
      description: 'Showcase your projects',
      memberNames: ['Project Lead Aditya', 'Project Lead Zara', 'Showcase Admin Dev', 'Featured Student Riya', 'Featured Student Krishna']
    },
  ];

  // Sample messages for each group
  const initialMessages = {
    'AI-ML Study Group': [
      { id: 1, sender: 'Arjun Sharma', message: 'Hey everyone! Anyone up for studying neural networks today?', time: '10:30 AM' },
      { id: 2, sender: 'Priya Patel', message: 'I\'m in! Let\'s start with backpropagation', time: '10:32 AM' },
      { id: 3, sender: 'Rahul Verma', message: 'Perfect timing, I was just reviewing that topic', time: '10:35 AM' },
    ],
    'DSA Practice Group': [
      { id: 1, sender: 'Dev Patel', message: 'Who wants to practice binary trees today?', time: '9:15 AM' },
      { id: 2, sender: 'Meera Iyer', message: 'I need help with tree traversal algorithms', time: '9:20 AM' },
      { id: 3, sender: 'Rohan Kapoor', message: 'Let\'s solve some LeetCode problems together', time: '9:25 AM' },
    ],
    'Java Programming Club': [
      { id: 1, sender: 'Krishna Kumar', message: 'Anyone working on Spring Boot projects?', time: '2:00 PM' },
      { id: 2, sender: 'Aisha Khan', message: 'I\'m building a REST API, need some help', time: '2:05 PM' },
      { id: 3, sender: 'Siddharth Joshi', message: 'I can help with Spring Security configuration', time: '2:10 PM' },
    ],
    'Web Development Team': [
      { id: 1, sender: 'Sanjay Kumar', message: 'Team meeting at 3 PM today', time: '11:00 AM' },
      { id: 2, sender: 'Neha Sharma', message: 'I\'ve completed the frontend components', time: '11:15 AM' },
      { id: 3, sender: 'Lakshmi Devi', message: 'Great! I\'ll review the code and provide feedback', time: '11:20 AM' },
    ],
    'AI Research Team': [
      { id: 1, sender: 'Vivek Sharma', message: 'Model training completed with 95% accuracy', time: '4:30 PM' },
      { id: 2, sender: 'Maya Reddy', message: 'Excellent results! Ready for deployment', time: '4:35 PM' },
      { id: 3, sender: 'Kartik Patel', message: 'I\'ll prepare the deployment documentation', time: '4:40 PM' },
    ],
    'General Discussion': [
      { id: 1, sender: 'Dr. Rajesh Kumar', message: 'Welcome to the general discussion forum!', time: '8:00 AM' },
      { id: 2, sender: 'Rahul Verma', message: 'Thanks! Looking forward to great discussions', time: '8:15 AM' },
      { id: 3, sender: 'Prof. Meera Iyer', message: 'Remember to follow the community guidelines', time: '8:30 AM' },
    ],
  };

  // Initialize messages if not already set
  React.useEffect(() => {
    if (Object.keys(messages).length === 0) {
      setMessages(initialMessages);
    }
  }, []);

  const toggleChat = (groupName) => {
    setOpenChats(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const sendMessage = (groupName) => {
    const messageText = newMessages[groupName]?.trim();
    if (messageText) {
      const messageObj = {
        id: Date.now(),
        sender: 'You',
        message: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => ({
        ...prev,
        [groupName]: [...(prev[groupName] || []), messageObj]
      }));

      setNewMessages(prev => ({
        ...prev,
        [groupName]: ''
      }));
    }
  };

  const handleKeyPress = (e, groupName) => {
    if (e.key === 'Enter') {
      sendMessage(groupName);
    }
  };

  const updateNewMessage = (groupName, value) => {
    setNewMessages(prev => ({
      ...prev,
      [groupName]: value
    }));
  };

  // Handler for exiting a group (to be connected to backend)
  const handleExitGroup = (groupName) => {
    // For now, just remove from local state. Replace with API call later.
    setUserGroups(userGroups.filter(group => group.name !== groupName));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-top">
          <Link to="/" className="back-btn">
            ← Back to Dashboard
          </Link>
          <Link to="/signin" className="logout-btn">Logout</Link>
        </div>
        <h1>Groups & Collaboration</h1>
      </div>

      <div className="page-content">
        {/* Tab Navigation */}
        <div className="groups-tabs">
          <button 
            className={`tab-btn ${activeTab === 'study-groups' ? 'active' : ''}`}
            onClick={() => setActiveTab('study-groups')}
          >
            Study Groups
          </button>
          <button 
            className={`tab-btn ${activeTab === 'project-teams' ? 'active' : ''}`}
            onClick={() => setActiveTab('project-teams')}
          >
            Project Teams
          </button>
          <button 
            className={`tab-btn ${activeTab === 'discussion-forums' ? 'active' : ''}`}
            onClick={() => setActiveTab('discussion-forums')}
          >
            Discussion Forums
          </button>
        </div>

        {/* Study Groups Tab */}
        {activeTab === 'study-groups' && (
          <div className="groups-section">
            <div className="section-header">
              <h2>Study Groups</h2>
            </div>
            <div className="groups-grid">
              {userGroups.map((group, idx) => (
                <div key={idx} className="group-card">
                  <div className="group-header">
                    <h3>{group.name}</h3>
                    <span className="member-count">{group.members} members</span>
                  </div>
                  <p className="group-subject">{group.subject}</p>
                  <p className="group-description">{group.description}</p>
                  <div className="members-section">
                    <h4>Members:</h4>
                    <div className="members-list">
                      {group.memberNames.map((member, memberIdx) => (
                        <span key={memberIdx} className="member-tag">{member}</span>
                      ))}
                    </div>
                  </div>
                  <div className="group-actions">
                    <button className="chat-btn" onClick={() => toggleChat(group.name)}>💬 Chat with Group</button>
                    <button className="view-btn">View Details</button>
                    <button className="exit-btn" onClick={() => handleExitGroup(group.name)}>Exit Group</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Windows */}
        {Object.keys(openChats).map(groupName => {
          if (openChats[groupName]) {
            return (
              <div key={groupName} className="chat-window">
                <div className="chat-header">
                  <h3>💬 {groupName}</h3>
                  <button className="close-chat-btn" onClick={() => toggleChat(groupName)}>×</button>
                </div>
                <div className="chat-messages">
                  {messages[groupName]?.map((msg, idx) => (
                    <div key={msg.id} className={`message ${msg.sender === 'You' ? 'own-message' : 'other-message'}`}>
                      <div className="message-header">
                        <span className="message-sender">{msg.sender}</span>
                        <span className="message-time">{msg.time}</span>
                      </div>
                      <div className="message-content">{msg.message}</div>
                    </div>
                  ))}
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessages[groupName] || ''}
                    onChange={(e) => updateNewMessage(groupName, e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, groupName)}
                  />
                  <button onClick={() => sendMessage(groupName)}>Send</button>
                </div>
              </div>
            );
          }
          return null;
        })}

        {/* Project Teams Tab */}
        {activeTab === 'project-teams' && (
          <div className="groups-section">
            <div className="section-header">
              <h2>Project Teams</h2>
            </div>
            <div className="groups-grid">
              {projectTeams.map((team, idx) => (
                <div key={idx} className="group-card">
                  <div className="group-header">
                    <h3>{team.name}</h3>
                    <span className={`status-badge ${team.status.toLowerCase()}`}>
                      {team.status}
                    </span>
                  </div>
                  <p className="group-subject">{team.project}</p>
                  <p className="member-count">{team.members} members</p>
                  <div className="members-section">
                    <h4>Team Members:</h4>
                    <div className="members-list">
                      {team.memberNames.map((member, memberIdx) => (
                        <span key={memberIdx} className="member-tag">{member}</span>
                      ))}
                    </div>
                  </div>
                  <div className="group-actions">
                    <button className="chat-btn" onClick={() => toggleChat(team.name)}>💬 Chat with Team</button>
                    <button className="view-btn">View Project</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discussion Forums Tab */}
        {activeTab === 'discussion-forums' && (
          <div className="groups-section">
            <div className="section-header">
              <h2>Discussion Forums</h2>
            </div>
            <div className="groups-grid">
              {discussionForums.map((forum, idx) => (
                <div key={idx} className="group-card">
                  <div className="group-header">
                    <h3>{forum.name}</h3>
                    <span className="topic-count">{forum.topics} topics</span>
                  </div>
                  <p className="group-description">{forum.description}</p>
                  <p className="last-activity">Last activity: {forum.lastActivity}</p>
                  <div className="members-section">
                    <h4>Active Participants:</h4>
                    <div className="members-list">
                      {forum.memberNames.map((member, memberIdx) => (
                        <span key={memberIdx} className="member-tag">{member}</span>
                      ))}
                    </div>
                  </div>
                  <div className="group-actions">
                    <button className="chat-btn" onClick={() => toggleChat(forum.name)}>💬 Join Discussion</button>
                    <button className="view-btn">Browse Topics</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups; 