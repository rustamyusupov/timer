export const process = {
  idle: 'idle',
  add: 'add',
  ready: 'ready',
  countdown: 'countdown',
  pause: 'pause',
};

export const state = {
  current: {
    index: 0,
    time: '00:00',
  },
  process: process.idle,
  timers: [],
};
