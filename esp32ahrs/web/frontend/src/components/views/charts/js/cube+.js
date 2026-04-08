import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

export async function generateAxisGizmoGLB() {
  const scene = new THREE.Scene();

  // =========================
  // 🧊 center cube
  // =========================
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.3, 0.3),
    new THREE.MeshStandardMaterial({ color: 0xcccccc })
  );
  scene.add(cube);

  // =========================
  // 💡 light
  // =========================
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(2, 2, 2);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0x404040);
  scene.add(ambient);

  // =========================
  // 🎯 axis builder (Blender-like arrow)
  // =========================
  function createArrow(color) {
    const group = new THREE.Group();

    const material = new THREE.MeshStandardMaterial({ color });

    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1, 16),
      material
    );

    const head = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.2, 16),
      material
    );

    shaft.position.y = 0.5;
    head.position.y = 1.1;

    group.add(shaft);
    group.add(head);

    return group;
  }

  // =========================
  // ➡️ X axis (red)
  // =========================
  const x = createArrow(0xff0000);
  x.rotation.z = -Math.PI / 2;
  scene.add(x);

  // =========================
  // ⬆️ Y axis (green)
  // =========================
  const y = createArrow(0x00ff00);
  scene.add(y);

  // =========================
  // ⬅️ Z axis (blue)
  // =========================
  const z = createArrow(0x0000ff);
  z.rotation.x = Math.PI / 2;
  scene.add(z);

  // =========================
  // 🅰️ TEXT LABELS (X/Y/Z)
  // =========================
  const loader = new FontLoader();

  const font = await new Promise((resolve, reject) => {
    loader.load(
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
      resolve,
      undefined,
      reject
    );
  });

  function createLabel(text, color, position) {
    const geo = new TextGeometry(text, {
      font,
      size: 0.15,
      height: 0.02
    });

    const mat = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geo, mat);

    mesh.position.copy(position);
    return mesh;
  }

  scene.add(createLabel('X', 0xff0000, new THREE.Vector3(1.4, 0, 0)));
  scene.add(createLabel('Y', 0x00ff00, new THREE.Vector3(0, 1.4, 0)));
  scene.add(createLabel('Z', 0x0000ff, new THREE.Vector3(0, 0, 1.4)));

  // =========================
  // 📦 EXPORT TO GLB
  // =========================
  const exporter = new GLTFExporter();

  exporter.parse(
    scene,
    (result) => {
      const blob = new Blob([result], { type: 'model/gltf-binary' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'axis_gizmo.glb';
      link.click();
    },
    { binary: true }
  );
}
