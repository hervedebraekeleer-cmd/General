const TAU=Math.PI*2;
function star(c,x,y,r,rot=0){c.beginPath();for(let i=0;i<10;i++){const a=rot+i*Math.PI/5-Math.PI/2,rr=i%2?r*.45:r;c[i?'lineTo':'moveTo'](x+Math.cos(a)*rr,y+Math.sin(a)*rr)}c.closePath();c.fill()}
function rnd(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function grad(c,H,stops){const g=c.createLinearGradient(0,0,0,H);stops.forEach(([p,col])=>g.addColorStop(p,col));c.fillStyle=g}
function cloud(c,x,y,s){c.fillStyle='rgba(255,255,255,.92)';c.beginPath();c.arc(x,y,24*s,0,TAU);c.arc(x+26*s,y-12*s,30*s,0,TAU);c.arc(x+56*s,y,24*s,0,TAU);c.rect(x,y,56*s,24*s);c.fill()}
function sun(c,x,y,r,t){c.save();c.translate(x,y);c.rotate(t*.2);c.fillStyle='rgba(255,230,90,.5)';for(let i=0;i<12;i++){c.rotate(TAU/12);c.fillRect(r*1.2,-6,r*.6,12)}c.restore();c.fillStyle='#ffd93b';c.beginPath();c.arc(x,y,r,0,TAU);c.fill()}

const SCENES={
sea:{label:'🌊 Zee',speed:.13,
 bg(c,W,H,t){const R=rnd(3);grad(c,H,[[0,'#8be0ff'],[.5,'#2a9fe0'],[1,'#0b4f94']]);c.fillRect(0,0,W,H);
  c.fillStyle='rgba(255,255,255,.10)';for(let i=0;i<5;i++){const x=W*i/5+Math.sin(t*.3+i)*40;c.beginPath();c.moveTo(x,0);c.lineTo(x+70,0);c.lineTo(x+190,H);c.lineTo(x-30,H);c.fill()}
  c.fillStyle='rgba(10,70,130,.35)';for(let i=0;i<4;i++){const x=((t*(12+i*5)+i*W/4)%(W+160))-80,y=H*(.2+.15*i);c.beginPath();c.ellipse(x,y,26,12,0,0,TAU);c.moveTo(x-22,y);c.lineTo(x-42,y-12);c.lineTo(x-42,y+12);c.fill()}
  c.fillStyle='#f0d79a';c.beginPath();c.moveTo(0,H);c.lineTo(0,H*.9);for(let x=0;x<=W;x+=20)c.lineTo(x,H*.9+Math.sin(x*.01)*12);c.lineTo(W,H);c.fill();
  for(let i=0;i<9;i++){const bx=R()*W,h=60+R()*90;c.strokeStyle=['#2e9e5b','#1f7a4a','#3fbf6d'][i%3];c.lineWidth=9;c.lineCap='round';c.beginPath();c.moveTo(bx,H*.93);c.bezierCurveTo(bx+Math.sin(t+i)*22,H*.93-h*.4,bx-Math.sin(t*1.1+i)*22,H*.93-h*.7,bx+Math.sin(t*1.2+i)*26,H*.93-h);c.stroke()}
  for(let i=0;i<6;i++){c.fillStyle=['#ff7aa8','#ffb347','#c58bff'][i%3];c.beginPath();c.arc(R()*W,H*.95+R()*10,10+R()*10,0,TAU);c.fill()}},
 pose(A,t){A.y=A.H*.45+Math.sin(t*1.2)*A.H*.06;A.rot=Math.sin(t*5)*.05;A.sx=1+.04*Math.sin(t*5);A.sy=1},
 amb(A,dt){if(Math.random()<dt*3)A.parts.push({k:'bub',x:Math.random()*A.W,y:A.H*.92,vx:0,vy:-60-Math.random()*50,r:3+Math.random()*7,l:5,m:5})}},
sky:{label:'🐦 Lucht',speed:.17,
 bg(c,W,H,t){grad(c,H,[[0,'#5bb8ff'],[1,'#e3f6ff']]);c.fillRect(0,0,W,H);sun(c,W*.86,H*.17,H*.07,t);
  [[0,.2,1.3,9],[.3,.5,1,14],[.6,.25,1.5,7],[.85,.62,.9,12],[.15,.78,1.1,10]].forEach(([fx,fy,s,v])=>cloud(c,((fx*W+t*v*4)%(W+200))-100,fy*H,s));
  c.strokeStyle='rgba(60,80,120,.5)';c.lineWidth=3;c.lineCap='round';for(let i=0;i<3;i++){const x=((t*(20+i*8)+i*W/3)%(W+100))-50,y=H*(.14+.1*i)+Math.sin(t*2+i)*8,f=Math.sin(t*8+i)*6;c.beginPath();c.moveTo(x-10,y-f);c.quadraticCurveTo(x-4,y-8,x,y);c.quadraticCurveTo(x+4,y-8,x+10,y-f);c.stroke()}},
 pose(A,t){A.y=A.H*.38+Math.sin(t*1.5)*A.H*.1;A.rot=Math.cos(t*1.5)*.12*-A.dir;A.sx=1;A.sy=1+.1*Math.sin(t*9)}},
meadow:{label:'🌳 Weide',speed:.07,shadow:true,
 bg(c,W,H,t){const R=rnd(7);grad(c,H,[[0,'#7fcbff'],[.6,'#d6f1ff']]);c.fillRect(0,0,W,H);sun(c,W*.12,H*.16,H*.07,t);cloud(c,((t*8)%(W+200))-100,H*.18,1.2);cloud(c,((t*5+W*.5)%(W+200))-100,H*.3,.9);
  c.fillStyle='#7ccf6b';c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=20)c.lineTo(x,H*.62+Math.sin(x*.004)*H*.05);c.lineTo(W,H);c.fill();
  c.fillStyle='#5cb85c';c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=20)c.lineTo(x,H*.74+Math.sin(x*.006+2)*H*.03);c.lineTo(W,H);c.fill();
  for(let i=0;i<22;i++){const fx=R()*W,fy=H*(.7+R()*.27),col=['#ff5c8a','#ffd93b','#ffffff','#b46bff'][i%4],sw=Math.sin(t*1.5+i)*4;c.strokeStyle='#2e8b3d';c.lineWidth=3;c.beginPath();c.moveTo(fx,fy+24);c.lineTo(fx+sw,fy);c.stroke();c.fillStyle=col;for(let p=0;p<5;p++){c.beginPath();c.arc(fx+sw+Math.cos(p*TAU/5)*7,fy+Math.sin(p*TAU/5)*7,5,0,TAU);c.fill()}c.fillStyle='#ffa500';c.beginPath();c.arc(fx+sw,fy,4,0,TAU);c.fill()}
  const bx=W*.5+Math.sin(t*.7)*W*.25,by=H*.5+Math.sin(t*1.3)*H*.08,w=Math.sin(t*14)*.6+.5;c.fillStyle='#ff8c42';[-1,1].forEach(s=>{c.beginPath();c.ellipse(bx+s*9*w,by,9*w+3,7,s*.4,0,TAU);c.fill()})},
 pose(A,t){const b=Math.abs(Math.sin(t*4));A.y=A.H*.7-b*A.H*.05;A.rot=Math.sin(t*4)*.05;A.sx=1;A.sy=1-.05*(1-b);A.gy=A.H*.78}},
magic:{label:'✨ Sprookje',speed:0,manual:true,
 bg(c,W,H,t){const R=rnd(11);grad(c,H,[[0,'#1b1464'],[.55,'#6a2fb8'],[1,'#ff8fc9']]);c.fillRect(0,0,W,H);
  c.fillStyle='#fff';for(let i=0;i<70;i++){const x=R()*W,y=R()*H*.7,s=1.5+R()*3;c.globalAlpha=.4+.6*Math.abs(Math.sin(t*1.5+i));c.beginPath();c.arc(x,y,s,0,TAU);c.fill()}c.globalAlpha=1;
  c.fillStyle='#fff6c9';c.beginPath();c.arc(W*.85,H*.18,H*.07,0,TAU);c.fill();c.fillStyle='#6a2fb8';c.beginPath();c.arc(W*.85+H*.03,H*.18-H*.01,H*.063,0,TAU);c.fill();
  ['#ff4d6d','#ffa94d','#ffe14d','#5ee06b','#4db8ff','#b06bff'].forEach((col,i)=>{c.strokeStyle=col;c.globalAlpha=.55;c.lineWidth=H*.025;c.beginPath();c.arc(W*.3,H*1.05,H*(.6-i*.026),Math.PI,TAU);c.stroke()});c.globalAlpha=1;
  c.fillStyle='#3a1a78';c.fillRect(W*.74,H*.62,W*.14,H*.38);c.fillRect(W*.7,H*.7,W*.05,H*.3);c.fillRect(W*.87,H*.7,W*.05,H*.3);[[.74,.14],[.7,.05],[.87,.05]].forEach(([a,b],i)=>{c.beginPath();const t0=i?H*.7:H*.62;c.moveTo(W*a-4,t0);c.lineTo(W*(a+b/2),t0-H*.12);c.lineTo(W*(a+b)+4,t0);c.fill()})},
 pose(A,t,dt){A.x=A.W/2+Math.sin(t*.5)*A.W*.3;A.dir=Math.cos(t*.5)>=0?1:-1;A.y=A.H*.4+Math.sin(t*.9)*A.H*.08;A.rot=Math.sin(t*2)*.08;A.sx=1;A.sy=1;
  A.acc=(A.acc||0)+dt;if(A.acc>.04){A.acc=0;A.parts.push({k:'star',x:A.x+(Math.random()-.5)*A.w*.7,y:A.y+(Math.random()-.5)*A.h*.7,vx:(Math.random()-.5)*30,vy:20+Math.random()*30,r:4+Math.random()*7,l:.9,m:.9,col:['#ffe14d','#fff','#ff9ee0','#9ee8ff'][Math.random()*4|0]})}}}
};


function sm(a,b,x){x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)}
// Vervorming van de tekening: f(u,v,t) -> [dx,dy] (fractie van breedte/hoogte); u=0 links, v=0 boven; dier kijkt naar rechts
const MOVES={
 swim:{label:'🐟 Zwemmen',f:(u,v,t)=>{const b=1-u,s=Math.sin(t*7-b*4);return[0,s*.11*b*b+s*.01]}},
 swimV:{label:'🧜 Staart zwaaien',f:(u,v,t)=>{const s=Math.sin(t*5-v*4);return[s*.12*v*v,0]}},
 flap:{label:'🦋 Fladderen',f:(u,v,t)=>{const s=Math.abs(u-.5)*2;return[0,-Math.sin(t*11)*.17*Math.pow(s,1.4)]}},
 wing:{label:'🐦 Vleugels',f:(u,v,t)=>{const w=Math.exp(-(Math.pow(u-.42,2)/.05+Math.pow(v-.45,2)/.08));return[0,-Math.sin(t*10)*.2*w]}},
 walk:{label:'🐾 Lopen',f:(u,v,t)=>{const lw=sm(.6,.9,v),ph=t*7+u*Math.PI*6,tw=sm(.8,1,1-u);return[Math.sin(ph)*.045*lw,-Math.max(0,Math.sin(ph))*.03*lw+Math.sin(t*5)*.04*tw*(1-v*.5)]}},
 float:{label:'✨ Zweven',f:(u,v,t)=>[Math.sin(t*3+v*5)*.02,Math.sin(t*2.5+u*4)*.015]},
 wave:{label:'🌈 Golven',f:(u,v,t)=>[0,Math.sin(t*3+u*8)*.035]}
};
const SCENE_MOVE={sea:'swim',sky:'flap',meadow:'walk',magic:'float'};
function warpTri(ctx,img,s0,s1,s2,d0,d1,d2){
  const cx=(d0[0]+d1[0]+d2[0])/3,cy=(d0[1]+d1[1]+d2[1])/3,g=p=>{const dx=p[0]-cx,dy=p[1]-cy,l=Math.hypot(dx,dy)||1;return[p[0]+dx/l*.7,p[1]+dy/l*.7]};
  const a0=g(d0),a1=g(d1),a2=g(d2);
  const sx1=s1[0]-s0[0],sy1=s1[1]-s0[1],sx2=s2[0]-s0[0],sy2=s2[1]-s0[1],det=sx1*sy2-sx2*sy1;if(!det)return;
  const dx1=d1[0]-d0[0],dy1=d1[1]-d0[1],dx2=d2[0]-d0[0],dy2=d2[1]-d0[1];
  const a=(dx1*sy2-dx2*sy1)/det,c=(-dx1*sx2+dx2*sx1)/det,b=(dy1*sy2-dy2*sy1)/det,d=(-dy1*sx2+dy2*sx1)/det;
  ctx.save();ctx.beginPath();ctx.moveTo(a0[0],a0[1]);ctx.lineTo(a1[0],a1[1]);ctx.lineTo(a2[0],a2[1]);ctx.closePath();ctx.clip();
  ctx.transform(a,b,c,d,d0[0]-a*s0[0]-c*s0[1],d0[1]-b*s0[0]-d*s0[1]);ctx.drawImage(img,0,0);ctx.restore()}

class Anim{
 constructor(cv){this.cv=cv;this.c=cv.getContext('2d');this.parts=[];this.running=false;this.flip=false;this.mode='none';this.buf=document.createElement('canvas');this.loop=this.loop.bind(this)}
 start(sprite,scene){this.sprite=sprite;this.setScene(scene);this.parts=[];this.t=0;this.dir=1;this.spin=0;this.resize();this.x=this.W*.3;this.last=performance.now();if(!this.running){this.running=true;requestAnimationFrame(this.loop)}}
 setScene(s){this.scene=s;this.S=SCENES[s];this.parts=[]}
 stop(){this.running=false}
 resize(){const dpr=Math.min(devicePixelRatio||1,2),cv=this.cv;this.W=cv.clientWidth;this.H=cv.clientHeight;cv.width=Math.round(this.W*dpr);cv.height=Math.round(this.H*dpr);this.c.setTransform(dpr,0,0,dpr,0,0);
  const sp=this.sprite,k=Math.min(this.H*.34/sp.height,this.W*.36/sp.width);this.w=sp.width*k;this.h=sp.height*k}
 tap(px,py){const hit=Math.abs(px-this.x)<this.w/2&&Math.abs(py-this.y)<this.h/2;
  for(let i=0;i<(hit?24:10);i++){const a=Math.random()*TAU,v=60+Math.random()*180;this.parts.push({k:'star',x:px,y:py,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:5+Math.random()*9,l:1,m:1,col:['#ffe14d','#ff7ab8','#7ae0ff','#fff'][i%4]})}
  if(hit)this.spin=1;chime(hit)}
 loop(now){if(!this.running)return;const dt=Math.min(.05,(now-this.last)/1000);this.last=now;this.t+=dt;this.update(dt);this.draw();requestAnimationFrame(this.loop)}
 update(dt){const S=this.S,t=this.t;
  if(!S.manual){this.x+=this.dir*S.speed*this.W*dt;if(this.x>this.W-this.w/2){this.x=this.W-this.w/2;this.dir=-1}if(this.x<this.w/2){this.x=this.w/2;this.dir=1}}
  S.pose(this,t,dt);if(S.amb)S.amb(this,dt);
  if(this.spin>0)this.spin=Math.max(0,this.spin-dt/.9);
  for(const p of this.parts){p.l-=dt;p.x+=(p.vx||0)*dt;p.y+=p.vy*dt}this.parts=this.parts.filter(p=>p.l>0)}
 drawSprite(c){const sp=this.sprite,w=this.w,h=this.h,M=MOVES[this.mode];
  if(!M){c.drawImage(sp,-w/2,-h/2,w,h);return}
  const pad=.22,bw=w*(1+2*pad),bh=h*(1+2*pad),q=Math.min(2,devicePixelRatio||1),B=this.buf,pw=Math.round(bw*q),ph=Math.round(bh*q);
  if(B.width!==pw||B.height!==ph){B.width=pw;B.height=ph}
  const x=B.getContext('2d');x.setTransform(q,0,0,q,0,0);x.clearRect(0,0,bw,bh);x.imageSmoothingQuality='high';
  const sw=sp.naturalWidth||sp.width,sh=sp.naturalHeight||sp.height,N=14,t=this.t,P=[];
  for(let j=0;j<=N;j++){P[j]=[];for(let i=0;i<=N;i++){const u=i/N,v=j/N,[dx,dy]=M.f(u,v,t);P[j][i]=[pad*w+u*w+dx*w,pad*h+v*h+dy*h]}}
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){
    const s=(a,b)=>[a/N*sw,b/N*sh],p00=P[j][i],p10=P[j][i+1],p01=P[j+1][i],p11=P[j+1][i+1];
    warpTri(x,sp,s(i,j),s(i+1,j),s(i,j+1),p00,p10,p01);warpTri(x,sp,s(i+1,j),s(i+1,j+1),s(i,j+1),p10,p11,p01)}
  c.drawImage(B,-w/2-pad*w,-h/2-pad*h,bw,bh)}
 draw(){const c=this.c,{W,H,t}=this;this.S.bg(c,W,H,t);
  if(this.S.shadow){c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(this.x,this.gy,this.w*.4,this.h*.07,0,0,TAU);c.fill()}
  c.save();c.translate(this.x,this.y);let rot=this.rot,sc=1;
  if(this.spin>0){const p=1-this.spin;rot+=p*TAU;sc=1+.3*Math.sin(p*Math.PI)}
  c.rotate(rot);c.scale(this.dir*(this.flip?-1:1)*this.sx*sc,this.sy*sc);
  c.shadowColor='rgba(255,255,255,.9)';c.shadowBlur=8;this.drawSprite(c);c.restore();
  for(const p of this.parts){const a=Math.max(0,p.l/p.m);c.globalAlpha=a;
   if(p.k==='bub'){c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=2;c.beginPath();c.arc(p.x+Math.sin(p.y*.05)*6,p.y,p.r,0,TAU);c.stroke()}
   else{c.fillStyle=p.col;star(c,p.x,p.y,p.r*(.5+a*.5),t*3)}}
  c.globalAlpha=1}
}

let _ac;
function chime(big){try{_ac=_ac||new (window.AudioContext||window.webkitAudioContext)();const n=_ac.currentTime,f=big?[523,659,784,1047]:[784,988];f.forEach((fr,i)=>{const o=_ac.createOscillator(),g=_ac.createGain();o.type='triangle';o.frequency.value=fr;const s=n+i*.07;g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(.14,s+.02);g.gain.exponentialRampToValueAtTime(.001,s+.45);o.connect(g);g.connect(_ac.destination);o.start(s);o.stop(s+.5)})}catch(e){}}
