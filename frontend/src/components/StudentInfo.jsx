import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { useAuth } from '../hooks/useAuth';

const StudentInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = React.useRef();

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }
    const fetchUser = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await apiService.authAPI.getProfile(token);
        setStudentData(res.user);
      } catch {
        setError('Failed to load user info. Please login again.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token, navigate]);

  const handleInputChange = (field, value) => {
    setStudentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsEditing(false);
    setSuccessMsg('');
    setError('');
    try {
      const updatedData = { ...studentData, cgpa: studentData.cgpa !== undefined ? Number(studentData.cgpa) : undefined };
      await apiService.updateProfile(updatedData);
      setSuccessMsg('Profile updated successfully!');
    } catch {
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  if (loading) return <div className="student-info-container"><p>Loading...</p></div>;
  if (error) return <div className="student-info-container"><p className="error-message">{error}</p></div>;
  if (!studentData) return null;

  return (
    <div className="student-info-container fade-slide-in">
      {successMsg && <div className="success-message fade-in">{successMsg}</div>}
      {error && <div className="error-message fade-in">{error}</div>}
      <div className="student-info-header fade-slide-in">
        <div className="student-info-header-left">
          <Link to="/" className="back-btn">
            ← Back to Dashboard
          </Link>
          <h1>Student Profile</h1>
        </div>
        <div className="student-info-actions">
          {!isEditing ? (
            <button 
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
          <button onClick={() => logout()} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="student-profile-grid fade-slide-in">
        {/* Profile Picture Section */}
        <div className="profile-picture-section fade-slide-in">
          <div className="profile-picture">
            <div className="profile-avatar avatar-fade-in" style={{ position: 'relative' }}>
              {uploadingPhoto && (
                <div className="avatar-upload-spinner">
                  <span className="spinner"></span>
                </div>
              )}
              {photoPreview ? (
                <img src={photoPreview} alt="Profile Preview" className="profile-avatar-img avatar-fade-in" />
              ) : (
                <span className="avatar-text avatar-fade-in">{studentData.name.split(' ').map(n => n[0]).join('')}</span>
              )}
            </div>
            {photoError && <div className="error-message fade-in">{photoError}</div>}
            {isEditing && (
              <>
                <button className="change-photo-btn" onClick={() => fileInputRef.current.click()} disabled={uploadingPhoto}>Change Photo</button>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={async e => {
                    const file = e.target.files[0];
                    if (file) {
                      setPhotoError("");
                      setPhotoPreview(URL.createObjectURL(file));
                      setUploadingPhoto(true);
                      try {
                        const res = await apiService.authAPI.uploadProfilePhoto(file, token);
                        setPhotoPreview(res.photo_url);
                        setStudentData(prev => ({ ...prev, photo: res.photo_url }));
                      } catch (err) {
                        setPhotoError(err.message || "Failed to upload photo");
                      } finally {
                        setUploadingPhoto(false);
                      }
                    }
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="info-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={studentData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span>{studentData.name}</span>
              )}
            </div>

            <div className="info-item">
              <label>Roll Number</label>
              <span>{studentData.rollNumber}</span>
            </div>

            <div className="info-item">
              <label>Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  value={studentData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span>{new Date(studentData.dateOfBirth).toLocaleDateString()}</span>
              )}
            </div>

            <div className="info-item">
              <label>Gender</label>
              {isEditing ? (
                <select
                  value={studentData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="edit-input"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <span>{studentData.gender}</span>
              )}
            </div>

            <div className="info-item">
              <label>Blood Group</label>
              {isEditing ? (
                <input
                  type="text"
                  value={studentData.bloodGroup}
                  onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span>{studentData.bloodGroup}</span>
              )}
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="info-section">
          <h2>Academic Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Department</label>
              <span>{studentData.department}</span>
            </div>

            <div className="info-item">
              <label>Year</label>
              <span>{studentData.year}</span>
            </div>

            <div className="info-item">
              <label>Semester</label>
              <span>{studentData.semester}</span>
            </div>

            <div className="info-item">
              <label>CGPA</label>
              {isEditing ? (
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={studentData.cgpa}
                  onChange={(e) => handleInputChange('cgpa', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span>{studentData.cgpa}</span>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="info-section">
          <h2>Contact Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={studentData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span>{studentData.email}</span>
              )}
            </div>

            <div className="info-item">
              <label>Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={studentData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span>{studentData.phone}</span>
              )}
            </div>

            <div className="info-item full-width">
              <label>Address</label>
              {isEditing ? (
                <textarea
                  value={studentData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="edit-input"
                  rows="3"
                />
              ) : (
                <span>{studentData.address}</span>
              )}
            </div>

            <div className="info-item full-width">
              <label>Emergency Contact</label>
              {isEditing ? (
                <input
                  type="text"
                  value={studentData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span>{studentData.emergencyContact}</span>
              )}
            </div>
          </div>
        </div>

        {/* Skills & Interests */}
        <div className="info-section">
          <h2>Skills & Interests</h2>
          <div className="info-grid">
            <div className="info-item full-width">
              <label>Technical Skills</label>
              {isEditing ? (
                <textarea
                  value={studentData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  className="edit-input"
                  rows="3"
                  placeholder="Enter your technical skills..."
                />
              ) : (
                <span>{studentData.skills}</span>
              )}
            </div>

            <div className="info-item full-width">
              <label>Hobbies & Interests</label>
              {isEditing ? (
                <textarea
                  value={studentData.hobbies}
                  onChange={(e) => handleInputChange('hobbies', e.target.value)}
                  className="edit-input"
                  rows="2"
                  placeholder="Enter your hobbies and interests..."
                />
              ) : (
                <span>{studentData.hobbies}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfo; 