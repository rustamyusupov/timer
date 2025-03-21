const formatTime = time =>
  `${Math.floor(time / 60)
    .toString()
    .padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;

export const render = state => {
  const display = document.getElementById('display');
  display.innerHTML = formatTime(state.seconds);

  const toggle = document.getElementById('toggle');
  toggle.innerHTML = state.isRunning ? 'Stop' : 'Start';

  const list = document.getElementById('list');
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
