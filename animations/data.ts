
import { AnimationEntry } from '../types';

export const ANIMATIONS: AnimationEntry[] = [
  {
    id: 'vanta-birds',
    name: 'Vanta Birds',
    category: 'WebGL',
    description: 'A beautiful flocking simulation inspired by boids. Highly customizable and performance-optimized.',
    complexity: 'High',
    cdnLinks: ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js'],
    config: [
      { id: 'backgroundColor', label: 'Background', type: 'color', default: '#050505' },
      { id: 'color1', label: 'Bird Color 1', type: 'color', default: '#ff0000' },
      { id: 'color2', label: 'Bird Color 2', type: 'color', default: '#00d1ff' },
      { id: 'quantity', label: 'Quantity', type: 'number', default: 5, min: 1, max: 10, step: 1 },
      { id: 'birdSize', label: 'Bird Size', type: 'number', default: 1.5, min: 0.5, max: 4, step: 0.1 },
      { id: 'speedLimit', label: 'Speed Limit', type: 'number', default: 3, min: 1, max: 10, step: 0.5 },
    ],
    html: '<div id="vanta-canvas" style="width:100%; height:100vh;"></div>',
    css: `body { margin: 0; padding: 0; overflow: hidden; background: #000; }`,
    js: `
      const config = window.VANTA_CONFIG || { backgroundColor: '#050505', color1: '#ff0000', color2: '#00d1ff', quantity: 5, birdSize: 1.5, speedLimit: 3 };
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(new THREE.Color(config.backgroundColor));
      document.getElementById('vanta-canvas').appendChild(renderer.domElement);
      const birds = [];
      const birdGroup = new THREE.Group();
      scene.add(birdGroup);
      function createBird() {
        const geometry = new THREE.ConeGeometry(0.2 * config.birdSize, 0.5 * config.birdSize, 3);
        const material = new THREE.MeshPhongMaterial({ color: Math.random() > 0.5 ? config.color1 : config.color2, flatShading: true });
        const bird = new THREE.Mesh(geometry, material);
        bird.rotation.x = Math.PI / 2;
        return { mesh: bird, velocity: new THREE.Vector3((Math.random()-0.5)*0.1, (Math.random()-0.5)*0.1, (Math.random()-0.5)*0.1), position: new THREE.Vector3((Math.random()-0.5)*10, (Math.random()-0.5)*10, (Math.random()-0.5)*10) };
      }
      for(let i=0; i<config.quantity * 20; i++) { const b = createBird(); birds.push(b); birdGroup.add(b.mesh); }
      const light = new THREE.DirectionalLight(0xffffff, 1); light.position.set(1, 1, 2); scene.add(light); scene.add(new THREE.AmbientLight(0x404040));
      camera.position.z = 15;
      function animate() {
        requestAnimationFrame(animate);
        birds.forEach(b => {
          b.position.add(b.velocity.clone().multiplyScalar(config.speedLimit * 0.1));
          if (Math.abs(b.position.x) > 15) b.velocity.x *= -1;
          if (Math.abs(b.position.y) > 10) b.velocity.y *= -1;
          if (Math.abs(b.position.z) > 10) b.velocity.z *= -1;
          b.mesh.position.copy(b.position); b.mesh.lookAt(b.position.clone().add(b.velocity)); b.mesh.rotateX(Math.PI/2);
        });
        birdGroup.rotation.y += 0.002; renderer.render(scene, camera);
      }
      window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
      animate();
    `
  },
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
    css: `body { margin: 0; background: #000; overflow: hidden; } canvas { width: 100vw; height: 100vh; display: block; }`,
    js: `
      const config = window.VANTA_CONFIG || { color1: '#ff00ff', color2: '#00ffff', speed: 1 };
      const canvas = document.getElementById('plasma');
      const ctx = canvas.getContext('2d');
      let time = 0;
      function draw() {
        const w = canvas.width = window.innerWidth;
        const h = canvas.height = window.innerHeight;
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;
        time += 0.01 * config.speed;
        for (let y = 0; y < h; y += 4) {
          for (let x = 0; x < w; x += 4) {
            const v = Math.sin(x / 50 + time) + Math.sin(y / 50 + time) + Math.sin((x + y) / 50 + time);
            const r = (Math.sin(v) * 127 + 128);
            const g = (Math.cos(v) * 127 + 128);
            const b = 200;
            ctx.fillStyle = \`rgb(\${r},\${g},\${b})\`;
            ctx.fillRect(x, y, 4, 4);
          }
        }
        requestAnimationFrame(draw);
      }
      draw();
    `
  },
  {
    id: 'cyber-field',
    name: 'Cyber Field',
    category: 'Interactive',
    description: 'A dense matrix of dots that pulse and shift based on mouse proximity.',
    complexity: 'Medium',
    config: [
      { id: 'dotColor', label: 'Dot Color', type: 'color', default: '#3b82f6' },
      { id: 'radius', label: 'Interaction', type: 'number', default: 150, min: 50, max: 400, step: 10 },
    ],
    html: '<canvas id="cyber"></canvas>',
    css: `body { margin: 0; background: #050505; overflow: hidden; } canvas { width: 100vw; height: 100vh; }`,
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
        const spacing = 30;
        for (let x = 0; x < canvas.width; x += spacing) {
          for (let y = 0; y < canvas.height; y += spacing) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const size = Math.max(1, 4 - (dist / config.radius) * 4);
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
  description: 'Interactive flowing grid lines that distort smoothly around the cursor.',
  complexity: 'Medium',
  config: [
    { id: 'lineColor', label: 'Line Color', type: 'color', default: '#ffffff' },
    { id: 'resolution', label: 'Grid Resolution', type: 'number', default: 30, min: 10, max: 80, step: 5 }
  ],
  html: '<canvas id="fluid"></canvas>',
  css: `
    body {
      margin: 0;
      background: #000;
      overflow: hidden;
      height: 100vh;
    }

    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
  js: `
    const config = window.VANTA_CONFIG || { lineColor: '#ffffff', resolution: 30 };

    const canvas = document.getElementById('fluid');
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    const mouse = { x: -100, y: -100 };
    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = config.lineColor;
      ctx.lineWidth = 0.5;

      const res = config.resolution;

      for (let x = 0; x <= canvas.width; x += res) {
        ctx.beginPath();

        for (let y = 0; y <= canvas.height; y += 5) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const force = Math.max(0, (150 - dist) / 150);
          const xOff = dist !== 0 ? (dx / dist) * force * 50 : 0;

          ctx.lineTo(x + xOff, y);
        }

        ctx.stroke();
      }

      requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener('message', e => {
      if (e.data?.type === 'UPDATE_CONFIG') location.reload();
    });
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
    css: `body { margin: 0; background: #000; overflow: hidden; } canvas { width: 100vw; height: 100vh; }`,
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
  }
];
