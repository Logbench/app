import { ipcRenderer, contextBridge, IpcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Project } from './types/project'
import { Log, LogsResult } from './types/log'

// Custom APIs for rendere
const api = {
  showContextMenu: (logId: string): Promise<unknown> => {
    return ipcRenderer.invoke('show-log-context-menu', logId)
  },
  getProjects: (): Promise<Project[]> => {
    return ipcRenderer.invoke('get-projects')
  },
  getProject: (projectId: string): Promise<Project> => {
    return ipcRenderer.invoke('get-project', projectId)
  },
  getProjectLogs: (projectId: string): Promise<LogsResult> => {
    return ipcRenderer.invoke('get-project-logs', projectId)
  },
  deleteProjectLogs: (projectId: string): Promise<Log[]> => {
    return ipcRenderer.invoke('delete-project-logs', projectId)
  },
  createProject: async (name: string): Promise<Project> => {
    return ipcRenderer.invoke('create-project', name)
  },
  openProjectLogStream: (projectId: string): Promise<Project[]> => {
    return ipcRenderer.invoke('open-project-log-stream', projectId)
  },
  onNewLog: (callback: (value: Log) => void): IpcRenderer =>
    ipcRenderer.on('new-log', (_event, value) => callback(value)),
  removeNewLogListeners: (): void => {
    ipcRenderer.removeAllListeners('new-log')
  },
  onEnterFullScreen: (callback: () => void): IpcRenderer =>
    ipcRenderer.on('enter-full-screen', () => callback()),
  onLeaveFullScreen: (callback: () => void): IpcRenderer =>
    ipcRenderer.on('leave-full-screen', () => callback())

  //onMenuItemClicked: (callback: (action: string, logId: string) => void): IpcRenderer =>
  //  ipcRenderer.on('menu-item-clicked', (_, action: string, logId: string) =>
  //    callback(action, logId)
  //  )
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
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

export type API = typeof api
