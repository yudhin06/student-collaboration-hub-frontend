import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// Placeholder API calls for followers/following (to be implemented with backend)
const mockUser = {
  _id: 'user123',
  name: 'Demo User',
  avatar: '',
  followers: [],
  following: [],
};

const TABS = ['Posts', 'Followers', 'Following'];

const UserProfile = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState('Posts');
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // TODO: Fetch user profile and posts from backend
    setProfile(mockUser);
    setPosts([]); // TODO: fetch posts by userId
    setLoading(false);
  }, [userId]);

  // TODO: Implement follow/unfollow API
  const handleFollow = () => setIsFollowing(true);
  const handleUnfollow = () => setIsFollowing(false);

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (!profile) return <div>User not found.</div>;

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.avatar ? (
            <img src={profile.avatar} alt="avatar" />
          ) : (
            <span className="avatar-placeholder">{profile.name[0]}</span>
          )}
        </div>
        <div className="profile-info">
          <h2>{profile.name}</h2>
          <div className="profile-stats">
            <span>{profile.followers.length} Followers</span>
            <span>{profile.following.length} Following</span>
          </div>
          {user && user._id !== profile._id && (
            isFollowing ? (
              <button className="unfollow-btn" onClick={handleUnfollow}>Unfollow</button>
            ) : (
              <button className="follow-btn" onClick={handleFollow}>Follow</button>
            )
          )}
        </div>
      </div>
      <div className="profile-tabs">
        {TABS.map(t => (
          <button
            key={t}
            className={`profile-tab-btn${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="profile-tab-content profile-tab-animate">
        {tab === 'Posts' && (
          <div className="profile-posts-grid">
            {posts.length === 0 ? (
              <div>No posts yet.</div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="profile-post-card">
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt="Post" className="profile-post-img" />
                  ) : (
                    <span className="profile-post-emoji">{post.image || '📝'}</span>
                  )}
                  <div className="profile-post-title">{post.title}</div>
                </div>
              ))
            )}
          </div>
        )}
        {tab === 'Followers' && (
          <div className="profile-followers-list">
            {profile.followers.length === 0 ? 'No followers yet.' : profile.followers.map(f => <div key={f}>{f}</div>)}
          </div>
        )}
        {tab === 'Following' && (
          <div className="profile-following-list">
            {profile.following.length === 0 ? 'Not following anyone.' : profile.following.map(f => <div key={f}>{f}</div>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 