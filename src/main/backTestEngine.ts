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
  const strategyObj = new strategyMap()
  const stockData = await getStockData(selectFrom.stockList, startDate, endDate, period)
  console.log(strategyObj)
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
