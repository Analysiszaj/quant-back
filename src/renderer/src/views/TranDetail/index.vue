<template>
  <div id="main" class="w-[100vw] h-[100vh]"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, toRaw } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
onMounted(async () => {
  console.log(route.query)
  //@ts-ignore
  const stockDetailList = await window.api.stockDetailAll(route.query.stock_code)

  // 数据预处理
  const rawData = toRaw(stockDetailList)
  const rawDataLength = rawData.length
  console.log(rawDataLength)
  const buyPrice = rawData.filter((item) => {
    return item.datetime === route.query.start_date
  })

  const sellPrice = rawData.filter((item) => {
    return item.datetime === route.query.end_date
  })
  // x轴数据
  const categoryData = rawData.map((item) => {
    return item.datetime
  })
  // y轴数据
  const yAxisData = rawData.map((item) => {
    return [item.open, item.close, item.low, item.high]
  })
  // 成交量数据
  const volumes = rawData.map((item, index) => {
    return [index, item.volume, item.open > item.close ? 1 : -1]
  })
  var myChart = echarts.init(document.getElementById('main') as HTMLElement)
  const option = {
    animation: false,
    legend: {
      bottom: 10,
      left: 'center',
      data: ['k线', 'MA5', 'MA10', 'MA20', 'MA30']
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      borderWidth: 1,
      broderColor: '#ccc',
      padding: 10,
      textStyle: {
        color: '#000'
      },
      // @ts-ignore
      position: function (pos, params, el, elRect, size) {
        const obj = {
          top: 10
        }
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
        return obj
      }
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: 'all'
        }
      ],
      label: {
        backgroundColor: '#777'
      }
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: false
        },
        brush: {
          type: ['lineX', 'clear']
        }
      }
    },
    brush: {
      xAxisIndex: 'all',
      brushLink: 'all',
      outOfBrush: {
        colorAlpha: 0.1
      }
    },
    visualMap: {
      show: false,
      seriesIndex: 5,
      dimension: 2,
      pieces: [
        {
          value: 1,
          color: '#00da3c'
        },
        {
          value: -1,
          color: '#ec0000'
        }
      ]
    },
    grid: [
      {
        left: '10%',
        right: '8%',
        height: '50%'
      },
      {
        left: '10%',
        right: '8%',
        top: '63%',
        height: '16%'
      }
    ],
    xAxis: [
      {
        type: 'category',
        data: categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax',
        axisPointer: {
          z: 100
        }
      },
      {
        type: 'category',
        gridIndex: 1,
        data: categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        min: 'dataMin',
        max: 'dataMax'
      }
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true
        }
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false }
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 0,
        end: 100
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: 'slider',
        top: '85%',
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        name: 'k线',
        type: 'candlestick',
        data: yAxisData,
        itemStyle: {
          color: '#ec0000',
          color0: ' #00da3c',
          borderColor: undefined,
          borderColor0: undefined
        },
        markPoint: {
          data: [
            {
              name: 'Mark',
              coord: [route.query.start_date, buyPrice[0].open],
              value: '买入',
              itemStyle: {
                color: '#ec0000'
              }
            },
            {
              name: 'Mark1',
              coord: [route.query.end_date, sellPrice[0].open],
              value: '卖出',
              itemStyle: {
                color: '#00da3c'
              }
            }
          ]
        },
        tooltip: {
          formatter: function (param) {
            param = param[0]
            return [
              'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
              'Open: ' + param.data[0] + '<br/>',
              'Close: ' + param.data[1] + '<br/>',
              'Low: ' + param.data[2] + '<br/>',
              'High: ' + param.data[3] + '<br/>'
            ].join('')
          }
        }
      },
      {
        name: 'MA5',
        type: 'line',
        data: calculateMA(5, yAxisData),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA10',
        type: 'line',
        data: calculateMA(10, yAxisData),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA20',
        type: 'line',
        data: calculateMA(20, yAxisData),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA30',
        type: 'line',
        data: calculateMA(30, yAxisData),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'Volume',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: volumes
      }
    ]
  }

  // 绘制图表
  myChart.setOption(option)

  window.onresize = function () {
    myChart.resize()
  }
})

const calculateMA = (dayCount, data) => {
  const result: any[] = []
  for (let i = 0, len = data.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-')
      continue
    }
    var sum = 0
    for (var j = 0; j < dayCount; j++) {
      sum += data[i - j][1]
    }
    result.push(+(sum / dayCount).toFixed(2))
  }
  return result
}
</script>

<style scoped></style>
