import * as THREE from "three";

export const ORBITAL_SPHERE_DEFAULTS = {
  speed: 1,
  particleSize: 0.015,
  particleOpacity: 0.8,
  orbitOpacity: 0.25,
  scale: 1,
  haloOpacity: 0.2,
  hue: 0,
};

export function createOrbitalSphereRenderer(canvas, getOptions) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.z = 5.5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const networkGroup = new THREE.Group();
  scene.add(networkGroup);

  // ── Particle sphere ──────────────────────────────────────────────────────
  const radius = 2.2;
  const particleCount = 15000;
  const rawPositions = new Float32Array(particleCount * 3);
  const rawColors = new Float32Array(particleCount * 3);

  const colorBright = new THREE.Color(0xa78bfa);
  const colorDim = new THREE.Color(0x701a75);
  let validIndex = 0;

  for (let i = 0; i < particleCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / particleCount);
    const theta = Math.sqrt(particleCount * Math.PI) * phi;
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);

    const noise =
      Math.sin(x * 3.5) * Math.cos(y * 3.5) * Math.sin(z * 3.5) +
      Math.cos(x * 6) * 0.4;

    if (noise <= -0.1) continue;

    const distortion = 1 + noise * 0.1;
    rawPositions[validIndex * 3]     = x * distortion;
    rawPositions[validIndex * 3 + 1] = y * distortion;
    rawPositions[validIndex * 3 + 2] = z * distortion;

    const mixedColor = colorDim.clone().lerp(colorBright, noise > 0.5 ? 1 : 0.3);
    rawColors[validIndex * 3]     = mixedColor.r;
    rawColors[validIndex * 3 + 1] = mixedColor.g;
    rawColors[validIndex * 3 + 2] = mixedColor.b;
    validIndex++;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(rawPositions.slice(0, validIndex * 3), 3)
  );
  particleGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(rawColors.slice(0, validIndex * 3), 3)
  );

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.015,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  networkGroup.add(new THREE.Points(particleGeometry, particleMaterial));

  // ── Orbital rings & data nodes ───────────────────────────────────────────
  const orbitMaterial = new THREE.LineBasicMaterial({
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
  });

  const toDispose = [particleGeometry, particleMaterial, orbitMaterial];
  const haloMaterials = [];

  for (let i = 0; i < 6; i++) {
    const orbitRadius = radius * (1.08 + Math.random() * 0.2);
    const pts = [];
    for (let p = 0; p <= 90; p++) {
      const angle = (p / 90) * Math.PI * 2;
      pts.push(
        Math.cos(angle) * orbitRadius,
        Math.sin(angle) * orbitRadius,
        Math.sin(angle * 4) * 0.1
      );
    }
    const orbitGeo = new THREE.BufferGeometry();
    orbitGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    toDispose.push(orbitGeo);

    const line = new THREE.Line(orbitGeo, orbitMaterial);
    line.rotation.x = Math.random() * Math.PI * 2;
    line.rotation.y = Math.random() * Math.PI * 2;
    networkGroup.add(line);

    if (i % 2 !== 0) {
      const nodeGeo = new THREE.SphereGeometry(0.025, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xd946ef });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = Math.random() * Math.PI * 2;
      node.position.set(
        Math.cos(angle) * orbitRadius,
        Math.sin(angle) * orbitRadius,
        0
      );
      line.add(node);

      const haloGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xc084fc,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      node.add(halo);

      haloMaterials.push(haloMat);
      toDispose.push(nodeGeo, nodeMat, haloGeo, haloMat);
    }
  }

  let responsiveScale = 1;

  return {
    resize(width, height) {
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);

      const opts = getOptions();
      if (width >= 1024) {
        networkGroup.position.set(2.5, 0, -2);
        responsiveScale = 1.15;
        camera.position.z = 5.5;
      } else {
        networkGroup.position.set(0, -1, -3);
        responsiveScale = 1;
        camera.position.z = 6.5;
      }
      networkGroup.scale.setScalar(responsiveScale * opts.scale);
    },

    render() {
      const opts = getOptions();
      particleMaterial.size = opts.particleSize;
      particleMaterial.opacity = opts.particleOpacity;
      orbitMaterial.opacity = opts.orbitOpacity;
      haloMaterials.forEach((m) => (m.opacity = opts.haloOpacity));
      networkGroup.scale.setScalar(responsiveScale * opts.scale);

      networkGroup.rotation.y += 0.0008 * opts.speed;
      networkGroup.rotation.x += 0.0003 * opts.speed;

      networkGroup.children.forEach((child, idx) => {
        if (child.isLine) {
          child.rotation.z += 0.0004 * opts.speed * (idx % 2 === 0 ? 1 : -1);
        }
      });

      renderer.render(scene, camera);
    },

    dispose() {
      toDispose.forEach((item) => item.dispose());
      renderer.dispose();
    },
  };
}
