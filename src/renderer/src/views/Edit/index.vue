<template>
  <div class="main">
    <Sidebar v-model:code="code"></Sidebar>
    <Editor class="flex-1" v-model:code="code"></Editor>
  </div>
</template>

<script setup lang="ts">
import Editor from './components/Editor.vue'
import Sidebar from './components/Sidebar.vue'
import { ref } from 'vue'
const code = ref(`
// 卖出方法
function sell(){
 console.log('hahahha')
}

// 买入方法
function buy(){

}
`)
</script>

<style scoped>
.main {
  display: flex;
}
.flex-1 {
  flex: 1;
}
</style>
