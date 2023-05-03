<template>
  <div class="bg-white w-screen h-screen flex flex-col">
    <div class="flex justify-end mt-[8px]">
      <el-radio-group v-model="activeName" size="small" class="mr-[8px]">
        <el-radio-button label="表格" />
        <el-radio-button label="图表" />
      </el-radio-group>
    </div>
    <div v-if="activeName === '表格'" class="flex-1 mt-[8px]">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2 border :columns="columns" :data="data" :width="width" :height="height" />
        </template>
      </el-auto-resizer>
    </div>
    <div v-if="activeName === '图表'" class="flex-1">
      <charts class="w-screen h-[100%]"></charts>
    </div>
  </div>
</template>

<script setup lang="ts">
import charts from './components/charts.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const activeName = ref('表格')
const columns = ref<any>([])
const data = ref([])

const route = useRoute()
onMounted(() => {
  initData()
})

const initData = async () => {
  // @ts-ignore
  const stockDetailList = await window.api.stockDetailAll(route.query.stock_code)
  let keyMap = Object.keys(stockDetailList[0])
  keyMap = keyMap.slice(1, keyMap.length)
  columns.value = keyMap.map((item) => {
    return {
      key: item,
      dataKey: item,
      title: item,
      width: 130,
      minWidth: 130
    }
  })
  data.value = stockDetailList
}
</script>

<style scoped></style>
