'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export default function LibraryPage() {
  useEffect(() => {
    if (sessionStorage.getItem('darkMode') === '1') {
      document.body.classList.add('dark')
    }
  }, [])

  return (
    <>
      <style>{`
        body { background: #fff; font-family: 'TheBasics', sans-serif; overflow: hidden; }
        body.dark { background: #131111; }
        body.dark .nav-link:not(.active) { color: #fff; }
        body.dark .nav-logo-sq { background: #fff; }

        #grid {
          position: fixed; top: 64px; left: 0; right: 0; bottom: 0;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(4, 1fr);
          gap: 20px; padding: 6vh 8vw;
        }
        .pad {
          background: #ececec; border-radius: 0;
          overflow: hidden; position: relative; outline: 0.5px solid #000;
        }
        body.dark .pad { background: #1e1c1c; outline-color: #fff; }
        .pad img {
          width: 100%; height: 100%; object-fit: cover;
          object-position: center; display: block;
          user-select: none; -webkit-user-drag: none;
        }
        .pad-del {
          position: absolute; top: 5px; left: 5px;
          width: 20px; height: 20px;
          background: rgba(0,0,0,0.40); color: #fff;
          border: none; border-radius: 50%;
          font-size: 11px; line-height: 1; cursor: pointer;
          opacity: 0; transition: opacity 0.15s;
          display: flex; align-items: center; justify-content: center;
        }
        .pad:hover .pad-del { opacity: 1; }
        .pad.active-pad { outline: 2.5px solid #FF179C; outline-offset: -2px; }
        #melody-overlay {
          position: fixed; inset: 0; z-index: 500;
          pointer-events: none; opacity: 0; transition: opacity 0.3s ease;
        }
        #melody-overlay.open { pointer-events: all; opacity: 1; }
        #melody-frame-wrap { position: absolute; inset: 0; }
        #melody-frame { width: 100%; height: 100%; border: none; display: block; }
        #melody-meta {
          display: none; position: absolute; bottom: calc(26vh + 70px); left: 0; right: 0;
          padding: 0 2vw;
          font-family: 'TheBasics', sans-serif; font-size: 14px; color: #343434;
          flex-direction: row; justify-content: space-between; align-items: baseline;
          direction: rtl; pointer-events: none;
        }
        #melody-meta.active { display: flex; }
        body.dark #melody-meta { color: #fff; }
        #meta-datetime { display: flex; direction: rtl; gap: 120px; }
        #gallery-hint {
          position: fixed; top: 82px; left: 50%; transform: translateX(-50%);
          font-family: 'TheBasics', sans-serif; font-weight: 400; font-size: 17px;
          color: #343434; white-space: nowrap; direction: rtl; pointer-events: none;
        }
        body.dark #gallery-hint { color: #fff; }
        #gallery-loading {
          position: fixed; inset: 0; z-index: 9999;
          background: #fff; display: flex; align-items: center; justify-content: center;
          transition: opacity 0.4s ease;
        }
        body.dark #gallery-loading { background: #131111; }
        #gallery-loading.out { opacity: 0; pointer-events: none; }
        @keyframes _gl-pulse { 0%,100%{r:10} 50%{r:22} }
        #gallery-loading circle { animation: _gl-pulse 1.4s ease-in-out infinite; }
        .nav-aodot img { height: 18px !important; width: auto !important; }
      `}</style>

      <div id="gallery-loading">
        <svg width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="10" fill="#FF179C" />
        </svg>
      </div>

      <nav className="navbar">
        <button className="page-nav-btn" id="pnav-next"><svg width="9" height="15" viewBox="0 0 9 15" fill="none"><polyline points="1.5,1.5 7.5,7.5 1.5,13.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"/></svg></button>
        <a href="/taamim" className="nav-link nav-taamim">טעמים</a>
        <a href="/psukkim" className="nav-link nav-psukkim">פסוקים</a>
        <a href="/taamim?seq" className="nav-link nav-rzf">נגינה</a>
        <a href="/library" className="nav-link nav-info active">גלריה</a>
        <button className="page-nav-btn" id="pnav-prev"><svg width="9" height="15" viewBox="0 0 9 15" fill="none"><polyline points="7.5,1.5 1.5,7.5 7.5,13.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"/></svg></button>
        <a href="/" className="nav-link nav-aodot">
          <img src="/logolight.png?v=2" className="logo-light" alt="אודות" />
          <img src="/logodark.png?v=2" className="logo-dark" alt="אודות" />
        </a>
      </nav>
      <div id="page-nav"></div>

      <div id="gallery-hint">[לחצו על המקלדת לצפייה בנגינות השמורות]</div>
      <div id="grid"></div>

      <div id="melody-overlay">
        <div id="melody-frame-wrap">
          <iframe id="melody-frame" src="" allow="midi *"></iframe>
          <div id="melody-meta">
            <div id="meta-datetime">
              <span id="meta-date"></span>
              <span id="meta-time"></span>
            </div>
            <div>מספר טעמים: <span id="meta-count"></span></div>
          </div>
        </div>
      </div>

      <Script src="/scripts/library.js" strategy="afterInteractive" />
    </>
  )
}
