/* Legends of Aetheria — hand-built pixel character renderer.
 * All characters use a shared chunky-pixel silhouette, dark outlines and
 * game-specific palettes/equipment; no external assets or network are needed.
 */
(function (root) {
  'use strict';

  const PALETTE = {
    outline: '#211b1a', shadow: '#080a12', skin: '#d7a16f', skinLight: '#f0c48b',
    hair: '#57331f', hairLight: '#8a5630', eye: '#231817', cloth: '#31556b',
    clothLight: '#547d85', clothDark: '#203949', trim: '#e7bf5b', leather: '#70472b',
    leatherLight: '#a26a3a', boot: '#36251e', steel: '#718091', steelLight: '#b2c0c5',
    steelDark: '#465361', bone: '#e5ddc4', boneShade: '#aa9f84', red: '#a74131',
    redLight: '#df6840', green: '#61853b', greenLight: '#92ad53', purple: '#7650a0',
    purpleLight: '#bd9be9', wood: '#80512d', gem: '#95e4e0'
  };

  const NPC = {
    wiz:   { skin:'#e2b487', hair:'#d5c9a8', cloth:'#574482', light:'#8d71bc', dark:'#352b52', trim:'#e0c579', hat:'wizard', beard:'#c4b89e', prop:'staff' },
    queen: { skin:'#efc18e', hair:'#8a432d', cloth:'#793442', light:'#b84d4f', dark:'#4b2532', trim:'#f4d56f', hat:'crown', prop:'scepter' },
    smith: { skin:'#d29464', hair:'#51311e', cloth:'#974b25', light:'#cb7439', dark:'#61351f', trim:'#d9a04c', apron:'#687078', beard:'#8b512b', prop:'hammer' },
    cap:   { skin:'#dfac7a', hair:'#5d3827', cloth:'#53637a', light:'#8792a4', dark:'#343e52', trim:'#edc85e', hat:'helmet', plume:'#b74134', prop:'sword' },
    guard: { skin:'#c99368', hair:'#4b3327', cloth:'#355d43', light:'#587c4a', dark:'#234232', trim:'#c9a959', hat:'hood', cape:'#244333', prop:'bow' },
    trav:  { skin:'#d9a779', hair:'#684128', cloth:'#98704a', light:'#bd9667', dark:'#594330', trim:'#d9b46e', beard:'#6b472f', prop:'satchel' },
    pip:   { skin:'#edbb91', hair:'#714337', cloth:'#754c80', light:'#a36d9d', dark:'#4d335a', trim:'#ecc777', hat:'hood', prop:'staff' }
  };

  function rect(ctx, x, y, w, h, color) {
    if (!color || w <= 0 || h <= 0) return;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  function facingName(fx, fy) {
    if (Math.abs(fx) > Math.abs(fy) * 1.15) return fx < 0 ? 'west' : 'east';
    return fy < 0 ? 'north' : 'south';
  }

  function shadow(ctx, cell, width) {
    const rx=width*cell*.48,ry=Math.max(2,cell*.9);
    ctx.save();ctx.fillStyle='rgba(0,0,0,.24)';ctx.beginPath();ctx.ellipse(0,cell*1.15,rx,ry,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(0,cell*1.08,rx*.67,ry*.54,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,221,160,.09)';ctx.fillRect(-rx*.28,cell*.92,rx*.56,Math.max(1,cell*.12));ctx.restore();
  }

  function drawHuman(ctx, p, x, y, o) {
    const cell = o.cell || 3;
    const moving = !!o.moving;
    const phase = moving ? (o.step & 3) : 0;
    const face = o.facing || 'south';
    const stride=[-1,0,1,0][phase], armSwing=moving?[1,0,-1,0][phase]:0;
    const bob = moving ? [-.12,-.42,-.68,-.3][phase]*cell : Math.sin((o.time||0)*1.8)*cell*.09;
    ctx.save();
    ctx.translate(x, y);
    shadow(ctx, cell, 10);
    ctx.translate(0, bob);
    ctx.scale(face === 'west' ? -cell : cell, cell);

    const O = PALETTE.outline;
    const skin = p.skin || PALETTE.skin;
    const coat = p.cloth || PALETTE.cloth;
    const light = p.light || PALETTE.clothLight;
    const dark = p.dark || PALETTE.clothDark;
    const hair = p.hair || PALETTE.hair;
    const trim = p.trim || PALETTE.trim;
    const legsA = stride;
    const legsB = -stride;

    // Back cape / cloak silhouette.
    if (p.cape || face === 'north') {
      rect(ctx, -5, -13, 10, 9, O);
      rect(ctx, -4, -12, 8, 8, p.cape || dark);
      rect(ctx, -5, -5, 2, 2, p.cape || dark);
      rect(ctx, 3, -5, 2, 2, p.cape || dark);
      rect(ctx, -2, -10, 4, 1, p.capeLight || light);
    }

    // Boots and animated legs: two alternating stride poses.
    rect(ctx, -4 + legsA, -5, 4, 5, O);
    rect(ctx, -3 + legsA, -4, 2, 3, p.trousers || dark);
    rect(ctx, -4 + legsA, -1, 4, 2, O);
    rect(ctx, -3 + legsA, -1, 3, 1, p.boot || PALETTE.boot);
    rect(ctx, 0 + legsB, -5, 4, 5, O);
    rect(ctx, 1 + legsB, -4, 2, 3, p.trousers || dark);
    rect(ctx, 0 + legsB, -1, 4, 2, O);
    rect(ctx, 1 + legsB, -1, 3, 1, p.boot || PALETTE.boot);

    // Torso, shoulders and sleeves, built as stepped pixel blocks.
    rect(ctx, -5, -13, 10, 9, O);
    rect(ctx, -4, -12, 8, 7, coat);
    rect(ctx, -6-armSwing, -12, 3, 6, O);
    rect(ctx, -5-armSwing, -11, 2, 4, p.sleeve || light);
    rect(ctx, 3+armSwing, -12, 3, 6, O);
    rect(ctx, 4+armSwing, -11, 2, 4, p.sleeve || light);
    rect(ctx,-5-armSwing,-12,1,2,p.sleeveLight||light);
    rect(ctx,4+armSwing,-12,1,2,p.sleeveLight||light);
    rect(ctx, -4, -6, 8, 2, O);
    rect(ctx, -3, -6, 6, 1, p.belt || PALETTE.leather);
    rect(ctx, -1, -6, 2, 1, trim);
    rect(ctx, -3, -11, 2, 3, light);
    rect(ctx, 1, -11, 2, 3, dark);
    rect(ctx, -1, -10, 2, 2, p.emblem || trim);
    rect(ctx,-3,-9,1,2,p.dark||dark);rect(ctx,2,-9,1,2,p.light||light);
    rect(ctx,-2,-8,1,1,'rgba(255,235,190,.62)');rect(ctx,1,-8,1,1,'rgba(0,0,0,.18)');
    if (p.apron) {
      rect(ctx, -3, -9, 6, 5, O);
      rect(ctx, -2, -8, 4, 4, p.apron);
      rect(ctx, -2, -5, 4, 1, p.apronLight || trim);
    }
    if (p.armor) {
      rect(ctx, -5, -13, 10, 3, O);
      rect(ctx, -4, -12, 8, 2, p.armor);
      rect(ctx, -1, -11, 2, 5, p.armorLight || PALETTE.steelLight);
      rect(ctx, -4, -6, 8, 1, trim);
      rect(ctx,-4,-11,1,3,'rgba(255,255,255,.24)');rect(ctx,3,-11,1,3,'rgba(0,0,0,.22)');
      rect(ctx,-2,-9,1,1,p.armorLight||PALETTE.steelLight);rect(ctx,1,-9,1,1,p.armorLight||PALETTE.steelLight);
    }

    // Head, ears and face. Hair/hood/helmet silhouettes stay chunky and outlined.
    rect(ctx, -4, -21, 8, 9, O);
    rect(ctx, -3, -20, 6, 7, skin);
    rect(ctx, -5, -19, 2, 3, O);
    rect(ctx, 3, -19, 2, 3, O);
    rect(ctx, -4, -18, 1, 2, p.ear || skin);
    rect(ctx, 3, -18, 1, 2, p.ear || skin);

    if (p.hat === 'helmet') {
      rect(ctx, -5, -22, 10, 5, O);
      rect(ctx, -4, -22, 8, 3, p.helmet || PALETTE.steel);
      rect(ctx, -5, -19, 10, 2, p.helmetLight || PALETTE.steelLight);
      rect(ctx, -3, -17, 6, 1, O);
      rect(ctx, -2, -17, 4, 1, PALETTE.steelDark);
      rect(ctx, -1, -19, 2, 1, trim);
      if (p.plume) {
        rect(ctx, -2, -25, 4, 3, O);
        rect(ctx, -1, -26, 3, 3, p.plume);
        rect(ctx, 0, -27, 2, 2, p.plume);
      }
    } else if (p.hat === 'wizard') {
      rect(ctx, -6, -22, 12, 2, O);
      rect(ctx, -5, -22, 10, 1, trim);
      rect(ctx, -4, -24, 8, 3, O);
      rect(ctx, -3, -24, 6, 2, p.hatColor || p.cloth);
      rect(ctx, -2, -27, 5, 4, O);
      rect(ctx, -1, -27, 3, 3, p.hatColor || p.cloth);
      rect(ctx, 0, -29, 2, 3, O);
      rect(ctx, 0, -29, 1, 2, p.hatColor || p.cloth);
      rect(ctx, -1, -23, 2, 1, p.hatBand || trim);
    } else if (p.hat === 'crown') {
      rect(ctx, -5, -22, 10, 3, O);
      rect(ctx, -4, -22, 8, 2, trim);
      rect(ctx, -4, -24, 2, 3, O);
      rect(ctx, -3, -25, 1, 3, trim);
      rect(ctx, -1, -25, 2, 4, O);
      rect(ctx, 0, -26, 1, 4, trim);
      rect(ctx, 2, -24, 2, 3, O);
      rect(ctx, 3, -25, 1, 3, trim);
      rect(ctx, -1, -22, 2, 1, p.gem || '#d85855');
    } else if (p.hat === 'hood') {
      rect(ctx, -5, -22, 10, 6, O);
      rect(ctx, -4, -22, 8, 4, p.hood || dark);
      rect(ctx, -3, -20, 6, 4, p.hoodLight || coat);
      rect(ctx, -2, -19, 4, 1, p.hoodShade || dark);
    } else {
      rect(ctx, -5, -22, 10, 4, O);
      rect(ctx, -4, -21, 8, 3, hair);
      rect(ctx, -4, -18, 2, 3, hair);
      rect(ctx, 2, -18, 2, 3, hair);
      rect(ctx, -2, -21, 4, 1, p.hairLight || PALETTE.hairLight);
    }

    if (p.hat !== 'helmet') {
      if (face === 'south') {
        rect(ctx, -2, -16, 1, 1, p.eye || PALETTE.eye);
        rect(ctx, 1, -16, 1, 1, p.eye || PALETTE.eye);
        rect(ctx, -1, -14, 2, 1, p.cheek || PALETTE.skinLight);
        rect(ctx,-3,-17,1,1,'rgba(255,236,200,.4)');rect(ctx,2,-17,1,1,'rgba(255,236,200,.4)');
        rect(ctx,0,-16,1,1,'rgba(255,255,255,.32)');
      } else if (face === 'east' || face === 'west') {
        rect(ctx, -1, -16, 1, 1, p.eye || PALETTE.eye);
        rect(ctx, -1, -14, 2, 1, p.cheek || PALETTE.skinLight);
      }
    } else if (face !== 'north') {
      rect(ctx, -2, -17, 4, 1, PALETTE.outline);
      rect(ctx, -1, -17, 2, 1, p.eye || PALETTE.skinLight);
    }

    if (p.beard) {
      rect(ctx, -3, -14, 6, 3, O);
      rect(ctx, -2, -14, 4, 2, p.beard);
      rect(ctx, -1, -12, 2, 1, p.beardLight || p.beard);
    }
    if (p.ears) {
      rect(ctx, -8, -19, 4, 2, O);
      rect(ctx, -9, -20, 3, 2, O);
      rect(ctx, -7, -19, 2, 1, p.ear || p.skin);
      rect(ctx, 4, -19, 4, 2, O);
      rect(ctx, 6, -20, 3, 2, O);
      rect(ctx, 5, -19, 2, 1, p.ear || p.skin);
    }
    if (p.moustache) {
      rect(ctx, -3, -14, 6, 1, O);
      rect(ctx, -2, -14, 4, 1, p.beard || hair);
    }

    // Main hero and key NPCs visibly carry their story gear.
    if (p.prop === 'staff' || p.prop === 'scepter') {
      rect(ctx, 5, -17, 3, 16, O);
      rect(ctx, 6, -16, 1, 14, p.staff || PALETTE.wood);
      rect(ctx, 4, -20, 5, 5, O);
      rect(ctx, 5, -19, 3, 3, p.gem || PALETTE.gem);
      rect(ctx, 6, -18, 1, 1, p.gemLight || '#e4ffff');
      if (p.prop === 'scepter') rect(ctx, 5, -14, 3, 1, trim);
    } else if (p.prop === 'sword' || p.prop === 'blade') {
      rect(ctx, 5, -13, 3, 9, O);
      rect(ctx, 6, -13, 1, 7, p.blade || PALETTE.steelLight);
      rect(ctx, 5, -7, 4, 1, trim);
      rect(ctx, 6, -6, 2, 3, p.hilt || PALETTE.leather);
      rect(ctx, 6, -4, 2, 2, O);
    } else if (p.prop === 'hammer') {
      rect(ctx, 6, -13, 2, 9, O);
      rect(ctx, 6, -12, 1, 7, PALETTE.wood);
      rect(ctx, 3, -16, 7, 4, O);
      rect(ctx, 4, -15, 5, 2, PALETTE.steel);
      rect(ctx, 4, -15, 2, 1, PALETTE.steelLight);
    } else if (p.prop === 'bow') {
      rect(ctx, 6, -16, 1, 2, trim);
      rect(ctx, 7, -14, 1, 7, O);
      rect(ctx, 6, -7, 1, 2, trim);
      rect(ctx, 5, -14, 1, 7, PALETTE.leatherLight);
    } else if (p.prop === 'satchel') {
      rect(ctx, 4, -9, 4, 5, O);
      rect(ctx, 5, -8, 2, 3, PALETTE.leatherLight);
    }
    if (p.shield) {
      rect(ctx, -9, -11, 4, 8, O);
      rect(ctx, -8, -10, 3, 6, p.shield);
      rect(ctx, -7, -9, 1, 3, p.shieldMark || trim);
    }
    if (p.scarf) {
      rect(ctx, -4, -13, 8, 2, O);
      rect(ctx, -3, -13, 6, 1, p.scarf);
      rect(ctx, 3, -12, 2, 3, p.scarf);
    }
    ctx.restore();
  }

  function heroProfile(state) {
    const eq = state.p && state.eq || {};
    const p = Object.assign({}, PALETTE, {
      cloth:'#315b78', light:'#547f91', dark:'#223c54', cape:'#263e58',
      hair:'#704324', hairLight:'#a36a3c', trim:'#e9c361', skin:'#d8a274',
      prop: eq.staff ? 'staff' : 'sword', blade: eq.sword && eq.sword.n === 'Ember Blade' ? '#ff8945' : '#cbd9d8',
      scarf:'#a94a37', boot:'#453028', emblem:'#f3d36e'
    });
    if (eq.armor) {
      if (eq.armor.n === 'Dragonscale Vest') Object.assign(p, {cloth:'#684238',light:'#b65035',dark:'#3f2928',cape:'#552e2b',emblem:'#f17c42'});
      else Object.assign(p, {cloth:'#536679',light:'#a3b0b7',dark:'#354251',cape:'#30435a',emblem:'#e9c361'});
    }
    if (eq.shield) p.shield = '#71864b';
    return p;
  }

  function drawHero(ctx, state) {
    const p = state.p;
    const f = facingName(p.fx || 0, p.fy || 1);
    const moving = !!p.moving || p.dash > 0;
    const profile = heroProfile(state);
    if (p.inv > 0 && Math.floor(state.t * 18) % 2) ctx.save(), ctx.globalAlpha = .48;
    drawHuman(ctx, profile, p.x, p.y, {cell:3.45, facing:f, moving, step:Math.floor(state.t * 9),time:state.t});
    if (p.inv > 0 && Math.floor(state.t * 18) % 2) ctx.restore();
    if (p.sw > 0) {
      ctx.save();
      ctx.translate(p.x, p.y - 25);
      ctx.strokeStyle = '#fff3bd'; ctx.lineWidth = 4; ctx.globalAlpha = Math.min(1, p.sw * 5);
      ctx.beginPath(); const a = Math.atan2(p.fy, p.fx); ctx.arc(0, 0, 48, a - .9, a + .9); ctx.stroke();
      ctx.restore();
    }
  }

  function drawNpc(ctx, it, state, npcInfo) {
    const profile = NPC[it.k] || NPC.trav;
    const facing = Math.abs(state.p.x - it.x) > 18 ? (state.p.x < it.x ? 'west' : 'east') : 'south';
    const idleStep = Math.floor(state.t * 2 + it.x) & 1;
    drawHuman(ctx, profile, it.x, it.y, {cell:3.15, facing, moving:false, step:idleStep,time:state.t+it.x*.008});
    ctx.save();
    ctx.fillStyle = '#080b12'; ctx.font = 'bold 12px Georgia'; ctx.textAlign = 'center';ctx.lineWidth=3;ctx.strokeStyle='#090d17';
    const label=npcInfo.n.split(',')[0].replace('the ',''),labelY=it.y-(profile.hat==='wizard'?99:profile.hat==='crown'?88:82);ctx.strokeText(label,it.x,labelY);ctx.fillStyle='#fff0cc';ctx.fillText(label,it.x,labelY);
    ctx.restore();
  }

  function drawGoblin(ctx, state, e) {
    const p = {skin:'#84a94b',ear:'#9abd58',hair:'#455c2a',cloth:'#586d32',light:'#829749',dark:'#374325',trim:'#bd9150',boot:'#443324',ears:true,prop:'hammer',blade:'#9b7952'};
    drawHuman(ctx,p,e.x,e.y,{cell:2.85,facing:state.p.x<e.x?'west':'east',moving:true,step:Math.floor(e.ph*8),time:e.ph});
  }

  function drawKnight(ctx, state, e) {
    const p = {skin:'#c59a71',hair:'#5b382a',cloth:'#455468',light:'#77879b',dark:'#293442',trim:'#dcbd69',helmet:'#64758c',helmetLight:'#b1bec6',hat:'helmet',plume:'#b44135',armor:'#596a80',armorLight:'#d0d6cc',prop:'sword',blade:'#d9e5df',shield:'#626e79'};
    drawHuman(ctx,p,e.x,e.y,{cell:3.15,facing:state.p.x<e.x?'west':'east',moving:true,step:Math.floor(e.ph*7),time:e.ph});
  }

  function drawSkeleton(ctx, state, e) {
    const cell=2.95, step=Math.floor(e.ph*8)&3, face=state.p.x<e.x?'west':'east';
    ctx.save(); ctx.translate(e.x,e.y); shadow(ctx,cell,9); ctx.scale(face==='west'?-cell:cell,cell);
    const O=PALETTE.outline, B=PALETTE.bone, S=PALETTE.boneShade;
    rect(ctx,-4+step,-5,3,5,O); rect(ctx,-3+step,-4,1,3,B); rect(ctx,-4+step,-1,3,1,O);
    rect(ctx,1-step,-5,3,5,O); rect(ctx,1-step,-4,1,3,B); rect(ctx,1-step,-1,3,1,O);
    rect(ctx,-4,-13,8,8,O); rect(ctx,-3,-12,6,6,S); rect(ctx,-2,-11,4,4,B);
    rect(ctx,-5,-12,2,6,O); rect(ctx,-4,-11,1,4,B); rect(ctx,3,-12,2,6,O); rect(ctx,3,-11,1,4,B);
    rect(ctx,-3,-10,6,1,O); rect(ctx,-2,-10,4,1,B); rect(ctx,-3,-8,6,1,O); rect(ctx,-2,-8,4,1,B); rect(ctx,-3,-6,6,1,O); rect(ctx,-2,-6,4,1,B);
    rect(ctx,-4,-20,8,8,O); rect(ctx,-3,-19,6,6,B); rect(ctx,-3,-18,2,2,O); rect(ctx,1,-18,2,2,O);
    rect(ctx,-2,-15,4,1,S); rect(ctx,-1,-14,2,1,O);
    rect(ctx,4,-12,2,8,O); rect(ctx,5,-11,1,6,PALETTE.wood); rect(ctx,3,-14,5,3,O); rect(ctx,4,-13,3,1,S);
    ctx.restore();
  }

  function drawShade(ctx, state, e) {
    const cell=3.05, bob=Math.round(Math.sin(e.ph*4)*1.25), face=state.p.x<e.x?'west':'east';
    ctx.save(); ctx.translate(e.x,e.y); ctx.globalAlpha=.88; shadow(ctx,cell,8); ctx.translate(0,bob);
    ctx.scale(face==='west'?-cell:cell,cell);
    const O='#20172e', P='#4b3577', M='#7958b3', L='#b894e4';
    rect(ctx,-4,-18,8,3,O); rect(ctx,-5,-16,10,7,O); rect(ctx,-4,-16,8,6,P); rect(ctx,-3,-15,6,4,M);
    rect(ctx,-6,-11,12,7,O); rect(ctx,-5,-11,10,6,P); rect(ctx,-4,-9,8,4,M);
    rect(ctx,-5,-4,3,4,O); rect(ctx,-4,-4,2,3,P); rect(ctx,2,-4,3,4,O); rect(ctx,2,-4,2,3,P);
    rect(ctx,-4,-17,2,2,L); rect(ctx,2,-17,2,2,L); rect(ctx,-2,-12,1,1,'#f1ddff'); rect(ctx,1,-12,1,1,'#f1ddff');
    rect(ctx,-7,-10,2,4,P); rect(ctx,5,-10,2,4,P); rect(ctx,-6,-6,2,2,M); rect(ctx,4,-6,2,2,M);
    ctx.restore();
  }

  function drawWolf(ctx, state, e) {
    const cell=3.05, step=Math.floor(e.ph*9)&3, flip=state.p.x<e.x?-1:1;
    ctx.save(); ctx.translate(e.x,e.y); shadow(ctx,cell,12); ctx.scale(flip*cell,cell);
    const O=PALETTE.outline, F='#737b82', L='#a1a7a5', D='#4b535e', R='#b9483e';
    // Tail, hindquarters and body.
    rect(ctx,3,-9,3,3,O); rect(ctx,5,-11,2,3,O); rect(ctx,6,-12,2,2,D);
    rect(ctx,-4,-10,11,7,O); rect(ctx,-3,-9,9,5,F); rect(ctx,0,-8,5,3,L); rect(ctx,-3,-7,4,2,D);
    rect(ctx,-4+step,-4,3,4,O); rect(ctx,-3+step,-3,1,3,D); rect(ctx,1-step,-4,3,4,O); rect(ctx,1-step,-3,1,3,F);
    rect(ctx,4-step,-4,3,4,O); rect(ctx,5-step,-3,1,3,D);
    // Raised head, ears and square muzzle.
    rect(ctx,-8,-14,8,7,O); rect(ctx,-7,-13,6,5,F); rect(ctx,-7,-14,3,2,D);
    rect(ctx,-8,-18,3,5,O); rect(ctx,-7,-17,1,3,D); rect(ctx,-4,-18,3,5,O); rect(ctx,-3,-17,1,3,F);
    rect(ctx,-11,-11,5,3,O); rect(ctx,-10,-10,4,1,L); rect(ctx,-12,-10,2,2,O); rect(ctx,-11,-10,1,1,D);
    rect(ctx,-6,-12,1,1,R); rect(ctx,-5,-12,1,1,'#f5ca6d');
    rect(ctx,-10,-8,2,1,'#e8d9bd'); rect(ctx,-7,-8,1,1,'#e8d9bd');
    ctx.restore();
  }

  function drawDragon(ctx, state, e) {
    const flap=Math.round(Math.sin(state.t*3.2)*2.6), cell=4.75;
    ctx.save(); ctx.translate(e.x,e.y); ctx.scale(cell,cell);
    rect(ctx,-28,18,56,3,'rgba(0,0,0,.45)'); rect(ctx,-22,21,44,2,'rgba(0,0,0,.3)');
    const O='#251817', R='#7f211b', M='#ad3022', L='#d34a2c', H='#ee7540', B='#e2b45b';
    function wing(sign) {
      ctx.save(); ctx.scale(sign,1);
      // Two stepped, flapping wings with dark ribs and warm membrane pixels.
      rect(ctx,7,-11+flap,9,5,O); rect(ctx,13,-18+flap,9,7,O); rect(ctx,21,-24+flap,8,7,O); rect(ctx,29,-29+flap,7,7,O);
      rect(ctx,8,-10+flap,7,3,R); rect(ctx,14,-17+flap,7,5,M); rect(ctx,22,-23+flap,6,5,R); rect(ctx,30,-28+flap,5,5,M);
      rect(ctx,12,-8+flap,17,3,O); rect(ctx,18,-5+flap,13,3,O); rect(ctx,24,-2+flap,9,3,O);
      rect(ctx,13,-8+flap,13,1,L); rect(ctx,19,-5+flap,9,1,L); rect(ctx,25,-2+flap,5,1,L);
      rect(ctx,13,-13+flap,2,7,R); rect(ctx,20,-19+flap,2,8,R); rect(ctx,27,-25+flap,2,8,R);
      ctx.restore();
    }
    wing(-1); wing(1);
    // Tail with blocky spade tip.
    rect(ctx,13,5,9,4,O); rect(ctx,20,7,8,3,R); rect(ctx,26,8,5,3,O); rect(ctx,29,6,5,6,O); rect(ctx,31,7,3,4,B);
    // Legs and talons.
    rect(ctx,-12,7,7,8,O); rect(ctx,-11,8,5,5,M); rect(ctx,-13,13,8,3,O); rect(ctx,-12,13,6,1,H);
    rect(ctx,6,7,7,8,O); rect(ctx,7,8,5,5,M); rect(ctx,5,13,8,3,O); rect(ctx,6,13,6,1,H);
    rect(ctx,-12,16,2,2,B); rect(ctx,-7,16,2,2,B); rect(ctx,6,16,2,2,B); rect(ctx,11,16,2,2,B);
    // Armored body and plated belly.
    rect(ctx,-15,-5,30,15,O); rect(ctx,-13,-4,26,12,R); rect(ctx,-9,-2,18,9,M); rect(ctx,-6,0,12,6,'#d98843');
    rect(ctx,-4,0,8,1,'#f1c36e'); rect(ctx,-4,3,8,1,'#f1c36e'); rect(ctx,-3,6,6,1,'#f1c36e');
    rect(ctx,-11,-2,2,2,H);rect(ctx,9,-2,2,2,R);rect(ctx,-8,5,2,2,'#f0a24e');rect(ctx,6,5,2,2,'#f0a24e');
    rect(ctx,-12,-6,24,3,O); rect(ctx,-10,-6,20,2,L); rect(ctx,-7,-8,14,3,O); rect(ctx,-5,-8,10,2,M);
    // Head and square muzzle turn toward the advancing hero.
    rect(ctx,-20,-12,12,9,O); rect(ctx,-19,-11,10,7,R); rect(ctx,-23,-9,7,5,O); rect(ctx,-22,-8,6,3,H);
    rect(ctx,-18,-16,4,5,O); rect(ctx,-17,-16,2,4,B); rect(ctx,-12,-15,4,4,O); rect(ctx,-11,-15,2,3,B);
    rect(ctx,-17,-9,2,2,'#f3c848'); rect(ctx,-17,-9,1,2,O); rect(ctx,-23,-6,3,1,'#3c211b');
    // Jaw plates, back spikes and glint.
    rect(ctx,-15,-3,5,2,H); rect(ctx,-7,-9,3,2,H); rect(ctx,0,-10,3,2,H); rect(ctx,7,-8,3,2,H);
    rect(ctx,-3,-11,3,3,O); rect(ctx,-2,-10,1,1,'#fff0b5');
    // Scaled brow plates and alternating glints make the face readable at phone size.
    rect(ctx,-21,-12,3,2,'#f08a4a');rect(ctx,-20,-13,2,1,'#ffd28a');
    rect(ctx,-15,-1,3,1,'#ed7440');rect(ctx,8,-4,2,1,'#f49a52');
    ctx.restore();
  }

  function drawEnemy(ctx, state, e, stats) {
    if (e.t === 'dragon') {
      drawDragon(ctx,state,e);
    } else if (e.t === 'goblin') {
      drawGoblin(ctx,state,e);
    } else if (e.t === 'wolf') {
      drawWolf(ctx,state,e);
    } else if (e.t === 'skel') {
      drawSkeleton(ctx,state,e);
    } else if (e.t === 'shade') {
      drawShade(ctx,state,e);
    } else if (e.t === 'knight') {
      drawKnight(ctx,state,e);
    }
    const width=e.t==='dragon'?60:38;
    const barY=e.t==='dragon'?-105:-Math.max(48,stats.r*2+25);
    ctx.save(); ctx.translate(e.x,e.y);
    rect(ctx,-width/2-1,barY-1,width+2,7,'rgba(4,6,13,.82)');
    rect(ctx,-width/2,barY,width,5,'#151117');
    const hpGrad=ctx.createLinearGradient(-width/2,barY,width/2,barY);hpGrad.addColorStop(0,e.hit>0?'#fff':'#9d2024');hpGrad.addColorStop(1,e.hit>0?'#fff':'#ff7162');ctx.fillStyle=hpGrad;ctx.fillRect(-width/2,barY,width*Math.max(0,e.hp/e.mh),4);
    rect(ctx,-width/2,barY,width,1,'#fff0bd');rect(ctx,-width/2,barY+5,width,1,'#171116');
    ctx.restore();
  }

  root.PixelCharacters = { drawHero, drawNpc, drawEnemy };
})(window);
