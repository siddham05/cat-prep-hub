import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPIPrep } from '../services/api';

const SAMPLE_QUESTIONS = [
  'Tell me about yourself.',
  'Why MBA? Why now?',
  'Why IIM specifically?',
  'What are your strengths and weaknesses?',
  'Where do you see yourself in 5 years?',
  'Describe a leadership experience.',
  'What is your biggest failure and what did you learn?',
  'Why should we select you over other candidates?',
];

export default function PIPage() {
  const [form, setForm] = useState({ background: 'engineering', target_college: 'IIM Ahmedabad', question: '' });
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.question.trim()) { toast.error('Please enter a question'); return; }
    setLoading(true);
    setAnswer('');
    try {
      const data = await getPIPrep(form);
      setAnswer(data.answer);
      toast.success('PI answer generated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'var(--accent2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>04 — PI Prep</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
          Ace your <span style={{ color: 'var(--accent)' }}>interview</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, marginBottom: '2rem', fontWeight: 300 }}>
          Practice Personal Interview questions with AI feedback tailored to your target IIM and profile.
        </p>

        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: '1.25rem' }}>Your profile</div>
          <div className="grid-2">
            <div className="field">
              <label>Background</label>
              <select value={form.background} onChange={e => set('background', e.target.value)}>
                <option value="engineering">Engineering</option>
                <option value="commerce">Commerce</option>
                <option value="arts">Arts</option>
                <option value="working">Working professional</option>
              </select>
            </div>
            <div className="field">
              <label>Target college</label>
              <select value={form.target_college} onChange={e => set('target_college', e.target.value)}>
                {['IIM Ahmedabad','IIM Bangalore','IIM Calcutta','IIM Lucknow','IIM Kozhikode','IIM Indore'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label>Interview question</label>
            <textarea value={form.question} onChange={e => set('question', e.target.value)} placeholder="Type or select a question below..." rows={3} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>Common questions</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SAMPLE_QUESTIONS.map(q => (
                <button key={q} onClick={() => set('question', q)} className="btn btn-sm"
                  style={{ color: form.question === q ? 'var(--accent)' : 'var(--muted)', borderColor: form.question === q ? 'rgba(124,111,255,0.4)' : 'var(--border)', background: form.question === q ? 'rgba(124,111,255,0.08)' : 'transparent', fontSize: 12 }}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-accent" onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="spinner" /> Preparing answer...</> : <><Mic size={15} /> Generate PI answer</>}
          </button>
        </div>

        {answer && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 15, marginBottom: '1rem' }}>
                <Sparkles size={16} color="var(--accent)" /> AI-crafted answer & guidance
              </div>
              <div className="ai-box">{answer}</div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
