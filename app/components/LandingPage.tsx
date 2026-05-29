"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const DIST_ROWS = [
  { name: "Digi-Key",  parts: 47, subtotal: "284.33", shipping: "9.99",  highlight: true },
  { name: "LCSC",      parts: 12, subtotal: " 31.47", shipping: "0.00",  highlight: false },
  { name: "Mouser",    parts:  0, subtotal:   "—",    shipping:   "—",   highlight: false, skipped: true },
];

const FEATURES = [
  {
    label: "Cost-Optimal Splits",
    body: "Evaluates every valid distributor combination against your BOM. Accounts for unit pricing tiers, minimum order quantities, and flat shipping charges.",
  },
  {
    label: "5 Distributors",
    body: "Digi-Key, Mouser, Arrow, Newark, and LCSC are queried simultaneously. Coverage comparison is part of the output, not a hidden implementation detail.",
  },
  {
    label: "Lead-Time Surfacing",
    body: "Stock and estimated delivery date are shown alongside price. You see the full trade-off before committing to a split.",
  },
  {
    label: "Alternate Parts",
    body: "When a part is out of stock or over budget, compatible alternates are surfaced by manufacturer part number, not just keyword match.",
  },
];

const STEPS = [
  {
    n: "01",
    label: "Upload your BOM",
    body: "CSV or XLS. Reference designators, MPN, and quantity are the only required columns.",
  },
  {
    n: "02",
    label: "Review the split",
    body: "Kitted returns ranked distributor combinations sorted by total landed cost. Adjust weights for lead time if needed.",
  },
  {
    n: "03",
    label: "Export a purchase plan",
    body: "One-click export per distributor cart. Line items, quantities, and part URLs ready to checkout.",
  },
];

function useCountUp(target: number, duration = 1400, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(ease * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return value;
}

function StatBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const savings = useCountUp(21, 1200, started);
  const parts   = useCountUp(500000, 1400, started);
  const dist    = useCountUp(5, 900, started);
  return (
    <div ref={ref} className="stat-bar">
      <div className="stat-item">
        <span className="stat-value font-mono">{dist}</span>
        <span className="stat-label">distributors queried</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-value font-mono">{parts.toLocaleString()}+</span>
        <span className="stat-label">parts in catalog</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-value font-mono">~{savings}%</span>
        <span className="stat-label">avg cost reduction</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="lp-root">
      {/* ─── Nav ─────────────────────────────────────────────────── */}
      <nav className="lp-nav">
        <span className="lp-logo font-mono">KITTED</span>
        <div className="lp-nav-links">
          <a href="#how-it-works" className="lp-nav-link">How it works</a>
          <a href="#features" className="lp-nav-link">Features</a>
          <Link href="/optimize" className="lp-cta-btn lp-cta-btn--sm">
            Open App <Arrow />
          </Link>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-left">
          <div className="lp-eyebrow font-mono">BOM SOURCING OPTIMIZER</div>
          <h1 className="lp-headline">
            Find the<br />
            <span className="lp-headline-accent">minimum-cost</span><br />
            distributor split.
          </h1>
          <p className="lp-subline">
            Upload a BOM. Get a ranked purchase plan across Digi-Key, Mouser,
            Arrow, Newark, and LCSC — accounting for pricing tiers, shipping,
            and order minimums.
          </p>
          <div className="lp-hero-actions">
            <Link href="/optimize" className="lp-cta-btn lp-cta-btn--primary">
              Optimize Your BOM <Arrow />
            </Link>
            <a href="#how-it-works" className="lp-ghost-btn">
              See how it works
            </a>
          </div>
        </div>

        {/* mock result widget */}
        <div className="lp-hero-right">
          <div className="lp-widget">
            <div className="lp-widget-header font-mono">
              <span className="lp-widget-dot lp-widget-dot--red" />
              <span className="lp-widget-dot lp-widget-dot--yellow" />
              <span className="lp-widget-dot lp-widget-dot--green" />
              <span className="lp-widget-title">OPTIMIZATION RESULT</span>
            </div>
            <div className="lp-widget-body">
              <div className="lp-widget-meta font-mono">
                <span>bom_rev3.csv</span>
                <span className="lp-accent">59 line items</span>
              </div>
              <table className="lp-widget-table font-mono">
                <thead>
                  <tr>
                    <th>DISTRIBUTOR</th>
                    <th className="text-right">PARTS</th>
                    <th className="text-right">SUBTOTAL</th>
                    <th className="text-right">SHIP</th>
                  </tr>
                </thead>
                <tbody>
                  {DIST_ROWS.map((r) => (
                    <tr key={r.name} className={r.skipped ? "lp-row-skip" : r.highlight ? "lp-row-hl" : ""}>
                      <td>{r.name}</td>
                      <td className="text-right">{r.skipped ? "—" : r.parts}</td>
                      <td className="text-right">{r.skipped ? "—" : `$${r.subtotal}`}</td>
                      <td className="text-right">{r.skipped ? "—" : `$${r.shipping}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="lp-widget-total font-mono">
                <span>TOTAL</span>
                <div className="lp-widget-total-right">
                  <span className="lp-widget-total-val">$315.80</span>
                  <span className="lp-widget-savings">↓ 21% vs single-vendor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stat bar ────────────────────────────────────────────── */}
      <StatBar />

      {/* ─── How it works ────────────────────────────────────────── */}
      <section id="how-it-works" className="lp-section">
        <div className="lp-section-label font-mono">HOW IT WORKS</div>
        <h2 className="lp-section-heading">Three steps to a purchase plan.</h2>
        <div className="lp-steps">
          {STEPS.map((s) => (
            <div key={s.n} className="lp-step">
              <span className="lp-step-n font-mono">{s.n}</span>
              <h3 className="lp-step-label">{s.label}</h3>
              <p className="lp-step-body">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ────────────────────────────────────────────── */}
      <section id="features" className="lp-section">
        <div className="lp-section-label font-mono">FEATURES</div>
        <h2 className="lp-section-heading">Built for the way engineers actually work.</h2>
        <div className="lp-features">
          {FEATURES.map((f) => (
            <div key={f.label} className="lp-feature-card">
              <div className="lp-feature-accent" />
              <h3 className="lp-feature-label">{f.label}</h3>
              <p className="lp-feature-body">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Final CTA ───────────────────────────────────────────── */}
      <section className="lp-final-cta">
        <div className="lp-final-inner">
          <div className="lp-eyebrow font-mono">FREE TO USE</div>
          <h2 className="lp-final-heading">Your BOM is 20 minutes away from being optimized.</h2>
          <Link href="/optimize" className="lp-cta-btn lp-cta-btn--primary lp-cta-btn--lg">
            Open Kitted <Arrow />
          </Link>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer className="lp-footer font-mono">
        <span>KITTED — BOM SOURCING OPTIMIZER</span>
        <span className="lp-footer-muted">© 2026</span>
      </footer>

      <style>{CSS}</style>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ display: "inline", marginLeft: 4 }}>
      <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const CSS = `
  /* ── Root ── */
  .lp-root {
    min-height: 100vh;
    color: #F1F5F9;
    font-family: var(--font-sans, 'IBM Plex Sans', sans-serif);
  }

  /* ── Nav ── */
  .lp-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 48px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(2,6,23,0.88);
    backdrop-filter: blur(12px);
  }
  .lp-logo {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: #F1F5F9;
  }
  .lp-nav-links {
    display: flex;
    align-items: center;
    gap: 32px;
  }
  .lp-nav-link {
    font-size: 13px;
    color: #94A3B8;
    text-decoration: none;
    transition: color 180ms ease;
    letter-spacing: 0.01em;
  }
  .lp-nav-link:hover { color: #F1F5F9; }

  /* ── Buttons ── */
  .lp-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #3B82F6;
    color: #fff;
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    padding: 9px 18px;
    border: none;
    cursor: pointer;
    transition: background 160ms ease, transform 120ms ease;
    letter-spacing: 0.01em;
    border-radius: 2px;
  }
  .lp-cta-btn:hover { background: #2563EB; }
  .lp-cta-btn:active { transform: scale(0.98); }
  .lp-cta-btn--sm { font-size: 12px; padding: 7px 14px; }
  .lp-cta-btn--primary {
    font-size: 14px;
    padding: 11px 22px;
    font-weight: 600;
  }
  .lp-cta-btn--lg {
    font-size: 16px;
    padding: 14px 32px;
  }
  .lp-ghost-btn {
    font-size: 14px;
    color: #64748B;
    text-decoration: none;
    padding: 11px 0;
    border-bottom: 1px solid transparent;
    transition: color 160ms ease, border-color 160ms ease;
  }
  .lp-ghost-btn:hover {
    color: #F1F5F9;
    border-color: rgba(255,255,255,0.2);
  }

  /* ── Hero ── */
  .lp-hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    padding: 96px 48px 80px;
    max-width: 1200px;
    margin: 0 auto;
    align-items: center;
  }
  .lp-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.16em;
    color: #3B82F6;
    margin-bottom: 20px;
  }
  .lp-headline {
    font-size: clamp(36px, 4.5vw, 56px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.03em;
    color: #F8FAFC;
    margin: 0 0 24px;
  }
  .lp-headline-accent {
    color: #3B82F6;
    font-style: italic;
  }
  .lp-subline {
    font-size: 16px;
    line-height: 1.7;
    color: #94A3B8;
    margin: 0 0 36px;
    max-width: 440px;
  }
  .lp-hero-actions {
    display: flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
  }

  /* ── Widget ── */
  .lp-hero-right {
    display: flex;
    justify-content: center;
  }
  .lp-widget {
    background: #0D1525;
    border: 1px solid rgba(59,130,246,0.18);
    border-radius: 4px;
    width: 100%;
    max-width: 440px;
    overflow: hidden;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.4);
    animation: widget-in 0.6s cubic-bezier(0.16,1,0.3,1) both;
    animation-delay: 0.15s;
  }
  @keyframes widget-in {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .lp-widget-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
  }
  .lp-widget-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .lp-widget-dot--red    { background: #EF4444; }
  .lp-widget-dot--yellow { background: #F59E0B; }
  .lp-widget-dot--green  { background: #22C55E; }
  .lp-widget-title {
    margin-left: 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: #64748B;
  }
  .lp-widget-body {
    padding: 20px 20px 24px;
  }
  .lp-widget-meta {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #64748B;
    margin-bottom: 16px;
    letter-spacing: 0.04em;
  }
  .lp-accent { color: #3B82F6; }

  /* widget table */
  .lp-widget-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    margin-bottom: 0;
  }
  .lp-widget-table th {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: #475569;
    padding: 0 0 10px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .lp-widget-table th:first-child { text-align: left; }
  .lp-widget-table td {
    padding: 9px 0;
    color: #CBD5E1;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    vertical-align: middle;
  }
  .lp-widget-table td:first-child { text-align: left; }
  .lp-row-hl td { color: #F1F5F9; }
  .lp-row-hl td:first-child { color: #3B82F6; font-weight: 600; }
  .lp-row-skip td { color: #334155; }
  .text-right { text-align: right; }

  .lp-widget-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid rgba(255,255,255,0.1);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: #64748B;
  }
  .lp-widget-total-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }
  .lp-widget-total-val {
    font-size: 22px;
    font-weight: 700;
    color: #F1F5F9;
    letter-spacing: -0.02em;
  }
  .lp-widget-savings {
    font-size: 11px;
    color: #22C55E;
    font-weight: 500;
    letter-spacing: 0.04em;
  }

  /* ── Stat Bar ── */
  .stat-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    border-top: 1px solid rgba(255,255,255,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.015);
    padding: 28px 48px;
  }
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    flex: 1;
    max-width: 220px;
  }
  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: #F1F5F9;
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .stat-label {
    font-size: 12px;
    color: #475569;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .stat-divider {
    width: 1px;
    height: 48px;
    background: rgba(255,255,255,0.07);
    margin: 0 48px;
  }

  /* ── Sections ── */
  .lp-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 96px 48px;
  }
  .lp-section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.16em;
    color: #3B82F6;
    margin-bottom: 16px;
  }
  .lp-section-heading {
    font-size: clamp(24px, 3vw, 36px);
    font-weight: 700;
    letter-spacing: -0.025em;
    color: #F8FAFC;
    margin: 0 0 56px;
    max-width: 520px;
    line-height: 1.2;
  }

  /* ── Steps ── */
  .lp-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    border: 1px solid rgba(255,255,255,0.07);
  }
  .lp-step {
    padding: 36px 32px;
    border-right: 1px solid rgba(255,255,255,0.07);
    transition: background 200ms ease;
  }
  .lp-step:last-child { border-right: none; }
  .lp-step:hover { background: rgba(255,255,255,0.02); }
  .lp-step-n {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: #3B82F6;
    margin-bottom: 16px;
  }
  .lp-step-label {
    font-size: 16px;
    font-weight: 600;
    color: #F1F5F9;
    margin: 0 0 12px;
  }
  .lp-step-body {
    font-size: 14px;
    line-height: 1.65;
    color: #64748B;
    margin: 0;
  }

  /* ── Features ── */
  .lp-features {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.06);
  }
  .lp-feature-card {
    background: #020617;
    padding: 36px 32px;
    position: relative;
    overflow: hidden;
    transition: background 200ms ease;
  }
  .lp-feature-card:hover { background: #0D1525; }
  .lp-feature-accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #3B82F6, transparent);
    opacity: 0;
    transition: opacity 200ms ease;
  }
  .lp-feature-card:hover .lp-feature-accent { opacity: 1; }
  .lp-feature-label {
    font-size: 15px;
    font-weight: 600;
    color: #F1F5F9;
    margin: 0 0 10px;
  }
  .lp-feature-body {
    font-size: 14px;
    line-height: 1.65;
    color: #64748B;
    margin: 0;
  }

  /* ── Final CTA ── */
  .lp-final-cta {
    border-top: 1px solid rgba(255,255,255,0.06);
    background: rgba(59,130,246,0.04);
  }
  .lp-final-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 96px 48px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 28px;
  }
  .lp-final-heading {
    font-size: clamp(28px, 3.5vw, 44px);
    font-weight: 700;
    letter-spacing: -0.03em;
    color: #F8FAFC;
    margin: 0;
    max-width: 580px;
    line-height: 1.15;
  }

  /* ── Footer ── */
  .lp-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 48px;
    border-top: 1px solid rgba(255,255,255,0.06);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: #334155;
  }
  .lp-footer-muted { color: #1E293B; }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .lp-hero { grid-template-columns: 1fr; gap: 48px; padding: 64px 32px 56px; }
    .lp-hero-right { display: none; }
    .lp-section { padding: 64px 32px; }
    .lp-steps { grid-template-columns: 1fr; }
    .lp-step { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.07); }
    .lp-step:last-child { border-bottom: none; }
    .lp-features { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .lp-nav { padding: 16px 20px; }
    .lp-nav-link { display: none; }
    .lp-hero { padding: 48px 20px 40px; }
    .lp-section { padding: 48px 20px; }
    .lp-final-inner { padding: 64px 20px; }
    .lp-footer { padding: 16px 20px; flex-direction: column; gap: 4px; }
    .stat-bar { padding: 24px 20px; gap: 0; }
    .stat-divider { margin: 0 24px; }
  }

  /* ── Reduced motion ── */
  @media (prefers-reduced-motion: reduce) {
    .lp-widget { animation: none; }
  }

  /* ── Entry animations ── */
  .lp-hero-left {
    animation: fade-up 0.55s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .lp-hero-left { animation: none; }
  }
`;
