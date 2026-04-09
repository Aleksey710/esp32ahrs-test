const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const TX_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

let device, characteristic;

export async function connectBLE() {
  device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [SERVICE_UUID] }]
  });

  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(SERVICE_UUID);

  characteristic = await service.getCharacteristic(TX_UUID);

  await characteristic.startNotifications();

  characteristic.addEventListener('characteristicvaluechanged', handleData);

  console.log('✅ BLE connected');
}

function handleData(event) {
  const value = new TextDecoder().decode(event.target.value);

  try {
    const data = JSON.parse(value);

    onSensorData(data); // 👉 в твою систему
  } catch (e) {
    console.warn('parse error', value);
  }
}

// Автопереподключение (очень важно)
device.addEventListener('gattserverdisconnected', async () => {
  console.log('🔁 reconnecting...');

  try {
    await device.gatt.connect();
    console.log('✅ reconnected');
  } catch (e) {
    console.error('reconnect failed');
  }
});

/*
ЧАСТЬ 3. Связка с твоим Three.js

Ты уже сделал:

onSensorData(data);

👉 значит всё автоматически подключится к:

updateOrientation()

*/
//----------------------------------------------------------------------
// v2
const device = await navigator.bluetooth.requestDevice({
  filters: [{ namePrefix: "ESP32" }],
  optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']
});

const server = await device.gatt.connect();

const service = await server.getPrimaryService(
  '6e400001-b5a3-f393-e0a9-e50e24dcca9e'
);

const char = await service.getCharacteristic(
  '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
);

await char.startNotifications();

char.addEventListener('characteristicvaluechanged', (e) => {
  const value = new TextDecoder().decode(e.target.value);
  console.log("IMU:", value);
});

//----------------------------------------------------------------------
🌐 Если ты хочешь подключаться из браузера

👉 Тогда ОБЯЗАТЕЛЬНО:

navigator.bluetooth.requestDevice({
  filters: [
    { services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'] }
  ]
})

👉 Без UUID браузер НЕ увидит устройство
