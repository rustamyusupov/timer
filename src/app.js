const timers = [
  { id: 0, name: 'Timer 1', time: 4 },
  { id: 1, name: 'Timer 2', time: 2 },
  { id: 2, name: 'Timer 3', time: 3 },
];

let currentTimer = null;
let intervalId = null;
let isRunning = false;

const startTimer = () => {
  intervalId = setInterval(() => {}, 1000);
};

const stopTimer = () => {
  clearInterval(intervalId);
};

const handleToggle = () => {
  const toggle = document.getElementById('toggle');

  if (isRunning) {
    toggle.innerHTML = 'Stop';
  } else {
    toggle.innerHTML = 'Start';
  }

  isRunning = !isRunning;
};

const handleReset = () => {};

const renderDisplay = () => {
  const display = document.getElementById('display');
  display.innerHTML = formatTime(timers[currentTimer]?.time || 0);
};

const formatTime = time =>
  `${Math.floor(time / 60)
    .toString()
    .padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;

const renderList = () => {
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

const init = () => {
  const toggle = document.getElementById('toggle');
  const reset = document.getElementById('reset');

  toggle.addEventListener('click', handleToggle);
  reset.addEventListener('click', handleReset);

  renderDisplay();
  renderList();
};

document.addEventListener('DOMContentLoaded', init);
