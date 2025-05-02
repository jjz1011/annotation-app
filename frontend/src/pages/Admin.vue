
<template>
  <div>
    <h2>Admin Dashboard</h2>
    <button @click="queryProgress">Query Progress</button>
    <ul>
      <li v-for="item in progress" :key="item.user">
        {{ item.user }}: {{ item.count }} annotated
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const progress = ref([])

function queryProgress() {
  fetch('/api/progress')
    .then(res => res.json())
    .then(data => {
      progress.value = data
    })
}
</script>
