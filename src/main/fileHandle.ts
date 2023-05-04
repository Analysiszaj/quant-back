import { ipcMain, dialog } from 'electron'
// 选择文件
ipcMain.handle('selectFile', async () => {
  const { filePaths } = await dialog.showOpenDialog({})
  return filePaths
})
