import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import quad_x_model_url from '@/models/quad_x.gltf?url';
/*
function hasWebGL() {
	try {
		const canvas = document.createElement('canvas');
		return !!window.WebGLRenderingContext &&
			   (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
	} catch (e) {
		document.body.innerHTML = "WebGL not supported";
		return false;
	}
}
*/

export function init3DView(sceneEl) {
	console.log('setup 3DView start...');
	
	console.log('WebGL available:', !!window.WebGLRenderingContext);

	const width = sceneEl.clientWidth || 400;
	const height = sceneEl.clientHeight || 400;
	
	// 🎬 сцена
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x222222); 
	
	// 📷 камера
	const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
	
	// 🖥 renderer
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(width, height);
	sceneEl.appendChild(renderer.domElement);
	//------------------------------------------------------------------
/*
	// 📦 куб
	const geometry = new THREE.BoxGeometry();
	const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });

	const cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
*/
	//------------------------------------------------------------------
	// ✅ загружаем модель
	const loader = new GLTFLoader();

	let drone;

	loader.load(
		quad_x_model_url,
		//'@/models/quad_x.gltf',
		//'@/models/axis_gizmo.glb',
		(gltf) => {
			drone = gltf.scene;

			// ⚙️ масштаб (очень важно — модели часто огромные/маленькие)
			drone.scale.set(1, 1, 1);
			//drone.scale.set(0.1, 0.1, 0.1);

			// 📍 позиция
			drone.position.set(0, 0, 0);

			scene.add(drone);
			
			// Добавить свет
			const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
			scene.add(hemi);
		},
		(progress) => {
			console.log('loading:', (progress.loaded / progress.total) * 100, '%');
		},
		(error) => {
			console.error('model load error:', error);
		}
	);

	//const box = new THREE.Box3().setFromObject(drone);
	//const center = box.getCenter(new THREE.Vector3());

	//drone.position.sub(center);
	
	//------------------------------------------------------------------
	camera.position.z = 5;
	//camera.position.z = 10;

	// 💡 свет
	const light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(1, 1, 1);
	scene.add(light);

	const ambient = new THREE.AmbientLight(0x404040);
	scene.add(ambient);

	// 🔄 анимация
	function animate() {
		requestAnimationFrame(animate);

		if (drone) {
			drone.rotation.x += 0.01; // вращение квадрокоптера
			drone.rotation.y += 0.01; // вращение квадрокоптера
			drone.rotation.z += 0.01; // вращение квадрокоптера
		}

		renderer.render(scene, camera);
	}

	animate();
	
	//return cube;
	return drone;
}

const DEG2RAD = Math.PI / 180;

let pitch = 0;
let roll = 0;
let yaw = 0;

//dt = 0.016

export function treeDataUpdate(obj, data, dt = 0.016) {
	if (!obj || !data?.imu) return;

	const g = data.imu.g;
	const a = data.imu.a;

	// =========================
	// 📐 ACC (углы)
	// =========================
	const accPitch = Math.atan2(a.y, a.z);
	const accRoll  = Math.atan2(-a.x, a.z);

	// =========================
	// 🔄 GYRO (интеграция)
	// =========================
	pitch += g.x * DEG2RAD * dt;
	roll  += g.y * DEG2RAD * dt;
	yaw   += g.z * DEG2RAD * dt;

	// =========================
	// 🧠 Complementary filter
	// =========================
	const alpha = 0.98;

	pitch = alpha * pitch + (1 - alpha) * accPitch;
	roll  = alpha * roll  + (1 - alpha) * accRoll;

	// =========================
	// 🎯 применяем к объекту
	// =========================
	obj.rotation.x = pitch;
	obj.rotation.z = roll;
	obj.rotation.y = yaw;
}
