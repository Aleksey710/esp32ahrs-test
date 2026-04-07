<script setup>
import TreeItem from './TreeItem.vue'

const menu = [
  {
    title: 'IMU',
    view: 'IMU',
    children: [
      { title: 'Gyroscope', view: 'gyro' },
      { title: 'Accelerometer', view: 'accel' }
    ]
  },
  {
    title: 'Magnetometer',
    view: 'mag'
  }
]

const emit = defineEmits(['select'])
</script>

<template>
  <div class="sidebar">
    <TreeItem
      v-for="item in menu"
      :key="item.title"
      :item="item"
      @select="emit('select', $event)"
    />
  </div>
</template>

<style>
.sidebar {
  width: 250px;
  background: #1e1e1e;
  color: white;
  padding: 10px;
}
</style>
