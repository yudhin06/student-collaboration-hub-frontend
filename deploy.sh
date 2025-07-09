#!/bin/bash

echo "🚀 Student Collaboration Hub - Render Deployment Helper"
echo "======================================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check if changes are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for deployment'"
    echo "   git push"
    exit 1
fi

echo "✅ Git repository is ready"
echo ""

echo "📋 Deployment Checklist:"
echo "1. ✅ Backend render.yaml configured"
echo "2. ✅ Frontend render.yaml configured"
echo "3. ✅ CORS settings updated"
echo "4. ✅ Environment variables template ready"
echo ""

echo "🌐 Next Steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Create a new Web Service for backend"
echo "3. Create a new Static Site for frontend"
echo "4. Set up MongoDB Atlas database"
echo "5. Configure environment variables"
echo ""

echo "🔧 Required Environment Variables:"
echo ""
echo "Backend (Web Service):"
echo "  MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/student_collaboration_hub"
echo "  JWT_SECRET=your_super_secret_jwt_key_here"
echo "  NODE_ENV=production"
echo "  PORT=10000"
echo ""
echo "Frontend (Static Site):"
echo "  VITE_API_URL=https://student-collaboration-hub-backend.onrender.com/api"
echo ""

echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""

echo "🎯 Quick Test Commands (after deployment):"
echo "  curl https://student-collaboration-hub-backend.onrender.com/api/health"
echo "  curl https://student-collaboration-hub-backend.onrender.com/api/blog/posts"
echo ""

echo "🚀 Your app will be live at:"
echo "  Frontend: https://student-collaboration-hub-frontend.onrender.com"
echo "  Backend:  https://student-collaboration-hub-backend.onrender.com"
echo ""

echo "Good luck with your deployment! 🎉" 