<template>
  <div class="root">
    <Menu></Menu>
    <router-view class="right"></router-view>
  </div>
</template>

<script setup lang="ts">
import Menu from '@renderer/components/Menu.vue'
</script>

<style scoped>
.root {
  display: flex;
}
.right {
  flex: 1;
}
</style>
