<template>
  <div class="main">
    <Sidebar></Sidebar>
    <Editor class="flex-1"></Editor>
  </div>
</template>

<script setup lang="ts">
import Editor from './components/Editor.vue'
import Sidebar from './components/Sidebar.vue'
</script>

<style scoped>
.main {
  display: flex;
}
.flex-1 {
  flex: 1;
}
</style>
