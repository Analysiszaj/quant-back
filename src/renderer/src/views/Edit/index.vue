<template>
  <div class="main">
    <Sidebar v-model:code="code" @selectfilehandle="selectFileHandle"></Sidebar>
    <Editor class="flex-1" v-model:code="code" :selectFilePath="selectFilePath"></Editor>
  </div>
</template>

<script setup lang="ts">
import Editor from './components/Editor.vue'
import Sidebar from './components/Sidebar.vue'
import { onMounted, ref } from 'vue'
const code = ref(`
// 卖出方法
function sell(){
 console.log('hahahha')
}

// 买入方法
function buy(){

}
`)

const selectFilePath = ref('')
const selectFileHandle = (path) => {
  selectFilePath.value = path
}

onMounted(() => {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      event.preventDefault()
    }
  })
})
</script>

<style scoped>
.main {
  display: flex;
}
.flex-1 {
  flex: 1;
}
</style>
