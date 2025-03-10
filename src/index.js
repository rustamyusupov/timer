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

  add.addEventListener('click', actions.addTimer);
  start.addEventListener('click', actions.start);
  stop.addEventListener('click', actions.stop);
  reset.addEventListener('click', actions.reset);
  list.addEventListener('click', actions.remove);

  updateUI(state.currentState, states);
  renderList(state.currentId, state.timers);
};

document.addEventListener('DOMContentLoaded', init);
