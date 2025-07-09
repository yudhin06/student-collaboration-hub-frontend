const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Auth API endpoints
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    // Map access_token to token for compatibility
    if (data.access_token) {
      data.token = data.access_token;
    }
    return data;
  },

  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  updateProfile: async (profileData, token) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    return response.json();
  },

  uploadProfilePhoto: async (file, token) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/auth/upload-photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to upload photo');
    }
    return response.json();
  },
};

// Post API endpoints
export const postAPI = {
  getAllPosts: async (token) => {
    const response = await fetch(`${API_BASE_URL}/blog/posts`, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    return response.json();
  },

  getPost: async (postId, token) => {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${postId}`, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    return response.json();
  },

  getPostsByCategory: async (category, token) => {
    const response = await fetch(`${API_BASE_URL}/blog/posts/category/${category}`, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    return response.json();
  },

  likePost: async (postId, userInfo, token) => {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(userInfo),
    });
    return response.json();
  },

  createPost: async (postData, token) => {
    const response = await fetch(`${API_BASE_URL}/blog/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(postData),
    });
    let data;
    try {
      data = await response.json();
    } catch {
      data = { detail: 'Unknown error' };
    }
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to create post');
    }
    return data;
  },

  initializePosts: async (token) => {
    const response = await fetch(`${API_BASE_URL}/blog/initialize`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    return response.json();
  },

  getComments: async (postId, token) => {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${postId}/comments`, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    return response.json();
  },

  addComment: async (postId, comment, token) => {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(comment),
    });
    return response.json();
  },
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
};

const apiService = { authAPI, postAPI, healthCheck };

export default apiService;