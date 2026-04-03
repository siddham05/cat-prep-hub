# CAT Prep Hub 🎯

An AI-powered full-stack study companion for CAT aspirants — built with **React**, **Node.js**, and **Python (FastAPI)**.

---

## Architecture

```
cat-prep-hub/
├── frontend/          # React 18 — UI (port 3000)
├── backend/           # Node.js Express — API gateway (port 4000)
├── ai-service/        # Python FastAPI + Anthropic — AI logic (port 8000)
├── package.json       # Root scripts (concurrently)
└── .env.example
```

### Request Flow
```
Browser (React)  →  Node.js API (4000)  →  Python AI Service (8000)  →  Anthropic Claude
```

The Node.js backend acts as a gateway: it validates requests, applies rate limiting, and proxies to the Python AI service which calls Anthropic's API.

---

## Features

| Feature | Description |
|---|---|
| 🗺️ Smart Roadmap | AI-personalised phase-wise study plan + curated resources |
| 📅 Weekly Planner | Auto-structured 7-day schedule + AI daily task list |
| 🔥 Consistency Tracker | 30-day streak calendar, micro-goals, AI motivation nudges |
| 🎤 PI Prep | Personal Interview practice with AI feedback |
| ❓ Doubt Solver | Instant concept explanations and shortcuts (VARC/DILR/Quant) |

---

## Prerequisites

- **Node.js** v18+
- **Python** 3.10+
- **pip** or **pip3**
- An **Anthropic API key** → https://console.anthropic.com

---

## Setup & Installation

### 1. Clone and enter project

```bash
git clone <your-repo-url>
cd cat-prep-hub
```

### 2. Set up environment variables

```bash
# Copy example env
cp .env.example .env

# Set your Anthropic API key in ai-service/.env
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > ai-service/.env
```

### 3. Install all dependencies

```bash
# Install root + backend + frontend JS deps
npm run install:all

# Install Python deps
pip install -r ai-service/requirements.txt
```

Or install each manually:

```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend
cd frontend && npm install

# Python AI service
cd ai-service && pip install -r requirements.txt
```

---

## Running in Development

### Start all 3 services at once (recommended)

```bash
npm run dev
```

This runs concurrently:
- `AI`  → Python FastAPI on http://localhost:8000
- `API` → Node.js Express on http://localhost:4000
- `WEB` → React dev server on http://localhost:3000

### Or start each service individually

```bash
# Terminal 1 — Python AI service
npm run dev:ai

# Terminal 2 — Node.js backend
npm run dev:api

# Terminal 3 — React frontend
npm run dev:web
```

Open **http://localhost:3000** in your browser.

---

## API Reference

All routes are on the Node.js server (port 4000). The frontend uses React's proxy to `/api`.

### Health
```
GET  /api/health
```

### Roadmap
```
POST /api/roadmap
Body: { background, months_left, daily_hours, weakest_area }
```

### Daily Tasks
```
POST /api/tasks
Body: { daily_hours, phase, background }
```

### Motivation
```
POST /api/motivation
Body: { streak, tasks_done, tasks_total, weak_area }
```

### PI Prep
```
POST /api/pi-prep
Body: { background, target_college, question }
```

### Doubt Solver
```
POST /api/doubt
Body: { section, question }
```

### Resources
```
GET  /api/resources/:weak_area
```

### Progress
```
POST /api/progress
Body: { userId, date, studied, tasksCompleted }

GET  /api/progress/:userId
```

---

## Python AI Service (port 8000)

The FastAPI service also has its own interactive docs:

- Swagger UI → http://localhost:8000/docs
- ReDoc      → http://localhost:8000/redoc

---

## Project Structure (detailed)

```
frontend/src/
├── App.js                  # Router setup
├── index.js                # Entry point
├── services/
│   └── api.js              # Axios API calls → Node backend
├── styles/
│   └── globals.css         # Design system (dark theme, tokens)
├── components/
│   └── Layout.jsx          # Navbar + page wrapper
└── pages/
    ├── HomePage.jsx         # Landing page with feature cards
    ├── RoadmapPage.jsx      # AI roadmap generator
    ├── PlannerPage.jsx      # Weekly planner + task list
    ├── TrackerPage.jsx      # Streak calendar + motivation
    ├── PIPage.jsx           # PI interview prep
    └── DoubtPage.jsx        # Doubt solver

backend/
├── server.js               # Express gateway + rate limiting
└── .env

ai-service/
├── main.py                 # FastAPI routes + Anthropic calls
├── requirements.txt
└── .env
```

---

## Production Build

```bash
# Build React for production
npm run build:web

# The build/ folder can be served statically
# Update backend to serve it or deploy to Vercel/Netlify

# Start production servers
npm run start:ai   # Python
npm run start:api  # Node.js
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Framer Motion, Lucide Icons |
| Backend | Node.js, Express, Axios, express-rate-limit |
| AI Service | Python, FastAPI, Anthropic SDK (claude-opus-4-5) |
| Styling | Custom CSS design system (dark theme) |

---

## Environment Variables

| File | Variable | Description |
|---|---|---|
| `ai-service/.env` | `ANTHROPIC_API_KEY` | Your Anthropic API key (required) |
| `backend/.env` | `PORT` | Node.js port (default: 4000) |
| `backend/.env` | `AI_SERVICE_URL` | Python service URL (default: http://localhost:8000) |
| `backend/.env` | `FRONTEND_URL` | React URL for CORS (default: http://localhost:3000) |

---

## Notes

- Progress data is stored in-memory in the Node.js backend. For production, replace with a database (PostgreSQL/MongoDB).
- The React app uses CRA's `proxy` field to forward `/api` calls to port 4000 in development.
- Rate limiting is set to 30 requests/minute per IP on all `/api/` routes.

---

Built for CAT aspirants. ✨
