const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many requests, please slow down.' }
});
app.use('/api/', limiter);

// ─── Request logger ────────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── AI Service proxy helper ───────────────────────────────────────────────────
async function proxyToAI(path, body, res) {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}${path}`, body, {
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const detail = err.response?.data?.detail || err.message;
    console.error(`AI service error [${path}]:`, detail);
    return res.status(status).json({ error: detail });
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/health', async (_req, res) => {
  try {
    const aiRes = await axios.get(`${AI_SERVICE_URL}/health`, { timeout: 5000 });
    res.json({
      status: 'ok',
      backend: 'Node.js Express',
      ai_service: aiRes.data.status,
      timestamp: new Date().toISOString()
    });
  } catch {
    res.json({ status: 'degraded', backend: 'ok', ai_service: 'unreachable' });
  }
});

// Roadmap
app.post('/api/roadmap', async (req, res) => {
  const { background, months_left, daily_hours, weakest_area } = req.body;
  if (!background || !months_left || !daily_hours || !weakest_area) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  return proxyToAI('/ai/roadmap', req.body, res);
});

// Daily Tasks
app.post('/api/tasks', async (req, res) => {
  const { daily_hours, phase } = req.body;
  if (!daily_hours || !phase) {
    return res.status(400).json({ error: 'Missing daily_hours or phase' });
  }
  return proxyToAI('/ai/tasks', req.body, res);
});

// Motivation nudge
app.post('/api/motivation', async (req, res) => {
  const { streak, tasks_done, tasks_total } = req.body;
  if (streak === undefined || tasks_done === undefined || tasks_total === undefined) {
    return res.status(400).json({ error: 'Missing streak/task data' });
  }
  return proxyToAI('/ai/motivation', req.body, res);
});

// PI Prep
app.post('/api/pi-prep', async (req, res) => {
  const { background, question } = req.body;
  if (!background || !question) {
    return res.status(400).json({ error: 'Missing background or question' });
  }
  return proxyToAI('/ai/pi-prep', req.body, res);
});

// Doubt solver
app.post('/api/doubt', async (req, res) => {
  const { section, question } = req.body;
  if (!section || !question) {
    return res.status(400).json({ error: 'Missing section or question' });
  }
  return proxyToAI('/ai/doubt', req.body, res);
});

// Resources
app.get('/api/resources/:weak_area', async (req, res) => {
  try {
    const response = await axios.get(
      `${AI_SERVICE_URL}/resources/${req.params.weak_area}`,
      { timeout: 5000 }
    );
    return res.json(response.data);
  } catch (err) {
    return res.status(500).json({ error: 'Could not fetch resources' });
  }
});

// In-memory progress store (replace with DB in production)
const progressStore = {};

app.post('/api/progress', (req, res) => {
  const { userId = 'default', date, studied, tasksCompleted } = req.body;
  if (!progressStore[userId]) progressStore[userId] = {};
  progressStore[userId][date] = { studied, tasksCompleted, timestamp: Date.now() };
  res.json({ saved: true });
});

app.get('/api/progress/:userId', (req, res) => {
  const data = progressStore[req.params.userId] || {};
  const days = Object.keys(data).sort();
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  for (let i = days.length - 1; i >= 0; i--) {
    if (data[days[i]].studied) streak++;
    else break;
  }
  res.json({ progress: data, streak, totalDays: days.length });
});

// ─── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 CAT Prep Hub — Node.js Backend`);
  console.log(`   Running on  http://localhost:${PORT}`);
  console.log(`   AI Service  ${AI_SERVICE_URL}`);
  console.log(`   Env         ${process.env.NODE_ENV || 'development'}\n`);
});
