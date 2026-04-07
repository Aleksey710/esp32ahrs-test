<script setup>
import { ref } from 'vue'

const props = defineProps({
  item: Object
})

const emit = defineEmits(['select'])

const open = ref(false)

function handleClick() {
  if (props.item.children) {
    open.value = !open.value
  } else {
    emit('select', props.item)
  }
}
</script>

<template>
  <div class="tree-item">
    <div @click="handleClick">
      {{ item.children ? (open ? '▼' : '▶') : '•' }}
      {{ item.title }}
    </div>

    <div v-if="item.children && open" class="children">
      <TreeItem
        v-for="child in item.children"
        :key="child.title"
        :item="child"
        @select="emit('select', $event)"
      />
    </div>
  </div>
</template>

<style>
.tree-item {
  cursor: pointer;
  padding: 5px;
}

.children {
  margin-left: 15px;
}
</style>
