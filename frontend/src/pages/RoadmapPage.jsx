import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateRoadmap, getResources } from '../services/api';

const PAGE_FADE = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

export default function RoadmapPage() {
  const [form, setForm] = useState({ background: 'engineering', months_left: 6, daily_hours: 2, weakest_area: 'VARC' });
  const [roadmap, setRoadmap] = useState('');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleGenerate = async () => {
    setLoading(true);
    setRoadmap('');
    setResources([]);
    try {
      const [rm, res] = await Promise.all([
        generateRoadmap({ ...form, months_left: Number(form.months_left), daily_hours: Number(form.daily_hours) }),
        getResources(form.weakest_area)
      ]);
      setRoadmap(rm.roadmap);
      setResources(res.resources || []);
      toast.success('Roadmap generated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <motion.div {...PAGE_FADE}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'var(--accent2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>01 — Smart Roadmap</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
          Cut through the <span style={{ color: 'var(--accent)' }}>noise</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, marginBottom: '2rem', fontWeight: 300 }}>
          No more trusting random YouTube channels. Get a structured, personalised roadmap with only vetted resources.
        </p>

        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: '1.25rem' }}>Tell us about yourself</div>
          <div className="grid-2">
            <div className="field">
              <label>Background</label>
              <select value={form.background} onChange={e => set('background', e.target.value)}>
                <option value="engineering">Engineering student</option>
                <option value="commerce">Commerce student</option>
                <option value="arts">Arts student</option>
                <option value="working">Working professional</option>
              </select>
            </div>
            <div className="field">
              <label>Months until CAT</label>
              <select value={form.months_left} onChange={e => set('months_left', e.target.value)}>
                {[2, 4, 6, 9, 12].map(m => <option key={m} value={m}>{m} months</option>)}
              </select>
            </div>
            <div className="field">
              <label>Daily study hours</label>
              <select value={form.daily_hours} onChange={e => set('daily_hours', e.target.value)}>
                {[1, 2, 3, 4].map(h => <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}/day</option>)}
              </select>
            </div>
            <div className="field">
              <label>Weakest area</label>
              <select value={form.weakest_area} onChange={e => set('weakest_area', e.target.value)}>
                <option value="VARC">VARC</option>
                <option value="DILR">DILR</option>
                <option value="Quant">Quantitative</option>
                <option value="All">All equally</option>
              </select>
            </div>
          </div>
          <button className="btn btn-accent" onClick={handleGenerate} disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <><span className="spinner" /> Generating roadmap...</> : <><Sparkles size={15} /> Generate my roadmap</>}
          </button>
        </div>

        {roadmap && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 15, marginBottom: '1rem' }}>
                <Sparkles size={16} color="var(--accent)" /> Your personalised roadmap
              </div>
              <div className="ai-box">{roadmap}</div>
            </div>

            {resources.length > 0 && (
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 15, marginBottom: '1rem' }}>
                  <BookOpen size={16} color="var(--accent2)" /> Curated resources — vetted for you
                </div>
                {resources.map((r, i) => (
                  <div key={i} className="res-item">
                    <div className="res-rank">{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
                        {r.desc} <span className={`tag tag-${r.type}`}>{r.type.toUpperCase()}</span>
                      </div>
                    </div>
                    {r.url && r.url !== '#' && (
                      <a href={r.url} target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center' }}>
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
