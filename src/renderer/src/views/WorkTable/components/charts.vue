<template>
  <div id="real_time"></div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { onMounted } from 'vue'
onMounted(async () => {
  const myChart = echarts.init(document.getElementById('real_time') as HTMLElement)
  const data = await InitData()
  if (data.length === 0) {
    return
  }
  const newData = data.map((item) => {
    const time = dayjs(item[0]).format('HH:mm')
    return [time, item[4]]
  })
  console.log(newData)
  const option = {
    title: {
      text: '今日上证指数'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        params = params[0]
        return params.value[0] + '  ' + params.value[1]
      },
      axisPointer: {
        animation: false
      }
    },
    xAxis: {
      type: 'category',
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      min: function (value) {
        return parseInt(value.min) - 20
      },
      max: function (value) {
        return parseInt(value.max) + 20
      },
      maxInterval: 100,
      minInterval: 1,
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: 'Fake Data',
        type: 'line',
        showSymbol: false,
        data: newData
      }
    ]
  }
  myChart.setOption(option)
  window.onresize = function () {
    myChart.resize()
  }
})

const InitData = () => {
  // 获取当天距离开盘过去多少时间
  const startDate = dayjs().hour(9).minute(29)
  const interval = dayjs().diff(startDate, 'minute')
  const url = `http://ifzq.gtimg.cn/appstock/app/kline/mkline?param=sh000001,m1,,${interval - 90}`
  return fetch(url, {
    method: 'GET'
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.data['sh000001'].m1.length !== 0) {
        return res.data['sh000001'].m1
      } else {
        return []
      }
    })
}
</script>

<style scoped></style>
