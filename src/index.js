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

const init = () => {
  const add = document.getElementById('add');
  const start = document.getElementById('start');
  const stop = document.getElementById('stop');
  const reset = document.getElementById('reset');

  add.addEventListener('click', handleAdd);
  start.addEventListener('click', handleStart);
  stop.addEventListener('click', handleStop);
  reset.addEventListener('click', handleReset);

  updateUI();
};

document.addEventListener('DOMContentLoaded', init);
