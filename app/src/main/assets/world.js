/* Legends of Aetheria — deterministic, offline biome and landmark renderer. */
(function (root) {
  'use strict';

  const zones = [
    {n:'Aetheria Village', a:['#111a37','#46538a'], g:['#526748','#263d31'], sd:3, ft:[], type:'village', path:['#8b6840','#d0b27b']},
    {n:'The Enchanted Forest', a:['#071d24','#174c47'], g:['#2d5937','#142d28'], sd:7, ft:[['goblin',3],['wolf',3]], type:'forest', path:['#3b6247','#91a777']},
    {n:'The Forgotten Ruins', a:['#19142f','#4c3975'], g:['#5a5960','#2c303c'], sd:11, ft:[['skel',4],['shade',2]], type:'ruins', path:['#4a4655','#9e9aaa']},
    {n:'Dragon Valley', a:['#321317','#a34128'], g:['#4a302a','#211c25'], sd:13, ft:[['skel',2],['knight',2],['shade',3]], type:'valley', path:['#382923','#92704c']},
    {n:'The Fallen Castle', a:['#080d1c','#252c50'], g:['#454754','#191d2b'], sd:17, ft:[['knight',2]], type:'castle', path:['#494554','#9a91a0']}
  ];

  const decor = [
    [
      {k:'house',x:320,y:260,r:24},{k:'house',x:650,y:255,r:24},{k:'house',x:790,y:265,r:24},
      {k:'tree',x:45,y:300,r:17,s:1.1},{k:'tree',x:905,y:300,r:17,s:1.1},
      {k:'well',x:145,y:315,r:0},{k:'fountain',x:490,y:315,r:0},{k:'market',x:710,y:360,r:0},
      {k:'torch',x:125,y:315,r:0},{k:'torch',x:570,y:300,r:0},{k:'torch',x:875,y:320,r:0}
    ],
    [
      {k:'tree',x:52,y:300,r:23,s:1.5},{k:'tree',x:170,y:280,r:20,s:1.3},{k:'tree',x:825,y:290,r:22,s:1.5},{k:'tree',x:920,y:500,r:18,s:1.2},
      {k:'tree',x:110,y:520,r:18,s:1.15},{k:'tree',x:760,y:515,r:19,s:1.25},
      {k:'mushroom',x:390,y:500,r:0},{k:'mushroom',x:710,y:280,r:0},{k:'root',x:520,y:300,r:0},{k:'torch',x:270,y:320,r:0}
    ],
    [
      {k:'pillar',x:90,y:300,r:13},{k:'pillar',x:250,y:505,r:13},{k:'pillar',x:710,y:285,r:13},{k:'pillar',x:875,y:500,r:13},
      {k:'arch',x:475,y:290,r:0},{k:'rubble',x:165,y:475,r:0},{k:'rubble',x:780,y:420,r:0},{k:'torch',x:55,y:305,r:0},{k:'torch',x:905,y:300,r:0}
    ],
    [
      {k:'dead',x:160,y:305,r:12},{k:'rock',x:55,y:490,r:15},{k:'rock',x:300,y:285,r:15},{k:'rock',x:835,y:300,r:15},{k:'dead',x:865,y:500,r:12},
      {k:'vent',x:520,y:305,r:0},{k:'vent',x:700,y:490,r:0},{k:'rubble',x:390,y:505,r:0}
    ],
    [
      {k:'pillar',x:105,y:310,r:13},{k:'pillar',x:265,y:285,r:13},{k:'pillar',x:710,y:300,r:13},{k:'pillar',x:865,y:320,r:13},
      {k:'banner',x:310,y:340,r:0},{k:'banner',x:650,y:340,r:0},{k:'brazier',x:105,y:430,r:0},{k:'brazier',x:855,y:430,r:0},{k:'arch',x:480,y:250,r:0}
    ]
  ];

  function rand(seed) {
    let s = seed;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }

  function pathY(zone, x, worldWidth = 960, worldHeight = 760) {
    const t = x / worldWidth, base = worldHeight * .61;
    if (zone === 0) return base + Math.sin(t * Math.PI * 3.2) * 20;
    if (zone === 1) return base - Math.sin(t * Math.PI * 5.3) * 54 + Math.sin(t * Math.PI * 10) * 13;
    if (zone === 2) return base - Math.sin(t * Math.PI * 3.8) * 46 + Math.sin(t * Math.PI * 8.5) * 18;
    if (zone === 3) return base + Math.sin(t * Math.PI * 5.5) * 40 + Math.sin(t * Math.PI * 11) * 14;
    return base + Math.sin(t * Math.PI * 3.1) * 16;
  }

  function drawPath(ctx, zone, W) {
    const z=zones[zone], yAt=x=>pathY(zone,x,W,760);
    function stroke(color,width,offset) {
      ctx.beginPath();
      for (let x=-40;x<=W+40;x+=14) { const y=yAt(x)+offset; if (x===-40) ctx.moveTo(x,y); else ctx.lineTo(x,y); }
      ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();
    }
    stroke('rgba(2,5,10,.70)',108,7);
    stroke('rgba(9,12,18,.52)',94,5);
    stroke(z.path[0],82,0);
    stroke(z.path[1],64,-1);
    stroke('rgba(255,231,178,.18)',4,-28);
    stroke('rgba(255,246,213,.12)',1,-31);
    const r=rand(733+zone*89);
    for(let x=-12;x<W+20;x+=25+r()*12){
      const y=yAt(x)+(r()-.5)*35, w=8+r()*11, h=3+r()*5;
      ctx.fillStyle=zone===1?'rgba(25,49,36,.32)':zone===3?'rgba(37,24,24,.46)':'rgba(55,46,48,.28)';
      ctx.fillRect(x,y,w,h);
      if(zone!==3){ctx.fillStyle='rgba(255,236,192,.16)';ctx.fillRect(x+1,y,w*.45,1)}
    }
  }

  function background(zone, W, H) {
    const z=zones[zone], r=rand(z.sd*271), cnv=document.createElement('canvas');
    cnv.width=W;cnv.height=H;
    const c=cnv.getContext('2d');
    const sky=c.createLinearGradient(0,0,0,275);sky.addColorStop(0,z.a[0]);sky.addColorStop(.58,z.a[1]);sky.addColorStop(1,zone===3?'#633328':'#252d4a');c.fillStyle=sky;c.fillRect(0,0,W,H);
    const haze=['rgba(141,168,218,.16)','rgba(56,151,119,.14)','rgba(154,123,204,.16)','rgba(255,111,58,.16)','rgba(148,166,219,.14)'][zone],hg=c.createLinearGradient(0,118,0,270);hg.addColorStop(0,'rgba(0,0,0,0)');hg.addColorStop(1,haze);c.fillStyle=hg;c.fillRect(0,110,W,175);
    // Soft broken cloud-banks add depth without competing with gameplay silhouettes.
    for(let i=0;i<Math.ceil(W/440);i++){const x=i*440+r()*160-40,y=76+r()*96,w=170+r()*170;c.save();c.globalAlpha=.08+r()*.045;c.fillStyle=zone===3?'#ffb285':'#c0c7e6';c.beginPath();c.ellipse(x,y,w*.52,9+r()*8,-.04,0,Math.PI*2);c.ellipse(x+w*.22,y-5,w*.27,8,0,0,Math.PI*2);c.fill();c.restore()}
    const stars=zone===3?82:176;
    for(let i=0;i<stars;i++){const sx=r()*W,sy=r()*190,sz=.7+r()*1.7;c.globalAlpha=.24+r()*.58;c.fillStyle=zone===3?'#ffc17d':'#e8edff';c.fillRect(sx,sy,sz,sz);if(i%23===0){c.globalAlpha=.16;c.fillRect(sx-3,sy,sz+6,1);c.fillRect(sx,sy-3,1,sz+6)}}c.globalAlpha=1;
    const mx=zone===3?790:785,my=zone===3?75:68,mr=zone===3?24:27;c.save();c.shadowColor=zone===3?'#ff5525':'#cbd6ff';c.shadowBlur=36;c.fillStyle=zone===3?'#ffb153':'#e8e4d1';c.beginPath();c.arc(mx,my,mr,0,Math.PI*2);c.fill();c.shadowBlur=0;c.save();c.beginPath();c.arc(mx,my,mr-1,0,Math.PI*2);c.clip();c.globalAlpha=.19;c.fillStyle=zone===3?'#8e3928':'#778095';[[mx-8,my-5,5],[mx+9,my+7,3],[mx+3,my-13,2]].forEach(q=>{c.beginPath();c.arc(q[0],q[1],q[2],0,Math.PI*2);c.fill()});c.globalAlpha=.45;c.fillStyle='#fff2c4';c.beginPath();c.ellipse(mx-8,my-10,8,3,-.7,0,Math.PI*2);c.fill();c.restore();c.restore();

    // Distant silhouette: each realm has a different skyline.
    if(zone===0){
      c.fillStyle='#11182e';c.fillRect(0,170,W,45);
      for(let x=20;x<W;x+=115){c.fillRect(x,132+(x%3)*8,38,80);c.beginPath();c.moveTo(x-5,136+(x%3)*8);c.lineTo(x+19,108+(x%3)*8);c.lineTo(x+43,136+(x%3)*8);c.fill()}
    } else if(zone===1){
      for(let layer=0;layer<3;layer++){c.fillStyle=['#092022','#0b302b','#104037'][layer];for(let x=-30;x<W+80;x+=65){const h=45+((x*7+layer*41)%37);c.beginPath();c.moveTo(x,218);c.lineTo(x+30,218-h);c.lineTo(x+65,218);c.fill()}}
      c.fillStyle='#1d5943';for(let x=0;x<W;x+=110){c.beginPath();c.arc(x+40,85+(x%4)*17,55,0,Math.PI*2);c.fill()}
    } else if(zone===2){
      c.fillStyle='#17142a';for(let j=0;j<6;j++){const x=25+j*165;c.fillRect(x,125,24,90);c.fillRect(x-7,120,38,9);c.beginPath();c.arc(x+12,125,25,Math.PI,0);c.lineWidth=9;c.strokeStyle='#17142a';c.stroke()}
      c.fillStyle='#29233c';c.fillRect(360,160,230,55);c.fillRect(390,125,22,90);c.fillRect(538,125,22,90)
    } else if(zone===3){
      c.fillStyle='#2b121c';c.beginPath();c.moveTo(0,220);c.lineTo(78,152);c.lineTo(142,180);c.lineTo(228,93);c.lineTo(320,217);c.lineTo(421,160);c.lineTo(518,215);c.lineTo(660,86);c.lineTo(804,214);c.lineTo(900,143);c.lineTo(960,188);c.lineTo(960,225);c.fill();
      c.fillStyle='#541d20';c.beginPath();c.moveTo(612,128);c.lineTo(661,86);c.lineTo(708,134);c.lineTo(686,122);c.lineTo(659,133);c.closePath();c.fill();
      c.fillStyle='#ff6a2a';c.globalAlpha=.65;c.fillRect(650,120,8,22);c.fillRect(672,126,6,18);c.globalAlpha=1
    } else {
      c.fillStyle='#0c1020';c.fillRect(0,145,W,72);
      for(let x=0;x<W;x+=58){const h=48+(x%5)*9;c.fillRect(x,175-h,42,h+45);c.fillRect(x-4,166-h,50,12);for(let q=0;q<3;q++)c.fillRect(x+5+q*13,156-h,7,18)}
      c.fillStyle='#090c18';c.fillRect(385,118,190,100);c.clearRect(440,165,80,53);c.fillStyle='#090c18';c.fillRect(423,151,114,13)
    }

    const ground=c.createLinearGradient(0,205,0,H);ground.addColorStop(0,z.g[0]);ground.addColorStop(.22,zone===0?'#42563d':zone===1?'#254638':zone===2?'#45434e':zone===3?'#392621':'#383945');ground.addColorStop(1,z.g[1]);c.fillStyle=ground;c.fillRect(0,205,W,H);
    // Fine deterministic ground marks are baked into each offscreen biome canvas.
    const gritN=Math.round(W/960*520);
    for(let i=0;i<gritN;i++){const x=r()*W,y=226+r()*(H-232),edge=Math.abs(y-pathY(zone,x,W,H));if(zone===0){if(edge>64){c.fillStyle=i%3?'rgba(170,206,125,.24)':'rgba(21,47,35,.34)';c.fillRect(x,y,1.5+r()*2,3+r()*4)}else{c.fillStyle='rgba(245,223,177,.12)';c.fillRect(x,y,4+r()*6,1)}}else if(zone===1){if(edge>52){c.fillStyle=i%2?'rgba(123,166,80,.25)':'rgba(12,39,31,.38)';c.fillRect(x,y,2+r()*5,2+r()*5);if(i%4===0){c.fillStyle='rgba(188,219,125,.28)';c.fillRect(x+2,y-2,1,5)}}}else if(zone===3){c.fillStyle=i%3?'rgba(7,12,17,.38)':'rgba(255,117,53,.22)';c.fillRect(x,y,3+r()*8,1+r()*3);if(i%17===0){c.strokeStyle='rgba(255,104,44,.22)';c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(x+8,y+5);c.lineTo(x+5,y+11);c.stroke()}}else{c.fillStyle=i%2?'rgba(198,194,209,.09)':'rgba(9,11,22,.23)';c.fillRect(x,y,8+r()*18,1+r()*2);if(i%9===0){c.fillStyle='rgba(214,201,157,.14)';c.fillRect(x+2,y+2,1,4)}}}
    if(zone===0){
      c.fillStyle='rgba(224,207,149,.08)';for(let y=225;y<H;y+=28){c.fillRect(0,y,W,1);for(let x=(y%2)*18;x<W;x+=36)c.fillRect(x,y,1,28)}
      c.fillStyle='rgba(170,202,112,.18)';for(let i=0;i<34;i++){const x=r()*W,y=230+r()*300;c.fillRect(x,y,2,5);c.fillRect(x+3,y+2,2,3)}
    } else if(zone===1){
      for(let i=0;i<45;i++){const x=r()*W,y=220+r()*330;c.fillStyle=['#234b31','#356b3d','#173b31'][i%3];c.fillRect(x,y,12+r()*18,4+r()*5);c.fillStyle='rgba(170,226,112,.22)';c.fillRect(x+2,y,3,2)}
      c.fillStyle='rgba(12,52,45,.5)';c.fillRect(0,218,W,20)
    } else if(zone===2||zone===4){
      c.strokeStyle=zone===2?'rgba(206,192,222,.13)':'rgba(160,169,193,.13)';c.lineWidth=1;
      for(let y=220;y<H;y+=32){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();for(let x=(y%64?0:24);x<W;x+=48){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+32);c.stroke()}}
      if(zone===2){c.strokeStyle='rgba(129,114,191,.17)';for(let x=90;x<W;x+=190){c.beginPath();c.arc(x,365,46,0,Math.PI*2);c.stroke();c.beginPath();c.arc(x,365,34,0,Math.PI*2);c.stroke()}}
    } else {
      // Thin glowing lava seams in the valley; the road bridges them safely.
      c.lineCap='round';for(let i=0;i<7;i++){const x=35+i*145,y=235+(i*71)%275;c.beginPath();c.moveTo(x,y);c.lineTo(x+17,y+12);c.lineTo(x+8,y+30);c.lineTo(x+32,y+48);c.strokeStyle='#6e2e27';c.lineWidth=8;c.stroke();c.strokeStyle='#e15a2c';c.lineWidth=3;c.stroke()}
      for(let i=0;i<36;i++){c.fillStyle=`rgba(255,112,46,${.12+r()*.3})`;c.fillRect(r()*W,220+r()*330,2+r()*3,2+r()*3)}
    }

    drawPath(c,zone,W);
    // Biome-specific foreground accents, behind gameplay actors.
    if(zone===1){c.fillStyle='rgba(15,38,30,.45)';for(let x=20;x<W;x+=80){const y=510+(x%3)*5;c.fillRect(x,y,24,6);c.fillRect(x+8,y-5,3,5)}}
    if(zone===3){c.fillStyle='rgba(22,18,20,.5)';for(let i=0;i<18;i++){const x=r()*W,y=225+r()*325;c.fillRect(x,y,8+r()*9,4+r()*5)}}
    c.fillStyle='rgba(3,7,16,.14)';c.fillRect(0,210,W,H);
    return cnv;
  }

  function makeDecorations(worldW = 960, worldH = 560) {
    return decor.map((list, zone) => {
      const out = [], sections = Math.ceil(worldW / 960);
      for (let section = 0; section < sections; section++) {
        list.forEach((d, index) => {
          const x = d.x + section * 960;
          if (x >= worldW - 24) return;
          const drift = section ? ((index + section + zone) % 2 ? 24 : -18) : 0;
          out.push(Object.assign({}, d, {x, y:Math.max(224,Math.min(worldH-26,d.y+drift))}));
        });
      }
      return out;
    });
  }

  function drawParallax(ctx, zone, cameraX, cameraY, viewW, viewH, worldW, t) {
    const z=zones[zone], horizon=Math.max(26,210-cameraY), sky=ctx.createLinearGradient(0,0,0,horizon);
    sky.addColorStop(0,z.a[0]);sky.addColorStop(1,z.a[1]);ctx.save();ctx.fillStyle=sky;ctx.fillRect(0,0,viewW,horizon+2);
    const rng=rand(z.sd*271), starOffset=cameraX*.075;
    for(let i=0;i<100;i++){
      const wx=rng()*worldW, x=wx-starOffset;
      if(x<0||x>viewW)continue;
      ctx.globalAlpha=.22+((i*17)%70)/100;ctx.fillStyle=zone===3?'#ffd18a':'#e6e7ff';ctx.fillRect(x,8+rng()*(horizon*.58),1+(i%2),1+(i%2));
    }
    ctx.globalAlpha=1;
    for(let m=0;m<3;m++){
      const par=cameraX*(m===0?.17:.34), base=horizon-(m===0?10:0), seed=zone*19+m*31;
      ctx.beginPath();ctx.moveTo(0,horizon+2);
      for(let x=-90;x<=viewW+90;x+=55){const wx=x+par, wave=Math.sin((wx+seed*23)/(110+m*35))*18+Math.sin((wx-seed*11)/(47+m*18))*9;ctx.lineTo(x,base-24-m*23-wave)}
      ctx.lineTo(viewW+90,horizon+2);ctx.closePath();ctx.fillStyle=['rgba(12,18,39,.66)','rgba(10,24,35,.68)','rgba(7,14,28,.72)'][m];ctx.fill();
    }
    const moonX=785-cameraX*.12, moonY=(zone===3?75:68)-cameraY*.08;
    if(moonX>-60&&moonX<viewW+60){const mr=zone===3?22:25;ctx.fillStyle=zone===3?'#ffb153':'#e8e4d1';ctx.shadowColor=zone===3?'#ff5525':'#cbd6ff';ctx.shadowBlur=32;ctx.beginPath();ctx.arc(moonX,moonY,mr,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.save();ctx.beginPath();ctx.arc(moonX,moonY,mr,0,Math.PI*2);ctx.clip();ctx.globalAlpha=.2;ctx.fillStyle=zone===3?'#943d2b':'#69758b';[[.32,-.2,.18],[-.24,.28,.13],[.04,.5,.1]].forEach(q=>{ctx.beginPath();ctx.arc(moonX+q[0]*mr*2,moonY+q[1]*mr*2,q[2]*mr,0,Math.PI*2);ctx.fill()});ctx.globalAlpha=.48;ctx.fillStyle='#fff7d4';ctx.beginPath();ctx.ellipse(moonX-mr*.34,moonY-mr*.4,mr*.35,mr*.13,-.6,0,Math.PI*2);ctx.fill();ctx.restore()}
    ctx.globalAlpha=1;ctx.restore();
    // Distant cloud wisps drift at a fraction of camera speed.
    ctx.save();ctx.globalAlpha=.07;for(let i=0;i<4;i++){const x=((i*317-cameraX*.13+t*(3+i))%(viewW+520)+viewW+520)%(viewW+520)-260,y=horizon*.57+i*17;ctx.fillStyle=zone===3?'#ffb17a':'#b8c8e9';ctx.beginPath();ctx.ellipse(x,y,110+i*15,7+i*2,-.025,0,Math.PI*2);ctx.fill()}ctx.restore();
    ctx.save();ctx.globalAlpha=.12;
    for(let i=0;i<3;i++){const x=((t*12*(i+1)+i*400-cameraX*.55)%(viewW+500))-250,y=300+i*72,g=ctx.createRadialGradient(x,y,0,x,y,245);g.addColorStop(0,'rgba(205,218,240,.7)');g.addColorStop(1,'rgba(205,218,240,0)');ctx.fillStyle=g;ctx.fillRect(0,y-90,viewW,180)}
    ctx.restore();
  }

  function drawAmbient(ctx,zone,cameraX,cameraY,viewW,viewH,worldW,worldH,t) {
    const colors=['#f7d995','#b9f08b','#aeb8ff','#ff8b4b','#c7d5ff'],color=colors[zone];
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(let i=0;i<30;i++){
      const drift=(zone===3?-18:zone===1?11:5),wx=((i*191+zone*137+t*drift)%worldW+worldW)%worldW;
      const px=wx-cameraX*(i%6===0?.58:.96),span=Math.max(1,worldH-250),vSpeed=zone===3?-23:4+i%4;
      const yy=((i*127+t*vSpeed)%span+span)%span,py=235+yy-cameraY*.88;
      if(px< -5||px>viewW+5||py< -5||py>viewH+5)continue;
      const pulse=.28+.35*(.5+.5*Math.sin(t*2+i*1.7));ctx.globalAlpha=pulse;ctx.fillStyle=color;
      if(zone===3){ctx.fillRect(Math.round(px),Math.round(py),2,4+i%3);ctx.fillRect(Math.round(px)-1,Math.round(py)+2,4,1)}
      else if(i%5===0){ctx.fillRect(Math.round(px)-2,Math.round(py),5,1);ctx.fillRect(Math.round(px),Math.round(py)-2,1,5);ctx.fillRect(Math.round(px)-1,Math.round(py)-1,3,3)}
      else ctx.fillRect(Math.round(px),Math.round(py),1+i%2,1+i%2);
    }
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.restore();
  }

  function drawDecoration(c,d,t) {
    c.save();c.translate(d.x,d.y);
    if(d.k==='tree'){
      const s=d.s||1,sw=Math.sin(t*1.2+d.x)*2;c.fillStyle='#0008';c.beginPath();c.ellipse(0,4,25*s,6*s,0,0,Math.PI*2);c.fill();
      c.fillStyle='#241d1b';c.beginPath();c.moveTo(-8*s,-4);c.lineTo(-5*s,-42*s);c.lineTo(-15*s,-56*s);c.lineTo(-11*s,-59*s);c.lineTo(-2*s,-47*s);c.lineTo(4*s,-68*s);c.lineTo(9*s,-68*s);c.lineTo(5*s,-39*s);c.lineTo(16*s,-51*s);c.lineTo(20*s,-48*s);c.lineTo(8*s,-31*s);c.lineTo(8*s,0);c.closePath();c.fill();c.fillStyle='#795033';c.beginPath();c.moveTo(-5*s,-2);c.lineTo(-3*s,-40*s);c.lineTo(2*s,-49*s);c.lineTo(4*s,-35*s);c.lineTo(4*s,-2);c.closePath();c.fill();c.fillStyle='#bd8750';c.fillRect(-2*s,-34*s,2*s,26*s);
      const crowns=[[-13,-50,16,'#174b37'],[2,-59,18,'#1e6544'],[17,-50,15,'#1a583d'],[-1,-43,19,'#287347'],[-7,-67,13,'#276846']];crowns.forEach((q,i)=>{const x=q[0]*s+sw*(i%2),y=q[1]*s,r=q[2]*s;c.fillStyle='#0b2923';c.beginPath();c.arc(x+1,y+2,r+1,0,Math.PI*2);c.fill();c.fillStyle=q[3];c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.fillStyle=i%2?'rgba(145,210,111,.30)':'rgba(99,179,100,.24)';c.beginPath();c.arc(x-r*.22,y-r*.28,r*.44,0,Math.PI*2);c.fill()});
      c.fillStyle='#c2e88c';for(let i=0;i<5;i++){const lx=((i*17+d.x)%28-14)*s,ly=(-39-(i*13%25))*s+sw*(i%2);c.fillRect(lx,ly,2*s,2*s)}
    } else if(d.k==='house'){
      c.fillStyle='#0009';c.beginPath();c.ellipse(0,5,49,9,0,0,Math.PI*2);c.fill();c.fillStyle='#493c36';c.fillRect(-38,-51,76,52);c.fillStyle='#92785c';c.fillRect(-34,-49,68,47);c.fillStyle='#b29a70';c.fillRect(-30,-46,60,4);c.fillStyle='#756047';for(let yy=-38;yy<-4;yy+=9){c.fillRect(-31,yy,62,1);c.fillRect(-23,yy+2,2,5);c.fillRect(20,yy+2,2,5)}c.fillStyle='#513b32';c.fillRect(-12,-30,24,31);c.fillStyle='#251d20';c.fillRect(-9,-27,18,28);c.fillStyle='#8f6746';c.fillRect(-12,-31,24,4);c.fillStyle='#d7ad67';c.fillRect(5,-17,2,3);c.fillStyle='#3f302c';c.beginPath();c.moveTo(-48,-48);c.lineTo(-3,-91);c.lineTo(49,-48);c.lineTo(42,-44);c.lineTo(-2,-80);c.lineTo(-42,-44);c.closePath();c.fill();c.fillStyle='#7a4039';c.beginPath();c.moveTo(-42,-49);c.lineTo(-2,-85);c.lineTo(43,-49);c.lineTo(31,-47);c.lineTo(-2,-75);c.lineTo(-33,-47);c.closePath();c.fill();c.fillStyle='#a9604c';for(let i=0;i<5;i++)c.fillRect(-28+i*12,-60-Math.max(0,3-Math.abs(i-2))*5,7,2);c.fillStyle='#51372e';c.fillRect(-32,-42,4,23);c.fillRect(28,-42,4,23);c.fillStyle='#ffcf76';c.fillRect(-28,-39,3,19);c.fillRect(26,-39,3,19);c.fillStyle='#fff1b6';c.fillRect(-27,-38,1,15);c.fillRect(27,-38,1,15);c.fillStyle='#473329';c.fillRect(17,-85,9,29);c.fillStyle='#b17a50';c.fillRect(16,-86,11,3)
    } else if(d.k==='torch'){
      c.fillStyle='#3f2e24';c.fillRect(-3,-36,6,38);c.fillStyle='#8b5730';c.fillRect(-5,-37,10,5);c.fillStyle='#ffb34e';c.fillRect(-4,-45+Math.round(Math.sin(t*15+d.x)*2),8,10);c.fillStyle='#ffe08a';c.fillRect(-2,-43+Math.round(Math.sin(t*15+d.x)*2),4,5)
    } else if(d.k==='pillar'){
      c.fillStyle='#0007';c.fillRect(-18,1,36,7);c.fillStyle='#62616a';c.fillRect(-12,-62,24,62);c.fillStyle='#88858a';c.fillRect(-16,-67,32,8);c.fillStyle='#383947';c.fillRect(-16,-5,32,8);c.fillStyle='#aaa4a0';c.fillRect(-8,-58,4,43);c.fillStyle='#36333a';c.fillRect(3,-39,3,12)
    } else if(d.k==='dead'){
      c.fillStyle='#0007';c.fillRect(-18,1,36,6);c.fillStyle='#35221f';c.fillRect(-4,-48,8,50);c.fillRect(-4,-39,22,5);c.fillRect(11,-51,5,15);c.fillRect(-17,-56,18,5);c.fillRect(-17,-60,5,16);c.fillStyle='#59342b';c.fillRect(-2,-45,3,34)
    } else if(d.k==='rock'){
      c.fillStyle='#17161a';c.fillRect(-21,-13,43,20);c.fillStyle='#493632';c.fillRect(-18,-18,33,19);c.fillStyle='#755047';c.fillRect(-12,-22,20,8);c.fillStyle='#ff6638';c.fillRect(-7,-9,12,2);c.fillStyle='#ffb25b';c.fillRect(-4,-9,5,1)
    } else if(d.k==='well'){
      c.fillStyle='#0007';c.fillRect(-21,1,42,6);c.fillStyle='#5b5c62';c.fillRect(-18,-20,36,21);c.fillStyle='#969398';c.fillRect(-21,-24,42,7);c.fillStyle='#27374b';c.fillRect(-12,-16,24,14);c.fillStyle='#74bad0';c.fillRect(-9,-13,18,4);c.fillStyle='#493a2c';c.fillRect(-3,-38,6,17);c.fillRect(-19,-39,38,4);c.fillStyle='#8a5d34';c.fillRect(9,-35,3,17)
    } else if(d.k==='fountain'){
      c.fillStyle='#0007';c.fillRect(-30,0,60,7);c.fillStyle='#6e7480';c.fillRect(-27,-10,54,14);c.fillStyle='#a1a8ae';c.fillRect(-30,-14,60,6);c.fillStyle='#527e91';c.fillRect(-22,-9,44,3);c.fillStyle='#7b828b';c.fillRect(-5,-37,10,24);c.fillStyle='#a5aab0';c.fillRect(-14,-39,28,6);c.fillStyle='#7bd5df';c.fillRect(-2,-48,4,12)
    } else if(d.k==='market'){
      c.fillStyle='#0007';c.fillRect(-27,1,54,6);c.fillStyle='#59422e';c.fillRect(-23,-31,5,32);c.fillRect(18,-31,5,32);c.fillStyle='#7b362f';c.fillRect(-29,-36,58,9);c.fillStyle='#d59a58';c.fillRect(-21,-36,13,9);c.fillRect(8,-36,13,9);c.fillStyle='#b99861';c.fillRect(-25,-23,50,3);c.fillStyle='#8d633d';c.fillRect(-18,-18,12,11);c.fillRect(4,-18,13,11)
    } else if(d.k==='mushroom'){
      const pulse=Math.sin(t*3+d.x)*2;c.fillStyle='#0007';c.fillRect(-14,2,28,4);c.fillStyle='#e0c99b';c.fillRect(-4,-18,9,20);c.fillStyle='#86483a';c.fillRect(-13,-24+pulse,27,9);c.fillStyle='#d87952';c.fillRect(-10,-26+pulse,20,5);c.fillStyle='#f2dfaa';c.fillRect(-6,-23+pulse,3,2);c.fillRect(4,-21+pulse,3,2)
    } else if(d.k==='root'){
      c.fillStyle='#3b2a20';c.fillRect(-27,-9,54,8);c.fillRect(-20,-15,8,10);c.fillRect(-7,-20,8,15);c.fillRect(12,-16,8,11);c.fillStyle='#54703d';c.fillRect(-24,-11,14,3);c.fillRect(1,-17,11,3);c.fillStyle='#8ab561';c.fillRect(-6,-18,3,2)
    } else if(d.k==='arch'){
      c.fillStyle='#0007';c.fillRect(-48,0,96,7);c.fillStyle='#5d5664';c.fillRect(-44,-62,16,64);c.fillRect(28,-62,16,64);c.fillRect(-44,-66,88,15);c.fillStyle='#817888';c.fillRect(-38,-61,9,51);c.fillRect(29,-61,9,51);c.fillStyle='#252131';c.fillRect(-22,-53,44,55);c.fillStyle='#a28b5b';c.fillRect(-2,-54,4,18)
    } else if(d.k==='rubble'){
      c.fillStyle='#0007';c.fillRect(-20,1,42,5);c.fillStyle='#6b6870';c.fillRect(-21,-10,17,11);c.fillRect(-5,-16,18,17);c.fillRect(10,-7,16,8);c.fillStyle='#a09aa0';c.fillRect(-18,-10,11,3);c.fillRect(-2,-16,9,3);c.fillStyle='#3f3d49';c.fillRect(7,-5,14,3)
    } else if(d.k==='vent'){
      c.fillStyle='#171516';c.fillRect(-24,-10,48,16);c.fillStyle='#563029';c.fillRect(-18,-16,36,10);c.fillStyle='#ff5b2c';c.fillRect(-8,-16,16,4);c.fillStyle='#ffb052';c.fillRect(-4,-19,8,5);c.globalAlpha=.6+Math.sin(t*8+d.x)*.25;c.fillStyle='#ff5429';c.fillRect(-14,-28,3,8);c.fillRect(10,-33,3,9)
    } else if(d.k==='banner'){
      c.fillStyle='#49362a';c.fillRect(-2,-56,4,58);c.fillStyle='#a13b39';c.fillRect(2,-52,24,27);c.fillRect(2,-25,18,8);c.fillStyle='#e8c46a';c.fillRect(5,-48,3,17);c.fillRect(11,-44,8,3);c.fillStyle='#0006';c.fillRect(-11,2,22,5)
    } else if(d.k==='brazier'){
      c.fillStyle='#0007';c.fillRect(-14,1,28,5);c.fillStyle='#5a5660';c.fillRect(-9,-25,18,25);c.fillStyle='#96909a';c.fillRect(-13,-29,26,7);c.fillStyle='#45352e';c.fillRect(-3,-48,6,21);c.fillStyle='#ff6b31';c.fillRect(-7,-43+Math.round(Math.sin(t*12)*2),14,14);c.fillStyle='#ffd56c';c.fillRect(-3,-40,6,9)
    }
    c.restore();
  }

  root.AetheriaWorld = { zones, makeDecorations, background, drawDecoration, drawParallax, drawAmbient, pathY };
})(window);
