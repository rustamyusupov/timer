import { render } from './render';

// TODO: incapsulate state and functions
const state = {
  intervalId: null,
  isRunning: false,
  seconds: 0,
  timerIdx: 0,
  timers: [],
};

const stopTimer = () => clearInterval(state.intervalId);

const resetTimer = () => {
  state.isRunning = false;
  state.seconds = 0;
  state.timerIdx = 0;

  state.timers.forEach(timer => {
    timer.active = false;
  });

  stopTimer();
};

const nextTimer = () => {
  state.timers[state.timerIdx].active = false;
  state.timerIdx += 1;

  if (state.timerIdx === state.timers.length) {
    resetTimer();
    return;
  }

  state.seconds = state.timers[state.timerIdx].time;
  state.timers[state.timerIdx].active = true;
};

const startTimer = () => {
  state.intervalId = setInterval(() => {
    state.seconds -= 1;

    if (state.seconds === 0) {
      nextTimer();
    }

    render(state);
  }, 1000);
};

const handleToggle = () => {
  state.isRunning = !state.isRunning;

  if (state.isRunning) {
    state.seconds = state.seconds || state.timers[state.timerIdx].time;
    state.timers[state.timerIdx].active = true;
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
  // TODO: load timers from local storage or url
  state.timers = [
    { id: 0, name: 'Timer 1', time: 4 },
    { id: 1, name: 'Timer 2', time: 2 },
    { id: 2, name: 'Timer 3', time: 3 },
  ];

  const toggle = document.getElementById('toggle');
  const reset = document.getElementById('reset');

  toggle.addEventListener('click', handleToggle);
  reset.addEventListener('click', handleReset);

  render(state);
};

document.addEventListener('DOMContentLoaded', init);
