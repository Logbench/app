import icon from '../../resources/icon.png?asset'
import { BrowserWindow, Menu, app, ipcMain, nativeTheme, shell } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { join } from 'path'
import axios from 'axios'
import { io } from 'socket.io-client'

const socket = io('http://localhost:1338')

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    },
    darkTheme: true,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0C0D0D',
    trafficLightPosition: {
      x: 18,
      y: 19
    },
    minWidth: 640,
    minHeight: 360
  })

  nativeTheme.themeSource = 'dark'

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  socket.on('new-log', (log) => {
    mainWindow.webContents.send('new-log', log)
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  //ipcMain.handle('show-log-context-menu', (event, logId: string) => {
  //  const template = [
  //    {
  //      label: 'Copy log',
  //      click: (): void => {
  //        console.log('Click!')
  //        event.sender.send('menu-item-clicked', 'copy-log', logId)
  //      }
  //    }
  //  ]
  //
  //  const menu = Menu.buildFromTemplate(template)
  //
  //  const window = BrowserWindow.fromWebContents(event.sender)
  //
  //  if (window) {
  //    menu.popup({ window })
  //  }
  //})

  ipcMain.handle('get-projects', async () => {
    return await axios.get('http://localhost:1338/projects').then((res) => res.data)
  })

  ipcMain.handle('get-project', async (_, projectId: string) => {
    return await axios.get(`http://localhost:1338/projects/${projectId}`).then((res) => res.data)
  })

  ipcMain.handle('fetch-project-logs', async (_, projectId: string) => {
    return await axios
      .get(`http://localhost:1338/projects/${projectId}/logs`)
      .then((res) => res.data)
  })

  ipcMain.handle('create-project', async (_, name: string) => {
    return await axios.post('http://localhost:1338/projects', {
      name
    })
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
