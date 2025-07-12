import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { useAuth } from '../hooks/useAuth';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      const response = await apiService.authAPI.login({
        email: formData.email,
        password: formData.password
      });
      if (!response) {
        setErrors({ general: 'No response from server. Please try again later.' });
        setIsLoading(false);
        return;
      }
      if (response.detail) {
        setErrors({ general: response.detail });
        setIsLoading(false);
        return;
      }
      if (!response.token || !response.user) {
        setErrors({ general: 'Login failed. Please check your credentials or try again later.' });
        setIsLoading(false);
        return;
      }
      login(response.token, response.user);
      navigate('/');
    } catch (error) {
      setErrors({
        general: error?.message || 'Network error. Backend may be down or unreachable.'
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-workspace">
      <div className="login-side">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1>Welcome Back</h1>
              <p>Sign in to your Student Collaboration Hub account</p>
            </div>
            
            <form onSubmit={handleSubmit} className="login-form">
              {errors.general && (
                <div className="error-message general-error">
                  {errors.general}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input large-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input large-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
              
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>
              
              <button 
                type="submit" 
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            
            <div className="login-footer">
              <p>Don't have an account? <span className="signup-link" onClick={() => navigate('/signup')}>Sign up</span></p>
            </div>
          </div>
        </div>
      </div>
      <div className="workspace-side">
        <div className="workspace-content">
          <h2>Welcome to the Student Collaboration Hub</h2>
          <p>Connect, collaborate, and grow together.<br/>Your academic journey starts here.</p>
          <div className="workspace-illustration"></div>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 