<script setup lang="ts">
import Menu from './components/Menu.vue'
</script>

<template>
  <div class="root">
    <Menu></Menu>
    <router-view class="right"></router-view>
  </div>
</template>

<style lang="css">
.root {
  display: flex;
}
.right {
  flex: 1;
}
</style>
