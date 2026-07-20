'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export default function AboutPage() {
  useEffect(() => {
    if (sessionStorage.getItem('darkMode') === '1') {
      document.body.classList.add('dark')
    }
    // 5-minute idle reload on standby/home page
    var _t: ReturnType<typeof setTimeout>
    function _r(){ clearTimeout(_t); _t = setTimeout(function(){ location.reload(); }, 300000); }
    const evts = ['mousemove','keydown','mousedown','touchstart','click'] as const
    evts.forEach(function(ev){ document.addEventListener(ev, _r, {passive:true}); })
    _r()
    return () => { clearTimeout(_t); evts.forEach(function(ev){ document.removeEventListener(ev, _r); }); }
  }, [])

  return (
    <>
      <link rel="preload" href="/scripts/about.js" as="script" />
      <style>{`
        body { background: #130F10; font-family: 'TheBasics', sans-serif; }
        body.dark { background: #130F10; }
        .nav-link:not(.active) { color: #fff; }
        body.dark .nav-logo-sq { background: #fff; }

        #standby {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: #130F10;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          z-index: 500; opacity: 1; pointer-events: auto;
          transition: opacity 0.5s ease;
          overflow: hidden;
        }
        #standby.hidden { opacity: 0; pointer-events: none; }
        #standby-video {
          width: 75%; height: auto;
          object-fit: contain; pointer-events: none;
          position: relative; left: 30px;
        }
        #taam-strip {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%); margin-top: -30px;
          pointer-events: none; z-index: 505; opacity: 0;
        }
        #standby-text {
          position: fixed; bottom: 160px; left: 50%;
          transform: translateX(-50%);
          font-family: 'TheBasics', sans-serif; font-weight: 300;
          font-size: clamp(18px, 1.4vw, 27px); color: #fff; direction: rtl;
          white-space: nowrap; transition: opacity 0.5s ease;
          z-index: 510;
        }
        #logo-reveal, #logo-reveal-dark {
          position: fixed; left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          width: 380px; height: auto;
          opacity: 0; pointer-events: none; z-index: 650;
        }
        body.dark .logo-light-mode { display: none; }
        body:not(.dark) .logo-dark-mode { display: none; }
        body.standby-active .navbar { display: none !important; }
        body.intro-active .navbar { display: none !important; }
        #video-wrap {
          position: fixed; top: 64px; left: 0; right: 0; bottom: 0;
          display: flex; align-items: center; justify-content: center; z-index: 1;
        }
        #video-wrap video {
          width: 70vw; max-height: 70vh; object-fit: contain; cursor: pointer;
        }
        .nav-aodot .logo-dark { display: block; }
        .nav-aodot .logo-light { display: none; }
        #intro-hint {
          display: none;
          position: fixed; bottom: 60px; left: 50%; transform: translateX(-50%);
          font-family: 'TheBasics', sans-serif; font-weight: 300;
          font-size: clamp(18px, 1.4vw, 27px); color: #fff; direction: rtl;
          white-space: nowrap; z-index: 10;
        }
        body:not(.standby-active) #intro-hint { display: block; }
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
          <img src="/logolight.png?v=2" className="logo-light" alt="אודות" />
          <img src="/logodark.png?v=2" className="logo-dark" alt="אודות" />
        </a>
      </nav>
      <div id="page-nav"></div>

      <script dangerouslySetInnerHTML={{__html:`
        (function(){
          var isInternal = document.referrer && new URL(document.referrer).origin === location.origin;
          if(location.search.includes('intro') && isInternal){
            var el = document.getElementById('standby');
            if(el) el.style.display = 'none';
          }
        })();
      `}} />
      <div id="standby">
        <video id="standby-video" src="/shapes.mp4" loop muted playsInline autoPlay />
        <div id="taam-strip"></div>
        <div id="standby-text">לחצו על כל כפתור במקלדת כדי להתחיל</div>
      </div>

      <button id="midi-permission-btn">אפשר MIDI ▸</button>

      <div id="video-wrap">
        <video id="intro-vid" loop muted playsInline preload="metadata">
          <source src="/intro newwww.mp4" type="video/mp4" />
        </video>
      </div>
      <div id="intro-hint">לחצו על החץ <svg width="11" height="18" viewBox="0 0 9 15" fill="none" style={{display:'inline-block',verticalAlign:'middle',margin:'0 2px'}}><polyline points="7.5,1.5 1.5,7.5 7.5,13.5" stroke="#FF179C" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"/></svg> במקלדת כדי לדלג</div>

      <Script
        src="/p5.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          const s = document.createElement('script')
          s.src = '/scripts/about.js'
          document.body.appendChild(s)
        }}
      />
    </>
  )
}
