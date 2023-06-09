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
  return new Promise((resolve, _rejects) => {
    ipcRenderer.on('strategyDel', (_event, message) => {
      resolve(message)
    })
  })
}

// 开始回测
async function startBackTest(selectFrom) {
  const data = await ipcRenderer.invoke('startBackTest', selectFrom)
  return data
}

// 查询指定资金曲线
async function queryCapital(backTestId) {
  const data = await ipcRenderer.invoke('queryCapital', backTestId)
  return data
}

// 查询指定回测详情
async function queryTranDetail(backTestId) {
  const data = await ipcRenderer.invoke('queryTranDetail', backTestId)
  return data
}

// 查询本次回测详情
async function queryBackTestDetail(backTestId) {
  const data = await ipcRenderer.invoke('queryBackTestDetail', backTestId)
  return data
}

// 查询全部回测记录
async function queryAllBackTest(pageSize, currentPage) {
  const data = await ipcRenderer.invoke('queryAllBackTest', pageSize, currentPage)
  return data
}

// 删除回测记录
async function deleteBackTestDetail(btId) {
  const data = await ipcRenderer.invoke('deleteBackTestDetail', btId)
  return data
}

// 查询历史回测记录数量
async function queryBackTestNum() {
  const data = await ipcRenderer.invoke('queryBackTestNum')
  return data
}

async function querySH(startDate, endDate) {
  const data = await ipcRenderer.invoke('querySH', startDate, endDate)
  return data
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
  strategyDel,
  startBackTest,
  queryCapital,
  queryTranDetail,
  queryBackTestDetail,
  queryAllBackTest,
  deleteBackTestDetail,
  queryBackTestNum,
  querySH
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
