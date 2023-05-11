import sqlite3 from 'sqlite3'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import csv from 'csvtojson'
import { ipcMain } from 'electron'

const dirPath = app.getAppPath()
const dataBasePath = path.join(dirPath, '/database/data.db')
export let db
if (!fs.existsSync(dataBasePath)) {
  db = new sqlite3.Database(dataBasePath, function () {
    const createStockTabSql = `create table stock(
        id INTEGER primary key autoincrement not null,
        stock_code varchar(15),
        exchange varchar(15),
        start_date date,
        end_date date,
        date_type varchar(15)
      )`

    db.run(createStockTabSql, function (err) {
      if (err) {
        console.log(err)
      }
      console.log('创建股票数据库成功')
    })

    const createStockDetailSql = `
        create table detail(
          id INTEGER primary key autoincrement not null,
          stock_code varchar(15),
          datetime date,
          open float,
          high float,
          low float,
          close float,
          volume int,
          turnover int
        )
      `
    db.run(createStockDetailSql, function (err) {
      if (err) {
        console.log(err)
      }
      console.log('创建股票详细数据库成功')
    })

    const createBackTestSql = `
        create table back_test(
          bt_id varchar primary key not null,
          bt_strategy_name varchar(15),
          bt_start_date date,
          bt_end_date date,
          bt_max_profit float,
          bt_max_loss float,
          bt_preiod varchar,
          bt_back_type varchar,
          bt_initial_capital int,
          bt_end_capital int
        )
      `
    db.run(createBackTestSql, function (err) {
      if (err) {
        console.log(err)
      }
      console.log('创建回测数据库成功')
    })

    const createTransactionDetailSql = `
        create table transaction_detail(
          td_id INTEGER primary key autoincrement not null,
          bt_id varchar,
          td_stock_code varchar,
          td_buy_date date,
          td_sell_date date,
          td_buy_num int,
          td_buy_price float,
          td_sell_price float,
          td_loss float
        )
      `
    db.run(createTransactionDetailSql, function (err) {
      if (err) {
        console.log(err)
      }
      console.log('创建交易详情数据库成功')
    })

    const createCapitalSql = `
        create table capital(
          cap_id INTEGER primary key autoincrement not null,
          bt_id varchar,
          bt_date date,
          bt_price float
        )
      `
    db.run(createCapitalSql, function (err) {
      if (err) {
        console.log(err)
      }
      console.log('创建资金曲线数据库成功')
    })
  })
} else {
  // 创建数据库链接,暴露给渲染进程对象
  db = new sqlite3.Database(dataBasePath)
}

// 查询股票
ipcMain.handle('selectAllStock', (_event, currentPage, pageSize) => {
  const queryStockSql = 'select * from stock'

  return new Promise((resolve, rejects) => {
    db.all(
      `${queryStockSql} limit ${(currentPage - 1) * pageSize}, ${pageSize}`,
      function (err, res) {
        if (!err) {
          resolve(res)
        } else {
          rejects(err)
        }
      }
    )
  })
})

// 查询所有股票代码
ipcMain.handle('queryStockName', () => {
  const sql = 'select stock_code from stock'
  return new Promise((resolve, rejects) => {
    db.all(sql, function (err, res) {
      if (!err) {
        resolve(res)
      } else {
        rejects(err)
      }
    })
  })
})

// 统计数量
ipcMain.handle('countStock', () => {
  const sql = 'select count(*) from stock'

  return new Promise((resolve, rejects) => {
    db.all(sql, function (err, res) {
      if (!err) {
        resolve(res[0]['count(*)'])
      } else {
        rejects(err)
      }
    })
  })
})

// 模糊查询
ipcMain.handle('blurQuery', function (_event, queryKey, currentPage, pageSize) {
  const sql = `select * from stock
    where stock_code like '${queryKey}%'
    limit ${(currentPage - 1) * pageSize}, ${pageSize}`

  return new Promise((resolve, rejects) => {
    db.all(sql, function (err, res) {
      if (!err) {
        resolve(res)
      } else {
        rejects(err)
      }
    })
  })
})

// 模糊查总数统计
ipcMain.handle('countBlurQuery', function (_event, queryKey) {
  const sql = `select count(*) from stock where stock_code like '${queryKey}%'`

  return new Promise((resolve, rejects) => {
    db.all(sql, function (err, res) {
      if (!err) {
        resolve(res[0]['count(*)'])
      } else {
        rejects(err)
      }
    })
  })
})

// 删除数据
ipcMain.handle('deleteStock', async function (_event, stockId, stockcode) {
  // 先将股票表中的数据删除
  const sql = db.prepare(`delete from stock where id = ${stockId}`)
  const resultDeleteStock = await sqlRunCallback(sql)
  // 再删除股票详情数据库中的数据
  const sql2 = db.prepare(`delete from detail where stock_code = '${stockcode}'`)
  const resDetail = await sqlRunCallback(sql2)
  if (resultDeleteStock !== '-1' && resDetail !== '-1') {
    return `error:${resultDeleteStock}&${resDetail}`
  }
  return '删除成功'
})

// 批量删除
ipcMain.handle('batchDelete', async (_event, idList, codeList) => {
  const sqlStringMap = idList.toString().replace(/\[\]/g, '')

  const sql = db.prepare(`delete from stock where id in (${sqlStringMap})`)
  const resStock = await sqlRunCallback(sql)

  let batchSqlMap = codeList
    .map((item) => `'${item}'`)
    .toString()
    .replace(/\[\]/g, '')
    .replace(/\"\"/, '')

  console.log(`delete from detail where stock_code in (${batchSqlMap})`)
  const sql2 = db.prepare(`delete from detail where stock_code in (${batchSqlMap})`)
  const resDetail = await sqlRunCallback(sql2)
  if (resStock !== '-1' && resDetail !== '-1') {
    return `error:${resStock}&${resDetail}`
  }
  return '删除成功'
})

// 打开文件验证是否符合文件格式
ipcMain.handle('importData', async (_event, form) => {
  const converter = await csv().fromFile(form.filePath)

  // 当表中存在数据时
  if (converter.length > 0) {
    const tableHeader = Object.keys(converter[0])
    const headerError = Object.values(form.tableHeader).filter((item) => {
      return tableHeader.indexOf(item as string) === -1
    })

    // 对比用户输入字段和表中字段，不一致不做处理
    if (headerError.length > 0) {
      return '表中不存在字段' + headerError.toString()
    }

    // 进行插入
    const dateKey = form.tableHeader.dateHeader
    const dataLen = converter.length
    const sql = `insert into stock values(null,'${form.stockCode.replace(/[a-zA-Z]*/g, '')}',
                  '${form.exchange}',
                  '${converter[0][dateKey]}',
                  '${converter[dataLen - 1][dateKey]}',
                  '${form.dateType}')`

    const insertStock = db.prepare(sql)
    const resultInsertStock = await sqlRunCallback(insertStock)
    if (resultInsertStock !== '-1') {
      return `error:${resultInsertStock}`
    }

    // 按照表格字段插入数据,并且剔除表中不存在的字段
    const detailData = converter.map((item) => {
      let tempArr = [null]
      tempArr.push(form.stockCode.replace(/[a-zA-Z]*/g, ''))
      for (let key in form.tableHeader) {
        tempArr.push(item[form.tableHeader[key]])
      }
      return tempArr
    })
    let detailDataString = JSON.stringify(detailData).toString()
    detailDataString = detailDataString
      .slice(1, detailDataString.length - 1)
      .replace(/\[/g, '(')
      .replace(/\]/g, ')')
    // console.log(detailDataString)
    const detailInsertSql = `insert into detail(id, stock_code, datetime, open, high, low, close, volume, turnover) values${detailDataString}`
    const insertDetailData = db.prepare(detailInsertSql)
    const resultinsertDetailData = await sqlRunCallback(insertDetailData)
    if (resultinsertDetailData !== '-1') {
      return `error:${resultinsertDetailData}`
    }
  } else {
    return '表中无数据'
  }

  return '导入数据成功'
})

// 数据详情获取
ipcMain.handle('stockDetailAll', async (_event, stockcode) => {
  return new Promise((resolve, rejects) => {
    db.all(`select * from detail where stock_code = '${stockcode}'`, function (err, res) {
      if (!err) {
        resolve(res)
      } else {
        rejects(err)
      }
    })
  })
})

// 增加,删，改数据sql 运行成功回调函数封装
export function sqlRunCallback(sqlObj) {
  return new Promise((resolve, rejects) => {
    sqlObj.run((error) => {
      console.log(error)
      if (error) {
        rejects(error)
      }
      resolve('-1')
    })
  })
}
