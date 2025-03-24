import { formatTime } from './utils';

export const render = state => {
  const version = document.getElementById('version');
  const display = document.getElementById('display');
  const toggle = document.getElementById('toggle');
  const reset = document.getElementById('reset');
  const list = document.getElementById('list');

  toggle.disabled = reset.disabled = state.timers.length === 0;
  toggle.innerHTML = state.isRunning ? 'Stop' : 'Start';
  display.innerHTML = formatTime(state.seconds);
  version.textContent = __APP_VERSION__;

  list.innerHTML = state.timers
    .map(
      item =>
        `<li class="item${item.active ? ' active' : ''}">` +
        `<span class="text name">${item.name}</span>` +
        `<span class="text time">${formatTime(item.time)}</span>` +
        `</li>`
    )
    .join('');
};
