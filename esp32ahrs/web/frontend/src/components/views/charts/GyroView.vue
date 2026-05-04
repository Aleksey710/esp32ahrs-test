<template>
	<div>
		<h2>Гироскоп</h2>

		<canvas
			id="raw_chart"
			ref="raw_chart_canvas"
			width="800"
			height="150"
		/>

		<div>
			*данные по частотному анализу появляются после накопления данных
		</div>

		<canvas
			id="fft_chart"
			ref="fft_chart_canvas"
			width="800"
			height="100"
		/>

		<div ref="treeScene_canvas" />

	</div>

	<div>
		<table id="raw_table"></table>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, type Ref } from 'vue'
import Chart from 'chart.js/auto'

// ----------------------------------------------------------------------
// Imports

import { initChart, axesDataUpdate } from './js/chartHandler'
import { initFFTChart, fftDataUpdate } from './js/fftChartHandler'
import { init3DView, onSensorData } from './js/3DView_v2'

import quad_x_model_url from '@/models/quad_x.gltf?url'

import { useWebSocket } from '@/composables/useWebSocket'

// ----------------------------------------------------------------------
// Types

type AxisVector = {
	x: number
	y: number
	z: number
}

type IMUState = {
	g: AxisVector
	a?: AxisVector
}

type WebSocketState = {
	imu: IMUState
}

// ----------------------------------------------------------------------
// Refs

const raw_chart_canvas = ref<HTMLCanvasElement | null>(null)
const fft_chart_canvas = ref<HTMLCanvasElement | null>(null)
const treeScene_canvas = ref<HTMLDivElement | null>(null)

// ----------------------------------------------------------------------
// Charts

let raw_chart: Chart | null = null
let fft_chart: Chart | null = null

// ----------------------------------------------------------------------
// State

let timeIndex = 0

const MAX_POINTS = 300

const axesState = {
	x: true,
	y: true,
	z: true
}

const fftBuffers: {
	x: number[]
	y: number[]
	z: number[]
} = {
	x: [],
	y: [],
	z: []
}

// ----------------------------------------------------------------------
// Init

onMounted((): void => {
	if (raw_chart_canvas.value) {
		raw_chart = initChart(raw_chart_canvas.value, 'g')
	}

	if (fft_chart_canvas.value) {
		fft_chart = initFFTChart(fft_chart_canvas.value, 'FFT g')
	}

	if (treeScene_canvas.value) {
		init3DView(treeScene_canvas.value, quad_x_model_url)
	}
})

// ----------------------------------------------------------------------
// WebSocket

const { state } = useWebSocket() as {
	state: WebSocketState
}

// ----------------------------------------------------------------------
// Watch IMU gyro

watch(
	() => state.imu?.g,
	(g): void => {
		if (!g || !raw_chart || !fft_chart) return

		axesDataUpdate(raw_chart, g, timeIndex++)
		fftDataUpdate(fft_chart, fftBuffers, g)

		onSensorData(state)
	},
	{ deep: true }
)
</script>
