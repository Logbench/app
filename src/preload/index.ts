import { ipcRenderer, contextBridge, IpcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Project } from './types/project'
import { Log, LogsResult } from './types/log'

// Custom APIs for rendere
const api = {
  showContextMenu: (log: Log): Promise<unknown> => {
    return ipcRenderer.invoke('show-log-context-menu', log)
  },
  onCloseLogContextMenu: (callback: (logId: string) => void): IpcRenderer => {
    return ipcRenderer.on('close-log-context-menu', (_, logId: string) => callback(logId))
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
  deleteProjectLogs: (data: { projectId: string; date?: Date }): Promise<Log[]> => {
    return ipcRenderer.invoke('delete-project-logs', data)
  },
  deleteLog: (logId: string): Promise<Log> => {
    return ipcRenderer.invoke('delete-log', logId)
  },
  createProject: async (name: string): Promise<Project> => {
    return ipcRenderer.invoke('create-project', name)
  },
  openProjectLogStream: (projectId: string): Promise<Project[]> => {
    return ipcRenderer.invoke('open-project-log-stream', projectId)
  },
  onNewLog: (callback: (value: { log: Log; day: string }) => void): IpcRenderer =>
    ipcRenderer.on('new-log', (_event, value) => callback(value)),
  removeNewLogListeners: (): void => {
    ipcRenderer.removeAllListeners('new-log')
  },
  onEnterFullScreen: (callback: () => void): IpcRenderer =>
    ipcRenderer.on('enter-full-screen', () => callback()),
  onLeaveFullScreen: (callback: () => void): IpcRenderer =>
    ipcRenderer.on('leave-full-screen', () => callback()),
  onMenuItemClicked: (callback: (action: string, log: Log) => void): IpcRenderer =>
    ipcRenderer.on('menu-item-clicked', (_, action: string, log: Log) => callback(action, log))
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
