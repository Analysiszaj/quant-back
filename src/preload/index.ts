import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ipcRenderer } from 'electron'

// 分页查询股票
async function selectAllStock(pageSize, currentPage) {
  const data = await ipcRenderer.invoke('selectAllStock', pageSize, currentPage)
  return data
}

// 查询所有股票代码
async function queryStockName() {
  const data = await ipcRenderer.invoke('queryStockName')
  return data
}

// 统计股票
async function countStock() {
  const data = await ipcRenderer.invoke('countStock')
  return data
}

// 模糊查询
async function blurQuery(queryKey, currentPage, pageSize) {
  const data = await ipcRenderer.invoke('blurQuery', queryKey, currentPage, pageSize)
  return data
}

// 模糊查询统计
async function countBlurQuery(queryKey) {
  const data = await ipcRenderer.invoke('countBlurQuery', queryKey)
  return data
}

// 删除股票
async function deleteStock(stockId, stockcode) {
  const data = await ipcRenderer.invoke('deleteStock', stockId, stockcode)
  return data
}

// 批量删除
async function batchDelete(idList, stockList) {
  const data = await ipcRenderer.invoke('batchDelete', idList, stockList)
  return data
}

// 查询股票详情
async function stockDetailAll(stockcode) {
  const data = await ipcRenderer.invoke('stockDetailAll', stockcode)
  return data
}

function openWindow(param) {
  ipcRenderer.send('openWindow', param)
}

// 写入文件
async function strategySave(filename, code) {
  const data = await ipcRenderer.invoke('strategySave', filename, code)
  return data
}

// 获取所有文件
async function strategyAll() {
  const data = await ipcRenderer.invoke('strategyAll')
  return data
}

// 读取指定文件
async function strategyRead(filePath) {
  const data = await ipcRenderer.invoke('strategyRead', filePath)
  return data
}

function openPopup(filePath) {
  ipcRenderer.send('openPopup', filePath)
}

function strategyDel() {
  return new Promise((resolve, rejects) => {
    ipcRenderer.on('strategyDel', (_event, message) => {
      resolve(message)
    })
  })
}

const api = {
  selectAllStock,
  queryStockName,
  countStock,
  blurQuery,
  countBlurQuery,
  deleteStock,
  batchDelete,
  openWindow,
  stockDetailAll,
  strategySave,
  strategyAll,
  strategyRead,
  openPopup,
  strategyDel
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
