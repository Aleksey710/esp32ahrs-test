<template>
	<router-view />
	<div class="layout">
		<Sidebar @select="handleSelect" />
		<div class="content">
			<component :is="viewComponent" v-if="viewComponent"/>
			<div v-else>Выберите пункт</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'

import { useWebSocket } from './composables/useWebSocket'
//import * as ws from './utils/websocketHandler.js';

import GyroView from './components/views/charts/GyroView.vue'
import AccelView from './components/views/charts/AccelView.vue'
import MagView from './components/views/charts/MagView.vue'

import NotFoundView from './components/views/NotFoundView.vue'
//----------------------------------------------------------------------
const currentView = ref(null)

function handleSelect(item) {
  currentView.value = item.view
}
//----------------------------------------------------------------------
const viewComponent = computed(() => {
	switch (currentView.value) {
		case 'gyro': return GyroView
		case 'accel': return AccelView
		case 'mag': return MagView
		default: return NotFoundView
	}
})
//----------------------------------------------------------------------
const { wsConnect } = useWebSocket()

onMounted(() => {

    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    
    const url = import.meta.env.DEV
		? `${protocol}//localhost:8080`
		: `${protocol}//${location.host}/ws`;
		
	console.log('setup WebSocket', url);

	wsConnect(url);
})
//----------------------------------------------------------------------


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
