import { parseForm, renderList, updateUI } from './ui';

const process = {
  ADD: 'add',
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
    state.currentState = process.ADD;
    updateUI(state.currentState, process);
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
  submit: event => {
    state.currentState = process.IDLE;
    state.timers.push({ id: state.timers.length, ...parseForm(event.target) });
    updateUI(state.currentState, process);
    renderList(state.currentId, state.timers);
  },
};

const initState = () => {
  state.timers = [
    { id: 0, name: 'timer-1', time: 5 },
    { id: 1, name: 'timer-2', time: 3 },
    { id: 2, name: 'timer-3', time: 7 },
  ];
};

const initHandlers = () => {
  const items = [
    { id: 'add', event: 'click', handler: actions.add },
    { id: 'start', event: 'click', handler: actions.start },
    { id: 'stop', event: 'click', handler: actions.stop },
    { id: 'reset', event: 'click', handler: actions.reset },
    { id: 'list', event: 'click', handler: actions.remove },
    { id: 'form', event: 'submit', handler: actions.submit },
  ];

  items.forEach(({ id, event, handler }) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener(event, handler);
    }
  });
};

const init = () => {
  initState();
  initHandlers();
  updateUI(state.currentState, process);
  renderList(state.currentId, state.timers);
};

document.addEventListener('DOMContentLoaded', init);
