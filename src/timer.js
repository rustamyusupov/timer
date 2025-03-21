export const createTimer = (options = {}) => {
  const state = {
    intervalId: null,
    isRunning: false,
    lastTime: null,
    seconds: 0,
    timerIdx: 0,
    timers: options.timers || [],
    onComplete: options.onComplete || (() => {}),
    onTick: options.onTick || (() => {}),
    onUpdate: options.onUpdate || (() => {}),
  };

  if (state.onUpdate) {
    state.onUpdate(state);
  }

  const actions = {
    getState: () => ({ ...state }),

    reset: () => {
      state.isRunning = false;
      state.seconds = 0;
      state.timerIdx = 0;
      state.lastTime = null;

      state.timers.forEach(timer => {
        timer.active = false;
      });

      clearInterval(state.intervalId);
      state.onUpdate(state);
    },

    next: () => {
      state.timers[state.timerIdx].active = false;
      state.timerIdx += 1;

      if (state.timerIdx >= state.timers.length) {
        actions.reset();
        return;
      }

      state.seconds = state.timers[state.timerIdx].time;
      state.timers[state.timerIdx].active = true;
      state.onUpdate(state);
    },

    start: () => {
      state.lastTime = Date.now();

      state.intervalId = setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.lastTime) / 1000);

        if (elapsed >= 1) {
          state.seconds -= elapsed;
          state.lastTime = Date.now();
          state.onTick(state.seconds);

          if (state.seconds === 0) {
            state.onComplete();
          }

          if (state.seconds < 0) {
            actions.next();
          } else {
            state.onUpdate(state);
          }
        }
      }, 100);
    },

    stop: () => {
      clearInterval(state.intervalId);
      state.lastTime = null;
      state.onUpdate(state);
    },

    toggle: () => {
      state.isRunning = !state.isRunning;

      if (state.isRunning) {
        state.seconds = state.seconds || state.timers[state.timerIdx].time;
        state.timers[state.timerIdx].active = true;
        actions.start();
      } else {
        actions.stop();
      }

      state.onUpdate(state);
    },
  };

  return actions;
};
