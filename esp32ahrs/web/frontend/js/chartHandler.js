import Chart from 'chart.js/auto';

let chart_g;
let chart_a;
let chart_m;


let timeIndex = 0;

const MAX_POINTS = 300;

// состояние осей
const axesState = {
    x: true,
    y: true,
    z: true
};

let initialized = false;

function setupChart(ctx) {
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'X',
                    data: [],
                    borderColor: 'red',
                    hidden: false
                },
                {
                    label: 'Y',
                    data: [],
                    borderColor: 'green',
                    hidden: false
                },
                {
                    label: 'Z',
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

    createControls();
    
    return chart;
}

export function initChart() {
    
    if (initialized)
    {
		//console.log('Chart setup...2');
		return;
	} else
	{
		initialized = true;
		//console.log('Chart setup...1');
	}

    const ctx_g = document.getElementById('chart_g').getContext('2d');
    const ctx_a = document.getElementById('chart_a').getContext('2d');
    const ctx_m = document.getElementById('chart_m').getContext('2d');

	chart_g = setupChart(ctx_g);
	chart_a = setupChart(ctx_a);
	chart_m = setupChart(ctx_m);
}

export function dataUpdate(data) {
    if (!chart_g) return;
    if (!chart_a) return;
    if (!chart_m) return;

    // ось времени

    // данные
    chart_g.data.labels.push(timeIndex++);
    chart_g.data.datasets[0].data.push(data.imu.g.x);
    chart_g.data.datasets[1].data.push(data.imu.g.y);
    chart_g.data.datasets[2].data.push(data.imu.g.z);
    
    chart_a.data.labels.push(timeIndex++);
    chart_a.data.datasets[0].data.push(data.imu.a.x);
    chart_a.data.datasets[1].data.push(data.imu.a.y);
    chart_a.data.datasets[2].data.push(data.imu.a.z);
    
    chart_m.data.labels.push(timeIndex++);
	chart_m.data.datasets[0].data.push(data.m.x);
    chart_m.data.datasets[1].data.push(data.m.y);
    chart_m.data.datasets[2].data.push(data.m.z);

    // ограничение размера (как осциллограф)
    if (chart_g.data.labels.length > MAX_POINTS) {
        chart_g.data.labels.shift();

        chart_g.data.datasets.forEach(ds => {
            ds.data.shift();
        });
    }

    // авто-масштабирование
    autoScale(chart_g);
    autoScale(chart_a);
    autoScale(chart_m);

    chart_g.update('none');
    chart_a.update('none');
    chart_m.update('none');
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
/*
let minY = Infinity;
let maxY = -Infinity;

function updateMinMax(data) {
    const values = [data.x, data.y, data.z];

    for (const v of values) {
        if (v < minY) minY = v;
        if (v > maxY) maxY = v;
    }

    const padding = (maxY - minY) * 0.1 || 1;

    chart.options.scales.y.min = minY - padding;
    chart.options.scales.y.max = maxY + padding;
}
*/


// 🎛 UI для включения/выключения осей
function createControlsAxes() {
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

function createControls()
{
	const chartEl_g = document.getElementById('chart_g');
    chartEl_g.parentNode.insertBefore(createControlsAxes(), document.getElementById('chart_g'));
	
	const chartEl_a = document.getElementById('chart_a');
    chartEl_a.parentNode.insertBefore(createControlsAxes(), document.getElementById('chart_a'));
	
	const chartEl_m = document.getElementById('chart_m');
    chartEl_m.parentNode.insertBefore(createControlsAxes(), document.getElementById('chart_m'));
}



