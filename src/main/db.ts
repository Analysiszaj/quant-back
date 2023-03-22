import sqlite3 from 'sqlite3'
import fs from 'fs'
import path from 'path'
import csv from 'csvtojson'
import { ipcMain } from 'electron'
export function createDatabase(dirPath) {
  const dataBasePath = path.join(dirPath, '/database/data.db')
  let db
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
    })
  } else {
    // 创建数据库链接,暴露给渲染进程对象
    db = new sqlite3.Database(dataBasePath)
  }

  const queryStockSql = 'select * from stock'
  ipcMain.handle('selectAllStock', () => {
    return new Promise((resolve, rejects) => {
      db.all(queryStockSql, function (err, res) {
        if (!err) {
          resolve(res)
        } else {
          rejects(res)
        }
      })
    })
  })

  // 打开文件验证是否符合文件格式
  ipcMain.handle('importData', async (event, form) => {
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
  })
}

function sqlRunCallback(sqlObj) {
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
