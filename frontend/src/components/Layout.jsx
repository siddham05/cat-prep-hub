import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Calendar, Activity, Mic, HelpCircle, Home, Menu, X } from 'lucide-react';

const NAV = [
  { to: '/', label: 'Home', icon: Home, exact: true },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/planner', label: 'Planner', icon: Calendar },
  { to: '/tracker', label: 'Tracker', icon: Activity },
  { to: '/pi-prep', label: 'PI Prep', icon: Mic },
  { to: '/doubt', label: 'Doubt Solver', icon: HelpCircle },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        background: scrolled ? 'rgba(10,10,15,0.9)' : 'rgba(10,10,15,0.6)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        transition: 'background 0.3s'
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem',
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 15,
              fontWeight: 700, color: 'var(--accent)', letterSpacing: -0.5
            }}>
              CAT<span style={{ color: 'var(--accent2)' }}>Prep</span>Hub
            </div>
          </NavLink>

          {/* Desktop nav */}
          <div style={{ display: 'flex', gap: 4 }} className="desktop-nav">
            {NAV.map(({ to, label, exact }) => (
              <NavLink key={to} to={to} end={exact} style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <div style={{
                    padding: '7px 13px', borderRadius: 8, fontSize: 13,
                    fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                    color: isActive ? 'var(--accent)' : 'var(--muted)',
                    background: isActive ? 'rgba(124,111,255,0.1)' : 'transparent',
                  }}>
                    {label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} style={{
            display: 'none', background: 'none', border: 'none',
            color: 'var(--text)', cursor: 'pointer', padding: 4
          }} className="mobile-menu-btn" aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}
            style={{
              position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
              background: 'rgba(10,10,15,0.97)', backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--border)', padding: '0.75rem 1.5rem 1rem'
            }}
          >
            {NAV.map(({ to, label, icon: Icon, exact }) => (
              <NavLink key={to} to={to} end={exact} style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 0', borderBottom: '1px solid var(--border)',
                    color: isActive ? 'var(--accent)' : 'var(--muted)',
                    fontWeight: isActive ? 600 : 400, fontSize: 15
                  }}>
                    <Icon size={17} />
                    {label}
                  </div>
                )}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main style={{ paddingTop: 64 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer style={{
        textAlign: 'center', padding: '2.5rem 2rem',
        borderTop: '1px solid var(--border)',
        color: 'var(--muted)', fontSize: 12, letterSpacing: '0.03em'
      }}>
        CAT Prep Hub · Powered by <span style={{ color: 'var(--accent)' }}>AI</span> · Built for aspirants
      </footer>

      <style>{`
        @media (max-width: 700px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}
