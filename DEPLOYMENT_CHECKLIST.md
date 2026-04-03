# Deployment Checklist

## Pre-Deployment
- [ ] All services running locally without errors
- [ ] All environment variables set correctly in `.env` files
- [ ] `.env` files are in `.gitignore` (not committed)
- [ ] Code pushed to GitHub repository
- [ ] Groq API key is valid and has credits

## GitHub Setup
- [ ] Repository created on GitHub
- [ ] Code committed and pushed to `main` branch
- [ ] `.env` files not included in git
- [ ] `render.yaml` file is in root directory

## Render Deployment
- [ ] Render account created at https://render.com
- [ ] GitHub repository connected to Render
- [ ] render.yaml blueprint loaded
- [ ] All three services configured:
  - [ ] cat-prep-frontend
  - [ ] cat-prep-backend
  - [ ] cat-prep-ai

## Environment Variables
### cat-prep-ai Service
- [ ] `GROQ_API_KEY` = `gsk_...` (your key)

### cat-prep-backend Service
- [ ] `AI_SERVICE_URL` = `https://cat-prep-ai.onrender.com`
- [ ] `FRONTEND_URL` = `https://cat-prep-frontend.onrender.com`
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `4000`

### cat-prep-frontend Service
- [ ] `REACT_APP_API_URL` = `https://cat-prep-backend.onrender.com/api`

## Post-Deployment
- [ ] All three services showing "Live" status
- [ ] No build errors in logs
- [ ] Frontend loads at `https://cat-prep-frontend.onrender.com`
- [ ] Backend health check passes: `https://cat-prep-backend.onrender.com/api/health`
- [ ] AI service health check passes: `https://cat-prep-ai.onrender.com/health`
- [ ] Tested a feature end-to-end (e.g., generate roadmap)

## Quick Links
| Service | URL |
|---------|-----|
| Frontend | https://cat-prep-frontend.onrender.com |
| Backend | https://cat-prep-backend.onrender.com |
| AI Service | https://cat-prep-ai.onrender.com |
| Render Dashboard | https://dashboard.render.com |
| Render Docs | https://render.com/docs |

## Troubleshooting Commands

Check backend logs:
```
https://cat-prep-backend.onrender.com/api/health
```

Check AI service logs:
```
https://cat-prep-ai.onrender.com/health
```

View full deployment logs in Render dashboard → Service → Logs

## Notes
- Services on free tier may go to sleep after 15 minutes of inactivity
- First request after sleep may take 10-30 seconds
- Free tier has bandwidth and execution time limits
- Consider upgrading for consistent performance
