import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RoadmapPage from './pages/RoadmapPage';
import PlannerPage from './pages/PlannerPage';
import TrackerPage from './pages/TrackerPage';
import PIPage from './pages/PIPage';
import DoubtPage from './pages/DoubtPage';
import './styles/globals.css';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#18181f', color: '#f0f0f5', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Sora, sans-serif', fontSize: '14px' },
          success: { iconTheme: { primary: '#5effcb', secondary: '#18181f' } },
          error: { iconTheme: { primary: '#ff6f8a', secondary: '#18181f' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="planner" element={<PlannerPage />} />
          <Route path="tracker" element={<TrackerPage />} />
          <Route path="pi-prep" element={<PIPage />} />
          <Route path="doubt" element={<DoubtPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
