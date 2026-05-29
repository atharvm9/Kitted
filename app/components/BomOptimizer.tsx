"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { CATALOG } from "@/lib/catalog/parts";

/* ------------------------------------------------------------------ */
/*  DATA                                                                */
/* ------------------------------------------------------------------ */

const DISTRIBUTORS = [
  { id: "DK", name: "Digi-Key", ship: 8.99,  lead: "1–2 days",  tone: "rose",    url: "https://www.digikey.com" },
  { id: "MO", name: "Mouser",   ship: 7.49,  lead: "2–3 days",  tone: "blue",    url: "https://www.mouser.com" },
  { id: "AR", name: "Arrow",    ship: 12.00, lead: "3–5 days",  tone: "emerald", url: "https://www.arrow.com" },
  { id: "NW", name: "Newark",   ship: 9.95,  lead: "3–4 days",  tone: "amber",   url: "https://www.newark.com" },
  { id: "LC", name: "LCSC",     ship: 21.50, lead: "7–10 days", tone: "violet",  url: "https://www.lcsc.com" },
] as const;

type DistId = "DK" | "MO" | "AR" | "NW" | "LC";
type SellerId = DistId | "AZ" | "SF" | "AD" | "RS";

/* Brand accent colors — used as subtle micro-badges and card borders */
const DIST_BRAND: Record<DistId, { color: string; bg: string; border: string }> = {
  DK: { color: "#fff",    bg: "#FF6B00",              border: "#FF6B00" },
  MO: { color: "#fff",    bg: "#0071CE",              border: "#0071CE" },
  AR: { color: "#fff",    bg: "#005EB8",              border: "#005EB8" },
  NW: { color: "#0a0a0a", bg: "#78BE20",              border: "#78BE20" },
  LC: { color: "#fff",    bg: "#2563EB",              border: "#2563EB" },
};

const SELLERS: Record<SellerId, { name: string; tone: string; url: string }> = {
  DK: { name: "Digi-Key",  tone: "rose",    url: "https://www.digikey.com" },
  MO: { name: "Mouser",    tone: "blue",    url: "https://www.mouser.com" },
  AR: { name: "Arrow",     tone: "emerald", url: "https://www.arrow.com" },
  NW: { name: "Newark",    tone: "amber",   url: "https://www.newark.com" },
  LC: { name: "LCSC",      tone: "violet",  url: "https://www.lcsc.com" },
  AZ: { name: "Amazon",    tone: "orange",  url: "https://www.amazon.com/s?k=electronics+components" },
  SF: { name: "SparkFun",  tone: "fuchsia", url: "https://www.sparkfun.com" },
  AD: { name: "Adafruit",  tone: "teal",    url: "https://www.adafruit.com" },
  RS: { name: "RobotShop", tone: "sky",     url: "https://www.robotshop.com" },
};

interface BomRow {
  ref: string;
  mpn: string;
  desc: string;
  qty: number;
  moq: number;
  picks: Partial<Record<DistId, number>>;
}

const BOM: BomRow[] = [
  { ref: "R1–R4",  mpn: "RC0805FR-0710KL",       desc: "Resistor 10kΩ 1% 1/8W 0805",           qty: 200, moq: 100, picks: { DK: 0.0210, MO: 0.0235, LC: 0.0089 } },
  { ref: "R5,R6",  mpn: "RC0805FR-071KL",         desc: "Resistor 1kΩ 1% 1/8W 0805",            qty: 100, moq: 100, picks: { DK: 0.0210, MO: 0.0235, LC: 0.0089 } },
  { ref: "R7",     mpn: "RC0805FR-07470RL",        desc: "Resistor 470Ω 1% 1/8W 0805",           qty:  50, moq: 100, picks: { DK: 0.0210, MO: 0.0235, LC: 0.0089 } },
  { ref: "C1–C5",  mpn: "CL21B104KBCNNNC",         desc: "Capacitor 100nF 50V X7R 0805",         qty: 250, moq: 100, picks: { DK: 0.0480, MO: 0.0510, LC: 0.0078 } },
  { ref: "C6,C7",  mpn: "CL21A106KAYNNNE",         desc: "Capacitor 10µF 25V X5R 0805",          qty: 100, moq:  50, picks: { DK: 0.1150, MO: 0.1290, LC: 0.0291 } },
  { ref: "C8",     mpn: "EEE-FK1V101P",            desc: "Aluminum cap 100µF 35V SMD",           qty:  50, moq:  25, picks: { DK: 0.4900, MO: 0.5100, AR: 0.4750 } },
  { ref: "U1",     mpn: "STM32F103C8T6",           desc: "MCU 32-bit ARM Cortex-M3 LQFP48",      qty:  50, moq:   1, picks: { DK: 5.8900, MO: 5.7200, LC: 1.4900 } },
  { ref: "U2",     mpn: "LM358DR",                 desc: "Op-amp dual 1.1MHz SOIC-8",            qty:  50, moq:  25, picks: { DK: 0.4800, MO: 0.4500, LC: 0.0610 } },
  { ref: "U3",     mpn: "MCP23017-E/SS",           desc: "I/O expander 16-bit I²C SSOP-28",      qty:  50, moq:   1, picks: { DK: 1.9700, MO: 1.9500, NW: 2.0500 } },
  { ref: "U4",     mpn: "SN74HC595DR",             desc: "Shift register 8-bit SOIC-16",         qty:  50, moq:  25, picks: { DK: 0.5100, MO: 0.5400, AR: 0.4900 } },
  { ref: "U5",     mpn: "AMS1117-3.3",             desc: "LDO regulator 3.3V 1A SOT-223",        qty:  50, moq:  25, picks: { DK: 0.6800, MO: 0.7100, LC: 0.0820 } },
  { ref: "Q1,Q2",  mpn: "AO3400A",                 desc: "MOSFET N-ch 30V 5.7A SOT-23",          qty: 100, moq:  50, picks: { DK: 0.3400, MO: 0.3600, LC: 0.0440 } },
  { ref: "D1",     mpn: "1N4148W-7-F",             desc: "Signal diode 100V 150mA SOD-123",      qty:  50, moq:  25, picks: { DK: 0.1400, MO: 0.1500, NW: 0.1450 } },
  { ref: "D2,D3",  mpn: "LTST-C190KGKT",           desc: "LED green clear 0805",                 qty: 100, moq:  50, picks: { DK: 0.2100, MO: 0.2300, AR: 0.2050 } },
  { ref: "Y1",     mpn: "ABM8G-8.000MHZ-4Y-T3",    desc: "Crystal 8.000MHz 18pF SMD",            qty:  50, moq:   5, picks: { DK: 0.5200, MO: 0.5500, LC: 0.1620 } },
  { ref: "J1",     mpn: "USB4105-GF-A",            desc: "USB 2.0 Type-C receptacle 16P",        qty:  50, moq:   1, picks: { DK: 0.9900, MO: 1.0500, AR: 0.9600 } },
  { ref: "J2",     mpn: "B4B-XH-A(LF)(SN)",        desc: "Header 4-pos 2.5mm THT",               qty:  50, moq:  10, picks: { DK: 0.2800, MO: 0.2950, NW: 0.2900 } },
  { ref: "J3",     mpn: "PEC10-2110SM",            desc: "Header 2×5 1.27mm SMD",                qty:  50, moq:  10, picks: { DK: 1.4500, MO: 1.5200, AR: 1.3900 } },
  { ref: "SW1",    mpn: "TL3342F160QG",            desc: "Tactile switch SPST-NO 6mm SMD",       qty:  50, moq:  10, picks: { DK: 0.3800, MO: 0.3950, NW: 0.4100 } },
  { ref: "F1",     mpn: "0ZCJ0050AF2E",            desc: "PTC resettable fuse 500mA 16V SMD",    qty:  50, moq:  10, picks: { DK: 0.3300, MO: 0.3450, AR: 0.3200 } },
];

type Offer = [SellerId, number, number, string];

interface CatalogEntry {
  family: string;
  brand: string;
  thumb: string;
  official: boolean;
  mpn: string;
  mcu: string;
  specs: string;
  tags: string[];
  offers: Offer[];
}


/* Recent BOMs mock data */
const RECENT_BOMS = [
  { name: "main_board_rev4.csv",  lines: 20, parts: 1200, ago: "2 hr ago",  status: "optimized" as const },
  { name: "power_module_v2.csv",  lines: 12, parts:  450, ago: "1 day ago", status: "optimized" as const },
  { name: "sensor_array.csv",     lines:  8, parts:  280, ago: "3 days ago", status: "draft"     as const },
  { name: "motor_ctrl_brd.csv",   lines: 15, parts:  640, ago: "1 wk ago",  status: "optimized" as const },
];

/* ------------------------------------------------------------------ */
/*  OPTIMIZER                                                           */
/* ------------------------------------------------------------------ */

interface AssignedRow extends BomRow {
  dist: DistId;
  unit: number;
  total: number;
  isCheapest: boolean;
  moqWarning: boolean;
}

function optimizeMinCost(bom: BomRow[]): AssignedRow[] {
  const ids = DISTRIBUTORS.map(d => d.id);
  const ship = Object.fromEntries(DISTRIBUTORS.map(d => [d.id, d.ship]));
  const n = ids.length;
  let best: { total: number; rows: AssignedRow[] | null } = { total: Infinity, rows: null };
  for (let mask = 1; mask < (1 << n); mask++) {
    const open = ids.filter((_, i) => mask & (1 << i));
    let ok = true;
    let partSum = 0;
    const assigned: AssignedRow[] = [];
    for (const row of bom) {
      let bd: DistId | null = null;
      let bp = Infinity;
      for (const d of open) {
        const p = row.picks[d as DistId];
        if (p != null && p < bp) { bp = p; bd = d as DistId; }
      }
      if (bd == null) { ok = false; break; }
      const globalMin = Math.min(...Object.values(row.picks) as number[]);
      assigned.push({
        ...row,
        dist: bd,
        unit: bp,
        total: +(bp * row.qty).toFixed(4),
        isCheapest: bp === globalMin,
        moqWarning: row.qty < row.moq,
      });
      partSum += bp * row.qty;
    }
    if (!ok) continue;
    const tot = partSum + open.reduce((a, d) => a + (ship[d] ?? 0), 0);
    if (tot < best.total) best = { total: tot, rows: assigned };
  }
  return best.rows!;
}

function optimizeMinDist(bom: BomRow[]): AssignedRow[] {
  const remaining = new Set(bom.map((_, i) => i));
  const assigned = new Array<DistId | null>(bom.length).fill(null);
  while (remaining.size) {
    const counts: Record<string, number> = {};
    for (const i of remaining) {
      for (const d of Object.keys(bom[i].picks)) counts[d] = (counts[d] || 0) + 1;
    }
    const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as DistId;
    for (const i of [...remaining]) {
      if (bom[i].picks[best] != null) { assigned[i] = best; remaining.delete(i); }
    }
  }
  return bom.map((row, i) => {
    const dist = assigned[i]!;
    const price = row.picks[dist]!;
    const globalMin = Math.min(...Object.values(row.picks) as number[]);
    return {
      ...row,
      dist,
      unit: price,
      total: +(price * row.qty).toFixed(4),
      isCheapest: price === globalMin,
      moqWarning: row.qty < row.moq,
    };
  });
}

function singleSourceCost(bom: BomRow[]): number {
  let best = Infinity;
  for (const d of DISTRIBUTORS) {
    let sum = 0;
    let ok = true;
    for (const row of bom) {
      const p = row.picks[d.id as DistId];
      if (p == null) { ok = false; break; }
      sum += p * row.qty;
    }
    if (ok) best = Math.min(best, sum + d.ship);
  }
  if (best === Infinity) {
    const sum = bom.reduce((acc, r) => {
      const vals = Object.values(r.picks).sort((a, b) => a - b);
      return acc + vals[Math.floor(vals.length / 2)] * r.qty;
    }, 0);
    return sum + 14.95;
  }
  return best;
}

/* ------------------------------------------------------------------ */
/*  HELPERS                                                             */
/* ------------------------------------------------------------------ */

const fmt = (n: number, d = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

const distMeta = (id: DistId) => DISTRIBUTORS.find(d => d.id === id)!;

function sellerSearchUrl(id: SellerId, mpn: string): string {
  const q = encodeURIComponent(mpn);
  const map: Record<SellerId, string> = {
    DK: `https://www.digikey.com/en/products/filter?keywords=${q}`,
    MO: `https://www.mouser.com/c/?q=${q}`,
    AR: `https://www.arrow.com/en/products/search?q=${q}`,
    NW: `https://www.newark.com/search?st=${q}`,
    LC: `https://www.lcsc.com/search?q=${q}`,
    AZ: `https://www.amazon.com/s?k=${q}+electronics`,
    SF: `https://www.sparkfun.com/search/results?term=${q}`,
    AD: `https://www.adafruit.com/search?q=${q}`,
    RS: `https://www.robotshop.com/search?q=${q}`,
  };
  return map[id] ?? `https://www.google.com/search?q=${q}+datasheet`;
}

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS                                                       */
/* ------------------------------------------------------------------ */

const T = {
  bg:   '#020617',
  s1:   '#0C1020',
  s2:   '#111827',
  s3:   '#1A2233',
  s4:   '#243047',
  bd:   'rgba(255,255,255,0.06)',
  bdD:  'rgba(255,255,255,0.12)',
  bdH:  'rgba(59,130,246,0.35)',
  t1:   '#F1F5F9',
  t2:   '#94A3B8',
  t3:   '#475569',
  acc:  '#3B82F6',
  accH: '#60A5FA',
  accS: 'rgba(59,130,246,0.08)',
  accR: 'rgba(59,130,246,0.18)',
  em:   '#4ADE80',
  emS:  'rgba(74,222,128,0.07)',
  emB:  'rgba(74,222,128,0.18)',
  am:   '#FBBF24',
  amS:  'rgba(251,191,36,0.07)',
  amB:  'rgba(251,191,36,0.18)',
  err:  '#EF4444',
  errS: 'rgba(239,68,68,0.08)',
} as const;

/* ------------------------------------------------------------------ */
/*  PRIMITIVES                                                          */
/* ------------------------------------------------------------------ */

interface SegmentedOption { id: string; label: string }

function Segmented({
  value, onChange, options, size = "md", disabled = [],
}: {
  value: string;
  onChange: (v: string) => void;
  options: SegmentedOption[];
  size?: "md" | "sm";
  disabled?: string[];
}) {
  const pad = size === "sm"
    ? "px-2.5 py-1 text-[11px]"
    : "px-3 py-1.5 text-[12px]";
  return (
    <div
      className="inline-flex items-center gap-px rounded-[6px] p-0.5"
      style={{ background: T.s2, border: `1px solid ${T.bd}` }}
    >
      {options.map(o => {
        const active = value === o.id;
        const isDisabled = disabled.includes(o.id);
        return (
          <button
            key={o.id}
            onClick={() => !isDisabled && onChange(o.id)}
            disabled={isDisabled}
            className={"rounded-[4px] font-medium tracking-[-0.01em] transition-all duration-150 " + pad}
            style={
              isDisabled
                ? { color: T.t3, opacity: 0.35, cursor: 'not-allowed' }
                : active
                  ? { background: T.s3, color: T.t1, cursor: 'pointer' }
                  : { color: T.t3, cursor: 'pointer' }
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function DistBadge({ id }: { id: DistId }) {
  const d = distMeta(id);
  const brand = DIST_BRAND[id];
  return (
    <a
      href={d.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-[5px] transition-all duration-150"
      style={{
        background: brand.bg,
        border: `1px solid ${brand.border}`,
        padding: '2px 8px 2px 5px',
        color: brand.color,
        fontSize: 11,
        fontWeight: 600,
        textDecoration: 'none',
        letterSpacing: '-0.01em',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.15)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'none'; }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full shrink-0"
        style={{ background: brand.color }}
      />
      {d.name}
    </a>
  );
}

function UploadGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 15V4M12 4l-4 4M12 4l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Stepper({ step }: { step: 0 | 1 | 2 }) {
  const steps: { label: string; sub: string }[] = [
    { label: "Upload",   sub: "CSV / TSV"   },
    { label: "Match",    sub: "Part lookup"  },
    { label: "Optimize", sub: "Split-order"  },
  ];
  return (
    <div className="flex items-center">
      {steps.map((s, i) => {
        const done    = i < step;
        const active  = i === step;
        const future  = i > step;
        return (
          <div key={s.label} className="flex items-center">
            <div className="flex items-center gap-2">
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center text-[10px] font-semibold transition-all duration-200"
                style={
                  done
                    ? { background: T.em,  color: '#08090A', border: `1px solid ${T.em}`, borderRadius: 2 }
                    : active
                      ? { background: T.acc, color: '#fff', border: `1px solid ${T.acc}`, borderRadius: 2 }
                      : { background: 'transparent', color: T.t3, border: `1px solid ${T.bdD}`, borderRadius: 2 }
                }
              >
                {done ? (
                  <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : i + 1}
              </span>
              <div>
                <div
                  className="text-[12px] font-medium leading-none"
                  style={{ color: future ? T.t3 : T.t1 }}
                >
                  {s.label}
                </div>
                <div className="text-[10px] leading-none mt-0.5" style={{ color: T.t3 }}>
                  {s.sub}
                </div>
              </div>
            </div>
            {i < 2 && (
              <div
                className="mx-4 h-px w-10 shrink-0"
                style={{ background: i < step ? T.acc : T.bd }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HEADER                                                              */
/* ------------------------------------------------------------------ */

type Screen = "search" | "upload" | "results";

function Header({ screen, setScreen, hasResults }: { screen: Screen; setScreen: (s: Screen) => void; hasResults: boolean }) {
  return (
    <header
      className="sticky top-0 z-20 backdrop-blur-md"
      style={{ background: 'rgba(8,9,10,0.90)', borderBottom: `1px solid ${T.bd}` }}
    >
      <div className="mx-auto flex h-11 max-w-7xl items-center gap-6 px-6">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2 shrink-0" style={{ textDecoration: 'none' }}>
          <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" style={{ color: T.acc }}>
            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9" />
            <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
            <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
            <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.25" />
          </svg>
          <span className="text-[14px] font-semibold tracking-[-0.025em]" style={{ color: T.t1 }}>
            Kitted
          </span>
          <span
            className="rounded-[4px] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.06em]"
            style={{ background: T.accS, color: T.acc, border: `1px solid ${T.accR}` }}
          >
            Beta
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-0.5 ml-2">
          {(["search", "upload", "results"] as Screen[]).map(s => {
            const labels: Record<Screen, string> = { search: "Part Search", upload: "New BOM", results: "Results" };
            const active = screen === s;
            const disabled = s === "results" && !hasResults;
            return (
              <button
                key={s}
                onClick={() => !disabled && setScreen(s)}
                disabled={disabled}
                className="rounded-[5px] px-3 py-1.5 text-[12px] font-medium transition-all duration-150"
                style={{
                  color: disabled ? T.t3 : active ? T.t1 : T.t2,
                  background: active ? T.s3 : 'transparent',
                  opacity: disabled ? 0.4 : 1,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => { if (!disabled && !active) (e.currentTarget as HTMLElement).style.background = T.s2; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                {labels[s]}
              </button>
            );
          })}
        </nav>

        {/* Right slot — status chip */}
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: T.t3 }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: T.em }} />
            All distributors live
          </div>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  UPLOAD SCREEN                                                       */
/* ------------------------------------------------------------------ */

function UploadScreen({ onOptimize, onSearch }: { onOptimize: (fileName?: string) => void; onSearch: () => void }) {
  const [drag, setDrag] = useState(false);
  const [paste, setPaste] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">

      {/* Page title + stepper */}
      <div className="mb-8 flex flex-col gap-5">
        <div>
          <h1 className="text-[20px] font-semibold tracking-[-0.025em]" style={{ color: T.t1 }}>
            New optimization
          </h1>
          <p className="mt-1 text-[13px] leading-relaxed" style={{ color: T.t2 }}>
            Upload your BOM — we&apos;ll find the cheapest split-order plan across all major distributors.
          </p>
        </div>
        <Stepper step={0} />
      </div>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileRef.current?.click()}
        onKeyDown={e => { if (e.key === "Enter") fileRef.current?.click(); }}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; onOptimize(f?.name); }}
        className="group flex cursor-pointer flex-col items-center rounded-\[3px\] px-8 py-12 text-center transition-all duration-200"
        style={{
          border: `1.5px dashed ${drag ? T.acc : T.bdD}`,
          background: drag ? T.accS : T.s1,
        }}
      >
        <input ref={fileRef} type="file" accept=".csv,.tsv" className="hidden" onChange={e => onOptimize(e.target.files?.[0]?.name)} />
        <span
          className="mb-4 grid h-10 w-10 place-items-center rounded-[6px] transition-all duration-200"
          style={{
            background: T.s2,
            border: `1px solid ${drag ? T.acc : T.bdD}`,
            color: drag ? T.acc : T.t3,
          }}
        >
          <UploadGlyph className="h-5 w-5" />
        </span>
        <div className="text-[13px] font-medium tracking-[-0.01em]" style={{ color: T.t1 }}>
          Drop <span className="font-mono" style={{ color: T.acc }}>BOM.csv</span> or click to browse
        </div>
        <div className="mt-2 flex items-center gap-2 text-[11px]" style={{ color: T.t3 }}>
          <span>CSV · TSV · Excel</span>
          <span style={{ color: T.bdD }}>·</span>
          <span>KiCad · Altium · Eagle</span>
          <span style={{ color: T.bdD }}>·</span>
          <span>≤ 2 MB</span>
        </div>
      </div>

      {/* Paste area */}
      <div className="mt-4">
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: T.t3 }}>
          Or paste part numbers
        </label>
        <textarea
          value={paste}
          onChange={e => setPaste(e.target.value)}
          rows={3}
          placeholder={"STM32F103C8T6, 1\nRC0805FR-0710KL, 4\nCL21B104KBCNNNC, 5"}
          className="font-mono w-full resize-none rounded-[6px] px-3.5 py-2.5 text-[12px] transition-all duration-150 placeholder:opacity-30"
          style={{
            background: T.s1,
            border: `1px solid ${T.bdD}`,
            color: T.t1,
            outline: 'none',
            lineHeight: 1.6,
            fontFamily: 'var(--font-jetbrains-mono)',
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = T.acc;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${T.accR}`;
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = T.bdD;
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Controls row */}
      <div className="mt-4 flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-[12px]" style={{ color: T.t3 }}>
          <input type="checkbox" style={{ accentColor: T.acc }} />
          Include obsolete &amp; NRND parts
        </label>
        <button
          onClick={() => onOptimize()}
          className="inline-flex items-center gap-2 rounded-[6px] px-4 py-2 text-[13px] font-semibold tracking-[-0.01em] transition-all duration-150"
          style={{ background: T.acc, color: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.accH; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = T.acc; }}
        >
          Run optimization
          <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" style={{ opacity: 0.8 }}>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Recent BOMs */}
      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.07em]" style={{ color: T.t3 }}>
            Recent BOMs
          </h2>
          <button className="text-[11px] transition-colors" style={{ color: T.acc }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.accH; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.acc; }}
          >
            View all →
          </button>
        </div>
        <div
          className="overflow-hidden rounded-\[3px\]"
          style={{ border: `1px solid ${T.bd}`, background: T.s1 }}
        >
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.bd}` }}>
                {["Name", "Lines", "Parts", "Uploaded", "Status", ""].map(h => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.06em]"
                    style={{ color: T.t3 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_BOMS.map((b, i) => (
                <tr
                  key={b.name}
                  className="transition-colors duration-100"
                  style={{ borderTop: i > 0 ? `1px solid ${T.bd}` : undefined }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.s2; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <td className="px-4 py-2.5">
                    <span className="font-mono text-[12px]" style={{ color: T.t1 }}>{b.name}</span>
                  </td>
                  <td className="font-mono px-4 py-2.5 text-[12px]" style={{ color: T.t2 }}>{b.lines}</td>
                  <td className="font-mono px-4 py-2.5 text-[12px]" style={{ color: T.t2 }}>{b.parts.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-[12px]" style={{ color: T.t3 }}>{b.ago}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className="rounded-[4px] px-2 py-0.5 text-[10px] font-medium"
                      style={
                        b.status === "optimized"
                          ? { background: T.emS, color: T.em, border: `1px solid ${T.emB}` }
                          : { background: T.s3, color: T.t3, border: `1px solid ${T.bd}` }
                      }
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => onOptimize(b.name)}
                      className="text-[11px] font-medium transition-colors"
                      style={{ color: T.acc, cursor: 'pointer' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.accH; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.acc; }}
                    >
                      Reload →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-10 text-center text-[12px]" style={{ color: T.t3 }}>
        Looking for a single part?{" "}
        <button
          onClick={onSearch}
          className="font-medium transition-colors duration-150"
          style={{ color: T.acc }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.accH; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.acc; }}
        >
          Search the part catalog →
        </button>
      </p>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  RESULTS SCREEN                                                      */
/* ------------------------------------------------------------------ */

function MetricCard({
  label, value, sub, valueColor, icon,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  valueColor?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 px-5 py-4" style={{ borderTop: `2px solid ${T.acc}` }}>
      <div className="flex items-center gap-1.5">
        {icon && <span style={{ color: T.t3 }}>{icon}</span>}
        <div className="text-[10px] font-semibold uppercase tracking-[0.07em]" style={{ color: T.t3 }}>
          {label}
        </div>
      </div>
      <div
        className="font-mono tabular-nums font-semibold leading-none tracking-[-0.02em]"
        style={{ color: valueColor ?? T.t1, fontSize: 28, fontFamily: 'var(--font-jetbrains-mono)' }}
      >
        {value}
      </div>
      {sub && (
        <div className="text-[11px] leading-snug" style={{ color: T.t3 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function ResultsScreen({ onBack, bomFileName }: { onBack: () => void; bomFileName?: string | null }) {
  const [mode, setMode] = useState<"cost" | "dist">("cost");

  const rows = useMemo(
    () => (mode === "cost" ? optimizeMinCost(BOM) : optimizeMinDist(BOM)),
    [mode]
  );

  const groups = useMemo(() => {
    const m: Record<string, { id: DistId; lines: number; parts: number; subtotal: number }> = {};
    for (const r of rows) {
      if (!m[r.dist]) m[r.dist] = { id: r.dist, lines: 0, parts: 0, subtotal: 0 };
      m[r.dist].lines += 1;
      m[r.dist].parts += r.qty;
      m[r.dist].subtotal += r.total;
    }
    return Object.values(m).sort((a, b) => b.subtotal - a.subtotal);
  }, [rows]);

  const lineTotal   = rows.reduce((a, r) => a + r.total, 0);
  const shipTotal   = groups.reduce((a, g) => a + distMeta(g.id).ship, 0);
  const grandTotal  = lineTotal + shipTotal;
  const single      = singleSourceCost(BOM);
  const savings     = single - grandTotal;
  const savingsPct  = (savings / single) * 100;
  const totalParts  = rows.reduce((a, r) => a + r.qty, 0);
  const moqWarnings = rows.filter(r => r.moqWarning).length;

  /* max lead time from used distributors */
  const maxLeadDays = groups.length
    ? groups.reduce((max, g) => {
        const leadStr = distMeta(g.id).lead;
        const days = parseInt(leadStr.split("–")[1] ?? leadStr);
        return Math.max(max, isNaN(days) ? 0 : days);
      }, 0)
    : 0;

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">

      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[11px]" style={{ color: T.t3 }}>
            {bomFileName && (
              <>
                <span className="font-mono" style={{ color: T.t2 }}>{bomFileName}</span>
                <span>·</span>
              </>
            )}
            <span>{rows.length} lines</span>
            <span>·</span>
            <span>{totalParts.toLocaleString()} parts</span>
            {moqWarnings > 0 && (
              <>
                <span>·</span>
                <span
                  className="rounded-[4px] px-1.5 py-0.5 text-[10px] font-medium"
                  style={{ background: T.amS, color: T.am, border: `1px solid ${T.amB}` }}
                >
                  {moqWarnings} MOQ warning{moqWarnings > 1 ? "s" : ""}
                </span>
              </>
            )}
          </div>
          <h1 className="mt-1 text-[18px] font-semibold tracking-[-0.025em]" style={{ color: T.t1 }}>
            Optimized sourcing plan
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.07em]" style={{ color: T.t3 }}>Objective</span>
            <Segmented
              size="sm"
              value={mode}
              onChange={v => setMode(v as "cost" | "dist")}
              options={[{ id: "cost", label: "Min cost" }, { id: "dist", label: "Min shipments" }]}
            />
          </div>
          <button
            onClick={onBack}
            className="mt-auto inline-flex items-center gap-1.5 rounded-[6px] px-3.5 py-2 text-[12px] font-medium transition-all duration-150"
            style={{ background: T.s2, border: `1px solid ${T.bdD}`, color: T.t2, cursor: 'pointer' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.s3; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = T.s2; }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            New BOM
          </button>
        </div>
      </div>

      {/* 4 Summary cards */}
      <div
        className="grid grid-cols-2 overflow-hidden rounded-\[3px\] lg:grid-cols-4"
        style={{ border: `1px solid ${T.bd}`, background: T.s1 }}
      >
        <MetricCard
          label="Total cost"
          value={`$${fmt(grandTotal)}`}
          sub={`parts $${fmt(lineTotal)} · ship $${fmt(shipTotal)}`}
        />
        <div style={{ borderLeft: `1px solid ${T.bd}` }}>
          <MetricCard
            label="Savings vs. single-source"
            value={
              <span style={{ color: savings >= 0 ? T.em : '#F87171' }}>
                {savings >= 0 ? "−" : "+"}${fmt(Math.abs(savings))}
              </span>
            }
            sub={`${fmt(Math.abs(savingsPct), 1)}% vs $${fmt(single)} single-source`}
          />
        </div>
        <div style={{ borderLeft: `1px solid ${T.bd}` }}>
          <MetricCard
            label="Shipments"
            value={groups.length}
            sub={`of ${DISTRIBUTORS.length} distributors · ${rows.length} line items`}
          />
        </div>
        <div style={{ borderLeft: `1px solid ${T.bd}` }}>
          <MetricCard
            label="Max lead time"
            value={`${maxLeadDays}d`}
            sub={groups.map(g => distMeta(g.id).lead).join(" · ")}
          />
        </div>
      </div>

      {/* Split layout: table + sidebar */}
      <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_296px]">

        {/* Line items table */}
        <section
          className="overflow-hidden rounded-\[3px\]"
          style={{ border: `1px solid ${T.bd}`, background: T.s1 }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: `1px solid ${T.bd}` }}
          >
            <h2 className="text-[12px] font-semibold tracking-[-0.01em]" style={{ color: T.t1 }}>
              Line items
            </h2>
            <button
              type="button"
              onClick={() => {
                const header = "Ref,MPN,Description,Qty,MOQ,Distributor,Unit Price,Line Total\n";
                const body = rows.map(r =>
                  [r.ref, r.mpn, `"${r.desc.replace(/"/g, '""')}"`, r.qty, r.moq, distMeta(r.dist).name, fmt(r.unit, 4), fmt(r.total)].join(",")
                ).join("\n");
                const blob = new Blob([header + body], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = "kitted-bom.csv"; a.click();
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center gap-1.5 rounded-[5px] px-2.5 py-1.5 text-[11px] font-medium transition-all duration-150"
              style={{ background: T.s2, border: `1px solid ${T.bdD}`, color: T.t2, cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.s3; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = T.s2; }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
                <path d="M12 4v10m0 0l-3.5-3.5M12 14l3.5-3.5M5 18h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto scroll-clean">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr
                  className="text-[10px] font-semibold uppercase tracking-[0.06em]"
                  style={{ position: 'sticky', top: 0, zIndex: 10, borderBottom: `1px solid ${T.bdD}`, color: T.t3, background: T.s1 }}
                >
                  <th className="font-semibold" style={{ padding: '6px 10px' }}>Part</th>
                  <th className="font-semibold" style={{ padding: '6px 10px' }}>Description</th>
                  <th className="text-right font-semibold" style={{ padding: '6px 10px' }}>Qty</th>
                  <th className="font-semibold" style={{ padding: '6px 10px' }}>Distributor</th>
                  <th className="text-right font-semibold" style={{ padding: '6px 10px' }}>Unit</th>
                  <th className="font-semibold" style={{ padding: '6px 10px' }}>Flags</th>
                  <th className="text-right font-semibold" style={{ padding: '6px 10px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={r.mpn}
                    className="transition-colors duration-75"
                    style={{ borderTop: i > 0 ? `1px solid ${T.bd}` : undefined, height: 36 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.s2; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <td className="align-middle" style={{ padding: '6px 10px' }}>
                      <div className="font-mono text-[12px] font-medium" style={{ color: T.t1 }}>{r.mpn}</div>
                      <div className="font-mono mt-px text-[10px]" style={{ color: T.t3 }}>{r.ref}</div>
                    </td>
                    <td className="max-w-[200px]" style={{ padding: '6px 10px', fontSize: 11, color: T.t2 }}>{r.desc}</td>
                    <td className="font-mono tabular-nums text-right" style={{ padding: '6px 10px', fontSize: 12, color: T.t2 }}>{r.qty.toLocaleString()}</td>
                    <td style={{ padding: '6px 10px' }}><DistBadge id={r.dist} /></td>
                    <td className="font-mono tabular-nums text-right" style={{ padding: '6px 10px', fontSize: 12, color: T.t2 }}>${fmt(r.unit, 4)}</td>
                    <td style={{ padding: '6px 10px' }}>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {r.isCheapest && (
                          <span
                            className="rounded-[4px] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.04em]"
                            style={{ background: T.emS, color: T.em, border: `1px solid ${T.emB}` }}
                          >
                            Cheapest
                          </span>
                        )}
                        {r.moqWarning && (
                          <span
                            className="rounded-[4px] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.04em]"
                            style={{ background: T.amS, color: T.am, border: `1px solid ${T.amB}` }}
                            title={`MOQ is ${r.moq} — ordering ${r.qty}`}
                          >
                            ↑ MOQ {r.moq}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="font-mono tabular-nums text-right font-semibold" style={{ padding: '6px 10px', fontSize: 12, color: T.t1 }}>${fmt(r.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: `1px solid ${T.bdH}`, background: T.s2 }}>
                  <td className="px-4 py-2.5 text-[11px] font-medium" style={{ color: T.t3 }} colSpan={2}>
                    {rows.length} line items
                  </td>
                  <td className="font-mono tabular-nums px-3 py-2.5 text-right text-[12px]" style={{ color: T.t2 }}>
                    {totalParts.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5" />
                  <td className="px-3 py-2.5 text-right text-[11px]" style={{ color: T.t3 }}>
                    + ship ${fmt(shipTotal)}
                  </td>
                  <td className="px-3 py-2.5" />
                  <td className="font-mono tabular-nums px-4 py-2.5 text-right text-[13px] font-semibold" style={{ color: T.t1 }}>
                    ${fmt(lineTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Distributor sidebar */}
        <aside className="flex flex-col gap-3 lg:sticky lg:top-14">
          <div className="flex items-center justify-between mb-0.5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em]" style={{ color: T.t3 }}>
              Purchase orders
            </h2>
            <span className="text-[11px]" style={{ color: T.t3 }}>
              {groups.length} distributors
            </span>
          </div>

          {groups.map(g => {
            const d = distMeta(g.id);
            const brand = DIST_BRAND[g.id];
            const orderTotal = g.subtotal + d.ship;
            return (
              <div
                key={g.id}
                className="rounded-\[3px\] overflow-hidden"
                style={{
                  border: `1px solid ${T.bd}`,
                  background: T.s1,
                  borderLeft: `3px solid ${brand.color}`,
                }}
              >
                {/* Card header */}
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: `1px solid ${T.bd}` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: brand.color }} />
                    <span className="text-[13px] font-semibold tracking-[-0.01em]" style={{ color: T.t1 }}>
                      {d.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="rounded-[4px] px-1.5 py-0.5 text-[10px] font-medium"
                      style={{ background: T.s3, color: T.t3, border: `1px solid ${T.bd}` }}
                    >
                      {g.lines} lines
                    </span>
                  </div>
                </div>

                {/* Cart line items */}
                <div className="px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between text-[12px]">
                    <span style={{ color: T.t3 }}>
                      Parts
                      <span className="font-mono ml-1 text-[11px]" style={{ color: T.t3 }}>×{g.parts}</span>
                    </span>
                    <span className="font-mono tabular-nums" style={{ color: T.t2 }}>${fmt(g.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span style={{ color: T.t3 }}>Shipping · {d.lead}</span>
                    <span className="font-mono tabular-nums" style={{ color: T.t2 }}>${fmt(d.ship)}</span>
                  </div>
                </div>

                {/* Order total + CTA */}
                <div
                  className="px-4 py-3"
                  style={{ borderTop: `1px solid ${T.bd}`, background: T.s2 }}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[12px] font-medium" style={{ color: T.t2 }}>Order total</span>
                    <span className="font-mono tabular-nums text-[15px] font-semibold" style={{ color: T.t1 }}>
                      ${fmt(orderTotal)}
                    </span>
                  </div>
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-1.5 rounded-[5px] py-1.5 text-[11px] font-semibold transition-all duration-150"
                    style={{
                      background: brand.bg,
                      border: `1px solid ${brand.border}`,
                      color: brand.color,
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.2)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'none'; }}
                  >
                    Open cart at {d.name}
                    <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5" style={{ opacity: 0.7 }}>
                      <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}

          {/* Grand total + export */}
          <div
            className="rounded-\[3px\] px-4 py-4"
            style={{ border: `1px solid ${T.bdH}`, background: T.s2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-semibold" style={{ color: T.t2 }}>Grand total</span>
              <span className="font-mono tabular-nums text-[17px] font-semibold" style={{ color: T.t1 }}>
                ${fmt(grandTotal)}
              </span>
            </div>
            {savings >= 0 && (
              <div
                className="mb-3 rounded-[5px] px-3 py-2 text-[11px]"
                style={{ background: T.emS, border: `1px solid ${T.emB}`, color: T.em }}
              >
                You save <span className="font-mono font-semibold">${fmt(savings)}</span> ({fmt(savingsPct, 1)}%) vs. single-source
              </div>
            )}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-[5px] py-2 text-[12px] font-semibold transition-all duration-150"
              style={{ background: T.acc, color: '#fff' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.accH; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = T.acc; }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                <path d="M12 4v10m0 0l-3.5-3.5M12 14l3.5-3.5M5 18h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Export all carts
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  SEARCH SCREEN                                                       */
/* ------------------------------------------------------------------ */

function Thumb({ label }: { label: string }) {
  return (
    <div
      className="shrink-0 grid place-items-center overflow-hidden rounded-[6px]"
      style={{ width: 68, height: 52, background: T.s2, border: `1px solid ${T.bd}` }}
    >
      <span className="font-mono text-[9px] font-medium" style={{ color: T.t3 }}>{label}</span>
    </div>
  );
}

function SellerBadge({ id }: { id: SellerId }) {
  const s = SELLERS[id];
  if (!s) return null;
  const brand = DIST_BRAND[id as DistId];
  const isBranded = id in DIST_BRAND;
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-[5px] transition-all duration-150"
      style={{
        background: isBranded ? brand.bg : T.s2,
        border: `1px solid ${isBranded ? brand.border : T.bdD}`,
        padding: '2px 8px 2px 5px',
        color: isBranded ? brand.color : T.t2,
        fontSize: 11,
        fontWeight: 600,
        textDecoration: 'none',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.15)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'none'; }}
    >
      {isBranded
        ? <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: brand.color }} />
        : <span className="font-mono rounded-[3px] px-1 py-px text-[9px]" style={{ background: T.s3, color: T.t3 }}>{id}</span>
      }
      {s.name}
    </a>
  );
}

function OfferRow({ offer, best, mpn }: { offer: Offer; best: boolean; mpn: string }) {
  const [seller, price, stock, lead] = offer;
  return (
    <div
      className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-[5px] px-3 py-2 transition-colors duration-100"
      style={best ? { background: T.s2 } : {}}
      onMouseEnter={e => { if (!best) (e.currentTarget as HTMLElement).style.background = T.s2; }}
      onMouseLeave={e => { if (!best) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <div className="flex items-center gap-2">
        <SellerBadge id={seller} />
        {best && (
          <span
            className="rounded-[4px] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.04em]"
            style={{ background: T.emS, color: T.em, border: `1px solid ${T.emB}` }}
          >
            Best price
          </span>
        )}
      </div>
      <div className="ml-auto flex items-center gap-4 text-[11px]" style={{ color: T.t3 }}>
        <span className="font-mono tabular-nums hidden sm:inline">{stock.toLocaleString()} in stock</span>
        <span className="hidden md:inline">{lead}</span>
        <span className="font-mono tabular-nums w-16 text-right text-[13px] font-semibold" style={{ color: T.t1 }}>
          ${fmt(price)}
        </span>
        <a
          href={sellerSearchUrl(seller, mpn)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-medium transition-colors duration-150"
          style={{ color: T.acc, textDecoration: 'none' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.accH; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.acc; }}
        >
          View →
        </a>
      </div>
    </div>
  );
}

function VariantCard({ p }: { p: CatalogEntry }) {
  const sorted = [...p.offers].sort((a, b) => a[1] - b[1]);
  const min = sorted[0][1];
  return (
    <div
      className="rounded-\[3px\] p-4"
      style={{ background: T.s1, border: `1px solid ${T.bd}` }}
    >
      <div className="flex items-start gap-3">
        <Thumb label={p.thumb} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-semibold tracking-[-0.01em]" style={{ color: T.t1 }}>
              {p.brand}
            </span>
            {p.official ? (
              <span
                className="rounded-[4px] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.04em]"
                style={{ background: T.emS, color: T.em, border: `1px solid ${T.emB}` }}
              >
                Official
              </span>
            ) : (
              <span
                className="rounded-[4px] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.04em]"
                style={{ background: T.s2, color: T.t3, border: `1px solid ${T.bd}` }}
              >
                Compatible
              </span>
            )}
          </div>
          <div className="font-mono mt-0.5 text-[11px]" style={{ color: T.t3 }}>
            {p.mpn} · {p.mcu}
          </div>
          <div className="mt-1 text-[12px]" style={{ color: T.t2 }}>{p.specs}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[10px] font-medium uppercase tracking-[0.06em]" style={{ color: T.t3 }}>from</div>
          <div className="font-mono tabular-nums text-[16px] font-semibold tracking-[-0.02em]" style={{ color: T.t1 }}>
            ${fmt(min)}
          </div>
          <div className="text-[11px]" style={{ color: T.t3 }}>{p.offers.length} sellers</div>
        </div>
      </div>
      <div className="mt-3 space-y-0.5 pt-3" style={{ borderTop: `1px solid ${T.bd}` }}>
        {sorted.map((o, i) => <OfferRow key={o[0] + i} offer={o} best={i === 0} mpn={p.mpn} />)}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Semantic search — @huggingface/transformers (all-MiniLM-L6-v2)    */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _embedder: ((texts: string[], opts: object) => Promise<{ data: Float32Array }>) | null = null as any;
let _catVecs: Float32Array[] | null = null;

async function getEmbedder() {
  if (!_embedder) {
    const { pipeline } = await import('@huggingface/transformers');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { dtype: 'q8' }) as any;
  }
  return _embedder!;
}

async function embedTexts(texts: string[]): Promise<Float32Array[]> {
  const embedder = await getEmbedder();
  const out = await embedder(texts, { pooling: 'mean', normalize: true });
  const data = out.data;
  const dim = data.length / texts.length;
  return Array.from({ length: texts.length }, (_, i) => data.slice(i * dim, (i + 1) * dim));
}

const CATALOG_HAY = CATALOG.map(p =>
  [p.brand, p.family, p.mpn, p.mcu, p.specs, ...(p.tags ?? [])].join(' ')
);

async function ensureCatalogEmbedded(): Promise<Float32Array[]> {
  if (!_catVecs) _catVecs = await embedTexts(CATALOG_HAY);
  return _catVecs;
}

function dotProduct(a: Float32Array, b: Float32Array): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

/* ------------------------------------------------------------------ */

const SUGGESTIONS = ["Arduino Uno R3", "ESP32", "Raspberry Pi Pico", "STM32", "ATmega328P", "Teensy"];

function SearchScreen({ query, setQuery }: { query: string; setQuery: (q: string) => void }) {
  const [modelReady, setModelReady] = useState(false);
  const [semanticEntries, setSemanticEntries] = useState<CatalogEntry[] | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const modelLoadStarted = useRef(false);
  const triggerModelLoad = () => {
    if (modelLoadStarted.current) return;
    modelLoadStarted.current = true;
    ensureCatalogEmbedded().then(() => setModelReady(true)).catch(() => {});
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!modelReady || !query.trim()) { setSemanticEntries(null); return; }
    debounceRef.current = setTimeout(async () => {
      const catVecs = await ensureCatalogEmbedded();
      const [qVec] = await embedTexts([query.trim()]);
      const scored = CATALOG.map((p, i) => ({ p, score: dotProduct(qVec, catVecs[i]) }));
      scored.sort((a, b) => b.score - a.score);
      setSemanticEntries(scored.filter(s => s.score > 0.25).map(s => s.p));
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, modelReady]);

  const groups = useMemo(() => {
    let matched: CatalogEntry[];
    if (semanticEntries) {
      matched = semanticEntries;
    } else {
      const q = query.trim().toLowerCase();
      const tokens = q.split(/\s+/).filter(Boolean);
      if (!tokens.length) return [];
      const hay = (p: CatalogEntry) =>
        [p.brand, p.family, p.mpn, p.mcu, p.specs, ...(p.tags || [])].join(' ').toLowerCase();
      matched = CATALOG.filter(p => tokens.every(t => hay(p).includes(t)));
    }
    const order: string[] = [];
    const byFam: Record<string, CatalogEntry[]> = {};
    for (const p of matched) {
      if (!byFam[p.family]) { byFam[p.family] = []; order.push(p.family); }
      byFam[p.family].push(p);
    }
    return order.map(fam => {
      const items = byFam[fam].sort((a, b) =>
        Math.min(...a.offers.map(o => o[1])) - Math.min(...b.offers.map(o => o[1])));
      const brands = new Set(items.map(i => i.brand)).size;
      const minPrice = Math.min(...items.flatMap(i => i.offers.map(o => o[1])));
      return { fam, items, brands, minPrice };
    });
  }, [query, semanticEntries]);

  const totalVariants = groups.reduce((a, g) => a + g.items.length, 0);

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-[18px] font-semibold tracking-[-0.025em]" style={{ color: T.t1 }}>
        Part search
      </h1>
      <p className="mt-1 text-[13px]" style={{ color: T.t2 }}>
        Search by part number, chip, or category. Compare brands and every distributor that stocks them.
      </p>

      {/* Search input */}
      <div
        className="mt-5 flex items-center gap-2.5 rounded-[7px] px-3.5 py-2.5 transition-all duration-150"
        style={{ background: T.s1, border: `1px solid ${T.bdD}` }}
        onFocusCapture={e => {
          (e.currentTarget as HTMLElement).style.borderColor = T.acc;
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 3px ${T.accR}`;
        }}
        onBlurCapture={e => {
          (e.currentTarget as HTMLElement).style.borderColor = T.bdD;
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="shrink-0" style={{ width: 15, height: 15, color: T.t3 }}>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
          <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <input
          autoFocus
          value={query}
          onChange={e => { triggerModelLoad(); setQuery(e.target.value); }}
          placeholder="Search parts — e.g. Arduino Uno R3, ESP32, ATmega328P"
          className="min-w-0 flex-1 bg-transparent text-[13px] placeholder:opacity-30"
          style={{ color: T.t1, outline: 'none' }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="grid h-5 w-5 place-items-center rounded-[3px] text-[15px] transition-all duration-100"
            style={{ color: T.t3, cursor: 'pointer' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.s3; (e.currentTarget as HTMLElement).style.color = T.t2; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = T.t3; }}
          >
            ×
          </button>
        )}
      </div>

      {/* Suggestions */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.07em]" style={{ color: T.t3 }}>Popular:</span>
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            onClick={() => setQuery(s)}
            className="rounded-[4px] px-2.5 py-1 text-[11px] font-medium transition-all duration-150"
            style={{ background: T.s1, border: `1px solid ${T.bdD}`, color: T.t2, cursor: 'pointer' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = T.acc; (e.currentTarget as HTMLElement).style.color = T.acc; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = T.bdD; (e.currentTarget as HTMLElement).style.color = T.t2; }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Model status + result count */}
      <div className="mt-5 flex items-center gap-3 text-[12px]" style={{ color: T.t3 }}>
        {!modelReady && (
          <span className="flex items-center gap-1.5" style={{ color: T.t3 }}>
            <span className="inline-block h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: T.acc }} />
            Loading semantic model…
          </span>
        )}
        {totalVariants > 0 ? (
          <span>
            <span style={{ color: T.t1, fontWeight: 500 }}>{totalVariants}</span>{" "}
            result{totalVariants !== 1 && "s"} across{" "}
            <span style={{ color: T.t1, fontWeight: 500 }}>{groups.length}</span>{" "}
            part {groups.length === 1 ? "family" : "families"}
            {modelReady && semanticEntries && <span style={{ color: T.acc }}> · semantic</span>}
          </span>
        ) : (
          query.trim() ? "No matching parts." : null
        )}
      </div>

      {/* Results */}
      <div className="mt-4 space-y-8">
        {groups.map(g => (
          <section key={g.fam}>
            <div
              className="mb-3 flex items-end justify-between pb-2"
              style={{ borderBottom: `1px solid ${T.bd}` }}
            >
              <div className="flex items-baseline gap-2.5">
                <h2 className="text-[14px] font-semibold tracking-[-0.01em]" style={{ color: T.t1 }}>
                  {g.fam}
                </h2>
                <span className="text-[12px]" style={{ color: T.t3 }}>
                  {g.items.length} versions · {g.brands} brands
                </span>
              </div>
              <span className="font-mono tabular-nums text-[12px]" style={{ color: T.t3 }}>
                from ${fmt(g.minPrice)}
              </span>
            </div>
            <div className="space-y-2">
              {g.items.map(p => <VariantCard key={p.brand + p.mpn} p={p} />)}
            </div>
          </section>
        ))}

        {groups.length === 0 && (
          <div
            className="rounded-\[3px\] px-6 py-12 text-center"
            style={{ border: `1.5px dashed ${T.bdD}` }}
          >
            <div className="text-[13px] font-medium" style={{ color: T.t2 }}>
              Nothing matched &ldquo;{query}&rdquo;.
            </div>
            <div className="mt-1 text-[12px]" style={{ color: T.t3 }}>
              Try &ldquo;microcontroller&rdquo; or pick a popular search above.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  ROOT                                                                */
/* ------------------------------------------------------------------ */

export default function BomOptimizer() {
  const [screen, setScreen] = useState<Screen>("search");
  const [query, setQuery] = useState("Arduino Uno R3");
  const [hasResults, setHasResults] = useState(false);
  const [bomFileName, setBomFileName] = useState<string | null>(null);

  function handleOptimize(fileName?: string) {
    setBomFileName(fileName ?? null);
    setHasResults(true);
    setScreen("results");
  }

  return (
    <div className="min-h-full" style={{ background: T.bg }}>
      <Header screen={screen} setScreen={setScreen} hasResults={hasResults} />
      {screen === "search"  && <SearchScreen query={query} setQuery={setQuery} />}
      {screen === "upload"  && <UploadScreen onOptimize={handleOptimize} onSearch={() => setScreen("search")} />}
      {screen === "results" && <ResultsScreen onBack={() => setScreen("upload")} bomFileName={bomFileName} />}
    </div>
  );
}
