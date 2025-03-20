import { renderDisplay, renderList } from './renders';

const timers = [
  { id: 0, name: 'Timer 1', time: 4 },
  { id: 1, name: 'Timer 2', time: 2 },
  { id: 2, name: 'Timer 3', time: 3 },
];

const state = {
  currentTimer: null,
  intervalId: null,
  isRunning: false,
  time: 0,
  timers,
};

const startTimer = () => {
  state.intervalId = setInterval(() => {}, 1000);
};

const stopTimer = () => {
  clearInterval(state.intervalId);
};

const handleToggle = () => {
  const toggle = document.getElementById('toggle');
  state.isRunning = !state.isRunning;
  toggle.innerHTML = state.isRunning ? 'Stop' : 'Start';
};

const handleReset = () => {};

const init = () => {
  const toggle = document.getElementById('toggle');
  const reset = document.getElementById('reset');

  toggle.addEventListener('click', handleToggle);
  reset.addEventListener('click', handleReset);

  renderDisplay(state.time);
  renderList(state.timers);
};

document.addEventListener('DOMContentLoaded', init);
