export const millisecondsInSecond = 1000;
export const secondsInMinute = 60;

export const process = {
  idle: 'idle',
  add: 'add',
  ready: 'ready',
  countdown: 'countdown',
  pause: 'pause',
};

export const state = {
  intervalId: null,
  current: {
    index: null,
    time: null,
  },
  process: process.idle,
  timers: [],
};
