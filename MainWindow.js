const { BrowserWindow } = require('electron');

class MainWindow extends BrowserWindow {
  constructor(file, isDev) {
    super({
      title: 'SysTop',
      width: isDev ? 1100 : 400,
      height: 600,
      icon: `${__dirname}/assets/icons/icon.png`,
      resizable: isDev,
      opacity: 0.9,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });

    this.loadURL(file);
    if (isDev) this.webContents.openDevTools();
  }
}

module.exports = MainWindow;
