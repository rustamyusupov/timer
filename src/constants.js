export const startTime = '00:00';
export const finishPhrase = 'Workout complete!';

export const millisecondsInSecond = 1000;
export const secondsInMinute = 60;

export const elements = {
  add: document.getElementById('add'),
  form: document.getElementById('form'),
  list: document.getElementById('list'),
  name: document.getElementById('name'),
  pause: document.getElementById('pause'),
  reset: document.getElementById('reset'),
  start: document.getElementById('start'),
  timer: document.getElementById('timer'),
};

export const process = {
  idle: 'idle',
  add: 'add',
  ready: 'ready',
  countdown: 'countdown',
  pause: 'pause',
};

export const state = {
  audioCtx: null,
  current: {
    index: null,
    name: null,
    time: null,
  },
  intervalId: null,
  process: process.idle,
  timers: [],
};
