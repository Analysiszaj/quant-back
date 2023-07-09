<template>
  <div class="px-[8px] pt-[8px]">
    <el-card class="h-[450px]" :body-style="{ position: 'relative', height: '100%' }">
      <charts class="w-[100%] h-[100%] border-solid border-[#e5e7eb] border-[1px] p-[4px]"></charts>
    </el-card>

    <el-row :gutter="12" class="mt-[12px]">
      <el-col :span="8" @click="toPath('/edit')">
        <el-card shadow="always">
          <div class="data-item-tilte">策略总数</div>
          <div class="data-item-num">10</div>
        </el-card>
      </el-col>
      <el-col :span="8" @click="toPath('/data')">
        <el-card shadow="hover">
          <div>数据总数</div>
          <div class="data-item-num">10</div>
        </el-card>
      </el-col>
      <el-col :span="8" @click="toPath('/historical')">
        <el-card shadow="never">
          <div>历史回测数</div>
          <div class="data-item-num">3</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import charts from './components/charts.vue'
const router = useRouter()
const toPath = (path) => {
  router.push(path)
}
</script>

<style scoped lang="scss">
.data-item-num {
  @apply font-[900] text-[24px] my-[8px] cursor-pointer;
}
</style>
