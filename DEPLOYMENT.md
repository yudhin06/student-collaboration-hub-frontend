# 🚀 Student Collaboration Hub - Render Deployment Guide

## Prerequisites
- Render account (free tier available)
- MongoDB Atlas account (free tier available)
- GitHub repository with your project

## Step 1: Prepare Your Repository

### Backend Configuration
Your backend is already configured with:
- `render.yaml` - Render deployment configuration
- `package.json` - Dependencies and scripts
- `env.example` - Environment variables template

### Frontend Configuration
Your frontend is already configured with:
- `render.yaml` - Render deployment configuration
- `package.json` - Dependencies and build scripts

## Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user with read/write permissions
5. Get your connection string
6. Add your IP address to the whitelist (or use 0.0.0.0/0 for all IPs)

## Step 3: Deploy Backend to Render

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

2. **Configure Backend Service**
   - **Name**: `student-collaboration-hub-backend`
   - **Root Directory**: `backend` (if your backend is in a subfolder)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Set Environment Variables**
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string (e.g., `your-super-secret-jwt-key-here`)
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render will set this automatically)

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://student-collaboration-hub-backend.onrender.com`

## Step 4: Deploy Frontend to Render

1. **Create Static Site**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure Frontend Service**
   - **Name**: `student-collaboration-hub-frontend`
   - **Root Directory**: `frontend` (if your frontend is in a subfolder)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Set Environment Variables**
   - `VITE_API_URL`: `https://student-collaboration-hub-backend.onrender.com/api`

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete
   - Your frontend URL: `https://student-collaboration-hub-frontend.onrender.com`

## Step 5: Test Your Deployment

1. **Test Backend**
   ```bash
   curl https://student-collaboration-hub-backend.onrender.com/api/health
   ```

2. **Test Frontend**
   - Open your frontend URL in a browser
   - Try to sign up/sign in
   - Test all features

## Environment Variables Reference

### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/student_collaboration_hub
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
PORT=10000
```

### Frontend (.env)
```env
VITE_API_URL=https://student-collaboration-hub-backend.onrender.com/api
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify build commands are correct

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

3. **CORS Issues**
   - Verify frontend URL is in backend CORS configuration
   - Check environment variables are set correctly

4. **API Connection Issues**
   - Verify VITE_API_URL is set correctly in frontend
   - Check backend is running and accessible

### Useful Commands

```bash
# Test backend health
curl https://your-backend-url.onrender.com/api/health

# Test API endpoints
curl https://your-backend-url.onrender.com/api/blog/posts

# Check environment variables
echo $MONGO_URI
echo $JWT_SECRET
```

## Live URLs

After deployment, your application will be available at:
- **Frontend**: https://student-collaboration-hub-frontend.onrender.com
- **Backend API**: https://student-collaboration-hub-backend.onrender.com

## Support

If you encounter issues:
1. Check Render deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check MongoDB Atlas connection

Your Student Collaboration Hub will be live and accessible worldwide! 🌍 