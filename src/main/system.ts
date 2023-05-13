import { BrowserWindow, ipcMain } from 'electron'
import icon from '../../resources/icon.png?asset'
import { join } from 'path'

export const openChildWindow = (param) => {
  const childWin = new BrowserWindow({
    width: 1200,
    height: 960,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  childWin.loadURL('http://127.0.0.1:5173' + param)
  childWin.show()
}

ipcMain.on('openWindow', async (_event, param) => {
  openChildWindow(param)
})
