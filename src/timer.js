export const createTimer = () => {
  const state = {
    intervalId: null,
    isRunning: false,
    seconds: 0,
    timerIdx: 0,
    timers: [],
    onUpdate: () => {},
  };

  const actions = {
    getState: () => ({ ...state }),

    reset: () => {
      state.isRunning = false;
      state.seconds = 0;
      state.timerIdx = 0;

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
      state.intervalId = setInterval(() => {
        state.seconds -= 1;
        state.onUpdate(state);

        if (state.seconds <= 0) {
          actions.next();
        }
      }, 1000);
    },

    stop: () => {
      clearInterval(state.intervalId);
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

    setTimers: timers => {
      state.timers = timers;
      state.onUpdate(state);
    },

    setUpdate: fn => {
      state.onUpdate = fn;
    },
  };

  return actions;
};

// TODO:
// - write tests for this module
// - think about render 0 the timer when it reaches zero
