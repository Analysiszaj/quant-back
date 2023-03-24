import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ipcRenderer } from 'electron'

async function selectAllStock(pageSize, currentPage) {
  const data = await ipcRenderer.invoke('selectAllStock', pageSize, currentPage)
  return data
}

async function countStock() {
  const data = await ipcRenderer.invoke('countStock')
  return data
}

async function blurQuery(queryKey, currentPage, pageSize) {
  const data = await ipcRenderer.invoke('blurQuery', queryKey, currentPage, pageSize)
  return data
}

async function countBlurQuery(queryKey) {
  const data = await ipcRenderer.invoke('countBlurQuery', queryKey)
  return data
}

async function deleteStock(stockId) {
  const data = await ipcRenderer.invoke('deleteStock', stockId)
  return data
}
const api = {
  selectAllStock,
  countStock,
  blurQuery,
  countBlurQuery,
  deleteStock
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
