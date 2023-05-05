import { BrowserWindow, Menu, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'
export function policyFile(dirPath) {
  const basePath = dirPath + '/strategy'
  // 获取文件夹下面的策略
  ipcMain.handle('strategyAll', () => {
    return new Promise((resolve, rejects) => {
      fs.readdir(basePath, function (err, files) {
        if (err) {
          rejects(err)
        }
        const fileList = files.map((item) => {
          return { fileName: item, filePath: basePath + '/' + item }
        })
        resolve(fileList)
      })
    })
  })

  // 读取指定策略
  ipcMain.handle('strategyRead', (_evnet, filePath) => {
    return new Promise((resolve, rejects) => {
      fs.readFile(filePath, 'utf-8', function (err, dataStr) {
        if (err) {
          rejects(err)
        }
        resolve(dataStr)
      })
    })
  })

  // 写入文件保存
  ipcMain.handle('strategySave', (_event, fielname, code) => {
    return new Promise((resolve, rejects) => {
      fs.writeFile(path.join(basePath, fielname + '.ts'), code, function (err) {
        if (err) {
          rejects('保存文件失败')
        }
        resolve(path.join(basePath, fielname))
      })
    })
  })

  ipcMain.on('openPopup', (_event, filePath) => {
    const menu = Menu.buildFromTemplate([
      {
        label: '删除',
        click: () => {
          const focusedwindow = BrowserWindow.getFocusedWindow()
          fs.unlink(filePath, (err) => {
            if (err) throw err
          })
          focusedwindow?.webContents.send('strategyDel', '删除成功')
        }
      }
    ])
    menu.popup()
  })
}
