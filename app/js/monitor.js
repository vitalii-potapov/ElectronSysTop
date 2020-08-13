const path = require('path');
const osu = require('node-os-utils');
const { ipcRenderer } = require('electron');

const { cpu } = osu;
const { mem } = osu;
const { os } = osu;

let cpuOverload = 80;
let alertFrequency = 5;

function changedSettings() {
  localStorage.removeItem('lastNotify');
  document.querySelector('#cpu-progress').style.background = '';
}

ipcRenderer.on('settings:get', (e, settings) => {
  cpuOverload = +settings.cpuOverload;
  alertFrequency = +settings.alertFrequency;
  changedSettings();
});

function notifyUser() {
  // eslint-disable-next-line no-new
  new Notification('CPU Overload', {
    body: `CPU is over ${cpuOverload}`,
    icon: path.join(__dirname, 'img', 'icon.png'),
  });
}

function runNotify() {
  const notifyTime = new Date(parseInt(localStorage.getItem('lastNotify') || 0, 10));
  const now = new Date();
  const diffTime = Math.abs(now - notifyTime);
  const minutesPassed = Math.floor(diffTime / (1000 * 60));
  if (minutesPassed < alertFrequency) return;

  localStorage.setItem('lastNotify', +new Date());
  notifyUser();
}

function secondsToDHMS(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d, ${h}h, ${m}m, ${s}s`;
}

async function updateInfo() {
  const getInfoCpu = [cpu.usage(), cpu.free()];
  const cpuUsage = (await getInfoCpu[0]).toFixed(2);
  const cpuFree = (await getInfoCpu[1]).toFixed(2);
  const cpuProgressEl = document.querySelector('#cpu-progress');
  const cpuUsageEl = document.querySelector('#cpu-usage');
  const cpuFreeEl = document.querySelector('#cpu-free');
  const sysUptimeEl = document.querySelector('#sys-uptime');

  cpuUsageEl.innerText = `${cpuUsage}%`;
  cpuProgressEl.style.width = `${cpuUsage}%`;
  if (cpuUsage >= cpuOverload) {
    cpuProgressEl.style.background = 'red';
    runNotify();
  } else {
    cpuProgressEl.style.background = '';
  }
  cpuFreeEl.innerText = `${cpuFree}%`;
  sysUptimeEl.innerText = secondsToDHMS(os.uptime());
}
updateInfo();

setInterval(updateInfo, 2000);

document.querySelector('#cpu-model').innerText = cpu.model();
document.querySelector('#comp-name').innerText = os.hostname();
document.querySelector('#os').innerText = `${os.type()} ${os.arch()}`;
mem.info().then((info) => {
  document.querySelector('#mem-total').innerText = info.totalMemMb;
});
