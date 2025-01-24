export const process = {
  idle: 'idle',
  add: 'add',
  ready: 'ready',
  countdown: 'countdown',
  pause: 'pause',
};

export const state = {
  process: process.idle,
  timers: [],
};

export const processById = {
  add: process.add,
  pause: process.pause,
  reset: process.ready,
  start: process.countdown,
};
