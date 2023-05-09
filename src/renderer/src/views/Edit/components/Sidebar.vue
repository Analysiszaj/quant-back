<template>
  <div class="sidebar-main">
    <!-- 头部 -->
    <div class="header">
      <div class="header-text">
        <span>工作空间</span>
      </div>
      <!-- <i class="bx bx-chevron-right toggle"></i> -->
    </div>

    <!-- 工具栏 -->
    <div class="util">
      <div class="util-item search">
        <i class="bx bx-search icon"></i>
        <input type="search" placeholder="search..." />
      </div>
      <div class="util-item add" @click="addFile">
        <i class="bx bx-folder-plus icon"></i>
        <span>add</span>
      </div>
    </div>

    <!-- 文件列表 -->
    <div class="file-list">
      <ul>
        <li
          v-for="(item, key) in fileList"
          :key="key"
          class="file-item"
          @click="selectFileOn(key)"
          @mousedown.right="mouseRight($event, item.filePath)"
          :class="{ select: key === selectFile }"
        >
          <i class="bx bx-file icon"></i>
          <span>{{ item.fileName }}</span>
        </li>
        <li
          class="file-item box-border"
          :class="{ select: selectFile === -1 }"
          v-if="selectFile === -1"
        >
          <i class="bx bx-file icon"></i>
          <input type="text" v-model="fileName" class="flex-1 w-[100%]" @blur="onBlur" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { Ref } from 'vue'
interface fileListProps {
  fileName: string
  filePath: string
}

//@ts-ignore
const props = defineProps(['code'])
const emit = defineEmits(['update:code', 'selectfilehandle'])
const selectFile = ref(0)
const lastSelect = ref()
const fileName = ref('')
const fileList: Ref<Array<fileListProps>> = ref([])

onMounted(() => {
  getAllFile()
})

// 获取所有文件
const getAllFile = async () => {
  // @ts-ignore
  fileList.value = await window.api.strategyAll()
  if (selectFile.value >= fileList.value.length) {
    selectFile.value = 0
  }
  if (fileList.value.length === 0) {
    selectFile.value = -1
  }
  selectFileOn(selectFile.value)
}

// 选中文件
const selectFileOn = async (index) => {
  selectFile.value = index

  if (selectFile.value !== -1) {
    // @ts-ignore
    const codeResult = await window.api.strategyRead(fileList.value[index].filePath)
    emit('update:code', codeResult)
    emit('selectfilehandle', fileList.value[index].fileName)
  } else {
    emit('update:code', '')
    emit('selectfilehandle', '')
  }
}

// 增加文件
const addFile = () => {
  lastSelect.value = selectFile.value
  selectFile.value = -1
}

// 失去焦点后
const onBlur = async () => {
  if (fileName.value === '') {
    selectFile.value = lastSelect.value
    return
  }

  const template = `
  class strategy {
    // 卖出方法
    function sell(){

    }

    // 买入方法
    function buy(){

    }
  }
  `
  // @ts-ignore
  const saveReuslt = await window.api.strategySave(fileName.value, template)
  if (saveReuslt === '保存文件失败') {
    ElMessage.error(saveReuslt)
    selectFile.value = lastSelect.value
    return
  }

  getAllFile()
  selectFile.value = fileList.value.length
  fileName.value = ''
}

// 鼠标右键删除
const mouseRight = async (event, filePath) => {
  event.preventDefault()
  // @ts-ignore
  window.api.openPopup(filePath)
  // @ts-ignore
  const result = await window.api.strategyDel()
  getAllFile()
}
</script>

<style scoped>
.sidebar-main {
  width: 240px;
  padding: 10px 14px;
  background-color: #f8fafd;
  border-left: 1px solid #abafb9;
  box-sizing: border-box;
}
.header {
  display: flex;
  position: relative;
}
.header .header-text {
  font-size: 12px;
}
.toggle {
  position: absolute;
  top: 50%;
  right: -25px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  width: 25px;
  background-color: #fcfdfe;
  border: 1px solid #cdd2de;
  font-size: 22px;
  border-radius: 50%;
  z-index: 1000;
}

/* 工具栏样式 */
.icon {
  font-size: 19px;
  min-width: 24px;
}
.util .util-item {
  display: flex;
  align-items: center;
  height: 32px;
  border-radius: 4px;
  padding: 0px 4px;
  color: var(--text-color);
  font-size: 14px;
  cursor: pointer;
}
.util .util-item:hover {
  background-color: #f4f6fc;
}
.util .search {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.util .search input {
  height: 100%;
  width: 100%;
  outline: none;
  border: none;
  background-color: transparent;
}

/* 文件列表 */
.file-list {
  border-top: 1px solid #abafb9;
  margin-top: 20px;
  padding-top: 20px;
}
.file-item {
  display: flex;
  align-items: center;
  height: 32px;
  border-radius: 4px;
  padding: 0px 4px;
  color: var(--text-color);
  font-size: 14px;
  cursor: pointer;
}
.file-item:hover {
  background-color: #dfe0e6;
}
.select {
  background-color: #dfe0e6;
}
</style>
