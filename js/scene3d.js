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
  ctx.strokeStyle = 'rgba(198,240,0,0.45)';
  ctx.lineWidth = 5;
  ctx.strokeRect(20, 20, 472, 600);
  ctx.fillStyle = '#c6f000';
  ctx.beginPath();
  ctx.arc(58, 58, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(212,165,116,0.95)';
  ctx.font = '600 24px ui-monospace, monospace';
  ctx.fillText('autom.lab', 82, 66);
  ctx.fillStyle = '#f2f4ec';
  ctx.font = '700 40px system-ui, sans-serif';
  wrapText(ctx, title, 44, 270, 424, 48);
  ctx.fillStyle = '#9aa392';
  ctx.font = '400 24px system-ui, sans-serif';
  wrapText(ctx, sub, 44, 400, 424, 32);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
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
if (!canvas) {
  /* no-op */
} else if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  canvas.closest('.gallery-wrap')?.classList.add('fallback');
} else {
  try {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0d0a, 0.022);

  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 80);
  camera.position.set(0, 0.6, 12);

  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: true, powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  scene.add(new THREE.AmbientLight(0xc6f000, 0.45));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(5, 8, 6);
  scene.add(key);
  const p1 = new THREE.PointLight(0xc6f000, 4.2, 24);
  p1.position.set(-4, 2, 4);
  scene.add(p1);
  const p2 = new THREE.PointLight(0xd4a574, 2.6, 20);
  p2.position.set(4, -1, 3);
  scene.add(p2);

  // Planet core + rings (center of carousel)
  const planet = new THREE.Group();
  scene.add(planet);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.05, 1),
    new THREE.MeshPhysicalMaterial({
      color: 0xc6f000,
      metalness: 0.85,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      emissive: 0x3a4a00,
      emissiveIntensity: 0.4
    })
  );
  planet.add(core);

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.4, 0),
    new THREE.MeshBasicMaterial({
      color: 0xc6f000,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    })
  );
  planet.add(wire);

  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xd4a574,
    metalness: 0.9,
    roughness: 0.25,
    emissive: 0xd4a574,
    emissiveIntensity: 0.2
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.032, 12, 96), ringMat);
  ring.rotation.x = Math.PI / 2.35;
  planet.add(ring);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.024, 12, 96), ringMat.clone());
  ring2.rotation.x = Math.PI / 1.75;
  ring2.rotation.z = 0.45;
  planet.add(ring2);

  const gallery = new THREE.Group();
  scene.add(gallery);

  const cards = [];
  const W = 2.05, H = 2.55, D = 0.08;
  const radius = () => (innerWidth < 700 ? 4.2 : 5.6);

  OFFERS.forEach((o, i) => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(
      new THREE.BoxGeometry(W, H, D),
      new THREE.MeshStandardMaterial({ color: 0x1a2016, metalness: 0.55, roughness: 0.35 })
    ));
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(W - 0.12, H - 0.12),
      new THREE.MeshBasicMaterial({ map: makeCardTexture(o.title, o.sub) })
    );
    face.position.z = D / 2 + 0.01;
    g.add(face);
    const rim = new THREE.Mesh(
      new THREE.BoxGeometry(W + 0.06, H + 0.06, 0.02),
      new THREE.MeshBasicMaterial({ color: 0xc6f000, transparent: true, opacity: 0.28 })
    );
    rim.position.z = -0.03;
    g.add(rim);
    gallery.add(g);
    cards.push(g);
  });

  function placeCards() {
    const r = radius();
    const n = cards.length;
    cards.forEach((g, i) => {
      const angle = (i / n) * Math.PI * 2;
      g.position.set(Math.sin(angle) * r, Math.sin(i * 0.9) * 0.28, Math.cos(angle) * r);
      g.lookAt(0, g.position.y, 0);
      g.rotateY(Math.PI);
    });
  }
  placeCards();

  // Dense starfield / dots around planet
  const count = 1100;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const c1 = new THREE.Color(0xc6f000);
  const c2 = new THREE.Color(0xd4a574);
  for (let i = 0; i < count; i++) {
    const r = 2.2 + Math.random() * 14;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    pos[i * 3 + 2] = r * Math.cos(ph);
    const m = c1.clone().lerp(c2, Math.random());
    col[i * 3] = m.r;
    col[i * 3 + 1] = m.g;
    col[i * 3 + 2] = m.b;
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pg.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const particles = new THREE.Points(pg, new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));
  scene.add(particles);

  let dragging = false, prevX = 0, vel = 0.004, mx = 0, my = 0;
  function resize() {
    const parent = canvas.parentElement;
    const w = parent.clientWidth;
    const h = Math.max(parent.clientHeight, innerWidth < 700 ? 380 : 480);
    camera.aspect = w / h;
    camera.position.z = innerWidth < 700 ? 10.5 : 12;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    placeCards();
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
    const r = canvas.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    my = -(((e.clientY - r.top) / r.height) * 2 - 1);
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
      gallery.rotation.y += vel + 0.003;
    }
    core.rotation.y = t * 0.35;
    core.rotation.x = Math.sin(t * 0.4) * 0.12;
    wire.rotation.y = -t * 0.22;
    wire.rotation.z = t * 0.1;
    ring.rotation.z = t * 0.35;
    ring2.rotation.z = -t * 0.25;
    particles.rotation.y = t * 0.04;
    planet.rotation.y += (mx * 0.25 - planet.rotation.y) * 0.04;
    planet.rotation.x += (my * 0.15 - planet.rotation.x) * 0.04;
    gallery.position.y = Math.sin(t * 0.5) * 0.06;
    cards.forEach((c, i) => {
      c.position.y = Math.sin(t * 0.8 + i) * 0.1 + Math.sin(i * 0.9) * 0.28;
    });
    p1.intensity = 3.8 + Math.sin(t * 1.6) * 0.6;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
  } catch (err) {
    console.error('gallery3d', err);
    canvas.closest('.gallery-wrap')?.classList.add('fallback');
  }
}
