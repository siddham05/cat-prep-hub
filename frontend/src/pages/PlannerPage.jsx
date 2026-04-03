import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateTasks } from '../services/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const PHASE_PLANS = {
  foundation: ['VARC — Concepts', 'DILR — Basics', 'Quant — Theory', 'VARC — Practice', 'DILR — Sets', 'Quant + Mock', 'Rest / Review'],
  practice: ['DILR Sets', 'VARC RC', 'Full Mock', 'Mock Review', 'Quant Drills', 'Full Mock', 'Error Log'],
  revision: ['VARC Revision', 'DILR Revision', 'Full Mock', 'Analysis', 'Quant Shortcuts', 'Full Mock', 'Weak Areas'],
};

const slotClass = (label) => {
  if (label.includes('VARC')) return 'slot-v';
  if (label.includes('DILR')) return 'slot-d';
  if (label.includes('Quant')) return 'slot-q';
  if (label.includes('Mock')) return 'slot-m';
  return 'slot-r';
};

const diffBadge = (d) => {
  if (d === 'easy') return <span className="badge badge-easy">Easy</span>;
  if (d === 'hard') return <span className="badge badge-hard">Hard</span>;
  return <span className="badge badge-medium">Medium</span>;
};

export default function PlannerPage() {
  const [form, setForm] = useState({ daily_hours: 2, phase: 'foundation', background: 'engineering' });
  const [tasks, setTasks] = useState([]);
  const [checked, setChecked] = useState({});
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleGenerate = async () => {
    setLoading(true);
    setChecked({});
    try {
      const data = await generateTasks({ ...form, daily_hours: Number(form.daily_hours) });
      setTasks(data.tasks || []);
      setGenerated(true);
      toast.success('Plan generated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id) => setChecked(c => ({ ...c, [id]: !c[id] }));
  const done = Object.values(checked).filter(Boolean).length;

  const plan = PHASE_PLANS[form.phase];

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'var(--accent2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>02 — Weekly Planner</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
          Structure your <span style={{ color: 'var(--accent)' }}>week</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, marginBottom: '2rem', fontWeight: 300 }}>
          Auto-structured 7-day schedules with AI-generated daily tasks tailored to your phase and availability.
        </p>

        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: '1.25rem' }}>Configure your week</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
            <div className="field">
              <label>Daily hours</label>
              <select value={form.daily_hours} onChange={e => set('daily_hours', e.target.value)}>
                {[1, 2, 3, 4].map(h => <option key={h} value={h}>{h}h/day</option>)}
              </select>
            </div>
            <div className="field">
              <label>Current phase</label>
              <select value={form.phase} onChange={e => set('phase', e.target.value)}>
                <option value="foundation">Foundation</option>
                <option value="practice">Practice</option>
                <option value="revision">Revision</option>
              </select>
            </div>
            <div className="field">
              <label>Background</label>
              <select value={form.background} onChange={e => set('background', e.target.value)}>
                <option value="engineering">Engineering</option>
                <option value="commerce">Commerce</option>
                <option value="arts">Arts</option>
                <option value="working">Working</option>
              </select>
            </div>
          </div>
          <button className="btn btn-accent" onClick={handleGenerate} disabled={loading}>
            {loading ? <><span className="spinner" /> Generating...</> : <><Calendar size={15} /> Build my week</>}
          </button>
        </div>

        {/* Always show schedule preview */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: '1rem' }}>7-day schedule</div>
          {DAYS.map((d, i) => (
            <div key={d} className="day-row">
              <div className="day-name">{d}</div>
              <div className={`slot ${slotClass(plan[i])}`}>
                {plan[i]} · {plan[i].includes('Rest') ? '—' : `${form.daily_hours}h`}
              </div>
            </div>
          ))}
        </div>

        {/* Tasks */}
        {generated && tasks.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 15 }}>
                  <Sparkles size={16} color="var(--accent)" /> Today's AI tasks
                </div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: done === tasks.length ? 'var(--dilr)' : 'var(--muted)' }}>
                  {done}/{tasks.length} done
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, marginBottom: '1rem', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${tasks.length ? (done / tasks.length) * 100 : 0}%` }}
                  style={{ height: '100%', background: 'var(--accent)', borderRadius: 2 }} transition={{ duration: 0.3 }} />
              </div>

              {tasks.map((t, i) => (
                <div key={i} className="check-item">
                  <input type="checkbox" checked={!!checked[i]} onChange={() => toggle(i)} />
                  <div className="check-text" style={{ textDecoration: checked[i] ? 'line-through' : 'none', opacity: checked[i] ? 0.5 : 1 }}>
                    <strong style={{ color: t.section === 'VARC' ? 'var(--varc)' : t.section === 'DILR' ? 'var(--dilr)' : 'var(--quant)' }}>
                      {t.section}
                    </strong> — {t.task}
                    <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {diffBadge(t.difficulty)}
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--muted)' }}>
                        <Clock size={11} /> {t.duration_min} min
                      </span>
                      {t.resource && <span style={{ fontSize: 11, color: 'var(--muted)' }}>· {t.resource}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
