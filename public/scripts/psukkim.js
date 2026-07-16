if(sessionStorage.getItem('darkMode')==='1') document.body.classList.add('dark');

// ---- אנימציה משותפת ----
  const ANIM_DUR = 500;
  let currentItem = 0; // 0=none, 1=001, 2=002
  let currentTradition = 'ספרדי';
  const TRADITION_ORDER = ['מרוקאי', 'ספרדי', 'אשכנזי'];
  function selectTradition(t) {
    currentTradition = t;
    localStorage.setItem('m_trad', t);
    document.querySelectorAll('#trad-list .trad-item').forEach(function(el){
      el.classList.toggle('active', el.dataset.trad === t);
    });
    if (currentItem !== 0) restartVerse(currentItem);
  }
  function restartVerse(n) {
    stopVerseDrums();
    stopVerseAudio();
    if (n === 1)  stopVerse001();
    if (n === 2)  stopVerse002();
    if (n === 3)  stopVerse003();
    if (n === 4)  stopVerse004();
    if (n === 5)  stopVerse005();
    if (n === 6)  stopVerse006();
    if (n === 7)  stopVerse007();
    if (n === 8)  stopVerse008();
    if (n === 9)  stopVerse009();
    if (n === 10) stopVerse010();
    if (n === 11) stopVerse011();
    if (n === 12) stopVerse012();
    if (n === 13) stopVerse013();
    if (n === 14) stopVerse014();
    if (n === 15) stopVerse015();
    if (n === 16) stopVerse016();
    setTimeout(function() {
      if (currentItem !== n) return;
      if (n === 1)  playVerse001();
      if (n === 2)  playVerse002();
      if (n === 3)  playVerse003();
      if (n === 4)  playVerse004();
      if (n === 5)  playVerse005();
      if (n === 6)  playVerse006();
      if (n === 7)  playVerse007();
      if (n === 8)  playVerse008();
      if (n === 9)  playVerse009();
      if (n === 10) playVerse010();
      if (n === 11) playVerse011();
      if (n === 12) playVerse012();
      if (n === 13) playVerse013();
      if (n === 14) playVerse014();
      if (n === 15) playVerse015();
      if (n === 16) playVerse016();
      playVerseAudio(n);
      playVerseDrums(n);
    }, 0);
  }
  function cycleTrad(dir) {
    const i = TRADITION_ORDER.indexOf(currentTradition);
    const next = (i + dir + TRADITION_ORDER.length) % TRADITION_ORDER.length;
    selectTradition(TRADITION_ORDER[next]);
  }
  function createTraditionWrap() {
    if (document.getElementById('tradition-wrap')) return;
    var wrap = document.createElement('div');
    wrap.id = 'tradition-wrap';
    wrap.style.display = 'flex';
    wrap.innerHTML = '<div id="trad-col"><div id="trad-list">' +
      '<div class="trad-item" data-trad="מרוקאי">מרוקאי</div>' +
      '<div class="trad-item" data-trad="ספרדי">ספרדי</div>' +
      '<div class="trad-item" data-trad="אשכנזי">אשכנזי</div>' +
      '</div><button class="trad-arrow" id="trad-down"><svg width="15" height="9" viewBox="0 0 15 9" fill="none"><polyline points="1.5,1.5 7.5,7.5 13.5,1.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter"/></svg></button></div>';
    document.body.appendChild(wrap);
    wrap.addEventListener('click', function(e){ e.stopPropagation(); });
    wrap.querySelectorAll('.trad-item').forEach(function(el){
      el.addEventListener('click', function(){ selectTradition(this.dataset.trad); });
    });
    wrap.querySelector('#trad-down').addEventListener('click', function(){ cycleTrad(1); });
    wrap.querySelectorAll('.trad-item').forEach(function(el){
      el.classList.toggle('active', el.dataset.trad === currentTradition);
    });
  }
  function removeTraditionWrap() {
    var el = document.getElementById('tradition-wrap');
    if (el) el.parentNode.removeChild(el);
  }

  // ---- תופים פסוקים (רצף קשיח) ----
  const _shofarHolechMar = new Audio('morocai/shofar-holech.mp3');

  const PSK_DRUMS_AUDIO = {
    'נ': new Audio('drums/etnachta.m4a'),
    'מ': new Audio('drums/zakef-katan.m4a'),
    'צ': new Audio('drums/zakef-gadol.m4a'),
    'ת': new Audio('drums/tavir.m4a'),
    'ל': new Audio('drums/shofar-mehupach.m4a'),
    'ך': new Audio('drums/azla.m4a'),
    'ב': new Audio('drums/shnei-gershayim.m4a'),
    'ה': new Audio('drums/sof-pasuk.m4a'),
    'כ': new Audio('drums/zarqa.m4a'),
    'ג': new Audio('drums/shofar-holech.m4a'),
    'י': new Audio('drums/yativ2.m4a'),
    'ח': new Audio('drums/ravia.m4a'),
    'ע': new Audio('drums/tarcha.m4a'),
    'ש': new Audio('drums/terei-kadmin.m4a'),
    'ף': new Audio('drums/marich.m4a'),
    'ד': new Audio('drums/darga.m4a'),
  };
  const VERSE_DRUMS = {
    1:  ['ע','נ','ף','ע','ף','ה'],
    2:  ['ד','כ','ב','ף','ע','נ','ע','ף','ה'],
    3:  ['ג','ח','ל','ך','ג','מ','ע','ג','נ'],
    4:  ['ח','ף','ג','ע','נ','ח','ף','ה'],
    5:  ['ך','ע','נ','ש','ג','מ','י','מ','ך','ע','ך','ה'],
    6:  ['ת','ג','ע','ה'],
    7:  ['ח','ג','נ','ח','ה','ח','ג','נ','ח','ה'],
    8:  ['ף','ע','ה','ך','ד','ת','ע','ה','ך','ל','ך','מ','ף','ע','ה'],
    9:  ['ל','ך','ג','מ','ע','ג','נ','ך','ג','מ','ע','ף','ה'],
    10: ['ע','ג','נ','ף','ע','ף','ה','ח','ף','ש','מ','ע','ג','נ','ג','מ','נ','ף','ה'],
    11: ['ל','ך','כ','נ','ף','ג','ג','נ','ע','ג','ה'],
    12: ['ל','ך','ג','מ','ף','ע','ף','ה'],
    13: ['ה','ע','ף','נ','ע','ף','ת','מ','ג','ש'],
    14: ['ה','ח','ף','נ','ף','ע'],
    15: ['ה','ף','ע','מ','ך','ג'],
    16: ['ה','ע','צ','צ','נ','ע','ף','מ','ש','ג'],
  };
  let _drumsTimers = [];
  let _drumsClones = [];
  let _drumsSeqActive = false;
  const VERSE_DRUM_RATES = {
    1: [1, 1, 1, 1, 1, 1]
  };
  const VERSE_DRUM_DELAYS = {
    1: [0, 850, 1850, 2850, 5850, 6850],
    2: [0, 850, 1850, 3850, 4350, 4850, 5850, 6650, 7150],
    4: [350, 1850, 3650, 4150, 4950, 6650, 7450, 8650],
    5: [350, 850, 2350, 3850, 5350, 6350, 7350, 7850, 9350, 10350, 11650, 12650],
    6: [350, 1850, 2650, 5050],
    8: [350, 1450, 3950, 6650, 7800, 9300, 10800, 12300, 15000, 15700, 16700, 17700, 19400, 20500, 22900],
    9: [350, 900, 1450, 2100, 4100, 5300, 5800, 7300, 8150, 8950, 10400, 13400, 14100],
    10: [350, 1350, 1950, 3150, 3450, 5750, 6750, 8750, 11250, 12250, 12750, 14250, 15750, 16250, 17750, 18850, 20100, 22200, 23550],
    11: [350, 850, 1350, 2650, 3150, 4450, 4850, 5850, 7050, 8050, 8750],
    12: [350, 850, 2550, 3350, 4350, 4850, 6350, 7150],
    7: [350, 1850, 2650, 4050, 4850, 6150, 7450, 8850, 10350, 11350],
    13: [10800, 8700, 7900, 6700, 6000, 5200, 4000, 2000, 1000, 0],
    14: [4450, 3400, 2800, 1800, 1000, 0],
    15: [4150, 3550, 2700, 1650, 900, 0],
    16: [9000, 8000, 6500, 5300, 4200, 3800, 3100, 2000, 1000, 0],
  };
  const VERSE_DRUM_DELAYS_ASH = {
    1: [50, 850, 2650, 3150, 5450, 5650],
    2: [0, 1850, 3850, 5850, 6850, 7650, 9050, 10350, 10850],
    3: [50, 1050, 3000, 3450, 4350, 6150, 7350, 8850, 9350],
    4: [0, 550, 1850, 2350, 3350, 4650, 5500, 6650],
    5: [0, 850, 1350, 3850, 4850, 5850, 7350, 7850, 9350, 10350, 11650, 12350],
    6: [350, 1850, 2650, 4350],
    7: [350, 1350, 2650, 4050, 4850, 7350, 8050, 9350, 11100, 12200],
    8: [250, 1250, 2050, 4550, 5650, 7350, 8450, 9850, 11550, 12350, 13350, 14250, 15250, 15750, 16750],
    9: [350, 950, 2050, 2550, 4350, 5300, 5650, 7150, 8150, 8800, 10250, 11650, 12150],
    10: [500, 1500, 2100, 3300, 3600, 4300, 5000, 6800, 8900, 9500, 9900, 11400, 12600, 13400, 14700, 15800, 17250, 19350, 20500],
    11: [100, 1000, 1500, 2000, 2500, 4200, 5000, 6000, 6500, 7900, 8500],
    12: [500, 1000, 2400, 3200, 4500, 5000, 6500, 7300],
    13: [10800, 8700, 6000, 7900, 6500, 9000, 4000, 2000, 1000, 0],
  };
  const VERSE_DRUM_DELAYS_MAR = {
    1: [250, 850, 2050, 2550, 5350, 5950],
    2: [0, 650, 2150, 4150, 4650, 4850, 5850, 6650, 7150],
    4: [350, 1450, 3050, 4150, 4950, 6650, 7450, 8650],
    5: [350, 850, 2350, 3850, 5350, 6350, 7350, 7850, 9350, 10350, 12050, 12650],
    6: [350, 1850, 2650, 4750],
    7: [250, 1550, 2500, 4050, 4850, 6150, 7450, 8850, 10350, 11350],
    8:  [350, 1450, 3750, 5000, 5300, 7500, 9200, 10800, 12000, 12700, 13900, 14900, 16400, 17500, 19300],
    9: [350, 750, 1750, 1950, 3950, 5300, 5650, 7150, 8150, 8800, 10250, 13250, 13950],
    10: [350, 1350, 1750, 3150, 3450, 5800, 6450, 8100, 9400, 9800, 12650, 13700, 14200, 15400, 16850, 17450, 19000, 20650, 21350],
    11: [350, 850, 2250, 3750, 4250, 5750, 6450, 6950, 8150, 9150, 9850],
    12: [350, 850, 2250, 3050, 4350, 4850, 6350, 7150],
    13: [10000, 9800, 9000, 8200, 7500, 6500, 4900, 3400, 2500, 0],
    14: [6000, 5000, 4400, 2800, 1800, 0],
    16: [10000, 9000, 7500, 5300, 4700, 4200, 3800, 2300, 1000, 0],
  };
  function playVerseDrums(n) {
    stopVerseDrums();
    var keys = VERSE_DRUMS[n];
    if (!keys) return;
    var rates = VERSE_DRUM_RATES[n] || [];
    var _marDelays = currentTradition === 'מרוקאי' && VERSE_DRUM_DELAYS_MAR[n];
    var _ashDelays = currentTradition === 'אשכנזי' && VERSE_DRUM_DELAYS_ASH[n];
    var delays = _marDelays || _ashDelays || VERSE_DRUM_DELAYS[n];
    keys.forEach(function(key, i) {
      var delay = delays ? delays[i] : i * 1000;
      _drumsTimers.push(setTimeout(function() {
        var src = PSK_DRUMS_AUDIO[key];
        if (src) {
          var clone = src.cloneNode();
          clone.playbackRate = rates[i] || 1;
          clone.volume = _pskDrumVol();
          _drumsClones.push(clone);
          clone.play().catch(function(){});
          clone.onended = function() {
            var idx = _drumsClones.indexOf(clone);
            if (idx !== -1) _drumsClones.splice(idx, 1);
          };
        }
      }, delay));
    });
  }
  function stopVerseDrums() {
    _drumsSeqActive = false;
    _drumsTimers.forEach(clearTimeout);
    _drumsTimers = [];
    _drumsClones.forEach(function(c){ try { c.pause(); } catch(e){} c.onended = null; });
    _drumsClones = [];
  }

  // ---- שמע פסוקים לפי נוסח ----
  function _pskDrumVol() { var v=localStorage.getItem('m_vR'); return v!==null?+v:1.0; }
  function _pskCantorVol() { var v=localStorage.getItem('m_vL'); return v!==null?+v:0.7; }

  const VERSE_AUDIO = {
    'ספרדי': {
      1:  new Audio('psukkim-sfaradi/psuk01.mp3'),
      2:  new Audio('psukkim-sfaradi/psuk02.mp3'),
      3:  new Audio('psukkim-sfaradi/psuk03.mp3'),
      4:  new Audio('psukkim-sfaradi/psuk04.mp3'),
      5:  new Audio('psukkim-sfaradi/psuk05.mp3'),
      6:  new Audio('psukkim-sfaradi/psuk06.mp3'),
      7:  new Audio('psukkim-sfaradi/psuk07.mp3'),
      8:  new Audio('psukkim-sfaradi/psuk08.mp3'),
      9:  new Audio('psukkim-sfaradi/psuk09.mp3'),
      10: new Audio('psukkim-sfaradi/psuk10.mp3'),
      11: new Audio('psukkim-sfaradi/psuk11.mp3'),
      12: new Audio('psukkim-sfaradi/psuk12.mp3'),
      13: new Audio('psukkim-sfaradi/psuk13.mp3'),
      14: new Audio('psukkim-sfaradi/psuk14.mp3'),
      15: new Audio('psukkim-sfaradi/psuk15.mp3'),
      16: new Audio('psukkim-sfaradi/psuk16.mp3'),
    },
    'מרוקאי': {
      1:  new Audio('psukkim-morocai/psuk01.mp3'),
      2:  new Audio('psukkim-morocai/psuk02.mp3'),
      3:  new Audio('psukkim-morocai/psuk03.mp3'),
      4:  new Audio('psukkim-morocai/psuk04.mp3'),
      5:  new Audio('psukkim-morocai/psuk05.mp3'),
      6:  new Audio('psukkim-morocai/psuk06.mp3'),
      7:  new Audio('psukkim-morocai/psuk07.mp3'),
      8:  new Audio('psukkim-morocai/psuk08.mp3'),
      9:  new Audio('psukkim-morocai/psuk09.mp3'),
      10: new Audio('psukkim-morocai/psuk10.mp3'),
      11: new Audio('psukkim-morocai/psuk11.mp3'),
      12: new Audio('psukkim-morocai/psuk12.mp3'),
      13: new Audio('psukkim-morocai/psuk13.mp3'),
      14: new Audio('psukkim-morocai/psuk14.mp3'),
      15: new Audio('psukkim-morocai/psuk15.mp3'),
      16: new Audio('psukkim-morocai/psuk16.mp3'),
    },
    'אשכנזי': {
      1:  new Audio('psukkim-ashkenazi/psuk01.mp3'),
      2:  new Audio('psukkim-ashkenazi/psuk02.mp3'),
      3:  new Audio('psukkim-ashkenazi/psuk03.mp3'),
      4:  new Audio('psukkim-ashkenazi/psuk04.mp3'),
      5:  new Audio('psukkim-ashkenazi/psuk05.mp3'),
      6:  new Audio('psukkim-ashkenazi/psuk06.mp3'),
      7:  new Audio('psukkim-ashkenazi/psuk07.mp3'),
      8:  new Audio('psukkim-ashkenazi/psuk08.mp3'),
      9:  new Audio('psukkim-ashkenazi/psuk09.mp3'),
      10: new Audio('psukkim-ashkenazi/psuk10.mp3'),
      11: new Audio('psukkim-ashkenazi/psuk11.mp3'),
      12: new Audio('psukkim-ashkenazi/psuk12.mp3'),
      13: new Audio('psukkim-ashkenazi/psuk13.mp3'),
      14: new Audio('psukkim-ashkenazi/psuk14.mp3'),
      15: new Audio('psukkim-ashkenazi/psuk15.mp3'),
      16: new Audio('psukkim-ashkenazi/psuk16.mp3'),
    }
  };

  // אל תטען אודיו מראש — רק בעת ניגון
  [_shofarHolechMar, ...Object.values(PSK_DRUMS_AUDIO),
   ...[].concat(...Object.values(VERSE_AUDIO).map(t => Object.values(t)))
  ].forEach(function(a){ if(a) a.preload='none'; });

  let _verseAudio = null;
  function playVerseAudio(n) {
    stopVerseAudio();
    const trad = VERSE_AUDIO[currentTradition];
    if (trad && trad[n]) {
      _verseAudio = trad[n];
      _verseAudio.currentTime = 0;
      _verseAudio.volume = currentTradition === 'אשכנזי' ? Math.min(1, _pskCantorVol() * (1/0.7)) : _pskCantorVol();
      _verseAudio.play().catch(function(){});
    }
  }
  function stopVerseAudio() {
    if (_verseAudio) { _verseAudio.pause(); _verseAudio.currentTime = 0; _verseAudio = null; }
  }

  const sources = {
    1:  '[ספר דברים, פרק ו\', פסוק ד\']',
    2:  '[שיר השירים, פרק ג\', פסוק א\']',
    3:  '[שיר השירים, פרק ח\', פסוק ז\']',
    4:  '[תהילים, פרק קכ״א, פסוק א׳]',
    5:  '[ספר שמות, פרק כ׳, פסוק י״א]',
    6:  '[ספר שמות, פרק כ׳, פסוק ז׳]',
    7:  '[תהילים, פרק קכ״א, פסוק ז׳]',
    8:  '[ספר במדבר, פרק ו׳, פס׳ כ״ד-כ״ו]',
    9:  '[ספר בראשית, פרק ב׳, פסוק ב׳]',
    10: '[ספר בראשית, פרק א׳, פס׳ א׳-ב׳]',
    11: '[תהילים, פרק כ״ז, פסוק ב׳]',
    12: '[קהלת, פרק א׳, פסוק ב׳]',
    13: '[שיר השירים, פרק ח׳, פסוק ו׳]',
    14: '[תהילים, פרק צ״א, פסוק א׳]',
    15: '[שיר השירים, פרק ד\', פסוק ז\']',
    16: '[שיר השירים, פרק ח\', פסוק ו\']',
  };

  // animT per item
  const animState = [
    null,
    { t:0, from:0, to:0, start:null },
    { t:0, from:0, to:0, start:null },
    { t:0, from:0, to:0, start:null },
    { t:0, from:0, to:0, start:null },
    { t:0, from:0, to:0, start:null },
    { t:0, from:0, to:0, start:null },
    { t:0, from:0, to:0, start:null },
    { t:0, from:0, to:0, start:null },
    { t:0, from:0, to:0, start:null },
    { t:0, from:0, to:0, start:null },
    { t:0, from:0, to:0, start:null },
    { t:0, from:0, to:0, start:null },
    { t:0, from:0, to:0, start:null },
    { t:0, from:0, to:0, start:null },
    { t:0, from:0, to:0, start:null },
    { t:0, from:0, to:0, start:null },
  ];
  const ALL_ITEMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const MINI_Z    = [null, 4, 3, 2, 1, 1, 1, 2, 1, 5, 4, 2, 1, 1, 1, 1, 1];

  function triggerAnim(n, to) {
    const a = animState[n];
    a.from  = a.t;
    a.to    = to;
    a.start = performance.now();
  }

  function updateAnim(n) {
    const a = animState[n];
    if (a.start === null) return;
    const progress = Math.min(1, (performance.now() - a.start) / ANIM_DUR);
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    a.t = a.from + (a.to - a.from) * ease;
    if (progress >= 1) { a.t = a.to; a.start = null; }
  }

  function lerpV(a, b, t) {
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }

  // ---- 001 ----
  // stateA1: מרכזי צורות במצב מוקטן (rect: x+w/2, y+h/2 ; arc/circle: מרכז)
  const stateA1 = {
    blackSq: { x:168, y:123 },  // rect(134,89,67,67)
    bluBar1: { x:279, y:176 },  // rect(228,167,102,17)
    arc1:    { x:195, y:173 },  // arc center
    bluBar2: { x:279, y:217 },  // rect(228,208,102,18)
    redBar:  { x:99,  y:123 },  // rect(90,89,17,67)
    arc2:    { x:281, y:89  },  // arc center
  };
  // stateB1: מרכזי צורות במצב פתוח (tx+w/2, ty+h/2)
  const stateB1 = {
    blackSq: { x:58,  y:50  },  // tx=24,ty=16
    bluBar1: { x:164, y:25  },  // tx=113,ty=16
    arc1:    { x:291, y:32  },  // arc center
    bluBar2: { x:365, y:25  },  // tx=314,ty=16
    redBar:  { x:448, y:50  },  // tx=439,ty=16
    arc2:    { x:532, y:32  },  // arc center
  };

  function drawScene1(p) {
    updateAnim(1);
    p.clear();
    const t = animState[1].t;

    const blk = lerpV(stateA1.blackSq, stateB1.blackSq, t);
    const bl1 = lerpV(stateA1.bluBar1, stateB1.bluBar1, t);
    const a1  = lerpV(stateA1.arc1,    stateB1.arc1,    t);
    const bl2 = lerpV(stateA1.bluBar2, stateB1.bluBar2, t);
    const red = lerpV(stateA1.redBar,  stateB1.redBar,  t);
    const a2  = lerpV(stateA1.arc2,    stateB1.arc2,    t);

    const sq=67, bw=102, bh1=17, bh2=18, rw=17, rh=67;
    const DUR = 900;
    const now = performance.now();

    anim001.forEach(function(a) {
      if (a.phase === 1) {
        a.t = Math.min(1, (now - a.startTime) / DUR);
        if (a.t >= 1) a.phase = 2;
      }
    });

    function eio(x){ return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2; }
    function eoq(x){ return 1-(1-x)*(1-x); }
    function eoc(x){ return 1-Math.pow(1-x,3); }

    // [5] blackSq — סוף פסוק: רוטט
    {
      const a = anim001[5];
      const vib = a.phase >= 1 ? Math.sin(a.t * p.PI * 24) * (1 - a.t) * 8 : 0;
      df(p, 0, 0, 0);
      p.rectMode(p.CENTER);
      p.rect(blk.x, blk.y, sq + vib, sq + vib);
      p.rectMode(p.CORNER);
    }

    // [4] bluBar1 — מאריך: נבנה שמאלה לימינה
    {
      const pv = anim001[4].phase >= 1 ? eoc(anim001[4].t) : 1;
      df(p, 81, 162, 221);
      p.rect(bl1.x + bw/2 - bw*pv, bl1.y - bh1/2, bw * pv, bh1);
    }

    // [3] arc1 — טרחא: קשת גדלה מ-PI ל-HALF_PI
    {
      if(anim001[3].phase===1) dfArcAnim(p,198,233,2, a1.x,a1.y, 46,43.5, 9, eio(anim001[3].t));
      else dfArc(p,198,233,2, a1.x,a1.y, 46,43.5, p.HALF_PI,p.PI, 9);
    }

    // [2] bluBar2 — מאריך: נבנה שמאלה לימינה
    {
      const pv = anim001[2].phase >= 1 ? eoc(anim001[2].t) : 1;
      df(p, 81, 162, 221);
      p.rect(bl2.x + bw/2 - bw*pv, bl2.y - bh2/2, bw * pv, bh2);
    }

    // [1] redBar — אתנח: גדל מלמעלה למטה
    {
      const pv = anim001[1].phase >= 1 ? eoc(anim001[1].t) : 1;
      df(p, 255, 33, 33);
      p.rect(red.x - rw/2, red.y - rh/2, rw, rh*pv);
    }

    // [0] arc2 — טרחא: קשת גדלה מ-PI ל-HALF_PI
    {
      if(anim001[0].phase===1) dfArcAnim(p,198,233,2, a2.x,a2.y, 46,43.5, 9, eio(anim001[0].t));
      else dfArc(p,198,233,2, a2.x,a2.y, 46,43.5, p.HALF_PI,p.PI, 9);
    }
  }

  new p5(function(p) {
    p.setup = function() { p.pixelDensity(window.devicePixelRatio||1); p.createCanvas(1098, 366).parent('canvas-wrap-001'); };
    p.draw  = function() { drawScene1(p); };
  });

  // ---- 002 ----
  // stateA2: מרכזי הצורות במצב מוקטן (מחושב מ-rect top-left + size/2)
  const stateA2 = {
    blackSq:  { x:182, y:133 },
    bluBar1:  { x:291, y:122 },
    arc1:     { x:345, y:152 },
    redBar:   { x:254, y:187 },
    arc2:     { x:267, y:270 },
    bluBar2:  { x:214, y:244 },
    yelC1:    { x:311, y:239 },
    yelC2:    { x:311, y:273 },
    yelC3:    { x:311, y:307 },
    bluC1:    { x:95,  y:201 },
    bluC2:    { x:129, y:201 },
    bluC3:    { x:163, y:201 },
    grnBar:   { x:129, y:290 },
  };
  // stateB2: מרכזי הצורות במצב פתוח (tx+w/2, ty+h/2)
  const stateB2 = {
    blackSq:  { x:136, y:168 },
    bluBar1:  { x:247, y:143 },
    arc1:     { x:376, y:151 },
    redBar:   { x:414, y:168 },
    arc2:     { x:503, y:151 },
    bluBar2:  { x:582, y:143 },
    yelC1:    { x:676, y:135 },
    yelC2:    { x:676, y:168 },
    yelC3:    { x:676, y:201 },
    bluC1:    { x:739, y:168 },
    bluC2:    { x:771, y:168 },
    bluC3:    { x:803, y:168 },
    grnBar:   { x:900, y:143 },
  };

  function drawScene2(p) {
    updateAnim(2);
    p.clear();
    const t = animState[2].t;

    const blk  = lerpV(stateA2.blackSq, stateB2.blackSq, t);
    const bl1  = lerpV(stateA2.bluBar1, stateB2.bluBar1, t);
    const a1   = lerpV(stateA2.arc1,    stateB2.arc1,    t);
    const red  = lerpV(stateA2.redBar,  stateB2.redBar,  t);
    const a2   = lerpV(stateA2.arc2,    stateB2.arc2,    t);
    const bl2  = lerpV(stateA2.bluBar2, stateB2.bluBar2, t);
    const yc1  = lerpV(stateA2.yelC1,   stateB2.yelC1,   t);
    const yc2  = lerpV(stateA2.yelC2,   stateB2.yelC2,   t);
    const yc3  = lerpV(stateA2.yelC3,   stateB2.yelC3,   t);
    const bc1  = lerpV(stateA2.bluC1,   stateB2.bluC1,   t);
    const bc2  = lerpV(stateA2.bluC2,   stateB2.bluC2,   t);
    const bc3  = lerpV(stateA2.bluC3,   stateB2.bluC3,   t);
    const grn  = lerpV(stateA2.grnBar,  stateB2.grnBar,  t);

    const sq=67, bw=98, bh=16, bw2=97, rw=14, rh=67, gw=102, gh=16, cd=34;
    const DUR2=900; const now2=performance.now();
    anim002.forEach(function(a){if(a.phase===1){a.t=Math.min(1,(now2-a.startTime)/DUR2);if(a.t>=1)a.phase=2;}});
    function eoc2(x){return 1-Math.pow(1-x,3);}
    function eio2(x){return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}

    // [0] grnBar — slideIn
    { const pv=anim002[0].phase>=1?eoc2(anim002[0].t):1;
      df(p,198,233,2); p.rect(grn.x+gw/2-gw*pv, grn.y-gh/2, gw*pv, gh); }

    // [1] bluC group — horizontal spread from rightmost circle
    { const _a=anim002[1];
      if(_a.phase===1){
        const pv=eio2(_a.t);
        df(p,81,162,221);
        [bc1.x,bc2.x,bc3.x].forEach(function(fx){ p.circle(p.lerp(bc3.x,fx,pv),bc1.y,cd); });
      } else {
        df(p,81,162,221); p.circle(bc1.x,bc1.y,cd); p.circle(bc2.x,bc2.y,cd); p.circle(bc3.x,bc3.y,cd);
      } }

    // [2] yelC group — vertical spread from middle circle
    { const _a=anim002[2];
      if(_a.phase===1){
        const pv=eio2(_a.t);
        df(p,255,225,55);
        [yc1.y,yc2.y,yc3.y].forEach(function(fy){ p.circle(yc1.x,p.lerp(yc2.y,fy,pv),cd); });
      } else {
        df(p,255,225,55); p.circle(yc1.x,yc1.y,cd); p.circle(yc2.x,yc2.y,cd); p.circle(yc3.x,yc3.y,cd);
      } }

    // [3] bluBar2 — slideIn
    { const pv=anim002[3].phase>=1?eoc2(anim002[3].t):1;
      df(p,81,162,221); p.rect(bl2.x+bw2/2-bw2*pv, bl2.y-bh/2, bw2*pv, bh); }

    // [4] arc2 — builds from PI toward HALF_PI
    { if(anim002[4].phase===1) dfArcAnim(p,198,233,2, a2.x,a2.y, 47,43.5, 9, eio2(anim002[4].t));
      else dfArc(p,198,233,2, a2.x,a2.y, 47,43.5, p.HALF_PI,p.PI, 9); }

    // [5] redBar — grows from TOP downward
    { const pv=anim002[5].phase>=1?eoc2(anim002[5].t):1;
      df(p,255,33,33); p.rect(red.x-rw/2, red.y-rh/2, rw, rh*pv); }

    // [6] arc1 — builds from PI toward HALF_PI
    { if(anim002[6].phase===1) dfArcAnim(p,198,233,2, a1.x,a1.y, 45.5,44, 9, eio2(anim002[6].t));
      else dfArc(p,198,233,2, a1.x,a1.y, 45.5,44, p.HALF_PI,p.PI, 9); }

    // [7] bluBar1 — slideIn
    { const pv=anim002[7].phase>=1?eoc2(anim002[7].t):1;
      df(p,81,162,221); p.rect(bl1.x+bw/2-bw*pv, bl1.y-bh/2, bw*pv, bh); }

    // [8] blackSq — vibrate
    { const vib=anim002[8].phase>=1?Math.sin(anim002[8].t*p.PI*24)*(1-anim002[8].t)*8:0;
      df(p,0,0,0); p.rectMode(p.CENTER); p.rect(blk.x,blk.y,sq+vib,sq+vib); p.rectMode(p.CORNER); }
  }

  new p5(function(p) {
    p.setup = function() { p.pixelDensity(window.devicePixelRatio||1); p.createCanvas(1098, 366).parent('canvas-wrap-002'); };
    p.draw  = function() { drawScene2(p); };
  });

  // ---- 003 ----
  const stateA3 = {
    redBar:    { x:289, y:85  },  // rect(281,51,16,67)
    bluBarL:   { x:165, y:224 },  // rect(83,215,104,17)
    arc1:      { x:256, y:58  },  // arc center
    triCirc:   { x:100, y:94  },  // leftmost circle center
    bluBarM:   { x:259, y:268 },  // rect(207,259,104,17)
    grnBar:    { x:168, y:172 },  // rect(86,163,104,17)
    dblCirc:   { x:351, y:202 },  // double circle center
    triTri:    { x:233, y:198 },  // leftmost triangle vertex
    bluBarR:   { x:316, y:142 },  // rect(264,133,104,17)
  };
  const stateB3 = {
    redBar:    { x:58,  y:112 },  // tx=50,ty=78
    bluBarL:   { x:162, y:137 },  // tx=110,ty=128
    arc1:      { x:300, y:89  },
    triCirc:   { x:350, y:110 },
    bluBarM:   { x:512, y:137 },  // tx=460,ty=128
    grnBar:    { x:652, y:97 },  // tx=600,ty=128
    dblCirc:   { x:770, y:118 },
    triTri:    { x:840, y:118 },
    bluBarR:   { x:1012,y:137 },  // tx=960,ty=128
  };

  function drawScene3(p) {
    updateAnim(3);
    p.clear();
    const t = animState[3].t;

    const red  = lerpV(stateA3.redBar,  stateB3.redBar,  t);
    const blL  = lerpV(stateA3.bluBarL, stateB3.bluBarL, t);
    const a1   = lerpV(stateA3.arc1,    stateB3.arc1,    t);
    const tc   = lerpV(stateA3.triCirc, stateB3.triCirc, t);
    const blM  = lerpV(stateA3.bluBarM, stateB3.bluBarM, t);
    const grn  = lerpV(stateA3.grnBar,  stateB3.grnBar,  t);
    const dc   = lerpV(stateA3.dblCirc, stateB3.dblCirc, t);
    const tt   = lerpV(stateA3.triTri,  stateB3.triTri,  t);
    const blR  = lerpV(stateA3.bluBarR, stateB3.bluBarR, t);

    const bw=p.lerp(104,114,t), bh=p.lerp(17,19,t), rw=p.lerp(16,18,t), rh=p.lerp(67,74,t), cd=p.lerp(34,37,t), od3=p.lerp(67,74,t), tw3=p.lerp(31,34,t), th3=p.lerp(34,37,t);
    const DUR3=900; const now3=performance.now();
    anim003.forEach(function(a){if(a.phase===1){a.t=Math.min(1,(now3-a.startTime)/DUR3);if(a.t>=1)a.phase=2;}});
    function eoc3(x){return 1-Math.pow(1-x,3);}
    function eio3(x){return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}

    // [0] bluBarR — slideIn
    { const pv=anim003[0].phase>=1?eoc3(anim003[0].t):1;
      df(p,81,162,221); p.rect(blR.x+bw/2-bw*pv, blR.y-bh/2+p.lerp(0,8,t), bw*pv, bh); }

    // [1] triTri — 2 purple triangles (רביע), verse-4 style scaled by 0.8 (s3=1.25 vs s4=1.0)
    { const _tt = anim003[1];
      const ttOX=p.lerp(20,30,t), ttOY=p.lerp(0,10,t);
      if(_tt.phase>=1){
        const pR = Math.min(1, _tt.t*1.5);
        const pL = Math.max(0, Math.min(1, (_tt.t-0.2)*1.5));
        const eR=1-Math.pow(1-pR,3), eL=1-Math.pow(1-pL,3);
        df(p, 170,150,232);
        p.triangle(tt.x+ttOX-1.6+p.lerp(48,0,eR), tt.y+ttOY, tt.x+ttOX+27.2+p.lerp(48,0,eR), tt.y+ttOY-29.6, tt.x+ttOX+27.2+p.lerp(48,0,eR), tt.y+ttOY+29.6);
        p.triangle(tt.x+ttOX-28.8+p.lerp(24,0,eL), tt.y+ttOY, tt.x+ttOX+p.lerp(24,0,eL), tt.y+ttOY-29.6, tt.x+ttOX+p.lerp(24,0,eL), tt.y+ttOY+29.6);
      } else {
        const tw3v=p.lerp(35,28.8,t), th3v=p.lerp(33,29.6,t), gap3v=p.lerp(0,-1.6,t);
        df(p, 170,150,232);
        p.triangle(tt.x+ttOX-tw3v, tt.y+ttOY, tt.x+ttOX, tt.y+ttOY-th3v, tt.x+ttOX, tt.y+ttOY+th3v);
        p.triangle(tt.x+ttOX+gap3v, tt.y+ttOY, tt.x+ttOX+gap3v+tw3v, tt.y+ttOY-th3v, tt.x+ttOX+gap3v+tw3v, tt.y+ttOY+th3v);
      } }

    // [2] dblCirc — שופר מהופך: expand then contract
    { const _dbl3 = anim003[2];
      if(_dbl3.phase>=1){
        const sc3=eoc3(_dbl3.t);
        df(p, 168,208,238); p.circle(dc.x,dc.y, od3*sc3*1.2);
        df(p, 81,162,221);  p.circle(dc.x,dc.y, cd*sc3);
      } else {
        df(p, 168,208,238); p.circle(dc.x,dc.y,od3);
        df(p, 81,162,221);  p.circle(dc.x,dc.y,cd);
      } }

    // [3] grnBar — slideIn
    { const pv=anim003[3].phase>=1?eoc3(anim003[3].t):1;
      df(p,198,233,2); p.rect(grn.x+bw/2-bw*pv, grn.y-bh/2, bw*pv, bh); }

    // [4] bluBarM — slideIn
    { const pv=anim003[4].phase>=1?eoc3(anim003[4].t):1;
      df(p,81,162,221); p.rect(blM.x+bw/2-bw*pv, blM.y-bh/2, bw*pv, bh); }

    // [5] triCirc — horizontal spread from rightmost circle
    { const _a=anim003[5];
      if(_a.phase===1){
        const pv=eio3(_a.t);
        df(p,81,162,221);
        [tc.x,tc.x+cd,tc.x+cd*2].forEach(function(fx){ p.circle(p.lerp(tc.x+cd*2,fx,pv),tc.y,cd); });
      } else {
        df(p,81,162,221); p.circle(tc.x,tc.y,cd); p.circle(tc.x+cd,tc.y,cd); p.circle(tc.x+cd*2,tc.y,cd);
      } }

    // [6] arc1 — builds from PI toward HALF_PI
    { const ar3=p.lerp(46,51,t), arh3=p.lerp(43.5,48,t);
      if(anim003[6].phase===1) dfArcAnim(p,198,233,2, a1.x,a1.y, ar3,arh3, 9, eio3(anim003[6].t));
      else dfArc(p,198,233,2, a1.x,a1.y, ar3,arh3, p.HALF_PI,p.PI, 9); }

    // [7] bluBarL — slideIn
    { const pv=anim003[7].phase>=1?eoc3(anim003[7].t):1;
      df(p,81,162,221); p.rect(blL.x+bw/2-bw*pv, blL.y-bh/2, bw*pv, bh); }

    // [8] redBar — grows from TOP downward
    { const pv=anim003[8].phase>=1?eoc3(anim003[8].t):1;
      df(p,255,33,33); p.rect(red.x-rw/2, red.y-rh/2, rw, rh*pv); }
  }

  new p5(function(p) {
    p.setup = function() { p.pixelDensity(window.devicePixelRatio||1); p.createCanvas(1200, 304).parent('canvas-wrap-003'); };
    p.draw  = function() { drawScene3(p); };
  });

  // ---- 004 ----
  function drawScene4(p) {
    updateAnim(4);
    p.clear();
    const t = animState[4].t;

    function lx(s, e) { return p.lerp(s, e, t); }
    function ly(s, e) { return p.lerp(s, e, t); }

    const DUR4=900; const now4=performance.now();
    anim004.forEach(function(a){if(a.phase===1){a.t=Math.min(1,(now4-a.startTime)/DUR4);if(a.t>=1)a.phase=2;}});
    function eoc4(x){return 1-Math.pow(1-x,3);}
    function eio4(x){return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}

    // [0] triRight — רביע-style, slide from right (bx=1270)
    { const _tr4 = anim004[0];
      const x4=lx(490,1270), y4=ly(485,160);
      if(_tr4.phase>=1){
        const pR4=Math.min(1,_tr4.t*1.5); const pL4=Math.max(0,Math.min(1,(_tr4.t-0.2)*1.5));
        const eR4=1-Math.pow(1-pR4,3), eL4=1-Math.pow(1-pL4,3);
        df(p, 170,150,232);
        p.triangle(x4-2+p.lerp(60,0,eR4),y4, x4+34+p.lerp(60,0,eR4),y4-37, x4+34+p.lerp(60,0,eR4),y4+37);
        p.triangle(x4-36+p.lerp(30,0,eL4),y4, x4+p.lerp(30,0,eL4),y4-37, x4+p.lerp(30,0,eL4),y4+37);
      } else {
        const tw4=p.lerp(52,36,t), th4=p.lerp(49,37,t), gap4=p.lerp(0,-2,t);
        df(p, 170,150,232);
        p.triangle(x4-tw4,y4, x4,y4-th4, x4,y4+th4);
        p.triangle(x4+gap4,y4, x4+gap4+tw4,y4-th4, x4+gap4+tw4,y4+th4);
      } }

    // [1] bluLower — slideIn (bx=1010)
    { const pv=anim004[1].phase>=1?eoc4(anim004[1].t):1;
      df(p,81,162,221); p.rect(lx(178,1010) + 175*(1-pv), ly(500,60), 175*pv, 28); }

    // [2] bluMiddle — slideIn (bx=830)
    { const pv=anim004[2].phase>=1?eoc4(anim004[2].t):1;
      df(p,81,162,221); p.rect(lx(350,830) + 175*(1-pv), ly(360,170), 175*pv, 28); }

    // [3] greenArc — builds from PI toward HALF_PI (bx=770)
    { if(anim004[3].phase===1) dfArcAnim(p,198,233,2, lx(352,770),ly(370,100), 86,86, 17, eio4(anim004[3].t));
      else dfArc(p,198,233,2, lx(352,770),ly(370,100), 86,86, p.HALF_PI,p.PI, 17); }

    // [4] red — grows from TOP downward (bx=600)
    { const pv=anim004[4].phase>=1?eoc4(anim004[4].t):1;
      df(p,255,33,33); p.rect(lx(350,600), ly(190,77), 30, 113*pv); }

    // [5] triLeft — רביע-style, slide from right (bx=535)
    { const _tl4 = anim004[5];
      const xl4=lx(170,515), yl4=ly(420,150);
      if(_tl4.phase>=1){
        const pR4l=Math.min(1,_tl4.t*1.5); const pL4l=Math.max(0,Math.min(1,(_tl4.t-0.2)*1.5));
        const eR4l=1-Math.pow(1-pR4l,3), eL4l=1-Math.pow(1-pL4l,3);
        df(p, 170,150,232);
        p.triangle(xl4-2+p.lerp(60,0,eR4l),yl4, xl4+34+p.lerp(60,0,eR4l),yl4-37, xl4+34+p.lerp(60,0,eR4l),yl4+37);
        p.triangle(xl4-36+p.lerp(30,0,eL4l),yl4, xl4+p.lerp(30,0,eL4l),yl4-37, xl4+p.lerp(30,0,eL4l),yl4+37);
      } else {
        const twl4=p.lerp(52,36,t), thl4=p.lerp(49,37,t), gapl4=p.lerp(0,-2,t);
        df(p, 170,150,232);
        p.triangle(xl4-twl4,yl4, xl4,yl4-thl4, xl4,yl4+thl4);
        p.triangle(xl4+gapl4,yl4, xl4+gapl4+twl4,yl4-thl4, xl4+gapl4+twl4,yl4+thl4);
      } }

    // [6] bluUpper — slideIn (bx=285)
    { const pv=anim004[6].phase>=1?eoc4(anim004[6].t):1;
      df(p,81,162,221); p.rect(lx(120,285) + 175*(1-pv), ly(275,60), 175*pv, 28); }

    // [7] blackSq — vibrate (bx=130), center=(lx(418,130)+65, ly(190,60)+65)
    { const vib4=anim004[7].phase>=1?Math.sin(anim004[7].t*p.PI*24)*(1-anim004[7].t)*8:0;
      const cx4=lx(418,130)+65, cy4=ly(190,60)+65;
      df(p,0,0,0); p.rectMode(p.CENTER); p.rect(cx4,cy4,130+vib4,130+vib4); p.rectMode(p.CORNER); }
  }

  new p5(function(p) {
    p.setup = function() { p.pixelDensity(window.devicePixelRatio||1); p.createCanvas(1450, 690).parent('canvas-wrap-004'); };
    p.draw  = function() { drawScene4(p); };
  });

  // ---- 005 ----
  function drawScene5(p) {
    updateAnim(5);
    p.clear();
    const t = animState[5].t;

    function lx(s, e) { return p.lerp(s, e, t); }
    function ly(s, e) { return p.lerp(s, e, t); }

    const DUR5=900; const now5=performance.now();
    anim005.forEach(function(a){if(a.phase===1){a.t=Math.min(1,(now5-a.startTime)/DUR5);if(a.t>=1)a.phase=2;}});
    function eoc5(x){return 1-Math.pow(1-x,3);}
    function eio5(x){return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}

    // [0] blueLowerRight — אזלא
    { const pv=anim005[0].phase>=1?eoc5(anim005[0].t):1;
      df(p,81,162,221); p.rect(lx(265,810) + 95*(1-pv), ly(267,140), 95*pv, 15); }

    // [1] greenArcLower — טרחא
    { if(anim005[1].phase===1) dfArcAnim(p,198,233,2, lx(298,810),ly(214,154), 42,42, 8, eio5(anim005[1].t));
      else dfArc(p,198,233,2, lx(298,810),ly(214,154), 42,42, p.HALF_PI,p.PI, 8); }

    // [2] red — grows from TOP downward (bx=720)
    { const pv=anim005[2].phase>=1?eoc5(anim005[2].t):1;
      df(p,255,33,33); p.rect(lx(370,720), ly(120,145), 15, 62*pv); }

    // [3] yellowHalf — תרי קדמין: עיגול גדל → מתעצב לחצי עיגול
    { const x5h=lx(109,650), y5h=ly(237,170);
      const _yh5 = anim005[3];
      if(_yh5.phase>=1){
        const pv=_yh5.t;
        const grow=Math.min(1,pv/0.38); const ge=1-(1-grow)*(1-grow);
        const r=82*ge;
        const morph=Math.max(0,(pv-0.55)/0.45);
        const m=morph<0.5?4*morph*morph*morph:1-Math.pow(-2*morph+2,3)/2;
        df(p,255,225,55);
        p.push(); p.translate(x5h,y5h); p.rotate(-p.PI/4);
        if(m<0.02){
          if(r>0.5) p.circle(0,0,r);
        } else {
          p.arc(0,0,r,r,0,p.lerp(p.TWO_PI,p.PI,m),p.PIE);
        }
        p.pop();
      } else {
        df(p, 255,225,55);
        p.push(); p.translate(x5h,y5h); p.rotate(-p.PI/4);
        p.arc(0,0,82,82,0,p.PI,p.PIE);
        p.pop();
      } }

    // [4] blueCenter — slideIn (bx=510)
    { const pv=anim005[4].phase>=1?eoc5(anim005[4].t):1;
      df(p,81,162,221); p.rect(lx(294,510) + 95*(1-pv), ly(203,190), 95*pv, 15); }

    // [5] upperDots — horizontal spread from rightmost circle (bx≈410)
    { const _a=anim005[5];
      const x5=lx(270,410), y5=ly(135,170);
      if(_a.phase===1){
        const pv=eio5(_a.t);
        df(p,81,162,221);
        [x5,x5+32,x5+64].forEach(function(fx){ p.circle(p.lerp(x5+64,fx,pv),y5,31); });
      } else {
        df(p,81,162,221); p.circle(x5,y5,31); p.circle(x5+32,y5,31); p.circle(x5+64,y5,31);
      } }

    // [6] yellowTri — יתיב: slides from right (bx=895)
    { const x5t=lx(228,895), y5t=ly(156,370);
      const _yt5 = anim005[6];
      if(_yt5.phase>=1){
        const e5=1-Math.pow(1-_yt5.t,4);
        const xOff5=p.lerp(40,0,e5);
        df(p, 255,225,55);
        p.triangle(x5t-10+xOff5,y5t, x5t+10+xOff5,y5t-14, x5t+10+xOff5,y5t+14);
      } else {
        df(p, 255,225,55);
        p.triangle(x5t-10,y5t, x5t+10,y5t-14, x5t+10,y5t+14);
      } }

    // [7] lowerDots — horizontal spread from rightmost circle (bx≈785)
    { const _a=anim005[7];
      const x5=lx(171,785), y5=ly(280,370);
      if(_a.phase===1){
        const pv=eio5(_a.t);
        df(p,81,162,221);
        [x5,x5+32,x5+64].forEach(function(fx){ p.circle(p.lerp(x5+64,fx,pv),y5,31); });
      } else {
        df(p,81,162,221); p.circle(x5,y5,31); p.circle(x5+32,y5,31); p.circle(x5+64,y5,31);
      } }

    // [8] blueUpperRight — אזלא
    { const pv=anim005[8].phase>=1?eoc5(anim005[8].t):1;
      df(p,81,162,221); p.rect(lx(259,655) + 95*(1-pv), ly(166,340), 95*pv, 15); }

    // [9] greenArcUpper — טרחא
    { if(anim005[9].phase===1) dfArcAnim(p,198,233,2, lx(188,645),ly(126,354), 42,42, 8, eio5(anim005[9].t));
      else dfArc(p,198,233,2, lx(188,645),ly(126,354), 42,42, p.HALF_PI,p.PI, 8); }

    // [10] blueLeft — אזלא (bx=485)
    { const pv=anim005[10].phase>=1?eoc5(anim005[10].t):1;
      df(p,81,162,221); p.rect(lx(61,485) + 95*(1-pv), ly(184,340), 95*pv, 15); }

    // [11] blackSq — סוף פסוק (bx=395)
    { const vib5=anim005[11].phase>=1?Math.sin(anim005[11].t*p.PI*24)*(1-anim005[11].t)*8:0;
      const cx5=lx(177,395)+31.5, cy5=ly(184,340)+31.5;
      df(p,0,0,0); p.rectMode(p.CENTER); p.rect(cx5,cy5,63+vib5,63+vib5); p.rectMode(p.CORNER); }
  }

  new p5(function(p) {
    p.setup = function() { p.pixelDensity(window.devicePixelRatio||1); p.createCanvas(1300, 500).parent('canvas-wrap-005'); };
    p.draw  = function() { drawScene5(p); };
  });

  // ---- 006 ----
  function drawScene6(p) {
    updateAnim(6);
    p.clear();
    const t = animState[6].t;

    const purple = p.color(170, 150, 232);
    const green  = p.color(198, 233, 2);
    const blue   = p.color(81, 162, 221);

    const DUR6=900; const now6=performance.now();
    anim006.forEach(function(a){if(a.phase===1){a.t=Math.min(1,(now6-a.startTime)/DUR6);if(a.t>=1)a.phase=2;}});
    function eoc6(x){return 1-Math.pow(1-x,3);}
    function eio6(x){return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}

    // [0] purpleArcCircle (בx≈612) — arc+circle always static, dot moves along arc during animation
    { const _a=anim006[0]; const px2=p.lerp(205,612,t), py2=p.lerp(78,82,t), ps=p.lerp(105,142,t);
      dfArc(p,170,150,232, px2,py2, ps/2,ps/2, 0,p.PI, 9.5);
      if(_a.phase===0){ df(p,170,150,232); p.circle(p.lerp(205,612,t), p.lerp(98,108,t), p.lerp(42,55,t)); }
      if(_a.phase>=1){
        const pr6=_a.t;
        let ang6;
        if(pr6<0.65){ const ea6=1-(1-pr6/0.65)*(1-pr6/0.65); ang6=ea6*p.PI; }
        else { ang6=p.PI-(1-(1-(pr6-0.65)/0.35)*(1-(pr6-0.65)/0.35))*p.HALF_PI; }
        const rv6=ps/2, rc6=rv6*0.33;
        df(p, 170,150,232);
        p.circle(px2+rc6*Math.cos(ang6), py2+rc6*Math.sin(ang6), rv6*0.32*2);
      } }

    // [1] blueRect — slideIn (bx=373)
    { const _a=anim006[1]; const pv=_a.phase>=1?eoc6(_a.t):1;
      const w6=p.lerp(116,141,t); df(p,81,162,221); p.rect(p.lerp(139,373,t) + w6*(1-pv), p.lerp(156,142,t), w6*pv, p.lerp(20,23,t)); }

    // [2] greenArc — builds from PI toward HALF_PI (bx=337)
    { const gx=p.lerp(142,337,t), gy=p.lerp(161,100,t), gs=p.lerp(105,112,t);
      if(anim006[2].phase===1) dfArcAnim(p,198,233,2, gx,gy, gs/2,gs/2, 9, eio6(anim006[2].t));
      else dfArc(p,198,233,2, gx,gy, gs/2,gs/2, p.HALF_PI,p.PI, 9); }

    // [3] blackSq (bx=98) — vibrate, center≈(154,109)
    { const vib6=anim006[3].phase>=1?Math.sin(anim006[3].t*p.PI*24)*(1-anim006[3].t)*8:0;
      const sz6=p.lerp(75,112,t);
      const cx6=p.lerp(50,98,t)+sz6/2, cy6=p.lerp(63,53,t)+p.lerp(78,112,t)/2;
      df(p,0,0,0); p.rectMode(p.CENTER); p.rect(cx6,cy6,sz6+vib6,sz6+vib6); p.rectMode(p.CORNER); }
  }

  new p5(function(p) {
    p.setup = function() { p.pixelDensity(window.devicePixelRatio||1); p.createCanvas(760, 230).parent('canvas-wrap-006'); };
    p.draw  = function() { drawScene6(p); };
  });

  // ---- 007 ----
  function drawScene7(p) {
    updateAnim(7);
    p.clear();
    const t = animState[7].t;

    const purple = p.color(170, 150, 232);
    const blue   = p.color(81, 162, 221);
    const red    = p.color(255, 33, 33);
    const black  = p.color(0);
    const offsetA = 380;
    const baselineY = 158;

    const shapes = [
      { type:'rect', ax:123, ay:42,  aw:53, ah:53, bx:74,  by:baselineY-53, bw:53,  bh:53,  c:black  },
      { type:'tri',  ax:20,  ay:94,  aw:24, ah:38, bx:145, by:baselineY-38, bw:24,  bh:38,  c:purple },
      { type:'rect', ax:92,  ay:69,  aw:14, ah:53, bx:220, by:baselineY-53, bw:14,  bh:53,  c:red    },
      { type:'rect', ax:29,  ay:42,  aw:79, ah:14, bx:260, by:baselineY-17, bw:105, bh:17,  c:blue   },
      { type:'tri',  ax:82,  ay:140, aw:24, ah:38, bx:390, by:baselineY-38, bw:24,  bh:38,  c:purple },
      { type:'rect', ax:214, ay:115, aw:53, ah:53, bx:465, by:baselineY-53, bw:53,  bh:53,  c:black  },
      { type:'tri',  ax:144, ay:140, aw:24, ah:38, bx:535, by:baselineY-38, bw:24,  bh:38,  c:purple },
      { type:'rect', ax:193, ay:43,  aw:14, ah:53, bx:615, by:baselineY-53, bw:14,  bh:53,  c:red    },
      { type:'rect', ax:123, ay:109, aw:79, ah:14, bx:655, by:baselineY-17, bw:105, bh:17,  c:blue   },
      { type:'tri',  ax:218, ay:62,  aw:24, ah:38, bx:785, by:baselineY-38, bw:24,  bh:38,  c:purple },
    ];

    const DUR7=900; const now7=performance.now();
    anim007.forEach(function(a){if(a.phase===1){a.t=Math.min(1,(now7-a.startTime)/DUR7);if(a.t>=1)a.phase=2;}});
    function eoc7(x){return 1-Math.pow(1-x,3);}

    // compute animation step per shape (right→left by bx)
    var s7_sortedIdx=shapes.map(function(_,i){return i;}).sort(function(a,b){return shapes[b].bx-shapes[a].bx;});
    var s7_animStep=[]; s7_sortedIdx.forEach(function(origIdx,step){s7_animStep[origIdx]=step;});
    var s7_counter=0;

    for (const s of shapes) {
      const x = p.lerp(offsetA + s.ax, s.bx, t);
      const y = p.lerp(s.ay, s.by, t);
      const w = p.lerp(s.aw, s.bw, t);
      const h = p.lerp(s.ah, s.bh, t);
      const _step=s7_animStep[s7_counter++];
      const _a7=anim007[_step];
      const [r7,g7,b7] = [p.red(s.c),p.green(s.c),p.blue(s.c)];
      if (s.type === 'rect') {
        const isBlk7=(r7===0&&g7===0&&b7===0);
        const _df7=()=>{if(isDark()){p.noFill();p.stroke(isBlk7?255:r7,isBlk7?255:g7,isBlk7?255:b7);p.strokeWeight(2);}else{p.noStroke();p.fill(s.c);}};
        if(isBlk7&&Math.abs(w-h)<2){
          const vib7=_a7.phase>=1?Math.sin(_a7.t*p.PI*24)*(1-_a7.t)*8:0;
          _df7(); p.rectMode(p.CENTER); p.rect(x+w/2,y+h/2,w+vib7,h+vib7); p.rectMode(p.CORNER);
        } else if(w>h){
          const pv7=_a7.phase>=1?eoc7(_a7.t):1;
          _df7(); p.rect(x + w*(1-pv7),y,w*pv7,h);
        } else {
          const pv7=_a7.phase>=1?eoc7(_a7.t):1;
          _df7(); p.rect(x,y,w,h*pv7);
        }
      } else {
        // רביע — 2 משולשים, גודל מצטמצם ממצב א (26) למצב ב (20)
        { const cy7=y+19;
          const tw7=p.lerp(26,20,t), th7=p.lerp(29,20,t), gap7=p.lerp(0,-2,t);
          const _dfT=()=>{if(isDark()){p.noFill();p.stroke(r7===0&&g7===0&&b7===0?255:r7,r7===0&&g7===0&&b7===0?255:g7,r7===0&&g7===0&&b7===0?255:b7);p.strokeWeight(2);}else{p.noStroke();p.fill(s.c);}};
          if(_a7.phase>=1){
            const pR7=Math.min(1,_a7.t*1.5), pL7=Math.max(0,Math.min(1,(_a7.t-0.2)*1.5));
            const eR7=1-Math.pow(1-pR7,3), eL7=1-Math.pow(1-pL7,3);
            _dfT();
            p.triangle(x+24+p.lerp(60,0,eR7),cy7, x+48+p.lerp(60,0,eR7),cy7-25, x+48+p.lerp(60,0,eR7),cy7+25);
            p.triangle(x+p.lerp(30,0,eL7),    cy7, x+24+p.lerp(30,0,eL7),cy7-25, x+24+p.lerp(30,0,eL7),cy7+25);
          } else {
            _dfT();
            p.triangle(x,             cy7, x+tw7,          cy7-th7, x+tw7,          cy7+th7);
            p.triangle(x+tw7+gap7,    cy7, x+tw7*2+gap7,   cy7-th7, x+tw7*2+gap7,   cy7+th7);
          }
        }
      }
    }
  }

  new p5(function(p) {
    p.setup = function() { p.pixelDensity(3); p.createCanvas(1054, 246).parent('canvas-wrap-007'); };
    p.draw  = function() { drawScene7(p); };
  });

  // ---- 008 ----
  function drawScene8(p) {
    updateAnim(8);
    p.clear();
    const t = animState[8].t;

    const green     = p.color(198, 233, 2);
    const blue      = p.color(81, 162, 221);
    const lightBlue = p.color(168, 208, 238);
    const purple    = p.color(170, 150, 232);
    const black     = p.color(0);

    const shapes = [
      { type:'rect',            ax:146, ay:37,  aw:42, ah:44, bx:53,  by:51,  bw:63, bh:64, c:black              },
      { type:'greenArc',        ax:235, ay:40,  aw:72, ah:72, bx:180, by:75,  bw:72, bh:72, c:green              },
      { type:'purpleArcCircle', ax:256, ay:143, aw:60, ah:60, bx:240, by:80,  bw:60, bh:60, c:purple             },
      { type:'z',               ax:276, ay:60,  aw:36, ah:31, bx:300, by:80,  bw:36, bh:36, c:purple             },
      { type:'rect',            ax:63,  ay:75,  aw:67, ah:9,  bx:355, by:51,  bw:96, bh:15, c:green              },
      { type:'rect',            ax:87,  ay:121, aw:43, ah:43, bx:470, by:51,  bw:63, bh:64, c:black              },
      { type:'greenArc',        ax:268, ay:40,  aw:72, ah:72, bx:590, by:75,  bw:72, bh:72, c:green              },
      { type:'rect',            ax:82,  ay:99,  aw:63, ah:9,  bx:600, by:51,  bw:96, bh:15, c:blue               },
      { type:'rect',            ax:221, ay:90,  aw:43, ah:43, bx:50,  by:222, bw:63, bh:64, c:black              },
      { type:'greenArc',        ax:312, ay:98,  aw:72, ah:72, bx:180, by:246, bw:72, bh:72, c:green              },
      { type:'rect',            ax:227, ay:187, aw:65, ah:9,  bx:190, by:224, bw:96, bh:15, c:blue               },
      { type:'threeCircles',    ax:80,  ay:185, aw:22, ah:22, bx:320, by:255, bw:31, bh:31, c:blue               },
      { type:'rect',            ax:144, ay:164, aw:65, ah:10, bx:410, by:224, bw:96, bh:15, c:green              },
      { type:'blueCircle',      ax:177, ay:125, aw:50, ah:24, bx:555, by:255, bw:72, bh:36, c:blue, c2:lightBlue },
      { type:'rect',            ax:144, ay:187, aw:65, ah:10, bx:600, by:224, bw:96, bh:15, c:green              },
    ];

    const DUR8=900; const now8=performance.now();
    anim008.forEach(function(a){if(a.phase===1){a.t=Math.min(1,(now8-a.startTime)/DUR8);if(a.t>=1)a.phase=2;}});
    function eoc8(x){return 1-Math.pow(1-x,3);}
    function eio8(x){return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}

    // s8animStep: top row right→left first, then bottom row right→left
    const s8animStepFixed = [7,6,5,4,3,2,1,0,14,13,12,11,10,9,8];
    var s8_animStep = s8animStepFixed;
    var s8_counter=0;

    for (const s of shapes) {
      const x = p.lerp(s.ax, s.bx, t);
      const y = p.lerp(s.ay, s.by, t);
      const w = p.lerp(s.aw, s.bw, t);
      const h = p.lerp(s.ah, s.bh, t);
      const _step8=s8_animStep[s8_counter++];
      const _a8=anim008[_step8];

      if (s.type === 'rect') {
        const [cr8,cg8,cb8]=[p.red(s.c),p.green(s.c),p.blue(s.c)];
        const isBlackSq=(cr8===0&&cg8===0&&cb8===0&&Math.abs(w-h)<2);
        if(isBlackSq){
          const vib8=_a8.phase>=1?Math.sin(_a8.t*p.PI*24)*(1-_a8.t)*8:0;
          if(isDark()){p.noFill();p.stroke(255);p.strokeWeight(2);}else{p.noStroke();p.fill(s.c);}
          p.rectMode(p.CENTER); p.rect(x+w/2,y+h/2,w+vib8,h+vib8); p.rectMode(p.CORNER);
        } else if(s.bw>s.bh){
          // slideIn
          const pv8=_a8.phase>=1?eoc8(_a8.t):1;
          if(isDark()){p.noFill();p.stroke(cr8===0&&cg8===0&&cb8===0?255:cr8,cr8===0&&cg8===0&&cb8===0?255:cg8,cr8===0&&cg8===0&&cb8===0?255:cb8);p.strokeWeight(2);}else{p.noStroke();p.fill(s.c);}
          p.rect(x + w*(1-pv8), y, w*pv8, h);
        } else {
          // growDown (top to bottom)
          const pv8=_a8.phase>=1?eoc8(_a8.t):1;
          if(isDark()){p.noFill();p.stroke(cr8===0&&cg8===0&&cb8===0?255:cr8,cr8===0&&cg8===0&&cb8===0?255:cg8,cr8===0&&cg8===0&&cb8===0?255:cb8);p.strokeWeight(2);}else{p.noStroke();p.fill(s.c);}
          p.rect(x, y, w, h*pv8);
        }
      }
      if (s.type === 'greenArc') {
        if(_a8.phase===1) dfArcAnim(p, p.red(s.c), p.green(s.c), p.blue(s.c), x, y, w/2, w/2, 7, eio8(_a8.t));
        else dfArc(p, p.red(s.c), p.green(s.c), p.blue(s.c), x, y, w/2, w/2, p.HALF_PI, p.PI, 7);
      }
      if (s.type === 'purpleArcCircle') {
        dfArc(p, p.red(s.c), p.green(s.c), p.blue(s.c), x, y, w/2, w/2, 0, p.PI, 5);
        if(_a8.phase===0){
          df(p,170,150,232); p.circle(x, y+w*0.233, w*0.35);
        } else {
          const pr8p=_a8.t; let ang8p;
          if(pr8p<0.65){const ea8p=1-(1-pr8p/0.65)*(1-pr8p/0.65);ang8p=ea8p*p.PI;}
          else{ang8p=p.PI-(1-(1-(pr8p-0.65)/0.35)*(1-(pr8p-0.65)/0.35))*p.HALF_PI;}
          const rv8p=w/2, rc8p=rv8p*0.33;
          df(p,170,150,232); p.circle(x+rc8p*Math.cos(ang8p), y+rc8p*Math.sin(ang8p), rv8p*0.32*2);
        }
      }
      if (s.type === 'z') {
        const [cr8z,cg8z,cb8z]=[p.red(s.c),p.green(s.c),p.blue(s.c)];
        const ev8z=_a8.phase>=1?1-Math.pow(1-eoc8(_a8.t),1):1;
        const yOff8z=_a8.phase>=1?p.lerp(-40,0,ev8z):0;
        const yy8z=y+yOff8z;
        if(isDark()){p.noFill();p.stroke(cr8z===0&&cg8z===0&&cb8z===0?255:cr8z,cr8z===0&&cg8z===0&&cb8z===0?255:cg8z,cr8z===0&&cg8z===0&&cb8z===0?255:cb8z);p.strokeWeight(2);}else{p.noStroke();p.fill(s.c);}
        p.triangle(x - w*0.2, yy8z, x + w*1.2, yy8z, x+w/2, yy8z+h);
      }
      if (s.type === 'threeCircles') {
        const [cr8t,cg8t,cb8t]=[p.red(s.c),p.green(s.c),p.blue(s.c)];
        function _df8t(){if(isDark()){p.noFill();p.stroke(cr8t===0&&cg8t===0&&cb8t===0?255:cr8t,cr8t===0&&cg8t===0&&cb8t===0?255:cg8t,cr8t===0&&cg8t===0&&cb8t===0?255:cb8t);p.strokeWeight(2);}else{p.noStroke();p.fill(s.c);}}
        if(_a8.phase>=1){
          const pv8t=eio8(_a8.t); _df8t();
          [x,x+w,x+w*2].forEach(function(fx){ p.circle(p.lerp(x+w*2,fx,pv8t),y,w); });
        } else { _df8t(); p.circle(x,y,w); p.circle(x+w,y,w); p.circle(x+w*2,y,w); }
      }
      if (s.type === 'blueCircle') {
        if(_a8.phase>=1){
          const sc8=eoc8(_a8.t);
          df(p,168,208,238); p.circle(x,y,w*sc8*1.2);
          df(p,81,162,221);  p.circle(x,y,h*sc8);
        } else {
          df(p, 168, 208, 238); p.circle(x, y, w);
          df(p, 81, 162, 221);  p.circle(x, y, h);
        }
      }
    }
  }

  new p5(function(p) {
    p.setup = function() { p.pixelDensity(3); p.createCanvas(860, 360).parent('canvas-wrap-008'); };
    p.draw  = function() { drawScene8(p); };
  });

  // ---- 009 ----
  function drawScene9(p) {
    updateAnim(9);
    p.clear();
    const t = animState[9].t;

    const blue      = p.color(81, 162, 221);
    const lightBlue = p.color(168, 208, 238);
    const green     = p.color(198, 233, 2);
    const red       = p.color(255, 33, 33);
    const black     = p.color(0);

    const DUR9=900; const now9=performance.now();
    anim009.forEach(function(a){if(a.phase===1){a.t=Math.min(1,(now9-a.startTime)/DUR9);if(a.t>=1)a.phase=2;}});
    function eoc9(x){return 1-Math.pow(1-x,3);}
    function eio9(x){return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}
    // code call order → animation step (top row right→left first, then bottom row right→left)
    const s009callToStep=[6,5,4,3,2,1,0,12,11,10,9,8,7];
    var s9_call=0;
    function s9step(){return s009callToStep[s9_call++];}

    function rct(ax,ay,aw,ah, bx,by,bw,bh, c) {
      const _st=s9step(); const _a9=anim009[_st];
      const rx=p.lerp(ax,bx,t), ry=p.lerp(ay,by,t), rw9=p.lerp(aw,bw,t), rh9=p.lerp(ah,bh,t);
      const [cr,cg,cb]=[p.red(c),p.green(c),p.blue(c)];
      const isBlk=(cr===0&&cg===0&&cb===0);
      if(isBlk&&rw9===rh9||Math.abs(rw9-rh9)<2){
        // vibrate (square black)
        const vib9=_a9.phase>=1?Math.sin(_a9.t*p.PI*24)*(1-_a9.t)*8:0;
        if(isDark()){p.noFill();p.stroke(255);p.strokeWeight(2);}else{p.noStroke();p.fill(c);}
        p.rectMode(p.CENTER); p.rect(rx+rw9/2,ry+rh9/2,rw9+vib9,rh9+vib9); p.rectMode(p.CORNER);
      } else if(rw9>rh9){
        // slideIn
        const pv9=_a9.phase>=1?eoc9(_a9.t):1;
        if(isDark()){p.noFill();p.stroke(isBlk?255:cr,isBlk?255:cg,isBlk?255:cb);p.strokeWeight(2);}else{p.noStroke();p.fill(c);}
        p.rect(rx + rw9*(1-pv9),ry,rw9*pv9,rh9);
      } else {
        // growDown (top to bottom)
        const pv9=_a9.phase>=1?eoc9(_a9.t):1;
        if(isDark()){p.noFill();p.stroke(isBlk?255:cr,isBlk?255:cg,isBlk?255:cb);p.strokeWeight(2);}else{p.noStroke();p.fill(c);}
        p.rect(rx,ry,rw9,rh9*pv9);
      }
    }
    function arc_(ax,ay,aw,ah,asw, bx,by,bw,bh,bsw, c) {
      const _st=s9step(); const _a9=anim009[_st];
      const cx=p.lerp(ax,bx,t), cy=p.lerp(ay,by,t);
      const rw=p.lerp(aw,bw,t)/2, rh=p.lerp(ah,bh,t)/2;
      const hw=p.lerp(asw,bsw,t)/2;
      if(_a9.phase===1) dfArcAnim(p, p.red(c), p.green(c), p.blue(c), cx, cy, rw, rh, hw, eio9(_a9.t));
      else dfArc(p, p.red(c), p.green(c), p.blue(c), cx, cy, rw, rh, p.HALF_PI, p.PI, hw);
    }
    function three(ax,ay,ad, bx,by,bd, c) {
      const _st=s9step(); const _a9=anim009[_st];
      const x=p.lerp(ax,bx,t), y=p.lerp(ay,by,t), d=p.lerp(ad,bd,t);
      const [cr,cg,cb]=[p.red(c),p.green(c),p.blue(c)];
      function _df9(){if(isDark()){p.noFill();p.stroke(cr===0&&cg===0&&cb===0?255:cr,cr===0&&cg===0&&cb===0?255:cg,cr===0&&cg===0&&cb===0?255:cb);p.strokeWeight(2);}else{p.noStroke();p.fill(c);}}
      if(_a9.phase>=1){
        const pv=eio9(_a9.t); _df9();
        [x,x+d,x+d*2].forEach(function(fx){ p.ellipse(p.lerp(x+d*2,fx,pv),y,d,d); });
      } else { _df9(); p.ellipse(x,y,d,d); p.ellipse(x+d,y,d,d); p.ellipse(x+d*2,y,d,d); }
    }
    function dbl(ax,ay,ao,ai, bx,by,bo,bi, c1,c2) {
      const _st=s9step(); const _a9=anim009[_st];
      const x=p.lerp(ax,bx,t), y=p.lerp(ay,by,t), o=p.lerp(ao,bo,t), i=p.lerp(ai,bi,t);
      const [cr1,cg1,cb1]=[p.red(c1),p.green(c1),p.blue(c1)];
      const [cr2,cg2,cb2]=[p.red(c2),p.green(c2),p.blue(c2)];
      if(_a9.phase>=1){
        const sc9=eoc9(_a9.t);
        if(isDark()){p.noFill();p.stroke(cr1===0&&cg1===0&&cb1===0?255:cr1,cr1===0&&cg1===0&&cb1===0?255:cg1,cr1===0&&cg1===0&&cb1===0?255:cb1);p.strokeWeight(2);}else{p.noStroke();p.fill(c1);}
        p.ellipse(x,y,o*sc9*1.2,o*sc9*1.2);
        if(isDark()){p.noFill();p.stroke(cr2===0&&cg2===0&&cb2===0?255:cr2,cr2===0&&cg2===0&&cb2===0?255:cg2,cr2===0&&cg2===0&&cb2===0?255:cb2);p.strokeWeight(2);}else{p.noStroke();p.fill(c2);}
        p.ellipse(x,y,i*sc9,i*sc9);
      } else {
        if(isDark()){p.noFill();p.stroke(cr1===0&&cg1===0&&cb1===0?255:cr1,cr1===0&&cg1===0&&cb1===0?255:cg1,cr1===0&&cg1===0&&cb1===0?255:cb1);p.strokeWeight(2);}else{p.noStroke();p.fill(c1);}
        p.ellipse(x,y,o,o);
        if(isDark()){p.noFill();p.stroke(cr2===0&&cg2===0&&cb2===0?255:cr2,cr2===0&&cg2===0&&cb2===0?255:cg2,cr2===0&&cg2===0&&cb2===0?255:cb2);p.strokeWeight(2);}else{p.noStroke();p.fill(c2);}
        p.ellipse(x,y,i,i);
      }
    }

    rct( 322, 91,14,58,   95, 20, 22, 92, red);
    rct( 153, 94,88,14,  149, 89,138, 23, blue);
    arc_(155, 87,84,84,16, 389, 43,122,122,20, green);
    three(91,160,29,  443, 66, 46, blue);
    rct( 212, 67,88,14,  589, 89,137, 23, blue);
    rct(  95, 66,88,14,  740, 20,135, 23, green);
    dbl( 282,124,54,27,  952, 66, 81, 41, lightBlue,blue);
    rct( 183,120,58,58,   61,260, 91, 91, black);
    rct( 252,164,88,14,  204,260,136, 23, blue);
    arc_(351,187,86,86,16, 471,285,122,122,20, green);
    three(226,204,29, 540,307, 45, blue);
    rct(  78,218,88,14,  711,330,136, 23, blue);
    rct( 110,189,87,14,  884,261,136, 23, green);
  }

  new p5(function(p) {
    p.setup = function() { p.pixelDensity(window.devicePixelRatio||1); p.createCanvas(1100, 402).parent('canvas-wrap-009'); };
    p.draw  = function() { drawScene9(p); };
  });

  // ---- 010 ----
  function drawScene10(p) {
    updateAnim(10);
    p.clear();
    const t = animState[10].t;

    const blue   = p.color(81, 162, 221);
    const green  = p.color(198, 233, 2);
    const red    = p.color(255, 33, 33);
    const purple = p.color(170, 150, 232);
    const yellow = p.color(255, 225, 55);
    const black  = p.color(0);

    const DUR10=900; const now10=performance.now();
    anim010.forEach(function(a){if(a.phase===1){a.t=Math.min(1,(now10-a.startTime)/DUR10);if(a.t>=1)a.phase=2;}});
    function eoc10(x){return 1-Math.pow(1-x,3);}
    function eio10(x){return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}
    // code call order → animation step (top row right→left first, then bottom row right→left)
    const s010callToStep=[9,8,7,6,5,4,3,2,1,0,18,17,16,15,14,13,12,11,10];
    var s10_call=0;
    function s10step(){return s010callToStep[s10_call++];}

    function rct(ax,ay,aw,ah, bx,by,bw,bh, c) {
      const _st=s10step(); const _a10=anim010[_st];
      const rx=p.lerp(ax,bx,t), ry=p.lerp(ay,by,t), rw10=p.lerp(aw,bw,t), rh10=p.lerp(ah,bh,t);
      const [cr,cg,cb]=[p.red(c),p.green(c),p.blue(c)];
      const isBlk=(cr===0&&cg===0&&cb===0);
      if(isBlk&&Math.abs(rw10-rh10)<2){
        const vib10=_a10.phase>=1?Math.sin(_a10.t*p.PI*24)*(1-_a10.t)*8:0;
        if(isDark()){p.noFill();p.stroke(255);p.strokeWeight(2);}else{p.noStroke();p.fill(c);}
        p.rectMode(p.CENTER); p.rect(rx+rw10/2,ry+rh10/2,rw10+vib10,rh10+vib10); p.rectMode(p.CORNER);
      } else if(rw10>rh10){
        const pv10=_a10.phase>=1?eoc10(_a10.t):1;
        if(isDark()){p.noFill();p.stroke(isBlk?255:cr,isBlk?255:cg,isBlk?255:cb);p.strokeWeight(2);}else{p.noStroke();p.fill(c);}
        p.rect(rx + rw10*(1-pv10),ry,rw10*pv10,rh10);
      } else {
        // growDown (top to bottom)
        const pv10=_a10.phase>=1?eoc10(_a10.t):1;
        if(isDark()){p.noFill();p.stroke(isBlk?255:cr,isBlk?255:cg,isBlk?255:cb);p.strokeWeight(2);}else{p.noStroke();p.fill(c);}
        p.rect(rx,ry,rw10,rh10*pv10);
      }
    }
    function three(ax,ay,ad, bx,by,bd, c) {
      const _st=s10step(); const _a10=anim010[_st];
      const x=p.lerp(ax,bx,t), y=p.lerp(ay,by,t), d=p.lerp(ad,bd,t);
      const [cr,cg,cb]=[p.red(c),p.green(c),p.blue(c)];
      function _df10(){if(isDark()){p.noFill();p.stroke(cr===0&&cg===0&&cb===0?255:cr,cr===0&&cg===0&&cb===0?255:cg,cr===0&&cg===0&&cb===0?255:cb);p.strokeWeight(2);}else{p.noStroke();p.fill(c);}}
      if(_a10.phase>=1){
        const pv=eio10(_a10.t); _df10();
        [x,x+d,x+d*2].forEach(function(fx){ p.ellipse(p.lerp(x+d*2,fx,pv),y,d,d); });
      } else { _df10(); p.ellipse(x,y,d,d); p.ellipse(x+d,y,d,d); p.ellipse(x+d*2,y,d,d); }
    }
    function purpleTri(ax,ay, bx,by) {
      const _st=s10step(); const _a10=anim010[_st];
      // purpleTri animation (רביע — 2 triangles, right slides first)
      const x10=p.lerp(ax,bx,t), y10=p.lerp(ay,by,t);
      if(_a10.phase>=1){
        const pR=Math.min(1,_a10.t*1.5), pL=Math.max(0,Math.min(1,(_a10.t-0.2)*1.5));
        const eR=1-Math.pow(1-pR,3), eL=1-Math.pow(1-pL,3);
        df(p, 170,150,232);
        p.triangle(x10+34+p.lerp(60,0,eR),y10, x10+69+p.lerp(60,0,eR),y10-37, x10+69+p.lerp(60,0,eR),y10+37);
        p.triangle(x10+p.lerp(30,0,eL),y10, x10+36+p.lerp(30,0,eL),y10-37, x10+36+p.lerp(30,0,eL),y10+37);
      } else {
        const tw10=p.lerp(31,36,t), th10=p.lerp(34,37,t), gap10=p.lerp(0,-2,t);
        df(p, 170,150,232);
        p.triangle(x10,            y10, x10+tw10,          y10-th10, x10+tw10,          y10+th10);
        p.triangle(x10+tw10+gap10, y10, x10+tw10*2+gap10,  y10-th10, x10+tw10*2+gap10,  y10+th10);
      }
    }
    function halfCirc(ax,ay,ad,aa, bx,by,bd,ba, c) {
      const _st=s10step(); const _a10=anim010[_st];
      const x=p.lerp(ax,bx,t), y=p.lerp(ay,by,t), d=p.lerp(ad,bd,t), a=p.lerp(aa,ba,t);
      const [cr,cg,cb]=[p.red(c),p.green(c),p.blue(c)];
      if(isDark()){p.noFill();p.stroke(cr===0&&cg===0&&cb===0?255:cr,cr===0&&cg===0&&cb===0?255:cg,cr===0&&cg===0&&cb===0?255:cb);p.strokeWeight(2);}else{p.noStroke();p.fill(c);}
      if(_a10.phase>=1){
        const pv=_a10.t;
        const grow=Math.min(1,pv/0.38); const ge=1-(1-grow)*(1-grow);
        const r=d*ge;
        const morph=Math.max(0,(pv-0.55)/0.45);
        const m=morph<0.5?4*morph*morph*morph:1-Math.pow(-2*morph+2,3)/2;
        p.push(); p.translate(x,y); p.rotate(p.radians(a));
        if(m<0.05){
          if(r>0.5) p.circle(0,0,r);
        } else {
          p.arc(0,0,r,r,-p.HALF_PI,p.lerp(p.PI*1.5,p.HALF_PI,m),p.PIE);
        }
        p.pop();
      } else {
        p.push(); p.translate(x,y); p.rotate(p.radians(a));
        p.arc(0,0,d,d,-p.HALF_PI,p.HALF_PI,p.PIE);
        p.pop();
      }
    }
    function arc_(ax,ay,aw,ah,asw, bx,by,bw,bh,bsw, c) {
      const _st=s10step(); const _a10=anim010[_st];
      const cx=p.lerp(ax,bx,t), cy=p.lerp(ay,by,t);
      const rw=p.lerp(aw,bw,t)/2, rh=p.lerp(ah,bh,t)/2;
      const hw=p.lerp(asw,bsw,t)/2;
      if(_a10.phase===1) dfArcAnim(p, p.red(c), p.green(c), p.blue(c), cx, cy, rw, rh, hw, eio10(_a10.t));
      else dfArc(p, p.red(c), p.green(c), p.blue(c), cx, cy, rw, rh, p.HALF_PI, p.PI, hw);
    }

    halfCirc(300,267,91,38.82,  70,135,91,38.82, yellow);
    rct(144,90,113,18,   144, 80,150,25, blue);
    purpleTri(186,193, 316,145);
    rct(52,70,74,74,     451, 80,101,101, black);
    rct(144,127,113,18,  589, 80,150,25, blue);
    arc_(332,83,112,112,22,   810,115,112,112,22, green);
    rct(284,164,111,18,  828, 80,150,25, blue);
    rct(62,157,18,73,   1012, 80, 24,101, red);
    rct(284,203,111,18, 1086,155,150, 25, blue);
    arc_(421,243,112,112,22,  1328,125,112,112,22, green);
    rct(181,234,76,76,    24,375,101,101, black);
    rct(28,242,112,18,   174,372,150, 25, blue);
    arc_(85,272,112,112,22,   431,410,112,112,22, green);
    three(80,290,37, 500,420,50, blue);
    rct(134,323,114,18,  667,455,150, 25, blue);
    rct(404,157,18,73,   871,380, 24,101, red);
    rct(308,323,113,18,  954,455,150, 25, blue);
    arc_(158,165,112,112,22,  1202,410,112,112,22, green);
    three(333,109,37, 1260,420,50, blue);
  }

  new p5(function(p) {
    p.setup = function() { p.pixelDensity(window.devicePixelRatio||1); p.createCanvas(1544, 525).parent('canvas-wrap-010'); };
    p.draw  = function() { drawScene10(p); };
  });

  // ---- 011 ----
  function drawScene11(p) {
    updateAnim(11);
    p.clear();
    const t = animState[11].t;

    const blue      = p.color(81, 162, 221);
    const lightBlue = p.color(168, 208, 238);
    const green     = p.color(198, 233, 2);
    const red       = p.color(255, 33, 33);
    const orange    = p.color(238, 146, 3);
    const black     = p.color(0);

    const DUR11=900; const now11=performance.now();
    anim011.forEach(function(a){if(a.phase===1){a.t=Math.min(1,(now11-a.startTime)/DUR11);if(a.t>=1)a.phase=2;}});
    function eoc11(x){return 1-Math.pow(1-x,3);}
    function eio11(x){return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}
    const s011callToStep=[10,9,8,7,6,5,4,3,2,1,0,0];
    var s11_call=0;
    function s11step(){return s011callToStep[s11_call++];}

    function rct(ax,ay,aw,ah, bx,by,bw,bh, c) {
      const _st=s11step(); const _a11=anim011[_st];
      const rx=p.lerp(ax,bx,t), ry=p.lerp(ay,by,t), rw11=p.lerp(aw,bw,t), rh11=p.lerp(ah,bh,t);
      const [cr,cg,cb]=[p.red(c),p.green(c),p.blue(c)];
      const isBlk=(cr===0&&cg===0&&cb===0);
      if(isBlk&&Math.abs(rw11-rh11)<2){
        const vib11=_a11.phase>=1?Math.sin(_a11.t*p.PI*24)*(1-_a11.t)*8:0;
        if(isDark()){p.noFill();p.stroke(255);p.strokeWeight(2);}else{p.noStroke();p.fill(c);}
        p.rectMode(p.CENTER); p.rect(rx+rw11/2,ry+rh11/2,rw11+vib11,rh11+vib11); p.rectMode(p.CORNER);
      } else if(rw11>rh11){
        const pv11=_a11.phase>=1?eoc11(_a11.t):1;
        if(isDark()){p.noFill();p.stroke(isBlk?255:cr,isBlk?255:cg,isBlk?255:cb);p.strokeWeight(2);}else{p.noStroke();p.fill(c);}
        p.rect(rx + rw11*(1-pv11),ry,rw11*pv11,rh11);
      } else {
        // growDown (top to bottom)
        const pv11=_a11.phase>=1?eoc11(_a11.t):1;
        if(isDark()){p.noFill();p.stroke(isBlk?255:cr,isBlk?255:cg,isBlk?255:cb);p.strokeWeight(2);}else{p.noStroke();p.fill(c);}
        p.rect(rx,ry,rw11,rh11*pv11);
      }
    }
    function circ(ax,ay,aw,ah, bx,by,bw,bh, c) {
      const _st=s11step(); const _a11=anim011[_st];
      const ex=p.lerp(ax,bx,t), ey=p.lerp(ay,by,t), ew=p.lerp(aw,bw,t), eh=p.lerp(ah,bh,t);
      const [cr,cg,cb]=[p.red(c),p.green(c),p.blue(c)];
      function _df11c(){if(isDark()){p.noFill();p.stroke(cr===0&&cg===0&&cb===0?255:cr,cr===0&&cg===0&&cb===0?255:cg,cr===0&&cg===0&&cb===0?255:cb);p.strokeWeight(2);}else{p.noStroke();p.fill(c);}}
      if(_a11.phase>=1){
        const sc11=eoc11(_a11.t);
        const isOuter11=(ew>70);
        _df11c(); p.ellipse(ex,ey,ew*sc11*(isOuter11?1.2:1),eh*sc11*(isOuter11?1.2:1));
      } else { _df11c(); p.ellipse(ex,ey,ew,eh); }
    }
    function tri(ax1,ay1,ax2,ay2,ax3,ay3, bx1,by1,bx2,by2,bx3,by3, c) {
      const _st=s11step(); const _a11=anim011[_st];
      const tx1=p.lerp(ax1,bx1,t),ty1=p.lerp(ay1,by1,t);
      const tx2=p.lerp(ax2,bx2,t),ty2=p.lerp(ay2,by2,t);
      const tx3=p.lerp(ax3,bx3,t),ty3=p.lerp(ay3,by3,t);
      const [cr,cg,cb]=[p.red(c),p.green(c),p.blue(c)];
      if(isDark()){p.noFill();p.stroke(cr===0&&cg===0&&cb===0?255:cr,cr===0&&cg===0&&cb===0?255:cg,cr===0&&cg===0&&cb===0?255:cb);p.strokeWeight(2);}else{p.noStroke();p.fill(c);}
      if(_a11.phase>=1){
        const pv=_a11.t;
        const eased=1-Math.pow(1-pv,3);
        const sph=pv<0.85?pv/0.85*0.5:pv<0.95?0.5+(pv-0.85)/0.1*0.5:1;
        const stretch=1+Math.sin(sph*p.PI)*0.18;
        const bx_c=(tx2+tx3)/2, by_c=(ty2+ty3)/2;
        const curTop=p.lerp(by_c,ty1,eased);
        p.push();
        p.translate(bx_c,by_c); p.scale(1,stretch);
        p.triangle(tx1-bx_c,curTop-by_c, tx2-bx_c,0, tx3-bx_c,0);
        p.pop();
      } else { p.triangle(tx1,ty1, tx2,ty2, tx3,ty3); }
    }
    function arc_(ax,ay,aw,ah,ath, bx,by,bw,bh,bth, c) {
      const _st=s11step(); const _a11=anim011[_st];
      const cx=p.lerp(ax,bx,t), cy=p.lerp(ay,by,t), w=p.lerp(aw,bw,t), h=p.lerp(ah,bh,t), th=p.lerp(ath,bth,t);
      const [cr,cg,cb]=[p.red(c),p.green(c),p.blue(c)];
      if(_a11.phase===1) dfArcAnim(p,cr,cg,cb, cx,cy, w/2,h/2, th, eio11(_a11.t));
      else dfArc(p,cr,cg,cb, cx,cy, w/2,h/2, p.HALF_PI,p.PI, th);
    }

    rct(154,160,78,76,   88,166,104,105, black);
    rct(68,120,116,21,  217,243,158, 28, blue);
    arc_(269,102,112,112,11,  465,210,112,112,11, green);
    rct(117,201,18,78,  500,166, 28,105, red);
    rct(251,215,116,21, 562,243,156, 28, blue);
    rct(154,258,116,20, 745,243,158, 28, blue);
    rct(152,72,118,19,  926,166,158, 28, blue);
    rct(386,164,20,76, 1112,166, 26,105, red);
    tri(310,119,263,199,356,199, 1226,166,1165,271,1288,271, orange);
    rct(291,258,115,20, 1313,166,157, 28, green);
    circ(368,102,78,78, 1549,219,104,104, lightBlue);
    circ(368,102,38,38, 1549,219, 52, 52, blue);
  }

  new p5(function(p) {
    p.setup = function() { p.pixelDensity(window.devicePixelRatio||1); p.createCanvas(1684, 360).parent('canvas-wrap-011'); };
    p.draw  = function() { drawScene11(p); };
  });

  // ---- 012 ----
  function drawScene12(p) {
    updateAnim(12);
    p.clear();
    const t = animState[12].t;

    const blue      = p.color(81, 162, 221);
    const lightBlue = p.color(168, 208, 238);
    const green     = p.color(198, 233, 2);
    const black     = p.color(0);

    const DUR12=900; const now12=performance.now();
    anim012.forEach(function(a){if(a.phase===1){a.t=Math.min(1,(now12-a.startTime)/DUR12);if(a.t>=1)a.phase=2;}});
    function eoc12(x){return 1-Math.pow(1-x,3);}
    function eio12(x){return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}
    const s012callToStep=[7,6,5,4,3,2,1,0];
    var s12_call=0;
    function s12step(){return s012callToStep[s12_call++];}

    function rct(ax,ay,aw,ah, bx,by,bw,bh, c) {
      const _st=s12step(); const _a12=anim012[_st];
      const rx=p.lerp(ax,bx,t), ry=p.lerp(ay,by,t), rw12=p.lerp(aw,bw,t), rh12=p.lerp(ah,bh,t);
      const [cr,cg,cb]=[p.red(c),p.green(c),p.blue(c)];
      const isBlk=(cr===0&&cg===0&&cb===0);
      if(isBlk&&Math.abs(rw12-rh12)<2){
        const vib12=_a12.phase>=1?Math.sin(_a12.t*p.PI*24)*(1-_a12.t)*8:0;
        if(isDark()){p.noFill();p.stroke(255);p.strokeWeight(2);}else{p.noStroke();p.fill(c);}
        p.rectMode(p.CENTER); p.rect(rx+rw12/2,ry+rh12/2,rw12+vib12,rh12+vib12); p.rectMode(p.CORNER);
      } else {
        const pv12=_a12.phase>=1?eoc12(_a12.t):1;
        if(isDark()){p.noFill();p.stroke(isBlk?255:cr,isBlk?255:cg,isBlk?255:cb);p.strokeWeight(2);}else{p.noStroke();p.fill(c);}
        p.rect(rx + rw12*(1-pv12),ry,rw12*pv12,rh12);
      }
    }
    function three(ax,ay,ad, bx,by,bd, c) {
      const _st=s12step(); const _a12=anim012[_st];
      const x=p.lerp(ax,bx,t), y=p.lerp(ay,by,t), d=p.lerp(ad,bd,t);
      const [cr,cg,cb]=[p.red(c),p.green(c),p.blue(c)];
      function _df12(){if(isDark()){p.noFill();p.stroke(cr===0&&cg===0&&cb===0?255:cr,cr===0&&cg===0&&cb===0?255:cg,cr===0&&cg===0&&cb===0?255:cb);p.strokeWeight(2);}else{p.noStroke();p.fill(c);}}
      if(_a12.phase>=1){
        const pv=eio12(_a12.t); _df12();
        [x,x+d,x+d*2].forEach(function(fx){ p.ellipse(p.lerp(x+d*2,fx,pv),y,d,d); });
      } else { _df12(); p.ellipse(x,y,d,d); p.ellipse(x+d,y,d,d); p.ellipse(x+d*2,y,d,d); }
    }
    function dbl(ax,ay,ao,ai, bx,by,bo,bi, c1,c2) {
      const _st=s12step(); const _a12=anim012[_st];
      const x=p.lerp(ax,bx,t), y=p.lerp(ay,by,t), o=p.lerp(ao,bo,t), i=p.lerp(ai,bi,t);
      const [cr1,cg1,cb1]=[p.red(c1),p.green(c1),p.blue(c1)];
      const [cr2,cg2,cb2]=[p.red(c2),p.green(c2),p.blue(c2)];
      if(_a12.phase>=1){
        const sc12=eoc12(_a12.t);
        if(isDark()){p.noFill();p.stroke(cr1===0&&cg1===0&&cb1===0?255:cr1,cr1===0&&cg1===0&&cb1===0?255:cg1,cr1===0&&cg1===0&&cb1===0?255:cb1);p.strokeWeight(2);}else{p.noStroke();p.fill(c1);}
        p.ellipse(x,y,o*sc12*1.2,o*sc12*1.2);
        if(isDark()){p.noFill();p.stroke(cr2===0&&cg2===0&&cb2===0?255:cr2,cr2===0&&cg2===0&&cb2===0?255:cg2,cr2===0&&cg2===0&&cb2===0?255:cb2);p.strokeWeight(2);}else{p.noStroke();p.fill(c2);}
        p.ellipse(x,y,i*sc12,i*sc12);
      } else {
        if(isDark()){p.noFill();p.stroke(cr1===0&&cg1===0&&cb1===0?255:cr1,cr1===0&&cg1===0&&cb1===0?255:cg1,cr1===0&&cg1===0&&cb1===0?255:cb1);p.strokeWeight(2);}else{p.noStroke();p.fill(c1);}
        p.ellipse(x,y,o,o);
        if(isDark()){p.noFill();p.stroke(cr2===0&&cg2===0&&cb2===0?255:cr2,cr2===0&&cg2===0&&cb2===0?255:cg2,cr2===0&&cg2===0&&cb2===0?255:cb2);p.strokeWeight(2);}else{p.noStroke();p.fill(c2);}
        p.ellipse(x,y,i,i);
      }
    }
    function arc_(ax,ay,aw,ah,ath, bx,by,bw,bh,bth, c) {
      const _st=s12step(); const _a12=anim012[_st];
      const cx=p.lerp(ax,bx,t), cy=p.lerp(ay,by,t), w=p.lerp(aw,bw,t), h=p.lerp(ah,bh,t), th=p.lerp(ath,bth,t);
      const [cr,cg,cb]=[p.red(c),p.green(c),p.blue(c)];
      if(_a12.phase===1) dfArcAnim(p,cr,cg,cb, cx,cy, w/2,h/2, th, eio12(_a12.t));
      else dfArc(p,cr,cg,cb, cx,cy, w/2,h/2, p.HALF_PI,p.PI, th);
    }

    rct(204,164,96,96,   107,132,110,110, black);
    rct(33,162,144,24,   262,132,168, 29, blue);
    arc_(400,230,132,132,14, 540,161,132,132,14, green);
    rct(325,162,141,24,  577,132,168, 29, blue);
    three(402,233,48,    814,189, 56, blue);
    rct(33,204,144,24,   994,215,168, 29, blue);
    rct(179,109,144,24, 1185,132,164, 29, green);
    dbl(391,90,98,50,   1452,188,112, 56, lightBlue,blue);
  }

  new p5(function(p) {
    p.setup = function() { p.pixelDensity(window.devicePixelRatio||1); p.createCanvas(1544, 425).parent('canvas-wrap-012'); };
    p.draw  = function() { drawScene12(p); };
  });

  // ---- 013 ----
  // ימין לשמאל: [0]=blackSq(סוף פסוק) [1]=greenArc1(טרחא) [2]=bluBar1(מאריך)
  // [3]=redBar(אתנח) [4]=greenArc2(טרחא) [5]=bluBar2(מאריך) [6]=purpleArc(תביר)
  // [7]=bluCircle(זקף קטון) [8]=bluBar3(שופר הולך) [9]=yelHalf(תרי קדמין)
  const stateA13 = {
    blackSq:   { x: 228, y: 209 },
    greenArc1: { x: 138, y: 181 },
    bluBar1:   { x: 228, y: 408 },
    redBar:    { x: 322, y: 208 },
    greenArc2: { x: 501, y: 234 },
    bluBar2:   { x: 320, y: 302 },
    purpleArc: { x: 119, y: 291 },
    bluC1:     { x: 391, y: 180 },
    bluC2:     { x: 442, y: 180 },
    bluC3:     { x: 493, y: 180 },
    bluBar3:   { x: 320, y: 355 },
    yelHalf:   { x: 434, y: 393 },
  };
  const stateB13 = {
    blackSq:   { x:  70, y: 110 },
    greenArc1: { x: 250, y:  62 },
    bluBar1:   { x: 333, y:  69 },
    redBar:    { x: 466, y: 109 },
    greenArc2: { x: 607, y:  62 },
    bluBar2:   { x: 691, y:  69 },
    purpleArc: { x: 889, y:  88 },
    bluC1:     { x:1025, y: 115 },
    bluC2:     { x:1083, y: 115 },
    bluC3:     { x:1140, y: 115 },
    bluBar3:   { x:1274, y: 155 },
    yelHalf:   { x:1440, y: 105 },
  };

  function drawScene13(p) {
    updateAnim(13);
    p.clear();
    const DUR13=900; const DUR13_YEL=1400; const now13=performance.now();
    anim013.forEach(function(a,i){const dur=i===9?DUR13_YEL:DUR13;if(a.phase===1){a.t=Math.min(1,(now13-a.startTime)/dur);if(a.t>=1)a.phase=2;}});
    const t = animState[13].t;
    const blk = lerpV(stateA13.blackSq,   stateB13.blackSq,   t);
    const ga1 = lerpV(stateA13.greenArc1, stateB13.greenArc1, t);
    const bl1 = lerpV(stateA13.bluBar1,   stateB13.bluBar1,   t);
    const red = lerpV(stateA13.redBar,    stateB13.redBar,    t);
    const ga2 = lerpV(stateA13.greenArc2, stateB13.greenArc2, t);
    const bl2 = lerpV(stateA13.bluBar2,   stateB13.bluBar2,   t);
    const pur = lerpV(stateA13.purpleArc, stateB13.purpleArc, t);
    const bc1 = lerpV(stateA13.bluC1,     stateB13.bluC1,     t);
    const bc2 = lerpV(stateA13.bluC2,     stateB13.bluC2,     t);
    const bc3 = lerpV(stateA13.bluC3,     stateB13.bluC3,     t);
    const bl3 = lerpV(stateA13.bluBar3,   stateB13.bluBar3,   t);
    const yh  = lerpV(stateA13.yelHalf,   stateB13.yelHalf,   t);

    const sz   = p.lerp(102, 108, t);
    const bw   = p.lerp(150, 162, t);
    const bh   = p.lerp(26,   27, t);
    const rw   = p.lerp(25,   26, t);
    const rh   = p.lerp(101, 108, t);
    const gaR  = p.lerp(69,   80, t);
    const gaHw = p.lerp(14,   16, t);
    const cd   = p.lerp(51,   55, t);
    const purD = p.lerp(130, 160, t);
    const yhD  = p.lerp(115, 140, t);
    function eoc13(x){ return 1-Math.pow(1-x,3); }
    function eio13(x){ return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2; }

    // [0] blackSq — סוף פסוק
    { const a=anim013[0]; const vib=a.phase>=1?Math.sin(a.t*p.PI*24)*(1-a.t)*8:0;
      df(p,0,0,0); p.rectMode(p.CENTER); p.rect(blk.x,blk.y,sz+vib,sz+vib); p.rectMode(p.CORNER); }

    // [1] greenArc1 — טרחא (PI→HALF_PI)
    { if(anim013[1].phase===1){
        const _cA=p.lerp(p.PI,p.HALF_PI,eio13(anim013[1].t));
        df(p,198,233,2);
        p.beginShape();
        for(let _a=p.PI;_a>=_cA-0.001;_a-=0.02)p.vertex(ga1.x+Math.cos(_a)*(gaR+gaHw),ga1.y+Math.sin(_a)*(gaR+gaHw));
        p.vertex(ga1.x+Math.cos(_cA)*(gaR-gaHw),ga1.y+Math.sin(_cA)*(gaR-gaHw));
        for(let _a=_cA;_a<=p.PI+0.001;_a+=0.02)p.vertex(ga1.x+Math.cos(_a)*(gaR-gaHw),ga1.y+Math.sin(_a)*(gaR-gaHw));
        p.endShape(p.CLOSE);
      } else dfArc(p,198,233,2,ga1.x,ga1.y,gaR,gaR,p.HALF_PI,p.PI,gaHw); }

    // [2] bluBar1 — מאריך
    { const pv=anim013[2].phase>=1?eoc13(anim013[2].t):1;
      df(p,81,162,221); p.rect(bl1.x+bw/2-bw*pv,bl1.y-bh/2,bw*pv,bh); }

    // [3] redBar — אתנח
    { const pv=anim013[3].phase>=1?eoc13(anim013[3].t):1;
      df(p,255,33,33); p.rect(red.x-rw/2,red.y-rh/2,rw,rh*pv); }

    // [4] greenArc2 — טרחא (PI→HALF_PI)
    { if(anim013[4].phase===1){
        const _cA=p.lerp(p.PI,p.HALF_PI,eio13(anim013[4].t));
        df(p,198,233,2);
        p.beginShape();
        for(let _a=p.PI;_a>=_cA-0.001;_a-=0.02)p.vertex(ga2.x+Math.cos(_a)*(gaR+gaHw),ga2.y+Math.sin(_a)*(gaR+gaHw));
        p.vertex(ga2.x+Math.cos(_cA)*(gaR-gaHw),ga2.y+Math.sin(_cA)*(gaR-gaHw));
        for(let _a=_cA;_a<=p.PI+0.001;_a+=0.02)p.vertex(ga2.x+Math.cos(_a)*(gaR-gaHw),ga2.y+Math.sin(_a)*(gaR-gaHw));
        p.endShape(p.CLOSE);
      } else dfArc(p,198,233,2,ga2.x,ga2.y,gaR,gaR,p.HALF_PI,p.PI,gaHw); }

    // [5] bluBar2 — מאריך
    { const pv=anim013[5].phase>=1?eoc13(anim013[5].t):1;
      df(p,81,162,221); p.rect(bl2.x+bw/2-bw*pv,bl2.y-bh/2,bw*pv,bh); }

    // [6] purpleArc — תביר: קשת סגולה + עיגול
    { const a=anim013[6];
      const purHw=p.lerp(10,11,t);
      dfArc(p,170,150,232,pur.x,pur.y,purD/2,purD/2,0,p.PI,purHw);
      if(a.phase===0){ df(p,170,150,232); p.circle(pur.x,pur.y+purD*0.233,purD*0.35); }
      else { const pr=a.t; let ang=pr<0.65?(1-(1-pr/0.65)*(1-pr/0.65))*p.PI:p.PI-(1-(1-(pr-0.65)/0.35)*(1-(pr-0.65)/0.35))*p.HALF_PI;
        df(p,170,150,232); p.circle(pur.x+(purD/2)*0.33*Math.cos(ang),pur.y+(purD/2)*0.33*Math.sin(ang),purD*0.35); } }

    // [7] bluC — זקף קטון: שלושה עיגולים מתפשטים ממרכז
    { df(p,81,162,221);
      if(anim013[7].phase===1){
        const pv=eio13(anim013[7].t);
        p.circle(bc2.x+(bc1.x-bc2.x)*pv, bc2.y, cd);
        p.circle(bc2.x,                   bc2.y, cd);
        p.circle(bc2.x+(bc3.x-bc2.x)*pv, bc2.y, cd);
      } else {
        p.circle(bc1.x,bc1.y,cd);
        p.circle(bc2.x,bc2.y,cd);
        p.circle(bc3.x,bc3.y,cd); } }

    // [8] bluBar3 — שופר הולך
    { const pv=anim013[8].phase>=1?eoc13(anim013[8].t):1;
      df(p,81,162,221); p.rect(bl3.x+bw/2-bw*pv,bl3.y-bh/2,bw*pv,bh); }

    // [9] yelHalf — תרי קדמין — grow כעיגול שלם, morph לפרוסת פאי (כמו בטעמים)
    { df(p,255,220,45); p.push(); p.translate(yh.x,yh.y); p.rotate(p.radians(-40));
      if(anim013[9].phase===1){
        const t13=eio13(anim013[9].t);
        const grow=Math.min(1,Math.max(0,t13/0.38));
        const gE=eio13(grow);
        const morph=Math.min(1,Math.max(0,(t13-0.55)/0.45));
        const mE=morph<0.5?16*morph*morph*morph*morph*morph:1-Math.pow(-2*morph+2,5)/2;
        const endA=p.lerp(p.TWO_PI,p.PI,mE);
        p.arc(0,0,yhD*gE,yhD*gE,0,endA,p.PIE);
      } else {
        p.arc(0,0,yhD,yhD,0,p.PI,p.PIE);
      }
      p.pop(); }
  }

  new p5(function(p) {
    p.setup = function() { p.pixelDensity(window.devicePixelRatio||1); p.createCanvas(1548, 500).parent('canvas-wrap-013'); };
    p.draw  = function() { drawScene13(p); };
  });

  const anim013 = Array.from({length:10}, function(){ return {phase:0,t:0,startTime:null}; });
  let timers013 = [];
  function playVerse013() {
    stopVerse013();
    var _d13=currentTradition==='מרוקאי'?VERSE013_DELAYS_MAR:currentTradition==='אשכנזי'?VERSE013_DELAYS_ASH:VERSE013_DELAYS;
    for(var _i=0;_i<10;_i++){(function(idx){
      timers013.push(setTimeout(function(){anim013[idx].phase=1;anim013[idx].t=0;anim013[idx].startTime=performance.now();},_d13[idx]));
    })(_i);}
  }
  function stopVerse013(){timers013.forEach(clearTimeout);timers013=[];anim013.forEach(function(a){a.phase=0;a.t=0;a.startTime=null;});}

  // ---- 014 ----
  const stateA14 = {
    sq:{x:238,y:138,w:75, h:75 }, dt:{x:113,y:186,w:88, h:72 },
    b1:{x:99, y:146,w:116,h:19 }, rr:{x:361,y:186,w:18, h:72 },
    b2:{x:219,y:239,w:116,h:19 }, ar:{x:380,y:98, w:122,h:122},
  };
  const stateB14 = {
    sq:{x:13, y:52, w:152,h:152}, dt:{x:207,y:98, w:130,h:110},
    b1:{x:421,y:59, w:228,h:39 }, rr:{x:699,y:58, w:38, h:143},
    b2:{x:803,y:148,w:228,h:38 }, ar:{x:1187,y:110,w:238,h:238},
  };

  function drawScene14(p) {
    updateAnim(14);
    p.clear();
    const DUR14=900; const now14=performance.now();
    anim014.forEach(function(a){if(a.phase===1){a.t=Math.min(1,(now14-a.startTime)/DUR14);if(a.t>=1)a.phase=2;}});
    const t=animState[14].t;
    function eoc14(x){return 1-Math.pow(1-x,3);}
    function eio14(x){return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}
    function lS(a,b){return{x:p.lerp(a.x,b.x,t),y:p.lerp(a.y,b.y,t),w:p.lerp(a.w,b.w,t),h:p.lerp(a.h,b.h,t)};}
    const sq=lS(stateA14.sq,stateB14.sq), dt=lS(stateA14.dt,stateB14.dt);
    const b1=lS(stateA14.b1,stateB14.b1), rr=lS(stateA14.rr,stateB14.rr);
    const b2=lS(stateA14.b2,stateB14.b2), ar=lS(stateA14.ar,stateB14.ar);

    // [0] square — black, vibrate
    { const a=anim014[0]; const vib=a.phase>=1?Math.sin(a.t*p.PI*24)*(1-a.t)*8:0;
      df(p,0,0,0); p.rectMode(p.CENTER); p.rect(sq.x+sq.w/2,sq.y+sq.h/2,sq.w+vib,sq.h+vib); p.rectMode(p.CORNER); }

    // [1] doubleTriangle — purple, right slides first (like verse 7)
    { const _a14=anim014[1];
      const cy14=dt.y+dt.h/2, gap14=dt.w*0.04, triW14=(dt.w-gap14)/2;
      df(p,165,145,230);
      if(_a14.phase>=1){
        const pR14=Math.min(1,_a14.t*1.5), pL14=Math.max(0,Math.min(1,(_a14.t-0.2)*1.5));
        const eR14=1-Math.pow(1-pR14,3), eL14=1-Math.pow(1-pL14,3);
        p.triangle(dt.x+triW14+gap14+p.lerp(60,0,eR14),cy14, dt.x+dt.w+p.lerp(60,0,eR14),dt.y, dt.x+dt.w+p.lerp(60,0,eR14),dt.y+dt.h);
        p.triangle(dt.x+p.lerp(30,0,eL14),cy14, dt.x+triW14+p.lerp(30,0,eL14),dt.y, dt.x+triW14+p.lerp(30,0,eL14),dt.y+dt.h);
      } else {
        p.triangle(dt.x,               cy14, dt.x+triW14,      dt.y, dt.x+triW14,      dt.y+dt.h);
        p.triangle(dt.x+triW14+gap14,  cy14, dt.x+dt.w,        dt.y, dt.x+dt.w,        dt.y+dt.h);
      } }

    // [2] blueRect1 — slide in from right
    { const pv=anim014[2].phase>=1?eoc14(anim014[2].t):1;
      df(p,82,160,215); p.rect(b1.x+b1.w*(1-pv),b1.y,b1.w*pv,b1.h); }

    // [3] redRect — grow height downward
    { const pv=anim014[3].phase>=1?eoc14(anim014[3].t):1;
      df(p,255,35,35); p.rect(rr.x,rr.y,rr.w,rr.h*pv); }

    // [4] blueRect2 — slide in from right
    { const pv=anim014[4].phase>=1?eoc14(anim014[4].t):1;
      df(p,82,160,215); p.rect(b2.x+b2.w*(1-pv),b2.y,b2.w*pv,b2.h); }

    // [5] arc — green, sweep from PI to HALF_PI
    { const thick=ar.w*0.14;
      df(p,200,235,0);
      if(anim014[5].phase===1){
        const _cA=p.lerp(p.PI,p.HALF_PI,eio14(anim014[5].t));
        p.beginShape();
        for(let _a=p.PI;_a>=_cA-0.001;_a-=0.02)p.vertex(ar.x+Math.cos(_a)*ar.w/2,ar.y+Math.sin(_a)*ar.h/2);
        p.vertex(ar.x+Math.cos(_cA)*(ar.w/2-thick),ar.y+Math.sin(_cA)*(ar.h/2-thick));
        for(let _a=_cA;_a<=p.PI+0.001;_a+=0.02)p.vertex(ar.x+Math.cos(_a)*(ar.w/2-thick),ar.y+Math.sin(_a)*(ar.h/2-thick));
        p.endShape(p.CLOSE);
      } else {
        p.beginShape();
        for(let _i=0;_i<=40;_i++){const _a=p.lerp(p.HALF_PI,p.PI,_i/40);p.vertex(ar.x+Math.cos(_a)*ar.w/2,ar.y+Math.sin(_a)*ar.h/2);}
        for(let _i=40;_i>=0;_i--){const _a=p.lerp(p.HALF_PI,p.PI,_i/40);p.vertex(ar.x+Math.cos(_a)*(ar.w/2-thick),ar.y+Math.sin(_a)*(ar.h/2-thick));}
        p.endShape(p.CLOSE);
      } }
  }

  new p5(function(p) {
    p.setup = function() { p.pixelDensity(window.devicePixelRatio||1); p.createCanvas(1200, 300).parent('canvas-wrap-014'); };
    p.draw  = function() { drawScene14(p); };
  });

  const anim014 = Array.from({length:6}, function(){ return {phase:0,t:0,startTime:null}; });
  let timers014 = [];
  const VERSE014_DELAYS = [4450, 3400, 2800, 1800, 1000, 0];
  const VERSE014_DELAYS_MAR = [6000, 5000, 4400, 2800, 1800, 0];
  function playVerse014(){stopVerse014();var _d14=currentTradition==='מרוקאי'?VERSE014_DELAYS_MAR:VERSE014_DELAYS;for(var _i=0;_i<6;_i++){(function(idx){timers014.push(setTimeout(function(){anim014[idx].phase=1;anim014[idx].t=0;anim014[idx].startTime=performance.now();},_d14[idx]));})(_i);}}
  function stopVerse014(){timers014.forEach(clearTimeout);timers014=[];anim014.forEach(function(a){a.phase=0;a.t=0;a.startTime=null;});}

  // ---- 015 ----
  const stateA15 = {
    sq:{x:61, y:156,w:143,h:143}, br:{x:61, y:95, w:215,h:36},
    ar:{x:431,y:-15,w:230,h:230}, tc:{x:281,y:180,r:36, gap:72},
    gr:{x:58, y:325,w:217,h:36},  tg:{x:399,y:310,outer:145,inner:72},
  };
  const stateB15 = {
    sq:{x:138,y:101,w:135,h:135}, br:{x:325,y:101,w:204,h:36},
    ar:{x:675,y:136,w:150,h:150}, tc:{x:748,y:171,r:34, gap:68},
    gr:{x:959,y:101,w:204,h:36},  tg:{x:1270,y:169,outer:136,inner:67},
  };

  function drawScene15(p) {
    updateAnim(15);
    p.clear();
    const DUR15=900; const now15=performance.now();
    anim015.forEach(function(a){if(a.phase===1){a.t=Math.min(1,(now15-a.startTime)/DUR15);if(a.t>=1)a.phase=2;}});
    const t=animState[15].t;
    _dfSW = 4;
    function eoc15(x){return 1-Math.pow(1-x,3);}
    function eio15(x){return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}
    function lS(a,b){return{x:p.lerp(a.x,b.x,t),y:p.lerp(a.y,b.y,t),w:p.lerp(a.w,b.w,t),h:p.lerp(a.h,b.h,t)};}
    const sq=lS(stateA15.sq,stateB15.sq);
    const br=lS(stateA15.br,stateB15.br);
    const ar={x:p.lerp(stateA15.ar.x,stateB15.ar.x,t),y:p.lerp(stateA15.ar.y,stateB15.ar.y,t),w:p.lerp(stateA15.ar.w,stateB15.ar.w,t),h:p.lerp(stateA15.ar.h,stateB15.ar.h,t)};
    const tc={x:p.lerp(stateA15.tc.x,stateB15.tc.x,t),y:p.lerp(stateA15.tc.y,stateB15.tc.y,t),
               r:p.lerp(stateA15.tc.r,stateB15.tc.r,t),gap:p.lerp(stateA15.tc.gap,stateB15.tc.gap,t)};
    const gr=lS(stateA15.gr,stateB15.gr);
    const tg={x:p.lerp(stateA15.tg.x,stateB15.tg.x,t),y:p.lerp(stateA15.tg.y,stateB15.tg.y,t),
               outer:p.lerp(stateA15.tg.outer,stateB15.tg.outer,t),inner:p.lerp(stateA15.tg.inner,stateB15.tg.inner,t)};

    // [0] square — black, vibrate
    { const a=anim015[0]; const vib=a.phase>=1?Math.sin(a.t*p.PI*24)*(1-a.t)*8:0;
      df(p,0,0,0); p.rectMode(p.CENTER); p.rect(sq.x+sq.w/2,sq.y+sq.h/2,sq.w+vib,sq.h+vib); p.rectMode(p.CORNER); }

    // [1] blueRect — slide in from right
    { const pv=anim015[1].phase>=1?eoc15(anim015[1].t):1;
      df(p,82,160,215); p.rect(br.x+br.w*(1-pv),br.y,br.w*pv,br.h); }

    // [2] arc — green, PI→HALF_PI (like verse 2)
    { const thick=ar.w*0.09;
      if(anim015[2].phase===1) dfArcAnim(p,200,235,0, ar.x,ar.y, ar.w/2,ar.h/2, thick, eio15(anim015[2].t));
      else dfArc(p,200,235,0, ar.x,ar.y, ar.w/2,ar.h/2, p.HALF_PI,p.PI, thick); }

    // [3] threeCircles — spread from center
    { df(p,82,160,215);
      if(anim015[3].phase===1){
        const pv=eio15(anim015[3].t);
        p.circle(tc.x+tc.gap*(1-pv), tc.y, tc.r*2);
        p.circle(tc.x+tc.gap,         tc.y, tc.r*2);
        p.circle(tc.x+tc.gap*(1+pv),  tc.y, tc.r*2);
      } else {
        p.circle(tc.x,           tc.y, tc.r*2);
        p.circle(tc.x+tc.gap,    tc.y, tc.r*2);
        p.circle(tc.x+tc.gap*2,  tc.y, tc.r*2);
      } }

    // [4] greenRect — slide in from right
    { const pv=anim015[4].phase>=1?eoc15(anim015[4].t):1;
      df(p,200,235,0); p.rect(gr.x+gr.w*(1-pv),gr.y,gr.w*pv,gr.h); }

    // [5] targetCircle — scale up
    { const pv=anim015[5].phase>=1?eoc15(anim015[5].t):1;
      df(p,165,210,240); p.circle(tg.x,tg.y,tg.outer*pv);
      df(p,82,160,215);  p.circle(tg.x,tg.y,tg.inner*pv); }
  }

  new p5(function(p) {
    p.setup = function() { p.pixelDensity(window.devicePixelRatio||1); p.createCanvas(1400, 400).parent('canvas-wrap-015'); };
    p.draw  = function() { drawScene15(p); _dfSW=4; };
  });

  const anim015 = Array.from({length:6}, function(){ return {phase:0,t:0,startTime:null}; });
  let timers015 = [];
  const VERSE015_DELAYS = [4150, 3550, 2700, 1650, 900, 0];
  function playVerse015(){stopVerse015();for(var _i=0;_i<6;_i++){(function(idx){timers015.push(setTimeout(function(){anim015[idx].phase=1;anim015[idx].t=0;anim015[idx].startTime=performance.now();},VERSE015_DELAYS[idx]));})(_i);}}
  function stopVerse015(){timers015.forEach(clearTimeout);timers015=[];anim015.forEach(function(a){a.phase=0;a.t=0;a.startTime=null;});}

  // ---- 016 ----
  const stateA16 = {
    bl1:{x:119,y:126,w:245,h:42},  rr:{x:170,y:203,w:38,h:162},
    ga1:{x:306,y:400,wo:256,ho:244,wi:188,hi:176},
    yv1:{x:306,y:245,r:41,gap:82}, yv2:{x:432,y:164,r:41,gap:82},
    bc: {x:588,y:206,outer:164,inner:82},
    bl2:{x:519,y:327,w:245,h:38},  bh:{x:424,y:448,r:41,gap:82},
    ga2:{x:602,y:527,wo:256,ho:244,wi:188,hi:176},
    yh: {x:655,y:499,size:190,rot:-42},
  };
  const stateB16 = {
    bl1:{x:0,  y:114,w:228,h:37},  rr:{x:737,y:119,w:36,h:151},
    ga1:{x:409,y:152,wo:240,ho:227,wi:165,hi:152},
    yv1:{x:500,y:85, r:37,gap:76}, yv2:{x:638,y:85, r:37,gap:76},
    bc: {x:1839,y:189,outer:152,inner:75},
    bl2:{x:999,y:114,w:228,h:37},  bh:{x:1347,y:189,r:37,gap:76},
    ga2:{x:953,y:152,wo:240,ho:227,wi:165,hi:152},
    yh: {x:1643,y:184,size:145,rot:-42},
  };

  function drawScene16(p) {
    updateAnim(16);
    p.clear();
    const DUR16=900; const DUR16_YH=1500; const now16=performance.now();
    anim016.forEach(function(a,i){const dur=i===8?DUR16_YH:DUR16;if(a.phase===1){a.t=Math.min(1,(now16-a.startTime)/dur);if(a.t>=1)a.phase=2;}});
    const t=animState[16].t;
    _dfSW = 4;
    function eoc16(x){return 1-Math.pow(1-x,3);}
    function eio16(x){return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}
    function lV(a,b,k){return p.lerp(a[k],b[k],t);}
    const bl1={x:lV(stateA16.bl1,stateB16.bl1,'x'),y:lV(stateA16.bl1,stateB16.bl1,'y'),w:lV(stateA16.bl1,stateB16.bl1,'w'),h:lV(stateA16.bl1,stateB16.bl1,'h')};
    const rr ={x:lV(stateA16.rr, stateB16.rr, 'x'),y:lV(stateA16.rr, stateB16.rr, 'y'),w:lV(stateA16.rr, stateB16.rr, 'w'),h:lV(stateA16.rr, stateB16.rr, 'h')};
    const ga1={x:lV(stateA16.ga1,stateB16.ga1,'x'),y:lV(stateA16.ga1,stateB16.ga1,'y'),wo:lV(stateA16.ga1,stateB16.ga1,'wo'),ho:lV(stateA16.ga1,stateB16.ga1,'ho'),wi:lV(stateA16.ga1,stateB16.ga1,'wi'),hi:lV(stateA16.ga1,stateB16.ga1,'hi')};
    const yv1={x:lV(stateA16.yv1,stateB16.yv1,'x'),y:lV(stateA16.yv1,stateB16.yv1,'y'),r:lV(stateA16.yv1,stateB16.yv1,'r'),gap:lV(stateA16.yv1,stateB16.yv1,'gap')};
    const yv2={x:lV(stateA16.yv2,stateB16.yv2,'x'),y:lV(stateA16.yv2,stateB16.yv2,'y'),r:lV(stateA16.yv2,stateB16.yv2,'r'),gap:lV(stateA16.yv2,stateB16.yv2,'gap')};
    const bc ={x:lV(stateA16.bc, stateB16.bc, 'x'),y:lV(stateA16.bc, stateB16.bc, 'y'),outer:lV(stateA16.bc,stateB16.bc,'outer'),inner:lV(stateA16.bc,stateB16.bc,'inner')};
    const bl2={x:lV(stateA16.bl2,stateB16.bl2,'x'),y:lV(stateA16.bl2,stateB16.bl2,'y'),w:lV(stateA16.bl2,stateB16.bl2,'w'),h:lV(stateA16.bl2,stateB16.bl2,'h')};
    const bh ={x:lV(stateA16.bh, stateB16.bh, 'x'),y:lV(stateA16.bh, stateB16.bh, 'y'),r:lV(stateA16.bh, stateB16.bh, 'r'),gap:lV(stateA16.bh, stateB16.bh, 'gap')};
    const ga2={x:lV(stateA16.ga2,stateB16.ga2,'x'),y:lV(stateA16.ga2,stateB16.ga2,'y'),wo:lV(stateA16.ga2,stateB16.ga2,'wo'),ho:lV(stateA16.ga2,stateB16.ga2,'ho'),wi:lV(stateA16.ga2,stateB16.ga2,'wi'),hi:lV(stateA16.ga2,stateB16.ga2,'hi')};
    const yh ={x:lV(stateA16.yh, stateB16.yh, 'x'),y:lV(stateA16.yh, stateB16.yh, 'y'),size:lV(stateA16.yh,stateB16.yh,'size'),rot:stateB16.yh.rot};

    function drawGA(g,idx){
      df(p,200,235,0);
      if(anim016[idx].phase===1){
        const _cA=p.lerp(p.PI,p.HALF_PI,eio16(anim016[idx].t));
        p.beginShape();
        for(let _a=p.PI;_a>=_cA-0.001;_a-=0.02)p.vertex(g.x+Math.cos(_a)*g.wo/2,g.y+Math.sin(_a)*g.ho/2);
        p.vertex(g.x+Math.cos(_cA)*g.wi/2,g.y+Math.sin(_cA)*g.hi/2);
        for(let _a=_cA;_a<=p.PI+0.001;_a+=0.02)p.vertex(g.x+Math.cos(_a)*g.wi/2,g.y+Math.sin(_a)*g.hi/2);
        p.endShape(p.CLOSE);
      } else {
        p.beginShape();
        for(let _i=0;_i<=40;_i++){const _a=p.lerp(p.HALF_PI,p.PI,_i/40);p.vertex(g.x+Math.cos(_a)*g.wo/2,g.y+Math.sin(_a)*g.ho/2);}
        for(let _i=40;_i>=0;_i--){const _a=p.lerp(p.HALF_PI,p.PI,_i/40);p.vertex(g.x+Math.cos(_a)*g.wi/2,g.y+Math.sin(_a)*g.hi/2);}
        p.endShape(p.CLOSE);
      }
    }

    // [0] blueRect1 — slide
    { const pv=anim016[0].phase>=1?eoc16(anim016[0].t):1;
      df(p,82,160,215); p.rect(bl1.x+bl1.w*(1-pv),bl1.y,bl1.w*pv,bl1.h); }

    // [1] greenArc1
    drawGA(ga1,1);

    // [2] yellowVert1 — spread vertical
    { df(p,255,220,45);
      if(anim016[2].phase===1){const pv=eio16(anim016[2].t);
        p.circle(yv1.x,yv1.y+yv1.gap*(1-pv),yv1.r*2); p.circle(yv1.x,yv1.y+yv1.gap,yv1.r*2); p.circle(yv1.x,yv1.y+yv1.gap*(1+pv),yv1.r*2);
      } else { p.circle(yv1.x,yv1.y,yv1.r*2); p.circle(yv1.x,yv1.y+yv1.gap,yv1.r*2); p.circle(yv1.x,yv1.y+yv1.gap*2,yv1.r*2); } }

    // [3] yellowVert2
    { df(p,255,220,45);
      if(anim016[3].phase===1){const pv=eio16(anim016[3].t);
        p.circle(yv2.x,yv2.y+yv2.gap*(1-pv),yv2.r*2); p.circle(yv2.x,yv2.y+yv2.gap,yv2.r*2); p.circle(yv2.x,yv2.y+yv2.gap*(1+pv),yv2.r*2);
      } else { p.circle(yv2.x,yv2.y,yv2.r*2); p.circle(yv2.x,yv2.y+yv2.gap,yv2.r*2); p.circle(yv2.x,yv2.y+yv2.gap*2,yv2.r*2); } }

    // [4] redRect — grow height
    { const pv=anim016[4].phase>=1?eoc16(anim016[4].t):1;
      df(p,255,35,35); p.rect(rr.x,rr.y,rr.w,rr.h*pv); }

    // [5] greenArc2
    drawGA(ga2,5);

    // [6] blueRect2 — slide
    { const pv=anim016[6].phase>=1?eoc16(anim016[6].t):1;
      df(p,82,160,215); p.rect(bl2.x+bl2.w*(1-pv),bl2.y,bl2.w*pv,bl2.h); }

    // [7] blueHorizontal — spread horizontal
    { df(p,82,160,215);
      if(anim016[7].phase===1){const pv=eio16(anim016[7].t);
        p.circle(bh.x+bh.gap*(1-pv),bh.y,bh.r*2); p.circle(bh.x+bh.gap,bh.y,bh.r*2); p.circle(bh.x+bh.gap*(1+pv),bh.y,bh.r*2);
      } else { p.circle(bh.x,bh.y,bh.r*2); p.circle(bh.x+bh.gap,bh.y,bh.r*2); p.circle(bh.x+bh.gap*2,bh.y,bh.r*2); } }

    // [8] yellowHalf — grow+morph (like verse 13)
    { df(p,255,220,45); p.push(); p.translate(yh.x,yh.y); p.rotate(p.radians(yh.rot));
      if(anim016[8].phase===1){
        const t16=eio16(anim016[8].t);
        const grow=Math.min(1,Math.max(0,t16/0.38));
        const gE=eio16(grow);
        const morph=Math.min(1,Math.max(0,(t16-0.55)/0.45));
        const mE=morph<0.5?16*morph*morph*morph*morph*morph:1-Math.pow(-2*morph+2,5)/2;
        const endA=p.lerp(p.TWO_PI,p.PI,mE);
        p.arc(0,0,yh.size*gE,yh.size*gE,0,endA,p.PIE);
      } else {
        p.arc(0,0,yh.size,yh.size,0,p.PI,p.PIE);
      } p.pop(); }

    // [9] blueCircleSet — scale up
    { const pv=anim016[9].phase>=1?eoc16(anim016[9].t):1;
      df(p,160,205,235); p.circle(bc.x,bc.y,bc.outer*pv);
      df(p,82,160,215);  p.circle(bc.x,bc.y,bc.inner*pv); }
  }

  new p5(function(p) {
    p.setup = function() { p.pixelDensity(window.devicePixelRatio||1); p.createCanvas(1920, 750).parent('canvas-wrap-016'); };
    p.draw  = function() { drawScene16(p); _dfSW=4; };
  });

  const anim016 = Array.from({length:10}, function(){ return {phase:0,t:0,startTime:null}; });
  let timers016 = [];
  const VERSE016_DELAYS = [9000, 8000, 6500, 5300, 4200, 3800, 3100, 2000, 1000, 0];
  const VERSE016_DELAYS_MAR = [10000, 9000, 7500, 5340, 4700, 4200, 3800, 2300, 1040, 40];
  function playVerse016(){stopVerse016();var _d16=currentTradition==='מרוקאי'?VERSE016_DELAYS_MAR:VERSE016_DELAYS;for(var _i=0;_i<10;_i++){(function(idx){timers016.push(setTimeout(function(){anim016[idx].phase=1;anim016[idx].t=0;anim016[idx].startTime=performance.now();},_d16[idx]));})(_i);}}
  function stopVerse016(){timers016.forEach(clearTimeout);timers016=[];anim016.forEach(function(a){a.phase=0;a.t=0;a.startTime=null;});}

  // ---- dark-mode fill helper ----
  function isDark() { return document.body.classList.contains('dark'); }
  function dfArc(p, r, g, b, cx, cy, rx, ry, sa, ea, hw) {
    df(p, r, g, b);
    p.beginShape();
    for(let _a=sa; _a<=ea+0.001; _a+=0.02) p.vertex(cx+Math.cos(_a)*(rx+hw), cy+Math.sin(_a)*(ry+hw));
    for(let _a=ea; _a>=sa-0.001; _a-=0.02) p.vertex(cx+Math.cos(_a)*(rx-hw), cy+Math.sin(_a)*(ry-hw));
    p.endShape(p.CLOSE);
  }
  // Arc animation matching solo mode: builds from PI toward HALF_PI
  function dfArcAnim(p, r, g, b, cx, cy, rx, ry, hw, pv) {
    const currentA = p.lerp(p.PI, p.HALF_PI, pv);
    df(p, r, g, b);
    p.beginShape();
    for(let _a=p.PI; _a>=currentA-0.001; _a-=0.02)
      p.vertex(cx+Math.cos(_a)*(rx+hw), cy+Math.sin(_a)*(ry+hw));
    p.vertex(cx+Math.cos(currentA)*(rx-hw), cy+Math.sin(currentA)*(ry-hw));
    for(let _a=currentA; _a<=p.PI+0.001; _a+=0.02)
      p.vertex(cx+Math.cos(_a)*(rx-hw), cy+Math.sin(_a)*(ry-hw));
    p.endShape(p.CLOSE);
  }
  let _dfSW = 4; // strokeWeight override
  function df(p, r, g, b, a) {
    if (isDark()) {
      p.noFill();
      const bk = (r === 0 && g === 0 && b === 0);
      p.stroke(bk ? 255 : r, bk ? 255 : g, bk ? 255 : b, a !== undefined ? a : 255);
      p.strokeWeight(_dfSW);
    } else {
      if (a !== undefined) p.fill(r, g, b, a); else p.fill(r, g, b);
      p.noStroke();
    }
  }

  // ---- פסוק 001 — רצף טעמים (ויזואלי בלבד) ----
  // סדר ימין לשמאל: [0]=arc2(שמע/טרחא) [1]=redBar(ישראל/אתנח)
  // [2]=bluBar2(יהוה/מאריך) [3]=arc1(אלהינו/טרחא) [4]=bluBar1(יהוה/מאריך) [5]=blackSq(אחד/סוף פסוק)
  const anim001 = Array.from({length:6}, function(){ return {phase:0, t:0, startTime:null}; });
  let timers001 = [];

  const VERSE001_DELAYS = [0, 1000, 2000, 3000, 6000, 7000];
  const VERSE001_DELAYS_ASH = [200, 1000, 2800, 3300, 5600, 5800];
  const VERSE001_DELAYS_MAR = [400, 1000, 2200, 2700, 5500, 6100];
  const VERSE002_DELAYS = [0, 1000, 2000, 4000, 4500, 5000, 6000, 6800, 7300];
  const VERSE002_DELAYS_MAR = [0, 800, 2300, 4300, 4800, 5000, 6000, 6800, 7300];
  const VERSE002_DELAYS_ASH = [0, 2000, 4000, 6000, 7000, 7800, 9200, 10500, 11000];
  const VERSE003_DELAYS = [0, 1500, 2000, 2600, 3000, 4500, 5500, 7000, 7700];
  const VERSE003_DELAYS_ASH = [200, 1200, 3150, 3600, 4500, 6300, 7500, 9000, 9500];
  const VERSE004_DELAYS = [500, 2000, 3800, 4300, 5100, 6800, 7600, 8800];
  const VERSE004_DELAYS_MAR = [500, 1600, 3200, 4300, 5100, 6800, 7600, 8800];
  const VERSE004_DELAYS_ASH = [0, 700, 2000, 2500, 3500, 4800, 5650, 6800];
  const VERSE005_DELAYS = [500, 1000, 2500, 4000, 5500, 6500, 7500, 8000, 9500, 10500, 11800, 12800];
  const VERSE005_DELAYS_MAR = [500, 1000, 2500, 4000, 5500, 6500, 7500, 8000, 9500, 10500, 12200, 12800];
  const VERSE005_DELAYS_ASH = [0, 1000, 1500, 4000, 5000, 6000, 7500, 8000, 9500, 10500, 11800, 12500];
  const VERSE006_DELAYS = [500, 2000, 2800, 5200];
  const VERSE006_DELAYS_MAR = [500, 2000, 2800, 4900];
  const VERSE006_DELAYS_ASH = [500, 2000, 2800, 4500];
  const VERSE007_DELAYS = [500, 2000, 2800, 4200, 5000, 6300, 7600, 9000, 10500, 11500];
  const VERSE007_DELAYS_MAR = [400, 1700, 2650, 4200, 5000, 6300, 7600, 9000, 10500, 11500];
  const VERSE007_DELAYS_ASH = [500, 1500, 2800, 4200, 5000, 7500, 8200, 9500, 11250, 12350];
  const VERSE008_DELAYS = [500, 1600, 4100, 6800, 7800, 9300, 10800, 12300, 15000, 15700, 16700, 17700, 19400, 20500, 22900];
  const VERSE008_DELAYS_ASH = [400, 1400, 2200, 4700, 5800, 7500, 8600, 10000, 11700, 12500, 13500, 14400, 15400, 15900, 16900];
  const VERSE008_DELAYS_MAR = [500, 1600, 3900, 5000, 5300, 7500, 9200, 10800, 12000, 12700, 13900, 14900, 16400, 17500, 19300];
  const VERSE009_DELAYS = [500, 900, 1600, 2100, 4100, 5450, 5800, 7300, 8300, 8950, 10400, 13400, 14100];
  const VERSE009_DELAYS_MAR = [500, 900, 1900, 2100, 4100, 5450, 5800, 7300, 8300, 8950, 10400, 13400, 14100];
  const VERSE009_DELAYS_ASH = [500, 1100, 2200, 2700, 4500, 5450, 5800, 7300, 8300, 8950, 10400, 11800, 12300];
  const VERSE010_DELAYS = [500, 1500, 2100, 3300, 3600, 5900, 6900, 8900, 11400, 12400, 12900, 14400, 15900, 16400, 17900, 19000, 20250, 22350, 23700];
  const VERSE010_DELAYS_ASH = [500, 1500, 2100, 3300, 3600, 4300, 5000, 6800, 8900, 9500, 9900, 11400, 12600, 13400, 14700, 15800, 17250, 19350, 20500];
  const VERSE010_DELAYS_MAR = [500, 1500, 1900, 3300, 3600, 5950, 6600, 8100, 9400, 9800, 12650, 13850, 14200, 15550, 17000, 17600, 19150, 20650, 21350];
  const VERSE011_DELAYS = [500, 1000, 1500, 2800, 3300, 4600, 5000, 6000, 7200, 8200, 8900];
  const VERSE011_DELAYS_ASH = [100, 1000, 1500, 2000, 2500, 4200, 5000, 6000, 6500, 7900, 8500];
  const VERSE011_DELAYS_MAR = [500, 1000, 2400, 3900, 4400, 5900, 6600, 7100, 8300, 9300, 10000];
  const VERSE012_DELAYS = [500, 1000, 2700, 3500, 4500, 5000, 6500, 7300];
  const VERSE012_DELAYS_ASH = [500, 1000, 2400, 3200, 4500, 5000, 6500, 7300];
  const VERSE012_DELAYS_MAR = [500, 1000, 2400, 3200, 4500, 5000, 6500, 7300];
  const VERSE013_DELAYS = [10800, 8700, 7900, 6700, 6000, 5200, 4000, 2000, 1000, 0];
  const VERSE013_DELAYS_ASH = [10800, 8700, 6000, 7900, 6500, 9000, 4000, 2000, 1000, 0];
  const VERSE013_DELAYS_MAR = [10000, 9800, 9000, 8200, 7500, 6500, 4900, 3400, 2500, 0];
  function playVerse001() {
    stopVerse001();
    var _delays = currentTradition === 'אשכנזי' ? VERSE001_DELAYS_ASH : currentTradition === 'מרוקאי' ? VERSE001_DELAYS_MAR : VERSE001_DELAYS;
    for (var _i = 0; _i < 6; _i++) {
      (function(idx){
        timers001.push(setTimeout(function() {
          anim001[idx].phase = 1;
          anim001[idx].t = 0;
          anim001[idx].startTime = performance.now();
        }, _delays[idx]));
      })(_i);
    }
  }

  function stopVerse001() {
    timers001.forEach(clearTimeout);
    timers001 = [];
    anim001.forEach(function(a){ a.phase = 0; a.t = 0; a.startTime = null; });
  }

  const anim002=Array.from({length:9},function(){return{phase:0,t:0,startTime:null};});let timers002=[];
  function playVerse002(){stopVerse002();var _d2=currentTradition==='מרוקאי'?VERSE002_DELAYS_MAR:currentTradition==='אשכנזי'?VERSE002_DELAYS_ASH:VERSE002_DELAYS;for(var _i=0;_i<9;_i++){(function(idx){timers002.push(setTimeout(function(){anim002[idx].phase=1;anim002[idx].t=0;anim002[idx].startTime=performance.now();},_d2[idx]));})(_i);}}
  function stopVerse002(){timers002.forEach(clearTimeout);timers002=[];anim002.forEach(function(a){a.phase=0;a.t=0;a.startTime=null;});}

  const anim003=Array.from({length:9},function(){return{phase:0,t:0,startTime:null};});let timers003=[];
  function playVerse003(){stopVerse003();var _d3=currentTradition==='אשכנזי'?VERSE003_DELAYS_ASH:VERSE003_DELAYS;for(var _i=0;_i<9;_i++){(function(idx){timers003.push(setTimeout(function(){anim003[idx].phase=1;anim003[idx].t=0;anim003[idx].startTime=performance.now();},_d3[idx]));})(_i);}}
  function stopVerse003(){timers003.forEach(clearTimeout);timers003=[];anim003.forEach(function(a){a.phase=0;a.t=0;a.startTime=null;});}

  const anim004=Array.from({length:8},function(){return{phase:0,t:0,startTime:null};});let timers004=[];
  function playVerse004(){stopVerse004();var _d4=currentTradition==='מרוקאי'?VERSE004_DELAYS_MAR:currentTradition==='אשכנזי'?VERSE004_DELAYS_ASH:VERSE004_DELAYS;for(var _i=0;_i<8;_i++){(function(idx){timers004.push(setTimeout(function(){anim004[idx].phase=1;anim004[idx].t=0;anim004[idx].startTime=performance.now();},_d4[idx]));})(_i);}}
  function stopVerse004(){timers004.forEach(clearTimeout);timers004=[];anim004.forEach(function(a){a.phase=0;a.t=0;a.startTime=null;});}

  const anim005=Array.from({length:12},function(){return{phase:0,t:0,startTime:null};});let timers005=[];
  function playVerse005(){stopVerse005();var _d5=currentTradition==='מרוקאי'?VERSE005_DELAYS_MAR:currentTradition==='אשכנזי'?VERSE005_DELAYS_ASH:VERSE005_DELAYS;for(var _i=0;_i<12;_i++){(function(idx){timers005.push(setTimeout(function(){anim005[idx].phase=1;anim005[idx].t=0;anim005[idx].startTime=performance.now();},_d5[idx]));})(_i);}}
  function stopVerse005(){timers005.forEach(clearTimeout);timers005=[];anim005.forEach(function(a){a.phase=0;a.t=0;a.startTime=null;});}

  const anim006=Array.from({length:4},function(){return{phase:0,t:0,startTime:null};});let timers006=[];
  function playVerse006(){stopVerse006();var _d6=currentTradition==='מרוקאי'?VERSE006_DELAYS_MAR:currentTradition==='אשכנזי'?VERSE006_DELAYS_ASH:VERSE006_DELAYS;for(var _i=0;_i<4;_i++){(function(idx){timers006.push(setTimeout(function(){anim006[idx].phase=1;anim006[idx].t=0;anim006[idx].startTime=performance.now();},_d6[idx]));})(_i);}}
  function stopVerse006(){timers006.forEach(clearTimeout);timers006=[];anim006.forEach(function(a){a.phase=0;a.t=0;a.startTime=null;});}

  const anim007=Array.from({length:10},function(){return{phase:0,t:0,startTime:null};});let timers007=[];
  function playVerse007(){stopVerse007();var _d7=currentTradition==='מרוקאי'?VERSE007_DELAYS_MAR:currentTradition==='אשכנזי'?VERSE007_DELAYS_ASH:VERSE007_DELAYS;for(var _i=0;_i<10;_i++){(function(idx){timers007.push(setTimeout(function(){anim007[idx].phase=1;anim007[idx].t=0;anim007[idx].startTime=performance.now();},_d7[idx]));})(_i);}}
  function stopVerse007(){timers007.forEach(clearTimeout);timers007=[];anim007.forEach(function(a){a.phase=0;a.t=0;a.startTime=null;});}

  const anim008=Array.from({length:15},function(){return{phase:0,t:0,startTime:null};});let timers008=[];
  function playVerse008(){stopVerse008();var _d8=currentTradition==='מרוקאי'?VERSE008_DELAYS_MAR:currentTradition==='אשכנזי'?VERSE008_DELAYS_ASH:VERSE008_DELAYS;for(var _i=0;_i<15;_i++){(function(idx){timers008.push(setTimeout(function(){anim008[idx].phase=1;anim008[idx].t=0;anim008[idx].startTime=performance.now();},_d8[idx]));})(_i);}}
  function stopVerse008(){timers008.forEach(clearTimeout);timers008=[];anim008.forEach(function(a){a.phase=0;a.t=0;a.startTime=null;});}

  const anim009=Array.from({length:13},function(){return{phase:0,t:0,startTime:null};});let timers009=[];
  function playVerse009(){stopVerse009();var _d9=currentTradition==='מרוקאי'?VERSE009_DELAYS_MAR:currentTradition==='אשכנזי'?VERSE009_DELAYS_ASH:VERSE009_DELAYS;for(var _i=0;_i<13;_i++){(function(idx){timers009.push(setTimeout(function(){anim009[idx].phase=1;anim009[idx].t=0;anim009[idx].startTime=performance.now();},_d9[idx]));})(_i);}}
  function stopVerse009(){timers009.forEach(clearTimeout);timers009=[];anim009.forEach(function(a){a.phase=0;a.t=0;a.startTime=null;});}

  const anim010=Array.from({length:19},function(){return{phase:0,t:0,startTime:null};});let timers010=[];
  function playVerse010(){stopVerse010();var _d10=currentTradition==='מרוקאי'?VERSE010_DELAYS_MAR:currentTradition==='אשכנזי'?VERSE010_DELAYS_ASH:VERSE010_DELAYS;for(var _i=0;_i<19;_i++){(function(idx){timers010.push(setTimeout(function(){anim010[idx].phase=1;anim010[idx].t=0;anim010[idx].startTime=performance.now();},_d10[idx]));})(_i);}}
  function stopVerse010(){timers010.forEach(clearTimeout);timers010=[];anim010.forEach(function(a){a.phase=0;a.t=0;a.startTime=null;});}

  const anim011=Array.from({length:11},function(){return{phase:0,t:0,startTime:null};});let timers011=[];
  function playVerse011(){stopVerse011();var _d11=currentTradition==='מרוקאי'?VERSE011_DELAYS_MAR:currentTradition==='אשכנזי'?VERSE011_DELAYS_ASH:VERSE011_DELAYS;for(var _i=0;_i<11;_i++){(function(idx){timers011.push(setTimeout(function(){anim011[idx].phase=1;anim011[idx].t=0;anim011[idx].startTime=performance.now();},_d11[idx]));})(_i);}}
  function stopVerse011(){timers011.forEach(clearTimeout);timers011=[];anim011.forEach(function(a){a.phase=0;a.t=0;a.startTime=null;});}

  const anim012=Array.from({length:8},function(){return{phase:0,t:0,startTime:null};});let timers012=[];
  function playVerse012(){stopVerse012();var _d12=currentTradition==='מרוקאי'?VERSE012_DELAYS_MAR:currentTradition==='אשכנזי'?VERSE012_DELAYS_ASH:VERSE012_DELAYS;for(var _i=0;_i<8;_i++){(function(idx){timers012.push(setTimeout(function(){anim012[idx].phase=1;anim012[idx].t=0;anim012[idx].startTime=performance.now();},_d12[idx]));})(_i);}}
  function stopVerse012(){timers012.forEach(clearTimeout);timers012=[];anim012.forEach(function(a){a.phase=0;a.t=0;a.startTime=null;});}

  // ---- פתיחה / סגירה ----
  function pid(n) { return String(n).padStart(3, '0'); }

  function openItem(n) {
    if (currentItem !== 0) return;
    const el = document.getElementById('canvas-outer-' + pid(n));
    if (!el || el.style.display === 'none') return;
    currentItem = n;
    var _pf=document.getElementById('psuk-vol-faders'); if(_pf) _pf.classList.add('visible');
    const others = ALL_ITEMS.filter(i => i !== n);

    document.getElementById('bg').classList.add('active');
    createTraditionWrap();
    document.getElementById('psuk-hint').classList.add('hidden');
    el.classList.add('open');
    _applyPskScale();
    el.style.zIndex = 6;
    el.onclick = closeItem;
    document.getElementById('mini-label-' + pid(n)).style.display = 'none';
    others.forEach(i => {
      document.getElementById('mini-label-' + pid(i)).style.display = 'none';
      document.getElementById('canvas-outer-' + pid(i)).style.display = 'none';
    });

    triggerAnim(n, 1);

    setTimeout(function() {
      if (currentItem !== n) return;
      document.getElementById('meta-' + pid(n)).classList.add('active');
      document.getElementById('close-btn').classList.add('active');
      const numEl = document.getElementById('open-number');
      numEl.textContent = pid(n);
      const numRights = {
        1:'calc(50vw - 480px)', 2:'calc(50vw - 625px)', 3:'calc(50vw - 605px)',
        4:'calc(50vw - 564px)', 5:'calc(50vw - 410px)', 6:'calc(50vw - 329px)',
        7:'calc(50vw - 643px)', 8:'calc(50vw - 476px)', 9:'calc(50vw - 505px)',
        10:'calc(50vw - 553px)',11:'calc(50vw - 640px)',12:'calc(50vw - 650px)',
        13:'calc(50vw - 608px)',14:'calc(50vw - 493px)',15:'calc(50vw - 505px)',16:'calc(50vw - 600px)'
      };
      if (numRights[n]) numEl.style.right = numRights[n];
      const numTops = {
        2:'calc(50vh + 116px)', 3:'calc(50vh +  89px)', 4:'calc(50vh + 151px)',
        5:'calc(50vh + 274px)', 7:'calc(50vh + 130px)', 8:'calc(50vh + 295px)', 9:'calc(50vh + 231px)',
        10:'calc(50vh + 253px)',11:'calc(50vh +  85px)',12:'calc(50vh +  87px)',
        13:'calc(50vh + 110px)',14:'calc(50vh + 170px)',15:'calc(50vh + 125px)',16:'calc(50vh +  45px)'
      };
      numEl.style.top = numTops[n] || 'calc(50vh + 140px)';
      numEl.classList.add('active');
      const srcEl = document.getElementById('source-label');
      if (sources[n]) {
        srcEl.textContent = sources[n];
        const srcLefts = {
          1:'calc(50vw - 444px)', 2:'calc(50vw - 647px)', 3:'calc(50vw - 658px)',
          4:'calc(50vw - 555px)', 5:'calc(50vw - 374px)', 6:'calc(50vw - 325px)',
          7:'calc(50vw - 654px)', 8:'calc(50vw - 510px)', 9:'calc(50vw - 523px)',
          10:'calc(50vw - 607px)',11:'calc(50vw - 636px)',12:'calc(50vw - 685px)',
          13:'calc(50vw - 610px)',14:'calc(50vw - 490px)',15:'calc(50vw - 438px)',16:'calc(50vw - 594px)'

        };
        if (srcLefts[n]) srcEl.style.left = srcLefts[n];
        srcEl.style.top = numTops[n] || 'calc(50vh + 140px)';
        srcEl.classList.add('active');
      }
      if (n === 1) playVerse001();
      if (n === 2) playVerse002();
      if (n === 3) playVerse003();
      if (n === 4) playVerse004();
      if (n === 5) playVerse005();
      if (n === 6) playVerse006();
      if (n === 7) playVerse007();
      if (n === 8) playVerse008();
      if (n === 9) playVerse009();
      if (n === 10) playVerse010();
      if (n === 11) playVerse011();
      if (n === 12) playVerse012();
      if (n === 13) playVerse013();
      if (n === 14) playVerse014();
      if (n === 15) playVerse015();
      if (n === 16) playVerse016();
      playVerseAudio(n);
      playVerseDrums(n);
    }, 500);
  }

  function closeItem(onDone) {
    if (currentItem === 0) return;
    const n = currentItem;
    const others = ALL_ITEMS.filter(i => i !== n);
    currentItem = 0;
    var _pf=document.getElementById('psuk-vol-faders'); if(_pf) _pf.classList.remove('visible');

    document.getElementById('meta-' + pid(n)).classList.remove('active');
    document.getElementById('close-btn').classList.remove('active');
    const numElC = document.getElementById('open-number');
    numElC.style.top   = '';
    numElC.style.right = '';
    numElC.classList.remove('active');
    const srcElC = document.getElementById('source-label');
    srcElC.style.right = '';
    srcElC.style.left  = '';
    srcElC.style.top   = '';
    srcElC.style.textAlign = '';
    srcElC.classList.remove('active');
    const _coEl = document.getElementById('canvas-outer-' + pid(n));
    _coEl.classList.remove('open');
    _coEl.style.removeProperty('transform');
    _pskSz = 1.0;
    document.getElementById('bg').classList.remove('active');
    removeTraditionWrap();
    document.getElementById('psuk-hint').classList.remove('hidden');
    stopVerseAudio();
    stopVerseDrums();

    if (n === 1) stopVerse001();
    if (n === 2) stopVerse002();
    if (n === 3) stopVerse003();
    if (n === 4) stopVerse004();
    if (n === 5) stopVerse005();
    if (n === 6) stopVerse006();
    if (n === 7) stopVerse007();
    if (n === 8) stopVerse008();
    if (n === 9) stopVerse009();
    if (n === 10) stopVerse010();
    if (n === 11) stopVerse011();
    if (n === 12) stopVerse012();
    if (n === 13) stopVerse013();
    if (n === 14) stopVerse014();
    if (n === 15) stopVerse015();
    if (n === 16) stopVerse016();
    triggerAnim(n, 0);

    setTimeout(function() {
      const elN = document.getElementById('canvas-outer-' + pid(n));
      elN.style.zIndex = MINI_Z[n];
      elN.onclick = function(){ openItem(n); };
      if (currentItem === 0) {
        document.getElementById('mini-label-' + pid(n)).style.display = '';
        others.forEach(i => {
          document.getElementById('mini-label-' + pid(i)).style.display = '';
          document.getElementById('canvas-outer-' + pid(i)).style.display = '';
        });
      }
      if (onDone) onDone();
    }, 500);
  }

  // ---- ניווט עמודים (חיצים + MIDI) ----
  const _NAV = ['/taamim','/?intro=1','/library','/taamim?seq','/psukkim'];
  const _CUR = 4;
  function flashArrow(id, cls) {
    var el = document.getElementById(id); if(!el) return;
    el.classList.remove('arrow-flash-left','arrow-flash-right','arrow-flash-up','arrow-flash-down'); void el.offsetWidth; el.classList.add(cls);
  }
  function _navPage(dir){ window.location.href = _NAV[(_CUR + dir + _NAV.length) % _NAV.length]; }
  let _nRprev=false, _nLprev=false, _kRprev=null;

  document.getElementById('pnav-next').addEventListener('click', function(){ _navPage(1); });
  document.getElementById('pnav-prev').addEventListener('click', function(){ _navPage(-1); });

  // רישום click handlers ראשוני לכל הפסוקים (מונע double-fire עם React onClick)
  for(var _i=1; _i<=16; _i++){
    (function(n){
      var co = document.getElementById('canvas-outer-' + pid(n));
      var ml = document.getElementById('mini-label-' + pid(n));
      if(co) co.onclick = function(){ openItem(n); };
      if(ml) ml.onclick = function(){ openItem(n); };
    })(_i);
  }
  document.addEventListener('keydown', function(e){
    if(e.key==='ArrowDown'){  flashArrow('trad-down','arrow-flash-down');  cycleTrad(1);  }
    if(e.key==='ArrowRight'){ flashArrow('pnav-next','arrow-flash-right'); _navPage(1);  }
    if(e.key==='ArrowLeft'){  flashArrow('pnav-prev','arrow-flash-left');  _navPage(-1); }
  });

  // ---- MIDI ----
  const PAD_TO_ITEM = {
    53:1, 52:2, 51:3, 50:4,
    49:5, 48:6, 47:7, 46:8,
    45:9, 44:10, 43:11, 42:12,
    41:13, 40:14, 39:15, 38:16
  };

  const _LS  = localStorage;
  const _nR  = _LS.getItem('m_nR') !== null ? +_LS.getItem('m_nR') : 26;
  const _nRt = _LS.getItem('m_nRt') || 'cc';
  const _nL  = _LS.getItem('m_nL') !== null ? +_LS.getItem('m_nL') : 27;
  const _nLt = _LS.getItem('m_nLt') || 'cc';
  const _kR  = _LS.getItem('m_kR') !== null ? +_LS.getItem('m_kR') : null;
  const _kL  = _LS.getItem('m_kL') !== null ? +_LS.getItem('m_kL') : null;

  // ---- סקייל פסוק פתוח ע"י נוב ----
  const _OPEN_TR = {
    1:{tx:'calc(50vw - 530px)',ty:'calc(50vh - 128px)',s:1.95},
    2:{tx:'calc(50vw - 820px)',ty:'calc(50vh - 334px)',s:1.55},
    3:{tx:'calc(50vw - 690px)',ty:'calc(50vh - 240px)',s:1.25},
    4:{tx:'calc(50vw - 725px)',ty:'calc(50vh - 160px)',s:1.0},
    5:{tx:'calc(50vw - 1040px)',ty:'calc(50vh - 464px)',s:1.6},
    6:{tx:'calc(50vw - 490px)',ty:'calc(50vh - 200px)',s:1.3},
    7:{tx:'calc(50vw - 785px)',ty:'calc(50vh - 265px)',s:1.75},
    8:{tx:'calc(50vw - 615px)',ty:'calc(50vh - 290px)',s:1.65},
    9:{tx:'calc(50vw - 620px)',ty:'calc(50vh - 281px)',s:1.15},
    10:{tx:'calc(50vw - 645px)',ty:'calc(50vh - 301px)',s:0.9},
    11:{tx:'calc(50vw - 733px)',ty:'calc(50vh - 257px)',s:0.87},
    12:{tx:'calc(50vw - 822px)',ty:'calc(50vh - 263px)',s:1.0},
    13:{tx:'calc(50vw - 641px)',ty:'calc(50vh - 153px)',s:0.85},
    14:{tx:'calc(50vw - 540px)',ty:'calc(50vh - 135px)',s:0.9},
    15:{tx:'calc(50vw - 595px)',ty:'calc(50vh - 170px)',s:0.85},
    16:{tx:'calc(50vw - 624px)',ty:'calc(50vh - 224px)',s:0.65}
  };
  let _pskSz = 1.0;
  function _resolvePx(expr) {
    const vw=window.innerWidth, vh=window.innerHeight;
    const s=expr.replace(/calc\((.+)\)/,'$1')
                .replace(/(\d+\.?\d*)vw/g,function(m,n){return vw*n/100;})
                .replace(/(\d+\.?\d*)vh/g,function(m,n){return vh*n/100;})
                .replace(/(\d+\.?\d*)px/g,'$1');
    return Function('"use strict";return('+s+')')();
  }
  function _applyPskScale() {
    if (currentItem === 0) return;
    const tr = _OPEN_TR[currentItem]; if (!tr) return;
    const el = document.getElementById('canvas-outer-' + pid(currentItem)); if (!el) return;
    const cv = el.querySelector('canvas');
    const cssW = cv ? cv.offsetWidth  : 0;
    const cssH = cv ? cv.offsetHeight : 0;
    const s0 = tr.s, sNew = s0 * _pskSz;
    // מרכז הפסוק במצב הדיפולט
    const cx = _resolvePx(tr.tx) + cssW * s0 / 2;
    const cy = _resolvePx(tr.ty) + cssH * s0 / 2;
    // translate חדש שמשמר את המרכז
    const newTx = cx - cssW * sNew / 2;
    const newTy = cy - cssH * sNew / 2;
    el.style.setProperty('transform',
      'translate('+newTx+'px, '+newTy+'px) scale('+sNew+')', 'important');
  }
  const _fR  = _LS.getItem('m_fR') !== null ? +_LS.getItem('m_fR') : null;
  const _fL  = _LS.getItem('m_fL') !== null ? +_LS.getItem('m_fL') : null;
  const _tU  = _LS.getItem('m_tU') !== null ? +_LS.getItem('m_tU') : null;
  const _tUt = _LS.getItem('m_tUt') || 'cc';
  const _tD  = _LS.getItem('m_tD') !== null ? +_LS.getItem('m_tD') : null;
  const _tDt = _LS.getItem('m_tDt') || 'cc';
  function _setDark(on){ document.body.classList.toggle('dark',on); sessionStorage.setItem('darkMode',on?'1':'0'); }

  function onMidiMsg(msg) {
    if (document.hidden) return;
    _unlockAudio();
    if(typeof _idleReset==='function') _idleReset();
    const [st, note, vel] = msg.data;
    if ((st & 0xF0) === 0x90 && vel > 0) {
      console.log('[MIDI] note_on note:'+note+' → item:'+PAD_TO_ITEM[note]);
      if(note===_nR&&_nRt==='note'){ flashArrow('pnav-prev','arrow-flash-right');  _navPage(-1); return; }
      if(note===_nL&&_nLt==='note'){ flashArrow('pnav-next','arrow-flash-left'); _navPage(1);  return; }
      if(note===_tU&&_tUt==='note'){ flashArrow('trad-down','arrow-flash-down'); cycleTrad(1);  return; }
      const item = PAD_TO_ITEM[note];
      if (!item) return;
      if (currentItem === item) { closeItem(); }
      else if (currentItem === 0) { openItem(item); }
      else { closeItem(function(){ setTimeout(function(){ openItem(item); }, 180); }); }
    }
    if ((st & 0xF0) === 0xB0) {
      const val = vel / 127;
      if(note===_nR&&_nRt==='cc'){ const on=val>0.5; if(on&&!_nRprev){ flashArrow('pnav-prev','arrow-flash-right');  _navPage(-1); } _nRprev=on; return; }
      if(note===_nL&&_nLt==='cc'){ const on=val>0.5; if(on&&!_nLprev){ flashArrow('pnav-next','arrow-flash-left'); _navPage(1);  } _nLprev=on; return; }
      if(note===_tU&&_tUt==='cc'){ if(vel/127>0.5){ flashArrow('trad-down','arrow-flash-down'); cycleTrad(1);  } return; }
      if(_kR!==null && note===_kR){ if(_kRprev===null){ _kRprev=val; } else if(Math.abs(val-_kRprev)>2/127){ _setDark(val<_kRprev); _kRprev=val; } return; }
      if(_kL!==null && note===_kL){ _pskSz = val*2; _applyPskScale(); return; }
      if(_fR!==null && note===_fR){ _LS.setItem('m_vR',val); _drumsClones.forEach(function(a){ a.volume=val; }); if(window._pskFaderSetL) window._pskFaderSetL(val); return; }
      if(_fL!==null && note===_fL){ _LS.setItem('m_vL',val); if(_verseAudio) _verseAudio.volume=currentTradition==='אשכנזי'?Math.min(1,val*(1/0.7)):val; if(window._pskFaderSetR) window._pskFaderSetR(val); return; }
    }
  }

  // unlock HTML Audio autoplay on first user interaction or MIDI message
  var _audioUnlocked = false;
  function _unlockAudio() {
    if (_audioUnlocked) return;
    _audioUnlocked = true;
    var allAudio = [_shofarHolechMar].concat(Object.values(PSK_DRUMS_AUDIO));
    ['ספרדי','אשכנזי','מרוקאי'].forEach(function(t){
      if (VERSE_AUDIO[t]) Object.values(VERSE_AUDIO[t]).forEach(function(a){ allAudio.push(a); });
    });
    allAudio.forEach(function(a){
      if (!a) return;
      a.volume = 0;
      a.play().then(function(){ a.pause(); a.currentTime = 0; a.volume = 1; }).catch(function(){ a.volume = 1; });
    });
  }
  document.addEventListener('click',   _unlockAudio, { once: false });
  document.addEventListener('keydown',  _unlockAudio, { once: false });
  document.addEventListener('touchstart', _unlockAudio, { once: false });

  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({ sysex: false }).then(function(midi) {
      function attach(m) {
        m.inputs.forEach(function(inp) {
          inp.open().then(function() { inp.onmidimessage = onMidiMsg; })
                    .catch(function()  { inp.onmidimessage = onMidiMsg; });
        });
      }
      attach(midi);
      midi.onstatechange = function(e) {
        if (e.port.type === 'input' && e.port.state === 'connected') {
          e.port.open().then(function() { e.port.onmidimessage = onMidiMsg; })
                       .catch(function() { e.port.onmidimessage = onMidiMsg; });
        }
      };
    }).catch(function(err) { console.warn('MIDI:', err); });
  }

(function(){
    var t;
    function doReset(){ sessionStorage.removeItem('darkMode'); localStorage.setItem('m_vR','1'); localStorage.setItem('m_vL','1'); }
    function reset(){ clearTimeout(t); t=setTimeout(function(){ doReset(); window.location.href='/'; },120000); }
    window._idleReset = reset;
    ['mousemove','keydown','mousedown','touchstart','click'].forEach(function(ev){ document.addEventListener(ev,reset,{passive:true}); });
    document.querySelectorAll('.nav-aodot,.nav-logo-sq').forEach(function(el){ el.addEventListener('click', doReset); });
    reset();
  })();

setTimeout(function(){
    setInterval(function(){
      flashArrow('pnav-prev','arrow-flash-left');
      setTimeout(function(){ flashArrow('pnav-next','arrow-flash-right'); }, 500);
    }, 5000);
  }, 3000);

(function(){
    var TRACK_H=130, THUMB_H=32, PAD=5, RANGE=TRACK_H-THUMB_H-PAD*2;
    function volToTop(v){ return PAD+(1-v)*RANGE; }
    function topToVol(top){ return 1-Math.max(0,Math.min(1,(top-PAD)/RANGE)); }

    function initFader(faderEl, thumbEl, lsKey, onUpdate){
      var v = localStorage.getItem(lsKey) !== null ? +localStorage.getItem(lsKey) : 1;
      thumbEl.style.top = volToTop(v)+'px';
      var dragging=false, startY=0, startTop=0;
      function getTop(){ return parseFloat(thumbEl.style.top)||0; }
      faderEl.addEventListener('pointerdown', function(e){ dragging=true; startY=e.clientY; startTop=getTop(); faderEl.setPointerCapture(e.pointerId); });
      faderEl.addEventListener('pointermove', function(e){
        if(!dragging) return;
        var newTop=Math.max(PAD,Math.min(PAD+RANGE,startTop+(e.clientY-startY)));
        thumbEl.style.top=newTop+'px';
        var vol=topToVol(newTop);
        localStorage.setItem(lsKey, vol);
        onUpdate(vol);
      });
      faderEl.addEventListener('pointerup', function(){ dragging=false; });
      faderEl.addEventListener('pointercancel', function(){ dragging=false; });
    }

    var _pendingPskL = null, _pendingPskR = null;
    window._pskFaderSetL = function(v){ _pendingPskL = v; };
    window._pskFaderSetR = function(v){ _pendingPskR = v; };
    selectTradition(currentTradition);
    function _initPskFaders(){
      var thumbL2 = document.getElementById('psuk-thumb-L');
      var thumbR2 = document.getElementById('psuk-thumb-R');
      if(!thumbL2||!thumbR2) return;
      window._pskFaderSetL = function(v){ thumbL2.style.top = volToTop(v)+'px'; };
      window._pskFaderSetR = function(v){ thumbR2.style.top = volToTop(v)+'px'; };
      if(_pendingPskL !== null) window._pskFaderSetL(_pendingPskL);
      if(_pendingPskR !== null) window._pskFaderSetR(_pendingPskR);
    }
    _initPskFaders();
    if(!document.getElementById('psuk-thumb-L')) setTimeout(_initPskFaders, 200);
    var thumbL = document.getElementById('psuk-thumb-L');
    var thumbR = document.getElementById('psuk-thumb-R');
    if(!thumbL||!thumbR){ setTimeout(function(){
      var tL=document.getElementById('psuk-thumb-L'), tR=document.getElementById('psuk-thumb-R');
      if(tL&&tR){ initFader(document.getElementById('psuk-fader-L'),tL,'m_vR',function(v){localStorage.setItem('m_vR',v);}); initFader(document.getElementById('psuk-fader-R'),tR,'m_vL',function(v){localStorage.setItem('m_vL',v);if(window._verseAudioRef)window._verseAudioRef.volume=v;}); }
    },200); }
    if(thumbL&&thumbR){
      initFader(
        document.getElementById('psuk-fader-L'), thumbL, 'm_vR',
        function(v){ localStorage.setItem('m_vR',v); }
      );
      initFader(
        document.getElementById('psuk-fader-R'), thumbR, 'm_vL',
        function(v){ localStorage.setItem('m_vL',v); if(window._verseAudioRef) window._verseAudioRef.volume=v; }
      );
    }
  })();