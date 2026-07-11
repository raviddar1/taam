'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export default function AboutPage() {
  useEffect(() => {
    if (sessionStorage.getItem('darkMode') === '1') {
      document.body.classList.add('dark')
    }
  }, [])

  return (
    <>
      <style>{`
        body { background: #130F10; font-family: 'TheBasics', sans-serif; }
        body.dark { background: #130F10; }
        body.dark .nav-link:not(.active) { color: #fff; }
        body.dark .nav-logo-sq { background: #fff; }

        #standby {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: #fff;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          z-index: 500; opacity: 1; pointer-events: auto;
          transition: opacity 0.5s ease;
        }
        #standby.hidden { opacity: 0; pointer-events: none; }
        #taam-strip {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%); margin-top: -30px;
          pointer-events: none; z-index: 700;
        }
        #standby-text {
          position: fixed; bottom: 160px; left: 50%;
          transform: translateX(-50%);
          font-family: 'TheBasics', sans-serif; font-weight: 400;
          font-size: 17px; color: #343434; direction: rtl;
          white-space: nowrap; transition: opacity 0.5s ease;
        }
        #logo-reveal, #logo-reveal-dark {
          position: fixed; left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          width: 380px; height: auto;
          opacity: 0; pointer-events: none; z-index: 650;
        }
        body.dark .logo-light-mode { display: none; }
        body:not(.dark) .logo-dark-mode { display: none; }
        body.standby-active .nav-link { color: #343434 !important; }
        body.standby-active .nav-logo-sq { display: none !important; }
        body.standby-active .nav-aodot { display: none !important; }
        #video-wrap {
          position: fixed; top: 64px; left: 0; right: 0; bottom: 0;
          display: flex; align-items: center; justify-content: center; z-index: 1;
        }
        #video-wrap video {
          width: 70vw; max-height: 70vh; object-fit: contain; cursor: pointer;
        }
        .nav-aodot .logo-dark { display: block; }
        .nav-aodot .logo-light { display: none; }
        #midi-permission-btn {
          display: none;
          position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
          z-index: 600; background: none; border: 1px solid #FF179C;
          color: #FF179C; font-family: 'TheBasics', sans-serif; font-size: 15px;
          padding: 7px 22px; border-radius: 50px; cursor: pointer;
          animation: _afu 1.5s ease-in-out infinite;
        }
      `}</style>

      <nav className="navbar">
        <button className="page-nav-btn" id="pnav-next"><svg width="9" height="15" viewBox="0 0 9 15" fill="none"><polyline points="1.5,1.5 7.5,7.5 1.5,13.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"/></svg></button>
        <a href="/taamim" className="nav-link nav-taamim">טעמים</a>
        <a href="/psukkim" className="nav-link nav-psukkim">פסוקים</a>
        <a href="/taamim?seq" className="nav-link nav-rzf">נגינה</a>
        <a href="/library" className="nav-link nav-info">גלריה</a>
        <button className="page-nav-btn" id="pnav-prev"><svg width="9" height="15" viewBox="0 0 9 15" fill="none"><polyline points="7.5,1.5 1.5,7.5 7.5,13.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"/></svg></button>
        <a href="/" className="nav-link nav-aodot active">
          <img src="/logolight.png" className="logo-light" alt="אודות" />
          <img src="/logodark.png" className="logo-dark" alt="אודות" />
        </a>
      </nav>
      <div id="page-nav"></div>

      <div id="standby">
        <img id="logo-reveal" src="/logomid.png" alt="" className="logo-light-mode" />
        <img id="logo-reveal-dark" src="/logomid-dark.png" alt="" className="logo-dark-mode" />
        <div id="taam-strip"></div>
        <div id="standby-text">לחצו על כל כפתור במקלדת כדי להתחיל</div>
      </div>

      <button id="midi-permission-btn">אפשר MIDI ▸</button>

      <div id="video-wrap">
        <video id="intro-vid" loop muted playsInline preload="auto">
          <source src="/introWpad3.mp4" type="video/mp4" />
        </video>
      </div>

      <Script src="/scripts/about.js" strategy="afterInteractive" />
    </>
  )
}
