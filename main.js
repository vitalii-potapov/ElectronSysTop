const path = require('path');
const { app, Menu, ipcMain, Tray } = require('electron');
const Store = require('./store');
const MainWindow = require('./MainWindow');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

let mainWindow;
let tray;

const store = new Store({
  configName: 'user-settings',
  defaults: {
    settings: {
      cpuOverload: 80,
      alertFrequency: 5,
    },
  },
});

function createMainWindow() {
  mainWindow = new MainWindow(`file://${__dirname}/app/index.html`, isDev);
}

const menu = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  { role: 'fileMenu' },
  {
    label: 'View',
    submenu: [
      {
        label: 'CPU',
        click: () => mainWindow.webContents.send('nav:cpu'),
      },
      {
        label: 'System Info',
        click: () => mainWindow.webContents.send('nav:sys'),
      },
      {
        label: 'Settings',
        click: () => mainWindow.webContents.send('nav:sett'),
      },
    ],
  },
  ...(isDev ? [{
    label: 'Developer',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { type: 'separator' },
      { role: 'toggledevtools' },
    ],
  }]
    : []),
];

app.on('ready', () => {
  createMainWindow();

  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.send('settings:get', store.get('settings'));
  });

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
    return true;
  });

  const icon = path.join(__dirname, 'assets', 'icons', 'tray_icon.png');
  tray = new Tray(icon);

  function toggleAppWindow(show) {
    if (mainWindow.isVisible() && !show) mainWindow.hide();
    else mainWindow.show();
  }
  tray.on('click', () => toggleAppWindow());
  tray.on('right-click', () => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'CPU',
        click: () => {
          toggleAppWindow(true);
          mainWindow.webContents.send('nav:cpu');
        },
      },
      {
        label: 'System Info',
        click: () => {
          toggleAppWindow(true);
          mainWindow.webContents.send('nav:sys');
        },
      },
      {
        label: 'Settings',
        click: () => {
          toggleAppWindow(true);
          mainWindow.webContents.send('nav:sett');
        },
      },
      {
        label: 'Quit',
        click: () => {
          app.isQuitting = true;
          app.quit();
        },
      },
    ]);

    tray.popUpContextMenu(contextMenu);
  });
}, tray);

ipcMain.on('settings:set', (e, options) => {
  store.set('settings', options);
  mainWindow.webContents.send('settings:get', store.get('settings'));
});

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

app.on('activate', () => {
  if (MainWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.allowRendererProcessReuse = true;
