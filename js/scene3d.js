import * as THREE from 'three';

const canvas = document.getElementById('hero3d');
if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) {
  if (canvas) canvas.style.display = 'none';
} else {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0d0a, 0.045);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.35, 7.2);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  scene.add(new THREE.AmbientLight(0xc6f000, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 6, 5);
  scene.add(key);
  const fill = new THREE.PointLight(0xc6f000, 4.5, 18);
  fill.position.set(-3, 1.5, 2);
  scene.add(fill);
  const copper = new THREE.PointLight(0xd4a574, 2.8, 14);
  copper.position.set(3, -2, 3);
  scene.add(copper);

  const root = new THREE.Group();
  scene.add(root);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.15, 1),
    new THREE.MeshPhysicalMaterial({
      color: 0xc6f000,
      metalness: 0.85,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      emissive: 0x3a4a00,
      emissiveIntensity: 0.35
    })
  );
  root.add(core);

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.55, 0),
    new THREE.MeshBasicMaterial({
      color: 0xc6f000,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    })
  );
  root.add(wire);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.05, 0.035, 12, 96),
    new THREE.MeshStandardMaterial({
      color: 0xd4a574,
      metalness: 0.9,
      roughness: 0.25,
      emissive: 0xd4a574,
      emissiveIntensity: 0.15
    })
  );
  ring.rotation.x = Math.PI / 2.4;
  root.add(ring);

  const ring2 = ring.clone();
  ring2.scale.setScalar(1.18);
  ring2.rotation.x = Math.PI / 1.7;
  ring2.rotation.z = 0.4;
  root.add(ring2);

  // floating panel slabs (software / web metaphor)
  const slabMat = new THREE.MeshStandardMaterial({
    color: 0x171b14,
    metalness: 0.4,
    roughness: 0.45,
    emissive: 0xc6f000,
    emissiveIntensity: 0.04
  });
  const slabs = [];
  [[-2.4, 0.9, -0.4], [2.2, -0.5, 0.2], [0.3, 1.7, -1.1]].forEach((p, i) => {
    const s = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 0.06), slabMat.clone());
    s.position.set(...p);
    s.rotation.y = i === 0 ? 0.35 : i === 1 ? -0.4 : 0.15;
    root.add(s);
    slabs.push(s);
  });

  const count = 900;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const c1 = new THREE.Color(0xc6f000);
  const c2 = new THREE.Color(0xd4a574);
  for (let i = 0; i < count; i++) {
    const r = 3 + Math.random() * 8;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    pos[i * 3 + 2] = r * Math.cos(ph);
    const m = c1.clone().lerp(c2, Math.random());
    col[i * 3] = m.r; col[i * 3 + 1] = m.g; col[i * 3 + 2] = m.b;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  scene.add(particles);

  const grid = new THREE.GridHelper(16, 24, 0xc6f000, 0x1a2214);
  grid.position.y = -2.4;
  grid.material.transparent = true;
  grid.material.opacity = 0.28;
  scene.add(grid);

  let mx = 0, my = 0, w = 1, h = 1;
  function resize() {
    const parent = canvas.parentElement;
    w = parent.clientWidth;
    h = Math.max(parent.clientHeight, 360);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();
  addEventListener('resize', resize);

  const wrap = canvas.parentElement;
  wrap.addEventListener('pointermove', (e) => {
    const r = wrap.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    my = -(((e.clientY - r.top) / r.height) * 2 - 1);
  });

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    core.rotation.y = t * 0.35;
    core.rotation.x = Math.sin(t * 0.4) * 0.15;
    wire.rotation.y = -t * 0.25;
    wire.rotation.z = t * 0.12;
    ring.rotation.z = t * 0.4;
    ring2.rotation.z = -t * 0.28;
    particles.rotation.y = t * 0.05;
    slabs.forEach((s, i) => {
      s.position.y += Math.sin(t * 1.2 + i) * 0.0015;
      s.rotation.y += 0.002;
    });
    fill.intensity = 4.2 + Math.sin(t * 2) * 0.6;
    root.rotation.y += (mx * 0.45 - root.rotation.y) * 0.04;
    root.rotation.x += (my * 0.25 - root.rotation.x) * 0.04;
    camera.position.x += (mx * 0.6 - camera.position.x) * 0.03;
    camera.position.y += (0.35 + my * 0.35 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
