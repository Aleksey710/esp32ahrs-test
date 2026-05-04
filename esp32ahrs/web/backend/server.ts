import WebSocket, { WebSocketServer } from 'ws';

const PERIOD = 10; // ms
const PORT = 8080;
const MODE: 'sin' | 'random' | 'static' = (process.env.MODE as any) || 'sin';

const wss = new WebSocketServer({ port: PORT });

console.log(`Mock WS server running on ws://localhost:${PORT}`);
console.log(`Mode: ${MODE}`);

// ---- Типы ----

type Vector3 = {
    x: number;
    y: number;
    z: number;
};

type IMU = {
    g: Vector3;
    a: Vector3;
};

type DataPayload = {
    timestamp: number;
    imu: IMU;
    m: Vector3;
};

// ---- Логика ----

function noise(scale = 0.05): number {
    return (Math.random() - 0.5) * scale;
}

function generateData(t: number): DataPayload {
    switch (MODE) {
        case 'random':
            return {
                timestamp: Date.now(),
                imu: {
                    g: {
                        x: Math.random() * 2 - 1,
                        y: Math.random() * 2 - 2,
                        z: Math.random() * 2 - 1
                    },
                    a: {
                        x: Math.random() * 2 - 1,
                        y: Math.random() * 2 - 1,
                        z: Math.random() * 2 - 1
                    }
                },
                m: {
                    x: Math.random() * 2 - 1,
                    y: Math.random() * 2 - 1,
                    z: Math.random() * 2 - 1
                }
            };

        case 'static':
            return {
                timestamp: Date.now(),
                imu: {
                    g: { x: 0, y: 0, z: 1 },
                    a: { x: 0, y: 0, z: 1 }
                },
                m: { x: 0, y: 0, z: 1 }
            };

        case 'sin':
        default: {
            const g_Ampl = 20;
            const g_faza_use = 1;

            const g_x_period = 0.7;
            const g_y_period = 0.7;
            const g_z_period = 0.7;

            return {
                timestamp: Date.now(),
                imu: {
                    g: {
                        x: Math.sin(t * g_x_period) * g_Ampl + (10 * g_faza_use) + noise(),
                        y: Math.cos(t * g_y_period) * g_Ampl + (30 * g_faza_use) + noise(),
                        z: Math.sin(t * g_z_period) * g_Ampl + (50 * g_faza_use) + noise()
                    },
                    a: {
                        x: Math.sin(t * 0.5) + noise(),
                        y: Math.cos(t * 0.6) + noise(),
                        z: Math.sin(t * 0.7) + noise()
                    }
                },
                m: {
                    x: Math.sin(t * 0.5) + noise(),
                    y: Math.cos(t * 0.6) + noise(),
                    z: Math.sin(t * 0.7) + noise()
                }
            };
        }
    }
}

// ---- WebSocket ----

wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');

    let t = 0;

    const interval = setInterval(() => {
        t += 0.1;

        const data = generateData(t);
        const message = JSON.stringify(data);

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });

    }, PERIOD);

    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(interval);
    });

    ws.on('error', (err: Error) => {
        console.error('WS error:', err.message);
    });

    ws.on('message', (msg: WebSocket.RawData) => {
        try {
            const data = JSON.parse(msg.toString());
            console.log('Received from client:', data);
        } catch {
            console.log('Raw message:', msg.toString());
        }
    });
});
