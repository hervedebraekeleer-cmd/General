const $=s=>document.querySelector(s);
const COLORS=['#e53935','#fb8c00','#fdd835','#43a047','#1e88e5','#8e24aa','#ec407a','#6d4c41','#212121'];
let animal=null,step=0,strokes=[],curStroke=null,color=COLORS[0],size=16,erase=false,voice=true,penSeen=false,sprite=null,spriteScene='sea',photoImg=null;
const pad=$('#pad'),pc=pad.getContext('2d'),anim=new Anim($('#stageCv'));

function show(id){document.querySelectorAll('.screen').forEach(e=>e.classList.toggle('active',e.id===id));if(id!=='anim')anim.stop();requestAnimationFrame(fit)}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function fit(){const st=$('#stage');if(!st.offsetHeight)return;const portrait=innerHeight>innerWidth,b=$('#board');
  const s=portrait?Math.min(st.clientWidth,st.clientHeight*.62):Math.min(st.clientHeight,st.clientWidth*.62);b.style.width=b.style.height=Math.floor(s)+'px'}
addEventListener('resize',()=>{fit();if(anim.running)anim.resize()});

// ---------- Home ----------
function renderHome(){
  $('#animals').innerHTML=ANIMALS.map(a=>`<button class="card" data-a="${a.id}"><span class="em">${a.emoji}</span><b>${a.name}</b></button>`).join('');
  const g=loadGallery();$('#galleryBox').hidden=!g.length;
  $('#gallery').innerHTML=g.map(x=>`<div class="thumb" data-id="${x.id}"><img src="${x.img}" alt=""><button class="x" data-del="${x.id}">✕</button></div>`).join('');
}
$('#animals').onclick=e=>{const b=e.target.closest('[data-a]');if(b)startDraw(b.dataset.a)};
$('#photoHome').onclick=()=>{animal=null;resetPhoto();show('photo')};
$('#gallery').onclick=e=>{
  const del=e.target.closest('[data-del]');
  if(del){if(confirm('Deze tekening weggooien?')){saveGallery(loadGallery().filter(x=>x.id!=del.dataset.del));renderHome()}return}
  const t=e.target.closest('[data-id]');if(!t)return;const it=loadGallery().find(x=>x.id==t.dataset.id);if(!it)return;
  const im=new Image();im.onload=()=>{sprite=im;spriteScene=it.scene;runAnim()};im.src=it.img};
function loadGallery(){try{return JSON.parse(localStorage.getItem('kd_gallery')||'[]')}catch(e){return[]}}
function saveGallery(a){try{localStorage.setItem('kd_gallery',JSON.stringify(a));return true}catch(e){return false}}

// ---------- Tekenen ----------
function startDraw(id){animal=ANIMALS.find(a=>a.id===id);step=0;strokes=[];redraw();$('#drawTitle').textContent=animal.emoji+' '+animal.name;show('draw');renderStep(true)}
function renderStep(speakNow){
  const n=animal.steps.length,s=animal.steps[step];
  $('#stepNo').textContent=`Stap ${step+1} van ${n}`;$('#instr').textContent=s.t;
  $('#dots').innerHTML=animal.steps.map((_,i)=>`<i class="${i<step?'on':i==step?'cur':''}"></i>`).join('');
  $('#prev').disabled=step==0;$('#next').textContent=step==n-1?'Klaar! ✨':'Volgende ▶';
  const hue=i=>`hsl(${(i*57+260)%360} 80% 50%)`;
  $('#guide').innerHTML='<g transform="translate(6 6) scale(.88)">'+animal.steps.map((st,i)=>i>step?'':st.p.map(d=>`<path d="${d}" class="${i<step?'done':'now'}" ${i==step?`style="stroke:${hue(i)}"`:''}/>`).join('')).join('')+'</g>';
  if(speakNow&&voice)say(s.t);
}
function say(t){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);const vs=speechSynthesis.getVoices();const v=vs.find(v=>/nl[-_]BE/i.test(v.lang))||vs.find(v=>/^nl/i.test(v.lang));if(v)u.voice=v;u.lang=v?v.lang:'nl-NL';u.rate=.9;speechSynthesis.speak(u)}catch(e){}}
$('#speak').onclick=()=>say(animal.steps[step].t);
$('#prev').onclick=()=>{if(step>0){step--;renderStep(true)}};
$('#next').onclick=()=>{if(step<animal.steps.length-1){step++;renderStep(true);chime(false)}else finish()};
$('#drawBack').onclick=()=>{try{speechSynthesis.cancel()}catch(e){}if(!strokes.length||confirm('Stoppen? Je tekening gaat weg.')){renderHome();show('home')}};

$('#palette').innerHTML=COLORS.map((c,i)=>`<button style="background:${c}" data-c="${c}" class="${i?'':'sel'}"></button>`).join('');
$('#palette').onclick=e=>{const b=e.target.closest('[data-c]');if(!b)return;color=b.dataset.c;erase=false;mark()};
document.querySelectorAll('[data-size]').forEach(b=>b.onclick=()=>{size=+b.dataset.size;mark()});
$('#eraser').onclick=()=>{erase=!erase;mark()};
$('#undo').onclick=()=>{strokes.pop();redraw()};
$('#clear').onclick=()=>{if(strokes.length&&confirm('Alles wissen?')){strokes=[];redraw()}};
function mark(){document.querySelectorAll('#palette button').forEach(b=>b.classList.toggle('sel',!erase&&b.dataset.c===color));
  document.querySelectorAll('[data-size]').forEach(b=>b.classList.toggle('sel',+b.dataset.size===size));$('#eraser').classList.toggle('sel',erase)}

function drawStroke(s){pc.globalCompositeOperation=s.erase?'destination-out':'source-over';pc.strokeStyle=pc.fillStyle=s.color;pc.lineWidth=s.size;pc.lineCap=pc.lineJoin='round';
  const p=s.pts;if(p.length==1){pc.beginPath();pc.arc(p[0].x,p[0].y,s.size/2,0,7);pc.fill();return}pc.beginPath();pc.moveTo(p[0].x,p[0].y);for(let i=1;i<p.length;i++)pc.lineTo(p[i].x,p[i].y);pc.stroke()}
function redraw(){pc.globalCompositeOperation='source-over';pc.clearRect(0,0,1000,1000);strokes.forEach(drawStroke)}
function pt(e){const r=pad.getBoundingClientRect();return{x:(e.clientX-r.left)*1000/r.width,y:(e.clientY-r.top)*1000/r.height}}
pad.addEventListener('pointerdown',e=>{if(e.pointerType==='pen')penSeen=true;if(e.pointerType==='touch'&&penSeen)return;if(curStroke)return;
  pad.setPointerCapture(e.pointerId);curStroke={id:e.pointerId,color,size,erase,pts:[pt(e)]};drawStroke(curStroke)});
pad.addEventListener('pointermove',e=>{if(!curStroke||e.pointerId!==curStroke.id)return;
  for(const ev of(e.getCoalescedEvents?e.getCoalescedEvents():[e])){const p=pt(ev),l=curStroke.pts[curStroke.pts.length-1];curStroke.pts.push(p);
    pc.globalCompositeOperation=erase?'destination-out':'source-over';pc.strokeStyle=curStroke.color;pc.lineWidth=curStroke.size;pc.lineCap='round';pc.beginPath();pc.moveTo(l.x,l.y);pc.lineTo(p.x,p.y);pc.stroke()}});
const endS=e=>{if(!curStroke||e.pointerId!==curStroke.id)return;strokes.push(curStroke);curStroke=null};
pad.addEventListener('pointerup',endS);pad.addEventListener('pointercancel',endS);
pad.addEventListener('contextmenu',e=>e.preventDefault());

function snapshot(){const c=document.createElement('canvas');c.width=c.height=1000;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,1000,1000);x.drawImage(pad,0,0);return c}
function finish(){try{speechSynthesis.cancel()}catch(e){}$('#finImg').src=snapshot().toDataURL('image/jpeg',.85);chime(true);show('finish')}
$('#finBack').onclick=()=>show('draw');
$('#finHome').onclick=()=>{renderHome();show('home')};
$('#finLive').onclick=()=>{const r=makeSprite(snapshot(),{sens:5,crop:0,max:640});sprite=r.canvas;spriteScene=animal?animal.scene:'sea';runAnim()};
$('#finPhoto').onclick=()=>{resetPhoto();show('photo')};

// ---------- Foto ----------
function resetPhoto(){photoImg=null;sprite=null;$('#emptyMsg').hidden=false;$('#photoLive').disabled=true;$('#tip').hidden=true;const c=$('#prev2');c.width=c.height=1}
$('#photoBack').onclick=()=>animal?show('finish'):(renderHome(),show('home'));
$('#btnCam').onclick=()=>$('#fileCam').click();
$('#btnPick').onclick=()=>$('#filePick').click();
for(const id of['#fileCam','#filePick'])$(id).onchange=e=>{const f=e.target.files[0];e.target.value='';if(!f)return;const im=new Image();im.onload=()=>{photoImg=im;processPhoto()};im.onerror=()=>toast('Foto mislukt, probeer opnieuw');im.src=URL.createObjectURL(f)};
let pt_;function processPhoto(){if(!photoImg)return;clearTimeout(pt_);pt_=setTimeout(()=>{
  const r=makeSprite(photoImg,{sens:+$('#sens').value,crop:+$('#crop').value/100,max:640});sprite=r.canvas;
  const c=$('#prev2');c.width=sprite.width;c.height=sprite.height;c.getContext('2d').drawImage(sprite,0,0);
  $('#emptyMsg').hidden=true;$('#photoLive').disabled=false;$('#tip').hidden=!r.leaked},30)}
$('#sens').oninput=$('#crop').oninput=processPhoto;
$('#photoLive').onclick=()=>{spriteScene=animal?animal.scene:(spriteScene||'sea');runAnim()};

// ---------- Animatie ----------
function runAnim(){
  $('#sceneBtns').innerHTML=Object.entries(SCENES).map(([k,v])=>`<button data-s="${k}" class="${k===spriteScene?'sel':''}">${v.label}</button>`).join('');
  show('anim');requestAnimationFrame(()=>{anim.flip=false;anim.start(sprite,spriteScene)});chime(true)}
$('#sceneBtns').onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;spriteScene=b.dataset.s;anim.setScene(spriteScene);
  document.querySelectorAll('#sceneBtns button').forEach(x=>x.classList.toggle('sel',x===b))};
$('#animBack').onclick=()=>{renderHome();show('home')};
$('#flip').onclick=()=>{anim.flip=!anim.flip};
$('#stageCv').addEventListener('pointerdown',e=>{const r=e.target.getBoundingClientRect();anim.tap(e.clientX-r.left,e.clientY-r.top)});
$('#save').onclick=()=>{const g=loadGallery();g.unshift({id:Date.now(),img:(sprite.toDataURL?sprite:spriteToCanvas()).toDataURL('image/png'),scene:spriteScene});
  if(!saveGallery(g.slice(0,12)))toast('Geen plaats meer');else toast('Bewaard! ⭐')};
function spriteToCanvas(){const c=document.createElement('canvas');c.width=sprite.naturalWidth;c.height=sprite.naturalHeight;c.getContext('2d').drawImage(sprite,0,0);return c}
$('#rec').onclick=()=>{
  if(!window.MediaRecorder)return toast('Filmpje niet mogelijk op dit toestel');
  const cv=$('#stageCv'),bar=document.querySelector('.bar');const mt=['video/webm;codecs=vp9','video/webm','video/mp4'].find(t=>MediaRecorder.isTypeSupported(t));
  const mr=new MediaRecorder(cv.captureStream(30),mt?{mimeType:mt}:{}),ch=[];mr.ondataavailable=e=>e.data.size&&ch.push(e.data);
  mr.onstop=()=>{bar.style.visibility='';const b=new Blob(ch,{type:mr.mimeType}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='mijn-tekening-leeft.'+(mr.mimeType.includes('mp4')?'mp4':'webm');a.click();toast('Filmpje bewaard in Downloads 🎥')};
  bar.style.visibility='hidden';toast('🔴 Filmpje opnemen (6 sec)');mr.start();setTimeout(()=>mr.stop(),6000)};

// ---------- Start ----------
renderHome();mark();
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
try{speechSynthesis.getVoices()}catch(e){}
