import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Calendar, Activity, Mic, HelpCircle, ArrowRight, Zap, Shield, Target } from 'lucide-react';

const FEATURES = [
  { icon: Map, label: 'Smart Roadmap', desc: 'AI-personalised phase-wise plan with curated resources. No more trusting random YouTube channels.', to: '/roadmap', color: 'var(--accent)' },
  { icon: Calendar, label: 'Weekly Planner', desc: 'Auto-structured 7-day schedule matched to your hours, phase, and weak areas.', to: '/planner', color: 'var(--dilr)' },
  { icon: Activity, label: 'Consistency Tracker', desc: 'Streak calendar, micro-goals, and daily AI nudges to keep you on track.', to: '/tracker', color: 'var(--accent2)' },
  { icon: Mic, label: 'PI Prep', desc: 'Practice Personal Interview questions with AI feedback tailored to your target IIM.', to: '/pi-prep', color: 'var(--quant)' },
  { icon: HelpCircle, label: 'Doubt Solver', desc: 'Get instant concept explanations and shortcuts for VARC, DILR, and Quant.', to: '/doubt', color: 'var(--varc)' },
];

const STATS = [
  { num: '5', label: 'Tools' },
  { num: 'AI', label: 'Powered' },
  { num: '100%', label: 'Free' },
];

const PAIN_POINTS = [
  { icon: Shield, text: 'Information overload — we curate only trusted resources', color: 'var(--accent)' },
  { icon: Target, text: 'Time management — smart weekly plans built for you', color: 'var(--dilr)' },
  { icon: Zap, text: 'Consistency — daily streak tracking and AI motivation', color: 'var(--accent2)' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <div style={{
        minHeight: 'calc(100vh - 64px)', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '5rem 1.5rem 4rem', position: 'relative', overflow: 'hidden'
      }}>
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'linear-gradient(rgba(124,111,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(124,111,255,0.05) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%,black 40%,transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%,black 40%,transparent 100%)',
        }} />
        {/* Glow */}
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(124,111,255,0.1) 0%,transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(94,255,203,0.07)', border: '1px solid rgba(94,255,203,0.2)',
              borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 500,
              color: 'var(--accent2)', marginBottom: '1.75rem',
              letterSpacing: '0.05em', textTransform: 'uppercase'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent2)', display: 'inline-block' }} />
              AI-powered · Built for CAT aspirants
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontSize: 'clamp(2.2rem,7vw,4.5rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
            Stop drowning in<br />
            <span style={{ color: 'var(--accent)' }}>information.</span><br />
            <span style={{ WebkitTextStroke: '1px rgba(124,111,255,0.5)', color: 'transparent' }}>Start scoring.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: '1.05rem', color: 'var(--muted)', maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.75, fontWeight: 300 }}>
            Your personalised AI study companion that cuts through the noise — trusted roadmaps, smart planning, and daily accountability.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-accent btn-lg" onClick={() => navigate('/roadmap')}>
              Build my roadmap <ArrowRight size={17} />
            </button>
            <button className="btn btn-lg" onClick={() => navigate('/tracker')}>
              Track my streak
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '3.5rem' }}>
            {STATS.map(({ num, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.03em' }}>{num}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Pain points solved */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'var(--accent2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Pain points we solve</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            Real problems, <span style={{ color: 'var(--accent)' }}>real solutions</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12, marginBottom: '4rem' }}>
            {PAIN_POINTS.map(({ icon: Icon, text, color }) => (
              <div key={text} className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color={color} />
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--muted)', paddingTop: 6 }}>{text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Feature cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'var(--accent2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>All tools</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            Everything you <span style={{ color: 'var(--accent)' }}>need</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
            {FEATURES.map(({ icon: Icon, label, desc, to, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                <div className="card" onClick={() => navigate(to)} style={{ cursor: 'pointer', height: '100%' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = color + '50'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: color + '18', border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={17} color={color} />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{label}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>{desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, fontSize: 13, color: color, fontWeight: 500 }}>
                    Open <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
