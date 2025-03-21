import { formatTime } from './utils';

const renderDisplay = time => {
  const display = document.getElementById('display');
  display.innerHTML = formatTime(time);
};

const renderToggle = isActive => {
  const toggle = document.getElementById('toggle');
  toggle.innerHTML = isActive ? 'Stop' : 'Start';
};

const renderList = items => {
  const list = document.getElementById('list');
  list.innerHTML = items
    .map(
      item =>
        `<li class="item${item.active ? ' active' : ''}">` +
        `<span class="text name">${item.name}</span>` +
        `<span class="text time">${formatTime(item.time)}</span>` +
        `</li>`
    )
    .join('');
};

export const render = ({ currentTime, isRunning, timers }) => {
  // TODO: render only the changed parts
  renderDisplay(currentTime);
  renderToggle(isRunning);
  renderList(timers);
};
