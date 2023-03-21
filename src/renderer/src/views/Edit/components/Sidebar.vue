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
      <div class="util-item add">
        <i class="bx bx-folder-plus icon"></i>
        <span>add</span>
      </div>
    </div>

    <!-- 文件列表 -->
    <div class="file-list">
      <ul>
        <li v-for="(item, key) in fileList" :key="key" class="file-item">
          <i class="bx bx-file icon"></i>
          <span>{{ item.fileName }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Ref } from 'vue'
interface fileListProps {
  fileName: string
  filePath: string
}

const fileList: Ref<Array<fileListProps>> = ref([
  {
    fileName: '第一个策略',
    filePath: '/'
  },
  {
    fileName: '第二个策略',
    filePath: '/'
  },
  {
    fileName: '第三个策略',
    filePath: '/'
  }
])
</script>

<style scoped>
.sidebar-main {
  width: 240px;
  padding: 10px 14px;
  background-color: #f8fafd;
  border-left: 1px solid #abafb9;
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
.sidebar-main .icon {
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
  background-color: #f4f6fc;
}
</style>
