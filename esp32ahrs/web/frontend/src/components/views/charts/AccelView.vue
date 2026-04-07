<template>
	<div>
		<h2>Акселерометр</h2>
		<canvas id="raw_chart" ref="raw_chart_canvas" width="800" height="200"></canvas>
		<div>*данные по частотному анализу появляются после накопления данных</div>
		<canvas id="fft_chart" ref="fft_chart_canvas" width="800" height="200"></canvas>
	</div>
	<div>
		<table id="raw_table"></table>
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
const fft_chart_canvas = ref(null)

let raw_chart = null;
let fft_chart = null;

onMounted(() => {
	raw_chart = initChart(raw_chart_canvas.value, 'a');
    fft_chart = initFFTChart(fft_chart_canvas.value, 'FFT a');
})
//----------------------------------------------------------------------
const { state } = useWebSocket()
const fftBuffers = { x: [], y: [], z: [] };
const fftCharts = {};

watch(
	() => state.imu.a,
	(a) => {
		//console.log('accel:', a.x, a.y, a.z)

		axesDataUpdate(raw_chart, a, timeIndex++);
		fftDataUpdate(fft_chart, fftBuffers, a);
	},
	{ deep: true }
)
</script>
