import { ipcMain } from 'electron'
import { db } from './db'
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
  const startDate = dateFormat(selectFrom.backTestDate[0])
  const endDate = dateFormat(selectFrom.backTestDate[1])

  const stockData = await getStockData(selectFrom.stockList, startDate, endDate)
  console.log(stockData)
})

async function getStockData(stockList, startDate?: string, endDate?: string) {
  return new Promise((resolve, rejects) => {
    const sql = `select * from detail where stock_code in (${stockList
      .map((item) => `'${item}'`)
      .toString()})
      and
      datetime >= '${startDate}'
      and
      datetime <= '${endDate}'
      `
    console.log(sql)
    db.all(sql, (err, res) => {
      if (err) throw err
      resolve(res)
    })
  })
}

function sqlQueryData(stockList, startDate?: string, endDate?: string) {}

function dateFormat(dateString) {
  return new Date(dateString)
    .toLocaleDateString()
    .replace(/\//g, '-')
    .replace(/\b\d\b/g, '0$&')
}
