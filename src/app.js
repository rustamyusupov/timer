import { render } from './renders';

const state = {
  currentId: 0,
  currentTime: 0,
  intervalId: null,
  isRunning: false,
  timers: [],
};

const stopTimer = () => clearInterval(state.intervalId);

const resetTimer = () => {
  state.isRunning = false;
  state.currentTime = 0;
  state.currentId = 0;
  stopTimer();
};

const nextTimer = () => {
  state.timers[state.currentId].active = false;
  state.currentId += 1;

  if (state.currentId === state.timers.length) {
    resetTimer();
    return;
  }

  state.currentTime = state.timers[state.currentId].time;
  state.timers[state.currentId].active = true;
};

const startTimer = () => {
  state.intervalId = setInterval(() => {
    state.currentTime -= 1;

    if (state.currentTime === 0) {
      nextTimer();
    }

    render(state);
  }, 1000);
};

const handleToggle = () => {
  state.isRunning = !state.isRunning;

  if (state.isRunning) {
    state.currentTime = state.currentTime || state.timers[state.currentId].time;
    state.timers[state.currentId].active = true;
    startTimer();
  } else {
    stopTimer();
  }

  render(state);
};

const handleReset = () => {
  resetTimer();
  render(state);
};

const init = () => {
  const toggle = document.getElementById('toggle');
  const reset = document.getElementById('reset');

  // TODO: load timers from local storage or url
  state.timers = [
    { id: 0, name: 'Timer 1', time: 4 },
    { id: 1, name: 'Timer 2', time: 2 },
    { id: 2, name: 'Timer 3', time: 3 },
  ];

  if (state.timers.length === 0) {
    toggle.disabled = true;
    reset.disabled = true;
    return;
  }

  toggle.addEventListener('click', handleToggle);
  reset.addEventListener('click', handleReset);

  render(state);
};

document.addEventListener('DOMContentLoaded', init);
