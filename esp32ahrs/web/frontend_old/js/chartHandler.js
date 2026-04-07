import Chart from 'chart.js/auto';
import { initFFTChart, fftDataUpdate } from './fftChartHandler.js';

let chart_g, chart_a, chart_m;
let fft_g,   fft_a,   fft_m;

let timeIndex = 0;

const MAX_POINTS = 300;

// состояние осей
const axesState = {
    x: true,
    y: true,
    z: true
};

let initialized = false;

export function setupChart(ctx, label = 'label') {
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: label+' X',
                    data: [],
                    borderColor: 'red',
                    hidden: false
                },
                {
                    label: label+' Y',
                    data: [],
                    borderColor: 'green',
                    hidden: false
                },
                {
                    label: label+' Z',
                    data: [],
                    borderColor: 'blue',
                    hidden: false
                }
            ]
        },
        options: {
            animation: false,
            //parsing: false, // пропадает график . Разобраться
			normalized: true,
            responsive: true,
            //------------
            pointRadius: 1, 
			borderWidth: 1, 
			tension: 0,
            //------------
            interaction: {
                intersect: false,
                mode: 'nearest'
            },
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    display: true
                },
                y: {
                    display: true,
                    beginAtZero: false
                }
            }
        }
    });

    return chart;
}

// 🎛 UI для включения/выключения осей
export function createControlsAxes(chart) {
    const container = document.createElement('div');
    container.style.margin = '10px';

    ['x', 'y', 'z'].forEach((axis, index) => {
        const label = document.createElement('label');
        label.style.marginRight = '10px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;

        checkbox.onchange = () => {
            axesState[axis] = checkbox.checked;
            chart.data.datasets[index].hidden = !checkbox.checked;
            chart.update();
        };

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${axis.toUpperCase()}`));

        container.appendChild(label);
    });

	return container;
}

export function initChart(elementId, label='label') {
	const element = document.getElementById(elementId);
	
	//console.log(elementId, element);

    const ctx = element.getContext('2d');
	const chart = setupChart(ctx, label);
    element.parentNode.insertBefore(createControlsAxes(chart), element);
    return chart;
}

export function initCharts() {
	chart_g = initChart('chart_g', 'g');
	chart_a = initChart('chart_a', 'a');
	chart_m = initChart('chart_m', 'm');
	
    fft_g = initFFTChart('fft_g', 'FFT g');
    fft_a = initFFTChart('fft_a', 'FFT a');
    fft_m = initFFTChart('fft_m', 'FFT m');
}

export function axesDataUpdate(data, chart) {
	//console.log('axesDataUpdate',data, chart);
	
    if (chart)
    {
		chart.data.labels.push(timeIndex++);
		chart.data.datasets[0].data.push(data.x);
		chart.data.datasets[1].data.push(data.y);
		chart.data.datasets[2].data.push(data.z);
		
		// ограничение размера (как осциллограф)
		if (chart.data.labels.length > MAX_POINTS) {
			chart.data.labels.shift();

			chart.data.datasets.forEach(ds => {
				ds.data.shift();
			});
		}

		// авто-масштабирование
		autoScale(chart);

		chart.update('none');
	}
}

// 📈 авто масштаб
function autoScale(chart) {
    let allValues = [];

    chart.data.datasets.forEach((ds, i) => {
        if (!ds.hidden) {
            allValues = allValues.concat(ds.data);
        }
    });

    if (allValues.length === 0) return;

    const min = Math.min(...allValues);
    const max = Math.max(...allValues);

    const padding = (max - min) * 0.1 || 1;

    chart.options.scales.y.min = min - padding;
    chart.options.scales.y.max = max + padding;
}

export function dataUpdate(data) {

	if(data.imu)
	{
		if(data.imu.g)
		{
			axesDataUpdate(data.imu.g, chart_g);
			fftDataUpdate('g', data.imu.g);
		}
		
		if(data.imu.a)
		{
			axesDataUpdate(data.imu.a, chart_a);
			fftDataUpdate('a', data.imu.a);
		}
	}
/*
	if(data.m)
	{
		if(data.m)
		{
			axesDataUpdate(data.m, chart_m);
			fftDataUpdate('m', data.imu.m);
		}
	}
	*/
}





