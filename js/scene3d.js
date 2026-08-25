import * as THREE from 'three';

const OFFERS = [
  { title: 'Gestionali & CRM', sub: 'Clienti, pratiche, flussi' },
  { title: 'Siti & landing', sub: 'Presenza web su misura' },
  { title: 'E-commerce', sub: 'Cataloghi e vendite' },
  { title: 'Software desktop', sub: 'Programmi Windows' },
  { title: 'Dashboard', sub: 'Dati e reportistica' },
  { title: 'Portali clienti', sub: 'Area riservata' },
  { title: 'Prenotazioni', sub: 'Agenda e slot' },
  { title: 'Automazioni', sub: 'PDF · Excel · batch' },
  { title: 'Integrazioni', sub: 'API e sync dati' },
  { title: 'Tool interni', sub: 'Operatività quotidiana' },
  { title: 'MVP veloci', sub: 'Dal problema al prototipo' },
  { title: 'Il tuo flusso', sub: 'Se lo ripeti, si può fare' }
];

function makeCardTexture(title, sub) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 640;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 640);
  g.addColorStop(0, '#1c2218');
  g.addColorStop(1, '#0e120c');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 640);
  ctx.strokeStyle = 'rgba(198,240,0,0.35)';
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, 476, 604);
  ctx.fillStyle = '#c6f000';
  ctx.beginPath();
  ctx.arc(56, 56, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(212,165,116,0.9)';
  ctx.font = '500 22px "IBM Plex Mono", monospace';
  ctx.fillText('autom.lab', 80, 64);
  ctx.fillStyle = '#f2f4ec';
  ctx.font = '700 42px Syne, sans-serif';
  wrapText(ctx, title, 48, 280, 416, 52);
  ctx.fillStyle = '#9aa392';
  ctx.font = '400 26px Sora, sans-serif';
  wrapText(ctx, sub, 48, 400, 416, 34);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = text.split(' ');
  let line = '', yy = y;
  for (let n = 0; n < words.length; n++) {
    const test = line + words[n] + ' ';
    if (ctx.measureText(test).width > maxW && n > 0) {
      ctx.fillText(line.trim(), x, yy);
      line = words[n] + ' ';
      yy += lineH;
    } else line = test;
  }
  ctx.fillText(line.trim(), x, yy);
}

const canvas = document.getElementById('gallery3d');
if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) {
  if (canvas) canvas.closest('.gallery-wrap')?.classList.add('fallback');
} else {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0d0a, 0.028);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 80);
  camera.position.set(0, 0.4, 11);

  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: true, powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  scene.add(new THREE.AmbientLight(0xc6f000, 0.4));
  const key = new THREE.DirectionalLight(0xffffff, 2);
  key.position.set(5, 8, 6);
  scene.add(key);
  const p1 = new THREE.PointLight(0xc6f000, 3.5, 22);
  p1.position.set(-4, 2, 4);
  scene.add(p1);
  const p2 = new THREE.PointLight(0xd4a574, 2.2, 18);
  p2.position.set(4, -1, 3);
  scene.add(p2);

  const gallery = new THREE.Group();
  scene.add(gallery);

  const cards = [];
  const W = 2.2, H = 2.75, D = 0.08;
  OFFERS.forEach((o, i) => {
    const g = new THREE.Group();
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(W, H, D),
      new THREE.MeshStandardMaterial({ color: 0x1a2016, metalness: 0.55, roughness: 0.35 })
    );
    g.add(frame);
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(W - 0.12, H - 0.12),
      new THREE.MeshBasicMaterial({ map: makeCardTexture(o.title, o.sub) })
    );
    face.position.z = D / 2 + 0.01;
    g.add(face);
    const rim = new THREE.Mesh(
      new THREE.BoxGeometry(W + 0.06, H + 0.06, 0.02),
      new THREE.MeshBasicMaterial({ color: 0xc6f000, transparent: true, opacity: 0.25 })
    );
    rim.position.z = -0.03;
    g.add(rim);
    gallery.add(g);
    cards.push(g);

    const n = OFFERS.length;
    const angle = (i / n) * Math.PI * 2;
    const radius = 5.4;
    g.position.set(Math.sin(angle) * radius, Math.sin(i * 0.9) * 0.35, Math.cos(angle) * radius);
    g.lookAt(0, g.position.y, 0);
    g.rotateY(Math.PI);
  });

  // soft particles (no grid)
  const count = 400;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 28;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 28;
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(pg, new THREE.PointsMaterial({
    color: 0xc6f000, size: 0.04, transparent: true, opacity: 0.45,
    blending: THREE.AdditiveBlending, depthWrite: false
  })));

  let w = 1, h = 1, dragging = false, prevX = 0, vel = 0.004;
  function resize() {
    const parent = canvas.parentElement;
    w = parent.clientWidth;
    h = Math.max(parent.clientHeight, 420);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();
  addEventListener('resize', resize);

  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    prevX = e.clientX;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointerup', () => { dragging = false; });
  canvas.addEventListener('pointerleave', () => { dragging = false; });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - prevX;
    prevX = e.clientX;
    vel = dx * 0.0025;
    gallery.rotation.y += vel;
  });

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    if (!dragging) {
      vel *= 0.95;
      gallery.rotation.y += vel + 0.0032;
    }
    gallery.position.y = Math.sin(t * 0.5) * 0.08;
    cards.forEach((c, i) => {
      c.position.y = Math.sin(t * 0.8 + i) * 0.12 + Math.sin(i * 0.9) * 0.35;
    });
    p1.intensity = 3.2 + Math.sin(t * 1.5) * 0.5;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
