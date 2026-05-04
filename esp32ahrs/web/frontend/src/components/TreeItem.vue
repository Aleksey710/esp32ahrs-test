<script setup lang="ts">
import { ref } from 'vue'

// ----------------------------------------------------------------------
// Types

export interface TreeItemModel {
	title: string
	view: string
	children?: TreeItemModel[]
}

// ----------------------------------------------------------------------
// Props

const props = defineProps<{
	item: TreeItemModel
}>()

// ----------------------------------------------------------------------
// Emits

const emit = defineEmits<{
	(e: 'select', item: TreeItemModel): void
}>()

// ----------------------------------------------------------------------
// State

const open = ref<boolean>(false)

// ----------------------------------------------------------------------
// Logic

function handleClick(): void {
	if (props.item.children?.length) {
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
