import { renderDisplay, renderList } from './renders';

const timers = [
  { id: 0, name: 'Timer 1', time: 4 },
  { id: 1, name: 'Timer 2', time: 2 },
  { id: 2, name: 'Timer 3', time: 3 },
];

let currentTimer = null;
let intervalId = null;
let isRunning = false;
let time = 0;

const startTimer = () => {
  intervalId = setInterval(() => {}, 1000);
};

const stopTimer = () => {
  clearInterval(intervalId);
};

const handleToggle = () => {
  const toggle = document.getElementById('toggle');
  isRunning = !isRunning;
  toggle.innerHTML = isRunning ? 'Stop' : 'Start';
};

const handleReset = () => {};

const init = () => {
  const toggle = document.getElementById('toggle');
  const reset = document.getElementById('reset');

  toggle.addEventListener('click', handleToggle);
  reset.addEventListener('click', handleReset);

  renderDisplay(time);
  renderList(timers);
};

document.addEventListener('DOMContentLoaded', init);
