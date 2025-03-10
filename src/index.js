import { secondsToTime } from './utils';

const STATES = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
};

const state = {
  currentState: STATES.IDLE,
  timers: [],
  activeTimerId: null,
};

const actions = {
  start: () => {
    if (state.currentState === STATES.IDLE || state.currentState === STATES.PAUSED) {
      state.currentState = STATES.RUNNING;
      updateUI();
    }
  },
  stop: () => {
    if (state.currentState === STATES.RUNNING) {
      state.currentState = STATES.PAUSED;
      updateUI();
    }
  },
  reset: () => {
    state.currentState = STATES.IDLE;
    updateUI();
  },
  addTimer: (name, time) => {
    const newTimer = {
      id: state.timers.length,
      name: name || `timer-${state.timers.length + 1}`,
      time: time || 0,
    };
    state.timers.push(newTimer);
    updateUI();
  },
};

const updateUI = () => {
  const add = document.getElementById('add');
  const start = document.getElementById('start');
  const stop = document.getElementById('stop');
  const reset = document.getElementById('reset');

  switch (state.currentState) {
    case STATES.IDLE:
      add.classList.remove('hidden');
      start.classList.remove('hidden');
      stop.classList.add('hidden');
      reset.classList.add('hidden');
      break;
    case STATES.RUNNING:
      add.classList.add('hidden');
      start.classList.add('hidden');
      stop.classList.remove('hidden');
      reset.classList.remove('hidden');
      break;
    case STATES.PAUSED:
      add.classList.add('hidden');
      start.classList.remove('hidden');
      stop.classList.add('hidden');
      reset.classList.remove('hidden');
      break;
  }
};

const handleAdd = () => actions.addTimer();
const handleStart = () => actions.start();
const handleStop = () => actions.stop();
const handleReset = () => actions.reset();

const renderList = () => {
  const list = document.getElementById('list');
  list.innerHTML = '';

  state.timers.forEach((timer, index) => {
    const remove = document.createElement('button');
    const name = document.createElement('span');
    const time = document.createElement('span');
    const item = document.createElement('li');

    remove.classList.add('remove');
    remove.setAttribute('type', 'button');
    remove.textContent = '✖';
    remove.dataset.index = index;

    name.classList.add('text', 'name');
    name.textContent = timer.name;

    time.classList.add('text', 'time');
    time.textContent = secondsToTime(timer.time);

    item.classList.add('item');
    item.classList.toggle('active', timer.id === state.activeTimerId);
    item.appendChild(remove);
    item.appendChild(name);
    item.appendChild(time);

    list.appendChild(item);
  });
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

  add.addEventListener('click', handleAdd);
  start.addEventListener('click', handleStart);
  stop.addEventListener('click', handleStop);
  reset.addEventListener('click', handleReset);

  updateUI();
  renderList();
};

document.addEventListener('DOMContentLoaded', init);
