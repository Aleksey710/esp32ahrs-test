// ---------------- THREE.JS ----------------
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / 300,
0.1,
1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, 300);
document.getElementById("scene").appendChild(renderer.domElement);

// свет
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2,2,2);
scene.add(light);

// куб
const cube = new THREE.Mesh(
new THREE.BoxGeometry(),
new THREE.MeshStandardMaterial({ color: 0x00ffcc })
);
scene.add(cube);

// стрелка
const arrow = new THREE.ArrowHelper(
new THREE.Vector3(1,0,0),
new THREE.Vector3(0,0,0),
2,
0xff0000
);
scene.add(arrow);

camera.position.z = 3;

// ---------------- QUATERNION ROTATION ----------------
function applyQuaternion(qx, qy, qz, qw) {
const q = new THREE.Quaternion(qx, qy, qz, qw);
cube.setRotationFromQuaternion(q);

```
const dir = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
arrow.setDirection(dir.normalize());
```

}

// ---------------- CHART ----------------
const ctx = document.getElementById("chart");

const chart = new Chart(ctx, {
type: "line",
data: {
labels: [],
datasets: [
{ label: "X", data: [], borderWidth: 1 },
{ label: "Y", data: [], borderWidth: 1 },
{ label: "Z", data: [], borderWidth: 1 }
]
},
options: {
animation: false,
responsive: true,
scales: {
x: { display: false }
}
}
});
/*
// ---------------- WEBSOCKET ----------------
let ws;

function connectWS() {
ws = new WebSocket("ws://" + location.host + "/ws");

```
ws.onopen = () => console.log("WS connected");

ws.onclose = () => {
    console.log("WS reconnect...");
    setTimeout(connectWS, 1000);
};

ws.onmessage = (event) => {
    const d = JSON.parse(event.data);

    // таблица
    document.getElementById("x").innerText = d.x.toFixed(2);
    document.getElementById("y").innerText = d.y.toFixed(2);
    document.getElementById("z").innerText = d.z.toFixed(2);

    // вращение (если есть quaternion)
    if (d.qx !== undefined) {
        applyQuaternion(d.qx, d.qy, d.qz, d.qw);
    } else {
        cube.rotation.set(d.x, d.y, d.z);
    }

    // график
    const t = Date.now();

    chart.data.labels.push(t);
    chart.data.datasets[0].data.push(d.x);
    chart.data.datasets[1].data.push(d.y);
    chart.data.datasets[2].data.push(d.z);

    if (chart.data.labels.length > 100) {
        chart.data.labels.shift();
        chart.data.datasets.forEach(ds => ds.data.shift());
    }

    chart.update();
};
```

}

connectWS();
*/
// ---------------- RENDER LOOP ----------------
function animate() {
requestAnimationFrame(animate);
renderer.render(scene, camera);
}

animate();

// ---------------- RESIZE ----------------
window.addEventListener("resize", () => {
camera.aspect = window.innerWidth / 300;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, 300);
});
