// ---- library page scripts ----

// ---- מיפוי שמע ----
const AUDIO_PATH = {
  'ספרדי': {'צ':'sfaradi/zakef-gadol.mp3','מ':'sfaradi/zakef-katan.mp3','נ':'sfaradi/etnachta.mp3','ה':'sfaradi/sof-pasuk.mp3','ב':'sfaradi/shnei-gershayim.mp3','ת':'sfaradi/tavir.mp3','ך':'sfaradi/azla.mp3','ל':'sfaradi/shofar-mehupach.mp3','ח':'sfaradi/ravia.mp3','ע':'sfaradi/tarcha.mp3','כ':'sfaradi/zarqa.mp3','ג':'sfaradi/shofar-holech.mp3','י':'sfaradi/yativ.mp3','ש':'sfaradi/terei-kadmin.mp3','ף':'sfaradi/marich.mp3','ד':'sfaradi/darga.mp3'},
  'מרוקאי':{'צ':'morocai/zakef-gadol.mp4','מ':'morocai/zakef-katan.mp4','נ':'morocai/etnachta.mp4','ה':'morocai/sof-pasuk.mp4','ב':'morocai/shnei-gershayim.mp4','ת':'morocai/tavir.mp4','ך':'morocai/azla.mp4','ל':'morocai/shofar-mehupach.mp4','ח':'morocai/ravia.mp4','ע':'morocai/tarcha.mp4','כ':'morocai/zarqa.mp4','ג':'morocai/shofar-holech.mp4','י':'morocai/yativ.mp4','ש':'morocai/terei-kadmin.mp4','ף':'morocai/marich.mp4','ד':'morocai/darga.mp4'},
  'אשכנזי':{'צ':'ashkenazi/zakef-gadol.mp4','מ':'ashkenazi/zakef-katan.mp4','נ':'ashkenazi/etnachta.mp4','ה':'ashkenazi/sof-pasuk.mp4','ב':'ashkenazi/shnei-gershayim.mp4','ת':'ashkenazi/tavir.mp4','ך':'ashkenazi/azla.mp4','ל':'ashkenazi/shofar-mehupach.mp4','ח':'ashkenazi/ravia.mp4','ע':'ashkenazi/tarcha.mp4','כ':'ashkenazi/zarqa.mp4','ג':'ashkenazi/shofar-holech.mp4','י':'ashkenazi/yativ.mp4','ש':'ashkenazi/terei-kadmin.mp4','ף':'ashkenazi/marich.mp3','ד':'ashkenazi/darga.mp4'},
};

// ---- מסך טעינה — מסיר מיד, iframe נטען לזית ----
(function(){
  var ld = document.getElementById('gallery-loading');
  if(ld){ ld.classList.add('out'); setTimeout(function(){ ld.style.display='none'; },450); }
})();

// ---- אוברליי ----
let _activePadEl = null;
let _activeSlot = -1;
let _pageDark = false;
let _closeCooldown = false;
let _iframeLoaded = false;

function _ensureIframe(cb){
  const frame = document.getElementById('melody-frame');
  if(_iframeLoaded){ if(cb) cb(); return; }
  _iframeLoaded = true;
  const dark = sessionStorage.getItem('darkMode')==='1' ? '&light=0' : '&light=1';
  frame.src = '/taamim?seq&embed' + dark;
  // המתן לאתחול ה-iframe
  window.addEventListener('message', function onReady(e){
    if(e.data && e.data.type === 'iframeReady'){
      window.removeEventListener('message', onReady);
      if(cb) cb();
    }
  });
  setTimeout(function(){ if(cb) cb(); }, 4000); // fallback
}

function closeMelody() {
  if(_activeSlot === -1) return;
  document.getElementById('melody-overlay').classList.remove('open');
  document.getElementById('melody-meta').classList.remove('active');
  document.getElementById('gallery-hint').style.display = '';
  if(_activePadEl){ _activePadEl.classList.remove('active-pad'); _activePadEl=null; }
  _activeSlot = -1;
  document.body.classList.toggle('dark', _pageDark);
  const frame = document.getElementById('melody-frame');
  if(frame.contentWindow) frame.contentWindow.postMessage({type:'stopMelody'}, '*');
  _closeCooldown = true;
  setTimeout(function(){ _closeCooldown = false; }, 400);
}

document.getElementById('melody-overlay').addEventListener('click', function(e){
  if(e.target === this || e.target === document.getElementById('melody-frame-wrap')) closeMelody();
});
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeMelody(); });

function openMelody(padSlot) {
  if(_closeCooldown) return;
  if(padSlot === _activeSlot) { closeMelody(); return; }
  const arr = JSON.parse(localStorage.getItem('taam_saved_melodies') || '[]');
  const melIdx = arr.length - 1 - padSlot;
  if(melIdx < 0 || !arr[melIdx]) { closeMelody(); return; }
  const mel = arr[melIdx];
  if(_activeSlot === -1) _pageDark = document.body.classList.contains('dark');

  function doOpen() {
    _activeSlot = padSlot;
    if(_activePadEl) _activePadEl.classList.remove('active-pad');
    const pads = document.querySelectorAll('.pad');
    _activePadEl = pads[padSlot] || null;
    if(_activePadEl) _activePadEl.classList.add('active-pad');
    const melDark = mel.dark ?? false;
    document.body.classList.toggle('dark', melDark);
    const frame = document.getElementById('melody-frame');
    if(frame.contentWindow) frame.contentWindow.postMessage({type:'loadMelody', shapes: mel.shapes, vR: mel.vR, vL: mel.vL, intervals: mel.intervals, dark: melDark}, '*');
    if(mel.savedAt) {
      const d = new Date(mel.savedAt);
      const p = function(n){ return String(n).padStart(2,'0'); };
      document.getElementById('meta-date').textContent = p(d.getDate())+'/'+p(d.getMonth()+1)+'/'+d.getFullYear();
      document.getElementById('meta-time').textContent = p(d.getHours())+':'+p(d.getMinutes());
    }
    document.getElementById('meta-count').textContent = mel.shapes ? mel.shapes.length : 0;
    document.getElementById('melody-meta').classList.add('active');
    document.getElementById('melody-overlay').classList.add('open');
    document.getElementById('gallery-hint').style.display = 'none';
  }

  if(_activeSlot !== -1) {
    document.getElementById('melody-overlay').classList.remove('open');
    if(_activePadEl){ _activePadEl.classList.remove('active-pad'); _activePadEl=null; }
    _activeSlot = -1;
    const frame = document.getElementById('melody-frame');
    setTimeout(function(){
      if(frame.contentWindow) frame.contentWindow.postMessage({type:'stopMelody'}, '*');
      _ensureIframe(doOpen);
    }, 320);
  } else {
    _ensureIframe(doOpen);
  }
}

function render() {
  const saved = JSON.parse(localStorage.getItem('taam_saved_melodies') || '[]');
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  for(let i = 0; i < 16; i++) {
    const idx = saved.length - 1 - i;
    const mel = saved[idx];
    const pad = document.createElement('div');
    pad.className = 'pad';
    if(mel && mel.screenshot) {
      const img = document.createElement('img');
      img.src = mel.screenshot;
      pad.appendChild(img);
      const del = document.createElement('button');
      del.className = 'pad-del';
      del.textContent = '✕';
      del.addEventListener('click', function(e) {
        e.stopPropagation();
        const arr = JSON.parse(localStorage.getItem('taam_saved_melodies') || '[]');
        arr.splice(idx, 1);
        localStorage.setItem('taam_saved_melodies', JSON.stringify(arr));
        render();
      });
      pad.appendChild(del);
    }
    pad.addEventListener('click', function(){ openMelody(i); });
    grid.appendChild(pad);
  }
}
render();

function flashArrow(id, cls) {
  var el = document.getElementById(id); if(!el) return;
  el.classList.remove('arrow-flash-left','arrow-flash-right'); void el.offsetWidth; el.classList.add(cls);
}
document.addEventListener('keydown', function(e){
  if(e.key==='ArrowRight'){ flashArrow('pnav-next','arrow-flash-left');  navPage(-1); }
  if(e.key==='ArrowLeft'){  flashArrow('pnav-prev','arrow-flash-right'); navPage(1);  }
});

const _spNAV = ['/taamim','/?intro=1','/library','/taamim?seq','/psukkim'];
const _spIDX = 2;
function navPage(dir){ window.location.href = _spNAV[(_spIDX + dir + _spNAV.length) % _spNAV.length]; }
document.getElementById('pnav-next').addEventListener('click', function(){ navPage(1); });
document.getElementById('pnav-prev').addEventListener('click', function(){ navPage(-1); });

if(navigator.requestMIDIAccess){
  const LS = localStorage;
  const nR  = LS.getItem('m_nR')  !== null ? +LS.getItem('m_nR')  : 26;
  const nRt = LS.getItem('m_nRt') || 'cc';
  const nL  = LS.getItem('m_nL')  !== null ? +LS.getItem('m_nL')  : 27;
  const nLt = LS.getItem('m_nLt') || 'cc';
  const kR  = LS.getItem('m_kR')  !== null ? +LS.getItem('m_kR')  : null;
  let _nRprev=false, _nLprev=false, _kRprev=null;
  function onMidiMsg(msg){
    if(typeof _idleReset==='function') _idleReset();
    const [st,note,vel]=msg.data;
    if((st&0xF0)===0x90&&vel>0){
      const PAD_NOTE_TO_SLOT={53:0,52:1,51:2,50:3,49:4,48:5,47:6,46:7,45:8,44:9,43:10,42:11,41:12,40:13,39:14,38:15};
      if(note in PAD_NOTE_TO_SLOT){ openMelody(PAD_NOTE_TO_SLOT[note]); return; }
      if(note===nR&&nRt==='note'){ flashArrow('pnav-next','arrow-flash-left');  navPage(-1); return; }
      if(note===nL&&nLt==='note'){ flashArrow('pnav-prev','arrow-flash-right'); navPage(1);  return; }
    }
    if((st&0xF0)===0xB0){
      if(note===nR&&nRt==='cc'){ const on=vel/127>0.5; if(on&&!_nRprev){ flashArrow('pnav-next','arrow-flash-left');  navPage(-1); } _nRprev=on; return; }
      if(note===nL&&nLt==='cc'){ const on=vel/127>0.5; if(on&&!_nLprev){ flashArrow('pnav-prev','arrow-flash-right'); navPage(1);  } _nLprev=on; return; }
      if(note===kR){ const v=vel/127; if(_kRprev!==null && Math.abs(v-_kRprev)>2/127){ const dark=v<_kRprev; document.body.classList.toggle('dark',dark); sessionStorage.setItem('darkMode',dark?'1':'0'); } _kRprev=v; return; }
    }
  }
  navigator.requestMIDIAccess({sysex:false}).then(function(midi){
    midi.inputs.forEach(function(inp){
      inp.open().then(function(){ inp.onmidimessage=onMidiMsg; }).catch(function(){ inp.onmidimessage=onMidiMsg; });
    });
    midi.onstatechange=function(e){
      if(e.port.type==='input'&&e.port.state==='connected'){
        e.port.open().then(function(){ e.port.onmidimessage=onMidiMsg; }).catch(function(){ e.port.onmidimessage=onMidiMsg; });
      }
    };
  }).catch(function(){});
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
    flashArrow('pnav-prev','arrow-flash-right');
    setTimeout(function(){ flashArrow('pnav-next','arrow-flash-left'); }, 500);
  }, 5000);
}, 3000);
