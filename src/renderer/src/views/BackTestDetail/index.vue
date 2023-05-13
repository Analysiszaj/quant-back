<template>
  <div class="py-[14px] px-[18px] flex flex-col w-[100vw] h-[100vh]">
    <el-card class="h-[320px] mb-[24px]" :body-style="{ position: 'relative', height: '100%' }">
      <div id="backTestMain" class="h-[100%]"></div>
    </el-card>
    <el-card class="flex-1" :body-style="{ position: 'relative', height: '100%' }">
      <div class="relative h-[100%]">
        <div class="absolute w-[100%] h-[100%]">
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            height="100%"
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
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { useRoute } from 'vue-router'
const route = useRoute()

const tableData = ref([])
const backDetail = ref([])
const capital = ref([])
const refernece = ref([])

onMounted(async () => {
  const code = route.query.bt_id
  // @ts-ignore
  tableData.value = await window.api.queryTranDetail(code)
  // @ts-ignore
  backDetail.value = await window.api.queryBackTestDetail(code)
  // @ts-ignore
  capital.value = await window.api.queryCapital(code)
  // @ts-ignore
  refernece.value = await window.api.querySH(
    backDetail.value[0]['bt_start_date'],
    backDetail.value[0]['bt_end_date']
  )
  console.log(refernece.value)
  // 对数据进行处理得到百分比
  var myChart = echarts.init(document.getElementById('backTestMain') as HTMLElement)
  const start_price = parseInt(backDetail.value[0]['bt_initial_capital'])

  const data = capital.value.map((item: any) => {
    return [item.bt_date, (((item.bt_price - start_price) / start_price) * 100).toFixed(2)]
  })

  const start_SH = refernece.value[0]['close']
  const SH_data = refernece.value.map((item: any) => {
    return [item.datetime, (((item.close - start_SH) / start_SH) * 100).toFixed(2)]
  })
  const option = {
    title: {
      text: '收益百分比曲线'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        params = params[0]
        var date = new Date(params.value[0])
        return (
          date.getDate() +
          '/' +
          (date.getMonth() + 1) +
          '/' +
          date.getFullYear() +
          ' : ' +
          params.value[1] +
          '%'
        )
      },
      axisPointer: {
        animation: false
      }
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: true
      }
    },
    series: [
      {
        name: '策略收益曲线',
        type: 'line',
        showSymbol: false,
        data: data
      },
      {
        name: '大盘曲线',
        type: 'line',
        showSymbol: false,
        data: SH_data
      }
    ]
  }
  myChart.setOption(option)
  window.onresize = function () {
    myChart.resize()
  }
})

const tableRowClassName = (row, _rowIndex) => {
  if (row.row.td_loss < 0) {
    return 'fall'
  } else {
    return 'rose'
  }
}
</script>

<style scoped>
:deep(.rose) {
  background-color: #fca5a5;
}
:deep(.fall) {
  background-color: #6ee7b7;
}
</style>
