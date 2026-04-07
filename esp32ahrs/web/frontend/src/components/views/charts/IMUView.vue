<template>
	<div>
		<h2>Гироскоп</h2>
		<canvas id="g_raw_chart" ref="raw_chart_canvas" width="800" height="200"></canvas>
		<div>*данные по частотному анализу появляются после накопления данных</div>
		<canvas id="g_fft_chart" ref="fft_chart_canvas" width="800" height="200"></canvas>
	</div>
	<div>
		<table id="g_raw_table"></table>
	</div>
	<div>
		<h2>Акселерометр</h2>
		<canvas id="a_raw_chart" ref="raw_chart_canvas" width="800" height="200"></canvas>
		<div>*данные по частотному анализу появляются после накопления данных</div>
		<canvas id="a_fft_chart" ref="fft_chart_canvas" width="800" height="200"></canvas>
	</div>
	<div>
		<table id="a_raw_table"></table>
	</div>
</template>

<script setup>
//import * as dv from './js/3DView.js';
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

import * as tv from './js/tableHandler.js';
import { initChart, axesDataUpdate } from './js/chartHandler.js';
import { initFFTChart, fftDataUpdate } from './js/fftChartHandler.js';

import { watch } from 'vue'
import { useWebSocket } from '@/composables/useWebSocket.js'
//----------------------------------------------------------------------
// gyro
//----------------------------------------------------------------------
let g_timeIndex = 0;

const g_MAX_POINTS = 300;

// состояние осей
const g_axesState = {
    x: true,
    y: true,
    z: true
};

let g_initialized = false;

const g_raw_chart_canvas = ref(null);
const g_fft_chart_canvas = ref(null)

let g_raw_chart = null;
let g_fft_chart = null;

onMounted(() => {
	g_raw_chart = initChart(g_raw_chart_canvas.value, 'g');
    g_fft_chart = initFFTChart(g_fft_chart_canvas.value, 'FFT g');
})
//----------------------------------------------------------------------
const { g_state } = useWebSocket()
const g_fftBuffers = { x: [], y: [], z: [] };
const g_fftCharts = {};

watch(
	() => state.imu.g,
	(g) => {
		//console.log('accel:', g.x, g.y, g.z)

		axesDataUpdate(g_raw_chart, g, timeIndex++);
		fftDataUpdate(g_fft_chart, g_fftBuffers, g);
	},
	{ deep: true }
)
//----------------------------------------------------------------------
// acc
//----------------------------------------------------------------------
let a_timeIndex = 0;

const a_MAX_POINTS = 300;

// состояние осей
const a_axesState = {
    x: true,
    y: true,
    z: true
};

let a_initialized = false;

const a_raw_chart_canvas = ref(null);
const a_fft_chart_canvas = ref(null)

let a_raw_chart = null;
let a_fft_chart = null;

onMounted(() => {
	a_raw_chart = initChart(a_raw_chart_canvas.value, 'a');
    a_fft_chart = initFFTChart(a_fft_chart_canvas.value, 'FFT a');
})

//----------------------------------------------------------------------
const { a_state } = useWebSocket()
const a_fftBuffers = { x: [], y: [], z: [] };
const a_fftCharts = {};

watch(
	() => state.imu.a,
	(a) => {
		//console.log('accel:', a.x, a.y, a.z)

		axesDataUpdate(a_raw_chart, a, a_timeIndex++);
		fftDataUpdate(a_fft_chart, a_fftBuffers, a);
	},
	{ deep: true }
)

</script>
