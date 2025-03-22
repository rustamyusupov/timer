export const createTimer = (options = {}) => {
  const state = {
    intervalId: null,
    isRunning: false,
    lastTime: null,
    seconds: 0,
    timerIdx: 0,
    timers: options.timers || [],
    onComplete: options.onComplete || (() => {}),
    onStart: options.onStart || (() => {}),
    onTick: options.onTick || (() => {}),
    onUpdate: options.onUpdate || (() => {}),
  };

  if (state.onUpdate) {
    state.onUpdate(state);
  }

  const actions = {
    getState: () => ({ ...state }),

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
      const current = state.timers[state.timerIdx];

      if (!state.isRunning && !state.seconds) {
        state.onStart(current.name);
      }

      state.isRunning = !state.isRunning;

      if (state.isRunning) {
        state.seconds = state.seconds || current.time;
        current.active = true;

        actions.start();
      } else {
        actions.stop();
      }

      state.onUpdate(state);
    },

    next: () => {
      const current = state.timers[state.timerIdx];
      current.active = false;
      state.timerIdx += 1;

      if (state.timerIdx >= state.timers.length) {
        actions.reset();
        return;
      }

      const next = state.timers[state.timerIdx];
      state.seconds = next.time;
      next.active = true;

      state.onUpdate(state);
      state.onStart(next.name);
    },

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
  };

  return actions;
};
