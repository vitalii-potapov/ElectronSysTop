const electron = require('electron');
const path = require('path');
const fs = require('fs');

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (err) {
    return defaults;
  }
}

class Store {
  constructor(options) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(userDataPath, `${options.configName}.json`);
    this.data = parseDataFile(this.path, options.defaults);
  }

  get(key) { return this.data[key]; }

  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

module.exports = Store;
