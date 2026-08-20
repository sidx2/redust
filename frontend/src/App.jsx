import "./App.css";

import React, { useState, useEffect, useRef, useMemo } from "react";

import {
  TbBrandGithub as Github,
  TbTerminal2 as Terminal,
  TbBolt as Zap,
  TbStopwatch as Timer,
  TbCpu as Cpu,
  TbCode as Code,
  TbPackage as Package,
  TbArrowRight as ArrowRight,
  TbArrowUpRight as ArrowUpRight,
  TbCopy as Copy,
  TbCheck as Check,
  TbMenu2 as Menu,
  TbX as X,
  TbChevronRight as ChevronRight,
  TbKey as KeyRound,
  TbRefresh as RefreshCw,
  TbGauge as Gauge,
  TbTicket as Ticket,
} from "react-icons/tb";

import {
  // Zap,
  // Timer,
  // Cpu,
  // Code,
  // Package,
  // ArrowRight,
  // ArrowUpRight,
  // Copy,
  // Check,
  // Menu,
  // X,
  // ChevronRight,
  // KeyRound,
  // RefreshCw,
  // Gauge,
  // Ticket,
} from "lucide-react";



const GITHUB_URL = "https://github.com/sidx2/redust";
const SDK_URL = "https://github.com/sidx2/redust-node";
const SDK_INSTALL = "npm install https://github.com/sidx2/redust-node";
const CLONE_CMD = "git clone https://github.com/sidx2/redust";

/* ------------------------------------------------------------------ */
/* Design tokens: "forge" palette — Redust = REDis + rUST.             */
/* Warm near-black ground, ember/oxide gradient as the single accent,  */
/* mono display type standing in for the raw text protocol itself.    */
/* ------------------------------------------------------------------ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

  .rd-root {
    --void: #0a0704;
    --iron: #17110c;
    --iron-2: #1e160f;
    --ember: #ff6b35;
    --oxide: #c1272d;
    --molten: #ffb199;
    --ash: #a89a8e;
    --ash-dim: #6f645b;
    --paper: #f5ede6;
    --border: rgba(245,237,230,0.10);
    --border-soft: rgba(245,237,230,0.06);

    background: var(--void);
    color: var(--paper);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    position: relative;
    isolation: isolate;
    overflow-x: hidden;
    scroll-behavior: smooth;
    line-height: 1.5;
  }
  .rd-root * { box-sizing: border-box; }
  .rd-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

  .rd-root a { color: inherit; text-decoration: none; }
  .rd-root button { font-family: inherit; cursor: pointer; }
  .rd-root ::selection { background: rgba(255,107,53,0.35); color: var(--paper); }

  .rd-root :focus-visible {
    outline: 2px solid var(--ember);
    outline-offset: 3px;
    border-radius: 4px;
  }

  .rd-shell { max-width: 1180px; margin: 0 auto; padding: 0 24px; }

  /* -------------------------- ambient layers ------------------------- */
  .rd-grain {
    position: fixed;
    inset: 0;
    z-index: 50;
    pointer-events: none;
    opacity: 0.05;
    mix-blend-mode: overlay;
  }

  .rd-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    mix-blend-mode: screen;
    opacity: 0.5;
    z-index: 0;
  }
  .rd-blob-ember {
    background: radial-gradient(circle at 30% 30%, var(--ember), transparent 70%);
  }
  .rd-blob-oxide {
    background: radial-gradient(circle at 60% 60%, var(--oxide), transparent 70%);
  }
  @keyframes drift1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(40px, -30px) scale(1.08); }
  }
  @keyframes drift2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-50px, 40px) scale(1.05); }
  }

  .rd-grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(245,237,230,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(245,237,230,0.05) 1px, transparent 1px);
    background-size: 44px 44px;
    -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 20%, black 20%, transparent 75%);
    mask-image: radial-gradient(ellipse 70% 60% at 50% 20%, black 20%, transparent 75%);
    z-index: 0;
  }

  /* embers rising */
  .rd-ember-field { position: absolute; inset: 0; overflow: hidden; z-index: 1; pointer-events: none; }
  .rd-ember-spark {
    position: absolute;
    bottom: -10px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--molten);
    box-shadow: 0 0 8px 2px rgba(255,107,53,0.8);
    animation-name: rise;
    animation-timing-function: ease-in;
    animation-iteration-count: infinite;
    opacity: 0;
  }
  @keyframes rise {
    0% { transform: translateY(0) translateX(0); opacity: 0; }
    10% { opacity: 0.9; }
    90% { opacity: 0.4; }
    100% { transform: translateY(-420px) translateX(var(--drift, 20px)); opacity: 0; }
  }

  /* -------------------------------- nav -------------------------------- */
  .rd-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 40;
    border-bottom: 1px solid transparent;
    transition: background-color .3s ease, border-color .3s ease, backdrop-filter .3s ease;
  }
  .rd-nav.scrolled {
    background: rgba(10,7,4,0.72);
    backdrop-filter: blur(14px);
    border-bottom-color: var(--border);
  }
  .rd-nav-inner { display: flex; align-items: center; justify-content: space-between; height: 68px; }
  .rd-logo { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 17px; letter-spacing: -0.01em; }
  .rd-logo-dot {
    width: 9px; height: 9px; border-radius: 50%;
    background: linear-gradient(135deg, var(--ember), var(--oxide));
    box-shadow: 0 0 10px 2px rgba(255,107,53,0.55);
  }
  .rd-nav-links { display: flex; align-items: center; gap: 32px; }
  .rd-nav-link { font-size: 14px; color: var(--ash); transition: color .2s ease; }
  .rd-nav-link:hover { color: var(--paper); }
  .rd-nav-cta {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 14px; font-weight: 600; color: var(--paper);
    border: 1px solid var(--border); padding: 8px 14px; border-radius: 8px;
    transition: border-color .2s ease, background .2s ease;
  }
  .rd-nav-cta:hover { border-color: rgba(255,107,53,0.5); background: rgba(255,107,53,0.06); }
  .rd-nav-mobile-btn { display: none; }

  /* ------------------------------- buttons ------------------------------ */
  .rd-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    font-weight: 700; font-size: 15px; padding: 13px 24px; border-radius: 10px;
    border: 1px solid transparent; transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
    white-space: nowrap;
  }
  .rd-btn:active { transform: scale(0.97); }
  .rd-btn-primary {
    background: linear-gradient(135deg, var(--ember), var(--oxide));
    color: var(--void);
    box-shadow: 0 10px 30px -8px rgba(255,107,53,0.55);
  }
  .rd-btn-primary:hover { box-shadow: 0 14px 36px -6px rgba(255,107,53,0.75); transform: translateY(-1px); }
  .rd-btn-ghost {
    background: rgba(245,237,230,0.03);
    border-color: var(--border);
    color: var(--paper);
  }
  .rd-btn-ghost:hover { border-color: rgba(255,107,53,0.45); background: rgba(255,107,53,0.06); }

  /* -------------------------------- hero -------------------------------- */
  .rd-hero { position: relative; padding: 168px 0 120px; z-index: 1; }
  .rd-hero-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 56px; align-items: center; }
  .rd-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--molten);
    background: rgba(255,107,53,0.08);
    border: 1px solid rgba(255,107,53,0.22);
    padding: 6px 12px; border-radius: 999px;
    margin-bottom: 22px;
  }
  .rd-h1 {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: clamp(38px, 5.2vw, 62px);
    line-height: 1.06;
    letter-spacing: -0.02em;
    margin: 0 0 22px;
  }
  .rd-h1 .rd-grad {
    background: linear-gradient(100deg, var(--ember) 10%, var(--oxide) 55%, var(--molten) 90%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .rd-sub { font-size: 18px; color: var(--ash); max-width: 480px; margin: 0 0 36px; }
  .rd-hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; }

  /* terminal */
  .rd-term-wrap { position: relative; }
  .rd-term-glow {
    position: absolute; inset: -30px;
    background: radial-gradient(circle at 50% 40%, rgba(255,107,53,0.25), transparent 65%);
    filter: blur(30px);
    z-index: -1;
  }
  .rd-term {
    background: rgba(23,17,12,0.85);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    backdrop-filter: blur(10px);
    box-shadow: 0 30px 60px -20px rgba(0,0,0,0.6);
  }
  .rd-term-bar {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-soft);
  }
  .rd-term-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--ash-dim); opacity: 0.5; }
  .rd-term-title { margin-left: 8px; font-size: 12px; color: var(--ash-dim); }
  .rd-term-body {
    padding: 22px 20px;
    font-size: 13.5px;
    min-height: 260px;
  }
  .rd-term-line { display: flex; gap: 10px; margin-bottom: 10px; min-height: 18px; }
  .rd-term-prompt { color: var(--ember); flex-shrink: 0; }
  .rd-term-in { color: var(--paper); }
  .rd-term-out { color: var(--ash); padding-left: 20px; }
  .rd-cursor {
    display: inline-block; width: 7px; height: 15px; margin-left: 2px;
    background: var(--ember); vertical-align: -2px;
    animation: blink 1s step-end infinite;
  }
  @keyframes blink { 50% { opacity: 0; } }

  /* ---------------------------- reveal utility --------------------------- */
  .rd-reveal { opacity: 0; transform: translateY(26px); transition: opacity .7s cubic-bezier(.2,.7,.3,1), transform .7s cubic-bezier(.2,.7,.3,1); }
  .rd-reveal.rd-visible { opacity: 1; transform: translateY(0); }

  /* ------------------------------- sections ------------------------------ */
  .rd-section { position: relative; padding: 108px 0; z-index: 1; }
  .rd-section-head { max-width: 620px; margin: 0 0 56px; }
  .rd-kicker { font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ember); margin-bottom: 14px; }
  .rd-h2 { font-family: 'JetBrains Mono', monospace; font-size: clamp(28px, 3.4vw, 40px); font-weight: 700; letter-spacing: -0.01em; margin: 0 0 14px; }
  .rd-lead { font-size: 16.5px; color: var(--ash); margin: 0; }

  /* feature cards */
  .rd-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .rd-card {
    background: linear-gradient(180deg, rgba(245,237,230,0.035), rgba(245,237,230,0.015));
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 26px;
    transition: transform .3s ease, border-color .3s ease, background .3s ease;
  }
  .rd-card:hover { transform: translateY(-4px); border-color: rgba(255,107,53,0.35); background: linear-gradient(180deg, rgba(255,107,53,0.06), rgba(245,237,230,0.02)); }
  .rd-card-icon {
    width: 42px; height: 42px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,107,53,0.1);
    color: var(--ember);
    margin-bottom: 18px;
    transition: background .3s ease, transform .3s ease;
  }
  .rd-card:hover .rd-card-icon { background: linear-gradient(135deg, var(--ember), var(--oxide)); color: var(--void); transform: scale(1.06); }
  .rd-card h3 { font-size: 16.5px; font-weight: 700; margin: 0 0 8px; letter-spacing: -0.01em; }
  .rd-card p { font-size: 14.5px; color: var(--ash); margin: 0; line-height: 1.6; }

  /* getting started */
  .rd-steps { display: flex; flex-direction: column; gap: 0; }
  .rd-step { display: grid; grid-template-columns: 56px 1fr; gap: 20px; padding: 26px 0; border-top: 1px solid var(--border-soft); }
  .rd-step:last-child { border-bottom: 1px solid var(--border-soft); }
  .rd-step-num { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--ember); font-weight: 700; padding-top: 3px; }
  .rd-step h4 { margin: 0 0 6px; font-size: 16px; font-weight: 700; }
  .rd-step p { margin: 0 0 14px; font-size: 14.5px; color: var(--ash); max-width: 520px; }

  .rd-code {
    position: relative;
    background: var(--iron);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 46px 14px 16px;
    font-size: 13px;
    color: var(--molten);
    overflow-x: auto;
    white-space: pre;
  }
  .rd-copy-btn {
    position: absolute; top: 10px; right: 10px;
    width: 28px; height: 28px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(245,237,230,0.05);
    border: 1px solid var(--border);
    color: var(--ash);
    transition: color .2s ease, border-color .2s ease;
  }
  .rd-copy-btn:hover { color: var(--paper); border-color: rgba(255,107,53,0.4); }

  /* two column */
  .rd-split { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }

  .rd-mini-list { margin: 22px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 14px; }
  .rd-mini-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 14.5px; color: var(--ash); }
  .rd-mini-list svg { color: var(--ember); flex-shrink: 0; margin-top: 2px; }

  .rd-snippet {
    background: var(--iron);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
  }
  .rd-snippet-bar { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid var(--border-soft); }
  .rd-snippet-bar span { font-size: 12px; color: var(--ash-dim); }
  .rd-snippet pre { margin: 0; padding: 20px; font-size: 13px; line-height: 1.7; overflow-x: auto; }
  .tok-kw { color: var(--ember); }
  .tok-str { color: var(--molten); }
  .tok-fn { color: #9fd3c7; }
  .tok-cm { color: var(--ash-dim); font-style: italic; }
  .tok-punct { color: var(--ash); }

  /* command mapping */
  .rd-map { border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .rd-map-row { display: grid; grid-template-columns: 1fr 1fr; }
  .rd-map-row + .rd-map-row { border-top: 1px solid var(--border-soft); }
  .rd-map-row > div { padding: 18px 22px; font-size: 14px; }
  .rd-map-row > div:first-child { color: var(--ash); border-right: 1px solid var(--border-soft); }
  .rd-map-row > div:last-child { color: var(--molten); }
  .rd-map-head { background: rgba(245,237,230,0.03); }
  .rd-map-head > div { font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ash-dim) !important; }

  /* future ecosystem */
  .rd-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
  .rd-roadmap-card { border: 1px dashed var(--border); border-radius: 14px; padding: 22px; }
  .rd-pill {
    display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--molten); background: rgba(255,107,53,0.09); border: 1px solid rgba(255,107,53,0.2);
    padding: 4px 9px; border-radius: 999px; margin-bottom: 14px;
  }
  .rd-roadmap-card h3 { font-size: 15px; margin: 0 0 8px; font-weight: 700; }
  .rd-roadmap-card p { font-size: 13.5px; color: var(--ash); margin: 0; line-height: 1.55; }

  /* showcase */
  .rd-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
  .rd-use-card { display: flex; gap: 16px; padding: 24px; border: 1px solid var(--border); border-radius: 14px; }
  .rd-use-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(255,107,53,0.1); color: var(--ember); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .rd-use-card h3 { font-size: 15.5px; margin: 0 0 6px; font-weight: 700; }
  .rd-use-card p { font-size: 14px; color: var(--ash); margin: 0; line-height: 1.6; }

  /* final cta */
  .rd-cta-section { text-align: center; padding: 128px 0; position: relative; z-index: 1; }
  .rd-cta-section .rd-h2 { font-size: clamp(30px, 4.4vw, 48px); }
  .rd-cta-section .rd-lead { max-width: 480px; margin: 0 auto 40px; }
  .rd-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

  /* footer */
  .rd-footer { border-top: 1px solid var(--border-soft); padding: 40px 0; position: relative; z-index: 1; }
  .rd-footer-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
  .rd-footer-links { display: flex; gap: 24px; }
  .rd-footer-links a { font-size: 13.5px; color: var(--ash); display: inline-flex; align-items: center; gap: 4px; }
  .rd-footer-links a:hover { color: var(--paper); }
  .rd-footer-tag { font-size: 13px; color: var(--ash-dim); }

  /* -------------------------------- mobile -------------------------------- */
  @media (max-width: 860px) {
    .rd-hero-grid { grid-template-columns: 1fr; }
    .rd-split { grid-template-columns: 1fr; gap: 40px; }
    .rd-grid-3 { grid-template-columns: 1fr; }
    .rd-grid-4 { grid-template-columns: 1fr 1fr; }
    .rd-grid-2 { grid-template-columns: 1fr; }
    .rd-nav-links { display: none; }
    .rd-nav-mobile-btn { display: flex; }
    .rd-map-row { grid-template-columns: 1fr; }
    .rd-map-row > div:first-child { border-right: none; border-bottom: 1px solid var(--border-soft); }
    .rd-hero { padding: 128px 0 80px; }
    .rd-section { padding: 76px 0; }
  }
  @media (max-width: 560px) {
    .rd-grid-4 { grid-template-columns: 1fr; }
    .rd-shell { padding: 0 18px; }
  }

  .rd-mobile-menu {
    position: fixed; inset: 68px 0 0 0; z-index: 39;
    background: rgba(10,7,4,0.97);
    backdrop-filter: blur(16px);
    display: flex; flex-direction: column; gap: 4px; padding: 24px;
  }
  .rd-mobile-menu a { font-size: 17px; padding: 14px 4px; border-bottom: 1px solid var(--border-soft); color: var(--paper); }

  @media (prefers-reduced-motion: reduce) {
    .rd-root * { animation: none !important; transition: none !important; }
    .rd-reveal { opacity: 1 !important; transform: none !important; }
  }
`;

/* ------------------------------------------------------------------ */
/* Scroll-reveal hook                                                  */
/* ------------------------------------------------------------------ */
function useReveal(threshold = 0.18) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`rd-reveal ${visible ? "rd-visible" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Copy-to-clipboard button                                            */
/* ------------------------------------------------------------------ */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      /* clipboard unavailable — no-op */
    }
  };
  return (
    <button className="rd-copy-btn" onClick={onClick} aria-label="Copy command">
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Ambient background: aurora blobs + grid + rising embers + grain     */
/* ------------------------------------------------------------------ */
function AmbientLayer({ variant = "hero" }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        left: `${(i * 7.1 + 4) % 100}%`,
        duration: 6 + ((i * 3.7) % 6),
        delay: (i * 0.9) % 8,
        drift: `${(i % 2 === 0 ? 1 : -1) * (14 + (i * 5) % 30)}px`,
      })),
    []
  );

  return (
    <>
      {variant === "hero" && <div className="rd-grid-bg" aria-hidden="true" />}
      <div
        className="rd-blob rd-blob-ember"
        style={{ width: 480, height: 480, top: -120, left: "8%", animation: "drift1 16s ease-in-out infinite" }}
        aria-hidden="true"
      />
      <div
        className="rd-blob rd-blob-oxide"
        style={{ width: 420, height: 420, top: 40, right: "4%", animation: "drift2 19s ease-in-out infinite" }}
        aria-hidden="true"
      />
      <div className="rd-ember-field" aria-hidden="true">
        {sparks.map((s, i) => (
          <span
            key={i}
            className="rd-ember-spark"
            style={{
              left: s.left,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
              ["--drift"]: s.drift,
            }}
          />
        ))}
      </div>
    </>
  );
}

function GrainOverlay() {
  return (
    <svg className="rd-grain" aria-hidden="true">
      <filter id="rd-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#rd-noise)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Hero terminal — self-typing demo of the real set/get protocol       */
/* ------------------------------------------------------------------ */
const TERM_SCRIPT = [
  { type: "in", text: 'set session:9f2a active 300' },
  { type: "out", text: "set session:9f2a to active" },
  { type: "in", text: "get session:9f2a" },
  { type: "out", text: "active" },
  { type: "in", text: "set token:reset-4k9 valid 900" },
  { type: "out", text: "set token:reset-4k9 to valid" },
  { type: "in", text: "get token:reset-4k9" },
  { type: "out", text: "valid" },
];

function TerminalDemo() {
  const [displayed, setDisplayed] = useState(() => TERM_SCRIPT.map(() => ""));
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const reducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reducedMotion.current) {
      setDisplayed(TERM_SCRIPT.map((l) => l.text));
      return;
    }

    if (lineIdx >= TERM_SCRIPT.length) {
      const resetTimer = setTimeout(() => {
        setDisplayed(TERM_SCRIPT.map(() => ""));
        setLineIdx(0);
        setCharIdx(0);
      }, 3200);
      return () => clearTimeout(resetTimer);
    }

    const current = TERM_SCRIPT[lineIdx];
    if (charIdx <= current.text.length) {
      const t = setTimeout(() => {
        setDisplayed((prev) => {
          const next = [...prev];
          next[lineIdx] = current.text.slice(0, charIdx);
          return next;
        });
        setCharIdx((c) => c + 1);
      }, current.type === "in" ? 36 : 12);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(
        () => {
          setLineIdx((i) => i + 1);
          setCharIdx(0);
        },
        current.type === "in" ? 240 : 420
      );
      return () => clearTimeout(t);
    }
  }, [lineIdx, charIdx]);

  const activeLine = Math.min(lineIdx, TERM_SCRIPT.length - 1);

  return (
    <div className="rd-term-wrap">
      <div className="rd-term-glow" aria-hidden="true" />
      <div className="rd-term rd-mono" role="img" aria-label="Terminal showing a live redust-cli session">
        <div className="rd-term-bar">
          <span className="rd-term-dot" />
          <span className="rd-term-dot" />
          <span className="rd-term-dot" />
          <span className="rd-term-title">redust-cli — 127.0.0.1:8000</span>
        </div>
        <div className="rd-term-body">
          {TERM_SCRIPT.map((line, i) => {
            if (i > activeLine) return null;
            const text = displayed[i];
            const isActive = i === activeLine && lineIdx < TERM_SCRIPT.length;
            return (
              <div className="rd-term-line" key={i}>
                {line.type === "in" ? (
                  <>
                    <span className="rd-term-prompt">&gt;</span>
                    <span className="rd-term-in">
                      {text}
                      {isActive && <span className="rd-cursor" />}
                    </span>
                  </>
                ) : (
                  <span className="rd-term-out">
                    {text}
                    {isActive && <span className="rd-cursor" />}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Nav                                                                  */
/* ------------------------------------------------------------------ */
const NAV_LINKS = [
  { href: "#why", label: "Why Redust" },
  { href: "#start", label: "Getting Started" },
  { href: "#sdk", label: "Node SDK" },
  { href: "#ecosystem", label: "Ecosystem" },
];

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(href.slice(1));
  };

  return (
    <>
      <header className={`rd-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="rd-shell rd-nav-inner">
          <a href="#top" className="rd-logo" onClick={(e) => go(e, "#top")}>
            <span className="rd-logo-dot" />
            <span className="rd-mono">redust</span>
          </a>
          <nav className="rd-nav-links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="rd-nav-link" onClick={(e) => go(e, l.href)}>
                {l.label}
              </a>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rd-nav-cta"
              style={{ display: "none" }}
            />
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="rd-nav-cta">
              <Github size={15} />
              GitHub
            </a>
            <button
              className="rd-nav-mobile-btn rd-btn-ghost"
              style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 8, background: "transparent", color: "var(--paper)" }}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>
      {open && (
        <div className="rd-mobile-menu">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)}>
              {l.label}
            </a>
          ))}
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            GitHub ↗
          </a>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section id="top" className="rd-hero">
      <AmbientLayer variant="hero" />
      <div className="rd-shell rd-hero-grid">
        <div>
          <div className="rd-eyebrow rd-reveal rd-visible">
            <Zap size={13} />
            IN-MEMORY DATASTORE, WRITTEN IN RUST
          </div>
          <h1 className="rd-h1 rd-reveal rd-visible" style={{ transitionDelay: "80ms" }}>
            Redis-familiar.
            <br />
            <span className="rd-grad">Rust-fast.</span>
          </h1>
          <p className="rd-sub rd-reveal rd-visible" style={{ transitionDelay: "160ms" }}>
            Redust is an in-memory key-value store with the commands you already know
            and expiring keys built in. Point your app at it and start setting keys in minutes.
          </p>
          <div className="rd-hero-ctas rd-reveal rd-visible" style={{ transitionDelay: "240ms" }}>
            <button className="rd-btn rd-btn-primary" onClick={() => scrollToId("start")}>
              Get Started <ArrowRight size={17} />
            </button>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="rd-btn rd-btn-ghost">
              <Github size={17} /> View on GitHub
            </a>
          </div>
        </div>
        <Reveal delay={120}>
          <TerminalDemo />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Why Redust                                                          */
/* ------------------------------------------------------------------ */
const FEATURES = [
  { icon: Zap, title: "In-memory speed", body: "Reads and writes happen in memory, so your application never waits on disk." },
  { icon: Terminal, title: "Redis-familiar commands", body: "SET and GET work the way you already expect. No new mental model to pick up." },
  { icon: Timer, title: "Built-in expiry", body: "Give any key a TTL and Redust clears it out on its own. No cron jobs, no manual cleanup." },
  { icon: Cpu, title: "A protocol you can read", body: "Redust speaks a plain, line-based protocol over TCP — inspectable from a terminal, not just an SDK." },
  { icon: Code, title: "Typed Node.js SDK", body: "A small TypeScript client with the same set, get, and execute you'd expect, and full type safety." },
  { icon: Package, title: "Lightweight footprint", body: "One small Rust binary. Nothing to provision, wrangle, or configure before your first request." },
];

function WhyRedust() {
  return (
    <section id="why" className="rd-section">
      <div className="rd-shell">
        <Reveal>
          <div className="rd-section-head">
            <div className="rd-kicker">Why Redust</div>
            <h2 className="rd-h2">Built for the moments that can't wait</h2>
            <p className="rd-lead">
              Redust keeps the parts of Redis you actually reach for every day, and skips the parts you don't.
            </p>
          </div>
        </Reveal>
        <div className="rd-grid-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 70}>
              <div className="rd-card">
                <div className="rd-card-icon">
                  <f.icon size={19} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Getting Started                                                     */
/* ------------------------------------------------------------------ */
const STEPS = [
  {
    num: "01",
    title: "Clone the repository",
    body: "Grab the source and step into the project directory.",
    code: `${CLONE_CMD}\ncd redust`,
  },
  {
    num: "02",
    title: "Build and run",
    body: "Redust starts listening on 127.0.0.1:8000 by default.",
    code: "cargo run --release",
  },
  {
    num: "03",
    title: "Connect with the CLI",
    body: "Use the bundled client to start setting and getting keys right away.",
    code: "cargo run --bin redust-cli -- 127.0.0.1 8000",
  },
];

function GettingStarted() {
  return (
    <section id="start" className="rd-section">
      <div className="rd-shell rd-split">
        <div>
          <Reveal>
            <div className="rd-kicker">Getting Started</div>
            <h2 className="rd-h2">Running in three commands</h2>
            <p className="rd-lead">No config files to write before your first set. Clone it, run it, connect to it.</p>
          </Reveal>
        </div>
        <div className="rd-steps">
          {STEPS.map((s, i) => (
            <Reveal key={s.num} delay={i * 90} className="rd-step" as="div">
              <div className="rd-step-num rd-mono">{s.num}</div>
              <div>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
                <div className="rd-code rd-mono">
                  {s.code}
                  <CopyButton text={s.code} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Node SDK                                                            */
/* ------------------------------------------------------------------ */
const QUICK_START = `import { Redust } from "redust-node";

const db = new Redust("127.0.0.1", 8000);

await db.set({
  key: "session:42",
  value: "active",
  ttl: { seconds: 300 },
});

const value = await db.get("session:42");`;

function NodeSDK() {
  return (
    <section id="sdk" className="rd-section">
      <div className="rd-shell rd-split">
        <div>
          <Reveal>
            <div className="rd-kicker">Node.js SDK</div>
            <h2 className="rd-h2">A typed client, install-ready</h2>
            <p className="rd-lead">Connect, set, and get without hand-rolling a socket client.</p>
            <div className="rd-code rd-mono" style={{ marginTop: 26 }}>
              {SDK_INSTALL}
              <CopyButton text={SDK_INSTALL} />
            </div>
            <ul className="rd-mini-list">
              <li>
                <Check size={16} /> Keys default to a one-year TTL if you don't set one — plenty of room to add expiry later.
              </li>
              <li>
                <Check size={16} /> Need raw control? <code className="rd-mono">client.execute()</code> sends any command straight through.
              </li>
              <li>
                <Check size={16} /> Written in TypeScript, so your editor knows the shape of every response.
              </li>
            </ul>
          </Reveal>
        </div>
        <Reveal delay={100}>
          <div className="rd-snippet">
            <div className="rd-snippet-bar">
              <span className="rd-mono">quickstart.ts</span>
              <CopyButton text={QUICK_START} />
            </div>
            <pre className="rd-mono">
              <code>
                <span className="tok-kw">import</span> <span className="tok-punct">{"{ "}</span>
                <span className="tok-fn">Redust</span>
                <span className="tok-punct">{" }"}</span> <span className="tok-kw">from</span>{" "}
                <span className="tok-str">"redust-node"</span>
                {"\n\n"}
                <span className="tok-kw">const</span> db = <span className="tok-kw">new</span>{" "}
                <span className="tok-fn">Redust</span>(<span className="tok-str">"127.0.0.1"</span>,{" "}
                8000)
                {"\n\n"}
                <span className="tok-kw">await</span> db.<span className="tok-fn">set</span>({"{"}
                {"\n"}
                {"  "}key: <span className="tok-str">"session:42"</span>,{"\n"}
                {"  "}value: <span className="tok-str">"active"</span>,{"\n"}
                {"  "}ttl: {"{ "}seconds: 300 {"}"},{"\n"}
                {"}"});
                {"\n\n"}
                <span className="tok-kw">const</span> value = <span className="tok-kw">await</span>{" "}
                db.<span className="tok-fn">get</span>(<span className="tok-str">"session:42"</span>);
              </code>
            </pre>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Developer Experience — command mapping                              */
/* ------------------------------------------------------------------ */
const COMMAND_MAP = [
  { known: "Set a key to a value", redust: "set key value" },
  { known: "Set a key that expires in 5 minutes", redust: "set key value 300" },
  { known: "Read a key back", redust: "get key" },
  { known: "Send any raw command from the SDK", redust: 'client.execute("...")' },
];

function DevExperience() {
  return (
    <section className="rd-section">
      <div className="rd-shell">
        <Reveal>
          <div className="rd-section-head">
            <div className="rd-kicker">Developer Experience</div>
            <h2 className="rd-h2">Nothing new to memorize</h2>
            <p className="rd-lead">If you've used Redis, you already know how to use Redust.</p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="rd-map">
            <div className="rd-map-row rd-map-head">
              <div>What you want to do</div>
              <div>What you type</div>
            </div>
            {COMMAND_MAP.map((row) => (
              <div className="rd-map-row" key={row.known}>
                <div>{row.known}</div>
                <div className="rd-mono">{row.redust}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Future Ecosystem                                                    */
/* ------------------------------------------------------------------ */
const ROADMAP = [
  { title: "Python SDK", body: "A typed client for Python that mirrors the Node SDK's set, get, and execute." },
  { title: "Go SDK", body: "A native client for Go services that need to talk to Redust directly." },
  { title: "Optional persistence", body: "Snapshotting so state can survive a restart, without giving up in-memory speed." },
  { title: "Managed hosting", body: "A hosted Redust for teams who'd rather not run and patch their own instance." },
];

function FutureEcosystem() {
  return (
    <section id="ecosystem" className="rd-section">
      <div className="rd-shell">
        <Reveal>
          <div className="rd-section-head">
            <div className="rd-kicker">Future Ecosystem</div>
            <h2 className="rd-h2">What's on the roadmap</h2>
            <p className="rd-lead">Concepts we're exploring next — not shipped yet, but the direction we're headed.</p>
          </div>
        </Reveal>
        <div className="rd-grid-4">
          {ROADMAP.map((r, i) => (
            <Reveal key={r.title} delay={i * 70}>
              <div className="rd-roadmap-card">
                <span className="rd-pill">Planned</span>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Showcase                                                             */
/* ------------------------------------------------------------------ */
const USE_CASES = [
  { icon: KeyRound, title: "Session storage", body: "Keep users signed in without a database round-trip. Set a session key with a TTL and let it expire on its own." },
  { icon: RefreshCw, title: "Caching layer", body: "Cache expensive lookups or API responses. Decide how long a value stays fresh, and let Redust handle the rest." },
  { icon: Gauge, title: "Rate-limit windows", body: "Track short-lived counters and flags to throttle requests without standing up extra infrastructure." },
  { icon: Ticket, title: "One-time tokens", body: "Password resets, magic links, invite codes — anything that should only be valid for a few minutes." },
];

function Showcase() {
  return (
    <section className="rd-section">
      <div className="rd-shell">
        <Reveal>
          <div className="rd-section-head">
            <div className="rd-kicker">Showcase</div>
            <h2 className="rd-h2">Where Redust fits</h2>
            <p className="rd-lead">Anywhere your data is short-lived and speed actually matters.</p>
          </div>
        </Reveal>
        <div className="rd-grid-2">
          {USE_CASES.map((u, i) => (
            <Reveal key={u.title} delay={i * 70}>
              <div className="rd-use-card">
                <div className="rd-use-icon">
                  <u.icon size={18} />
                </div>
                <div>
                  <h3>{u.title}</h3>
                  <p>{u.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Final CTA                                                            */
/* ------------------------------------------------------------------ */
function FinalCTA() {
  return (
    <section className="rd-cta-section">
      <AmbientLayer variant="cta" />
      <div className="rd-shell">
        <Reveal>
          <div className="rd-kicker" style={{ justifyContent: "center", display: "flex" }}>
            Get Started
          </div>
          <h2 className="rd-h2">Plug Redust into your next project.</h2>
          <p className="rd-lead">Clone the server, install the SDK, and start setting keys in minutes.</p>
          <div className="rd-cta-btns">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="rd-btn rd-btn-primary">
              <Github size={17} /> View on GitHub
            </a>
            <a href={SDK_URL} target="_blank" rel="noopener noreferrer" className="rd-btn rd-btn-ghost">
              Get the Node SDK <ArrowUpRight size={17} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="rd-footer">
      <div className="rd-shell rd-footer-inner">
        <div className="rd-logo">
          <span className="rd-logo-dot" />
          <span className="rd-mono">redust</span>
          <span className="rd-footer-tag" style={{ marginLeft: 10 }}>
            An in-memory datastore, built in Rust.
          </span>
        </div>
        <div className="rd-footer-links">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub <ChevronRight size={13} />
          </a>
          <a href={SDK_URL} target="_blank" rel="noopener noreferrer">
            Node SDK <ChevronRight size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Root                                                                 */
/* ------------------------------------------------------------------ */
export function RedustLanding() {
  return (
    <div className="rd-root">
      <style>{CSS}</style>
      <GrainOverlay />
      <Nav />
      <main>
        <Hero />
        <WhyRedust />
        <GettingStarted />
        <NodeSDK />
        <DevExperience />
        <FutureEcosystem />
        <Showcase />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

const App = () => {
  return (
    <RedustLanding/>
  )
}

export default App;