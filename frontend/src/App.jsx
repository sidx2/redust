import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from "react";

import {
  TbBrandGithub as Github,
  TbTerminal2 as Terminal,
  TbBolt as Zap,
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
  TbLayersIntersect as Layers,
  TbShieldCheck as ShieldCheck,
  TbPuzzle as Puzzle,
  TbLink as Link2,
  TbPlayerPlay as Play,
  TbCloudUpload as UploadCloud,
  TbCloudDownload as DownloadCloud,
  TbRadio as Radio,
  TbTools as Wrench,
  TbRocket as Rocket,
  TbBook as BookOpen,
  TbCompass as Compass,
  TbStopwatch as Timer,
} from "react-icons/tb";


/* ====================================================================
   REDUST — multi-page site (Home / Getting Started / SDKs / Use Cases / Docs)

   ARCHITECTURE NOTE FOR WIRING UP YOUR ROUTER
   ---------------------------------------------------------------------
   Routing is intentionally NOT implemented here. Each page component
   (HomePage, GettingStartedPage, SDKsPage, UseCasesPage, DocsPage) renders
   only its own content — no nav, footer, or stylesheet — so they drop
   cleanly into a layout route.

   <SiteLayout> provides the shared chrome (stylesheet, top nav, footer,
   ambient background) and expects a `current` page id plus an `onNavigate`
   handler. With React Router this maps directly onto a layout route:

     <Route element={<SiteLayout current={...} onNavigate={...} />}>
       <Route index element={<HomePage onNavigate={...} />} />
       <Route path="getting-started" element={<GettingStartedPage />} />
       <Route path="sdks" element={<SDKsPage />} />
       <Route path="use-cases" element={<UseCasesPage onNavigate={...} />} />
       <Route path="docs" element={<DocsPage onNavigate={...} />} />
     </Route>

   Swap `current`/`onNavigate` for `useLocation()`/`useNavigate()`, and
   swap the plain <a> tags in TopNav/Footer for your router's <Link>.

   The default export (RedustSite) is a self-contained preview shell that
   fakes routing with local state, purely so this renders as one live
   artifact — it is not meant to ship as-is.
   ==================================================================== */

const GITHUB_URL = "https://github.com/sidx2/redust";
const SDK_URL = "https://github.com/sidx2/redust-node";
const SDK_INSTALL = "npm install https://github.com/sidx2/redust-node";
const CLONE_CMD = "git clone https://github.com/sidx2/redust";

/* ------------------------------------------------------------------ */
/* Design tokens — same "forge" system as the rest of the site:        */
/* REDust = REDis + rUST. Warm near-black ground, ember/oxide accent.  */
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
  .rd-root :focus-visible { outline: 2px solid var(--ember); outline-offset: 3px; border-radius: 4px; }

  .rd-shell { max-width: 1180px; margin: 0 auto; padding: 0 24px; }

  /* -------------------------- ambient layers ------------------------- */
  .rd-grain { position: fixed; inset: 0; z-index: 50; pointer-events: none; opacity: 0.05; mix-blend-mode: overlay; }

  .rd-blob { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; mix-blend-mode: screen; opacity: 0.5; z-index: 0; }
  .rd-blob-ember { background: radial-gradient(circle at 30% 30%, var(--ember), transparent 70%); }
  .rd-blob-oxide { background: radial-gradient(circle at 60% 60%, var(--oxide), transparent 70%); }
  @keyframes drift1 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,-30px) scale(1.08); } }
  @keyframes drift2 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-50px,40px) scale(1.05); } }

  .rd-grid-bg {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(245,237,230,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,237,230,0.05) 1px, transparent 1px);
    background-size: 44px 44px;
    -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 20%, black 20%, transparent 75%);
    mask-image: radial-gradient(ellipse 70% 60% at 50% 20%, black 20%, transparent 75%);
    z-index: 0;
  }

  .rd-ember-field { position: absolute; inset: 0; overflow: hidden; z-index: 1; pointer-events: none; }
  .rd-ember-spark {
    position: absolute; bottom: -10px; width: 4px; height: 4px; border-radius: 50%;
    background: var(--molten); box-shadow: 0 0 8px 2px rgba(255,107,53,0.8);
    animation-name: rise; animation-timing-function: ease-in; animation-iteration-count: infinite; opacity: 0;
  }
  @keyframes rise {
    0% { transform: translateY(0) translateX(0); opacity: 0; }
    10% { opacity: 0.9; } 90% { opacity: 0.4; }
    100% { transform: translateY(-420px) translateX(var(--drift, 20px)); opacity: 0; }
  }

  /* -------------------------------- nav -------------------------------- */
  .rd-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 40; border-bottom: 1px solid transparent; transition: background-color .3s ease, border-color .3s ease, backdrop-filter .3s ease; }
  .rd-nav.scrolled { background: rgba(10,7,4,0.72); backdrop-filter: blur(14px); border-bottom-color: var(--border); }
  .rd-nav-inner { display: flex; align-items: center; justify-content: space-between; height: 68px; }
  .rd-logo { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 17px; letter-spacing: -0.01em; }
  .rd-logo-dot { width: 9px; height: 9px; border-radius: 50%; background: linear-gradient(135deg, var(--ember), var(--oxide)); box-shadow: 0 0 10px 2px rgba(255,107,53,0.55); }
  .rd-nav-links { display: flex; align-items: center; gap: 30px; }
  .rd-nav-link { position: relative; font-size: 14px; color: var(--ash); transition: color .2s ease; padding-bottom: 4px; }
  .rd-nav-link:hover { color: var(--paper); }
  .rd-nav-link.active { color: var(--paper); }
  .rd-nav-link.active::after { content: ''; position: absolute; left: 0; right: 0; bottom: -23px; height: 2px; background: linear-gradient(90deg, var(--ember), var(--oxide)); }
  .rd-nav-cta { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: var(--paper); border: 1px solid var(--border); padding: 8px 14px; border-radius: 8px; transition: border-color .2s ease, background .2s ease; }
  .rd-nav-cta:hover { border-color: rgba(255,107,53,0.5); background: rgba(255,107,53,0.06); }
  .rd-nav-mobile-btn { display: none; }

  /* ------------------------------- buttons ------------------------------ */
  .rd-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700; font-size: 15px; padding: 13px 24px; border-radius: 10px; border: 1px solid transparent; transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease; white-space: nowrap; }
  .rd-btn:active { transform: scale(0.97); }
  .rd-btn-primary { background: linear-gradient(135deg, var(--ember), var(--oxide)); color: var(--void); box-shadow: 0 10px 30px -8px rgba(255,107,53,0.55); }
  .rd-btn-primary:hover { box-shadow: 0 14px 36px -6px rgba(255,107,53,0.75); transform: translateY(-1px); }
  .rd-btn-ghost { background: rgba(245,237,230,0.03); border-color: var(--border); color: var(--paper); }
  .rd-btn-ghost:hover { border-color: rgba(255,107,53,0.45); background: rgba(255,107,53,0.06); }

  /* -------------------------------- hero -------------------------------- */
  .rd-hero { position: relative; padding: 168px 0 116px; z-index: 1; }
  .rd-hero-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 56px; align-items: center; }
  .rd-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--molten); background: rgba(255,107,53,0.08); border: 1px solid rgba(255,107,53,0.22); padding: 6px 12px; border-radius: 999px; margin-bottom: 22px; }
  .rd-h1 { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(38px, 5.2vw, 62px); line-height: 1.06; letter-spacing: -0.02em; margin: 0 0 22px; }
  .rd-h1 .rd-grad { background: linear-gradient(100deg, var(--ember) 10%, var(--oxide) 55%, var(--molten) 90%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .rd-sub { font-size: 18px; color: var(--ash); max-width: 480px; margin: 0 0 36px; }
  .rd-hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; }

  /* terminal */
  .rd-term-wrap { position: relative; }
  .rd-term-glow { position: absolute; inset: -30px; background: radial-gradient(circle at 50% 40%, rgba(255,107,53,0.25), transparent 65%); filter: blur(30px); z-index: -1; }
  .rd-term { background: rgba(23,17,12,0.85); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; backdrop-filter: blur(10px); box-shadow: 0 30px 60px -20px rgba(0,0,0,0.6); }
  .rd-term-bar { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-bottom: 1px solid var(--border-soft); }
  .rd-term-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--ash-dim); opacity: 0.5; }
  .rd-term-title { margin-left: 8px; font-size: 12px; color: var(--ash-dim); }
  .rd-term-body { padding: 22px 20px; font-size: 13.5px; min-height: 260px; }
  .rd-term.compact .rd-term-body { min-height: 0; padding: 16px 18px; }
  .rd-term-line { display: flex; gap: 10px; margin-bottom: 10px; min-height: 18px; }
  .rd-term-prompt { color: var(--ember); flex-shrink: 0; }
  .rd-term-in { color: var(--paper); }
  .rd-term-out { color: var(--ash); padding-left: 20px; }
  .rd-cursor { display: inline-block; width: 7px; height: 15px; margin-left: 2px; background: var(--ember); vertical-align: -2px; animation: blink 1s step-end infinite; }
  @keyframes blink { 50% { opacity: 0; } }

  /* ---------------------------- reveal utility --------------------------- */
  .rd-reveal { opacity: 0; transform: translateY(26px); transition: opacity .7s cubic-bezier(.2,.7,.3,1), transform .7s cubic-bezier(.2,.7,.3,1); }
  .rd-reveal.rd-visible { opacity: 1; transform: translateY(0); }

  /* ------------------------------- sections ------------------------------ */
  .rd-section { position: relative; padding: 100px 0; z-index: 1; }
  .rd-section-head { max-width: 620px; margin: 0 0 52px; }
  .rd-section-head.rd-center { margin-left: auto; margin-right: auto; text-align: center; }
  .rd-kicker { font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ember); margin-bottom: 14px; }
  .rd-h2 { font-family: 'JetBrains Mono', monospace; font-size: clamp(26px, 3.2vw, 38px); font-weight: 700; letter-spacing: -0.01em; margin: 0 0 14px; }
  .rd-lead { font-size: 16.5px; color: var(--ash); margin: 0; }
  .rd-subhead { font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ash-dim); margin: 0 0 18px; }

  .rd-page-header { position: relative; padding: 150px 0 60px; z-index: 1; text-align: center; }

  /* feature cards */
  .rd-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .rd-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
  .rd-card { background: linear-gradient(180deg, rgba(245,237,230,0.035), rgba(245,237,230,0.015)); border: 1px solid var(--border); border-radius: 14px; padding: 26px; transition: transform .3s ease, border-color .3s ease, background .3s ease; }
  .rd-card:hover { transform: translateY(-4px); border-color: rgba(255,107,53,0.35); background: linear-gradient(180deg, rgba(255,107,53,0.06), rgba(245,237,230,0.02)); }
  .rd-card-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: rgba(255,107,53,0.1); color: var(--ember); margin-bottom: 18px; transition: background .3s ease, transform .3s ease; flex-shrink: 0; }
  .rd-card:hover .rd-card-icon { background: linear-gradient(135deg, var(--ember), var(--oxide)); color: var(--void); transform: scale(1.06); }
  .rd-card h3 { font-size: 16.5px; font-weight: 700; margin: 0 0 8px; letter-spacing: -0.01em; }
  .rd-card p { font-size: 14.5px; color: var(--ash); margin: 0; line-height: 1.6; }

  .rd-use-card { display: flex; gap: 16px; padding: 24px; border: 1px solid var(--border); border-radius: 14px; }
  .rd-use-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(255,107,53,0.1); color: var(--ember); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .rd-use-card h3 { font-size: 15.5px; margin: 0 0 6px; font-weight: 700; }
  .rd-use-card p { font-size: 14px; color: var(--ash); margin: 0; line-height: 1.6; }

  /* highlight band */
  .rd-highlight-band { display: grid; grid-template-columns: repeat(4,1fr); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .rd-highlight-item { padding: 28px 24px; }
  .rd-highlight-item + .rd-highlight-item { border-left: 1px solid var(--border-soft); }
  .rd-highlight-item h3 { font-size: 15px; margin: 0 0 6px; font-weight: 700; }
  .rd-highlight-item p { font-size: 13.5px; color: var(--ash); margin: 0; line-height: 1.5; }

  /* code + copy */
  .rd-code { position: relative; background: var(--iron); border: 1px solid var(--border); border-radius: 10px; padding: 14px 46px 14px 16px; font-size: 13px; color: var(--molten); overflow-x: auto; white-space: pre; }
  .rd-copy-btn { position: absolute; top: 10px; right: 10px; width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; background: rgba(245,237,230,0.05); border: 1px solid var(--border); color: var(--ash); transition: color .2s ease, border-color .2s ease; }
  .rd-copy-btn:hover { color: var(--paper); border-color: rgba(255,107,53,0.4); }

  .rd-split { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }
  .rd-mini-list { margin: 22px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 14px; }
  .rd-mini-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 14.5px; color: var(--ash); }
  .rd-mini-list svg { color: var(--ember); flex-shrink: 0; margin-top: 2px; }

  .rd-snippet { background: var(--iron); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .rd-snippet-bar { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid var(--border-soft); }
  .rd-snippet-bar span { font-size: 12px; color: var(--ash-dim); }
  .rd-snippet pre { margin: 0; padding: 20px; font-size: 13px; line-height: 1.7; overflow-x: auto; }
  .tok-kw { color: var(--ember); } .tok-str { color: var(--molten); } .tok-fn { color: #9fd3c7; } .tok-punct { color: var(--ash); }

  /* workflow grid */
  .rd-workflow-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; }
  .rd-workflow-card { border: 1px solid var(--border); border-radius: 14px; padding: 24px; }
  .rd-workflow-card h4 { margin: 0 0 6px; font-size: 15.5px; font-weight: 700; }
  .rd-workflow-card p { margin: 0 0 16px; font-size: 13.5px; color: var(--ash); line-height: 1.55; }

  /* sdk tabs */
  .rd-tabs-wrap { overflow-x: auto; -ms-overflow-style: none; scrollbar-width: none; margin-bottom: 44px; }
  .rd-tabs-wrap::-webkit-scrollbar { display: none; }
  .rd-tabs { position: relative; display: flex; gap: 2px; border-bottom: 1px solid var(--border-soft); width: max-content; min-width: 100%; }
  .rd-tab { display: flex; align-items: center; gap: 8px; padding: 12px 16px; font-size: 13.5px; font-weight: 600; color: var(--ash); background: transparent; border: none; white-space: nowrap; transition: color .2s ease; }
  .rd-tab.active { color: var(--paper); }
  .rd-tab-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ash-dim); }
  .rd-tab-dot.live { background: var(--ember); box-shadow: 0 0 6px 1px rgba(255,107,53,.7); }
  .rd-tab-indicator { position: absolute; bottom: -1px; height: 2px; background: linear-gradient(90deg, var(--ember), var(--oxide)); transition: transform .32s cubic-bezier(.3,.7,.3,1), width .32s cubic-bezier(.3,.7,.3,1); left: 0; }

  @keyframes panelIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
  .rd-tab-panel { animation: panelIn .45s ease; }

  .rd-coming-card { border: 1px dashed var(--border); border-radius: 16px; padding: 34px; min-height: 220px; display: flex; flex-direction: column; max-width: 640px; margin: 0 auto; }
  .rd-coming-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .rd-pill { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--molten); background: rgba(255,107,53,0.09); border: 1px solid rgba(255,107,53,0.2); padding: 4px 9px; border-radius: 999px; }
  .rd-pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ember); position: relative; }
  .rd-pulse-dot::after { content: ''; position: absolute; inset: -6px; border-radius: 50%; border: 1px solid var(--ember); animation: pulseRing 2s ease-out infinite; }
  @keyframes pulseRing { 0% { transform: scale(.4); opacity: .9; } 100% { transform: scale(1.8); opacity: 0; } }
  .rd-coming-card h3 { font-size: 19px; margin: 0 0 10px; font-family: 'JetBrains Mono', monospace; }
  .rd-coming-card p { font-size: 14px; color: var(--ash); margin: 0 0 20px; line-height: 1.6; }
  .rd-ghost-code { margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border-soft); font-size: 12.5px; color: var(--ash-dim); opacity: .75; }
  .rd-ghost-label { display: block; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--ash-dim); margin-top: 8px; opacity: .6; }

  /* docs cards */
  .rd-docs-card { border: 1px solid var(--border); border-radius: 14px; padding: 24px; display: flex; align-items: flex-start; gap: 14px; background: transparent; font: inherit; color: inherit; text-align: left; width: 100%; }
  .rd-docs-card.clickable { transition: transform .25s ease, border-color .25s ease; }
  .rd-docs-card.clickable:hover { transform: translateY(-3px); border-color: rgba(255,107,53,.35); }
  .rd-docs-card h3 { font-size: 15px; margin: 0 0 6px; font-weight: 700; }
  .rd-docs-card p { font-size: 13.5px; color: var(--ash); margin: 0; line-height: 1.55; }
  .rd-docs-arrow { margin-left: auto; color: var(--ash-dim); flex-shrink: 0; transition: transform .25s ease, color .25s ease; }
  .rd-docs-card.clickable:hover .rd-docs-arrow { color: var(--ember); transform: translate(3px,-3px); }

  /* final cta */
  .rd-cta-section { text-align: center; padding: 126px 0; position: relative; z-index: 1; }
  .rd-cta-section .rd-h2 { font-size: clamp(28px, 4vw, 44px); }
  .rd-cta-section .rd-lead { max-width: 480px; margin: 0 auto 40px; }
  .rd-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

  /* footer */
  .rd-footer { border-top: 1px solid var(--border-soft); padding: 52px 0; position: relative; z-index: 1; }
  .rd-footer-inner { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 40px; }
  .rd-footer-tag { font-size: 13px; color: var(--ash-dim); }
  .rd-footer-cols { display: flex; gap: 56px; }
  .rd-footer-cols a { display: block; font-size: 13.5px; color: var(--ash); padding: 5px 0; }
  .rd-footer-cols a:hover { color: var(--paper); }
  .rd-footer-col-title { font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--ash-dim); margin-bottom: 10px; font-weight: 700; }

  /* -------------------------------- mobile -------------------------------- */
  @media (max-width: 860px) {
    .rd-hero-grid { grid-template-columns: 1fr; }
    .rd-split { grid-template-columns: 1fr; gap: 40px; }
    .rd-grid-3 { grid-template-columns: 1fr; }
    .rd-grid-2 { grid-template-columns: 1fr; }
    .rd-highlight-band { grid-template-columns: 1fr 1fr; }
    .rd-highlight-item:nth-child(odd) { border-left: none; }
    .rd-highlight-item:nth-child(n+3) { border-top: 1px solid var(--border-soft); }
    .rd-workflow-grid { grid-template-columns: 1fr; }
    .rd-nav-links { display: none; }
    .rd-nav-mobile-btn { display: flex; }
    .rd-hero { padding: 128px 0 76px; }
    .rd-section { padding: 72px 0; }
    .rd-page-header { padding: 128px 0 48px; }
  }
  @media (max-width: 560px) {
    .rd-highlight-band { grid-template-columns: 1fr; }
    .rd-highlight-item { border-left: none !important; border-top: 1px solid var(--border-soft); }
    .rd-highlight-item:first-child { border-top: none; }
    .rd-shell { padding: 0 18px; }
    .rd-footer-cols { gap: 32px; }
  }

  .rd-mobile-menu { position: fixed; inset: 68px 0 0 0; z-index: 39; background: rgba(10,7,4,0.97); backdrop-filter: blur(16px); display: flex; flex-direction: column; gap: 4px; padding: 24px; }
  .rd-mobile-menu a { font-size: 17px; padding: 14px 4px; border-bottom: 1px solid var(--border-soft); color: var(--paper); }

  @media (prefers-reduced-motion: reduce) {
    .rd-root * { animation: none !important; transition: none !important; }
    .rd-reveal { opacity: 1 !important; transform: none !important; }
  }
`;

/* ==================================================================== */
/* Hooks + tiny shared utilities                                        */
/* ==================================================================== */
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

function AmbientLayer({ variant = "section" }) {
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
      <div className="rd-blob rd-blob-ember" style={{ width: 480, height: 480, top: -120, left: "8%", animation: "drift1 16s ease-in-out infinite" }} aria-hidden="true" />
      <div className="rd-blob rd-blob-oxide" style={{ width: 420, height: 420, top: 40, right: "4%", animation: "drift2 19s ease-in-out infinite" }} aria-hidden="true" />
      <div className="rd-ember-field" aria-hidden="true">
        {sparks.map((s, i) => (
          <span key={i} className="rd-ember-spark" style={{ left: s.left, animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s`, ["--drift"]: s.drift }} />
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

/* ==================================================================== */
/* Shared components: SectionHeading, PageHeader, FeatureCard, CodeBlock */
/* ==================================================================== */
function SectionHeading({ kicker, title, lead, center = false }) {
  return (
    <div className={`rd-section-head ${center ? "rd-center" : ""}`}>
      <div className="rd-kicker">{kicker}</div>
      <h2 className="rd-h2">{title}</h2>
      {lead && <p className="rd-lead">{lead}</p>}
    </div>
  );
}

function PageHeader({ kicker, title, lead }) {
  return (
    <section className="rd-page-header">
      <AmbientLayer variant="page" />
      <div className="rd-shell">
        <Reveal>
          <div className="rd-kicker" style={{ justifyContent: "center", display: "flex" }}>
            {kicker}
          </div>
          <h1 className="rd-h1" style={{ fontSize: "clamp(30px,4.6vw,46px)" }}>
            {title}
          </h1>
          {lead && (
            <p className="rd-lead" style={{ maxWidth: 560, margin: "0 auto" }}>
              {lead}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, body }) {
  return (
    <div className="rd-card">
      <div className="rd-card-icon">
        <Icon size={19} />
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

function CodeBlock({ code }) {
  return (
    <div className="rd-code rd-mono">
      {code}
      <CopyButton text={code} />
    </div>
  );
}

/* ==================================================================== */
/* TerminalCard — self-typing (or static) terminal, shared component     */
/* ==================================================================== */
function TerminalCard({ script, animated = true, title = "redust-cli — 127.0.0.1:8000", compact = false }) {
  const [displayed, setDisplayed] = useState(() => script.map((l) => (animated ? "" : l.text)));
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const reducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (!animated || reducedMotion.current) {
      setDisplayed(script.map((l) => l.text));
      return;
    }
    if (lineIdx >= script.length) {
      const resetTimer = setTimeout(() => {
        setDisplayed(script.map(() => ""));
        setLineIdx(0);
        setCharIdx(0);
      }, 3200);
      return () => clearTimeout(resetTimer);
    }
    const current = script[lineIdx];
    if (charIdx <= current.text.length) {
      const t = setTimeout(
        () => {
          setDisplayed((prev) => {
            const next = [...prev];
            next[lineIdx] = current.text.slice(0, charIdx);
            return next;
          });
          setCharIdx((c) => c + 1);
        },
        current.type === "in" ? 36 : 12
      );
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
  }, [lineIdx, charIdx, animated, script]);

  const activeLine = Math.min(lineIdx, script.length - 1);

  return (
    <div className="rd-term-wrap">
      <div className="rd-term-glow" aria-hidden="true" />
      <div className={`rd-term rd-mono ${compact ? "compact" : ""}`} role="img" aria-label="Terminal showing a redust-cli session">
        <div className="rd-term-bar">
          <span className="rd-term-dot" />
          <span className="rd-term-dot" />
          <span className="rd-term-dot" />
          <span className="rd-term-title">{title}</span>
        </div>
        <div className="rd-term-body">
          {script.map((line, i) => {
            if (animated && i > activeLine) return null;
            const text = displayed[i];
            const isActive = animated && i === activeLine && lineIdx < script.length;
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

const HERO_SCRIPT = [
  { type: "in", text: "set session:9f2a active 300" },
  { type: "out", text: "set session:9f2a to active" },
  { type: "in", text: "get session:9f2a" },
  { type: "out", text: "active" },
  { type: "in", text: "set token:reset-4k9 valid 900" },
  { type: "out", text: "set token:reset-4k9 to valid" },
  { type: "in", text: "get token:reset-4k9" },
  { type: "out", text: "valid" },
];

/* ==================================================================== */
/* ComingSoonCard — for SDK languages not shipped yet                    */
/* ==================================================================== */
function ComingSoonCard({ label, blurb, snippet }) {
  return (
    <div className="rd-coming-card">
      <div className="rd-coming-top">
        <span className="rd-pill">Coming Soon</span>
        <span className="rd-pulse-dot" aria-hidden="true" />
      </div>
      <h3>{label} SDK</h3>
      <p>{blurb}</p>
      {snippet && (
        <div className="rd-ghost-code rd-mono">
          {snippet}
          <span className="rd-ghost-label">Illustrative syntax — subject to change</span>
        </div>
      )}
    </div>
  );
}

/* ==================================================================== */
/* SDKTabs — sliding-indicator tab bar                                   */
/* ==================================================================== */
function SDKTabs({ sdks, active, onChange }) {
  const containerRef = useRef(null);
  const tabRefs = useRef([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = tabRefs.current[active];
    const container = containerRef.current;
    if (el && container) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [active, sdks.length]);

  return (
    <div className="rd-tabs-wrap">
      <div className="rd-tabs" ref={containerRef}>
        {sdks.map((s, i) => (
          <button
            key={s.id}
            ref={(node) => (tabRefs.current[i] = node)}
            className={`rd-tab ${active === i ? "active" : ""}`}
            onClick={() => onChange(i)}
            aria-selected={active === i}
          >
            <span className={`rd-tab-dot ${s.status === "available" ? "live" : ""}`} />
            {s.label}
          </button>
        ))}
        <span className="rd-tab-indicator" style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }} />
      </div>
    </div>
  );
}

/* ==================================================================== */
/* TopNav + Footer (shared chrome, used by SiteLayout)                   */
/* ==================================================================== */
const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/" },
  { id: "getting-started", label: "Getting Started", href: "/getting-started" },
  { id: "sdks", label: "SDKs", href: "/sdks" },
  { id: "use-cases", label: "Use Cases", href: "/use-cases" },
  { id: "docs", label: "Docs", href: "/docs" },
];

function TopNav({ current, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => (e) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(id);
    }
    setOpen(false);
  };

  return (
    <>
      <header className={`rd-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="rd-shell rd-nav-inner">
          <a href="/" className="rd-logo" onClick={go("home")}>
            <span className="rd-logo-dot" />
            <span className="rd-mono">redust</span>
          </a>
          <nav className="rd-nav-links" aria-label="Primary">
            {NAV_ITEMS.map((l) => (
              <a key={l.id} href={l.href} className={`rd-nav-link ${current === l.id ? "active" : ""}`} onClick={go(l.id)}>
                {l.label}
              </a>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="rd-nav-cta">
              <Github size={15} />
              GitHub
            </a>
            <button
              className="rd-nav-mobile-btn"
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
          {NAV_ITEMS.map((l) => (
            <a key={l.id} href={l.href} onClick={go(l.id)}>
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

function Footer({ onNavigate }) {
  const go = (id) => (e) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(id);
    }
  };
  return (
    <footer className="rd-footer">
      <div className="rd-shell rd-footer-inner">
        <div>
          <div className="rd-logo">
            <span className="rd-logo-dot" />
            <span className="rd-mono">redust</span>
          </div>
          <p className="rd-footer-tag" style={{ marginTop: 8, maxWidth: 260 }}>
            An in-memory datastore, built in Rust.
          </p>
        </div>
        <div className="rd-footer-cols">
          <div>
            <div className="rd-footer-col-title">Site</div>
            {NAV_ITEMS.map((l) => (
              <a key={l.id} href={l.href} onClick={go(l.id)}>
                {l.label}
              </a>
            ))}
          </div>
          <div>
            <div className="rd-footer-col-title">Project</div>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            <a href={SDK_URL} target="_blank" rel="noopener noreferrer">
              Node SDK ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SiteLayout({ current, onNavigate, children }) {
  return (
    <div className="rd-root">
      <style>{CSS}</style>
      <GrainOverlay />
      <TopNav current={current} onNavigate={onNavigate} />
      <main key={current}>{children}</main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

/* ==================================================================== */
/* PAGE: Home                                                            */
/* ==================================================================== */
function HeroSection({ onNavigate }) {
  return (
    <section className="rd-hero">
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
            <button className="rd-btn rd-btn-primary" onClick={() => onNavigate && onNavigate("getting-started")}>
              Get Started <ArrowRight size={17} />
            </button>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="rd-btn rd-btn-ghost">
              <Github size={17} /> View on GitHub
            </a>
          </div>
        </div>
        <Reveal delay={120}>
          <TerminalCard script={HERO_SCRIPT} animated />
        </Reveal>
      </div>
    </section>
  );
}

const KEY_BENEFITS = [
  { icon: Zap, title: "Fast data access", body: "Reads and writes happen in memory, so your application never waits on disk." },
  { icon: Terminal, title: "Familiar workflows", body: "SET and GET work the way you already expect from Redis. No new mental model." },
  { icon: Package, title: "Easy adoption", body: "One small binary and a typed SDK. Nothing to provision before your first request." },
  { icon: Code, title: "Developer-friendly experience", body: "A plain text protocol and a typed client — inspectable, scriptable, and easy to debug." },
  { icon: Cpu, title: "Modern infrastructure", body: "Built in Rust for services that need predictable, low-overhead performance." },
];

const HIGHLIGHTS = [
  { icon: Gauge, title: "Performance", body: "In-memory reads and writes." },
  { icon: Layers, title: "Simplicity", body: "Two commands to learn: set and get." },
  { icon: ShieldCheck, title: "Reliability", body: "Keys expire exactly when you tell them to." },
  { icon: Puzzle, title: "Ease of integration", body: "One connection, one typed client." },
];

function HomePage({ onNavigate }) {
  return (
    <>
      <HeroSection onNavigate={onNavigate} />

      <section className="rd-section">
        <div className="rd-shell">
          <Reveal>
            <SectionHeading kicker="Why Redust" title="Built for the moments that can't wait" lead="Redust keeps the parts of Redis you reach for every day, and skips the parts you don't." />
          </Reveal>
          <div className="rd-grid-3">
            {KEY_BENEFITS.map((f, i) => (
              <Reveal key={f.title} delay={i * 60}>
                <FeatureCard icon={f.icon} title={f.title} body={f.body} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="rd-section" style={{ paddingTop: 0 }}>
        <div className="rd-shell">
          <Reveal>
            <div className="rd-subhead">Product Highlights</div>
          </Reveal>
          <Reveal delay={60}>
            <div className="rd-highlight-band">
              {HIGHLIGHTS.map((h) => (
                <div className="rd-highlight-item" key={h.title}>
                  <div className="rd-card-icon">
                    <h.icon size={18} />
                  </div>
                  <h3>{h.title}</h3>
                  <p>{h.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

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
              <button className="rd-btn rd-btn-primary" onClick={() => onNavigate && onNavigate("getting-started")}>
                Get Started <ArrowRight size={17} />
              </button>
              <button className="rd-btn rd-btn-ghost" onClick={() => onNavigate && onNavigate("sdks")}>
                Browse SDKs
              </button>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="rd-btn rd-btn-ghost">
                <Github size={17} /> GitHub
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ==================================================================== */
/* PAGE: Getting Started                                                 */
/* ==================================================================== */
const WORKFLOW = [
  { icon: Play, title: "Start the server", body: "Boots Redust and listens on 127.0.0.1:8000.", code: "cargo run --bin redust_server --release" },
  { icon: Link2, title: "Connect a client", body: "Use the bundled CLI, or point the Node SDK at the same host and port.", code: "cargo run --bin redust_cli -- 127.0.0.1 8000" },
  { icon: UploadCloud, title: "Store data", body: "Set a key, optionally with a TTL in seconds.", code: "> set session:9f2a active 300\nset session:9f2a to active" },
  { icon: DownloadCloud, title: "Retrieve data", body: "Read it back by key.", code: "> get session:9f2a\nactive" },
];

function GettingStartedPage() {
  return (
    <>
      <PageHeader kicker="Getting Started" title="From clone to your first GET" lead="No config files to write before your first set." />
      <section className="rd-section" style={{ paddingTop: 0 }}>
        <div className="rd-shell">
          <Reveal>
            <div className="rd-subhead">Installation</div>
          </Reveal>
          <Reveal delay={40} style={{ marginBottom: 60 }}>
            <CodeBlock code={`${CLONE_CMD}\ncd redust`} />
          </Reveal>

          <Reveal>
            <div className="rd-subhead">Running Redust</div>
            <p className="rd-lead" style={{ marginBottom: 20 }}>
              Redust listens on 127.0.0.1:8000 by default.
            </p>
          </Reveal>
          <Reveal delay={40} style={{ marginBottom: 64 }}>
            <CodeBlock code="cargo run --release" />
          </Reveal>

          <Reveal>
            <div className="rd-subhead">Basic Workflow</div>
          </Reveal>
          <div className="rd-workflow-grid">
            {WORKFLOW.map((w, i) => (
              <Reveal key={w.title} delay={i * 70}>
                <div className="rd-workflow-card">
                  <div className="rd-card-icon">
                    <w.icon size={18} />
                  </div>
                  <h4>{w.title}</h4>
                  <p>{w.body}</p>
                  <CodeBlock code={w.code} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ==================================================================== */
/* PAGE: SDKs                                                            */
/* ==================================================================== */
const QUICK_START = `import { Redust } from "redust-node";

const db = new Redust("127.0.0.1", 8000);

await db.set({
  key: "session:42",
  value: "active",
  ttl: { seconds: 300 },
});

const value = await db.get("session:42");`;

const NODE_FEATURES = [
  { icon: Puzzle, title: "Easy integration", body: "One import, one connection. No socket handling to write yourself." },
  { icon: Terminal, title: "Familiar API", body: "set, get, and a raw execute() for anything else — same shape as the CLI." },
  { icon: Zap, title: "Fast onboarding", body: "Written in TypeScript, so your editor knows the shape of every response." },
];

function NodePanel() {
  return (
    <div className="rd-split">
      <div>
        <div className="rd-code rd-mono" style={{ marginBottom: 26 }}>
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
      </div>
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
            <span className="tok-fn">Redust</span>(<span className="tok-str">"127.0.0.1"</span>, 8000)
            {"\n\n"}
            <span className="tok-kw">await</span> db.<span className="tok-fn">set</span>({"{"}
            {"\n"}
            {"  "}key: <span className="tok-str">"session:42"</span>,{"\n"}
            {"  "}value: <span className="tok-str">"active"</span>,{"\n"}
            {"  "}ttl: {"{ "}seconds: 300 {"}"},{"\n"}
            {"}"});
            {"\n\n"}
            <span className="tok-kw">const</span> value = <span className="tok-kw">await</span> db.
            <span className="tok-fn">get</span>(<span className="tok-str">"session:42"</span>);
          </code>
        </pre>
      </div>
      <div className="rd-grid-3" style={{ gridColumn: "1 / -1", marginTop: 12 }}>
        {NODE_FEATURES.map((f) => (
          <FeatureCard key={f.title} icon={f.icon} title={f.title} body={f.body} />
        ))}
      </div>
    </div>
  );
}

const SDKS = [
  { id: "node", label: "Node.js", status: "available" },
  { id: "python", label: "Python", status: "soon", blurb: "For scripts, notebooks, and pipelines that want a fast, ephemeral store without extra infrastructure.", snippet: 'db.get("session:42")' },
  { id: "go", label: "Go", status: "soon", blurb: "A native client for services that are already comfortable talking straight over TCP.", snippet: 'db.Get("session:42")' },
  { id: "rust", label: "Rust", status: "soon", blurb: "A client written in the same language as Redust itself, for zero-overhead access.", snippet: 'db.get("session:42")' },
  { id: "java", label: "Java", status: "soon", blurb: "For JVM services and existing Spring stacks that need a lightweight cache client.", snippet: 'db.get("session:42")' },
  { id: "csharp", label: "C#", status: "soon", blurb: "For .NET services that want Redust as a drop-in cache without extra ceremony.", snippet: 'db.Get("session:42")' },
  { id: "cpp", label: "C/C++", status: "soon", blurb: "A low-level client for systems software where every allocation counts.", snippet: 'db.get("session:42")' },
  { id: "zig", label: "Zig", status: "soon", blurb: "For teams building close to the metal who want the same guarantees Redust runs on.", snippet: 'db.get("session:42")' },
  { id: "php", label: "PHP", status: "soon", blurb: "For web backends that want request-scoped caching without a heavyweight dependency.", snippet: '$db->get("session:42")' },
];

function SDKsPage() {
  const [active, setActive] = useState(0);
  const current = SDKS[active];
  return (
    <>
      <PageHeader kicker="SDKs" title="One protocol, every language you reach for" lead="Official clients for the languages developers actually ship in." />
      <section className="rd-section" style={{ paddingTop: 0 }}>
        <div className="rd-shell">
          <SDKTabs sdks={SDKS} active={active} onChange={setActive} />
          <div className="rd-tab-panel" key={current.id}>
            {current.status === "available" ? (
              <NodePanel />
            ) : (
              <ComingSoonCard label={current.label} blurb={current.blurb} snippet={current.snippet} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/* ==================================================================== */
/* PAGE: Use Cases                                                       */
/* ==================================================================== */
const USE_CASES = [
  { icon: Radio, title: "Real-time applications", body: "State that needs to update the moment something happens — presence flags, live counters, in-progress status." },
  { icon: KeyRound, title: "Session storage", body: "Keep users signed in without a database round-trip. Set a session key with a TTL and let it expire on its own." },
  { icon: RefreshCw, title: "Caching", body: "Cache expensive lookups or API responses. Decide how long a value stays fresh, and let Redust handle the rest." },
  { icon: Gauge, title: "High-performance services", body: "Any service where a database round-trip is the bottleneck. Keep hot data in memory and skip the wait." },
  { icon: Wrench, title: "Developer tooling", body: "Local dev servers, test fixtures, and internal scripts that want a fast store without standing up infrastructure." },
  { icon: Rocket, title: "API acceleration", body: "Cache responses from slow or rate-limited upstream APIs, with a TTL that matches how fresh the data needs to be." },
];

function UseCasesPage({ onNavigate }) {
  return (
    <>
      <PageHeader kicker="Use Cases" title="Where Redust fits" lead="Anywhere your data is short-lived and speed actually matters." />
      <section className="rd-section" style={{ paddingTop: 0 }}>
        <div className="rd-shell">
          <div className="rd-grid-2">
            {USE_CASES.map((u, i) => (
              <Reveal key={u.title} delay={i * 60}>
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
          <Reveal delay={80}>
            <div style={{ textAlign: "center", marginTop: 64 }}>
              <button className="rd-btn rd-btn-primary" onClick={() => onNavigate && onNavigate("getting-started")}>
                Get Started <ArrowRight size={17} />
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ==================================================================== */
/* PAGE: Docs                                                            */
/* ==================================================================== */
const DOCS_START_HERE = [
  { icon: Rocket, title: "Getting Started", body: "Clone the repo, run the server, and make your first call.", to: "getting-started" },
  { icon: Code, title: "SDKs", body: "Install the Node.js client and see what's next for other languages.", to: "sdks" },
  { icon: Compass, title: "Use Cases", body: "See where Redust fits — caching, sessions, and more.", to: "use-cases" },
];

const DOCS_TOPICS = [
  { icon: Terminal, title: "The set/get protocol", body: "How commands are structured, and what a response looks like." },
  { icon: Timer, title: "Working with TTL", body: "How expiry works, and how to choose a TTL for your data." },
  { icon: BookOpen, title: "Choosing a client", body: "When to use the CLI, the Node SDK, or a raw TCP connection." },
];

function DocsPage({ onNavigate }) {
  return (
    <>
      <PageHeader kicker="Documentation" title="Everything you need to build with Redust" lead="Not a full manual yet — just the fastest way to find what you need." />
      <section className="rd-section" style={{ paddingTop: 0 }}>
        <div className="rd-shell">
          <Reveal>
            <div className="rd-subhead">Start here</div>
          </Reveal>
          <div className="rd-grid-3" style={{ marginBottom: 64 }}>
            {DOCS_START_HERE.map((c, i) => (
              <Reveal key={c.title} delay={i * 60}>
                <button className="rd-docs-card clickable" onClick={() => onNavigate && onNavigate(c.to)}>
                  <div className="rd-card-icon">
                    <c.icon size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3>{c.title}</h3>
                    <p>{c.body}</p>
                  </div>
                  <ArrowUpRight size={16} className="rd-docs-arrow" />
                </button>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="rd-subhead">Popular topics</div>
          </Reveal>
          <div className="rd-grid-3">
            {DOCS_TOPICS.map((c, i) => (
              <Reveal key={c.title} delay={i * 60}>
                <div className="rd-docs-card">
                  <div className="rd-card-icon">
                    <c.icon size={18} />
                  </div>
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ==================================================================== */
/* Default export — live preview shell (fakes routing with local state)  */
/* ==================================================================== */
export default function RedustSite() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "getting-started":
        return <GettingStartedPage />;
      case "sdks":
        return <SDKsPage />;
      case "use-cases":
        return <UseCasesPage onNavigate={setPage} />;
      case "docs":
        return <DocsPage onNavigate={setPage} />;
      default:
        return <HomePage onNavigate={setPage} />;
    }
  };

  return (
    <SiteLayout current={page} onNavigate={setPage}>
      {renderPage()}
    </SiteLayout>
  );
}

export { SiteLayout, HomePage, GettingStartedPage, SDKsPage, UseCasesPage, DocsPage, TopNav, Footer, SectionHeading, PageHeader, FeatureCard, CodeBlock, TerminalCard, ComingSoonCard, SDKTabs };