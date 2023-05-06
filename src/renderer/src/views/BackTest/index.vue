<template>
  <div class="back-main">
    <div class="select-box py-[24px]">
      <el-form :model="backTestOption" size="default" class="px-[32px]">
        <el-form-item label="选择策略" size="default">
          <el-select
            v-model="backTestOption.strategyName"
            placeholder="请选择策略"
            class="w-[100%]"
          >
            <el-option
              :label="item['fileName']"
              :value="item['filePath']"
              v-for="(item, key) in strategyList"
              :key="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="回测类型" size="default">
          <el-radio-group v-model="backTestOption.backTestType" class="ml-4">
            <el-radio label="1" size="small">单只回测</el-radio>
            <el-radio label="2" size="small">批量回测</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择股票" v-if="backTestOption.backTestType === '1'">
          <el-select
            v-model="backTestOption.stockList[0]"
            placeholder="请选择股票"
            class="w-[100%]"
          >
            <el-option
              :label="item['stock_code']"
              :value="item['stock_code']"
              v-for="(item, key) in stockList"
              :key="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="批量选择" v-else>
          <el-select
            v-model="backTestOption.stockList"
            placeholder="请选择股票"
            multiple
            class="w-[100%]"
          >
            <el-option
              :label="item['stock_code']"
              :value="item['stock_code']"
              v-for="(item, key) in stockList"
              :key="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="回测时间">
          <el-date-picker
            v-model="backTestOption.backTestDate"
            type="daterange"
            range-separator="To"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="回测周期" size="default">
          <el-select
            v-model="backTestOption.strategyName"
            placeholder="请选择周期"
            class="w-[100%]"
          >
            <el-option label="小时" value="shanghai" />
            <el-option label="天" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="startBackTest" class="mx-auto w-[50%]">
            开始回测
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="display-box">
      <div class="back-chart"></div>
      <div class="back-table"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
const backTestOption = ref({
  strategyName: '', // 策略名称
  backTestType: '1', // 回测类型
  stockList: [],
  backTestDate: ''
})
const strategyList = ref([])
const stockList = ref([])

onMounted(() => {
  initData()
})

// 初始化
const initData = async () => {
  // @ts-ignore
  stockList.value = await window.api.queryStockName()
  // @ts-ignore
  strategyList.value = await window.api.strategyAll()
  console.log(strategyList)
}

const startBackTest = () => {}
</script>

<style scoped>
.back-main {
  display: flex;
  padding: 14px;
  box-sizing: border-box;
}

.select-box {
  flex: 1;
  height: 100%;
  background-color: white;
}
.display-box {
  display: flex;
  flex-direction: column;
  flex: 2;
  height: 100%;
  margin-left: 20px;
}
.display-box .back-chart {
  flex: 2;
  background-color: #fff;
}
.display-box .back-table {
  flex: 2;
  background-color: #fff;
  margin-top: 20px;
}
</style>
