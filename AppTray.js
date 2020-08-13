const { app, Menu, Tray } = require('electron');

class AppTray extends Tray {
  constructor(icon, mainWindow) {
    super(icon);

    this.setToolTip('SysTop');
    this.mainWindow = mainWindow;

    this.on('click', this.onClick);
    this.on('right-click', this.onRightClick);
  }

  toggleAppWindow(show) {
    if (this.mainWindow.isVisible() && !show) this.mainWindow.hide();
    else this.mainWindow.show();
  }

  onClick() {
    this.toggleAppWindow(false);
  }

  onRightClick() {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'CPU',
        click: () => {
          this.toggleAppWindow(true);
          this.mainWindow.webContents.send('nav:cpu');
        },
      },
      {
        label: 'System Info',
        click: () => {
          this.toggleAppWindow(true);
          this.mainWindow.webContents.send('nav:sys');
        },
      },
      {
        label: 'Settings',
        click: () => {
          this.toggleAppWindow(true);
          this.mainWindow.webContents.send('nav:sett');
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

    this.popUpContextMenu(contextMenu);
  }
}

module.exports = AppTray;
