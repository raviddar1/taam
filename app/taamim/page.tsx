'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export default function TaanimPage() {
  useEffect(() => {
    if (sessionStorage.getItem('darkMode') === '1') {
      document.body.classList.add('dark')
    }
  }, [])

  return (
    <>
      {/* preload page script so it downloads in parallel with p5.min.js */}
      <link rel="preload" href="/scripts/taamim.js" as="script" />
      <style>{`
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #fff; font-family: 'TheBasics', sans-serif; }
    /* ---- נאב-בר ---- */
    .navbar { position: fixed; top: 0; left: 0; right: 0; height: 74px; background: transparent; z-index: 10000; display: flex; direction: rtl; align-items: center; justify-content: center; gap: 92px; }
    .nav-logo-sq { position: absolute; right: calc(35/1920*100vw); top: 50%; transform: translateY(-50%); width: 30px; height: 30px; background: #000; display: block; }
    .nav-link { font-family: 'TheBasics', sans-serif; font-size: 20px; color: #343434; text-decoration: none; white-space: nowrap; }
    .nav-link.active { color: #FF179C; border-bottom: 1px solid currentColor; padding-bottom: 0px; font-weight: 600; }

    .nav-aodot { position: absolute; right: calc(48/1920*100vw); top: 50%; transform: translateY(-30%); border-bottom: none !important; }
    .nav-aodot img          { height: 16px; width: auto; display: none; }
    .nav-aodot .logo-light  { display: block; }
    body.dark .nav-aodot .logo-light { display: none; }
    body.dark .nav-aodot .logo-dark  { display: block; }
    
    
    
    .page-nav-btn { background:none; border:none; cursor:pointer; color:#e91e8c; font-size:21px; padding:2px 4px; line-height:1; }

    /* ---- קנבס ---- */
    #wrap {
      display: none;
      position: fixed; top: 0; left: 0;
    }

    /* ---- פאנל צבעי פאדים ---- */
    #color-toggle {
      position: fixed; bottom: 32px; right: 32px; z-index: 10;
      font-family: 'TheBasics', serif; font-size: 15px; color: #343434;
      background: transparent; border: 1.5px solid #000; border-radius: 50px;
      padding: 7px 18px; cursor: pointer; white-space: nowrap;
    }
    #color-panel {
      display: none;
      position: fixed; bottom: 80px; right: 32px; z-index: 20;
      background: #fff; border: 1.5px solid #000; border-radius: 12px;
      padding: 16px 20px; min-width: 260px;
      font-family: 'TheBasics', serif;
      box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    }
    #color-panel.open { display: block; }
    #color-panel h3 { font-size: 14px; font-weight: 400; margin-bottom: 14px; text-align: right; }
    .pad-row {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 10px;
    }
    .pad-label {
      font-size: 13px; min-width: 90px; text-align: right; direction: rtl;
    }
    .swatches { display: flex; gap: 6px; }
    .swatch {
      width: 22px; height: 22px; border-radius: 50%; cursor: pointer;
      border: 2px solid transparent; transition: transform 0.1s;
      flex-shrink: 0;
    }
    .swatch:hover { transform: scale(1.2); }
    .swatch.selected { border-color: #343434; transform: scale(1.15); }

    /* ---- מצב בודד — פאנל ---- */
    #solo-info {
      display: none;
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none; z-index: 5;
    }
    #solo-info.active { display: block; }

    #solo-name {
      position: absolute;
      right: calc(146/1920*100vw + 50px);
      top: calc(750/1080*100vh);
      white-space: nowrap;
      font-size: clamp(80px, 8vw, 150px);
      font-family: 'TheBasics', sans-serif;
      color: #343434; text-align: right; direction: rtl;
      line-height: 1;
    }
    #solo-func {
      position: absolute;
      right: calc(1131/1920*100vw + 65px);
      top: calc(220/1080*100vh);
      width: clamp(210px, 19vw, 360px);
      font-size: 17px;
      font-family: 'TheBasics', sans-serif;
      color: #343434; line-height: 1.25; text-align: right; direction: rtl;
    }
    #solo-interp {
      position: absolute;
      right: calc(166/1920*100vw + 50px);
      top: calc(220/1080*100vh);
      font-size: 17px;
      font-family: 'TheBasics', sans-serif;
      color: #343434; line-height: 1.55; text-align: right; direction: rtl;
    }
    #solo-symbol-visual {
      position: absolute;
      right: calc(1131/1920*100vw + 65px);
      top: 50%;
      display: flex; flex-direction: column;
      align-items: center; gap: 9px;
      transform: translateY(-50%) scale(0.75);
      transform-origin: top right;
    }
    .sym-dot  { width:14px; height:14px; background:#000; border-radius:50%; }
    .sym-dash { width:3px; height:22px; background:#000; border-radius:2px; transform:rotate(15deg); }
    .sym-arc  { width:28px; height:14px; border-bottom:3px solid #000; border-radius:0 0 50% 50%; }

    /* ---- בוחר מסורת ---- */
    #tradition-wrap {
      display: none;
      position: fixed; bottom: 60px; left: 2vw; z-index: 60;
      font-family: 'TheBasics', sans-serif;
      flex-direction: column; align-items: center; gap: 14px;
    }
    #tradition-wrap.visible { display: flex; }
    #trad-col { display: flex; flex-direction: column; align-items: center; gap: 14px; }
    #trad-list { display:flex; flex-direction:column; gap:13px; text-align:right; direction:rtl; min-width: max-content; }
    .trad-item { font-size:22px; color:#343434; cursor:pointer; pointer-events:all; font-family:'TheBasics', sans-serif; padding:3px 0; }
    .trad-item.active { color: #FF179C; border-bottom: 1px solid currentColor; padding-bottom: 0px; align-self: flex-start; font-weight: 600; }
    .trad-arrow { background:none; border:none; cursor:pointer; color:#e91e8c; padding:0; pointer-events:all; display:flex; align-items:center; justify-content:center; }

    #ipus-btn {
      background: none; border: 0.5px solid #ccc; border-radius: 16px; cursor: pointer; padding: 4px 14px;
      font-family: 'TheBasics', sans-serif; font-size: 17px; color: #aaa;
      text-align: center; pointer-events: all;
      transition: color 0.15s, border-color 0.15s;
      position: fixed; bottom: 168px; left: 50%; transform: translateX(-50%);
    }
    #ipus-btn:hover, #ipus-btn.seq-active { color: #343434; border-color: #343434; }


    /* ---- מצב embed ---- */
    body.embed .navbar,
    body.embed #tradition-wrap,
    body.embed #solo-info,
    body.embed #color-toggle,
    body.embed #color-panel,
    body.embed #vol-faders { display: none !important; }

    /* ---- פדרי עוצמה ---- */
    #vol-faders {
      position: fixed; bottom: 28px; right: 23px; z-index: 60;
      display: flex; flex-direction: row; align-items: flex-end; gap: 8px;
    }
    .vol-fader {
      width: 29px; height: 150px;
      position: relative; top: -10px; cursor: pointer; user-select: none; touch-action: none;
    }
    .vol-fader-track {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      border: 1px solid #343434; border-radius: 10px; background: transparent;
    }
    body.dark .vol-fader-track { border-color: #fff; }
    .vol-fader-thumb {
      position: absolute; left: 6px; right: 6px; height: 37px;
      background: #bbb; border-radius: 8px; pointer-events: none;
    }
    .vol-fader-label {
      text-align: center; font-family: 'TheBasics', sans-serif;
      font-size: 16px; color: #343434; margin-top: 6px;
    }
    body.dark .vol-fader-label { color: #fff; }

    /* ---- דארק מוד ---- */
    body.dark { background: #131111; }
    body.dark .nav-link:not(.active) { color: #fff; }
    body.dark .nav-logo-sq { background: #fff; }
    body.dark .trad-item:not(.active) { color: #fff; }
    body.dark #ipus-btn { color: #555; border-color: #555; }
    body.dark #ipus-btn.seq-active { color: #fff; border-color: #fff; }

    .nav-spria { right: calc(520/1920*100vw); }
    body.dark #solo-name,
    body.dark #solo-func,
    body.dark #solo-interp { color: #fff; }
    body.dark #solo-symbol-visual img { filter: invert(1); }
    body.dark .mini-label { color: #fff; }

    /* ---- מיקרו אנימציות חיצים ---- */
    @keyframes _afl { 0%{transform:none;opacity:1} 35%{transform:translateX(-16px) scale(1.6);opacity:0.15} 100%{transform:none;opacity:1} }
    @keyframes _afr { 0%{transform:none;opacity:1} 35%{transform:translateX(16px)  scale(1.6);opacity:0.15} 100%{transform:none;opacity:1} }
    @keyframes _afu { 0%{transform:none;opacity:1} 35%{transform:translateY(-16px) scale(1.6);opacity:0.15} 100%{transform:none;opacity:1} }
    @keyframes _afd { 0%{transform:none;opacity:1} 35%{transform:translateY(16px)  scale(1.6);opacity:0.15} 100%{transform:none;opacity:1} }
    .arrow-flash-left  { animation:_afl .55s ease-out; }
    .arrow-flash-right { animation:_afr .55s ease-out; }
    .arrow-flash-up    { animation:_afu .55s ease-out; }
    .arrow-flash-down  { animation:_afd .55s ease-out; }

    /* ---- אוברליי טעינה ---- */
    #loading-overlay {
      position: fixed; top: 64px; left: 0; right: 0; bottom: 0; z-index: 9999;
      background: #fff;
      display: flex; align-items: center; justify-content: center;
      transition: opacity 0.45s ease;
    }
    #loading-overlay.dark { background: #131111; }
    #loading-overlay.out  { opacity: 0; pointer-events: none; }

    /* ---- גריד פדים (idle) ---- */
    #pad-grid-overlay {
      position: fixed; top: 64px; left: 0; right: 0; bottom: 0; z-index: 55;
      background: #fff;
      display: flex; align-items: center; justify-content: center;
      transition: opacity 0.4s ease;
    }
    body.dark #pad-grid-overlay { background: #131111; }
    #pad-grid-label {
      position: absolute;
      top: 28px;
      left: 50%; transform: translateX(-50%);
      font-family: 'TheBasics', sans-serif;
      font-weight: 400;
      font-size: 20px;
      color: #343434;
      white-space: nowrap;
      direction: rtl;
    }
    body.dark #pad-grid-label { color: #fff; }
    body.dark #pad-grid-overlay { background: #131111; }
    #pad-grid-overlay.out { opacity: 0; pointer-events: none; }
    body.embed #pad-grid-overlay { display: none !important; }
    #pad-preview-container canvas { display: block; }
    #seq-hint {
      position: fixed; top: 82px; left: 50%; transform: translateX(-50%);
      font-family: 'TheBasics', sans-serif; font-weight: 400; font-size: 20px;
      color: #343434; direction: rtl; text-align: center; line-height: 1.7;
      display: none; pointer-events: none;
    }
    body.dark #seq-hint { color: #fff; }

    /* ---- חיצי ניווט טעמים ---- */
    #solo-nav { display:flex; position:absolute; right: calc(35/1920*100vw); top:50%; transform:translateY(-50%); align-items:center; gap:2px; }
    .solo-nav-btn { background:none; border:none; cursor:pointer; color:#e91e8c; font-size:21px; padding:2px 4px; line-height:1; }
      `}</style>


  
  <div id="loading-overlay">
    <canvas id="loading-canvas" width="200" height="70" />
  </div>
<nav className="navbar">
    <button className="page-nav-btn" id="pnav-next"><svg width="9" height="15" viewBox="0 0 9 15" fill="none"><polyline points="1.5,1.5 7.5,7.5 1.5,13.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"/></svg></button>
    <a href="/taamim" className="nav-link nav-taamim" id="nav-taamim">טעמים</a>
    <a href="/psukkim" className="nav-link nav-psukkim">פסוקים</a>
    <a href="/taamim?seq" className="nav-link nav-rzf" id="nav-rzf">נגינה</a>
    <a href="/library" className="nav-link nav-info">גלריה</a>
    <button className="page-nav-btn" id="pnav-prev"><svg width="9" height="15" viewBox="0 0 9 15" fill="none"><polyline points="7.5,1.5 1.5,7.5 7.5,13.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"/></svg></button>
    <a href="/" className="nav-link nav-aodot"><img src="/logolight.png?v=2" className="logo-light" alt="אודות" /><img src="/logodark.png?v=2" className="logo-dark" alt="אודות" /></a>
  </nav>
  <div id="page-nav">
  </div>

  <div id="wrap"></div>

  
  <div id="solo-info">
    <div id="solo-name"></div>
    <div id="solo-symbol-visual"></div>
    <div id="solo-func"></div>
    <div id="solo-interp"></div>
  </div>

  <div id="seq-hint">[לחצו על הטעמים במקלדת כדי לנגן.<br />לחצו על <svg width="9" height="15" viewBox="0 0 9 15" fill="none" style={{verticalAlign: "-4px", margin: "0 2px"}}><polyline points="7.5,1.5 1.5,7.5 7.5,13.5" stroke="#FF179C" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"/></svg> כדי לשמור בגלריה]</div>

  
  <div id="pad-grid-overlay">
    <div id="pad-grid-label">[בחרו טעם בריבועים במקלדת, החליפו נוסחים בחיצים]</div>
    <div id="pad-preview-container"></div>
  </div>
  <div id="tradition-wrap">
    <button id="ipus-btn">נקה</button>
    <div id="trad-col">
      <div id="trad-list">
        <div className="trad-item" data-trad="מרוקאי">מרוקאי</div>
        <div className="trad-item active" data-trad="ספרדי">ספרדי</div>
        <div className="trad-item" data-trad="אשכנזי">אשכנזי</div>
      </div>
      <button className="trad-arrow" id="trad-down"><svg width="15" height="9" viewBox="0 0 15 9" fill="none"><polyline points="1.5,1.5 7.5,7.5 13.5,1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"/></svg></button>
    </div>
  </div>

  <div id="vol-faders">
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      <div className="vol-fader" id="fader-L"><div className="vol-fader-track"></div><div className="vol-fader-thumb" id="thumb-L"></div></div>
      <div className="vol-fader-label">תופים</div>
    </div>
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      <div className="vol-fader" id="fader-R"><div className="vol-fader-track"></div><div className="vol-fader-thumb" id="thumb-R"></div></div>
      <div className="vol-fader-label">חזן</div>
    </div>
  </div>

  <div id="color-panel" style={{display: "none"}}>
    <h3>צבעי נוריות פאדים</h3>
  </div>



      <Script
        src="/p5.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          const s = document.createElement('script')
          s.src = '/scripts/taamim.js'
          document.body.appendChild(s)
        }}
      />
    </>
  )
}
