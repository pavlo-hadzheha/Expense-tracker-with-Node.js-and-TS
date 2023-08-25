<template>
  <div>
    <button @click="toggleSortOrder">Toggle sort order</button>
    <List :items="sortedItems"/>
  </div>
</template>

<script setup>
import useSorting from './useSorting.js'

const items = [
  { id: 1, text: 'Item 1' },
  { id: 2, text: 'Item 2' },
  { id: 3, text: 'Item 3' }
]

const { sortOrder, sortedItems, toggleSortOrder } = useSorting(items)
</script>
