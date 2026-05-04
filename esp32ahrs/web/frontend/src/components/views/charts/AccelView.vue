<template>
	<div>
		<h2>Акселерометр</h2>

		<canvas
			id="raw_chart"
			ref="raw_chart_canvas"
			width="800"
			height="200"
		/>

		<div>
			*данные по частотному анализу появляются после накопления данных
		</div>

		<canvas
			id="fft_chart"
			ref="fft_chart_canvas"
			width="800"
			height="200"
		/>
	</div>

	<div>
		<table id="raw_table"></table>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

// ----------------------------------------------------------------------
// Imports

import * as tv from './js/tableHandler'

import { initChart, axesDataUpdate } from './js/chartHandler'
import { initFFTChart, fftDataUpdate } from './js/fftChartHandler'

import { useWebSocket } from '@/composables/useWebSocket'

// ----------------------------------------------------------------------
// Types

type AxisVector = {
	x: number
	y: number
	z: number
}

type IMUState = {
	a: AxisVector
}

type WebSocketState = {
	imu: IMUState
}

// ----------------------------------------------------------------------
// State

let timeIndex: number = 0

const MAX_POINTS: number = 300

const axesState = {
	x: true,
	y: true,
	z: true
}

let initialized: boolean = false

// ----------------------------------------------------------------------
// Refs

const raw_chart_canvas = ref<HTMLCanvasElement | null>(null)
const fft_chart_canvas = ref<HTMLCanvasElement | null>(null)

// ----------------------------------------------------------------------
// Charts

let raw_chart: Chart | null = null
let fft_chart: Chart | null = null

// ----------------------------------------------------------------------
// Init

onMounted((): void => {
	if (raw_chart_canvas.value) {
		raw_chart = initChart(raw_chart_canvas.value, 'a')
	}

	if (fft_chart_canvas.value) {
		fft_chart = initFFTChart(fft_chart_canvas.value, 'FFT a')
	}
})

// ----------------------------------------------------------------------
// WebSocket

const { state } = useWebSocket() as {
	state: WebSocketState
}

// ----------------------------------------------------------------------
// FFT buffers

const fftBuffers: {
	x: number[]
	y: number[]
	z: number[]
} = {
	x: [],
	y: [],
	z: []
}

const fftCharts: Record<string, unknown> = {}

// ----------------------------------------------------------------------
// Watch accelerometer

watch(
	() => state.imu?.a,
	(a): void => {
		if (!a || !raw_chart || !fft_chart) return

		axesDataUpdate(raw_chart, a, timeIndex++)
		fftDataUpdate(fft_chart, fftBuffers, a)
	},
	{ deep: true }
)
</script>
