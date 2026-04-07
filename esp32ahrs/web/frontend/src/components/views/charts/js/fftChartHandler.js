import Chart from 'chart.js/auto';

// ================= CONFIG =================
//const FFT_SIZE = 256; // можно менять
const FFT_SIZE = 512; // можно менять
//const FFT_SIZE = 1024; // можно менять
//const FFT_SIZE = 2048; // можно менять

// Чтобы ось X имела смысл (Гц)
// Fs = частота обновления данных (например 50 Гц)
// Тогда:
// freq = i * Fs / FFT_SIZE

// ================= STATE =================
//const fftBuffers = {
//	x: [], y: [], z: []
//    g: { x: [], y: [], z: [] },
//    a: { x: [], y: [], z: [] },
//    m: { x: [], y: [], z: [] }
//};

//const fftCharts = {};

// ================= FFT =================
// простая (не самая быстрая) реализация FFT
function fft(re, im) {
    const N = re.length;
    if (N <= 1) return;

    const evenRe = new Array(N / 2);
    const evenIm = new Array(N / 2);
    const oddRe = new Array(N / 2);
    const oddIm = new Array(N / 2);

    for (let i = 0; i < N / 2; i++) {
        evenRe[i] = re[i * 2];
        evenIm[i] = im[i * 2];
        oddRe[i] = re[i * 2 + 1];
        oddIm[i] = im[i * 2 + 1];
    }

    fft(evenRe, evenIm);
    fft(oddRe, oddIm);

    for (let k = 0; k < N / 2; k++) {
        const t = -2 * Math.PI * k / N;
        const cos = Math.cos(t);
        const sin = Math.sin(t);

        const tre = cos * oddRe[k] - sin * oddIm[k];
        const tim = sin * oddRe[k] + cos * oddIm[k];

        re[k] = evenRe[k] + tre;
        im[k] = evenIm[k] + tim;
        re[k + N / 2] = evenRe[k] - tre;
        im[k + N / 2] = evenIm[k] - tim;
    }
}

function computeFFT(data) {
    const re = data.slice();
    const im = new Array(data.length).fill(0);

    fft(re, im);

    // амплитуда
    return re.map((r, i) => Math.sqrt(r * r + im[i] * im[i]));
}

// ================= CHART =================
export function createFFTChart(ctx, label='label') {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { label: label+' X', data: [] },
                { label: label+' Y', data: [] },
                { label: label+' Z', data: [] }
            ]
        },
        options: {
            animation: false,
            responsive: true,
            scales: {
                x: { display: true },
                y: { display: true }
            }
        }
    });
}

// ================= INIT =================
export function initFFTChart(canvas, label = 'label') {
    const ctx = canvas.getContext('2d');

    const chart = createFFTChart(ctx, label);
    //fftCharts[canvas] = chart;

    return chart;
}

// ================= UPDATE =================
export function fftDataUpdate(chart, fftBuffers, data) {
	//console.log('fftDataUpdate', data)
	
	if (!data || data.x === undefined || data.y === undefined || data.z === undefined) {
        console.warn('FFT skip invalid data:', data);
        return;
    }

    ['x', 'y', 'z'].forEach(axis => {
        fftBuffers[axis].push(data[axis]);

        if (fftBuffers[axis].length > FFT_SIZE) {
            fftBuffers[axis].shift();
        }
    });

    // считаем FFT только когда накопили достаточно
    if (fftBuffers.x.length === FFT_SIZE) {
        updateFFTChart(chart, fftBuffers);
    }
}

function updateFFTChart(chart, fftBuffers) {

    const fx = computeFFT(fftBuffers.x);
    const fy = computeFFT(fftBuffers.y);
    const fz = computeFFT(fftBuffers.z);

    const half = FFT_SIZE / 2;

    chart.data.labels = Array.from({ length: half }, (_, i) => i);

    chart.data.datasets[0].data = fx.slice(0, half);
    chart.data.datasets[1].data = fy.slice(0, half);
    chart.data.datasets[2].data = fz.slice(0, half);

    chart.update('none');
}
