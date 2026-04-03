# CAT Prep Hub - Render Deployment Guide

## Prerequisites
1. **GitHub account** - Push your code to GitHub
2. **Render account** - Sign up at https://render.com
3. **Groq API Key** - Your GROQ_API_KEY from earlier

## Step 1: Push Code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - CAT Prep Hub"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cat-prep-hub.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username and `cat-prep-hub` with your repo name.

---

## Step 2: Deploy on Render

### Option A: Using render.yaml (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Blueprint"**
3. **Connect GitHub Repository**:
   - Select your `cat-prep-hub` repository
   - Click "Connect"
4. **Choose Branch**: Select `main`
5. **Review Services** (from render.yaml):
   - ✅ cat-prep-frontend (React)
   - ✅ cat-prep-backend (Node.js)
   - ✅ cat-prep-ai (Python)
6. **Add Environment Variables**:
   - In the `cat-prep-ai` service, add:
     - **Key**: `GROQ_API_KEY`
     - **Value**: (your actual Groq API key here)
7. **Click "Deploy"**

### Option B: Manual Setup (if render.yaml doesn't work)

### Service 1: Frontend

1. **Go to Render**: https://dashboard.render.com
2. **Click "New Web Service"**
3. **Configuration**:
   - **Name**: `cat-prep-frontend`
   - **Runtime**: Node.js
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm run build && npx serve -s build -l 3000`
   - **Plan**: Free
4. **Environment Variables**:
   ```
   REACT_APP_API_URL = https://cat-prep-backend.onrender.com/api
   ```
5. **Deploy**

#### Service 2: Backend

1. **Click "New Web Service"**
2. **Configuration**:
   - **Name**: `cat-prep-backend`
   - **Runtime**: Node.js
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Plan**: Free
3. **Environment Variables**:
   ```
   PORT = 4000
   AI_SERVICE_URL = https://cat-prep-ai.onrender.com
   FRONTEND_URL = https://cat-prep-frontend.onrender.com
   NODE_ENV = production
   ```
4. **Deploy**

#### Service 3: AI Service

1. **Click "New Web Service"**
2. **Configuration**:
   - **Name**: `cat-prep-ai`
   - **Runtime**: Python 3.11
   - **Build Command**: `pip install -r ai-service/requirements.txt`
   - **Start Command**: `cd ai-service && python -m uvicorn main:app --host 0.0.0.0 --port 8000`
   - **Plan**: Free
3. **Environment Variables**:
   ```
   GROQ_API_KEY = (your Groq API key here)
   ```
4. **Deploy**

---

## Step 3: Update URLs After Deployment

After all services are deployed, you'll have three URLs:
- Frontend: `https://cat-prep-frontend.onrender.com`
- Backend: `https://cat-prep-backend.onrender.com`
- AI Service: `https://cat-prep-ai.onrender.com`

### Update render.yaml with actual URLs:

```yaml
envVars:
  - key: REACT_APP_API_URL
    value: https://cat-prep-backend.onrender.com/api
```

Then redeploy the frontend.

---

## Step 4: Verify Deployment

Test each service:

```bash
# Frontend
https://cat-prep-frontend.onrender.com

# Backend Health
https://cat-prep-backend.onrender.com/api/health

# AI Service Health
https://cat-prep-ai.onrender.com/health
```

---

## Troubleshooting

### Issue: Services can't communicate
- Check that environment variables point to correct Render URLs
- Ensure all services are deployed (not building)
- Check logs in Render dashboard

### Issue: Frontend shows 404
- Clear browser cache
- Rebuild frontend with correct API URL
- Check `REACT_APP_API_URL` environment variable

### Issue: AI Service times out
- Groq API may be overloaded (free tier)
- Consider upgrading Groq plan or switching to a different model
- Check Render logs for actual errors

### Issue: Port conflicts
- Render automatically assigns ports, ignore local environment variables
- Backend will use PORT 4000
- Frontend will use port 3000
- AI Service will use PORT 8000

---

## Production Optimization

To improve performance on free tier:

1. **Enable Auto-Suspend** in Render settings (your services will sleep after inactivity)
2. **Use a static frontend** instead of Node.js serve
3. **Optimize database queries** (if adding database later)
4. **Cache responses** in the backend

---

## Next Steps

After deployment:
1. ✅ Test all features
2. ✅ Monitor logs in Render dashboard
3. ✅ Add custom domain (Render documentation)
4. ✅ Set up error tracking (optional)

---

**Need help?** Visit: https://render.com/docs
