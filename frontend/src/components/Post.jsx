import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postAPI } from '../services/api';
import { useAuth } from '../AuthContext.jsx';
import CreatePost from './CreatePost.jsx';

// Universal safe JSON parse helper
function safeJSONParse(str, fallback = null) {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch {
    return fallback;
  }
}

const PDF_MAP = {
  'AI-ML': [
    'https://arxiv.org/pdf/1706.03762.pdf', // Attention is All You Need
    'https://cs229.stanford.edu/notes2022fall/cs229-notes1.pdf',
    'https://www.cs.toronto.edu/~vmnih/docs/dqn.pdf'
  ],
  'Programming': [
    'https://www.cs.cmu.edu/~15121/Handouts/loops.pdf',
    'https://www.cs.cmu.edu/~15121/Handouts/arrays.pdf',
    'https://www.cs.cmu.edu/~15121/Handouts/recursion.pdf'
  ],
  'Telecommunications': [
    'https://www.ece.rutgers.edu/~marsic/books/CN/book-CN_marsic.pdf',
    'https://www.ece.rutgers.edu/~marsic/books/SE/book-SE_marsic.pdf'
  ],
  'Study Tips': [
    'https://www.cmu.edu/teaching/solveproblem/strat-studytips.pdf',
    'https://www.ox.ac.uk/sites/files/oxford/field/field_document/Study_Tips.pdf'
  ],
  'Career': [
    'https://www.cs.cmu.edu/~career/JobSearchGuide.pdf',
    'https://www.ox.ac.uk/sites/files/oxford/field/field_document/Careers_Guide.pdf'
  ],
  'Notes': [
    'https://www.cs.cmu.edu/~15121/Handouts/arrays.pdf',
    'https://cs229.stanford.edu/notes2022fall/cs229-notes1.pdf'
  ]
};

const Post = ({ darkMode, setDarkMode }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalPost, setModalPost] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { user, token, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const gridRef = useRef();
  const [modalComments, setModalComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    if (!token) {
      navigate('/signin');
      return;
    }
    initializePost();
  }, [token, authLoading]);

  useEffect(() => {
    if (!hasAnimated && postList.length > 0) {
      setTimeout(() => {
        if (gridRef.current) {
          gridRef.current.classList.add('blog-grid-animate');
        }
        setHasAnimated(true);
      }, 100);
    }
  }, [postList, hasAnimated]);

  useEffect(() => {
    if (showModal && modalPost) {
      fetchComments(modalPost.id);
    }
  }, [showModal, modalPost]);

  const initializePost = async () => {
    try {
      setLoading(true);
      await postAPI.initializePosts(token);
      const posts = await postAPI.getAllPosts(token);
      setPostList(posts);
    } catch (err) {
      console.error('Error initializing post:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      if (!user) return;
      const userInfo = { user_id: user._id, user_name: user.name };
      const result = await postAPI.likePost(postId, userInfo);
      if (result.liked) {
        setPostList(prevPosts =>
          prevPosts.map(post =>
            post.id === postId
              ? {
                  ...post,
                  likes: [...post.likes, { user_id: userInfo.user_id, user_name: userInfo.user_name }],
                  like_count: post.like_count + 1
                }
              : post
          )
        );
      } else {
        setPostList(prevPosts =>
          prevPosts.map(post =>
            post.id === postId
              ? {
                  ...post,
                  likes: post.likes.filter(like => like.user_id !== userInfo.user_id),
                  like_count: post.like_count - 1
                }
              : post
          )
        );
      }
    } catch (err) {
      console.error('Error liking post:', err);
      alert('Failed to like/unlike post');
    }
  };

  const isPostLikedByUser = (post) => {
    if (!user) return false;
    return post.likes.some(like => like.user_id === user._id);
  };

  const categories = [
    { id: 'all', name: 'All Posts', count: postList.length },
    { id: 'AI-ML', name: 'AI & ML', count: postList.filter(post => post.category === 'AI-ML').length },
    { id: 'Programming', name: 'Programming', count: postList.filter(post => post.category === 'Programming').length },
    { id: 'Telecommunications', name: 'Telecommunications', count: postList.filter(post => post.category === 'Telecommunications').length },
    { id: 'Study Tips', name: 'Study Tips', count: postList.filter(post => post.category === 'Study Tips').length },
    { id: 'Career', name: 'Career', count: postList.filter(post => post.category === 'Career').length }
  ];

  // Remove this sorting logic so posts are shown in backend order
  const filteredPosts = postList.filter(post => {
    if (activeCategory !== 'all' && post.category !== activeCategory) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    // Keyword search logic
    if (term.startsWith('title:')) {
      const t = term.replace('title:', '').trim();
      return post.title && post.title.toLowerCase().includes(t);
    } else if (term.startsWith('tag:')) {
      const t = term.replace('tag:', '').trim();
      return post.tags && post.tags.some(tag => tag.toLowerCase().includes(t));
    } else if (term.startsWith('user:')) {
      const t = term.replace('user:', '').trim();
      return post.author && post.author.toLowerCase().includes(t);
    }
    // Default: search all fields
    return (
      (post.title && post.title.toLowerCase().includes(term)) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(term))) ||
      (post.author && post.author.toLowerCase().includes(term))
    );
  });

  const fetchComments = async (postId) => {
    try {
      setCommentLoading(true);
      const comments = await postAPI.getComments(postId, token);
      if (comments && comments.length > 0) {
        setModalComments(comments);
      } else {
        // Generate mock comments using authors from postList
        const authors = postList.map(p => ({ user_id: p.author_id || p.id, user_name: p.author })).filter(a => a.user_name);
        const uniqueAuthors = Array.from(new Set(authors.map(a => a.user_name))).map(name => authors.find(a => a.user_name === name));
        // Pick up to 3 random authors for mock comments
        const shuffled = uniqueAuthors.sort(() => 0.5 - Math.random());
        const mockTexts = [
          "Great post! Thanks for sharing.",
          "Really insightful, I learned something new.",
          "Can you elaborate more on this topic?",
          "This is super helpful!",
          "I totally agree with your points.",
          "Looking forward to more posts like this."
        ];
        const mockComments = shuffled.slice(0, 3).map((a, i) => ({
          user_id: a.user_id,
          user_name: a.user_name,
          text: mockTexts[i % mockTexts.length]
        }));
        setModalComments(mockComments);
      }
    } catch (err) {
      setModalComments([]);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) return;
    setCommentLoading(true);
    try {
      const commentObj = {
        user_id: user._id,
        user_name: user.name,
        text: newComment.trim(),
      };
      await postAPI.addComment(modalPost.id, commentObj, token);
      setNewComment('');
      fetchComments(modalPost.id);
    } catch (err) {
      // Optionally show error
    } finally {
      setCommentLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div className="page-header-top">
            <Link to="/" className="back-btn">← Back to Dashboard</Link>
            <Link to="/signin" className="logout-btn">Logout</Link>
          </div>
          <h1>Posts</h1>
        </div>
        <div className="page-content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Please log in to view posts.</div>;
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div className="page-header-top">
            <Link to="/" className="back-btn">← Back to Dashboard</Link>
            <Link to="/signin" className="logout-btn">Logout</Link>
          </div>
          <h1>Posts</h1>
        </div>
        <div className="page-content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading post posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div className="page-header-top">
            <Link to="/" className="back-btn">← Back to Dashboard</Link>
            <Link to="/signin" className="logout-btn">Logout</Link>
          </div>
          <h1>Posts</h1>
        </div>
        <div className="page-content">
          <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
            <p>{error}</p>
            <button onClick={initializePost}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  // Handle post creation
  const handleCreatePost = async (postData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await postAPI.createPost(postData);
      if (result && result.id) {
        setShowCreate(false);
        await initializePost(); // Refresh posts
      } else {
        setError(result?.detail || 'Failed to create post post.');
      }
    } catch (err) {
      setError(err.message || 'Failed to create post post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`page-container${darkMode ? ' dark' : ''}`}>
      <div className="page-header">
        <div className="page-header-top">
          <Link to="/" className="back-btn">← Back to Dashboard</Link>
          <Link to="/signin" className="logout-btn">Logout</Link>
          <button className="dark-mode-toggle" onClick={() => setDarkMode(dm => !dm)}>
            {darkMode ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
        <h1>Posts</h1>
        <button className="create-post-btn" onClick={() => setShowCreate(true)}>
          + Create New Post
        </button>
        <p>Discover insights, tutorials, and stories from our community</p>
      </div>

      <div className="page-content">
        {/* Search Bar */}
        <div className="post-search-bar" style={{marginBottom:'1rem',textAlign:'center'}}>
          <input
            type="text"
            placeholder="Search by title, tag, or username... (e.g. title:math, tag:ai, user:john)"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
            style={{padding:'0.5rem 1rem',borderRadius:'8px',border:'1px solid #ccc',width:'80%',maxWidth:'400px'}}
          />
        </div>
        {/* Category Filter */}
        <div className="post-categories">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name.replace('Post', 'Post').replace('post', 'post')} ({category.count})
            </button>
          ))}
        </div>

        {/* Post Posts Grid (Twitter-X-like) */}
        <div ref={gridRef} className={`post-grid twitter-x-grid${!hasAnimated ? '' : ' post-grid-static'}`}>
          {filteredPosts.length === 0 ? (
            // Show a sample post card if no posts exist
            <article className="post-card twitter-x-card post-card-fade-in" style={{animationDelay: '0ms'}}>
              <div className="twitter-x-header">
                <div className="twitter-x-avatar">
                  <span className="twitter-x-avatar-placeholder">A</span>
                </div>
                <div className="twitter-x-user-meta">
                  <span className="twitter-x-author-name">Akhilesh Kumar</span>
                  <span className="twitter-x-username">@akhilesh</span>
                  <span className="twitter-x-date">· {new Date().toLocaleDateString()}</span>
                </div>
                <span className="twitter-x-category-label">#AI-ML</span>
              </div>
              <hr className="twitter-x-divider" />
              <div className="twitter-x-content">
                <div className="twitter-x-text">
                  <h3 className="twitter-x-title">How to Get Started with Machine Learning</h3>
                  <p className="twitter-x-excerpt">A quick guide for beginners to dive into the world of AI and ML.</p>
                  <p className="twitter-x-content-preview">Machine learning is transforming industries. In this post, we cover the basics, best resources, and tips to start your journey. Whether you're a student or a professional, these steps will help you build a strong foundation...</p>
                </div>
                <div className="twitter-x-tags">
                  <span className="twitter-x-tag">#ai</span>
                  <span className="twitter-x-tag">#ml</span>
                  <span className="twitter-x-tag">#beginner</span>
                </div>
              </div>
              <hr className="twitter-x-divider" />
              <div className="twitter-x-footer">
                <button className="twitter-x-like-btn">
                  <span className="twitter-x-like-icon">🤍</span>
                  <span className="twitter-x-like-count">12</span>
                </button>
                <span className="twitter-x-views">👁️ 120</span>
                <span className="twitter-x-comments" style={{cursor: 'pointer'}}>💬 3 Comments</span>
                <button className="twitter-x-readmore-btn">Read More</button>
              </div>
            </article>
          ) : filteredPosts.map((post, idx) => (
            post.type === 'job' ? (
              <article key={post.id} className={`post-card twitter-x-card job-card${!hasAnimated ? ' post-card-fade-in' : ''}`} style={!hasAnimated ? {animationDelay: `${idx * 80}ms`} : {}}>
                <div className="twitter-x-header">
                  <div className="twitter-x-avatar">
                    {post.author_avatar ? (
                      <img src={post.author_avatar} alt="avatar" className="twitter-x-avatar-img" />
                    ) : (
                      <span className="twitter-x-avatar-placeholder">{post.author?.[0]?.toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <div className="twitter-x-user-meta">
                    <span className="twitter-x-author-name">{post.author}</span>
                    <span className="twitter-x-username">@{post.author_username || (post.author?.toLowerCase().replace(/\s/g, '') || 'user')}</span>
                    <span className="twitter-x-date">· {new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <span className="twitter-x-category-label">💼 Job</span>
                </div>
                <hr className="twitter-x-divider" />
                <div className="twitter-x-content">
                  <div className="twitter-x-text">
                    <h3 className="twitter-x-title">{post.title || 'Job Opening'}</h3>
                    {post.job_link && (
                      <a href={post.job_link} target="_blank" rel="noopener noreferrer" className="twitter-x-job-link" style={{fontWeight:'bold',color:'#2b7cff',display:'block',margin:'0.5em 0'}}>View Job Opening ↗</a>
                    )}
                    {post.referral_info && (
                      <div className="twitter-x-referral-info" style={{margin:'0.5em 0',color:'#555'}}>
                        <span style={{fontWeight:'bold'}}>Referral Info:</span> {post.referral_info}
                      </div>
                    )}
                    {post.content && <p className="twitter-x-content-preview">{post.content}</p>}
                  </div>
                  <div className="twitter-x-tags">
                    {(post.tags || []).map(tag => (
                      <span key={tag} className="twitter-x-tag">#{tag}</span>
                    ))}
                  </div>
                </div>
                <hr className="twitter-x-divider" />
                <div className="twitter-x-footer">
                  <button 
                    className={`twitter-x-like-btn ${isPostLikedByUser(post) ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <span className="twitter-x-like-icon">{isPostLikedByUser(post) ? '❤️' : '🤍'}</span>
                    <span className="twitter-x-like-count">{post.like_count}</span>
                  </button>
                  <span className="twitter-x-views">👁️ {post.views !== undefined ? post.views : 0}</span>
                  <span 
                    className="twitter-x-comments"
                    style={{cursor: 'pointer'}}
                    onClick={() => {
                      setModalPost(post); 
                      setShowModal(true);
                      setTimeout(() => {
                        const el = document.querySelector('.quick-view-comments');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 300);
                    }}
                  >
                    💬 {post.comments ? post.comments.length : 0} Comments
                  </span>
                </div>
              </article>
            ) : (
              <article key={post.id} className={`post-card twitter-x-card${!hasAnimated ? ' post-card-fade-in' : ''}`} style={!hasAnimated ? {animationDelay: `${idx * 80}ms`} : {}}>
                <div className="twitter-x-header">
                  <div className="twitter-x-avatar">
                    {/* Show user avatar if available, else placeholder */}
                    {post.author_avatar ? (
                      <img src={post.author_avatar} alt="avatar" className="twitter-x-avatar-img" />
                    ) : (
                      <span className="twitter-x-avatar-placeholder">{post.author?.[0]?.toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <div className="twitter-x-user-meta">
                    <span className="twitter-x-author-name">{post.author}</span>
                    <span className="twitter-x-username">@{post.author_username || (post.author?.toLowerCase().replace(/\s/g, '') || 'user')}</span>
                    <span className="twitter-x-date">· {new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <span className="twitter-x-category-label">{post.category ? `#${post.category}` : ''}</span>
                </div>
                <hr className="twitter-x-divider" />
                <div className="twitter-x-content">
                  <div className="twitter-x-text">
                    <h3 className="twitter-x-title">{post.title || 'Sample Post: Getting Started with AI'}</h3>
                    <p className="twitter-x-excerpt">{post.excerpt || 'A quick guide for beginners to dive into the world of AI and ML.'}</p>
                    <p className="twitter-x-content-preview">{(post.content && post.content.length > 0 ? post.content.slice(0, 180) : 'Machine learning is transforming industries. In this post, we cover the basics, best resources, and tips to start your journey. Whether you\'re a student or a professional, these steps will help you build a strong foundation...')}{post.content && post.content.length > 180 ? '...' : ''}</p>
                    {/* Document link */}
                    <a
                      href={post.document_url || 'https://arxiv.org/pdf/1706.03762.pdf'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="twitter-x-download"
                      style={{ display: 'inline-block', marginTop: '0.4em' }}
                    >📄 View Document</a>
                    {post.type === 'note' && (
                      <a
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          const cat = post.category || 'Notes';
                          const pdfs = PDF_MAP[cat] || PDF_MAP['Notes'];
                          const pdf = pdfs[Math.floor(Math.random() * pdfs.length)];
                          const link = document.createElement('a');
                          link.href = pdf;
                          link.download = pdf.split('/').pop();
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="twitter-x-download"
                      >📄 Download Note</a>
                    )}
                    {post.type === 'thread' && post.comments && (
                      <span className="twitter-x-thread-info">💬 {post.comments.length} Comments</span>
                    )}
                  </div>
                  <div className="twitter-x-tags">
                    {(post.tags || []).map(tag => (
                      <span key={tag} className="twitter-x-tag">#{tag}</span>
                    ))}
                  </div>
                </div>
                <hr className="twitter-x-divider" />
                <div className="twitter-x-footer">
                  <button 
                    className={`twitter-x-like-btn ${isPostLikedByUser(post) ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <span className="twitter-x-like-icon">{isPostLikedByUser(post) ? '❤️' : '🤍'}</span>
                    <span className="twitter-x-like-count">{post.like_count}</span>
                  </button>
                  <span className="twitter-x-views">👁️ {post.views !== undefined ? post.views : 0}</span>
                  <span 
                    className="twitter-x-comments"
                    style={{cursor: 'pointer'}}
                    onClick={() => {
                      setModalPost(post); 
                      setShowModal(true);
                      setTimeout(() => {
                        const el = document.querySelector('.quick-view-comments');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 300);
                    }}
                  >
                    💬 {post.comments ? post.comments.length : 0} Comments
                  </span>
                  <button className="twitter-x-readmore-btn" onClick={() => { setModalPost(post); setShowModal(true); }}>Read More</button>
                </div>
              </article>
            )
          ))}
        </div>
      </div>
      {/* Create Post Modal */}
      {showCreate && (
        <div className="modal-backdrop">
          <CreatePost 
            onSubmit={handleCreatePost} 
            onCancel={() => setShowCreate(false)} 
            label="Post"
          />
        </div>
      )}
      {/* Quick View Modal */}
      {showModal && modalPost && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="quick-view-modal" onClick={e => e.stopPropagation()}>
            <div className="quick-view-modal-header">
              <div className="quick-view-avatar">
                {modalPost.author_avatar ? (
                  <img src={modalPost.author_avatar} alt="avatar" className="twitter-x-avatar-img" />
                ) : (
                  <span className="twitter-x-avatar-placeholder">{modalPost.author?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <div className="quick-view-meta-main">
                <span className="quick-view-author">{modalPost.author}</span>
                <span className="quick-view-username">@{modalPost.author_username || (modalPost.author?.toLowerCase().replace(/\s/g, '') || 'user')}</span>
                <span className="quick-view-date">· {new Date(modalPost.date).toLocaleString()}</span>
                <span className="quick-view-category">{modalPost.category ? `#${modalPost.category}` : ''}</span>
              </div>
              <button className="quick-view-share-btn" title="Copy Link" onClick={() => {navigator.clipboard.writeText(window.location.origin + '/posts/' + modalPost.id);}}>
                <span role="img" aria-label="share">🔗</span>
              </button>
            </div>
            <h2 className="quick-view-title">{modalPost.title}</h2>
            <div className="quick-view-tags">
              {(modalPost.tags || []).map(tag => (
                <span key={tag} className="twitter-x-tag">#{tag}</span>
              ))}
            </div>
            {modalPost.image && modalPost.image.startsWith('http') ? (
              <img src={modalPost.image} alt="Post" className="quick-view-img" />
            ) : (
              <span className="post-emoji" style={{fontSize:'3rem',display:'block',textAlign:'center'}}>{modalPost.image || '📝'}</span>
            )}
            <div className="quick-view-content-full">
              {modalPost.content || 'Machine learning is transforming industries. In this post, we cover the basics, best resources, and tips to start your journey. Whether you\'re a student or a professional, these steps will help you build a strong foundation...'}
              <div style={{marginTop:'1em'}}>
                <a
                  href={modalPost.document_url || 'https://arxiv.org/pdf/1706.03762.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="twitter-x-download"
                  style={{fontWeight:'600',fontSize:'1.08rem',display:'inline-block',marginTop:'0.5em'}}
                >📄 View Attached Document</a>
              </div>
            </div>
            <div className="quick-view-meta">
              <span>Likes: {modalPost.like_count || 0}</span> | <span>Comments: {modalPost.comments ? modalPost.comments.length : 0}</span>
            </div>
            <div className="quick-view-comments">
              <h4>Comments</h4>
              <div className="comments-list">
                {commentLoading ? <div>Loading...</div> :
                  ((modalComments || []).length === 0 ? <div>No comments yet.</div> : (modalComments || []).map((c, i) => (
                    <div key={i} className="comment-item"><b>{c.user_name}:</b> {c.text}</div>
                  )))
                }
              </div>
              <form className="add-comment-form" onSubmit={handleAddComment}>
                <input type="text" placeholder="Add a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} disabled={commentLoading} />
                <button type="submit" disabled={commentLoading || !newComment.trim()}>Post</button>
              </form>
            </div>
            <button className="close-modal-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
      {/* Floating + Button */}
      <button className="floating-create-btn" title="Create New Post" onClick={() => setShowCreate(true)}>+</button>
    </div>
  );
};

export default Post; 