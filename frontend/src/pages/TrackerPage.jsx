import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMotivation, saveProgress } from '../services/api';

const TODAY_IDX = 15;
const TOTAL_DAYS = 30;

const MICRO_GOALS = [
  { section: 'VARC', task: 'Read 1 editorial from The Hindu (15 min)', badge: 'easy' },
  { section: 'DILR', task: 'Solve 1 caselet set from Arun Sharma (20 min)', badge: 'medium' },
  { section: 'Quant', task: 'Revise arithmetic formulas + 10 questions (20 min)', badge: 'medium' },
  { section: 'Vocab', task: 'Learn 5 new words with usage examples (10 min)', badge: 'easy' },
  { section: 'Review', task: 'Analyse yesterday\'s mistakes in error log (10 min)', badge: 'key' },
];

const sectionColor = s => ({ VARC: 'var(--varc)', DILR: 'var(--dilr)', Quant: 'var(--quant)', Vocab: 'var(--accent)', Review: 'var(--accent2)' }[s] || 'var(--muted)');

export default function TrackerPage() {
  const [marked, setMarked] = useState(new Set([12, 13, 14]));
  const [checked, setChecked] = useState({});
  const [motivation, setMotivation] = useState('');
  const [motivLoading, setMotivLoading] = useState(false);

  const streak = (() => {
    let s = 0;
    for (let i = TODAY_IDX - 1; i >= 1; i--) {
      if (marked.has(i)) s++;
      else break;
    }
    return s;
  })();

  const doneCount = Object.values(checked).filter(Boolean).length;

  const toggleDay = (i) => {
    if (i >= TODAY_IDX) return;
    setMarked(m => {
      const n = new Set(m);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  };

  const toggleTask = (i) => {
    setChecked(c => ({ ...c, [i]: !c[i] }));
  };

  const handleMotivation = async () => {
    setMotivLoading(true);
    try {
      const data = await getMotivation({ streak, tasks_done: doneCount, tasks_total: MICRO_GOALS.length, weak_area: 'VARC' });
      setMotivation(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setMotivLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    saveProgress({ userId: 'default', date: today, studied: doneCount > 0, tasksCompleted: doneCount }).catch(() => {});
  }, [doneCount]);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'var(--accent2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>03 — Consistency Tracker</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
          Build your <span style={{ color: 'var(--accent)' }}>streak</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, marginBottom: '2rem', fontWeight: 300 }}>
          Small consistent actions compound into extraordinary results. Track every day.
        </p>

        {/* Metrics */}
        <div className="grid-3" style={{ marginBottom: '1.25rem' }}>
          <div className="metric">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <div className="metric-num">{streak}</div>
              <Flame size={22} color="var(--accent3)" />
            </div>
            <div className="metric-label">Day streak</div>
          </div>
          <div className="metric">
            <div className="metric-num">{doneCount}</div>
            <div className="metric-label">Tasks today</div>
          </div>
          <div className="metric">
            <div className="metric-num">{marked.size}</div>
            <div className="metric-label">Days studied</div>
          </div>
        </div>

        {/* Calendar */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>30-day calendar</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>Click past days to mark as studied</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map(d => (
              <div key={d}
                className={`cal-day ${d === TODAY_IDX ? 'today' : ''} ${d < TODAY_IDX && marked.has(d) ? 'done' : ''} ${d > TODAY_IDX ? 'future' : ''}`}
                onClick={() => toggleDay(d)}
                title={d === TODAY_IDX ? 'Today' : d < TODAY_IDX ? 'Click to toggle' : 'Future'}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Streak bar */}
          {streak > 0 && (
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Flame size={14} color="var(--accent3)" />
              <div style={{ flex: 1, height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                <motion.div animate={{ width: `${Math.min((streak / 30) * 100, 100)}%` }}
                  style={{ height: '100%', background: 'linear-gradient(90deg,var(--accent),var(--accent3))', borderRadius: 2 }}
                  transition={{ duration: 0.5 }} />
              </div>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'var(--accent3)' }}>{streak}/30</span>
            </div>
          )}
        </div>

        {/* Micro goals */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={16} color="var(--accent2)" /> Today's micro-goals
            </div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: doneCount === MICRO_GOALS.length ? 'var(--dilr)' : 'var(--muted)' }}>
              {doneCount}/{MICRO_GOALS.length}
            </div>
          </div>

          <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, marginBottom: '1rem', overflow: 'hidden' }}>
            <motion.div animate={{ width: `${(doneCount / MICRO_GOALS.length) * 100}%` }}
              style={{ height: '100%', background: 'var(--accent2)', borderRadius: 2 }} transition={{ duration: 0.3 }} />
          </div>

          {MICRO_GOALS.map((g, i) => (
            <div key={i} className="check-item">
              <input type="checkbox" checked={!!checked[i]} onChange={() => toggleTask(i)} />
              <div className="check-text" style={{ opacity: checked[i] ? 0.5 : 1, textDecoration: checked[i] ? 'line-through' : 'none' }}>
                <strong style={{ color: sectionColor(g.section) }}>{g.section}</strong> — {g.task}
                <div style={{ marginTop: 4 }}>
                  <span className={`badge badge-${g.badge}`}>{g.badge === 'key' ? 'crucial' : g.badge}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Motivation */}
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} color="var(--accent)" /> AI motivation nudge
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
            Get a personalised message based on your streak and today's progress.
          </p>
          <button className="btn btn-accent btn-sm" onClick={handleMotivation} disabled={motivLoading}>
            {motivLoading ? <><span className="spinner" /> Generating...</> : <><Sparkles size={14} /> Get nudge</>}
          </button>
          {motivation && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="ai-box" style={{ marginTop: '1rem' }}>
              {motivation}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
