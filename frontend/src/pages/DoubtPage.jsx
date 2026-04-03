import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { solveDoubt } from '../services/api';

const SAMPLE_DOUBTS = {
  VARC: ['How do I improve RC speed?', 'What is the best approach for para-jumbles?', 'How to find the main idea of a passage?'],
  DILR: ['How to approach an unknown DILR set?', 'Tips for Venn diagram questions?', 'How to manage time in DILR?'],
  Quant: ['Shortcut for percentage calculations?', 'How to solve quadratic equations fast?', 'Tips for Number System questions?'],
};

export default function DoubtPage() {
  const [section, setSection] = useState('VARC');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSolve = async () => {
    if (!question.trim()) { toast.error('Please enter your doubt'); return; }
    setLoading(true);
    setAnswer('');
    try {
      const data = await solveDoubt({ section, question });
      setAnswer(data.answer);
      toast.success('Doubt solved!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sectionColor = { VARC: 'var(--varc)', DILR: 'var(--dilr)', Quant: 'var(--quant)' };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'var(--accent2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>05 — Doubt Solver</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
          Instant <span style={{ color: 'var(--accent)' }}>doubt solving</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, marginBottom: '2rem', fontWeight: 300 }}>
          Get concept explanations, shortcuts, and step-by-step approaches for any CAT topic.
        </p>

        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: '1.25rem' }}>Ask your doubt</div>

          {/* Section tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
            {['VARC', 'DILR', 'Quant'].map(s => (
              <button key={s} onClick={() => { setSection(s); setQuestion(''); setAnswer(''); }}
                className="btn btn-sm"
                style={{
                  color: section === s ? sectionColor[s] : 'var(--muted)',
                  borderColor: section === s ? sectionColor[s] + '60' : 'var(--border)',
                  background: section === s ? sectionColor[s] + '12' : 'transparent',
                  fontWeight: section === s ? 600 : 400,
                }}>
                {s}
              </button>
            ))}
          </div>

          <div className="field">
            <label>Your question</label>
            <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder={`Ask anything about ${section}...`} rows={3} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>Common doubts</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(SAMPLE_DOUBTS[section] || []).map(q => (
                <button key={q} onClick={() => setQuestion(q)} className="btn btn-sm"
                  style={{ fontSize: 12, color: question === q ? sectionColor[section] : 'var(--muted)', borderColor: question === q ? sectionColor[section] + '60' : 'var(--border)', background: question === q ? sectionColor[section] + '10' : 'transparent' }}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-accent" onClick={handleSolve} disabled={loading}>
            {loading ? <><span className="spinner" /> Solving...</> : <><HelpCircle size={15} /> Solve my doubt</>}
          </button>
        </div>

        {answer && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 15, marginBottom: '1rem' }}>
                <Sparkles size={16} color="var(--accent)" /> Answer
                <span className={`tag tag-${section.toLowerCase()}`} style={{ marginLeft: 4 }}>{section}</span>
              </div>
              <div className="ai-box">{answer}</div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
