<template>
  <div id="backTestMain"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, watch } from 'vue'
const props = defineProps(['capital'])
onMounted(() => {
  var myChart = echarts.init(document.getElementById('backTestMain') as HTMLElement)
  const data = props.capital.map((item) => {
    return [item.bt_date, item.bt_price]
  })
  const option = {
    title: {
      text: '资金曲线'
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
          params.value[1]
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
        name: 'Fake Data',
        type: 'line',
        showSymbol: false,
        data: data
      }
    ]
  }
  myChart.setOption(option)
  watch(
    () => props.capital,
    (newVal, _oldVal) => {
      const data = newVal.map((item) => {
        return [item.bt_date, item.bt_price]
      })
      myChart.setOption({
        series: [
          {
            data: data
          }
        ]
      })
    }
  )

  window.onresize = function () {
    myChart.resize()
  }
})
</script>

<style scoped></style>
