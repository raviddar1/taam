// ---- about page scripts ----

var vid = document.getElementById('intro-vid');
vid.muted = true;
var _audioCtx=null, _gainNode=null;
function _boostVid(){
  if(_audioCtx) return;
  try{
    _audioCtx=new(window.AudioContext||window.webkitAudioContext)();
    var src=_audioCtx.createMediaElementSource(vid);
    _gainNode=_audioCtx.createGain();
    _gainNode.gain.value=2.0;
    src.connect(_gainNode);
    _gainNode.connect(_audioCtx.destination);
    _audioCtx.resume();
  }catch(e){}
}
function unmute(){
  if(vid.muted){
    vid.muted=false;
    _boostVid();
    sessionStorage.setItem('soundOn','1');
  }
}

var _sb = document.getElementById('standby');
document.body.classList.add('standby-active');
var _idleTimer;
var _sbVid = document.getElementById('standby-video');
function showStandby(){
  _sb.classList.remove('hidden'); document.body.classList.add('standby-active');
  var st=document.getElementById('standby-text'); if(st) st.style.opacity='1';
  if(_sbVid){ _sbVid.currentTime=0; _sbVid.play().catch(function(){}); }
  if(typeof _animReset==='function') _animReset();
}
function hideStandby(){
  _sb.classList.add('hidden'); document.body.classList.remove('standby-active'); startIdle();
  if(_sbVid) _sbVid.pause();
  vid.currentTime=0;
  if(!vid.paused){ vid.muted=false; }
  else { vid.play().then(function(){ vid.muted=false; }).catch(function(){}); }
}
function isStandby(){ return !_sb.classList.contains('hidden'); }
function startIdle(){ clearTimeout(_idleTimer); _idleTimer = setTimeout(showStandby, 120000); }
['mousemove','mousedown','touchstart','wheel'].forEach(function(ev){
  document.addEventListener(ev, function(){ if(!isStandby()) startIdle(); }, {passive:true});
});

var _NAV_PAGES = ['/taamim','/','/library','/taamim?seq','/psukkim'];
var _NAV_CUR = 1;
function flashArrow(id, cls) {
  var el = document.getElementById(id); if(!el) return;
  el.classList.remove('arrow-flash-left','arrow-flash-right'); void el.offsetWidth; el.classList.add(cls);
}
function navPage(dir){ window.location.href = _NAV_PAGES[(_NAV_CUR + dir + _NAV_PAGES.length) % _NAV_PAGES.length]; }
vid.addEventListener('click', unmute);
document.addEventListener('keydown', function(e){
  if(isStandby()){
    if(e.key==='Shift'||e.key==='Control'||e.key==='Meta'||/^[0-9]$/.test(e.key)) return;
    hideStandby(); return;
  }
  if(e.key==='ArrowRight'){ flashArrow('pnav-prev','arrow-flash-right'); unmute(); navPage(1);  return; }
  if(e.key==='ArrowLeft'){  flashArrow('pnav-next','arrow-flash-left');  unmute(); navPage(-1); return; }
  unmute();
});
function _tryPlay(){ vid.play().catch(function(){}); }
if(vid.readyState >= 3) _tryPlay();
else vid.addEventListener('canplay', _tryPlay, {once:true});
window.addEventListener('pageshow', function(){ vid.load(); _tryPlay(); });

document.getElementById('pnav-next').addEventListener('click', function(){ navPage(1); });
document.getElementById('pnav-prev').addEventListener('click', function(){ navPage(-1); });

// ---- בקשת הרשאת MIDI על HTTPS ----
(function(){
  if(!navigator.requestMIDIAccess) return;
  var btn = document.getElementById('midi-permission-btn');
  function requestMidi(){
    navigator.requestMIDIAccess({sysex:false}).then(function(){
      if(btn) btn.style.display='none';
    }).catch(function(){
      if(btn){ btn.style.display='block'; btn.textContent='MIDI נחסם — לחץ לניסיון חוזר'; }
    });
  }
  // נסה אוטומטית (עובד אחרי שהמשתמש כבר אישר פעם)
  requestMidi();
  if(btn) btn.addEventListener('click', requestMidi);
  // הצג כפתור אם אחרי 2 שניות עדיין לא קיבלנו גישה
  setTimeout(function(){
    if(!navigator.requestMIDIAccess) return;
    // בדוק אם ניתן לגשת בלי popup (כלומר כבר אושר)
    navigator.permissions && navigator.permissions.query({name:'midi',sysex:false}).then(function(perm){
      if(perm.state==='prompt' && btn) btn.style.display='block';
      if(perm.state==='denied' && btn){ btn.style.display='block'; btn.textContent='MIDI נחסם — אפשר ב-Chrome → נעילה'; }
    }).catch(function(){});
  }, 1500);
})();

if(navigator.requestMIDIAccess){
  const _LS  = localStorage;
  const _nR  = _LS.getItem('m_nR') !== null ? +_LS.getItem('m_nR') : 26;
  const _nRt = _LS.getItem('m_nRt') || 'cc';
  const _nL  = _LS.getItem('m_nL') !== null ? +_LS.getItem('m_nL') : 27;
  const _nLt = _LS.getItem('m_nLt') || 'cc';
  const _kR  = _LS.getItem('m_kR') !== null ? +_LS.getItem('m_kR') : null;
  let _nRprev=false, _nLprev=false;
  function _setDark(on){ document.body.classList.toggle('dark',on); sessionStorage.setItem('darkMode',on?'1':'0'); }
  function onMidiMsg(msg){
    const [st,note,vel] = msg.data;
    if(isStandby()){ hideStandby(); return; }
    if((st&0xF0)===0x90&&vel>0){
      unmute();
      if(note===_nR&&_nRt==='note'){ flashArrow('pnav-next','arrow-flash-left');  navPage(-1); return; }
      if(note===_nL&&_nLt==='note'){ flashArrow('pnav-prev','arrow-flash-right'); navPage(1);  return; }
    }
    if((st&0xF0)===0xB0){
      const val=vel/127;
      if(note===_nR&&_nRt==='cc'){ const on=val>0.5; if(on&&!_nRprev){ flashArrow('pnav-next','arrow-flash-left');  navPage(-1); } _nRprev=on; return; }
      if(note===_nL&&_nLt==='cc'){ const on=val>0.5; if(on&&!_nLprev){ flashArrow('pnav-prev','arrow-flash-right'); navPage(1);  } _nLprev=on; return; }
      if(_kR!==null && note===_kR){ _setDark(val>0); return; }
    }
  }
  navigator.requestMIDIAccess({sysex:false}).then(function(midi){
    midi.inputs.forEach(function(inp){
      inp.open().then(function(){ inp.onmidimessage=onMidiMsg; })
                .catch(function(){ inp.onmidimessage=onMidiMsg; });
    });
    midi.onstatechange=function(e){
      if(e.port.type==='input'&&e.port.state==='connected'){
        e.port.open().then(function(){ e.port.onmidimessage=onMidiMsg; })
                     .catch(function(){ e.port.onmidimessage=onMidiMsg; });
      }
    };
  }).catch(function(){});
}

setTimeout(function(){
  setInterval(function(){
    flashArrow('pnav-prev','arrow-flash-right');
    setTimeout(function(){ flashArrow('pnav-next','arrow-flash-left'); }, 500);
  }, 5000);
}, 3000);

// ---- p5.js sketch ----
new p5(function(pg){
  var KEYS=['ח','מ','ע','ב','ך','ל','צ','ת','ף','נ','ש'];
  var N=KEYS.length, CW, CH=270, SC;
  var VH=400;
  var D={CZ:2.2,MZ:2.2,N3:1.7,B5:2.0,K7:2.0,L8:2.0,T6:1.5,E10:2.0,SH:2.0*0.72};
  var RI=1.5, RT=3.3, TOTAL=RT+0.2;
  var tr1=[],tr2=[],TR1=15,TR2=15,marichProg=0;
  var startMs=-1;

  function eII(t){return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
  function eOQ(t){return 1-(1-t)*(1-t);}
  function eOC(t){return 1-Math.pow(1-t,3);}
  function eIIQ(t){return t<0.5?16*Math.pow(t,5):1-Math.pow(-2*t+2,5)/2;}
  function ss(x){return x*x*(3-2*x);}
  function lp(a,b,t){return a+(b-a)*t;}
  function cl(v,lo,hi){return Math.max(lo,Math.min(hi,v));}
  function drawRav(x,y,w,h){pg.triangle(x-w/2,y,x+w/2,y-h/2,x+w/2,y+h/2);}

  pg.setup=function(){
    var el=document.getElementById('taam-strip');
    CW=Math.round(window.innerWidth*0.86); SC=0.6;
    el.style.width=CW+'px';
    pg.createCanvas(CW,CH).parent('taam-strip');
    tr1=[];tr2=[];marichProg=0;
  };

  var YOFF={'ח':-72,'מ':0,'ע':-80,'ב':0,'ך':-13,'ל':-70,'צ':-25,'ת':-89,'ף':-13,'נ':-120,'ש':-95};
  var KEEP={'ח':1,'צ':1,'ע':1};
  var P2OFF={'צ':{x:25,y:-12},'ע':{x:-243,y:50},'ח':{x:-390,y:-45}};
  var P2SC={'ח':0.55,'צ':0.68,'ע':0.42};
  var P2_START=4.0, P2_IN=1.2, P2_HOLD=5.0, P2_OUT=2.8, P1_HOLD=4.5;
  var CYCLE=P2_IN+P2_HOLD+P2_OUT+P1_HOLD;
  var REPLAY_AT=P2_IN+P2_HOLD+P2_OUT;
  var _cycleIdx=-1;

  pg.draw=function(){
    pg.clear();pg.noStroke();
    if(startMs<0) startMs=pg.millis();
    var rawEl=(pg.millis()-startMs)/1000;
    var p2t=0, elKept, elAnim, subPhase=0;
    if(rawEl<P2_START){
      elKept=elAnim=Math.min(rawEl,TOTAL);
    } else {
      var lt=(rawEl-P2_START)%CYCLE;
      var ci=Math.floor((rawEl-P2_START)/CYCLE);
      if(ci!==_cycleIdx){ _cycleIdx=ci; tr1=[]; tr2=[]; }
      elKept=TOTAL;
      if(lt<P2_IN){
        subPhase=1; p2t=lt/P2_IN; elAnim=TOTAL;
      } else if(lt<P2_IN+P2_HOLD){
        subPhase=2; p2t=1; elAnim=TOTAL;
      } else if(lt<REPLAY_AT){
        subPhase=3; p2t=1-(lt-P2_IN-P2_HOLD)/P2_OUT;
        elAnim=Math.min(lt-(P2_IN+P2_HOLD),TOTAL);
      } else {
        subPhase=3; p2t=0;
        elAnim=Math.min(P2_OUT+(lt-REPLAY_AT),TOTAL);
      }
    }
    var p2e=p2t<0.5?16*Math.pow(p2t,5):1-Math.pow(-2*p2t+2,5)/2;
    var p2ePos=p2e;
    if(rawEl>=P2_START){
      var ltc=(rawEl-P2_START)%CYCLE;
      var retStart=P2_IN+P2_HOLD-0.2;
      var retDur=1.0;
      if(ltc>=retStart){
        var rp=Math.min(1,(ltc-retStart)/retDur);
        p2ePos=1-(rp<0.5?4*rp*rp*rp:1-Math.pow(-2*rp+2,3)/2);
      }
    }
    marichProg=Math.min(1,elAnim*0.6);
    var cw=CW/N;
    for(var i=0;i<N;i++){
      var key=KEYS[i];
      var kept=KEEP[key]===1;
      var alpha;
      if(kept)             alpha=1;
      else if(subPhase===1) alpha=Math.max(0,1-p2e);
      else if(subPhase===2) alpha=0;
      else                  alpha=1;
      if(alpha<=0) continue;
      var targetSc=P2SC[key]!==undefined?P2SC[key]:0.85;
      var sc=kept?lp(1,targetSc,p2ePos):1;
      var off=P2OFF[key]||{x:0,y:0};
      pg.push();
      pg.drawingContext.globalAlpha=alpha;
      pg.translate(CW-(i+0.5)*cw+off.x*p2ePos,200+off.y*p2ePos);
      pg.scale(SC*sc);pg.translate(0,YOFF[key]||0);pg.noStroke();
      anim(key,kept?elKept:elAnim,cw/SC);
      pg.pop();
      pg.drawingContext.globalAlpha=1;
    }
    var lr=document.getElementById('logo-reveal');
    var lrd=document.getElementById('logo-reveal-dark');
    var st=document.getElementById('standby-text');
    var logoOp=p2ePos*p2ePos;
    if(lr) lr.style.opacity=logoOp;
    if(lrd) lrd.style.opacity=logoOp;
    if(st) st.style.opacity=1;
  };

  window._animReset=function(){
    startMs=-1; marichProg=0; tr1=[]; tr2=[]; _cycleIdx=-1;
    var lr=document.getElementById('logo-reveal'); if(lr) lr.style.opacity=0;
    var lrd=document.getElementById('logo-reveal-dark'); if(lrd) lrd.style.opacity=0;
    var st=document.getElementById('standby-text'); if(st) st.style.opacity=1;
    pg.loop();
  };

  function anim(key,el,cw){
    switch(key){
      case 'ח':{
        var pR=cl(el/RI,0,1),pL=cl((el-0.32)/RI,0,1);
        var sW=54,sH=144,sh=10.3,gp=-3.6;
        var cx2=-sh,lT=cx2-sW/2-gp/2,rT=cx2+sW/2+gp/2;
        var rX=lp(rT+54,rT,eOC(pR)),lX=lp(lT+30,lT,eOC(pL));
        pg.fill(170,150,232,255*Math.min(1,pL*3));drawRav(lX,0,sW,sH);
        pg.fill(170,150,232,255*Math.min(1,pR*3));drawRav(rX,0,sW,sH);
        break;}
      case 'מ':{
        var pv=cl(el/D.MZ,0,1),et=eOC(pv);
        var d=62, len=d*2;
        pg.fill(81,162,221);
        for(var i=0;i<3;i++){
          var fx=-i*len/2;
          pg.circle(45+fx*et,-d/2,d);
        } break;}
      case 'ע':{
        var pv=cl(el/D.E10,0,1),oR=120,iR=oR*0.72,ox=oR*0.33,oy=-oR*0.33;
        var curA=lp(pg.PI,pg.HALF_PI,pv);
        pg.fill(198,233,2);pg.beginShape();
        for(var a=pg.PI;a>=curA;a-=0.02) pg.vertex(ox+Math.cos(a)*oR,oy+Math.sin(a)*oR);
        pg.vertex(ox+Math.cos(curA)*iR,oy+Math.sin(curA)*iR);
        for(var a=curA;a<=pg.PI;a+=0.02) pg.vertex(ox+Math.cos(a)*iR,oy+Math.sin(a)*iR);
        pg.endShape(pg.CLOSE); break;}
      case 'ב':{
        var pv=cl(el/D.B5,0,1),hs=1+1.5*Math.pow(Math.sin(pv*pg.PI),0.6);
        pg.fill(238,146,3);pg.triangle(-55,0,55,0,55,-85*hs); break;}
      case 'ך':{
        var pv=cl(el/D.K7,0,1),e=eOC(pv);
        pg.fill(198,233,2);pg.rect(-150*e+75,-14,150*e,27); break;}
      case 'ל':{
        var pv=cl(el/D.L8,0,1),pr=pv*0.7,eR,sR;
        if(pr<0.4){var t3=eOQ(pr/0.4);eR=t3*146;sR=t3*62;}
        else{var t3=eOQ((pr-0.4)/0.3);eR=146-t3*73;sR=62-t3*26;}
        pg.fill(81,162,221,127);pg.circle(0,0,eR*2);
        pg.fill(81,162,221);pg.circle(0,0,sR*2); break;}
      case 'צ':{
        var pv=cl(el/D.CZ,0,1),d=50,al=ss(pv<0.28?pv/0.28:1)*255,cs=[];
        if(pv<0.5){var sv=pv/0.5,len2=VH*0.26*eII(sv);for(var i=0;i<5;i++)cs.push({x:0,y:-i/4*len2});}
        else{var t4=eII((pv-0.5)/0.5),len5=VH*0.26,ends=[0,0,-d,0,-d*2];for(var i=0;i<5;i++){var sy=-i/4*len5;cs.push({x:0,y:sy+(ends[i]-sy)*t4});}}
        if(el<D.CZ) tr1.push({cs:cs.map(function(c){return{x:c.x,y:c.y};}),al:al});
        if(tr1.length>TR1) tr1.shift();
        for(var t5=0;t5<tr1.length-1;t5++){
          pg.fill(255,225,55,tr1[t5].al*((t5+1)/TR1)*0.04);
          tr1[t5].cs.forEach(function(c){pg.circle(c.x,c.y,d*1.05);});
        }
        pg.fill(255,225,55,al);cs.forEach(function(c){pg.circle(c.x,c.y,d);}); break;}
      case 'ת':{
        var pr=cl(el/D.T6,0,1),rv=75,gv=26,cv=24,hw=14;
        pg.fill(170,150,232);pg.beginShape();
        for(var a=0;a<=pg.PI;a+=0.02) pg.vertex(Math.cos(a)*(rv+hw),Math.sin(a)*(rv+hw));
        for(var a=pg.PI;a>=0;a-=0.02) pg.vertex(Math.cos(a)*(rv-hw),Math.sin(a)*(rv-hw));
        pg.endShape(pg.CLOSE);
        var ang=pr<0.65?(1-Math.pow(1-pr/0.65,2))*pg.PI:pg.PI-eOQ((pr-0.65)/0.35)*pg.HALF_PI;
        pg.fill(170,150,232);pg.circle((rv-gv-cv)*Math.cos(ang),(rv-gv-cv)*Math.sin(ang),cv*2); break;}
      case 'ף':{
        var e=eOC(marichProg);
        pg.fill(81,162,221);pg.rect(-150*e+45,-14,150*e,27); break;}
      case 'נ':{
        var pv=cl(el/D.N3,0,1),e=eOC(pv);
        pg.fill(255,33,33);pg.rect(-12,0,24,120*e); break;}
      case 'ש':{
        var tR=cl(el/D.SH,0,1),t6=eII(tR),r2=95;
        var gE=eII(cl(t6/0.38,0,1)),m=eIIQ(cl((t6-0.55)/0.45,0,1));
        var sA=lp(0,pg.radians(130),m),eA=lp(pg.TWO_PI,pg.radians(310),m);
        pg.fill(255,225,55);pg.push();pg.rotate(pg.radians(200));
        pg.arc(0,0,r2*2*gE,r2*2*gE,sA,eA,pg.PIE);pg.pop(); break;}
    }
  }
},'taam-strip');
