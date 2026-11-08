// Knipt een tekening (foto of canvas) uit het papier: achtergrond -> transparant.
function makeSprite(img,{sens=5,crop=0.03,max=640,flat=false}={}){
  const sw=img.naturalWidth||img.width,sh=img.naturalHeight||img.height;
  const cx=Math.round(sw*crop),cy=Math.round(sh*crop),cw=sw-2*cx,ch=sh-2*cy;
  const k=Math.min(1,max/Math.max(cw,ch));
  const W=Math.max(8,Math.round(cw*k)),H=Math.max(8,Math.round(ch*k)),N=W*H;
  const c=document.createElement('canvas');c.width=W;c.height=H;
  const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,cx,cy,cw,ch,0,0,W,H);
  const d=x.getImageData(0,0,W,H).data;
  const lum=new Float32Array(N);
  for(let i=0;i<N;i++)lum[i]=.299*d[4*i]+.587*d[4*i+1]+.114*d[4*i+2];
  // achtergrondhelderheid per cel (85e percentiel), dan 3x3 max + blur
  const cell=Math.max(8,Math.round(Math.max(W,H)/32)),gw=Math.ceil(W/cell),gh=Math.ceil(H/cell);
  let g=new Float32Array(gw*gh);
  for(let gy=0;gy<gh;gy++)for(let gx=0;gx<gw;gx++){
    const v=[];for(let y=gy*cell;y<Math.min(H,(gy+1)*cell);y+=2)for(let xx=gx*cell;xx<Math.min(W,(gx+1)*cell);xx+=2)v.push(lum[y*W+xx]);
    v.sort((a,b)=>a-b);g[gy*gw+gx]=v[Math.floor(v.length*.85)]||255;}
  const filt=(src,fn)=>{const o=new Float32Array(src.length);for(let y=0;y<gh;y++)for(let xx=0;xx<gw;xx++){const a=[];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const yy=Math.min(gh-1,Math.max(0,y+dy)),x2=Math.min(gw-1,Math.max(0,xx+dx));a.push(src[yy*gw+x2])}o[y*gw+xx]=fn(a)}return o};
  if(flat)g.fill(255);
  g=filt(g,a=>Math.max(...a));g=filt(g,a=>a.reduce((s,v)=>s+v,0)/9);
  const thr=.30-.024*sens;
  const bgAt=new Float32Array(N),ink=new Uint8Array(N);
  for(let y=0;y<H;y++){
    const fy=Math.min(gh-1.001,Math.max(0,(y+.5)/cell-.5)),y0=Math.floor(fy),ty=fy-y0;
    for(let xx=0;xx<W;xx++){
      const fx=Math.min(gw-1.001,Math.max(0,(xx+.5)/cell-.5)),x0=Math.floor(fx),tx=fx-x0;
      const bg=Math.max(40,(g[y0*gw+x0]*(1-tx)+g[y0*gw+x0+1]*tx)*(1-ty)+(g[(y0+1)*gw+x0]*(1-tx)+g[(y0+1)*gw+x0+1]*tx)*ty);
      const i=y*W+xx;bgAt[i]=bg;
      const dark=(bg-lum[i])/bg,r=d[4*i],gg=d[4*i+1],b=d[4*i+2],mx=Math.max(r,gg,b),mn=Math.min(r,gg,b),sat=mx?(mx-mn)/mx:0;
      ink[i]=(dark>thr||(sat>.4&&dark>thr*.4))?1:0;}}
  // verdikken om gaatjes in de lijn te sluiten
  const r=Math.max(2,Math.round(Math.max(W,H)/200));
  const dil=(src)=>{const t=new Uint8Array(N),o=new Uint8Array(N);
    for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){let v=0;for(let k=Math.max(0,xx-r);k<=Math.min(W-1,xx+r);k++)if(src[y*W+k]){v=1;break}t[y*W+xx]=v}
    for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){let v=0;for(let k=Math.max(0,y-r);k<=Math.min(H-1,y+r);k++)if(t[k*W+xx]){v=1;break}o[y*W+xx]=v}return o};
  const dl=dil(ink);
  // buitenkant invullen vanaf de randen
  const out=new Uint8Array(N),st=new Int32Array(N);let sp=0;
  const push=i=>{if(!dl[i]&&!out[i]){out[i]=1;st[sp++]=i}};
  for(let xx=0;xx<W;xx++){push(xx);push((H-1)*W+xx)}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1)}
  while(sp){const i=st[--sp],xx=i%W;if(xx>0)push(i-1);if(xx<W-1)push(i+1);if(i>=W)push(i-W);if(i<N-W)push(i+W)}
  // kleine stukjes weg
  const lab=new Int32Array(N),areas=[0];let nl=0;
  for(let s=0;s<N;s++){if(out[s]||lab[s])continue;nl++;let a=0;sp=0;st[sp++]=s;lab[s]=nl;
    while(sp){const i=st[--sp];a++;const xx=i%W;
      const nb=[xx>0?i-1:-1,xx<W-1?i+1:-1,i>=W?i-W:-1,i<N-W?i+W:-1];
      for(const j of nb)if(j>=0&&!out[j]&&!lab[j]){lab[j]=nl;st[sp++]=j}}
    areas.push(a)}
  const maxA=Math.max(0,...areas),keep=areas.map(a=>a>=Math.max(40,maxA*.04));
  const mask=new Uint8Array(N);let cnt=0;
  for(let i=0;i<N;i++)if(lab[i]&&keep[lab[i]]){mask[i]=1;cnt++}
  const leaked=cnt<N*.004||cnt>N*.8;
  let alpha;
  if(leaked){alpha=ink}else{alpha=mask}
  // bounding box
  let x0=W,y0=H,x1=-1,y1=-1;
  for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++)if(alpha[y*W+xx]){if(xx<x0)x0=xx;if(xx>x1)x1=xx;if(y<y0)y0=y;if(y>y1)y1=y}
  if(x1<0){x0=0;y0=0;x1=W-1;y1=H-1}
  const bw=x1-x0+1,bh=y1-y0+1,oc=document.createElement('canvas');oc.width=bw;oc.height=bh;
  const ox=oc.getContext('2d'),od=ox.createImageData(bw,bh);
  for(let y=0;y<bh;y++)for(let xx=0;xx<bw;xx++){
    const sx=xx+x0,sy=y+y0,i=sy*W+sx,o=4*(y*bw+xx);
    let s=0,n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const px=sx+dx,py=sy+dy;n++;if(px>=0&&py>=0&&px<W&&py<H)s+=alpha[py*W+px]}
    const f=255/bgAt[i];
    od.data[o]=Math.min(255,d[4*i]*f);od.data[o+1]=Math.min(255,d[4*i+1]*f);od.data[o+2]=Math.min(255,d[4*i+2]*f);
    od.data[o+3]=Math.round(255*s/n);}
  ox.putImageData(od,0,0);
  return {canvas:oc,leaked};
}
