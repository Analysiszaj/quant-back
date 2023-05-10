import { ipcMain, app } from 'electron'
import { db } from './db'
import dayjs from 'dayjs'
import fs from 'fs'
;`
**回测表**
  回测id
  开始时间
  结束时间
  最大盈利
  最大亏损
  最大回撤
  回测周期
  策略名称
  回测类型
  初始资金
  结束资金

**交易详情表**
  交易id
  回测id
  股票代码
  买入日期
  卖出日期
  买入数量
  买入金额
  卖出金额
  盈亏

**资金曲线表**
  回测id
  日期
  资金
`

// 开始回测
ipcMain.handle('startBackTest', async (_event, selectFrom) => {
  const period = selectFrom.period
  const startDate = dateFormat(selectFrom.backTestDate[0], period)
  const endDate = dateFormat(selectFrom.backTestDate[1], period)
  const strategyMap: any = await readStrategy(selectFrom.strategyName)
  const stockData = await getStockData(selectFrom.stockList, startDate, endDate, period)
  // 拿到相应的数数据创建以时间为索引的map
  // @ts-ignore
  const dateMapData = stockData.map((item) => {
    const map = {}
    item.forEach((item1) => {
      return (map[item1.datetime] = item1)
    })
    return map
  })

  // 创建时间索引
  const dateIndexList = createDateIndex(startDate, endDate, period)
  // 创建时间map用来记录资金曲线
  const dateMap = dateIndexList.reduce((acc, cur) => {
    acc[cur] = ''
    return acc
  }, {})
  const strategyObj = new strategyMap(
    selectFrom.stockList.length,
    dateMap,
    parseInt(selectFrom.initialCapital)
  )

  for (let date of dateIndexList) {
    for (let stockData of dateMapData) {
      const itemData = stockData[date]
      if (stockData[date]) {
        strategyObj.init(itemData, date)
        strategyObj.buy(itemData, date)
        strategyObj.sell(itemData, date)
      }
    }
  }

  // 回测结束记录
  const strategyInfo = strategyObj.getData()

  // 记录本次回测
  saveBackTest(
    selectFrom.strategyName,
    startDate,
    endDate,
    period,
    selectFrom.initialCapital,
    selectFrom.backTestType,
    strategyInfo
  )
})

async function getStockData(stockList, startDate?: string, endDate?: string, period?: string) {
  const stockDataList: any[] = []
  for (let stock_code of stockList) {
    let reslut = await queryData(stock_code, startDate, endDate)
    stockDataList.push(reslut)
  }
  return stockDataList
}

// 查询相应时间段的数据
function queryData(code, startDate, endDate) {
  return new Promise((resovle, reject) => {
    const sql = `select * from detail where stock_code = '${code}'
    and
    datetime >= '${startDate}'
    and
    datetime <= '${endDate}'
    `
    console.log(sql)
    db.all(sql, (err, res) => {
      if (err) throw err
      resovle(res)
    })
  })
}
// 时间格式化
function dateFormat(dateString, preiod) {
  if (preiod === '天') {
    return dayjs(dateString).format('YYYY-MM-DD')
  } else {
    return dayjs(dateString).format('YYYY-MM-DD hh:mm:ss')
  }
}

// 创建指点时间内的索引
function createDateIndex(startDate, endDate, preiod) {
  const start = dayjs(startDate).startOf('day')
  const end = dayjs(endDate).endOf('day')
  const preiodFmt = preiod === '天' ? 'day' : 'hour'

  const timeIndex: string[] = []
  for (let current = start; current <= end; current = current.add(1, preiodFmt)) {
    const tempDate =
      preiodFmt === 'day' ? current.format('YYYY-MM-DD') : current.format('YYYY-MM-DD hh:mm:ss')
    timeIndex.push(tempDate)
  }
  return timeIndex
}

// 读取策略转换成对象
function readStrategy(filePath) {
  return new Promise((resolve, rejects) => {
    fs.readFile(filePath, 'utf-8', function (err, dataStr) {
      const strategy = new Function(`return ${dataStr}`)()
      resolve(strategy)
    })
  })
}
/**
 *
 * @param startDate 开始时间
 * @param endDate   结束时间
 * @param period    回测周期
 * @param strategyInfo  // 交易对象
 */
function saveBackTest(
  strategyName,
  startDate,
  endDate,
  period,
  initialCapital,
  backTestType,
  strategyInfo
) {
  const tempstrategyName = strategyName.split('/')[2]
  const tempStartDate = startDate // 开始时间
  const tempEndDate = endDate // 结束时间
  const tempPreiod = period // 回测周期
  const tempInitialCapital = initialCapital // 初始资金
  const tempBackTestType = backTestType === '1' ? '单只回测' : '批量回测'
  const tranList = strategyInfo.TRANSACTION // 交易记录
  const capitalLineMap = fillCapitalLine(strategyInfo.CAPITAL_CURVE, initialCapital) // 资金曲线
  const endCapital = capitalLineMap[tempEndDate] // 结束资金

  const maxProfit = tranList.reduce((prev, curr) => {
    return curr.loss > prev ? curr.loss : prev
  }, 0)

  const maxLoss = tranList.reduce((prev, curr) => {
    return curr.loss < prev ? curr.loss : prev
  }, 0)

  console.log(`
    策略名称：${tempstrategyName}
    开始时间：${tempStartDate}
    结束时间：${tempEndDate}
    回测类型：${tempBackTestType}
    回测周期：${tempPreiod}
    初始资金：${tempInitialCapital}
    资金曲线：${capitalLineMap}
    最大盈利：${maxProfit}
    最大亏损：${maxLoss}
    结束资金：${endCapital}
  `)
}

// 填补资金曲线值空缺
function fillCapitalLine(capitalLineMap, initialCapital) {
  const tempCapitalLineMap = capitalLineMap

  // 对资金曲线进行处理填补空值
  let initCap = true
  let tempValue = 0
  const dateIndexList = Object.keys(tempCapitalLineMap)
  dateIndexList.forEach((item) => {
    if (tempCapitalLineMap[item] === '') {
      // 如果是刚开始值
      if (initCap) {
        tempCapitalLineMap[item] = initialCapital
      } else {
        tempCapitalLineMap[item] = tempValue
      }
    } else {
      // 有值了就说明交易了
      initCap = false
      tempValue = tempCapitalLineMap[item]
    }
  })
  return tempCapitalLineMap
}
