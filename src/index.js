import { renderList, updateUI } from './ui';

const states = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
};

const state = {
  currentId: null,
  currentState: states.IDLE,
  timers: [],
};

const actions = {
  add: (name, time) => {
    // Add a new timer
    updateUI(state.currentState, states);
  },
  start: () => {
    if (state.currentState === states.IDLE || state.currentState === states.PAUSED) {
      state.currentState = states.RUNNING;
      updateUI(state.currentState, states);
    }
  },
  stop: () => {
    if (state.currentState === states.RUNNING) {
      state.currentState = states.PAUSED;
      updateUI(state.currentState, states);
    }
  },
  reset: () => {
    state.currentState = states.IDLE;
    updateUI(state.currentState, states);
  },
};

const handleAdd = () => actions.addTimer();
const handleStart = () => actions.start();
const handleStop = () => actions.stop();
const handleReset = () => actions.reset();

const init = () => {
  state.timers = [
    { id: 0, name: 'timer-1', time: 5 },
    { id: 1, name: 'timer-2', time: 3 },
    { id: 2, name: 'timer-3', time: 7 },
  ];

  const add = document.getElementById('add');
  const start = document.getElementById('start');
  const stop = document.getElementById('stop');
  const reset = document.getElementById('reset');

  add.addEventListener('click', handleAdd);
  start.addEventListener('click', handleStart);
  stop.addEventListener('click', handleStop);
  reset.addEventListener('click', handleReset);

  updateUI(state.currentState, states);
  renderList(state.currentId, state.timers);
};

document.addEventListener('DOMContentLoaded', init);
