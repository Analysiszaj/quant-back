import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ipcRenderer } from 'electron'

// 分页查询股票
async function selectAllStock(pageSize, currentPage) {
  const data = await ipcRenderer.invoke('selectAllStock', pageSize, currentPage)
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
const api = {
  selectAllStock,
  countStock,
  blurQuery,
  countBlurQuery,
  deleteStock,
  batchDelete
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
