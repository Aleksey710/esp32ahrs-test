<template>
	<router-view />

	<div class="layout">
		<Sidebar @select="handleSelect" />

		<div class="content">
			<component :is="viewComponent" v-if="viewComponent" />
			<div v-else>Выберите пункт</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Component, defineAsyncComponent } from 'vue'

import Sidebar from './components/Sidebar.vue'
import { useWebSocket } from './composables/useWebSocket'

// ----------------------------------------------------------------------
// Types

type ViewKey = 'gyro' | 'accel' | 'mag'

interface SelectItem {
	view: ViewKey
}

// ----------------------------------------------------------------------
// State

const currentView = ref<ViewKey | null>(null)

function handleSelect(item: SelectItem): void {
	currentView.value = item.view
}

// ----------------------------------------------------------------------
// Lazy components (🔥 SAFE Vue way)

const GyroView = defineAsyncComponent(
	() => import('./components/views/charts/GyroView.vue')
)

const AccelView = defineAsyncComponent(
	() => import('./components/views/charts/AccelView.vue')
)

const MagView = defineAsyncComponent(
	() => import('./components/views/charts/MagView.vue')
)

const NotFoundView = defineAsyncComponent(
	() => import('./components/views/NotFoundView.vue')
)

// ----------------------------------------------------------------------
// Registry (NO Promise here!)

const viewMap: Record<ViewKey, Component> = {
	gyro: GyroView,
	accel: AccelView,
	mag: MagView
}

// ----------------------------------------------------------------------
// Resolver (💡 always returns Component or null)

const viewComponent = computed<Component | null>(() => {
	if (!currentView.value) return null

	return viewMap[currentView.value] ?? NotFoundView
})

// ----------------------------------------------------------------------
// WebSocket

const { wsConnect } = useWebSocket()

onMounted((): void => {
	const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'

	const url = import.meta.env.DEV
		? `${protocol}//localhost:8080`
		: `${protocol}//${location.host}/ws`

	console.log('setup WebSocket', url)

	wsConnect(url)
})
</script>

<style>
.layout {
	display: flex;
	height: 100vh;
}

.content {
	flex: 1;
	padding: 20px;
}
</style>
