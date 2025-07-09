const express = require('express');
const router = express.Router();

// Sample blog posts data
const SAMPLE_POSTS = [
  {
    id: '1',
    type: 'post',
    title: 'How to Get Started with Machine Learning',
    excerpt: 'A comprehensive guide for beginners to dive into the world of AI and ML.',
    author: 'Akhilesh Kumar',
    author_username: 'akhilesh',
    date: new Date('2024-01-15'),
    category: 'AI-ML',
    read_time: '5 min read',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    tags: ['ai', 'ml', 'beginner', 'tutorial'],
    likes: [
      { user_id: 'user1', user_name: 'John Doe' },
      { user_id: 'user2', user_name: 'Jane Smith' }
    ],
    like_count: 12,
    content: 'Machine learning is transforming industries. In this post, we cover the basics, best resources, and tips to start your journey. Whether you\'re a student or a professional, these steps will help you build a strong foundation in machine learning.',
    comments: [
      { user_id: 'user3', user_name: 'Mike Johnson', text: 'Great post! Thanks for sharing.' },
      { user_id: 'user4', user_name: 'Sarah Wilson', text: 'Really helpful for beginners!' }
    ]
  },
  {
    id: '2',
    type: 'post',
    title: 'JavaScript Best Practices for 2024',
    excerpt: 'Learn the latest JavaScript patterns and practices for modern web development.',
    author: 'Priya Sharma',
    author_username: 'priya',
    date: new Date('2024-01-10'),
    category: 'Programming',
    read_time: '8 min read',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    tags: ['javascript', 'web-development', 'best-practices'],
    likes: [
      { user_id: 'user1', user_name: 'John Doe' }
    ],
    like_count: 8,
    content: 'JavaScript has evolved significantly over the years. This post covers the latest best practices, ES6+ features, and modern patterns that every developer should know.',
    comments: [
      { user_id: 'user5', user_name: 'Alex Chen', text: 'Very informative article!' }
    ]
  },
  {
    id: '3',
    type: 'post',
    title: '5G Technology: What You Need to Know',
    excerpt: 'Understanding the impact of 5G on telecommunications and daily life.',
    author: 'Rahul Verma',
    author_username: 'rahul',
    date: new Date('2024-01-08'),
    category: 'Telecommunications',
    read_time: '6 min read',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    tags: ['5g', 'telecommunications', 'technology'],
    likes: [],
    like_count: 15,
    content: '5G technology is revolutionizing how we connect and communicate. This post explores the key features, benefits, and future implications of 5G networks.',
    comments: []
  },
  {
    id: '4',
    type: 'post',
    title: 'Effective Study Techniques for College Students',
    excerpt: 'Proven methods to improve your study habits and academic performance.',
    author: 'Ananya Singh',
    author_username: 'ananya',
    date: new Date('2024-01-05'),
    category: 'Study Tips',
    read_time: '4 min read',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80',
    tags: ['study-tips', 'academic', 'productivity'],
    likes: [
      { user_id: 'user2', user_name: 'Jane Smith' },
      { user_id: 'user6', user_name: 'David Brown' }
    ],
    like_count: 23,
    content: 'Success in college requires more than just attending classes. This post shares effective study techniques that can help you excel in your academic journey.',
    comments: [
      { user_id: 'user7', user_name: 'Emma Davis', text: 'These tips really helped me improve my grades!' }
    ]
  },
  {
    id: '5',
    type: 'post',
    title: 'Career Opportunities in Data Science',
    excerpt: 'Explore the growing field of data science and career paths available.',
    author: 'Sneha Patel',
    author_username: 'sneha',
    date: new Date('2024-01-03'),
    category: 'Career',
    read_time: '7 min read',
    image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80',
    tags: ['data-science', 'career', 'job-market'],
    likes: [
      { user_id: 'user1', user_name: 'John Doe' },
      { user_id: 'user3', user_name: 'Mike Johnson' },
      { user_id: 'user8', user_name: 'Lisa Wang' }
    ],
    like_count: 31,
    content: 'Data science is one of the fastest-growing fields in technology. This post explores various career opportunities, required skills, and how to get started in this exciting field.',
    comments: [
      { user_id: 'user9', user_name: 'Tom Anderson', text: 'Great overview of the field!' },
      { user_id: 'user10', user_name: 'Maria Garcia', text: 'What programming languages should I learn first?' }
    ]
  }
];

// Get all posts
router.get('/posts', (req, res) => {
  try {
    res.json(SAMPLE_POSTS);
  } catch (error) {
    res.status(500).json({ detail: 'Error fetching posts' });
  }
});

// Get post by ID
router.get('/posts/:id', (req, res) => {
  try {
    const post = SAMPLE_POSTS.find(p => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ detail: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ detail: 'Error fetching post' });
  }
});

// Get posts by category
router.get('/posts/category/:category', (req, res) => {
  try {
    const category = req.params.category;
    const filteredPosts = SAMPLE_POSTS.filter(post => 
      post.category.toLowerCase() === category.toLowerCase()
    );
    res.json(filteredPosts);
  } catch (error) {
    res.status(500).json({ detail: 'Error fetching posts by category' });
  }
});

// Like/unlike a post
router.post('/posts/:id/like', (req, res) => {
  try {
    const { user_id, user_name } = req.body;
    const post = SAMPLE_POSTS.find(p => p.id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ detail: 'Post not found' });
    }

    const existingLike = post.likes.find(like => like.user_id === user_id);
    let liked = false;

    if (existingLike) {
      // Unlike
      post.likes = post.likes.filter(like => like.user_id !== user_id);
      post.like_count = post.likes.length;
    } else {
      // Like
      post.likes.push({ user_id, user_name });
      post.like_count = post.likes.length;
      liked = true;
    }

    res.json({ liked, like_count: post.like_count });
  } catch (error) {
    res.status(500).json({ detail: 'Error processing like' });
  }
});

// Create a new post
router.post('/posts', (req, res) => {
  try {
    const { title, excerpt, content, category, tags } = req.body;
    
    const newPost = {
      id: Date.now().toString(),
      type: 'post',
      title,
      excerpt,
      author: 'Current User', // This should come from auth
      author_username: 'currentuser',
      date: new Date(),
      category,
      read_time: '3 min read',
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
      tags: tags || [],
      likes: [],
      like_count: 0,
      content,
      comments: []
    };

    SAMPLE_POSTS.unshift(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ detail: 'Error creating post' });
  }
});

// Get comments for a post
router.get('/posts/:id/comments', (req, res) => {
  try {
    const post = SAMPLE_POSTS.find(p => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ detail: 'Post not found' });
    }
    res.json(post.comments || []);
  } catch (error) {
    res.status(500).json({ detail: 'Error fetching comments' });
  }
});

// Add comment to a post
router.post('/posts/:id/comments', (req, res) => {
  try {
    const { user_id, user_name, text } = req.body;
    const post = SAMPLE_POSTS.find(p => p.id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ detail: 'Post not found' });
    }

    const newComment = {
      user_id,
      user_name,
      text,
      created_at: new Date()
    };

    if (!post.comments) {
      post.comments = [];
    }
    post.comments.push(newComment);

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ detail: 'Error adding comment' });
  }
});

// Initialize posts (for demo purposes)
router.post('/initialize', (req, res) => {
  try {
    // Posts are already initialized in the array
    res.json({ message: 'Posts initialized successfully', count: SAMPLE_POSTS.length });
  } catch (error) {
    res.status(500).json({ detail: 'Error initializing posts' });
  }
});

module.exports = router; 