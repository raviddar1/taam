(function(){
    // במצב embed — מסתיר overlay מיידית
    if(location.search.includes('embed')){
      document.getElementById('loading-overlay').style.display='none';
      window._hideLoader=function(){};
      return;
    }
    var ov  = document.getElementById('loading-overlay');
    var cvs = document.getElementById('loading-canvas');
    if(!ov||!cvs){ window._hideLoader=function(){}; return; }
    if(sessionStorage.getItem('darkMode')==='1') ov.classList.add('dark');
    var ctx = cvs.getContext('2d');
    var W=200, H=70, PERIOD=1400, CX=W*0.5, CY=H*0.5;
    var raf=null, t0=null, alive=true;
    function ss(x){ return x*x*(3-2*x); }
    function eio(t){ return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2; }
    function draw(ts){
      if(!alive) return;
      if(!t0) t0=ts;
      var elapsed=ts-t0;
      var a=elapsed<300?ss(elapsed/300):1;
      var pv=(elapsed%PERIOD)/PERIOD;
      var pulse=eio(pv<0.5?pv*2:1-(pv-0.5)*2);
      var r=10+14*pulse;
      var alpha=a*(0.3+0.7*pulse);
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle='rgba(255,23,156,'+alpha+')';
      ctx.beginPath(); ctx.arc(CX,CY,r,0,Math.PI*2); ctx.fill();
      raf=requestAnimationFrame(draw);
    }
    raf=requestAnimationFrame(draw);
    window._hideLoader=function(){
      if(!alive) return;
      alive=false; cancelAnimationFrame(raf);
      ov.classList.add('out');
      setTimeout(function(){ if(ov.parentNode) ov.parentNode.removeChild(ov); },450);
    };
  })();

(function(){
    if(location.search.includes('embed')) return;
    var ov = document.getElementById('pad-grid-overlay');
    if(!ov) return;
    function hidePadGrid(){
      ov.classList.add('out');
      setTimeout(function(){ ov.style.display='none'; }, 400);
      document.removeEventListener('keydown', hidePadGrid);
      document.removeEventListener('mousedown', hidePadGrid);
    }
    window._hidePadGrid = function(){ hidePadGrid(); if(window._padP5) window._padP5.noLoop(); };
    document.addEventListener('keydown', hidePadGrid);
    document.addEventListener('mousedown', hidePadGrid);
    window.addEventListener('pageshow', function(e) {
      if (!e.persisted) return;
      ov.classList.remove('out');
      ov.style.display = 'flex';
      document.addEventListener('keydown', hidePadGrid);
      document.addEventListener('mousedown', hidePadGrid);
      if (window._padP5) { if(window._padP5._restart) window._padP5._restart(); else window._padP5.loop(); }
    });
  })();

// ---- מיגרציית MIDI מ-8080 (דרך hash) ----
(function(){
  var h = location.hash;
  var m = h.match(/[#&]midi-migrate=([^&]*)/);
  if(!m) return;
  try {
    var data = JSON.parse(decodeURIComponent(m[1]));
    Object.keys(data).forEach(function(k){ if(data[k]!==null) localStorage.setItem(k, data[k]); });
    history.replaceState(null,'',location.pathname+location.search);
    alert('✓ הגדרות MIDI הועתקו בהצלחה! טוען מחדש...');
    location.reload();
  } catch(e) {}
})();

// ---- צבעי פאדים MIDI (velocity→LED color, Donner Starrypad) ----
  const MIDI_COLORS = [
    { name: 'אדום',    vel: 5,   css: '#ff2020' },
    { name: 'כתום',   vel: 9,   css: '#ff8c00' },
    { name: 'ורוד',    vel: 17,  css: '#ff69b4' },
    { name: 'סגול',   vel: 29,  css: '#8b5cf6' },
    { name: 'ירוק',    vel: 41,  css: '#22c55e' },
    { name: 'כחול',    vel: 45,  css: '#3b82f6' },
    { name: 'טורקיז', vel: 53,  css: '#06b6d4' },
    { name: 'צהוב',   vel: 60,  css: '#ffd700' },
  ];
  const PAD_DEFS = [
    { note: 38, key: 'נ', label: 'נ — אתנח' },
    { note: 39, key: 'מ', label: 'מ — זקף קטון' },
    { note: 40, key: 'צ', label: 'צ — זקף גדול' },
    { note: 41, key: 'ת', label: 'ת — תביר' },
    { note: 42, key: 'ל', label: 'ל — שופר מהופך' },
    { note: 43, key: 'ך', label: 'ך — אזלא' },
    { note: 44, key: 'ב', label: 'ב — שני גרשין' },
    { note: 45, key: 'ה', label: 'ה — סוף פסוק' },
    { note: 46, key: 'כ', label: 'כ — זרקא' },
    { note: 47, key: 'ח', label: 'ח — רביע' },
    { note: 48, key: 'ג', label: 'ג — שופר הולך' },
    { note: 49, key: 'ע', label: 'ע — טרחא' },
    { note: 50, key: 'ף', label: 'ף — מאריך' },
    { note: 51, key: 'ש', label: 'ש — תרי קדמין' },
    { note: 52, key: 'ד', label: 'ד — דרגא' },
    { note: 53, key: 'י', label: 'י — יתיב' },
  ];
  let PAD_COLORS = { 38:41, 39:45, 40:60, 41:29, 42:9, 43:17, 44:53, 45:5, 46:9, 47:33, 48:45, 49:60, 50:45, 51:60, 52:29, 53:60 };
  let midiOutput = null;
  let midiChannel = 9; // 0-indexed: 9 = channel 10

  function setPadColors() {
    if (!midiOutput) return;
    const statusByte = 0x90 | midiChannel;
    Object.entries(PAD_COLORS).forEach(function([note, vel]) {
      midiOutput.send([statusByte, parseInt(note), vel]);
    });
    updateMidiStatus();
  }

  function updateMidiStatus() {
    const el = document.getElementById('midi-status');
    if (!el) return;
    el.textContent = midiOutput
      ? 'מחובר: ' + midiOutput.name
      : 'לא נמצא מכשיר MIDI';
    el.style.color = midiOutput ? '#16a34a' : '#dc2626';
  }

  // ---- בניית פאנל צבעים ----
  (function() {
    const panel = document.getElementById('color-panel');

    // שורת סטטוס + ערוץ
    const statusRow = document.createElement('div');
    statusRow.style.cssText = 'margin-bottom:12px; font-size:12px; direction:rtl;';
    const statusTxt = document.createElement('div');
    statusTxt.id = 'midi-status';
    statusTxt.textContent = 'ממתין ל-MIDI...';
    statusTxt.style.marginBottom = '8px';

    const chRow = document.createElement('div');
    chRow.style.cssText = 'display:flex; align-items:center; gap:8px; justify-content:flex-end;';
    const chLabel = document.createElement('label');
    chLabel.textContent = 'ערוץ:';
    chLabel.style.fontSize = '12px';
    const chSel = document.createElement('select');
    chSel.style.cssText = 'font-size:12px; border:1px solid #ccc; border-radius:6px; padding:2px 4px;';
    for (let i = 1; i <= 16; i++) {
      const opt = document.createElement('option');
      opt.value = i - 1;
      opt.textContent = i;
      if (i - 1 === midiChannel) opt.selected = true;
      chSel.appendChild(opt);
    }
    chSel.addEventListener('change', function() {
      midiChannel = parseInt(this.value);
      setPadColors();
    });

    const sendBtn = document.createElement('button');
    sendBtn.textContent = 'שלח עכשיו';
    sendBtn.style.cssText = 'font-family:inherit; font-size:12px; border:1px solid #000; border-radius:20px; padding:3px 10px; cursor:pointer; background:#fff;';
    sendBtn.addEventListener('click', setPadColors);

    chRow.appendChild(sendBtn);
    chRow.appendChild(chLabel);
    chRow.appendChild(chSel);
    statusRow.appendChild(statusTxt);
    statusRow.appendChild(chRow);

    const hr = document.createElement('hr');
    hr.style.cssText = 'border:none; border-top:1px solid #eee; margin:0 0 12px;';
    panel.appendChild(statusRow);
    panel.appendChild(hr);

    // שורה לכל פד
    PAD_DEFS.forEach(function(pad) {
      const row = document.createElement('div');
      row.className = 'pad-row';
      const lbl = document.createElement('div');
      lbl.className = 'pad-label';
      lbl.textContent = pad.label;
      const sw = document.createElement('div');
      sw.className = 'swatches';
      MIDI_COLORS.forEach(function(c) {
        const s = document.createElement('div');
        s.className = 'swatch' + (PAD_COLORS[pad.note] === c.vel ? ' selected' : '');
        s.style.background = c.css;
        s.title = c.name + ' (vel ' + c.vel + ')';
        s.addEventListener('click', function() {
          PAD_COLORS[pad.note] = c.vel;
          sw.querySelectorAll('.swatch').forEach(function(x) { x.classList.remove('selected'); });
          s.classList.add('selected');
          if (midiOutput) {
            midiOutput.send([0x90 | midiChannel, pad.note, c.vel]);
          }
        });
        sw.appendChild(s);
      });
      row.appendChild(sw);
      row.appendChild(lbl);
      panel.appendChild(row);
    });

    const toggleBtn = document.getElementById('color-toggle');
    if(toggleBtn) toggleBtn.addEventListener('click', function() {
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) updateMidiStatus();
    });
  })();

  // ---- נתוני מקשים ----
  const KEY_INFO = {
    'מ': {
      name: 'זקף קטון',
      funcText: 'תפקיד הטעם במקרא; טעם מפסיק משני, המסמן עצירה קצרה בקריאה ומחלק את חלקי הפסוק ליחידות משנה.',
      graphicText: 'משמעות הצורה; עיגול כחול - זרימה רציפה ורגועה.',
      symbolHtml: '<img src="visuals/zakef-katan.png?v=2" style="height:42px;object-fit:contain;">',
    },
    'צ': {
      name: 'זקף גדול',
      funcText: 'תפקיד הטעם במקרא; טעם מפסיק משני, המסמן עצירה מודגשת בקריאה ומעניק הדגשה למילה שעליה הוא מופיע.',
      graphicText: 'משמעות הצורה; עיגול צהוב - התפרצות פתוחה ומתמשכת.',
      symbolHtml: '<img src="visuals/zakef-gadol.png?v=2" style="height:42px;object-fit:contain;">',
    },
    'נ': {
      name: 'אתנח',
      funcText: 'תפקיד הטעם במקרא; טעם מפסיק עיקרי, המסמן עצירה משמעותית בקריאה ומחלק את הפסוק לשני חלקים עיקריים.',
      graphicText: 'משמעות הצורה; מלבן אדום - עצירה עוצמתית ויציבה.',
      symbolHtml: '<img src="visuals/etnachta.png?v=2" style="height:42px;object-fit:contain;">',
    },
    'ה': {
      name: 'סוף פסוק',
      funcText: 'תפקיד הטעם במקרא; טעם מפסיק עיקרי, המסמן את סיום הפסוק ואת העצירה המלאה והסופית בקריאה.',
      graphicText: 'משמעות הצורה; ריבוע שחור - עצירה מוחלטת ויציבה.',
      symbolHtml: '<img src="visuals/sof-pasuk.png?v=2" style="height:42px;object-fit:contain;">',
    },
    'ב': {
      name: 'שני גרשין',
      funcText: 'תפקיד הטעם במקרא; טעם מפסיק משני, המסמן עצירה מודגשת בקריאה ומבליט מילה בעלת חשיבות מיוחדת.',
      graphicText: 'משמעות הצורה; משולש כתום מוטה - הרמוניה הדוחפת להמשך תנועה.',
      symbolHtml: '<img src="visuals/shnei-gershayim.png?v=2" style="height:42px;object-fit:contain;">',
    },
    'ת': {
      name: 'תביר',
      funcText: 'תפקיד הטעם במקרא; טעם מפסיק משני, המסמן עצירה קלה בתוך רצף הקריאה ומכין לקראת הפסקה משמעותית יותר בהמשך הפסוק.',
      graphicText: 'משמעות הצורה; קשת סגולה - הרמוניה השוקעת פנימה.',
      symbolHtml: '<img src="visuals/tavir.png?v=2" style="height:42px;object-fit:contain;">',
    },
    'ך': {
      name: 'אזלא',
      funcText: 'תפקיד הטעם במקרא; טעם משרת, המחבר בין מילים ברצף הקריאה ויוצר תנועה מתמשכת ודינמית ללא עצירה.',
      graphicText: 'משמעות הצורה; קו ירוק - תנועה מתמשכת קדימה.',
      symbolHtml: '<img src="visuals/azla.png?v=2" style="height:42px;object-fit:contain;">',
    },
    'ל': {
      name: 'שופר מהופך',
      funcText: 'תפקיד הטעם במקרא; טעם משרת, המחבר בין מילים ברצף הקריאה ויוצר תנועה קצרה אל הטעם הבא.',
      graphicText: 'משמעות הצורה; עיגול כחול - זרימה רציפה מתמשכת.',
      symbolHtml: '<img src="visuals/shofar-mehupach.png?v=2" style="height:42px;object-fit:contain;">',
    },
    'ח': {
      name: 'רביע',
      funcText: 'תפקיד הטעם במקרא; טעם מפסיק משני, המסמן עצירה ברורה בקריאה ומדגיש את המילה שעליה הוא מופיע.',
      graphicText: 'משמעות הצורה; משולש סגול - הרמוניה הדוחפת כלפי מטה.',
      symbolHtml: '<img src="visuals/ravia.png?v=2" style="height:42px;object-fit:contain;">',
    },
    'י': {
      name: 'יתיב',
      funcText: 'תפקיד הטעם במקרא; טעם מפסיק קל, המסמן עצירה קצרה בקריאה ויוצר רגע קטן של מנוחה לפני המשך הפסוק.',
      graphicText: 'משמעות הצורה; משולש צהוב - התפרצות מהירה.',
      symbolHtml: '<img src="visuals/yativ.png?v=2" style="height:42px;object-fit:contain;">',
    },
    'ג': {
      name: 'שופר הולך',
      funcText: 'תפקיד הטעם במקרא; טעם משרת, המחבר בין מילים ברצף הקריאה ויוצר תנועה זורמת ללא עצירה.',
      graphicText: 'משמעות הצורה; קו כחול - המשכיות רציפה וזורמת.',
      symbolHtml: '<img src="visuals/shofar-holech.png?v=2" style="height:42px;object-fit:contain;">',
    },
    'כ': {
      name: 'זרקא',
      funcText: 'תפקיד הטעם במקרא; טעם מפסיק משני, המסמן עצירה בינונית בקריאה ומעניק הדגשה למילה שעליה הוא מופיע.',
      graphicText: 'משמעות הצורה; משולש כתום - הרמוניה הדרגתית.',
      symbolHtml: '<img src="visuals/zarqa.png?v=2" style="height:42px;object-fit:contain;">',
    },
    'ע': {
      name: 'טרחא',
      funcText: 'תפקיד הטעם במקרא; טעם מפסיק קל, המסמן הפסקה קלה או נשימה קצרה במהלך הקריאה ומוביל אל הטעם הבא.',
      graphicText: 'משמעות הצורה; קשת ירוקה - עצירה קטנה לפני תנועה.',
      symbolHtml: '',
    },
    'ש': {
      name: 'תרי קדמין',
      funcText: 'תפקיד הטעם במקרא; טעם משרת, המחבר בין מילים ברצף הקריאה ויוצר תנועה מהירה ורציפה לקראת הטעם הבא.',
      graphicText: 'משמעות הצורה; חצי עיגול צהוב - התפרצות מהירה.',
      symbolHtml: '<img src="visuals/terei-kadmin.png?v=2" style="height:42px;object-fit:contain;">',
    },
    'ד': {
      name: 'דרגא',
      funcText: 'תפקיד הטעם במקרא; טעם משרת, המחבר בין מילים ברצף הקריאה ויוצר תנועה הדרגתית לקראת הטעם הבא.',
      graphicText: 'משמעות הצורה; משולש הפוך סגול - ירידה הדרגתית.',
      symbolHtml: '<img src="visuals/darga.png?v=2" style="height:42px;object-fit:contain;">',
    },
    'ף': {
      name: 'מאריך',
      funcText: 'תפקיד הטעם במקרא; טעם משרת, המחבר בין מילים ברצף הקריאה ומאריך את התנועה לקראת הטעם הבא.',
      graphicText: 'משמעות הצורה; קו כחול - המשכיות רציפה וזורמת.',
      symbolHtml: '<img src="visuals/marich.png?v=2" style="height:42px;object-fit:contain;">',
    },
  };

  // ---- מצב ----
  let currentMode = 'בודד';
  let activeKey   = null;
  let currentTradition = 'ספרדי';

  // ---- דארק מוד ----
  let darkMode = false;
  function setDarkMode(on) {
    darkMode = on;
    document.body.classList.toggle('dark', on);
    if(!location.search.includes('embed')) sessionStorage.setItem('darkMode', on ? '1' : '0');
    if(window._padP5) { window._padP5.loop(); }
  }

  // ---- נוסחים ----
  const TRADITION_ORDER = ['מרוקאי', 'ספרדי', 'אשכנזי'];
  function selectTradition(t) {
    currentTradition = t;
    localStorage.setItem('m_trad', t);
    document.querySelectorAll('.trad-item').forEach(function(el){
      el.classList.toggle('active', el.dataset.trad === t);
    });
    updateAnimDurations();
    retriggerSolo();
  }
  function updateIpusColor() {
    const btn = document.getElementById('ipus-btn');
    if(btn) btn.classList.toggle('seq-active', currentMode === 'רצף' && seqShapes.length > 0);
  }
  function captureStripScreenshot() {
    var cv = document.querySelector('#wrap canvas');
    if(!cv) return null;
    try {
      var thumb = document.createElement('canvas');
      thumb.width  = 1200;
      thumb.height = Math.round(1200 * cv.height / cv.width);
      var ctx = thumb.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(cv, 0, 0, cv.width, cv.height, 0, 0, thumb.width, thumb.height);
      return thumb.toDataURL('image/jpeg', 0.92);
    } catch(e) { return null; }
  }

  function doScreenshotAndNavigate() {
    // עצור אנימציה
    if(pInst) pInst.noLoop();
    var cv = document.querySelector('#wrap canvas');
    // שמירה אוטומטית עם תמונה
    if(seqShapes.length > 0) {
      var saved = JSON.parse(localStorage.getItem('taam_saved_melodies') || '[]');
      var _itvls = [];
      for(var _ii=1;_ii<seqShapes.length;_ii++) _itvls.push(seqShapes[_ii].placedAt - seqShapes[_ii-1].placedAt);
      saved.push({
        shapes: seqShapes.map(function(s){ return {key:s.key, sz:s.sz, str:s.str, tradition:s.tradition||currentTradition}; }),
        intervals: _itvls,
        tradition: currentTradition,
        dark: darkMode,
        vR: localStorage.getItem('m_vR') !== null ? +localStorage.getItem('m_vR') : null,
        vL: localStorage.getItem('m_vL') !== null ? +localStorage.getItem('m_vL') : null,
        savedAt: Date.now(),
        screenshot: captureStripScreenshot()
      });
      while(saved.length > 16) saved.shift();
      localStorage.setItem('taam_saved_melodies', JSON.stringify(saved));
    }
    // אוברליי עם מסך מלא + פלאש שאטר
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:9998;background:' + (darkMode ? '#131111' : '#fff') + ';';
    if(cv) {
      try {
        var img = document.createElement('img');
        img.src = cv.toDataURL();
        img.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);max-width:78%;max-height:78vh;width:auto;height:auto;object-fit:contain;border:1px solid ' + (darkMode ? '#fff' : '#000') + ';';
        ov.appendChild(img);
      } catch(e) {}
    }
    var fl = document.createElement('div');
    fl.style.cssText = 'position:absolute;inset:0;background:' + (darkMode ? '#131111' : '#fff') + ';opacity:1;pointer-events:none;transition:opacity 0.18s ease;';
    ov.appendChild(fl);
    var pop = document.createElement('div');
    pop.textContent = 'הנגינה שלך נשמרה בגלריה';
    pop.style.cssText = 'position:absolute;top:calc(13% + 60px);left:50%;transform:translateX(-50%);background:#fff;border:1px solid #FF179C;border-radius:10px;padding:12px 28px;font-family:\'TheBasics\',sans-serif;font-size:18px;color:#343434;white-space:nowrap;direction:rtl;z-index:1;opacity:0;transition:opacity 0.3s ease;';
    ov.appendChild(pop);
    document.body.appendChild(ov);
    setTimeout(function(){ fl.style.opacity = '0'; }, 40);
    setTimeout(function(){ pop.style.opacity = '1'; }, 200);
    setTimeout(function(){ window.location.href = '/library'; }, 1800);
  }

  function loadMelodyShapes(shapes, vR, vL, intervals) {
    if(!shapes || shapes.length === 0) return;
    seqShapes = []; scrollPos = 0; seqCurrentX = {}; seqLastTriggered = {};
    resetAnimStates(); stopAllAudio();
    if(pInst) pInst.loop();
    const count = shapes.length;
    const wW = Math.round(window.innerWidth / 0.8);
    let _pa = 0;
    shapes.forEach(function(s, i) {
      const ns = {key:s.key, placedAt:_pa, lastLoop:0, sz:s.sz||1.0, str:s.str||0.0, tradition:s.tradition||'ספרדי'};
      seqShapes.push(ns);
      seqLastTriggered[ns.key] = ns;
      if(i < shapes.length-1) _pa += (intervals && intervals[i] != null) ? intervals[i] : 90;
    });
    scrollPos = wW;
    applyFaderVols(vR, vL);
    updateIpusColor();  }

  function doReset() {
    resetAnimStates();
    stopAllAudio();
    activeKey = null;
    staffShapes = [];
    seqShapes = []; scrollPos = 0; seqCurrentX = {}; seqLastTriggered = {};
    document.getElementById('solo-info').classList.remove('active');
    selectTradition(localStorage.getItem('m_trad') || 'ספרדי');
    updateIpusColor();
     }

  // ---- חמשה (4 קווים) ----
  function getStaffLines(h) {
    return [ h*0.36, h*0.43, h*0.50, h*0.57, h*0.64 ];
  }

  // ---- מצב רצף ----
  let staffShapes = [];
  let seqX = null;
  let seqPos = {};
  const SEQ_STEP = 90;
  let seqShapes = [];   // { key, placedAt, lastLoop }
  let scrollPos = 0;
  const SCROLL_SPEED = 2.0;
  let seqCurrentX = {}; // מיקום x של הצורה שמתנגנת כרגע
  let seqLastTriggered = {}; // shape object שהפעיל אנימציה אחרון לכל מקש
  let keyProps = {};     // { key: {sz, str} } — ערכי גלגלת per-key
  let lastKey = null;    // הטעם האחרון שנלחץ

  // ---- show/hide ----
  const el = document.getElementById('wrap');
  el.style.top='0'; el.style.left='0'; el.style.transform='none';

  window.addEventListener('resize', function(){
    if(currentMode==='רצף'||currentMode==='בודד'){
      if(pInst) pInst.resizeCanvas(window.innerWidth, window.innerHeight);
    }
  });
  let fadeTimer = null;
  function showCanvas() {
    if(fadeTimer){ clearTimeout(fadeTimer); fadeTimer=null; }
    el.style.opacity='1';
    el.style.display='block';
  }
  function fadeOutCanvas() {
    el.style.opacity='0';
    fadeTimer=setTimeout(function(){ el.style.display='none'; el.style.opacity='1'; fadeTimer=null; }, 300);
  }

  // ---- easing ----
  function easeInOut(t) { return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2; }
  function easeOutQuad(t) { return 1-(1-t)*(1-t); }
  function easeOutCubic(t){ return 1-Math.pow(1-t,3); }
  function easeInOutQuint(t){ return t<0.5?16*t*t*t*t*t:1-Math.pow(-2*t+2,5)/2; }
  function envAt(pv,hold) {
    const h=hold,open=(1-h)/2;
    if(pv<open) return easeInOut(pv/open);
    if(pv<open+h) return 1;
    return 1-easeInOut((pv-open-h)/open);
  }
  function smoothstep(x){return x*x*(3-2*x);}

  let resetAnimStates = ()=>{};
  let pInst;
  let retriggerSolo = ()=>{};
  let resetMidiLearn = ()=>{};
  let updateAnimDurations = ()=>{};
  let stopAllAudio = ()=>{};
  let applyFaderVols = function(){};

  new p5(function(p) {
    pInst = p;
    const CW=900, CH=506;

    const A1={ball:'#FFE137',radius:0.050,anchorY:0.700,maxLen:0.520,count:3,period:2.2,hold:0.0,fade:0.28};
    let p1={playing:false,startMs:0,frozen:false}; let col1;
    const A2={ball:'#51A2DD',radius:0.050,anchorX:0.700,centerY:0.500,maxLen:0.340,count:3,period:2.2,hold:0.0,fade:0.28};
    let p2={playing:false,startMs:0,frozen:false}; let col2;
    let p1Trail=[]; const P1_TRAIL_LEN=15;
    let p2Trail=[]; const P2_TRAIL_LEN=15;
    let p3={playing:false,startMs:0,progress:0,frozen:false};
    let p4={playing:false,startMs:0,progress:0,frozen:false};
    let p5_={playing:false,startMs:0,progress:0,frozen:false};
    let p6={playing:false,startMs:0,progress:0,frozen:false};
    let p7={playing:false,startMs:0,progress:0,frozen:false};
    let p8={playing:false,startMs:0,progress:0,frozen:false};
    let p9={playing:false,startMs:0,frozen:false};
    let p9Trail=[]; const P9_TRAIL_LEN=10;
    let p10={playing:false,startMs:0,progress:0,frozen:false};
    let p11={playing:false,startMs:0,progress:0,frozen:false};
    let p12={playing:false,startMs:0,progress:0,frozen:false};
    let p13={playing:false,startMs:0,progress:0,frozen:false};
    let p14={playing:false,startMs:0,progress:0,frozen:false};
    let p15={playing:false,progress:0,frozen:false};
    let p16={playing:false,startMs:0,frozen:false};
    let RAVIYA_ENTER=1.5, RAVIYA_TOTAL=3.3;
    const SEQ_SF = 0.8; // גורם קנה מידה לרצף (0.8 = 80% גובה)
    const SOLO_SCALE = 0.95;
    let sofPasukSpeed=0.008, azlaSpeed=0.01, shofarSpeed=0.009, shofarReturnBoost=1.0, yetivSpeed=0.055;
    let sofPasukDuration=2.0, azlaDuration=2.0, shofarMehupachDuration=2.0, shofarHolechDuration=2.0;

    p.setup = function() {
      p.createCanvas(window.innerWidth, window.innerHeight).parent('wrap');
      p.noStroke();
      col1=p.color(A1.ball); col2=p.color(A2.ball);
      if(window.parent !== window) window.parent.postMessage({type:'iframeReady'}, '*');
      resetAnimStates = function() {
        [p1,p2].forEach(s=>{s.playing=false;s.frozen=false;});
        [p3,p4,p5_,p6,p7,p8].forEach(s=>{s.playing=false;s.progress=0;s.frozen=false;});
        p9.playing=false; p9.frozen=false;
        p10.playing=false; p10.frozen=false; p10.progress=0;
        p11.playing=false; p11.frozen=false; p11.progress=0;
        p12.playing=false; p12.frozen=false; p12.progress=0;
        p13.playing=false; p13.frozen=false; p13.progress=0;
        p14.playing=false; p14.frozen=false; p14.progress=0;
        p15.playing=false; p15.frozen=false; p15.progress=0;
        p16.playing=false; p16.frozen=false;
        p1Trail=[]; p2Trail=[]; p9Trail=[];
      };
    };

    function drawRaviyaTriangle(x,y,w,h){
      p.triangle(x-w/2,y, x+w/2,y-h/2, x+w/2,y+h/2);
    }
    function glow(r,g,b,blur,ox=0,oy=0){
      p.drawingContext.shadowColor=`rgba(${r},${g},${b},0.75)`;
      p.drawingContext.shadowBlur=blur;
      p.drawingContext.shadowOffsetX=ox;
      p.drawingContext.shadowOffsetY=oy;
    }
    function noGlow(){
      p.drawingContext.shadowBlur=0;
      p.drawingContext.shadowOffsetX=0;
      p.drawingContext.shadowOffsetY=0;
    }

    // גודל יחסי למצב
    function sc() { return currentMode==='רצף' ? 0.55 : 1.0; }

    // מרכז Y לרצף
    function staffCY() { return p.height * 0.50; }

    // ---- ציור צורה על החמשה (קפואה) ----
    function drawFrozen(s) {
      noGlow();
      const {key,x,y} = s;
      const effSz  = s.sz  ?? keyProps[key]?.sz  ?? 1.0;
      const sf=p.height*0.009;
      function applyStyle(r,g,b,a){
        const base=a!==undefined?a:255;
        if(darkMode){
          p.noFill();
          const bk=(r===0&&g===0&&b===0);
          p.stroke(bk?255:r, bk?255:g, bk?255:b, base);
          p.strokeWeight(2);
          return;
        }
        p.fill(r,g,b,base); p.noStroke();
      }
      function sd(cx,cy,fn){ p.push(); p.translate(cx,cy); p.scale(effSz); p.translate(-cx,-cy); fn(); p.pop(); }
      const h=p.height, sy=h*0.50;
      switch(key){
        case 'צ': sd(x,sy,()=>{
          const d=h*0.14; applyStyle(255,225,55);
          for(let i=0;i<3;i++) p.circle(x,sy-i*d,d); }); break;
        case 'מ': sd(x-h*0.14,sy,()=>{
          const d=h*0.14,len=d*2; applyStyle(81,162,221);
          for(let i=0;i<3;i++) p.circle(x-(i/2)*len,sy,d); }); break;
        case 'נ': sd(x,sy,()=>{
          const wn=sf*7,hn=h*0.28; applyStyle(255,33,33);
          p.rect(x-wn/2,h*0.64-hn,wn,hn); }); break;
        case 'ה': sd(x,y,()=>{
          const sq=h*0.28; applyStyle(0,0,0);
          p.rectMode(p.CENTER); p.rect(x,y,sq,sq); p.rectMode(p.CORNER); }); break;
        case 'ב': sd(x,h*0.535,()=>{
          const wt=h*0.21; applyStyle(238,146,3);
          p.triangle(x-wt,h*0.64,x,h*0.64,x,h*0.43); }); break;
        case 'ת': sd(x,h*0.53,()=>{
          const tY=h*0.53,rv=h*0.11,f=rv/75,gv=26*f,cv=24*f,hw=14*f;
          applyStyle(170,150,232);
          p.beginShape();
          for(let a=0;a<=p.PI;a+=0.02) p.vertex(x+Math.cos(a)*(rv+hw),tY+Math.sin(a)*(rv+hw));
          for(let a=p.PI;a>=0;a-=0.02) p.vertex(x+Math.cos(a)*(rv-hw),tY+Math.sin(a)*(rv-hw));
          p.endShape(p.CLOSE); applyStyle(170,150,232);
          p.circle(x,tY+(rv-gv-cv),cv*2); }); break;
        case 'ך': sd(x-h*0.16,h*0.395,()=>{
          const hk=h*0.07,wk=h*0.32; applyStyle(198,233,2);
          p.rect(x-wk,h*0.36,wk,hk); }); break;
        case 'ג': sd(x-h*0.16,h*0.605,()=>{
          const hk=h*0.07,wk=h*0.32; applyStyle(81,162,221);
          p.rect(x-wk,h*0.57,wk,hk); }); break;
        case 'ף': sd(x-h*0.16,h*0.395,()=>{
          const hk=h*0.07,wk=h*0.32; applyStyle(81,162,221);
          p.rect(x-wk,h*0.36,wk,hk); }); break;
        case 'ד': sd(x,h*0.516,()=>{
          const sf2=h*0.21/135,cy_d=h*0.516; applyStyle(170,150,232);
          p.triangle(x-70*sf2,cy_d-55*sf2,x+70*sf2,cy_d-55*sf2,x,cy_d+80*sf2); }); break;
        case 'ל': sd(x,y,()=>{
          applyStyle(81,162,221,127); p.circle(x,y,h*0.28);
          applyStyle(81,162,221); p.circle(x,y,h*0.14); }); break;
        case 'ח': sd(x,h*0.535,()=>{
          const sW=sf*10.8,sH=h*0.252,gp=-sf*0.72,cy=h*0.535,cx2=x-sf*1.74;
          const lx=cx2-sW/2-gp/2,rx=cx2+sW/2+gp/2;
          applyStyle(170,150,232); drawRaviyaTriangle(lx,cy,sW,sH);
          applyStyle(170,150,232); drawRaviyaTriangle(rx,cy,sW,sH); }); break;
        case 'י': sd(x+h*0.02,h*0.57,()=>{
          const halfH=h*0.07,ww=h*0.125,cy2=h*0.57; applyStyle(255,225,55);
          p.triangle(x-ww/2,cy2,x+ww/2,cy2-halfH,x+ww/2,cy2+halfH); }); break;
        case 'כ': sd(x,h*0.547,()=>{
          const hw=h*0.15; applyStyle(238,146,3);
          p.triangle(x,h*0.36,x-hw,h*0.64,x+hw,h*0.64); }); break;
        case 'ע': sd(x,h*0.43,()=>{
          const eY=h*0.43,outerR=h*0.21,innerR=outerR*0.72; applyStyle(198,233,2);
          p.beginShape();
          for(let a=p.PI;a>=p.HALF_PI;a-=0.02) p.vertex(x+Math.cos(a)*outerR,eY+Math.sin(a)*outerR);
          for(let a=p.HALF_PI;a<=p.PI;a+=0.02) p.vertex(x+Math.cos(a)*innerR,eY+Math.sin(a)*innerR);
          p.endShape(p.CLOSE); }); break;
        case 'ש': sd(x+h*0.03,h*0.449,()=>{
          const r=h*0.14; applyStyle(255,225,55);
          p.push(); p.translate(x,sy); p.rotate(p.radians(200));
          p.arc(0,0,r*2,r*2,p.radians(130),p.radians(310),p.PIE);
          p.pop(); }); break;
      }
    }

    // ---- ציור צורה בודד (קפואה) ----
    function drawSoloFrozen(key) {
      function sdf(r, g, b, a) {
        if (darkMode) {
          p.noFill();
          const bk = (r === 0 && g === 0 && b === 0);
          p.stroke(bk ? 255 : r, bk ? 255 : g, bk ? 255 : b, a !== undefined ? a : 255);
          p.strokeWeight(2);
        } else {
          if (a !== undefined) p.fill(r, g, b, a); else p.fill(r, g, b);
          p.noStroke();
        }
      }
      noGlow();
      const cx=p.width*(1724/1920)-55, cy=p.height*0.586-50;
      const SOLO_POS = {
        'צ':{x:cx-9,    y:cy+50},
        'נ':{x:cx+7,    y:cy-90},
        'מ':{x:cx-9,    y:cy},
        'ת':{x:cx-56,   y:cy},
        'ה':{x:cx-35,   y:cy},
        'ב':{x:cx-26,   y:cy+60},
        'ך':{x:cx-116,  y:cy},
        'ל':{x:cx-26,   y:cy},
        'ח':{x:cx-20,   y:cy},
        'ע':{x:cx+17,   y:cy-40},
        'י':{x:cx-7,    y:cy},
        'כ':{x:cx-37,   y:cy},
        'ג':{x:cx-115,  y:cy+40},
        'ש':{x:cx-57,   y:cy},
        'ף':{x:cx-121,  y:cy-185},
        'ד':{x:cx-11,   y:cy},
      };
      const pos=SOLO_POS[key]; if(!pos) return;
      p.push();
      p.translate(cx, cy);
      p.scale(SOLO_SCALE * (keyProps[key]?.sz ?? 1.0));
      p.translate(-cx, -cy);
      const S=1.0, r=28;
      switch(key){
        case 'צ': {
          sdf(255,225,55);
          const spc=A1.radius*p.height*2;
          for(let i=0;i<3;i++) p.circle(pos.x, pos.y-i*spc, A1.radius*p.height*2);
          break;}
        case 'מ': {
          sdf(81,162,221);
          const len=A2.radius*p.height*2*(A2.count-1);
          for(let i=0;i<A2.count;i++) p.circle(pos.x-(A2.count>1?(i/(A2.count-1))*len:0), pos.y, A2.radius*p.height*2);
          break;}
        case 'נ': sdf(255,33,33); p.rect(pos.x-12,pos.y,24,120); break;
        case 'ה': sdf(0,0,0); p.rectMode(p.CENTER); p.rect(pos.x,pos.y,120,120); p.rectMode(p.CORNER); break;
        case 'ב': sdf(238,146,3); p.triangle(pos.x-55,pos.y,pos.x+55,pos.y,pos.x+55,pos.y-85); break;
        case 'ת': {
          const rv=75,gv=26,cv=24,hw=14;
          sdf(170,150,232);
          p.beginShape();
          for(let a=0; a<=p.PI; a+=0.02) p.vertex(pos.x+Math.cos(a)*(rv+hw), pos.y+Math.sin(a)*(rv+hw));
          for(let a=p.PI; a>=0; a-=0.02) p.vertex(pos.x+Math.cos(a)*(rv-hw), pos.y+Math.sin(a)*(rv-hw));
          p.endShape(p.CLOSE);
          sdf(170,150,232);
          p.circle(pos.x, pos.y+(rv-gv-cv), cv*2); break;}
        case 'ך': sdf(198,233,2); p.rect(pos.x,pos.y-59,150,27); break;
        case 'ג': { const azlaY=getPos('ך').y; sdf(81,162,221); p.rect(pos.x,azlaY+61,150,27); break; }
        case 'ף': { const azlaY=getPos('ך').y; sdf(81,162,221); p.rect(pos.x,azlaY-59,150,27); break; }
        case 'ל':
          sdf(81,162,221,127); p.circle(pos.x,pos.y,112);
          sdf(81,162,221); p.circle(pos.x,pos.y,56);
          break;
        case 'ח': {
          const sW=54, sH=144, gp=-3.6;
          const drawX=pos.x-8.7;
          const lx=drawX-sW/2-gp/2, rx=drawX+sW/2+gp/2;
          sdf(170,150,232);
          drawRaviyaTriangle(lx,pos.y,sW,sH);
          drawRaviyaTriangle(rx,pos.y,sW,sH);
          break;}
        case 'י': {
          sdf(255,225,55);
          p.triangle(pos.x-42.5,pos.y, pos.x+42.5,pos.y-47.5, pos.x+42.5,pos.y+47.5);
          break;}
        case 'כ': {
          const hw=75, hh=70;
          sdf(238,146,3);
          p.triangle(pos.x, pos.y-hh, pos.x-hw, pos.y+hh, pos.x+hw, pos.y+hh);
          break;}
        case 'ע': {
          const outerR=120, innerR=86;
          sdf(198,233,2);
          p.beginShape();
          for(let a=p.PI; a>=p.HALF_PI; a-=0.02) p.vertex(pos.x+Math.cos(a)*outerR, pos.y+Math.sin(a)*outerR);
          for(let a=p.HALF_PI; a<=p.PI; a+=0.02) p.vertex(pos.x+Math.cos(a)*innerR, pos.y+Math.sin(a)*innerR);
          p.endShape(p.CLOSE);
          break;}
        case 'ש': {
          sdf(255,225,55);
          p.push(); p.translate(pos.x,pos.y); p.rotate(p.radians(200));
          p.arc(0,0,190,190,p.radians(130),p.radians(310),p.PIE);
          p.pop(); break;}
        case 'ד': {
          sdf(170,150,232);
          p.triangle(pos.x-70, pos.y-55, pos.x+70, pos.y-55, pos.x, pos.y+80);
          break;}
      }
      p.pop();
    }

    p.draw = function() {
      p.background(darkMode ? '#131111' : '#fff');

      // ---- רצף ----
      if(currentMode==='רצף'){
        scrollPos += SCROLL_SPEED * (p.deltaTime / (1000/60));
        p.stroke(180); p.strokeWeight(1.5); p.noFill();
        for(const ly of getStaffLines(p.height)){
          const sly = ly*SEQ_SF + p.height*(1-SEQ_SF)/2;
          p.line(0, sly, p.width, sly);
        }
        const _slyFirst = getStaffLines(p.height)[0]*SEQ_SF + p.height*(1-SEQ_SF)/2;
        p.line(p.width/2, _slyFirst - p.height*0.010, p.width/2, _slyFirst + p.height*0.010);
        p.push();
        p.translate(p.width*(1-SEQ_SF)/2, p.height*(1-SEQ_SF)/2);
        p.scale(SEQ_SF);
        p.noStroke();
        const animState={'צ':p1,'מ':p2,'נ':p3,'ה':p4,'ב':p5_,'ת':p6,'ך':p7,'ל':p8,'ח':p9,'ע':p10,'כ':p11,'ג':p12,'י':p13,'ש':p14,'ף':p15,'ד':p16};
        drawAnimations(false);
        for(const s of seqShapes) {
          const wrapW = p.width / SEQ_SF;
          const margin = (wrapW - p.width) / 2;
          const diff = (scrollPos - s.placedAt) % wrapW;
          const screenX = (p.width/2 + margin + diff) % wrapW - margin;
          const loops = Math.floor((scrollPos - s.placedAt) / wrapW);
          if(loops > s.lastLoop){
            s.lastLoop=loops;
            seqLastTriggered[s.key]=s;
            seqCurrentX[s.key]=screenX;
            playTradAudio(s.key, s.tradition);
            playTofim(s.key);
            startAnimOnly(s.key);
          }
          if(seqLastTriggered[s.key]===s) seqCurrentX[s.key]=screenX;
          const isAnimating = animState[s.key].playing && seqLastTriggered[s.key]===s;
          if(!isAnimating){
            drawFrozen({key:s.key, x:screenX, y:staffCY(), sz:s.sz, str:s.str});
            if(screenX > p.width+margin-150) drawFrozen({key:s.key, x:screenX-wrapW, y:staffCY(), sz:s.sz, str:s.str});
            if(screenX < -margin+150) drawFrozen({key:s.key, x:screenX+wrapW, y:staffCY(), sz:s.sz, str:s.str});
          }
        }
        p.pop();
        return;
      }

      // ---- בודד ----
      if(currentMode==='בודד'){
        drawAnimations(false);
        if(p1.frozen&&!p1.playing) drawSoloFrozen('צ');
        if(p2.frozen&&!p2.playing) drawSoloFrozen('מ');
        if(p3.frozen&&!p3.playing) drawSoloFrozen('נ');
        if(p4.frozen&&!p4.playing) drawSoloFrozen('ה');
        if(p5_.frozen&&!p5_.playing) drawSoloFrozen('ב');
        if(p6.frozen&&!p6.playing) drawSoloFrozen('ת');
        if(p7.frozen&&!p7.playing) drawSoloFrozen('ך');
        if(p8.frozen&&!p8.playing) drawSoloFrozen('ל');
        if(p9.frozen&&!p9.playing) drawSoloFrozen('ח');
        if(p10.frozen&&!p10.playing) drawSoloFrozen('ע');
        if(p11.frozen&&!p11.playing) drawSoloFrozen('כ');
        if(p12.frozen&&!p12.playing) drawSoloFrozen('ג');
        if(p13.frozen&&!p13.playing) drawSoloFrozen('י');
        if(p14.frozen&&!p14.playing) drawSoloFrozen('ש');
        if(p15.frozen&&!p15.playing) drawSoloFrozen('ף');
        if(p16.frozen&&!p16.playing) drawSoloFrozen('ד');
        return;
      }

      // ---- אקראי ----
      drawAnimations(false);
      const any=p1.playing||p2.playing||p3.playing||p4.playing||p5_.playing||p6.playing||p7.playing||p8.playing||p9.playing||p10.playing||p11.playing||p12.playing||p13.playing;
      if(!any && el.style.display==='block') fadeOutCanvas();
    };

    function getPos(key) {
      if(currentMode==='רצף'){
        return { x: seqCurrentX[key] !== undefined ? seqCurrentX[key] : p.width/2, y: staffCY() };
      }
      if(currentMode==='אקראי'){
        const d = {
          'צ':{x:p.width*0.14, y:p.height*0.82},
          'מ':{x:p.width*0.58, y:p.height*0.50},
          'נ':{x:p.width*0.43, y:p.height*0.30},
          'ה':{x:p.width*0.78, y:p.height*0.27},
          'ב':{x:p.width*0.83, y:p.height*0.78},
          'ת':{x:p.width*0.26, y:p.height*0.62},
          'ך':{x:p.width*0.55, y:p.height*0.22},
          'ל':{x:p.width*0.68, y:p.height*0.58},
          'ח':{x:p.width*0.35, y:p.height*0.50},
          'ע':{x:p.width*0.50, y:p.height*0.70},
          'כ':{x:p.width*0.65, y:p.height*0.40},
          'ג':{x:p.width*0.45, y:p.height*0.25},
          'י':{x:p.width*0.72, y:p.height*0.55},
        };
        return d[key]||{x:p.width/2,y:p.height/2};
      }
      // בודד
      const bx=p.width*(1724/1920)-55, by=p.height*0.586-50;
      const soloOff={'צ':{dx:-9,dy:50},'נ':{dx:7,dy:-90},'מ':{dx:-9,dy:0},'ת':{dx:-56,dy:0},'ב':{dx:-26,dy:60},'ך':{dx:-116,dy:0},'ל':{dx:-26,dy:0},'ח':{dx:-20,dy:0},'ה':{dx:-35,dy:0},'ע':{dx:17,dy:-40},'כ':{dx:-37,dy:0},'ג':{dx:-115,dy:40},'י':{dx:-7,dy:0},'ש':{dx:-57,dy:0},'ף':{dx:-121,dy:-185},'ד':{dx:-11,dy:0}};
      const off=soloOff[key]||{dx:0,dy:0};
      return {x:bx+off.dx, y:by+off.dy};
    }

    function drawAnimations(solo) {
      let _dk = null;
      function szM(){ return currentMode==='רצף' ? (seqLastTriggered[_dk]?.sz ?? 1.0) : (keyProps[_dk]?.sz ?? 1.0); }
      function getS(){ const m=szM(); return currentMode==='רצף' ? 0.55 : currentMode==='אקראי' ? m : SOLO_SCALE * m; }
      function applyFill(r,g,b,a){
        const base=a!==undefined?a:255;
        if(darkMode){
          p.noFill();
          const bk=(r===0&&g===0&&b===0);
          p.stroke(bk?255:r, bk?255:g, bk?255:b, base);
          p.strokeWeight(2);
          return;
        }
        p.fill(r,g,b,base); p.noStroke();
      }

      // צ
      _dk='צ';
      if(p1.playing){
        const el2=(p.millis()-p1.startMs)/1000;
        if(el2>=zakefGadolDuration){ p1.playing=false; p1Trail=[]; onEnd('צ'); }
        else { const S=getS();
          const pv=el2/zakefGadolDuration, f=A1.fade;
          const pos=getPos('צ');
          const sf=p.height*0.009;
          const d=(currentMode==='רצף') ? p.height*0.14*szM() : A1.radius*p.height*2;
          const baseY=(currentMode==='רצף') ? p.height*0.50 : pos.y;
          let a=1; if(pv<f) a=pv/f;
          const baseAlpha=smoothstep(a)*255;
          const circles=[];
          if(pv<0.5){
            const subPv=pv/0.5;
            const len=(currentMode==='רצף') ? d*4*easeInOut(subPv) : A1.maxLen*p.height*easeInOut(subPv);
            for(let i=0;i<5;i++) circles.push({x:pos.x, y:baseY-(i/4)*len});
          } else {
            const t=easeInOut((pv-0.5)/0.5);
            const len5=(currentMode==='רצף') ? d*4 : A1.maxLen*p.height;
            const ends=[baseY,baseY,baseY-d,baseY,baseY-2*d];
            for(let i=0;i<5;i++){
              const startY=baseY-(i/4)*len5;
              circles.push({x:pos.x, y:startY+(ends[i]-startY)*t});
            }
          }
          p1Trail.push({circles,baseAlpha});
          if(p1Trail.length>P1_TRAIL_LEN) p1Trail.shift();
          const scx_1=p.width*(1724/1920)-55, scy_1=p.height*0.586-50;
          if(currentMode==='בודד'){ p.push(); p.translate(scx_1,scy_1); p.scale(SOLO_SCALE*szM()); p.translate(-scx_1,-scy_1); }
          p.noStroke();
          for(let t=0;t<p1Trail.length-1;t++){
            const ta=p1Trail[t].baseAlpha*((t+1)/P1_TRAIL_LEN)*0.04;
            col1.setAlpha(ta); p.fill(col1);
            for(const c of p1Trail[t].circles) p.circle(c.x,c.y,d*1.05);
          }
          col1.setAlpha(baseAlpha); applyFill(255,225,55,baseAlpha);
          for(const c of circles) p.circle(c.x,c.y,d);
          if(currentMode==='בודד') p.pop();
        }
      }

      // מ
      _dk='מ';
      if(p2.playing){
        const S=getS();
        const el2=(p.millis()-p2.startMs)/1000;
        if(el2>=zakefDuration){ p2.playing=false; p2Trail=[]; onEnd('מ'); }
        else {
          const pv=el2/zakefDuration, f=A2.fade;
          const pos=getPos('מ'), r=currentMode==='רצף' ? p.height*0.07*szM() : A2.radius*p.height*S;
          const seqY=currentMode==='רצף' ? p.height*0.50 : pos.y;
          const envTouch=currentMode==='רצף' ? 0.5 : A2.radius*p.height*2*(A2.count-1)/(A2.maxLen*p.width);
          let env=envAt(pv,A2.hold);
          if(pv>0.5 && env<=envTouch){ env=envTouch; p2.playing=false; p2Trail=[]; onEnd('מ'); }
          let a=1; if(pv<f) a=pv/f;
          const baseAlpha=smoothstep(a)*255;
          const len=currentMode==='רצף' ? p.height*0.56*szM()*env : A2.maxLen*p.width*env*S;
          const jitter = pv < 0.14 ? Math.sin(pv * Math.PI * 10) * (1 - pv/0.14) * 5 : 0;
          const circles=[];
          for(let i=0;i<A2.count;i++) circles.push({x:pos.x-(A2.count>1?(i/(A2.count-1))*len:0),y:seqY+jitter});
          p2Trail.push({circles,baseAlpha});
          if(p2Trail.length>P2_TRAIL_LEN) p2Trail.shift();
          p.noStroke();
          for(let t=0;t<p2Trail.length-1;t++){
            const ta=p2Trail[t].baseAlpha*((t+1)/P2_TRAIL_LEN)*0.04;
            col2.setAlpha(ta); p.fill(col2);
            for(const c of p2Trail[t].circles) p.circle(c.x,c.y,r*2.05);
          }
          col2.setAlpha(baseAlpha); applyFill(81,162,221,baseAlpha);
          for(const c of circles) p.circle(c.x,c.y,r*2);
        }
      }

      // נ
      _dk='נ';
      if(p3.playing){
        const S=getS();
        const el3=(p.millis()-p3.startMs)/1000;
        if(el3>=etnachtaDuration){ p3.playing=false; p3.progress=0; onEnd('נ'); }
        else {
          const pv=el3/etnachtaDuration;
          const eased=1-Math.pow(1-pv,3);
          const x=getPos('נ').x, w2=24*S;
          applyFill(255,33,33);
          if(currentMode==='רצף'){
            const hn=p.height*0.28*szM(), wn=p.height*0.009*7*szM();
            p.rect(x-wn/2, p.height*0.64-hn*eased, wn, hn*eased);
          } else {
            const scx=p.width*(1724/1920)-55, scy=p.height*0.586-50;
            p.push(); p.translate(scx,scy); p.scale(SOLO_SCALE*szM()); p.translate(-scx,-scy);
            p.rect(x-12, getPos('נ').y, 24, 120*eased);
            p.pop();
          }
        }
      }

      // ה
      _dk='ה';
      if(p4.playing){
        const S=getS();
        const el4=(p.millis()-p4.startMs)/1000;
        if(el4>=sofPasukDuration){p4.playing=false;p4.progress=0;onEnd('ה');}
        else {
          const pv=el4/sofPasukDuration;
          const pos=getPos('ה');
          const vib=Math.sin(pv*Math.PI*24)*(1-pv)*12;
          const sz=currentMode==='רצף' ? p.height*0.28*szM()+vib*S : 120+vib;
          applyFill(0,0,0);
          const scx_h=p.width*(1724/1920)-55, scy_h=p.height*0.586-50;
          if(currentMode==='בודד'){ p.push(); p.translate(scx_h,scy_h); p.scale(SOLO_SCALE*szM()); p.translate(-scx_h,-scy_h); }
          p.rectMode(p.CENTER); p.rect(pos.x,pos.y,sz,sz); p.rectMode(p.CORNER);
          if(currentMode==='בודד') p.pop();
        }
      }

      // ב
      _dk='ב';
      if(p5_.playing){
        const S=getS();
        const el5=(p.millis()-p5_.startMs)/1000;
        if(el5>=shneiGereshinDuration){ p5_.playing=false; p5_.progress=0; onEnd('ב'); }
        else {
          const pv=el5/shneiGereshinDuration;
          const lift = Math.pow(Math.sin(pv * Math.PI), 0.6);
          const hs = 1 + 1.5*lift;
          const fadeA = Math.sin(pv * Math.PI);
          const cx=getPos('ב').x, cy=getPos('ב').y;
          p.drawingContext.shadowColor=`rgba(238,146,3,${lift*0.35})`;
          p.drawingContext.shadowBlur=9*lift;
          applyFill(238,146,3);
          if(currentMode==='רצף'){
            const ht=p.height*0.21*szM()*hs, wt=p.height*0.21*szM();
            const pvE=Math.max(0,pv-0.07), hsE=1+1.5*Math.pow(Math.sin(pvE*Math.PI),0.6);
            if(!darkMode){ p.fill(238,146,3,fadeA*50); p.noStroke(); }
            p.triangle(cx-wt,p.height*0.64, cx,p.height*0.64, cx,p.height*0.64-p.height*0.21*szM()*hsE);
            applyFill(238,146,3);
            p.triangle(cx-wt,p.height*0.64, cx,p.height*0.64, cx,p.height*0.64-ht);
          } else {
            const scx=p.width*(1724/1920)-55, scy=p.height*0.586-50;
            p.push(); p.translate(scx,scy); p.scale(SOLO_SCALE*szM()); p.translate(-scx,-scy);
            const pvE=Math.max(0,pv-0.07), hsE=1+1.5*Math.pow(Math.sin(pvE*Math.PI),0.6);
            if(!darkMode){ p.fill(238,146,3,fadeA*50); p.noStroke(); }
            p.triangle(cx-55,cy, cx+55,cy, cx+55,cy-85*hsE);
            applyFill(238,146,3);
            p.triangle(cx-55,cy, cx+55,cy, cx+55,cy-85*hs);
            p.pop();
          }
          noGlow();
        }
      }

      // ת
      _dk='ת';
      if(p6.playing){
        const S=getS();
        const el6=(p.millis()-p6.startMs)/1000;
        if(el6>=tabirDuration){ p6.playing=false; p6.progress=0; onEnd('ת'); }
        else {
          const pr=el6/tabirDuration;
          const pos=getPos('ת');
          const rv=currentMode==='רצף' ? p.height*0.11*szM() : 75;
          const tY=currentMode==='רצף' ? p.height*0.53 : pos.y;
          const f6=rv/75; const gv=26*f6,cv=24*f6,rc=rv-gv-cv;
          const scx_t=p.width*(1724/1920)-55, scy_t=p.height*0.586-50;
          if(currentMode==='בודד'){ p.push(); p.translate(scx_t,scy_t); p.scale(SOLO_SCALE*szM()); p.translate(-scx_t,-scy_t); }
          const hw=14*f6;
          applyFill(170,150,232);
          p.beginShape();
          for(let a=0; a<=p.PI; a+=0.02) p.vertex(pos.x+Math.cos(a)*(rv+hw), tY+Math.sin(a)*(rv+hw));
          for(let a=p.PI; a>=0; a-=0.02) p.vertex(pos.x+Math.cos(a)*(rv-hw), tY+Math.sin(a)*(rv-hw));
          p.endShape(p.CLOSE);
          let angle;
          if(pr<0.65){
            const eased=1-(1-pr/0.65)*(1-pr/0.65);
            angle=eased*p.PI;
          } else {
            angle=p.PI-easeOutQuad((pr-0.65)/0.35)*p.HALF_PI;
          }
          applyFill(170,150,232);
          p.circle(pos.x+rc*Math.cos(angle), tY+rc*Math.sin(angle), cv*2);
          if(currentMode==='בודד') p.pop();
        }
      }

      // ך
      _dk='ך';
      if(p7.playing){
        const S=getS();
        const el7=(p.millis()-p7.startMs)/1000;
        if(el7>=azlaDuration){p7.playing=false;p7.progress=0;onEnd('ך');}
        else {
          const pv=el7/azlaDuration;
          const eased=1-Math.pow(1-pv,3);
          const pos=getPos('ך');
          applyFill(198,233,2);
          if(currentMode==='רצף'){
            const hk=p.height*0.07*szM(), wk=p.height*0.32*szM();
            p.rect(pos.x-wk*eased, p.height*0.36, wk*eased, hk);
          } else {
            const scx=p.width*(1724/1920)-55, scy=p.height*0.586-50;
            p.push(); p.translate(scx,scy); p.scale(SOLO_SCALE*szM()); p.translate(-scx,-scy);
            p.rect(pos.x - 150*eased + 150, pos.y-59, 150*eased, 27);
            p.pop();
          }
        }
      }

      // י (יתיב)
      _dk='י';
      if(p13.playing){
        const S=getS();
        const e=1-Math.pow(1-p13.progress,4);
        const pos=getPos('י');
        if(currentMode==='רצף'){
          const halfH=p.height*0.07*szM(), ww=p.height*0.125*szM(), cy2=p.height*0.57;
          const xOff=p.lerp(p.height*0.09*szM(),0,e);
          p.noStroke();
          for(let i=8;i>0;i--){
            p.fill(255,225,55,(1-e)*(10-i)*7);
            const tOff=xOff+i*ww*0.04;
            p.triangle(pos.x-ww/2+tOff,cy2,pos.x+ww/2+tOff,cy2-halfH,pos.x+ww/2+tOff,cy2+halfH);
          }
          applyFill(255,225,55);
          p.triangle(pos.x-ww/2+xOff,cy2,pos.x+ww/2+xOff,cy2-halfH,pos.x+ww/2+xOff,cy2+halfH);
        } else {
          const hw=42.5*S, halfH=47.5*S;
          const xOff=p.lerp(60*S,0,e);
          p.noStroke();
          for(let i=8;i>0;i--){
            p.fill(255,225,55,(1-e)*(10-i)*7);
            const tOff=xOff+i*4*S;
            p.triangle(pos.x-hw+tOff,pos.y,pos.x+hw+tOff,pos.y-halfH,pos.x+hw+tOff,pos.y+halfH);
          }
          applyFill(255,225,55);
          p.triangle(pos.x-hw+xOff,pos.y,pos.x+hw+xOff,pos.y-halfH,pos.x+hw+xOff,pos.y+halfH);
        }
        p13.progress+=yetivSpeed;
        if(p13.progress>=1){p13.playing=false;p13.progress=0;onEnd('י');}
      }

      // ג (שופר הולך)
      _dk='ג';
      if(p12.playing){
        const S=getS();
        const el12=(p.millis()-p12.startMs)/1000;
        if(el12>=shofarHolechDuration){p12.playing=false;p12.progress=0;onEnd('ג');}
        else {
          const pv=el12/shofarHolechDuration;
          const eased=1-Math.pow(1-pv,3);
          const pos=getPos('ג');
          const azlaY=getPos('ך').y;
          applyFill(81,162,221);
          if(currentMode==='רצף'){
            const hk=p.height*0.07*szM(), wk=p.height*0.32*szM();
            p.rect(pos.x-wk*eased, p.height*0.57, wk*eased, hk);
          } else {
            const scx=p.width*(1724/1920)-55, scy=p.height*0.586-50;
            p.push();
            p.translate(scx,scy); p.scale(SOLO_SCALE*szM()); p.translate(-scx,-scy);
            p.rect(pos.x - 150*eased + 150, azlaY+61, 150*eased, 27);
            p.pop();
          }
        }
      }

      // ל
      _dk='ל';
      if(p8.playing){
        const S=getS();
        const el8=(p.millis()-p8.startMs)/1000;
        if(el8>=shofarMehupachDuration){p8.playing=false;p8.progress=0;onEnd('ל');}
        else {
          const pr=(el8/shofarMehupachDuration)*0.7;
          const lSc=currentMode==='רצף' ? p.height*0.14*szM()/56 : 1;
          let expandR,smallR;
          if(pr<0.4){
            const t=easeOutQuad(pr/0.4);
            expandR=t*112*lSc; smallR=t*48*lSc;
          } else {
            const t=easeOutQuad((pr-0.4)/0.3);
            expandR=(112-t*56)*lSc; smallR=(48-t*20)*lSc;
          }
          const pos=getPos('ל');
          const scx_l=p.width*(1724/1920)-55, scy_l=p.height*0.586-50;
          if(currentMode==='בודד'){ p.push(); p.translate(scx_l,scy_l); p.scale(SOLO_SCALE*szM()); p.translate(-scx_l,-scy_l); }
          applyFill(81,162,221,127); p.circle(pos.x,pos.y,expandR*2);
          applyFill(81,162,221); p.circle(pos.x,pos.y,smallR*2);
          if(currentMode==='בודד') p.pop();
        }
      }

      // ט (טרחא)
      _dk='ע';
      if(p10.playing){
        const S=getS();
        const el10=(p.millis()-p10.startMs)/1000;
        if(el10>=tarchaDuration){ p10.playing=false; p10.progress=0; onEnd('ע'); }
        else {
          const pv=el10/tarchaDuration;
          const pos=getPos('ע');
          const outerR=currentMode==='רצף' ? p.height*0.21*szM() : 120;
          const innerR=outerR*0.72;
          const eY=currentMode==='רצף' ? p.height*0.43 : pos.y;
          const currentA=p.lerp(p.PI, p.HALF_PI, pv);
          const scx_e=p.width*(1724/1920)-55, scy_e=p.height*0.586-50;
          if(currentMode==='בודד'){ p.push(); p.translate(scx_e,scy_e); p.scale(SOLO_SCALE*szM()); p.translate(-scx_e,-scy_e); }
          applyFill(198,233,2);
          p.beginShape();
          for(let a=p.PI; a>=currentA; a-=0.02) p.vertex(pos.x+Math.cos(a)*outerR, eY+Math.sin(a)*outerR);
          p.vertex(pos.x+Math.cos(currentA)*innerR, eY+Math.sin(currentA)*innerR);
          for(let a=currentA; a<=p.PI; a+=0.02) p.vertex(pos.x+Math.cos(a)*innerR, eY+Math.sin(a)*innerR);
          p.endShape(p.CLOSE);
          if(currentMode==='בודד') p.pop();
        }
      }

      // כ (זרקא)
      _dk='כ';
      if(p11.playing){
        const S=getS();
        const el11=(p.millis()-p11.startMs)/1000;
        if(el11>=zarqaDuration){ p11.playing=false; p11.progress=0; onEnd('כ'); }
        else {
          const pv=el11/zarqaDuration;
          const eased=1-Math.pow(1-pv,3);
          const stretchPhase=pv<0.85 ? pv/0.85*0.5 : pv<0.95 ? 0.5+(pv-0.85)/0.10*0.5 : 1;
          const stretch=1+Math.sin(stretchPhase*Math.PI)*0.18;
          const pos=getPos('כ');
          applyFill(238,146,3);
          if(currentMode==='רצף'){
            const hw=p.height*0.15*szM();
            const bY=p.height*0.64, tY=p.height*0.36;
            const curTop=p.lerp(bY,tY,eased);
            p.push(); p.translate(pos.x,bY); p.scale(1,stretch);
            p.triangle(0,curTop-bY,-hw,0,hw,0);
            p.pop();
          } else {
            const scx=p.width*(1724/1920)-55, scy=p.height*0.586-50;
            p.push(); p.translate(scx,scy); p.scale(SOLO_SCALE*szM()); p.translate(-scx,-scy);
            const hw=75, hh=70;
            const bY_s=pos.y+hh;
            const curTop_s=p.lerp(bY_s,pos.y-hh,eased);
            p.push(); p.translate(pos.x,bY_s); p.scale(1,stretch);
            p.triangle(0,curTop_s-bY_s,-hw,0,hw,0);
            p.pop();
            p.pop();
          }
        }
      }

      // ח (רביע)
      _dk='ח';
      if(p9.playing){
        const S=getS();
        const el9=(p.millis()-p9.startMs)/1000;
        if(el9>=RAVIYA_TOTAL){ p9.playing=false; p9Trail=[]; onEnd('ח'); }
        else {
          const sizeH = currentMode==='רצף' ? p.height*0.252*szM() : 144*S;
          const sizeW = currentMode==='רצף' ? p.height*0.009*szM()*10.8 : 54*S;
          const gp    = -sizeW*0.067;
          const rightMove = currentMode==='רצף' ? p.height*0.009*szM()*10.8 : 54*S;
          const leftMove  = currentMode==='רצף' ? p.height*0.009*szM()*6 : 30*S;
          const pos=getPos('ח');
          const shiftLeft = currentMode==='רצף' ? p.height*0.009*szM()*1.74 : 10.3*S;
          const cx=pos.x-shiftLeft, cy=currentMode==='רצף' ? p.height*0.535 : pos.y;
          const leftTarget  = cx - sizeW/2 - gp/2;
          const rightTarget = cx + sizeW/2 + gp/2;
          const pRight = p.constrain(el9/RAVIYA_ENTER, 0, 1);
          const pLeft  = p.constrain((el9-0.32)/RAVIYA_ENTER, 0, 1);
          const rightX = p.lerp(rightTarget+rightMove, rightTarget, easeOutCubic(pRight));
          const leftX  = p.lerp(leftTarget+leftMove,  leftTarget,  easeOutCubic(pLeft));
          const aR=255*Math.min(1,pRight*3), aL=255*Math.min(1,pLeft*3);
          applyFill(170,150,232,aL); drawRaviyaTriangle(leftX, cy,sizeW,sizeH);
          applyFill(170,150,232,aR); drawRaviyaTriangle(rightX,cy,sizeW,sizeH);
        }
      }

      // ד (דרגא)
      _dk='ד';
      if(p16.playing){
        const el16=(p.millis()-p16.startMs)/1000;
        if(el16>=dargaDuration){ p16.playing=false; onEnd('ד'); }
        else {
          const t=el16/dargaDuration;
          const pos=getPos('ד');
          const ev=1-Math.pow(1-t,4);
          if(currentMode==='רצף'){
            const sf=p.height*0.21/135*szM(), cy_d=p.height*0.516;
            const yOff=p.lerp(-42,0,ev)*sf;
            p.push(); p.translate(pos.x, cy_d+yOff);
            for(let i=7;i>=1;i--){
              const bT=i/7, ta=22*bT*(1-ev);
              p.push(); p.translate(0,-bT*18*(1-ev)*sf); p.scale(1+bT*0.035);
              if(darkMode){ p.noFill(); p.stroke(170,150,232,ta); p.strokeWeight(2); }
              else { p.noStroke(); p.fill(170,150,232,ta); }
              p.triangle(-70*sf,-55*sf, 70*sf,-55*sf, 0,80*sf);
              p.pop();
            }
            if(darkMode){ p.noFill(); p.stroke(170,150,232,ev*255); p.strokeWeight(2); }
            else { p.noStroke(); p.fill(170,150,232,ev*255); }
            p.triangle(-70*sf,-55*sf, 70*sf,-55*sf, 0,80*sf);
            p.pop();
          } else {
            const yOff=p.lerp(-42,0,ev);
            const scx=p.width*(1724/1920)-55, scy=p.height*0.586-50;
            p.push(); p.translate(scx,scy); p.scale(SOLO_SCALE*szM()); p.translate(-scx,-scy);
            p.push(); p.translate(pos.x, pos.y+yOff);
            for(let i=7;i>=1;i--){
              const bT=i/7, ta=22*bT*(1-ev);
              p.push(); p.translate(0,-bT*18*(1-ev)); p.scale(1+bT*0.035);
              if(darkMode){ p.noFill(); p.stroke(170,150,232,ta); p.strokeWeight(2); }
              else { p.noStroke(); p.fill(170,150,232,ta); }
              p.triangle(-70,-55, 70,-55, 0,80);
              p.pop();
            }
            if(darkMode){ p.noFill(); p.stroke(170,150,232,ev*255); p.strokeWeight(2); }
            else { p.noStroke(); p.fill(170,150,232,ev*255); }
            p.triangle(-70,-55, 70,-55, 0,80);
            p.pop(); p.pop();
          }
        }
      }

      // ף (מאריך)
      _dk='ף';
      if(p15.playing){
        const S=getS();
        const eased=1-Math.pow(1-p15.progress,3);
        const pos=getPos('ף');
        const azlaY=getPos('ך').y;
        applyFill(81,162,221);
        if(currentMode==='רצף'){
          const hk=p.height*0.07*szM(), wk=p.height*0.32*szM();
          p.rect(pos.x-wk*eased, p.height*0.36, wk*eased, hk);
        } else {
          const scx=p.width*(1724/1920)-55, scy=p.height*0.586-50;
          p.push();
          p.translate(scx,scy); p.scale(SOLO_SCALE*szM()); p.translate(-scx,-scy);
          p.rect(pos.x - 150*eased + 150, azlaY-59, 150*eased, 27);
          p.pop();
        }
        p15.progress+=azlaSpeed;
        if(p15.progress>=1){p15.playing=false;p15.progress=0;onEnd('ף');}
      }

      // ש (תרי קדמין)
      _dk='ש';
      if(p14.playing){
        const S=getS();
        const el14=(p.millis()-p14.startMs)/1000;
        const effDur=tariKadminDuration*(currentMode==='בודד'&&currentTradition==='ספרדי'?0.72:1.0);
        if(el14>=effDur){ p14.playing=false; p14.progress=0; onEnd('ש'); }
        else {
          const tRaw=el14/effDur;
          const t=easeInOut(tRaw);
          const r=currentMode==='רצף' ? p.height*0.14*szM() : 95;
          const pos=getPos('ש');
          const grow=p.constrain(p.map(t,0.00,0.38,0,1),0,1);
          const growEase=easeInOut(grow);
          const morph=p.constrain(p.map(t,0.55,1.00,0,1),0,1);
          const m=easeInOutQuint(morph);
          const startA=p.lerp(0,p.radians(130),m);
          const endA=p.lerp(p.TWO_PI,p.radians(310),m);
          applyFill(255,225,55);
          const scx_s=p.width*(1724/1920)-55, scy_s=p.height*0.586-50;
          if(currentMode==='בודד'){ p.push(); p.translate(scx_s,scy_s); p.scale(SOLO_SCALE*szM()); p.translate(-scx_s,-scy_s); }
          p.push();
          p.translate(pos.x, currentMode==='רצף' ? p.height*0.50 : pos.y);
          p.rotate(p.radians(200));
          p.arc(0,0,r*2*growEase,r*2*growEase,startA,endA,p.PIE);
          p.pop();
          if(currentMode==='בודד') p.pop();
        }
      }
    }

    function onEnd(key) {
      if(currentMode==='בודד'){
        const map={'צ':p1,'מ':p2,'נ':p3,'ה':p4,'ב':p5_,'ת':p6,'ך':p7,'ל':p8,'ח':p9,'ע':p10,'כ':p11,'ג':p12,'י':p13,'ש':p14,'ף':p15,'ד':p16};
        if(map[key]) map[key].frozen=true;
      }
      // רצף: seqShapes מטפל במיקום
    }

    // ---- אודיו ----
    const audioZakefSfaradi  = new Audio('sfaradi/zakef-katan.mp3');
    const audioZakefTofim    = new Audio('drums/zakef-katan.m4a');
    const audioEtnachtaSfaradi  = new Audio('sfaradi/etnachta.mp3');
    const audioEtnachtaTofim    = new Audio('drums/etnachta.m4a');
    let etnachtaDuration = 1.7;
    audioEtnachtaSfaradi.addEventListener('loadedmetadata', function() {
      etnachtaDuration = audioEtnachtaSfaradi.duration;
    });
    const audioTabirSfaradi = new Audio('sfaradi/tavir.mp3');
    const audioTabirTofim   = new Audio('drums/tavir.m4a');
    let tabirDuration = 1.5;
    audioTabirSfaradi.addEventListener('loadedmetadata', function() {
      tabirDuration = audioTabirSfaradi.duration;
    });
    const audioShofarMehupachSfaradi = new Audio('sfaradi/shofar-mehupach.mp3');
    const audioShofarMehupachTofim   = new Audio('drums/shofar-mehupach.m4a');
    const audioAzlaSfaradi  = new Audio('sfaradi/azla.mp3');
    const audioAzlaTofim    = new Audio('drums/azla.m4a');
    const audioShneiGereshinSfaradi = new Audio('sfaradi/shnei-gershayim.mp3');
    const audioShneiGereshinTofim   = new Audio('drums/shnei-gershayim.m4a');
    let shneiGereshinDuration = 2.0;
    audioShneiGereshinSfaradi.addEventListener('loadedmetadata', function() {
      shneiGereshinDuration = audioShneiGereshinSfaradi.duration;
    });
    const audioSofPasukSfaradi = new Audio('sfaradi/sof-pasuk.mp3');
    const audioSofPasukTofim   = new Audio('drums/sof-pasuk.m4a');
    const audioRaviyaSfaradi = new Audio('sfaradi/ravia.mp3');
    const audioRaviyaTofim   = new Audio('drums/ravia.m4a');
    const audioTarchaSfaradi = new Audio('sfaradi/tarcha.mp3');
    const audioTarchaTofim   = new Audio('drums/tarcha.m4a');
    let tarchaDuration = 2.0;
    audioTarchaSfaradi.addEventListener('loadedmetadata', function() {
      tarchaDuration = audioTarchaSfaradi.duration;
    });
    const audioYetivSfaradi = new Audio('sfaradi/yativ.mp3');
    const audioYetivTofim   = new Audio('drums/yativ2.m4a');
    const audioYetivAshk    = new Audio('ashkenazi/yativ.mp4');
    const audioYetivMar     = new Audio('morocai/yativ.mp4');
    let yetivDuration = 0.35;
    audioYetivSfaradi.addEventListener('loadedmetadata', function() {
      yetivDuration = audioYetivSfaradi.duration;
    });
    const audioShofarHolechSfaradi = new Audio('sfaradi/shofar-holech.mp3');
    const audioShofarHolechTofim   = new Audio('drums/shofar-holech.m4a');
    const audioShofarHolechAshk    = new Audio('ashkenazi/shofar-holech.mp4');
    const audioShofarHolechMar     = new Audio('morocai/shofar-holech.mp3');
    const audioZarqaSfaradi = new Audio('sfaradi/zarqa.mp3');
    const audioZarqaTofim   = new Audio('drums/zarqa.m4a');
    let zarqaDuration = 2.0;
    audioZarqaSfaradi.addEventListener('loadedmetadata', function() {
      zarqaDuration = audioZarqaSfaradi.duration;
    });
    const audioZakefGadolSfaradi = new Audio('sfaradi/zakef-gadol.mp3');
    const audioZakefGadolTofim   = new Audio('drums/zakef-gadol.m4a');
    let zakefGadolDuration = A1.period;
    audioZakefGadolSfaradi.addEventListener('loadedmetadata', function() {
      zakefGadolDuration = audioZakefGadolSfaradi.duration;
    });
    let zakefDuration = A2.period;
    audioZakefSfaradi.addEventListener('loadedmetadata', function() {
      zakefDuration = audioZakefSfaradi.duration;
    });
    const audioDargaSfaradi = new Audio('sfaradi/darga.mp3');
    const audioDargaTofim   = new Audio('drums/darga.m4a');
    const audioDargaAshk    = new Audio('ashkenazi/darga.mp4');
    const audioDargaMar     = new Audio('morocai/darga.mp4');
    let dargaDuration = 2.0;
    audioDargaSfaradi.addEventListener('loadedmetadata', function() {
      dargaDuration = audioDargaSfaradi.duration;
    });
    const audioMarichSfaradi = new Audio('sfaradi/marich.mp3');
    const audioMarichTofim   = new Audio('drums/marich.m4a');
    const audioMarichAshk      = new Audio('ashkenazi/marich.mp3');
    const audioMarichAshkBoost = new Audio('ashkenazi/marich.mp3');
    const audioMarichMar     = new Audio('morocai/marich.mp4');
    const audioTariKadminSfaradi = new Audio('sfaradi/terei-kadmin.mp3');
    const audioTariKadminTofim   = new Audio('drums/terei-kadmin.m4a');
    const audioTariKadminAshk    = new Audio('ashkenazi/terei-kadmin.mp4');
    const audioTariKadminMar     = new Audio('morocai/terei-kadmin.mp4');
    let tariKadminDuration = 2.0;
    audioTariKadminSfaradi.addEventListener('loadedmetadata', function() {
      tariKadminDuration = audioTariKadminSfaradi.duration;
    });

    // ---- משכי אנימציה לפי נוסח ----
    const TRAD_DURATIONS = {
      'ספרדי':  {'צ':A1.period,'מ':A2.period,'נ':1.7,'ת':1.5,'ב':2.0,'ע':2.0,'כ':2.0,'י':0.35,'ש':2.0,'ף':2.0,'ד':2.0,'ה':2.0,'ך':2.0,'ל':2.0,'ג':2.0},
      'מרוקאי': {'צ':A1.period,'מ':A2.period,'נ':1.7,'ת':1.5,'ב':2.0,'ע':2.0,'כ':2.0,'י':0.35,'ש':2.0,'ף':2.0,'ד':2.0,'ה':2.0,'ך':2.0,'ל':2.0,'ג':2.0},
      'אשכנזי': {'צ':A1.period,'מ':A2.period,'נ':1.7,'ת':1.5,'ב':2.0,'ע':2.0,'כ':2.0,'י':0.35,'ש':2.0,'ף':2.0,'ד':2.0,'ה':2.0,'ך':2.0,'ל':2.0,'ג':2.0},
    };
    function loadDur(trad, key, audio) {
      audio.addEventListener('loadedmetadata', function() {
        TRAD_DURATIONS[trad][key] = audio.duration;
      });
    }

    // ---- אשכנזי ----
    const audioZakefGadolAshk     = new Audio('ashkenazi/zakef-gadol.mp4');
    const audioZakefKatanAshk     = new Audio('ashkenazi/zakef-katan.mp4');
    const audioEtnachtaAshk       = new Audio('ashkenazi/etnachta.mp4');
    const audioSofPasukAshk       = new Audio('ashkenazi/sof-pasuk.mp4');
    const audioShneiGereshinAshk  = new Audio('ashkenazi/shnei-gershayim.mp4');
    const audioTabirAshk          = new Audio('ashkenazi/tavir.mp4');
    const audioAzlaAshk           = new Audio('ashkenazi/azla.mp4');
    const audioShofarMehupachAshk = new Audio('ashkenazi/shofar-mehupach.mp4');
    const audioRaviyaAshk         = new Audio('ashkenazi/ravia.mp4');
    const audioTarchaAshk         = new Audio('ashkenazi/tarcha.mp4');
    const audioZarqaAshk          = new Audio('ashkenazi/zarqa.mp4');

    // ---- מרוקאי ----
    const audioZakefGadolMar     = new Audio('morocai/zakef-gadol.mp4');
    const audioZakefKatanMar     = new Audio('morocai/zakef-katan.mp4');
    const audioEtnachtaMar       = new Audio('morocai/etnachta.mp4');
    const audioSofPasukMar       = new Audio('morocai/sof-pasuk.mp4');
    const audioShneiGereshinMar  = new Audio('morocai/shnei-gershayim.mp4');
    const audioTabirMar          = new Audio('morocai/tavir.mp4');
    const audioAzlaMar           = new Audio('morocai/azla.mp4');
    const audioShofarMehupachMar = new Audio('morocai/shofar-mehupach.mp4');
    const audioRaviyaMar         = new Audio('morocai/ravia.mp4');
    const audioTarchaMar         = new Audio('morocai/tarcha.mp4');
    const audioZarqaMar          = new Audio('morocai/zarqa.mp4');

    // ---- טעינת משכים לפי נוסח ----
    loadDur('ספרדי',  'צ', audioZakefGadolSfaradi);
    loadDur('ספרדי',  'מ', audioZakefSfaradi);
    loadDur('ספרדי',  'נ', audioEtnachtaSfaradi);
    loadDur('ספרדי',  'ת', audioTabirSfaradi);
    loadDur('ספרדי',  'ב', audioShneiGereshinSfaradi);
    loadDur('ספרדי',  'ע', audioTarchaSfaradi);
    loadDur('מרוקאי', 'צ', audioZakefGadolMar);
    loadDur('מרוקאי', 'מ', audioZakefKatanMar);
    loadDur('מרוקאי', 'נ', audioEtnachtaMar);
    loadDur('מרוקאי', 'ת', audioTabirMar);
    loadDur('מרוקאי', 'ב', audioShneiGereshinMar);
    loadDur('מרוקאי', 'ע', audioTarchaMar);
    loadDur('אשכנזי', 'צ', audioZakefGadolAshk);
    loadDur('אשכנזי', 'מ', audioZakefKatanAshk);
    loadDur('אשכנזי', 'נ', audioEtnachtaAshk);
    loadDur('אשכנזי', 'ת', audioTabirAshk);
    loadDur('אשכנזי', 'ב', audioShneiGereshinAshk);
    loadDur('אשכנזי', 'ע', audioTarchaAshk);
    loadDur('ספרדי',  'כ', audioZarqaSfaradi);
    loadDur('מרוקאי', 'כ', audioZarqaMar);
    loadDur('אשכנזי', 'כ', audioZarqaAshk);
    loadDur('ספרדי',  'ש', audioTariKadminSfaradi);
    loadDur('מרוקאי', 'ש', audioTariKadminMar);
    loadDur('אשכנזי', 'ש', audioTariKadminAshk);
    loadDur('ספרדי',  'ף', audioMarichSfaradi);
    loadDur('מרוקאי', 'ף', audioMarichMar);
    loadDur('אשכנזי', 'ף', audioMarichAshk);
    loadDur('ספרדי',  'ד', audioDargaSfaradi);
    loadDur('מרוקאי', 'ד', audioDargaMar);
    loadDur('אשכנזי', 'ד', audioDargaAshk);
    loadDur('ספרדי',  'ה', audioSofPasukSfaradi);
    loadDur('מרוקאי', 'ה', audioSofPasukMar);
    loadDur('אשכנזי', 'ה', audioSofPasukAshk);
    loadDur('ספרדי',  'ך', audioAzlaSfaradi);
    loadDur('מרוקאי', 'ך', audioAzlaMar);
    loadDur('אשכנזי', 'ך', audioAzlaAshk);
    loadDur('ספרדי',  'ל', audioShofarMehupachSfaradi);
    loadDur('מרוקאי', 'ל', audioShofarMehupachMar);
    loadDur('אשכנזי', 'ל', audioShofarMehupachAshk);
    loadDur('ספרדי',  'ג', audioShofarHolechSfaradi);
    loadDur('מרוקאי', 'ג', audioShofarHolechMar);
    loadDur('אשכנזי', 'ג', audioShofarHolechAshk);
    loadDur('מרוקאי', 'י', audioYetivMar);
    loadDur('אשכנזי', 'י', audioYetivAshk);

    updateAnimDurations = function() {
      const d = TRAD_DURATIONS[currentTradition];
      if (!d) return;
      // duration multipliers per tradition
      const dm = {
        'מרוקאי': {'מ':1.4},
        'אשכנזי': {'נ':1.4},
      }[currentTradition] || {};
      if (d['צ'] != null) zakefGadolDuration    = d['צ'];
      if (d['מ'] != null) zakefDuration          = d['מ'] * (dm['מ']||1.0);
      if (d['נ'] != null) etnachtaDuration       = d['נ'] * (dm['נ']||1.0);
      if (d['ת'] != null) tabirDuration          = d['ת'];
      if (d['ב'] != null) shneiGereshinDuration  = d['ב'] * (currentTradition==='ספרדי'?0.88:1.0);
      if (d['ע'] != null) tarchaDuration         = d['ע'];
      if (d['כ'] != null) zarqaDuration          = d['כ'];
      if (d['י'] != null) yetivDuration          = d['י'];
      if (d['ש'] != null) tariKadminDuration     = d['ש'];
      if (d['ד'] != null) dargaDuration             = d['ד'];
      if (d['ה'] != null) sofPasukDuration         = d['ה'];
      if (d['ך'] != null) azlaDuration             = d['ך'];
      if (d['ל'] != null) shofarMehupachDuration   = d['ל'];
      if (d['ג'] != null) shofarHolechDuration     = d['ג'];
      // progress-based speeds
      const sp = {
        'ספרדי':  {sp:0.008, az:0.006, sh:0.009, shR:1.0, rvT:4.8, rvE:1.8},
        'מרוקאי': {sp:0.008, az:0.01,  sh:0.006, shR:1.9, rvT:6.5, rvE:2.8},
        'אשכנזי': {sp:0.005, az:0.01,  sh:0.009, shR:1.0, rvT:4.8, rvE:1.8},
      }[currentTradition] || {sp:0.008, az:0.01, sh:0.009, shR:1.0, rvT:3.3, rvE:1.5};
      sofPasukSpeed     = sp.sp;
      azlaSpeed         = sp.az;
      shofarSpeed       = sp.sh;
      shofarReturnBoost = sp.shR;
      RAVIYA_TOTAL      = sp.rvT;
      RAVIYA_ENTER      = sp.rvE;
      yetivSpeed = (currentTradition==='מרוקאי'||currentTradition==='אשכנזי') ? 0.015 : 0.055;
    };

    stopAllAudio = function() {
      allAudios.forEach(function(a){ a.pause(); a.currentTime=0; });
    };

    // ---- הגברת תופים דרך Web Audio ----
    const audioCtx = new (window.AudioContext||window.webkitAudioContext)({ latencyHint: 'interactive' });
    audioCtx.resume().catch(function(){});
    const tofimGain = audioCtx.createGain();
    const TOFIM_BASE_GAIN = 2.5;
    tofimGain.gain.value = TOFIM_BASE_GAIN;
    window._volFaderTofimGain = tofimGain; window._volFaderTofimBase = TOFIM_BASE_GAIN;
    tofimGain.connect(audioCtx.destination);
    [audioZakefTofim,audioEtnachtaTofim,audioTabirTofim,audioZakefGadolTofim,
     audioAzlaTofim,audioShneiGereshinTofim,audioSofPasukTofim,audioShofarMehupachTofim,audioRaviyaTofim,audioTarchaTofim,audioZarqaTofim,audioShofarHolechTofim,audioYetivTofim,audioTariKadminTofim,audioMarichTofim,audioDargaTofim].forEach(function(a){
      audioCtx.createMediaElementSource(a).connect(tofimGain);
    });

    const marichAshkGain = audioCtx.createGain();
    marichAshkGain.gain.value = 4.0;
    marichAshkGain.connect(audioCtx.destination);
    audioCtx.createMediaElementSource(audioMarichAshkBoost).connect(marichAshkGain);



    // ---- ביטול חסימת אודיו בקליק ראשון ----
    const allAudios = [audioZakefSfaradi,audioEtnachtaSfaradi,audioTabirSfaradi,audioZakefGadolSfaradi,
                       audioShofarMehupachSfaradi,audioAzlaSfaradi,audioShneiGereshinSfaradi,audioSofPasukSfaradi,
                       audioRaviyaSfaradi,audioTarchaSfaradi,audioZarqaSfaradi,audioShofarHolechSfaradi,audioYetivSfaradi,
                       audioZakefTofim,audioEtnachtaTofim,audioTabirTofim,audioZakefGadolTofim,
                       audioAzlaTofim,audioShneiGereshinTofim,audioSofPasukTofim,audioShofarMehupachTofim,audioRaviyaTofim,audioTarchaTofim,audioZarqaTofim,audioShofarHolechTofim,audioYetivTofim,
                       audioZakefGadolAshk,audioZakefKatanAshk,audioEtnachtaAshk,audioSofPasukAshk,
                       audioShneiGereshinAshk,audioTabirAshk,audioAzlaAshk,audioShofarMehupachAshk,audioRaviyaAshk,audioTarchaAshk,audioZarqaAshk,audioShofarHolechAshk,audioYetivAshk,
                       audioZakefGadolMar,audioZakefKatanMar,audioEtnachtaMar,audioSofPasukMar,
                       audioShneiGereshinMar,audioTabirMar,audioAzlaMar,audioShofarMehupachMar,audioRaviyaMar,audioTarchaMar,audioZarqaMar,audioShofarHolechMar,audioYetivMar,
                       audioTariKadminSfaradi,audioTariKadminAshk,audioTariKadminMar,audioTariKadminTofim,
                       audioMarichSfaradi,audioMarichAshk,audioMarichMar,audioMarichTofim,
                       audioDargaSfaradi,audioDargaAshk,audioDargaMar,audioDargaTofim];
    allAudios.forEach(function(a){ a.preload='none'; });

    // אודיו לא נטען מראש — מסיר אוברליי מיד אחרי אתחול
    (function(){
      setTimeout(function(){ if(window._hideLoader) window._hideLoader(); }, 100);
    })();

    let audioReady = false;

    // ---- toast "לחץ להפעיל שמע" אם MIDI מגיע לפני gesture ----
    var _audioToast = (function(){
      var el = document.createElement('div');
      el.style.cssText = 'display:none;position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:9999;' +
        'background:rgba(0,0,0,0.75);color:#fff;font-family:TheBasics,sans-serif;font-size:15px;' +
        'padding:9px 22px;border-radius:50px;pointer-events:none;transition:opacity .3s;white-space:nowrap;';
      el.textContent = 'לחץ כדי להפעיל שמע';
      document.body.appendChild(el);
      var _t;
      return {
        show: function(){ clearTimeout(_t); el.style.display='block'; el.style.opacity='1'; },
        hide: function(){ el.style.opacity='0'; _t=setTimeout(function(){ el.style.display='none'; },300); }
      };
    })();

    function unlockAudio() {
      if(!audioReady) {
        audioCtx.resume().then(function(){
          audioReady = true;
          _audioToast.hide();
        }).catch(function(){
          // MIDI event — not a user gesture on HTTPS; show toast
          _audioToast.show();
        });
      }
    }
    window.addEventListener('load', function(){ audioCtx.resume().catch(function(){}); });
    document.addEventListener('click',    function(){ unlockAudio(); _audioToast.hide(); });
    document.addEventListener('keydown',  function(){ unlockAudio(); _audioToast.hide(); });
    document.addEventListener('touchstart', function(){ unlockAudio(); _audioToast.hide(); }, {passive:true});

    // ---- הפעלת אנימציה לפי מקש (רצף — תמיד ספרדי) ----
    function triggerAnim(k) {
      startAnimOnly(k);
      playTradAudio(k);
      playTofim(k);
    }

  // ---- הפעלת מקש (מקלדת ו-MIDI) ----
    function doKey(k){
      if(!['צ','מ','נ','ה','ב','ת','ך','ל','ח','ע','כ','ג','י','ש','ף','ד'].includes(k)) return;
      lastKey = k;
      if(currentMode==='בודד'){
        resetAnimStates();
        activeKey=k;
        showCanvas();
        updateSoloInfo(k);
      } else {
        if(currentMode==='רצף'){
          const ns={key:k, placedAt:scrollPos, lastLoop:0, sz:seqLastTriggered[k]?.sz??1.0, str:seqLastTriggered[k]?.str??0.0, tradition:currentTradition};
          seqShapes.push(ns);
          seqLastTriggered[k]=ns;
          seqCurrentX[k]=p.width/2;
          updateIpusColor();
                 }
        showCanvas();
      }
      startAnimOnly(k);
      if(currentMode==='בודד') stopAllAudio();
      playTradAudio(k);
      playTofim(k);
    }
    // ---- תופים — תמיד מתנגנים בנפרד ----
    const TOFIM_MAP = {
      'צ':audioZakefGadolTofim, 'מ':audioZakefTofim,     'נ':audioEtnachtaTofim,
      'ה':audioSofPasukTofim,   'ב':audioShneiGereshinTofim,'ת':audioTabirTofim,
      'ך':audioAzlaTofim,       'ל':audioShofarMehupachTofim,'ח':audioRaviyaTofim,'ע':audioTarchaTofim,'כ':audioZarqaTofim,'ג':audioShofarHolechTofim,'י':audioYetivTofim,'ש':audioTariKadminTofim,'ף':audioMarichTofim,'ד':audioDargaTofim,
    };
    function playTofim(k){
      const tf=TOFIM_MAP[k]; if(!tf) return;
      // עיכוב חצי שנייה לסנכרון: מאריך מרוקאי, תרי קדמין אשכנזי
      const delay = (k==='ף'&&currentTradition==='מרוקאי') || (k==='ש'&&currentTradition==='אשכנזי') ? 500 : 0;
      const startAt = (k==='ף'&&currentTradition==='מרוקאי') ? 0.3 : 0;
      if(delay){ setTimeout(function(){ tf.currentTime=startAt; tf.play().catch(function(){}); }, delay); }
      else { tf.currentTime=startAt; tf.play().catch(function(){}); }
    }
    function playTradAudio(k, trad){
      const t = trad || currentTradition;
      const _cv = localStorage.getItem('m_vL');
      const _vol = _cv !== null ? +_cv : 0.7;
      const off=(k==='י'&&(t==='מרוקאי'||t==='אשכנזי'))?0.1:0;
      (TRADITION_AUDIO[t]?.[k]||TRADITION_AUDIO['ספרדי']?.[k]||[]).forEach(function(a){
        a.currentTime=off;
        a.volume=_vol;
        a.play().catch(function(){});
      });
      // הגברת מאריך אשכנזי דרך gain node נפרד
      if(k==='ף' && t==='אשכנזי'){
        audioMarichAshkBoost.currentTime=0;
        audioMarichAshkBoost.play().catch(function(){});
      }
    }

    // ---- מסורת (ללא תופים — מתנגנים נפרד) ----
    const TRADITION_AUDIO = {
      'ספרדי': {
        'צ':[audioZakefGadolSfaradi],  'מ':[audioZakefSfaradi],
        'נ':[audioEtnachtaSfaradi],    'ה':[audioSofPasukSfaradi],
        'ב':[audioShneiGereshinSfaradi],'ת':[audioTabirSfaradi],
        'ך':[audioAzlaSfaradi],        'ל':[audioShofarMehupachSfaradi],
        'ח':[audioRaviyaSfaradi],  'ע':[audioTarchaSfaradi], 'כ':[audioZarqaSfaradi], 'ג':[audioShofarHolechSfaradi], 'י':[audioYetivSfaradi], 'ש':[audioTariKadminSfaradi], 'ף':[audioMarichSfaradi], 'ד':[audioDargaSfaradi],
      },
      'מרוקאי': {
        'צ':[audioZakefGadolMar], 'מ':[audioZakefKatanMar],
        'נ':[audioEtnachtaMar],   'ה':[audioSofPasukMar],
        'ב':[audioShneiGereshinMar],'ת':[audioTabirMar],
        'ך':[audioAzlaMar],       'ל':[audioShofarMehupachMar],
        'ח':[audioRaviyaMar],      'ע':[audioTarchaMar],  'כ':[audioZarqaMar], 'ג':[audioShofarHolechMar], 'י':[audioYetivMar], 'ש':[audioTariKadminMar], 'ף':[audioMarichMar], 'ד':[audioDargaMar],
      },
      'אשכנזי': {
        'צ':[audioZakefGadolAshk], 'מ':[audioZakefKatanAshk],
        'נ':[audioEtnachtaAshk],   'ה':[audioSofPasukAshk],
        'ב':[audioShneiGereshinAshk],'ת':[audioTabirAshk],
        'ך':[audioAzlaAshk],       'ל':[audioShofarMehupachAshk],
        'ח':[audioRaviyaAshk],     'ע':[audioTarchaAshk],  'כ':[audioZarqaAshk], 'ג':[audioShofarHolechAshk], 'י':[audioYetivAshk], 'ש':[audioTariKadminAshk], 'ף':[audioMarichAshk], 'ד':[audioDargaAshk],
      },
    };

    function startAnimOnly(k) {
      if(k==='צ'){p1.playing=true; p1.startMs=p.millis();}
      if(k==='מ'){p2.playing=true; p2.startMs=p.millis();}
      if(k==='נ'){p3.playing=true; p3.startMs=p.millis(); p3.progress=0;}
      if(k==='ה'){p4.playing=true; p4.startMs=p.millis(); p4.progress=0;}
      if(k==='ב'){p5_.playing=true; p5_.startMs=p.millis(); p5_.progress=0;}
      if(k==='ת'){p6.playing=true; p6.startMs=p.millis(); p6.progress=0;}
      if(k==='ך'){p7.playing=true; p7.startMs=p.millis(); p7.progress=0;}
      if(k==='ל'){p8.playing=true; p8.startMs=p.millis(); p8.progress=0;}
      if(k==='ח'){p9.playing=true; p9.startMs=p.millis(); p9Trail=[];}
      if(k==='ע'){p10.playing=true; p10.startMs=p.millis(); p10.progress=0;}
      if(k==='כ'){p11.playing=true; p11.startMs=p.millis(); p11.progress=0;}
      if(k==='ג'){p12.playing=true; p12.startMs=p.millis(); p12.progress=0;}
      if(k==='י'){p13.playing=true; p13.progress=0;}
      if(k==='ש'){p14.playing=true; p14.startMs=p.millis(); p14.progress=0;}
      if(k==='ף'){p15.playing=true; p15.progress=0;}
      if(k==='ד'){p16.playing=true; p16.startMs=p.millis();}
    }

    retriggerSolo = function() {
      allAudios.forEach(function(a){ a.pause(); a.currentTime=0; });
    };

    function flashArrow(id, cls) {
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('arrow-flash-left','arrow-flash-right','arrow-flash-up','arrow-flash-down');
      void el.offsetWidth;
      el.classList.add(cls);
    }
    window.flashArrow = flashArrow;

    document.addEventListener('keydown', function(e){
      if(e.key==='m'||e.key==='M'){
        resetMidiLearn();
        return;
      }
      if(e.key==='ArrowDown') {
        flashArrow('trad-down','arrow-flash-down');
        cycleTrad(1);
        return;
      }

      if(e.key==='1'){ selectTradition('ספרדי'); return; }
      if(e.key==='2'){ selectTradition('מרוקאי'); return; }
      if(e.key==='3'){ selectTradition('אשכנזי'); return; }
      if(e.key==='ArrowRight'){ flashArrow('pnav-next','arrow-flash-right'); if(typeof navPage==='function') navPage(1);  return; }
      if(e.key==='ArrowLeft'){  flashArrow('pnav-prev','arrow-flash-left');  if(typeof navPage==='function') navPage(-1); return; }
      doKey(e.key);
    });

  // ---- ניווט עמודים ----
  (function(){
    const _NP = ['/taamim','/?intro=1','/library','/taamim?seq','/psukkim'];
    const _NI = location.search.includes('seq') ? 3 : 0;
    window._taamNavPage = function(dir){
      const dest = _NP[(_NI + dir + _NP.length) % _NP.length];
      if(dest === '/library' && typeof seqShapes !== 'undefined' && seqShapes.length > 0 && typeof doScreenshotAndNavigate === 'function'){
        doScreenshotAndNavigate(); return;
      }
      window.location.href = dest;
    };
    document.getElementById('pnav-next').addEventListener('click', function(){ window._taamNavPage(1); });
    document.getElementById('pnav-prev').addEventListener('click', function(){ window._taamNavPage(-1); });
  })();

  // ---- MIDI ----
    if(navigator.requestMIDIAccess){
      const NOTE_KEY = {
        38:'נ', 39:'מ', 40:'צ', 41:'ת', 42:'ל', 43:'ך', 44:'ב', 45:'ה',
        46:'כ', 47:'ח', 48:'ג', 49:'ע', 50:'ף', 51:'ש', 52:'ד', 53:'י'
      };
      const TAAM_SET = new Set([38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53]);

      const cantorAudios = [
        audioZakefGadolSfaradi,audioZakefSfaradi,audioEtnachtaSfaradi,audioTabirSfaradi,
        audioShofarMehupachSfaradi,audioAzlaSfaradi,audioShneiGereshinSfaradi,audioSofPasukSfaradi,
        audioRaviyaSfaradi,audioTarchaSfaradi,audioZarqaSfaradi,audioShofarHolechSfaradi,
        audioYetivSfaradi,audioTariKadminSfaradi,audioMarichSfaradi,audioDargaSfaradi,
        audioZakefGadolAshk,audioZakefKatanAshk,audioEtnachtaAshk,audioSofPasukAshk,
        audioShneiGereshinAshk,audioTabirAshk,audioAzlaAshk,audioShofarMehupachAshk,
        audioRaviyaAshk,audioTarchaAshk,audioZarqaAshk,audioShofarHolechAshk,
        audioYetivAshk,audioTariKadminAshk,audioMarichAshk,audioDargaAshk,
        audioZakefGadolMar,audioZakefKatanMar,audioEtnachtaMar,audioSofPasukMar,
        audioShneiGereshinMar,audioTabirMar,audioAzlaMar,audioShofarMehupachMar,
        audioRaviyaMar,audioTarchaMar,audioZarqaMar,audioShofarHolechMar,
        audioYetivMar,audioTariKadminMar,audioMarichMar,audioDargaMar,
      ];
      window._volFaderCantorAudios = cantorAudios;

      const LS = localStorage;

      // איפוס חד-פעמי לברירות מחדל חדשות (vol_v2)
      if(!LS.getItem('vol_v2')){ LS.removeItem('m_vR'); LS.removeItem('m_vL'); LS.setItem('vol_v2','1'); }

      applyFaderVols = function(vR, vL) {
        if(vR != null){
          tofimGain.gain.value = vR * TOFIM_BASE_GAIN;
          LS.setItem('m_vR', vR);
          if(window._volFaderSetL) window._volFaderSetL(vR);
        }
        var cantorVol = (vL != null) ? vL : 0.7;
        cantorAudios.forEach(function(a){ a.volume = cantorVol; });
        if(vL != null){
          LS.setItem('m_vL', vL);
          if(window._volFaderSetR) window._volFaderSetR(vL);
        }
      };

      // ---- ערכים שמורים ----
      let fR   = LS.getItem('m_fR')  !== null ? +LS.getItem('m_fR')  : null; // פיידר תופים
      let fL   = LS.getItem('m_fL')  !== null ? +LS.getItem('m_fL')  : null; // פיידר חזן
      let kR   = LS.getItem('m_kR')  !== null ? +LS.getItem('m_kR')  : null; // נוב stroke
      let kL   = LS.getItem('m_kL')  !== null ? +LS.getItem('m_kL')  : null; // נוב גודל
      let tU   = LS.getItem('m_tU')  !== null ? +LS.getItem('m_tU')  : 60;  // למעלה — CC 60
      let tUt  = LS.getItem('m_tUt') || 'cc';
      let tD   = LS.getItem('m_tD')  !== null ? +LS.getItem('m_tD')  : 62;  // למטה — CC 62
      let tDt  = LS.getItem('m_tDt') || 'cc';
      let nR   = LS.getItem('m_nR')  !== null ? +LS.getItem('m_nR')  : 26;
      let nRt  = LS.getItem('m_nRt') || 'cc';
      let nL   = LS.getItem('m_nL')  !== null ? +LS.getItem('m_nL')  : 27;
      let nLt  = LS.getItem('m_nLt') || 'cc';

      // שחזור ווליום
      tofimGain.gain.value = (LS.getItem('m_vR')!==null ? +LS.getItem('m_vR') : 1) * TOFIM_BASE_GAIN;
      const _vL = LS.getItem('m_vL');
      cantorAudios.forEach(function(a){ a.volume=_vL!==null?+_vL:0.7; });

      function saveM(){
        if(fR !==null) LS.setItem('m_fR', fR);
        if(fL !==null) LS.setItem('m_fL', fL);
        if(kR !==null) LS.setItem('m_kR', kR);
        if(kL !==null) LS.setItem('m_kL', kL);
        if(tU !==null){ LS.setItem('m_tU',tU); LS.setItem('m_tUt',tUt); }
        if(tD !==null){ LS.setItem('m_tD',tD); LS.setItem('m_tDt',tDt); }
        if(nR !==null){ LS.setItem('m_nR',nR); LS.setItem('m_nRt',nRt); }
        if(nL !==null){ LS.setItem('m_nL',nL); LS.setItem('m_nLt',nLt); }
      }

      // ---- רצף למידה (8 שלבים) ----
      const LEARN_LABELS = [
        'הזז פיידר תופים',
        'הזז פיידר חזן',
        'הסב נוב לייט/דארק',
        'הסב נוב גודל צורות',
        'לחץ כפתור למטה (נוסחים)',
        'לחץ כפתור נקה',
        'לחץ כפתור ימינה',
        'לחץ כפתור שמאלה',
      ];
      let learnStep = -1;

      const learnBtn = document.getElementById('trad-learn-btn');

      function updateLearnUI(){
        if(!learnBtn) return;
        if(learnStep < 0 || learnStep >= LEARN_LABELS.length){
          learnBtn.classList.remove('learning');
          learnBtn.textContent = 'הגדר MIDI';
        } else {
          learnBtn.classList.add('learning');
          learnBtn.textContent = (learnStep+1) + '/8 — ' + LEARN_LABELS[learnStep];
        }
      }

      const ALL_M_KEYS = ['m_fR','m_fL','m_kR','m_kL',
        'm_tU','m_tUt','m_tD','m_tDt',
        'm_nR','m_nRt','m_nL','m_nLt','m_vR','m_vL'];

      function startLearn(){
        fR=fL=kR=kL=tU=tD=nR=nL=null;
        tUt=tDt=nRt=nLt=null;
        tofimGain.gain.value = TOFIM_BASE_GAIN;
        cantorAudios.forEach(function(a){ a.volume=1; });
        ALL_M_KEYS.forEach(function(k){ LS.removeItem(k); });
        learnStep = 0;
        updateLearnUI();
      }

      if(learnBtn) learnBtn.addEventListener('click', startLearn);
      resetMidiLearn = startLearn;

      function advanceLearn(val, type){
        switch(learnStep){
          case 0: fR=val; break;
          case 1: if(val===fR) return; fL=val; break;
          case 2: if(val===fR||val===fL) return; kR=val; break;
          case 3: if(val===fR||val===fL||val===kR) return; kL=val; break;
          case 4: tU=val; tUt=type; break;
          case 5: if(val===tU) return; tD=val; tDt=type; break;
          case 6: if(val===tU||val===tD) return; nR=val; nRt=type; break;
          case 7: if(val===nR||val===tU||val===tD) return; nL=val; nLt=type; break;
        }
        saveM();
        learnStep++;
        updateLearnUI();
      }

      function cycleTrad(dir){
        const i=TRADITION_ORDER.indexOf(currentTradition);
        const next=(i+dir+TRADITION_ORDER.length)%TRADITION_ORDER.length;
        selectTradition(TRADITION_ORDER[next]);
      }

      const NAV_PAGES = ['/library','/taamim?seq','/psukkim','/taamim','/'];
      const CURRENT_PAGE_IDX = location.search.includes('seq') ? 1 : 3;
      let _nRprev=false, _nLprev=false, _kRprev=null;
      function navPage(dir){ window._taamNavPage(dir); }

      function onMidiMsg(msg){
        if (document.hidden) return;
        if(typeof _idleReset==='function') _idleReset();
        const [st,note,vel]=msg.data;
        const type = (st&0xF0)===0x90 ? (vel>0?'note_on ':'note_off')
                   : (st&0xF0)===0x80 ? 'note_off'
                   : (st&0xF0)===0xB0 ? 'cc     '
                   : 'other  ';
        const ch = (st&0x0F)+1;
        console.log('[MIDI] '+type+' ch:'+ch+' note/cc:'+note+' vel/val:'+vel);
        unlockAudio();

          // ---- מצב למידה ----
          if(learnStep>=0 && learnStep<8){
            if((st&0xF0)===0xB0){ advanceLearn(note,'cc'); return; }
            if((st&0xF0)===0x90&&vel>0){
              if(TAAM_SET.has(note)){ doKey(NOTE_KEY[note]); return; }
              advanceLearn(note,'note'); return;
            }
            return;
          }

          // ---- מצב רגיל ----
          if((st&0xF0)===0x90&&vel>0){
            if(TAAM_SET.has(note)){ if(typeof window._hidePadGrid==='function') window._hidePadGrid(); if(!location.search.includes('embed')) doKey(NOTE_KEY[note]); return; }
            if(note===tU&&tUt==='note'){ flashArrow('trad-down','arrow-flash-down'); cycleTrad(1);  return; }
            if(note===tD&&tDt==='note'){ doReset(); return; }
            if(note===nR&&nRt==='note'){ if(typeof window._hidePadGrid==='function') window._hidePadGrid(); flashArrow('pnav-prev','arrow-flash-right');  navPage(-1); return; }
            if(note===nL&&nLt==='note'){ if(typeof window._hidePadGrid==='function') window._hidePadGrid(); flashArrow('pnav-next','arrow-flash-left'); navPage(1);  return; }
            return;
          }

          if((st&0xF0)===0xB0){
            const cc=note, val=vel/127;
            if(cc===tU&&tUt==='cc'){ if(val>0.5){ flashArrow('trad-down','arrow-flash-down'); cycleTrad(1); } return; }
            if(cc===tD&&tDt==='cc'){ doReset(); return; }
            if(cc===nR&&nRt==='cc'){ const on=val>0.5; if(on&&!_nRprev){ if(typeof window._hidePadGrid==='function') window._hidePadGrid(); flashArrow('pnav-prev','arrow-flash-right');  navPage(-1); } _nRprev=on; return; }
            if(cc===nL&&nLt==='cc'){ const on=val>0.5; if(on&&!_nLprev){ if(typeof window._hidePadGrid==='function') window._hidePadGrid(); flashArrow('pnav-next','arrow-flash-left'); navPage(1);  } _nLprev=on; return; }
            if(cc===fR){ tofimGain.gain.value=val*TOFIM_BASE_GAIN; LS.setItem('m_vR',val); if(window._volFaderSetL) window._volFaderSetL(val); return; }
            if(cc===fL){ cantorAudios.forEach(function(a){ a.volume=val; }); LS.setItem('m_vL',val); if(window._volFaderSetR) window._volFaderSetR(val); return; }
            if(cc===kR){
              if(_kRprev===null){ _kRprev=val; } else if(Math.abs(val-_kRprev)>2/127){ setDarkMode(val<_kRprev); _kRprev=val; }
              if(lastKey){
                if(currentMode==='רצף'&&seqLastTriggered[lastKey]) seqLastTriggered[lastKey].str=val;
                else { if(!keyProps[lastKey]) keyProps[lastKey]={sz:1,str:0}; keyProps[lastKey].str=val; }
              }
              return;
            }
            if(cc===kL&&lastKey){
              const v=0.2+val*2.8;
              if(currentMode==='רצף'&&seqLastTriggered[lastKey]) seqLastTriggered[lastKey].sz=v;
              else { if(!keyProps[lastKey]) keyProps[lastKey]={sz:1,str:0}; keyProps[lastKey].sz=v; }
              return;
            }
          }
      }

      let midiAccess = null;
      function attachMidiInputs(midi){
        midi.inputs.forEach(function(inp){
          inp.open().then(function(){ inp.onmidimessage=onMidiMsg; }).catch(function(){ inp.onmidimessage=onMidiMsg; });
        });
        midi.outputs.forEach(function(out){
          if(out.name.toUpperCase().includes('STARRY')||out.name.toUpperCase().includes('DONNER')) midiOutput=out;
        });
        if(!midiOutput&&midi.outputs.size>0) midiOutput=midi.outputs.values().next().value;
      }

      navigator.requestMIDIAccess({sysex:false}).then(function(midi){
        midiAccess=midi;
        audioCtx.resume().catch(function(){});
        attachMidiInputs(midi);
        updateMidiStatus();
        setTimeout(setPadColors,600);
        midi.onstatechange=function(e){
          if(e.port.state==='connected'){
            if(e.port.type==='input') e.port.open().then(function(){ e.port.onmidimessage=onMidiMsg; }).catch(function(){ e.port.onmidimessage=onMidiMsg; });
            if(e.port.type==='output'){ midiOutput=e.port; setTimeout(setPadColors,500); }
          }
          if(e.port.state==='disconnected'&&e.port.type==='output') midiOutput=null;
        };
        setInterval(function(){ if(midiAccess) attachMidiInputs(midiAccess); },4000);
        updateLearnUI();
      }).catch(function(err){ console.error('MIDI failed:', err); });
    }
  });

  // ---- עדכון פאנל בודד ----
  function updateSoloInfo(key) {
    const info = KEY_INFO[key] || {};
    document.getElementById('solo-name').textContent       = info.name || '';
    document.getElementById('solo-func').textContent      = info.funcText || '';
    document.getElementById('solo-interp').textContent    = info.graphicText || '';
    document.getElementById('solo-symbol-visual').innerHTML = info.symbolHtml || '';
    document.getElementById('solo-info').classList.add('active');
    document.getElementById('solo-func').style.width = (key==='ל'||key==='ה') ? 'clamp(250px, 23vw, 420px)' : '';
  }

  // ---- בוחר מסורת ----
  document.querySelectorAll('.trad-item').forEach(function(el){
    el.addEventListener('click', function(){ selectTradition(this.dataset.trad); });
  });
  document.getElementById('ipus-btn').addEventListener('click', doReset);
  document.getElementById('trad-down').addEventListener('click', function(){
    const i = TRADITION_ORDER.indexOf(currentTradition);
    const next = (i + 1) % TRADITION_ORDER.length;
    selectTradition(TRADITION_ORDER[next]);
  });


  // ---- אתחול מצב לפי URL param ----
  (function(){
    if(location.search.includes('embed')) {
      document.body.classList.add('embed');
      window.addEventListener('message', function(e) {
        if(e.data && e.data.type === 'loadMelody') {
          if(typeof e.data.dark === 'boolean') setDarkMode(e.data.dark);
          loadMelodyShapes(e.data.shapes, e.data.vR, e.data.vL, e.data.intervals);
        }
        if(e.data && e.data.type === 'stopMelody'){
          stopAllAudio();
          if(window._volFaderCantorAudios) window._volFaderCantorAudios.forEach(function(a){ a.pause(); a.currentTime=0; });
          if(pInst) pInst.noLoop();
        }
      });
    }
    currentMode = location.search.includes('seq') ? 'רצף' : 'בודד';

    // active בניווט
    if(currentMode === 'רצף'){
      document.getElementById('nav-rzf').classList.add('active');
    } else {
      document.getElementById('nav-taamim').classList.add('active');
    }

    // tradition-wrap תמיד מוצג — מיידי, לא תלוי ב-load
    document.getElementById('tradition-wrap').classList.add('visible');

    // במצב רצף — מסתיר pad-grid ומציג קנבס וכיתוב מיד
    if(currentMode === 'רצף') {
      var _pgOv = document.getElementById('pad-grid-overlay');
      if(_pgOv) _pgOv.style.display = 'none';
      document.getElementById('seq-hint').style.display = 'block';
      var _wrapEl = document.getElementById('wrap');
      if(_wrapEl){ _wrapEl.style.display='block'; _wrapEl.style.opacity='1'; }
    }

    // הסתרת איפוס ושמור במצב בודד
    if(currentMode === 'בודד') document.getElementById('ipus-btn').style.visibility = 'hidden';

    // שחזור דארק מוד (?light בURL מאפס לבהיר)
    if(location.search.includes('light')) { setDarkMode(false); }
    else if(sessionStorage.getItem('darkMode') === '1') setDarkMode(true);

    window.addEventListener('load', ()=>{
      if(currentMode==='רצף'){
        el.style.transition='none';
        el.style.top='0'; el.style.left='0'; el.style.transform='none';
        el.style.opacity='1'; el.style.display='block';
        if(pInst) pInst.resizeCanvas(window.innerWidth, window.innerHeight);
        // טעינת ניגון שמור מספריה (ניווט ישיר או embed)
        const _lm = localStorage.getItem('embed_melody') || sessionStorage.getItem('load_melody');
        if(_lm) {
          sessionStorage.removeItem('load_melody');
          localStorage.removeItem('embed_melody');
          try {
            const _mel = JSON.parse(_lm);
            if(_mel && _mel.shapes && _mel.shapes.length > 0) {
              const count = _mel.shapes.length;
              const wW = Math.round(window.innerWidth / 0.8);
              const _itvls3 = _mel.intervals;
              let _pa3 = 0;
              _mel.shapes.forEach(function(s, i) {
                const ns = {key:s.key, placedAt:_pa3, lastLoop:0, sz:s.sz||1.0, str:s.str||0.0, tradition:s.tradition||'ספרדי'};
                seqShapes.push(ns);
                seqLastTriggered[ns.key] = ns;
                if(i < _mel.shapes.length-1) _pa3 += (_itvls3 && _itvls3[i] != null) ? _itvls3[i] : 90;
              });
              scrollPos = wW;
              updateIpusColor();
                         }
          } catch(e) {}
        }
      } else {
        el.style.transition='none';
        el.style.top='0'; el.style.left='0'; el.style.transform='none';
        if(pInst) pInst.resizeCanvas(window.innerWidth, window.innerHeight);
        el.style.display='none';
        setTimeout(()=>{ el.style.transition='opacity 0.3s ease'; }, 50);
      }
    });
  })();

(function(){
    if(location.search.includes('embed')) return;
    var t;
    function doReset(){ sessionStorage.removeItem('darkMode'); localStorage.removeItem('m_vR'); localStorage.removeItem('m_vL'); }
    function reset(){ clearTimeout(t); t=setTimeout(function(){ doReset(); window.location.href='/'; },120000); }
    window._idleReset = reset;
    ['mousemove','keydown','mousedown','touchstart','click'].forEach(function(ev){ document.addEventListener(ev,reset,{passive:true}); });
    document.querySelectorAll('.nav-aodot,.nav-logo-sq').forEach(function(el){ el.addEventListener('click', doReset); });
    reset();
  })();

if(!location.search.includes('embed')){
    var _padP5 = new p5(function(pg){
      var dark, size, gap, cellW, cellH, bc, keys, startT;
      var STAGGER = 0, DUR = 1400;

      function eoc(t){ return 1-Math.pow(1-t,3); }
      function eob(t){ var c=1.70158; return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2); }

      pg.setup = function(){
        dark = document.body.classList.contains('dark');
        var availH = window.innerHeight - 64;
        size = Math.round(Math.min(window.innerWidth * 0.55, availH * 0.82));
        var c = pg.createCanvas(size, size);
        c.parent('pad-preview-container');
        gap = Math.round(size * 0.032);
        cellW = (size - gap*5) / 4;
        cellH = cellW;
        bc = dark ? [60,60,60] : [190,190,190];
        keys = ['ף','ש','ד','י', 'כ','ח','ג','ע', 'ל','ך','ב','ה', 'נ','מ','צ','ת'];
        startT = pg.millis();
      };

      pg._restart = function(){
        dark = document.body.classList.contains('dark');
        bc = dark ? [60,60,60] : [190,190,190];
        startT = pg.millis();
        pg.loop();
      };

      pg.draw = function(){
        dark = document.body.classList.contains('dark');
        bc = dark ? [60,60,60] : [190,190,190];
        var elapsed = pg.millis() - startT;
        pg.background(dark ? '#131111' : '#ffffff');
        for(var i=0;i<16;i++){
          var col=i%4, row=Math.floor(i/4);
          var cellX = gap + col*(cellW+gap);
          var cellY = gap + row*(cellH+gap);
          var cx = cellX + cellW/2, cy = cellY + cellH/2;
          if(dark) pg.fill(19,17,17); else pg.fill(255);
          pg.stroke(bc[0],bc[1],bc[2]); pg.strokeWeight(0.5);
          pg.rect(cellX, cellY, cellW, cellH);
          var t = Math.min(1, Math.max(0, (elapsed - i*STAGGER) / DUR));
          if(t > 0){ pg.noStroke(); drawCell(keys[i], cx, cy, cellH, t); }
        }
        if(elapsed > 15*STAGGER + DUR + 200) pg.noLoop();
      };

      function drawCell(key, cx, cy, H, t){
        var ez = 1.5; H = H*ez; var sf = H*0.009;
        var et = eoc(t), eb = eob(Math.min(1,t*1.1));
        var sw = H*0.006;
        function df(r,g,b,a){
          var bk=(r===0&&g===0&&b===0);
          if(dark){ pg.noFill(); pg.stroke(bk?255:r,bk?255:g,bk?255:b,a||255); pg.strokeWeight(sw); }
          else { if(a!==undefined) pg.fill(r,g,b,a); else pg.fill(r,g,b); pg.noStroke(); }
        }
        switch(key){

          case 'צ':{ // זקף גדול — 3 עיגולים זהב נופלים מלמעלה אחד אחד
            var d=H*0.14; df(255,225,55);
            for(var i=0;i<3;i++){
              var it=Math.min(1,Math.max(0,(t-(i*0.25))/0.6));
              if(it<=0) continue;
              var eit=eoc(it);
              var finalY=cy+20-i*d, startY=cy-H*0.4;
              pg.circle(cx, startY+(finalY-startY)*eit, d);
            } break;}

          case 'מ':{ // זקף קטן — 3 עיגולים כחולים נפרשים שמאלה
            var d=H*0.18, len=d*2; df(81,162,221);
            for(var i=0;i<3;i++){
              var fx=cx+35-i*len/2;
              pg.circle(cx+35+(fx-(cx+35))*et, cy-d/2+15, d);
            } break;}

          case 'נ':{ // אתנח — מלבן אדום גדל מלמטה למעלה
            var wn=sf*7, hn=H*0.28*et;
            df(255,33,33); pg.rect(cx-wn/2, cy+H*0.14-hn, wn, hn); break;}

          case 'ה':{ // סוף פסוק — ריבוע שחור בזום
            var sq=H*0.28*eb;
            df(0,0,0); pg.rectMode(pg.CENTER); pg.rect(cx,cy,sq,sq); pg.rectMode(pg.CORNER); break;}

          case 'ב':{ // שני גרשין — משולש מסתובב פנימה
            var ht=H*0.21, wt=H*0.21; df(238,146,3);
            pg.push(); pg.translate(cx,cy); pg.scale(eb); pg.translate(-cx,-cy);
            pg.triangle(cx-wt/2, cy+ht/2, cx+wt/2, cy+ht/2, cx+wt/2, cy-ht/2);
            pg.pop(); break;}

          case 'ת':{ // תביר — קשת נפרשת משמאל לימין
            var rv=H*0.11, f=rv/75, gv=26*f, cv=24*f, hw=14*f;
            var endA=pg.PI*et; df(170,150,232);
            pg.beginShape();
            for(var a=0;a<=endA;a+=0.04) pg.vertex(cx+Math.cos(a)*(rv+hw), cy+Math.sin(a)*(rv+hw));
            for(var a=endA;a>=0;a-=0.04) pg.vertex(cx+Math.cos(a)*(rv-hw), cy+Math.sin(a)*(rv-hw));
            pg.endShape(pg.CLOSE);
            if(t>0.7){ df(170,150,232); pg.circle(cx, cy+(rv-gv-cv), cv*2*eoc((t-0.7)/0.3)); }
            break;}

          case 'ך':{ // אזלא — ליים גדל מימין לשמאל
            var hk=H*0.07, wk=H*0.32*et;
            df(198,233,2); pg.rect(cx-wk/2, cy-hk/2, wk, hk); break;}

          case 'ג':{ // שופר הולך — כחול גדל משמאל לימין
            var hk=H*0.07, wk=H*0.32*et;
            df(81,162,221); pg.rect(cx-wk/2, cy-hk/2, wk, hk); break;}

          case 'ף':{ // מאריך — כחול גדל ממרכז לצדדים
            var hk=H*0.07, wk=H*0.32*et;
            df(81,162,221); pg.rect(cx-wk/2, cy-hk/2, wk, hk); break;}

          case 'ד':{ // דרגא — משולש נופל מלמעלה
            var s=H*0.21/135; df(170,150,232);
            var dy=(1-et)*(-H*0.3);
            pg.triangle(cx-70*s, cy-55*s+dy, cx+70*s, cy-55*s+dy, cx, cy+80*s+dy); break;}

          case 'ל':{ // שופר מהופך — עיגול חיצוני גדל, פנימי מופיע אחרי
            var t1=Math.min(1,t*1.5), t2=Math.max(0,(t-0.4)/0.6);
            df(81,162,221,127); pg.circle(cx, cy, H*0.28*eoc(t1));
            if(t2>0){ df(81,162,221,255); pg.circle(cx, cy, H*0.14*eob(t2)); }
            break;}

          case 'ח':{ // רביע — שני משולשים יוצאים מהמרכז
            var sW=sf*10.8, sH=H*0.252, gp=-sf*0.72; df(170,150,232);
            var lx=cx-sW-gp/2, rx=cx+gp/2;
            var spread=et;
            var lxA=cx+(lx-cx)*spread, rxA=cx+(rx-cx)*spread;
            pg.triangle(lxA-sW/2,cy, lxA+sW/2,cy-sH/2, lxA+sW/2,cy+sH/2);
            pg.triangle(rxA-sW/2,cy, rxA+sW/2,cy-sH/2, rxA+sW/2,cy+sH/2); break;}

          case 'י':{ // יתיב — פופ בזינוק
            var halfH=H*0.07, ww=H*0.125; df(255,225,55);
            pg.push(); pg.translate(cx,cy); pg.scale(eb); pg.translate(-cx,-cy);
            pg.triangle(cx-ww/2,cy, cx+ww/2,cy-halfH, cx+ww/2,cy+halfH);
            pg.pop(); break;}

          case 'כ':{ // זרקא — משולש עולה מלמטה
            var hw=H*0.15; df(238,146,3);
            var dy=(1-et)*H*0.3;
            pg.triangle(cx, cy-H*0.14+dy, cx-hw, cy+H*0.14+dy, cx+hw, cy+H*0.14+dy); break;}

          case 'ע':{ // טרחא — קשת נפרשת בסיבוב
            var outerR=H*0.21, innerR=outerR*0.72;
            var ox=H*0.08, oy=-H*0.08;
            var startA=pg.PI, endA=pg.HALF_PI+(pg.PI-pg.HALF_PI)*(1-et);
            df(198,233,2);
            pg.beginShape();
            for(var a=pg.PI;a>=endA;a-=0.04) pg.vertex(cx+ox+Math.cos(a)*outerR, cy+oy+Math.sin(a)*outerR);
            for(var a=endA;a<=pg.PI;a+=0.04) pg.vertex(cx+ox+Math.cos(a)*innerR, cy+oy+Math.sin(a)*innerR);
            pg.endShape(pg.CLOSE); break;}

          case 'ש':{ // תרי קדמין — פאי מסתובב ונפתח
            var r=H*0.14; df(255,225,55);
            pg.push(); pg.translate(cx,cy); pg.rotate(pg.radians(200));
            pg.arc(0,0,r*2,r*2,pg.radians(130),pg.radians(130+180*et),pg.PIE);
            pg.pop(); break;}
        }
      }
    });
    window._padP5 = _padP5;
  }

setTimeout(function(){
    setInterval(function(){
      if(typeof window.flashArrow==='function'){
        window.flashArrow('pnav-prev','arrow-flash-left');
        setTimeout(function(){ window.flashArrow('pnav-next','arrow-flash-right'); }, 500);
      }
    }, 5000);
  }, 3000);

  // ---- פדרי עוצמה ----
  (function(){
    var TRACK_H=130, THUMB_H=32, PAD=5, RANGE=TRACK_H-THUMB_H-PAD*2;
    function volToTop(v){ return PAD+(1-v)*RANGE; }
    function topToVol(top){ return 1-Math.max(0,Math.min(1,(top-PAD)/RANGE)); }

    function initFader(faderEl, thumbEl, lsKey, onUpdate){
      var v = localStorage.getItem(lsKey) !== null ? +localStorage.getItem(lsKey) : 1;
      thumbEl.style.top = volToTop(v)+'px';
      onUpdate(v); // סנכרן אודיו לערך השמור מיד בטעינה

      var dragging=false, startY=0, startTop=0;
      function getTop(){ return parseFloat(thumbEl.style.top)||0; }

      faderEl.addEventListener('pointerdown', function(e){
        dragging=true; startY=e.clientY; startTop=getTop();
        faderEl.setPointerCapture(e.pointerId);
      });
      faderEl.addEventListener('pointermove', function(e){
        if(!dragging) return;
        var dy=e.clientY-startY;
        var newTop=Math.max(PAD,Math.min(PAD+RANGE,startTop+dy));
        thumbEl.style.top=newTop+'px';
        var vol=topToVol(newTop);
        localStorage.setItem(lsKey, vol);
        onUpdate(vol);
      });
      faderEl.addEventListener('pointerup', function(){ dragging=false; });
      faderEl.addEventListener('pointercancel', function(){ dragging=false; });
    }

    var _pendingFaderL = null, _pendingFaderR = null;
    window._volFaderSetL = function(v){ _pendingFaderL = v; };
    window._volFaderSetR = function(v){ _pendingFaderR = v; };

    // afterInteractive: defer slightly so React has finished painting
    function _initFaders(){
      var thumbL = document.getElementById('thumb-L');
      var thumbR = document.getElementById('thumb-R');
      if(!thumbL||!thumbR) return;
      window._volFaderSetL = function(v){ thumbL.style.top = volToTop(v)+'px'; };
      window._volFaderSetR = function(v){ thumbR.style.top = volToTop(v)+'px'; };
      if(_pendingFaderL !== null) window._volFaderSetL(_pendingFaderL);
      if(_pendingFaderR !== null) window._volFaderSetR(_pendingFaderR);
      initFader(
        document.getElementById('fader-L'), thumbL, 'm_vR',
        function(v){ localStorage.setItem('m_vR',v); if(window._volFaderTofimGain) window._volFaderTofimGain.gain.value=v*(window._volFaderTofimBase||1); }
      );
      initFader(
        document.getElementById('fader-R'), thumbR, 'm_vL',
        function(v){ localStorage.setItem('m_vL',v); if(window._volFaderCantorAudios) window._volFaderCantorAudios.forEach(function(a){ a.volume=v; }); }
      );
    }
    _initFaders();
    if(!document.getElementById('thumb-L')) setTimeout(_initFaders, 200);
  })();