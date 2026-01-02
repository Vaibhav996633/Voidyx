
import { AnimationEntry } from '../types';

export const ANIMATIONS: AnimationEntry[] = [
  {
    id: 'fluid-grid',
    name: 'Fluid Grid',
    category: 'Background',
    description: 'Interactive flowing grid lines that distort smoothly around the cursor using vector displacement.',
    complexity: 'Medium',
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
    id: 'vanta-birds',
    name: 'Vanta Birds',
    category: 'WebGL',
    description: 'A high-fidelity flocking simulation inspired by boids theory. Performance-optimized for large surfaces.',
    complexity: 'High',
    cdnLinks: ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js'],
    config: [
      { id: 'backgroundColor', label: 'Background', type: 'color', default: '#050505' },
      { id: 'color1', label: 'Primary', type: 'color', default: '#ff0000' },
      { id: 'color2', label: 'Secondary', type: 'color', default: '#00d1ff' },
      { id: 'quantity', label: 'Quantity', type: 'number', default: 5, min: 1, max: 10, step: 1 },
      { id: 'birdSize', label: 'Bird Size', type: 'number', default: 1.5, min: 0.5, max: 4, step: 0.1 },
    ],
    html: '<div id="vanta-canvas" style="width:100%; height:100vh;"></div>',
    css: `body { margin: 0; padding: 0; overflow: hidden; background: #000; }`,
    js: `
      const config = window.VANTA_CONFIG || { backgroundColor: '#050505', color1: '#ff0000', color2: '#00d1ff', quantity: 5, birdSize: 1.5 };
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
        return { mesh: bird, velocity: new THREE.Vector3((Math.random()-0.5)*0.1, (Math.random()-0.5)*0.1, (Math.random()-0.5)*0.1), position: new THREE.Vector3((Math.random()-0.5)*15, (Math.random()-0.5)*10, (Math.random()-0.5)*10) };
      }
      for(let i=0; i<config.quantity * 25; i++) { const b = createBird(); birds.push(b); birdGroup.add(b.mesh); }
      const light = new THREE.DirectionalLight(0xffffff, 1); light.position.set(1, 1, 2); scene.add(light);
      scene.add(new THREE.AmbientLight(0x404040));
      camera.position.z = 15;
      function animate() {
        requestAnimationFrame(animate);
        birds.forEach(b => {
          b.position.add(b.velocity);
          if (Math.abs(b.position.x) > 20) b.velocity.x *= -1;
          if (Math.abs(b.position.y) > 15) b.velocity.y *= -1;
          if (Math.abs(b.position.z) > 10) b.velocity.z *= -1;
          b.mesh.position.copy(b.position); b.mesh.lookAt(b.position.clone().add(b.velocity)); b.mesh.rotateX(Math.PI/2);
        });
        birdGroup.rotation.y += 0.001; renderer.render(scene, camera);
      }
      window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
      animate();
    `
  },
  {
    id: 'cyber-field',
    name: 'Cyber Field',
    category: 'Interactive',
    description: 'A dense matrix of responsive particles that react to proximity with visceral scale shifts.',
    complexity: 'Medium',
    config: [
      { id: 'dotColor', label: 'Node Color', type: 'color', default: '#3b82f6' },
      { id: 'radius', label: 'Field Radius', type: 'number', default: 150, min: 50, max: 400, step: 10 },
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
  }
];
