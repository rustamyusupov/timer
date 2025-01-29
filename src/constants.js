export const startTime = '00:00';
export const finishPhrase = 'Workout complete!';

export const millisecondsInSecond = 1000;
export const secondsInMinute = 60;
export const defaultDuration = millisecondsInSecond / 2;

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
  noSleep: null,
  process: process.idle,
  timers: [],
};

export const beepConfig = {
  delayMs: defaultDuration,
  duration: defaultDuration,
  frequency: 1000,
  volume: 1,
  type: 'sine',
};
