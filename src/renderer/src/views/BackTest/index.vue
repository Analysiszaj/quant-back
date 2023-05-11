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
            class="!w-[100%]"
          />
        </el-form-item>
        <el-form-item label="回测周期" size="default">
          <el-select v-model="backTestOption.period" placeholder="请选择周期" class="!w-[100%]">
            <el-option label="小时" value="小时" />
            <el-option label="天" value="天" />
          </el-select>
        </el-form-item>
        <el-form-item label="初始资金">
          <el-input
            v-model="backTestOption.initialCapital"
            placeholder="请输入初始资金"
            class="w-[100%]"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="startBackTest" class="mx-auto w-[50%]">
            开始回测
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="display-box">
      <div class="back-chart flex flex-col px-[18px] pb-[18px]">
        <div class="text-center text-[18px] my-[12px] font-[900]">回测结果</div>
        <div
          class="flex-1 flex border-solid border-[#e5e7eb] border-[1px]"
          v-if="backDetail.length !== 0 && capital.length !== 0"
        >
          <div class="relative h-[100%] flex-1">
            <BackTestCharts class="absolute h-[100%] w-[100%]" :capital="capital" />
          </div>
          <BackTestInfo :backDetail="backDetail[0]" />
        </div>
        <el-empty description="暂未开始回测" v-else />
      </div>
      <div class="back-table px-[8px]">
        <div class="text-center text-[18px] my-[12px] font-[900]">交易详情</div>
        <div style="position: relative; width: 100%">
          <div v-if="tableData.length !== 0" style="position: absolute; width: 100%">
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              height="375"
              :row-class-name="tableRowClassName"
            >
              <el-table-column prop="td_stock_code" label="股票代码" min-width="50" />
              <el-table-column prop="td_buy_date" label="买入日期" min-width="50" />
              <el-table-column prop="td_sell_date" label="卖出日期" min-width="50" />
              <el-table-column prop="td_buy_price" label="买入金额" min-width="50" />
              <el-table-column prop="td_sell_price" label="卖出金额" min-width="50" />
              <el-table-column prop="td_buy_num" label="交易份额" min-width="50" />
              <el-table-column prop="td_loss" label="盈亏" min-width="50" />
            </el-table>
          </div>
          <el-empty description="暂未开始回测" v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BackTestCharts from './components/BackTestCharts.vue'
import BackTestInfo from './components/BackTestInfo.vue'
import { onMounted, ref, toRaw } from 'vue'
const backTestOption = ref({
  strategyName: '', // 策略名称
  backTestType: '1', // 回测类型
  stockList: [], // 股票池
  period: '', // 回测周期
  backTestDate: '', // 回测时间
  initialCapital: 10000 // 初始资金
})

const strategyList = ref([])
const stockList = ref([])
const tableData = ref([]) // 回测结果
const backDetail = ref([])
const capital = ref([])

onMounted(() => {
  initData()
})

// 初始化
const initData = async () => {
  // @ts-ignore
  stockList.value = await window.api.queryStockName()
  // @ts-ignore
  strategyList.value = await window.api.strategyAll()
}

const startBackTest = async () => {
  // @ts-ignore
  const code = await window.api.startBackTest(toRaw(backTestOption.value))
  // @ts-ignore
  tableData.value = await window.api.queryTranDetail(code)
  // @ts-ignore
  backDetail.value = await window.api.queryBackTestDetail(code)
  // @ts-ignore
  capital.value = await window.api.queryCapital(code)

  // console.log(code)
  // console.log(tableData)
  // console.log(backDetail)
  // console.log(capital)
}

const tableRowClassName = (row, _rowIndex) => {
  if (row.row.td_loss < 0) {
    return 'fall'
  } else {
    return 'rose'
  }
}
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

:deep(.rose) {
  background-color: #fca5a5;
}
:deep(.fall) {
  background-color: #6ee7b7;
}
</style>
