const osu = require('node-os-utils');

const { cpu } = osu;
const { mem } = osu;
const { os } = osu;

const cpuOverload = 80;

function secondsToDHMS(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d, ${h}h, ${m}m, ${s}s`;
}

async function updateInfo() {
  const cpuUsage = cpu.usage();
  const cpuFree = cpu.free();
  const cpuProgressEl = document.querySelector('#cpu-progress');
  const cpuUsageEl = document.querySelector('#cpu-usage');
  const cpuFreeEl = document.querySelector('#cpu-free');
  const sysUptimeEl = document.querySelector('#sys-uptime');

  cpuUsageEl.innerText = `${await cpuUsage}%`;
  cpuProgressEl.style.width = `${await cpuUsage}%`;
  if (await cpuUsage >= cpuOverload) cpuProgressEl.style.background = 'red';
  else cpuProgressEl.style.background = '';
  cpuFreeEl.innerText = `${await cpuFree}%`;
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
