import { renderList, updateUI } from './ui';

const process = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
};

const state = {
  currentId: null,
  currentState: process.IDLE,
  timers: [],
};

const actions = {
  add: () => {
    renderList(state.currentId, state.timers);
  },
  start: () => {
    if (state.currentState === process.IDLE || state.currentState === process.PAUSED) {
      state.currentState = process.RUNNING;
      updateUI(state.currentState, process);
    }
  },
  stop: () => {
    if (state.currentState === process.RUNNING) {
      state.currentState = process.PAUSED;
      updateUI(state.currentState, process);
    }
  },
  reset: () => {
    state.currentState = process.IDLE;
    updateUI(state.currentState, process);
  },
  remove: event => {
    state.timers.splice(parseInt(event.target.dataset.index), 1);
    renderList(state.currentId, state.timers);
  },
};

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
  const list = document.getElementById('list');

  add.addEventListener('click', actions.add);
  start.addEventListener('click', actions.start);
  stop.addEventListener('click', actions.stop);
  reset.addEventListener('click', actions.reset);
  list.addEventListener('click', actions.remove);

  updateUI(state.currentState, process);
  renderList(state.currentId, state.timers);
};

document.addEventListener('DOMContentLoaded', init);
