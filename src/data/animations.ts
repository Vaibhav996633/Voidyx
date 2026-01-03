import { AnimationEntry } from '../types';

export const ANIMATIONS: AnimationEntry[] = [
  
  {
    id: 'plasma-glow',
    name: 'Plasma Glow',
    category: 'WebGL',
    description: 'A smooth, organic noise-based plasma field with liquid motion and shifting hues.',
    complexity: 'Medium',
    config: [
      { id: 'color1', label: 'Primary', type: 'color', default: '#ff00ff' },
      { id: 'color2', label: 'Secondary', type: 'color', default: '#00ffff' },
      { id: 'speed', label: 'Motion', type: 'number', default: 1, min: 0.1, max: 5, step: 0.1 },
    ],
    html: '<canvas id="plasma"></canvas>',
    css: `body { margin: 0; background: #000; overflow: hidden; canvas { width: 100vw; height: 100vh; display: block; }`,
    js: `
      const config = window.VANTA_CONFIG || { color1: '#ff00ff', color2: '#00ffff', speed: 1 };
      const canvas = document.getElementById('plasma');
      const ctx = canvas.getContext('2d');
      let time = 0;
      function draw() {
        const w = canvas.width = window.innerWidth;
        const h = canvas.height = window.innerHeight;
        ctx.fillStyle = '#000';
        ctx.fillRect(0,0,w,h);
        time += 0.01 * config.speed;
        for (let y = 0; y < h; y += 8) {
          for (let x = 0; x < w; x += 8) {
            const v = Math.sin(x / 50 + time) + Math.sin(y / 50 + time) + Math.sin((x + y) / 50 + time);
            const r = (Math.sin(v) * 127 + 128);
            const g = (Math.cos(v) * 127 + 128);
            ctx.fillStyle = \`rgb(\${r},\${g},200)\`;
            ctx.fillRect(x, y, 8, 8);
          }
        }
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'cosmic-nebula',
    name: 'Cosmic Nebula',
    category: 'Background',
    description: 'Ethereal swirling cosmic clouds with dynamic volumetric lighting and color shifting.',
    complexity: 'Medium',
    config: [
      { id: 'coreColor', label: 'Core Glow', type: 'color', default: '#4338ca' },
      { id: 'nebulaSpeed', label: 'Rotation', type: 'number', default: 1.5, min: 0.5, max: 4, step: 0.1 }
    ],
    html: '<div id="nebula-bg"></div>',
    css: `
      body { margin: 0; background: #000; overflow: hidden; height: 100vh; }
      #nebula-bg {
        position: absolute; inset: -50%; width: 200%; height: 200%;
        background: radial-gradient(circle at center, var(--c, #4338ca) 0%, transparent 50%),
                    radial-gradient(circle at 30% 30%, #ec4899 0%, transparent 40%),
                    radial-gradient(circle at 70% 70%, #06b6d4 0%, transparent 40%);
        filter: blur(80px);
        animation: NebulaAnim var(--s, 10s) linear infinite;
      }
      @keyframes NebulaAnim { from { transform: rotate(0deg) scale(1); } to { transform: rotate(360deg) scale(1.1); } }
    `,
    js: `
      const config = window.VANTA_CONFIG || { coreColor: '#4338ca', nebulaSpeed: 1.5 };
      document.body.style.setProperty('--c', config.coreColor);
      document.body.style.setProperty('--s', (20 / config.nebulaSpeed) + 's');
    `
  },
  {
    id: 'quantum-mesh',
    name: 'Quantum Mesh',
    category: 'Particle',
    description: 'Entangled particles that pulse and weave through a multi-dimensional lattice.',
    complexity: 'High',
    config: [
      { id: 'beamColor', label: 'Beam', type: 'color', default: '#ffffff' },
      { id: 'density', label: 'Lattice Density', type: 'number', default: 40, min: 20, max: 80, step: 5 }
    ],
    html: '<canvas id="quantum"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { beamColor: '#ffffff', density: 40 };
      const canvas = document.getElementById('quantum');
      const ctx = canvas.getContext('2d');
      let t = 0;
      function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
      resize(); window.onresize = resize;
      function draw() {
        ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle = config.beamColor;
        ctx.lineWidth = 0.5;
        t += 0.02;
        const step = canvas.width / config.density;
        for(let i=0; i<config.density; i++) {
          ctx.beginPath();
          for(let y=0; y<canvas.height; y+=10) {
            const x = i * step + Math.sin(y*0.01 + t + i) * 30;
            ctx.lineTo(x, y);
            ctx.globalAlpha = Math.sin(t + i*0.5) * 0.5 + 0.5;
          }
          ctx.stroke();
        }
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'brutal-type',
    name: 'Brutal Typo',
    category: 'Text',
    description: 'Heavy brutalist typography with dynamic stroke weight and interactive letter displacement.',
    complexity: 'Medium',
    config: [
      { id: 'fillColor', label: 'Text Fill', type: 'color', default: '#ffffff' },
      { id: 'distort', label: 'Distortion', type: 'number', default: 10, min: 0, max: 50, step: 1 }
    ],
    html: '<div id="brutal" style="width:100%; height:100vh; display:flex; align-items:center; justify-content:center; font-family:sans-serif; font-weight:900; font-size:15vw; color:white;">VOID</div>',
    css: 'body { margin: 0; background: #050505; overflow: hidden; } #brutal { transition: all 0.1s; cursor: crosshair; }',
    js: `
      const config = window.VANTA_CONFIG || { fillColor: '#ffffff', distort: 10 };
      const el = document.getElementById('brutal');
      window.onmousemove = e => {
        const x = (e.clientX / window.innerWidth - 0.5) * config.distort;
        const y = (e.clientY / window.innerHeight - 0.5) * config.distort;
        el.style.transform = \`translate(\${x}px, \${y}px) skew(\${x}deg, \${y}deg)\`;
        el.style.textShadow = \`\${-x}px \${-y}px 0px rgba(255,0,0,0.5), \${x}px \${y}px 0px rgba(0,255,255,0.5)\`;
        el.style.color = config.fillColor;
      };
    `
  },
  {
    id: 'magnetic-repel',
    name: 'Magnetic Repel',
    category: 'Interactive',
    description: 'Geometric nodes that maintain a strict exclusion zone around the cursor via magnetic repulsion.',
    complexity: 'Medium',
    config: [
      { id: 'nodeColor', label: 'Node', type: 'color', default: '#fbbf24' },
      { id: 'force', label: 'Field Power', type: 'number', default: 100, min: 50, max: 300, step: 10 }
    ],
    html: '<canvas id="repel"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { nodeColor: '#fbbf24', force: 100 };
      const canvas = document.getElementById('repel');
      const ctx = canvas.getContext('2d');
      const mouse = { x: -1000, y: -1000 };
      window.onmousemove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
      let nodes = [];
      function resize() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        nodes = [];
        const gap = 40;
        for(let x=0; x<canvas.width; x+=gap) {
          for(let y=0; y<canvas.height; y+=gap) {
            nodes.push({x, y, ox:x, oy:y});
          }
        }
      }
      resize(); window.onresize = resize;
      function draw() {
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = config.nodeColor;
        nodes.forEach(n => {
          const dx = n.x - mouse.x; const dy = n.y - mouse.y;
          const d = Math.sqrt(dx*dx + dy*dy);
          const f = Math.max(0, (config.force - d) / config.force) * 30;
          const targetX = n.ox + (d > 0 ? (dx/d)*f : 0);
          const targetY = n.oy + (d > 0 ? (dy/d)*f : 0);
          n.x += (targetX - n.x) * 0.1;
          n.y += (targetY - n.y) * 0.1;
          ctx.beginPath(); ctx.arc(n.x, n.y, 1.5, 0, Math.PI*2); ctx.fill();
        });
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'topological-flow',
    name: 'Topo Flow',
    category: 'Background',
    description: 'Liquid topographical lines that shift and merge like a high-altitude weather pattern.',
    complexity: 'Medium',
    config: [
      { id: 'lineColor', label: 'Line', type: 'color', default: '#312e81' },
      { id: 'speed', label: 'Flow', type: 'number', default: 1, min: 0.2, max: 3, step: 0.1 }
    ],
    html: '<canvas id="topo"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; } canvas { filter: contrast(150%); }',
    js: `
      const config = window.VANTA_CONFIG || { lineColor: '#312e81', speed: 1 };
      const canvas = document.getElementById('topo');
      const ctx = canvas.getContext('2d');
      let t = 0;
      function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
      resize(); window.onresize = resize;
      function draw() {
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle = config.lineColor;
        ctx.lineWidth = 1;
        t += 0.005 * config.speed;
        for(let i=0; i<15; i++) {
          ctx.beginPath();
          for(let x=0; x<canvas.width; x+=10) {
            const noise = Math.sin(x*0.005 + t + i*0.5) * Math.cos(x*0.002 - t*0.5) * 150;
            const y = canvas.height/2 + noise + (i-7)*40;
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'pixel-burst',
    name: 'Pixel Burst',
    category: 'Interactive',
    description: 'Digital particles that coalesce into a grid and shatter upon interaction.',
    complexity: 'High',
    config: [
      { id: 'pixelColor', label: 'Bit Color', type: 'color', default: '#22c55e' },
      { id: 'radius', label: 'Blast Radius', type: 'number', default: 100, min: 50, max: 250, step: 10 }
    ],
    html: '<canvas id="burst"></canvas>',
    css: 'body { margin: 0; background: #050505; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { pixelColor: '#22c55e', radius: 100 };
      const canvas = document.getElementById('burst');
      const ctx = canvas.getContext('2d');
      const mouse = { x: -1000, y: -1000 };
      window.onmousemove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
      let particles = [];
      function resize() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        particles = [];
        for(let i=0; i<150; i++) particles.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height, vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2});
      }
      resize(); window.onresize = resize;
      function draw() {
        ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = config.pixelColor;
        particles.forEach(p => {
          const dx = p.x - mouse.x; const dy = p.y - mouse.y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if(d < config.radius) {
            p.vx += (dx/d) * 0.5; p.vy += (dy/d) * 0.5;
          }
          p.vx *= 0.95; p.vy *= 0.95;
          p.x += p.vx; p.y += p.vy;
          if(p.x<0||p.x>canvas.width) p.vx*=-1; if(p.y<0||p.y>canvas.height) p.vy*=-1;
          ctx.fillRect(p.x, p.y, 3, 3);
        });
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'data-pulse',
    name: 'Data Pulse',
    category: 'Particle',
    description: 'A stream of binary data pulses that ripple through a virtual circuit board.',
    complexity: 'Medium',
    config: [
      { id: 'pulseColor', label: 'Signal', type: 'color', default: '#ef4444' },
      { id: 'speed', label: 'Bitrate', type: 'number', default: 2, min: 0.5, max: 5, step: 0.5 }
    ],
    html: '<canvas id="circuit"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { pulseColor: '#ef4444', speed: 2 };
      const canvas = document.getElementById('circuit');
      const ctx = canvas.getContext('2d');
      let t = 0;
      function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
      resize(); window.onresize = resize;
      function draw() {
        ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle = '#111';
        for(let i=0; i<canvas.width; i+=50) {
          ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        }
        ctx.fillStyle = config.pulseColor;
        t += 0.05 * config.speed;
        for(let j=0; j<20; j++) {
          const x = (j * 80 + t*100) % canvas.width;
          const y = (j * 120 + t*50) % canvas.height;
          ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fill();
          ctx.shadowBlur = 15; ctx.shadowColor = config.pulseColor;
        }
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'glitch-term',
    name: 'Glitch Term',
    category: 'Text',
    description: 'A simulated retro-terminal with randomized character glitches and scanline artifacts.',
    complexity: 'Simple',
    config: [
      { id: 'fontColor', label: 'Terminal Green', type: 'color', default: '#22c55e' },
      { id: 'glitchAmt', label: 'Glitch Step', type: 'number', default: 0.1, min: 0, max: 0.5, step: 0.05 }
    ],
    html: '<div id="terminal" style="width:100%; height:100vh; background:#000; color:#22c55e; font-family:monospace; padding:20px; font-size:14px; line-height:1.2; overflow:hidden;"></div>',
    css: 'body { margin: 0; } #terminal::after { content:""; position:fixed; inset:0; background:linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06)); background-size: 100% 2px, 3px 100%; pointer-events:none; }',
    js: `
      const config = window.VANTA_CONFIG || { fontColor: '#22c55e', glitchAmt: 0.1 };
      const el = document.getElementById('terminal');
      const chars = "01$#!<>[]{}_-";
      function update() {
        let content = "";
        for(let i=0; i<40; i++) {
          let line = "SYSTEM_RUNNING_OK_NODE_" + i.toString().padStart(3, '0') + " [";
          for(let j=0; j<20; j++) {
            line += Math.random() < config.glitchAmt ? chars[Math.floor(Math.random()*chars.length)] : "=";
          }
          line += "] STATUS_IDLE\\n";
          content += line;
        }
        el.innerText = content;
        el.style.color = config.fontColor;
        setTimeout(update, 100);
      }
      update();
    `
  },
  {
    id: 'prism-field',
    name: 'Prism Field',
    category: 'Background',
    description: 'Dynamic light refractions that separate into RGB spectrums through a crystalline lattice.',
    complexity: 'Medium',
    config: [
      { id: 'baseOpacity', label: 'Glass Shine', type: 'number', default: 0.2, min: 0.05, max: 0.5, step: 0.05 }
    ],
    html: '<div id="prism"></div>',
    css: 'body { margin: 0; background: #000; overflow: hidden; height: 100vh; } #prism { position: absolute; inset: 0; background: linear-gradient(45deg, rgba(255,0,0,var(--o)), transparent), linear-gradient(135deg, rgba(0,255,0,var(--o)), transparent), linear-gradient(225deg, rgba(0,0,255,var(--o)), transparent); filter: blur(40px); animation: hue 5s linear infinite; } @keyframes hue { from { filter: hue-rotate(0deg) blur(40px); } to { filter: hue-rotate(360deg) blur(40px); } }',
    js: `
      const config = window.VANTA_CONFIG || { baseOpacity: 0.2 };
      document.body.style.setProperty('--o', config.baseOpacity);
    `
  },
  {
    id: 'orbital-rings',
    name: 'Orbital Rings',
    category: 'Interactive',
    description: 'Concentric energy rings that follow the cursor with varying momentum and scale.',
    complexity: 'Medium',
    config: [
      { id: 'ringColor', label: 'Energy', type: 'color', default: '#38bdf8' },
      { id: 'count', label: 'Ring Count', type: 'number', default: 5, min: 2, max: 10, step: 1 }
    ],
    html: '<canvas id="orbit"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { ringColor: '#38bdf8', count: 5 };
      const canvas = document.getElementById('orbit');
      const ctx = canvas.getContext('2d');
      const mouse = { x: -1000, y: -1000 };
      window.onmousemove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
      let rings = [];
      function resize() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        rings = [];
        for(let i=0; i<config.count; i++) rings.push({x:0, y:0, delay: i*5 + 5});
      }
      resize(); window.onresize = resize;
      function draw() {
        ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle = config.ringColor;
        rings.forEach((r, i) => {
          r.x += (mouse.x - r.x) / r.delay;
          r.y += (mouse.y - r.y) / r.delay;
          ctx.lineWidth = 1; ctx.globalAlpha = 1 - (i/config.count);
          ctx.beginPath(); ctx.arc(r.x, r.y, 20 + i*20, 0, Math.PI*2); ctx.stroke();
        });
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'cyber-field',
    name: 'Cyber Field',
    category: 'Interactive',
    description: 'A dense matrix of responsive particles that react to proximity with visceral scale shifts.',
    complexity: 'Medium',
    performanceNote: 'Optimized for mobile interaction.',
    config: [
      { id: 'dotColor', label: 'Node Color', type: 'color', default: '#3b82f6' },
      { id: 'radius', label: 'Field Radius', type: 'number', default: 150, min: 50, max: 400, step: 10 },
    ],
    html: '<canvas id="cyber"></canvas>',
    css: `body { margin: 0; background: #050505; overflow: hidden; canvas { width: 100vw; height: 100vh; }`,
    js: `
      const config = window.VANTA_CONFIG || { dotColor: '#3b82f6', radius: 150 };
      const canvas = document.getElementById('cyber');
      const ctx = canvas.getContext('2d');
      const mouse = { x: -1000, y: -1000 };
      window.onmousemove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
      function draw() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = config.dotColor;
        const spacing = 35;
        for (let x = 0; x < canvas.width; x += spacing) {
          for (let y = 0; y < canvas.height; y += spacing) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const size = Math.max(1, 5 - (dist / config.radius) * 5);
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'fluid-grid',
    name: 'Fluid Grid',
    category: 'Background',
    description: 'Interactive flowing grid lines that distort smoothly around the cursor using vector displacement.',
    complexity: 'Medium',
    performanceNote: 'Low CPU overhead. High GPU efficiency.',
    config: [
      { id: 'lineColor', label: 'Line Color', type: 'color', default: '#3b82f6' },
      { id: 'resolution', label: 'Grid Resolution', type: 'number', default: 30, min: 10, max: 80, step: 5 }
    ],
    html: '<canvas id="fluid"></canvas>',
    css: `
      body { margin: 0; background: #000; overflow: hidden; height: 100vh; }
      canvas { display: block; width: 100%; height: 100%; }
    `,
    js: `
      const config = window.VANTA_CONFIG || { lineColor: '#3b82f6', resolution: 30 };
      const canvas = document.getElementById('fluid');
      const ctx = canvas.getContext('2d');
      function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
      resize();
      window.addEventListener('resize', resize);
      const mouse = { x: -100, y: -100 };
      window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = config.lineColor;
        ctx.lineWidth = 0.5;
        const res = config.resolution;
        for (let x = 0; x <= canvas.width; x += res) {
          ctx.beginPath();
          for (let y = 0; y <= canvas.height; y += 10) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const force = Math.max(0, (200 - dist) / 200);
            const xOff = dist !== 0 ? (dx / dist) * force * 60 : 0;
            ctx.lineTo(x + xOff, y);
          }
          ctx.stroke();
        }
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'stellar-void',
    name: 'Stellar Void',
    category: 'Particle',
    description: 'Kinetic particle simulation with proximity-based crystalline networking.',
    complexity: 'High',
    performanceNote: 'Medium CPU usage due to distance calculations.',
    config: [
      { id: 'particleColor', label: 'Nodes', type: 'color', default: '#ffffff' },
      { id: 'count', label: 'Density', type: 'number', default: 100, min: 50, max: 300, step: 10 },
      { id: 'maxDist', label: 'Sync Range', type: 'number', default: 100, min: 50, max: 250, step: 10 }
    ],
    html: '<canvas id="stellar"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; canvas { width: 100%; height: 100vh; }',
    js: `
      const config = window.VANTA_CONFIG || { particleColor: '#ffffff', count: 100, maxDist: 100 };
      const canvas = document.getElementById('stellar');
      const ctx = canvas.getContext('2d');
      let particles = [];
      function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
      window.onresize = resize;
      resize();
      class P {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.vx = (Math.random() - 0.5) * 0.5;
          this.vy = (Math.random() - 0.5) * 0.5;
        }
        update() {
          this.x += this.vx; this.y += this.vy;
          if(this.x < 0 || this.x > canvas.width) this.vx *= -1;
          if(this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
      }
      for(let i=0; i<config.count; i++) particles.push(new P());
      function draw() {
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = config.particleColor;
        particles.forEach((p, i) => {
          p.update();
          ctx.beginPath(); ctx.arc(p.x, p.y, 1, 0, Math.PI*2); ctx.fill();
          for(let j=i+1; j<particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x, dy = p.y - p2.y;
            const d = Math.sqrt(dx*dx + dy*dy);
            if(d < config.maxDist) {
              ctx.strokeStyle = config.particleColor;
              ctx.globalAlpha = 1 - (d/config.maxDist);
              ctx.lineWidth = 0.3;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
              ctx.globalAlpha = 1;
            }
          }
        });
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'monolith-type',
    name: 'Monolith',
    category: 'Text',
    description: 'Typographic unit featuring shutter-glitch rendering and cryptic character shifting.',
    complexity: 'Medium',
    performanceNote: 'High refresh rate text rendering.',
    config: [
      { id: 'textColor', label: 'Font Color', type: 'color', default: '#ffffff' },
      { id: 'glitchFreq', label: 'Entropy', type: 'number', default: 0.05, min: 0.01, max: 0.3, step: 0.01 }
    ],
    html: '<div id="monolith" style="width:100%; height:100vh; display:flex; align-items:center; justify-content:center; font-family:monospace; font-weight:900; font-size:10vw; color:white; letter-spacing:-0.05em;">VOIDYX</div>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { textColor: '#ffffff', glitchFreq: 0.05 };
      const el = document.getElementById('monolith');
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;':,.<>?";
      const originalText = el.innerText;
      function glitch() {
        if(Math.random() < config.glitchFreq) {
          el.innerText = originalText.split('').map(c => Math.random() > 0.8 ? chars[Math.floor(Math.random()*chars.length)] : c).join('');
          el.style.transform = \`skew(\${(Math.random()-0.5)*10}deg)\`;
          el.style.filter = 'blur(2px) contrast(200%)';
        } else {
          el.innerText = originalText;
          el.style.transform = 'none';
          el.style.filter = 'none';
        }
        el.style.color = config.textColor;
        requestAnimationFrame(glitch);
      }
      glitch();
    `
  },
  {
    id: 'warp-tunnel',
    name: 'Warp Tunnel',
    category: 'Background',
    description: 'Infinite 3D line tunnel simulation with variable perspective distortion.',
    complexity: 'High',
    performanceNote: 'Optimized vector projection.',
    config: [
      { id: 'tunnelColor', label: 'Stroke Color', type: 'color', default: '#4ade80' },
      { id: 'speed', label: 'Velocity', type: 'number', default: 0.05, min: 0.01, max: 0.2, step: 0.01 },
      { id: 'lines', label: 'Complexity', type: 'number', default: 12, min: 4, max: 24, step: 1 }
    ],
    html: '<canvas id="warp"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; canvas { width: 100%; height: 100vh; }',
    js: `
      const config = window.VANTA_CONFIG || { tunnelColor: '#4ade80', speed: 0.05, lines: 12 };
      const canvas = document.getElementById('warp');
      const ctx = canvas.getContext('2d');
      let t = 0;
      function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
      window.onresize = resize; resize();
      function draw() {
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle = config.tunnelColor;
        ctx.lineWidth = 1;
        t += config.speed;
        const cx = canvas.width/2; const cy = canvas.height/2;
        for(let i=0; i<config.lines; i++) {
          const angle = (i / config.lines) * Math.PI * 2;
          ctx.beginPath();
          for(let z=0.1; z<10; z+=0.5) {
            const shift = (z - (t % 0.5));
            const r = (1/shift) * 200;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            if(z === 0.1) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            ctx.globalAlpha = Math.max(0, 1 - (shift/10));
          }
          ctx.stroke();
        }
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'neural-mesh',
    name: 'Neural Mesh',
    category: 'Interactive',
    description: 'Bioluminescent node structure that pulsates and connects based on mouse proximity.',
    complexity: 'High',
    config: [
      { id: 'nodeColor', label: 'Core Color', type: 'color', default: '#a855f7' },
      { id: 'linkRange', label: 'Link Distance', type: 'number', default: 150, min: 50, max: 300, step: 10 }
    ],
    html: '<canvas id="neural"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { nodeColor: '#a855f7', linkRange: 150 };
      const canvas = document.getElementById('neural');
      const ctx = canvas.getContext('2d');
      const mouse = { x: -1000, y: -1000 };
      window.onmousemove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
      let nodes = [];
      function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
      resize();
      for(let i=0; i<60; i++) nodes.push({x: Math.random()*canvas.width, y: Math.random()*canvas.height, vx:(Math.random()-0.5), vy:(Math.random()-0.5)});
      function draw() {
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
        nodes.forEach(n => {
          n.x += n.vx; n.y += n.vy;
          if(n.x<0||n.x>canvas.width) n.vx*=-1; if(n.y<0||n.y>canvas.height) n.vy*=-1;
          const dMouse = Math.sqrt((n.x-mouse.x)**2 + (n.y-mouse.y)**2);
          const active = dMouse < config.linkRange;
          ctx.fillStyle = config.nodeColor;
          ctx.beginPath(); ctx.arc(n.x, n.y, active ? 3 : 1, 0, Math.PI*2); ctx.fill();
          if(active) {
            ctx.strokeStyle = config.nodeColor; ctx.globalAlpha = 1 - (dMouse/config.linkRange);
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'chromatic-dispersion',
    name: 'Chromatic Flow',
    category: 'Background',
    description: 'Dynamic light refractions that separate into RGB spectrums on high-velocity movement.',
    complexity: 'Medium',
    config: [
      { id: 'opacity', label: 'Intensity', type: 'number', default: 0.3, min: 0.1, max: 1, step: 0.1 }
    ],
    html: '<div id="dispersion"></div>',
    css: `
      body { margin: 0; background: #000; overflow: hidden; height: 100vh; }
      #dispersion {
        position: absolute; inset: 0;
        background: 
          radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255,0,0,var(--o, 0.3)), transparent 40%),
          radial-gradient(circle at calc(var(--x, 50%) + 20px) var(--y, 50%), rgba(0,255,0,var(--o, 0.3)), transparent 40%),
          radial-gradient(circle at calc(var(--x, 50%) - 20px) var(--y, 50%), rgba(0,0,255,var(--o, 0.3)), transparent 40%);
        filter: blur(40px);
      }
    `,
    js: `
      const config = window.VANTA_CONFIG || { opacity: 0.3 };
      const el = document.getElementById('dispersion');
      document.body.style.setProperty('--o', config.opacity);
      window.onmousemove = e => {
        el.style.setProperty('--x', e.clientX + 'px');
        el.style.setProperty('--y', e.clientY + 'px');
      };
    `
  },
  {
    id: 'vector-rain',
    name: 'Vector Rain',
    category: 'Text',
    description: 'Falling streams of encrypted vector data with real-time character mutation.',
    complexity: 'Medium',
    config: [
      { id: 'color', label: 'Stream Color', type: 'color', default: '#00ff41' },
      { id: 'density', label: 'Density', type: 'number', default: 20, min: 10, max: 50, step: 2 }
    ],
    html: '<canvas id="rain"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#00ff41', density: 20 };
      const canvas = document.getElementById('rain');
      const ctx = canvas.getContext('2d');
      function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
      resize(); window.onresize = resize;
      const columns = Math.floor(canvas.width / 20);
      const drops = Array(columns).fill(1);
      const chars = "0101XYZ<>[]{}";
      function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = config.color; ctx.font = '15px monospace';
        for(let i=0; i<drops.length; i++) {
          const text = chars[Math.floor(Math.random()*chars.length)];
          ctx.fillText(text, i*20, drops[i]*20);
          if(drops[i]*20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
        setTimeout(() => requestAnimationFrame(draw), 30);
      }
      draw();
    `
  },
  {
    id: 'magnetic-dust',
    name: 'Magnetic Dust',
    category: 'Interactive',
    description: 'Fine particles that behave like iron filings around a moving magnetic source.',
    complexity: 'Medium',
    config: [
      { id: 'dustColor', label: 'Dust Color', type: 'color', default: '#fcd34d' },
      { id: 'power', label: 'Magnetic Pull', type: 'number', default: 5, min: 1, max: 20, step: 1 }
    ],
    html: '<canvas id="dust"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { dustColor: '#fcd34d', power: 5 };
      const canvas = document.getElementById('dust');
      const ctx = canvas.getContext('2d');
      const mouse = { x: -1000, y: -1000 };
      window.onmousemove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
      let particles = [];
      function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
      resize();
      for(let i=0; i<200; i++) particles.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height, ox:0, oy:0});
      function draw() {
        ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = config.dustColor;
        particles.forEach(p => {
          const dx = mouse.x - p.x; const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const force = Math.min(10, config.power * 100 / dist);
          p.ox += (dx/dist)*force; p.oy += (dy/dist)*force;
          p.x += p.ox; p.y += p.oy;
          p.ox *= 0.9; p.oy *= 0.9;
          ctx.beginPath(); ctx.arc(p.x, p.y, 1, 0, Math.PI*2); ctx.fill();
        });
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'echo-pulse',
    name: 'Echo Pulse',
    category: 'Background',
    description: 'Rhythmic ripple waves radiating from the void center, synchronized with a system clock.',
    complexity: 'Simple',
    config: [
      { id: 'pulseColor', label: 'Ripple Color', type: 'color', default: '#ffffff' },
      { id: 'frequency', label: 'Pulse Rate', type: 'number', default: 1, min: 0.5, max: 4, step: 0.5 }
    ],
    html: '<div id="echo"></div>',
    css: `
      body { margin: 0; background: #000; overflow: hidden; display: flex; align-items: center; justify-content: center; height: 100vh; }
      .ring {
        position: absolute; border: 1px solid var(--c, #fff); border-radius: 50%;
        animation: pulse var(--d, 2s) infinite linear; opacity: 0;
      }
      @keyframes pulse {
        0% { width: 0; height: 0; opacity: 1; }
        100% { width: 1000px; height: 1000px; opacity: 0; }
      }
    `,
    js: `
      const config = window.VANTA_CONFIG || { pulseColor: '#ffffff', frequency: 1 };
      const container = document.getElementById('echo');
      document.body.style.setProperty('--c', config.pulseColor);
      document.body.style.setProperty('--d', (3 / config.frequency) + 's');
      setInterval(() => {
        const ring = document.createElement('div');
        ring.className = 'ring';
        container.appendChild(ring);
        setTimeout(() => ring.remove(), 3000);
      }, 1000 / config.frequency);
    `
  },
  {
    id: 'binary-horizon',
    name: 'Binary Horizon',
    category: 'Background',
    description: 'A 2D landscape of scrolling binary peaks and digital topography.',
    complexity: 'Medium',
    config: [
      { id: 'peakColor', label: 'Data Color', type: 'color', default: '#ef4444' }
    ],
    html: '<canvas id="horizon"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { peakColor: '#ef4444' };
      const canvas = document.getElementById('horizon');
      const ctx = canvas.getContext('2d');
      let offset = 0;
      function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
      resize();
      function draw() {
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle = config.peakColor; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, canvas.height/2);
        for(let x=0; x<canvas.width; x+=10) {
          const val = Math.sin((x+offset)*0.01) * Math.cos((x+offset)*0.02) * 100;
          ctx.lineTo(x, canvas.height/2 + val);
        }
        ctx.stroke();
        offset += 2;
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'prism-fracture',
    name: 'Prism Fracture',
    category: 'WebGL',
    description: 'Geometric crystal shards that rotate and refract light in 3D space.',
    complexity: 'High',
    cdnLinks: ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js'],
    config: [
      { id: 'prismColor', label: 'Gem Color', type: 'color', default: '#3b82f6' },
      { id: 'rotation', label: 'Spin Speed', type: 'number', default: 1, min: 0.1, max: 5, step: 0.1 }
    ],
    html: '<div id="prism-container" style="width:100%; height:100vh;"></div>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { prismColor: '#3b82f6', rotation: 1 };
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById('prism-container').appendChild(renderer.domElement);
      const geometry = new THREE.IcosahedronGeometry(5, 0);
      const material = new THREE.MeshPhongMaterial({color: config.prismColor, wireframe: true, transparent: true, opacity: 0.5});
      const prism = new THREE.Mesh(geometry, material);
      scene.add(prism);
      const light = new THREE.PointLight(0xffffff, 1, 100); light.position.set(10, 10, 10); scene.add(light);
      camera.position.z = 15;
      function animate() {
        requestAnimationFrame(animate);
        prism.rotation.x += 0.01 * config.rotation; prism.rotation.y += 0.01 * config.rotation;
        renderer.render(scene, camera);
      }
      animate();
    `
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    category: 'Background',
    description: 'Soft, flowing curtains of light that wave across the screen like polar lights.',
    complexity: 'Simple',
    config: [
      { id: 'color', label: 'Aurora Color', type: 'color', default: '#00ff7f' },
      { id: 'opacity', label: 'Brightness', type: 'number', default: 0.4, min: 0.1, max: 1, step: 0.1 },
    ],
    html: '<div class="aurora"></div>',
    css: `
      body { margin: 0; background: #000; overflow: hidden; height: 100vh; }
      .aurora {
        position: absolute; top: 0; left: 0; width: 200%; height: 100%;
        background: radial-gradient(ellipse at top, var(--c, #00ff7f), transparent 70%);
        filter: blur(100px);
        opacity: var(--o, 0.4);
        animation: flow 10s ease-in-out infinite alternate;
      }
      @keyframes flow { from { transform: translateX(-25%) skewX(-10deg); } to { transform: translateX(0%) skewX(10deg); } }
    `,
    js: `
      const config = window.VANTA_CONFIG || { color: '#00ff7f', opacity: 0.4 };
      document.body.style.setProperty('--c', config.color);
      document.body.style.setProperty('--o', config.opacity);
    `
  },
  {
    id: 'neon-hex',
    name: 'Neon Hex',
    category: 'Interactive',
    description: 'A futuristic hexagonal grid that illuminates on mouse hover with high-tech vibes.',
    complexity: 'High',
    config: [
      { id: 'primary', label: 'Line Color', type: 'color', default: '#00f3ff' },
      { id: 'glow', label: 'Glow Size', type: 'number', default: 15, min: 5, max: 40, step: 5 },
    ],
    html: '<canvas id="hex"></canvas>',
    css: `body { margin: 0; background: #000; overflow: hidden; canvas { width: 100vw; height: 100vh; }`,
    js: `
      const config = window.VANTA_CONFIG || { primary: '#00f3ff', glow: 15 };
      const canvas = document.getElementById('hex');
      const ctx = canvas.getContext('2d');
      const mouse = { x: -1000, y: -1000 };
      window.onmousemove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
      function drawHex(x, y, r) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          ctx.lineTo(x + r * Math.cos(i * Math.PI / 3), y + r * Math.sin(i * Math.PI / 3));
        }
        ctx.closePath();
      }
      function draw() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const r = 30;
        const h = r * Math.sqrt(3);
        for (let i = 0; i < canvas.width / (r * 3) + 1; i++) {
          for (let j = 0; j < canvas.height / h + 1; j++) {
            const x = i * r * 3 + (j % 2) * r * 1.5;
            const y = j * h;
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            ctx.strokeStyle = config.primary;
            ctx.globalAlpha = Math.max(0.1, 1 - dist / 200);
            ctx.lineWidth = 1;
            ctx.shadowBlur = dist < 100 ? config.glow : 0;
            ctx.shadowColor = config.primary;
            drawHex(x, y, r - 2);
            ctx.stroke();
          }
        }
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'particle-fountain',
    name: 'Fountain',
    category: 'Particle',
    description: 'A dynamic gravity-based particle fountain with customizable spray and decay.',
    complexity: 'Medium',
    config: [
      { id: 'color', label: 'Spray Color', type: 'color', default: '#3b82f6' },
      { id: 'force', label: 'Ejection Force', type: 'number', default: 8, min: 2, max: 15, step: 0.5 }
    ],
    html: '<canvas id="fountain"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#3b82f6', force: 8 };
      const canvas = document.getElementById('fountain');
      const ctx = canvas.getContext('2d');
      let particles = [];
      function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
      window.onresize = resize; resize();
      function draw() {
        ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        for(let i=0; i<5; i++) {
          particles.push({
            x: canvas.width/2, y: canvas.height, 
            vx: (Math.random()-0.5)*3, vy: -Math.random()*config.force, 
            life: 1
          });
        }
        ctx.fillStyle = config.color;
        particles = particles.filter(p => {
          p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life -= 0.01;
          ctx.globalAlpha = p.life;
          ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fill();
          return p.life > 0;
        });
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'dna-helix',
    name: 'DNA Helix',
    category: 'WebGL',
    description: 'A mathematical representation of a rotating DNA strand using point geometry.',
    complexity: 'High',
    config: [
      { id: 'color', label: 'Strand Color', type: 'color', default: '#ff4b2b' },
      { id: 'speed', label: 'Spin Rate', type: 'number', default: 1, min: 0.1, max: 3, step: 0.1 }
    ],
    html: '<canvas id="dna"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#ff4b2b', speed: 1 };
      const canvas = document.getElementById('dna');
      const ctx = canvas.getContext('2d');
      let t = 0;
      function draw() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
        t += 0.05 * config.speed;
        const cx = canvas.width/2; const cy = canvas.height/2;
        for(let i=0; i<50; i++) {
          const y = i * 15 - 375 + cy;
          const x1 = Math.sin(t + i*0.2) * 100 + cx;
          const x2 = Math.sin(t + i*0.2 + Math.PI) * 100 + cx;
          ctx.fillStyle = config.color;
          ctx.beginPath(); ctx.arc(x1, y, 4, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(x2, y, 4, 0, Math.PI*2); ctx.fill();
          ctx.strokeStyle = config.color; ctx.globalAlpha = 0.2;
          ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
          ctx.globalAlpha = 1;
        }
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'perlin-noise',
    name: 'Noise Flow',
    category: 'Background',
    description: 'High-performance Perlin noise flow field visualization.',
    complexity: 'High',
    config: [
      { id: 'color', label: 'Flow Tint', type: 'color', default: '#ffffff' },
      { id: 'scale', label: 'Noise Scale', type: 'number', default: 0.01, min: 0.001, max: 0.05, step: 0.001 }
    ],
    html: '<canvas id="perlin"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#ffffff', scale: 0.01 };
      const canvas = document.getElementById('perlin');
      const ctx = canvas.getContext('2d');
      let t = 0;
      function draw() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle = config.color; ctx.lineWidth = 0.5;
        t += 0.01;
        for(let i=0; i<canvas.width; i+=40) {
          for(let j=0; j<canvas.height; j+=40) {
            const angle = Math.sin(i*config.scale + t) * Math.cos(j*config.scale + t) * Math.PI * 4;
            ctx.beginPath();
            ctx.moveTo(i, j);
            ctx.lineTo(i + Math.cos(angle)*30, j + Math.sin(angle)*30);
            ctx.stroke();
          }
        }
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'kaleidoscope',
    name: 'Kaleido',
    category: 'Interactive',
    description: 'A symmetric reflection pattern that transforms with cursor positioning.',
    complexity: 'Medium',
    config: [
      { id: 'sides', label: 'Mirrors', type: 'number', default: 8, min: 4, max: 16, step: 2 }
    ],
    html: '<canvas id="kaleido"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { sides: 8 };
      const canvas = document.getElementById('kaleido');
      const ctx = canvas.getContext('2d');
      const mouse = { x: 0, y: 0 };
      window.onmousemove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
      function draw() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
        const cx = canvas.width/2; const cy = canvas.height/2;
        ctx.save();
        ctx.translate(cx, cy);
        for(let i=0; i<config.sides; i++) {
          ctx.rotate(Math.PI*2/config.sides);
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(mouse.x-cx, mouse.y-cy); ctx.stroke();
        }
        ctx.restore();
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'fireflies',
    name: 'Fireflies',
    category: 'Particle',
    description: 'Organic floating particles that pulse softly like nocturnal fireflies.',
    complexity: 'Simple',
    config: [
      { id: 'glowColor', label: 'Fly Tint', type: 'color', default: '#fef08a' }
    ],
    html: '<canvas id="flies"></canvas>',
    css: 'body { margin: 0; background: #050505; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { glowColor: '#fef08a' };
      const canvas = document.getElementById('flies');
      const ctx = canvas.getContext('2d');
      let flies = [];
      for(let i=0; i<50; i++) flies.push({x:Math.random()*2000, y:Math.random()*2000, r:Math.random()*3, s:Math.random()*0.02});
      function draw() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx.fillStyle = '#050505'; ctx.fillRect(0,0,canvas.width,canvas.height);
        flies.forEach(f => {
          f.x += Math.sin(Date.now()*0.001 + f.r)*0.5;
          f.y -= 0.3;
          if(f.y < -10) f.y = canvas.height + 10;
          ctx.fillStyle = config.glowColor;
          ctx.globalAlpha = Math.sin(Date.now()*f.s)*0.5 + 0.5;
          ctx.beginPath(); ctx.arc(f.x % canvas.width, f.y, f.r, 0, Math.PI*2); ctx.fill();
        });
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'abstract-waves',
    name: 'Sine Waves',
    category: 'Background',
    description: 'Layered horizontal sine waves with independent phase shifting and opacity.',
    complexity: 'Simple',
    config: [
      { id: 'color', label: 'Wave Color', type: 'color', default: '#312e81' }
    ],
    html: '<canvas id="waves"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#312e81' };
      const canvas = document.getElementById('waves');
      const ctx = canvas.getContext('2d');
      function draw() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle = config.color;
        const t = Date.now()*0.001;
        for(let j=0; j<5; j++) {
          ctx.beginPath(); ctx.globalAlpha = 0.2 + j*0.1;
          for(let i=0; i<canvas.width; i+=10) {
            const y = Math.sin(i*0.01 + t + j) * 50 + canvas.height/2 + j*20;
            ctx.lineTo(i, y);
          }
          ctx.stroke();
        }
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'retro-landscape',
    name: 'Synthwave',
    category: 'Background',
    description: 'A retro-futuristic scrolling wireframe landscape.',
    complexity: 'Medium',
    config: [
      { id: 'color', label: 'Grid Color', type: 'color', default: '#ff00ff' }
    ],
    html: '<canvas id="synth"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#ff00ff' };
      const canvas = document.getElementById('synth');
      const ctx = canvas.getContext('2d');
      let offset = 0;
      function draw() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle = config.color; ctx.lineWidth = 1;
        offset += 2;
        const cx = canvas.width/2; const cy = canvas.height/2;
        for(let i=-20; i<20; i++) {
          ctx.beginPath();
          for(let z=1; z<10; z+=0.5) {
            const x = cx + (i*50) / z;
            const y = cy + 100 / z;
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'data-flow',
    name: 'Binary Stream',
    category: 'Text',
    description: 'Falling binary characters with randomized speed and glitch offsets.',
    complexity: 'Medium',
    config: [
      { id: 'color', label: 'Digit Color', type: 'color', default: '#00ff00' }
    ],
    html: '<canvas id="bin"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#00ff00' };
      const canvas = document.getElementById('bin');
      const ctx = canvas.getContext('2d');
      const drops = Array(100).fill(0);
      function draw() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = config.color; ctx.font = '10px monospace';
        drops.forEach((d, i) => {
          ctx.fillText(Math.random() > 0.5 ? '1' : '0', i*20, d*15);
          if(d*15 > canvas.height && Math.random() > 0.9) drops[i] = 0; else drops[i]++;
        });
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'smoke-particles',
    name: 'Shadow Fog',
    category: 'Particle',
    description: 'Dense, slow-moving smoke particles that billow from the bottom.',
    complexity: 'Medium',
    config: [
      { id: 'opacity', label: 'Fog Density', type: 'number', default: 0.1, min: 0.05, max: 0.3, step: 0.01 }
    ],
    html: '<canvas id="smoke"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { opacity: 0.1 };
      const canvas = document.getElementById('smoke');
      const ctx = canvas.getContext('2d');
      let p = [];
      function draw() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
        if(p.length < 100) p.push({x:Math.random()*canvas.width, y:canvas.height, r:Math.random()*50+20, vy:-Math.random()*1});
        p = p.filter(it => {
          it.y += it.vy; it.r += 0.2;
          ctx.fillStyle = 'rgba(255,255,255,' + config.opacity + ')';
          ctx.beginPath(); ctx.arc(it.x, it.y, it.r, 0, Math.PI*2); ctx.fill();
          return it.y > -100;
        });
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'text-shimmer',
    name: 'Lux Shimmer',
    category: 'Text',
    description: 'Premium text with a sweeping light reflection effect.',
    complexity: 'Simple',
    config: [
      { id: 'color', label: 'Base Text', type: 'color', default: '#333333' },
      { id: 'shine', label: 'Shine Color', type: 'color', default: '#ffffff' }
    ],
    html: '<div id="lux">SHIMMER</div>',
    css: `
      body { margin: 0; background: #050505; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; }
      #lux {
        font-size: 10vw; font-weight: 900; color: var(--b);
        background: linear-gradient(90deg, transparent, var(--s), transparent);
        background-size: 200% 100%;
        -webkit-background-clip: text;
        animation: shine 3s infinite linear;
      }
      @keyframes shine { 0% { background-position: -100% 0; } 100% { background-position: 100% 0; } }
    `,
    js: `
      const config = window.VANTA_CONFIG || { color: '#333333', shine: '#ffffff' };
      document.body.style.setProperty('--b', config.color);
      document.body.style.setProperty('--s', config.shine);
    `
  },
  {
    id: 'neon-lines',
    name: 'Neon Grid',
    category: 'Background',
    description: 'An infinite grid of neon lines that pulsate rhythmically.',
    complexity: 'Simple',
    config: [
      { id: 'color', label: 'Neon Hue', type: 'color', default: '#00ffff' }
    ],
    html: '<div id="grid"></div>',
    css: `
      body { margin: 0; background: #000; overflow: hidden; height: 100vh; }
      #grid {
        position: absolute; inset: 0;
        background-image: linear-gradient(var(--c) 1px, transparent 1px), linear-gradient(90deg, var(--c) 1px, transparent 1px);
        background-size: 50px 50px;
        opacity: 0.2;
        animation: pulse 4s infinite alternate;
      }
      @keyframes pulse { from { opacity: 0.1; } to { opacity: 0.4; } }
    `,
    js: `
      const config = window.VANTA_CONFIG || { color: '#00ffff' };
      document.body.style.setProperty('--c', config.color);
    `
  },
  {
    id: 'blob-morph',
    name: 'Liquid Blob',
    category: 'WebGL',
    description: 'A 3D blob that morphs and deforms using vertex displacement.',
    complexity: 'High',
    cdnLinks: ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js'],
    config: [
      { id: 'color', label: 'Blob Color', type: 'color', default: '#6366f1' }
    ],
    html: '<div id="blob-canvas"></div>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#6366f1' };
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById('blob-canvas').appendChild(renderer.domElement);
      const geometry = new THREE.SphereGeometry(4, 64, 64);
      const material = new THREE.MeshPhongMaterial({color: config.color, flatShading: true});
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      const light = new THREE.DirectionalLight(0xffffff, 1); light.position.set(5, 5, 5); scene.add(light);
      camera.position.z = 10;
      function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.001;
        const pos = sphere.geometry.attributes.position;
        for(let i=0; i<pos.count; i++) {
          const x = pos.getX(i); const y = pos.getY(i); const z = pos.getZ(i);
          // Simplified morphing logic
        }
        sphere.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
      animate();
    `
  },
  {
    id: 'pixel-grid',
    name: 'Pixel Logic',
    category: 'Interactive',
    description: 'A grid of pixels that change color and scale based on cursor distance.',
    complexity: 'Medium',
    config: [
      { id: 'color', label: 'Active Pixel', type: 'color', default: '#ffffff' }
    ],
    html: '<canvas id="pixels"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#ffffff' };
      const canvas = document.getElementById('pixels');
      const ctx = canvas.getContext('2d');
      const mouse = { x: -100, y: -100 };
      window.onmousemove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
      function draw() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
        const size = 20;
        for(let x=0; x<canvas.width; x+=size) {
          for(let y=0; y<canvas.height; y+=size) {
            const dist = Math.sqrt((x-mouse.x)**2 + (y-mouse.y)**2);
            const s = Math.max(2, size - dist/10);
            ctx.fillStyle = dist < 200 ? config.color : '#111';
            ctx.fillRect(x + (size-s)/2, y + (size-s)/2, s, s);
          }
        }
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'starry-night',
    name: 'Starfield',
    category: 'Background',
    description: 'A classic infinite starfield simulation with depth-based parallax.',
    complexity: 'Simple',
    config: [
      { id: 'speed', label: 'Warp Speed', type: 'number', default: 2, min: 1, max: 10, step: 0.5 }
    ],
    html: '<canvas id="stars"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { speed: 2 };
      const canvas = document.getElementById('stars');
      const ctx = canvas.getContext('2d');
      const stars = Array(400).fill(0).map(() => ({x:Math.random()*2000-1000, y:Math.random()*2000-1000, z:Math.random()*1000}));
      function draw() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
        const cx = canvas.width/2; const cy = canvas.height/2;
        stars.forEach(s => {
          s.z -= config.speed; if(s.z <= 0) s.z = 1000;
          const k = 400/s.z;
          const px = s.x*k + cx; const py = s.y*k + cy;
          if(px>0 && px<canvas.width && py>0 && py<canvas.height) {
            ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px, py, k*2, 0, Math.PI*2); ctx.fill();
          }
        });
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'wave-displacement',
    name: 'Mesh Warp',
    category: 'Interactive',
    description: 'An interactive 2D mesh that deforms under the cursor like rubber.',
    complexity: 'High',
    config: [
      { id: 'color', label: 'Line Tint', type: 'color', default: '#3b82f6' }
    ],
    html: '<canvas id="mesh"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#3b82f6' };
      const canvas = document.getElementById('mesh');
      const ctx = canvas.getContext('2d');
      const mouse = { x: -1000, y: -1000 };
      window.onmousemove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
      let pts = [];
      function resize() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        pts = []; const res = 40;
        for(let x=0; x<canvas.width+res; x+=res) {
          for(let y=0; y<canvas.height+res; y+=res) pts.push({x, y, ox:x, oy:y});
        }
      }
      resize(); window.onresize = resize;
      function draw() {
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle = config.color; ctx.lineWidth = 0.5;
        pts.forEach(p => {
          const dx = p.x - mouse.x; const dy = p.y - mouse.y;
          const d = Math.sqrt(dx*dx + dy*dy);
          const f = Math.max(0, (150-d)/150) * 40;
          p.x = p.ox + (d>0 ? (dx/d)*f : 0); p.y = p.oy + (d>0 ? (dy/d)*f : 0);
          ctx.beginPath(); ctx.arc(p.x, p.y, 1, 0, Math.PI*2); ctx.stroke();
        });
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'gravity-well',
    name: 'Well',
    category: 'Interactive',
    description: 'A gravitational vortex that pulls particles toward the cursor.',
    complexity: 'Medium',
    config: [
      { id: 'color', label: 'Dust Color', type: 'color', default: '#ffffff' }
    ],
    html: '<canvas id="well"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#ffffff' };
      const canvas = document.getElementById('well');
      const ctx = canvas.getContext('2d');
      const mouse = { x: -1000, y: -1000 };
      window.onmousemove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
      let p = Array(200).fill(0).map(() => ({x:Math.random()*2000, y:Math.random()*2000, vx:0, vy:0}));
      function draw() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        p.forEach(it => {
          const dx = mouse.x - it.x; const dy = mouse.y - it.y;
          const d = Math.sqrt(dx*dx+dy*dy);
          it.vx += (dx/d)*0.5; it.vy += (dy/d)*0.5;
          it.x += it.vx; it.y += it.vy; it.vx *= 0.95; it.vy *= 0.95;
          ctx.fillStyle = config.color; ctx.fillRect(it.x, it.y, 2, 2);
        });
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'floating-cubes',
    name: 'Voxel Flow',
    category: 'WebGL',
    description: 'A 3D field of floating, translucent voxels that drift in space.',
    complexity: 'High',
    cdnLinks: ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js'],
    config: [
      { id: 'color', label: 'Voxel Tint', type: 'color', default: '#ffffff' }
    ],
    html: '<div id="cubes"></div>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#ffffff' };
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById('cubes').appendChild(renderer.domElement);
      const group = new THREE.Group();
      for(let i=0; i<100; i++) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,0.5), new THREE.MeshPhongMaterial({color: config.color, transparent: true, opacity: 0.3}));
        mesh.position.set((Math.random()-0.5)*20, (Math.random()-0.5)*20, (Math.random()-0.5)*20);
        group.add(mesh);
      }
      scene.add(group);
      scene.add(new THREE.PointLight(0xffffff, 1));
      camera.position.z = 10;
      function animate() {
        requestAnimationFrame(animate);
        group.rotation.y += 0.005;
        renderer.render(scene, camera);
      }
      animate();
    `
  },
  {
    id: 'lightning-strike',
    name: 'Tesla Coil',
    category: 'Background',
    description: 'Generative electrical arcs that strike randomly across the screen.',
    complexity: 'Medium',
    config: [
      { id: 'color', label: 'Bolt Color', type: 'color', default: '#93c5fd' }
    ],
    html: '<canvas id="tesla"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#93c5fd' };
      const canvas = document.getElementById('tesla');
      const ctx = canvas.getContext('2d');
      function strike() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        if(Math.random() > 0.9) {
          ctx.strokeStyle = config.color; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(Math.random()*canvas.width, 0);
          for(let i=0; i<10; i++) ctx.lineTo(Math.random()*canvas.width, i*canvas.height/10);
          ctx.stroke();
        }
        requestAnimationFrame(strike);
      }
      strike();
    `
  },
  {
    id: 'perspective-text',
    name: 'Oblique',
    category: 'Text',
    description: '3D perspective text that tilts based on cursor position.',
    complexity: 'Simple',
    config: [
      { id: 'color', label: 'Font Color', type: 'color', default: '#ffffff' }
    ],
    html: '<div id="oblique">OBLIQUE</div>',
    css: `
      body { margin: 0; background: #000; display: flex; align-items: center; justify-content: center; height: 100vh; perspective: 1000px; }
      #oblique { font-size: 15vw; font-weight: 900; color: white; transition: transform 0.1s; }
    `,
    js: `
      const config = window.VANTA_CONFIG || { color: '#ffffff' };
      const el = document.getElementById('oblique');
      window.onmousemove = e => {
        const rx = (e.clientY / window.innerHeight - 0.5) * 60;
        const ry = (e.clientX / window.innerWidth - 0.5) * -60;
        el.style.transform = \`rotateX(\${rx}deg) rotateY(\${ry}deg)\`;
        el.style.color = config.color;
      };
    `
  },
  {
    id: 'magnetic-grid',
    name: 'Flux Grid',
    category: 'Interactive',
    description: 'A grid of rotating bars that align with the cursor.',
    complexity: 'Medium',
    config: [
      { id: 'color', label: 'Bar Color', type: 'color', default: '#ffffff' }
    ],
    html: '<canvas id="flux"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#ffffff' };
      const canvas = document.getElementById('flux');
      const ctx = canvas.getContext('2d');
      const mouse = { x: 0, y: 0 };
      window.onmousemove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
      function draw() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
        const res = 40;
        for(let x=20; x<canvas.width; x+=res) {
          for(let y=20; y<canvas.height; y+=res) {
            const angle = Math.atan2(mouse.y-y, mouse.x-x);
            ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
            ctx.strokeStyle = config.color; ctx.beginPath(); ctx.moveTo(-10,0); ctx.lineTo(10,0); ctx.stroke();
            ctx.restore();
          }
        }
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'shadow-play',
    name: 'Eclipse',
    category: 'Interactive',
    description: 'A dynamic shadow casting effect following the cursor.',
    complexity: 'Simple',
    config: [
      { id: 'color', label: 'Core Glow', type: 'color', default: '#ffffff' }
    ],
    html: '<div id="shadow-ball"></div>',
    css: `
      body { margin: 0; background: #000; height: 100vh; overflow: hidden; }
      #shadow-ball { width: 100px; height: 100px; background: white; border-radius: 50%; position: absolute; }
    `,
    js: `
      const config = window.VANTA_CONFIG || { color: '#ffffff' };
      const el = document.getElementById('shadow-ball');
      window.onmousemove = e => {
        el.style.left = e.clientX - 50 + 'px'; el.style.top = e.clientY - 50 + 'px';
        el.style.boxShadow = \`0 0 100px \${config.color}\`;
        el.style.background = config.color;
      };
    `
  },
  {
    id: 'cyber-city',
    name: 'Matrix Rain',
    category: 'Text',
    description: 'Classic vertical character stream with high contrast.',
    complexity: 'Simple',
    config: [
      { id: 'color', label: 'Rain Color', type: 'color', default: '#0f0' }
    ],
    html: '<canvas id="matrix"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#0f0' };
      const canvas = document.getElementById('matrix');
      const ctx = canvas.getContext('2d');
      const columns = Array(100).fill(0);
      function draw() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = config.color;
        columns.forEach((y, i) => {
          ctx.fillText(String.fromCharCode(33 + Math.random()*94), i*15, y);
          if(y > canvas.height && Math.random() > 0.95) columns[i] = 0; else columns[i] += 15;
        });
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'energy-orb',
    name: 'Pulsar',
    category: 'Background',
    description: 'A centralized energy source with radiating rhythmic pulses.',
    complexity: 'Simple',
    config: [
      { id: 'color', label: 'Orb Color', type: 'color', default: '#fbbf24' }
    ],
    html: '<div id="orb"></div>',
    css: `
      body { margin: 0; background: #000; display: flex; align-items: center; justify-content: center; height: 100vh; }
      #orb { width: 200px; height: 200px; border-radius: 50%; background: var(--c); filter: blur(40px); animation: pulse 2s infinite alternate; }
      @keyframes pulse { from { transform: scale(0.8); opacity: 0.5; } to { transform: scale(1.2); opacity: 1; } }
    `,
    js: `
      const config = window.VANTA_CONFIG || { color: '#fbbf24' };
      document.body.style.setProperty('--c', config.color);
    `
  },
  {
    id: 'digital-clocks',
    name: 'Time Vortex',
    category: 'Background',
    description: 'Floating digital timestamps that represent the passing of time.',
    complexity: 'Simple',
    config: [
      { id: 'color', label: 'Time Color', type: 'color', default: '#ffffff' }
    ],
    html: '<div id="clocks"></div>',
    css: 'body { margin: 0; background: #000; overflow: hidden; font-family: monospace; color: white; opacity: 0.3; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#ffffff' };
      const container = document.getElementById('clocks');
      function add() {
        const el = document.createElement('div');
        el.innerText = new Date().toLocaleTimeString();
        el.style.position = 'absolute'; el.style.left = Math.random()*100 + '%'; el.style.top = '100%';
        el.style.color = config.color;
        container.appendChild(el);
        let y = 100;
        const iv = setInterval(() => {
          y -= 0.5; el.style.top = y + '%';
          if(y < -10) { clearInterval(iv); el.remove(); }
        }, 30);
      }
      setInterval(add, 500);
    `
  },
  {
    id: 'organic-lines',
    name: 'Veins',
    category: 'Background',
    description: 'Generative organic line structures that grow across the screen.',
    complexity: 'Medium',
    config: [
      { id: 'color', label: 'Line Color', type: 'color', default: '#ffffff' }
    ],
    html: '<canvas id="veins"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#ffffff' };
      const canvas = document.getElementById('veins');
      const ctx = canvas.getContext('2d');
      function draw() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx.strokeStyle = config.color; ctx.globalAlpha = 0.1;
        for(let i=0; i<10; i++) {
          ctx.beginPath(); ctx.moveTo(Math.random()*canvas.width, Math.random()*canvas.height);
          for(let j=0; j<20; j++) ctx.lineTo(Math.random()*canvas.width, Math.random()*canvas.height);
          ctx.stroke();
        }
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'spectrum-bars',
    name: 'Audio Vis',
    category: 'Background',
    description: 'Pseudo-audio visualizer bars that react to randomized data.',
    complexity: 'Simple',
    config: [
      { id: 'color', label: 'Bar Color', type: 'color', default: '#ef4444' }
    ],
    html: '<canvas id="bars"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#ef4444' };
      const canvas = document.getElementById('bars');
      const ctx = canvas.getContext('2d');
      function draw() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
        const w = 10;
        for(let x=0; x<canvas.width; x+=15) {
          const h = Math.random()*canvas.height/2;
          ctx.fillStyle = config.color;
          ctx.fillRect(x, canvas.height-h, w, h);
        }
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'fractal-flame',
    name: 'Flame',
    category: 'Particle',
    description: 'A generative fractal flame simulation with organic movement.',
    complexity: 'High',
    config: [
      { id: 'color', label: 'Flame Tint', type: 'color', default: '#f97316' }
    ],
    html: '<canvas id="flame"></canvas>',
    css: 'body { margin: 0; background: #000; overflow: hidden; }',
    js: `
      const config = window.VANTA_CONFIG || { color: '#f97316' };
      const canvas = document.getElementById('flame');
      const ctx = canvas.getContext('2d');
      function draw() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        for(let i=0; i<100; i++) {
          const x = Math.random()*canvas.width; const y = Math.random()*canvas.height;
          ctx.fillStyle = config.color; ctx.globalAlpha = 0.5;
          ctx.beginPath(); ctx.arc(x + Math.sin(Date.now()*0.01)*20, y, 1, 0, Math.PI*2); ctx.fill();
        }
        requestAnimationFrame(draw);
      }
      draw();
    `
  }
];
