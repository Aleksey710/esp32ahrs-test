<template>
	<div>
		<h2>Гироскоп</h2>
		<canvas id="raw_chart" ref="raw_chart_canvas" width="800" height="200"></canvas>
		<div>*данные по частотному анализу появляются после накопления данных</div>
		<canvas id="fft_chart" ref="fft_chart_canvas" width="800" height="200"></canvas>
		<div ref="treeScene_canvas" width="800" height="200"></div>
	</div>
	<div>
		<table id="raw_table"></table>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

//import * as tv from './js/tableHandler.js';
import { initChart, axesDataUpdate } from './js/chartHandler.js';
import { initFFTChart, fftDataUpdate } from './js/fftChartHandler.js';
import { init3DView, treeDataUpdate } from './js/3DView.js';

import { watch } from 'vue'
import { useWebSocket } from '@/composables/useWebSocket.js'
//----------------------------------------------------------------------
let timeIndex = 0;

const MAX_POINTS = 300;

// состояние осей
const axesState = {
    x: true,
    y: true,
    z: true
};

let initialized = false;

const raw_chart_canvas = ref(null);
const fft_chart_canvas = ref(null);
const treeScene_canvas = ref(null);

let raw_chart = null;
let fft_chart = null;
let obj = null;

onMounted(() => {
	raw_chart = initChart(raw_chart_canvas.value, 'g');
    fft_chart = initFFTChart(fft_chart_canvas.value, 'FFT g');
    
    obj = init3DView(treeScene_canvas.value);
})
//----------------------------------------------------------------------
const { state } = useWebSocket()
const fftBuffers = { x: [], y: [], z: [] };
const fftCharts = {};

watch(
	() => state.imu.g,
	(g) => {
		//console.log('gyro:', g.x, g.y, g.z)

		axesDataUpdate(raw_chart, g, timeIndex++);
		fftDataUpdate(fft_chart, fftBuffers, g);
		
		//treeDataUpdate(obj, g);
		treeDataUpdate(obj, state);
		
	},
	{ deep: true }
)
//----------------------------------------------------------------------





//----------------------------------------------------------------------
</script>


