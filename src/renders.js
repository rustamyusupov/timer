import { formatTime } from './utils';

export const renderDisplay = time => {
  const display = document.getElementById('display');
  display.innerHTML = formatTime(time);
};

export const renderToggle = isRunning => {
  const toggle = document.getElementById('toggle');
  toggle.innerHTML = isRunning ? 'Stop' : 'Start';
};

export const renderList = timers => {
  const list = document.getElementById('list');
  list.innerHTML = timers
    .map(
      timer =>
        `<li class="item">` +
        `<span class="text name">${timer.name}</span>` +
        `<span class="text time">${formatTime(timer.time)}</span>` +
        `</li>`
    )
    .join('');
};
