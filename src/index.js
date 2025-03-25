import { beep, speak, enableAudio, preventSleep } from './sound';
import { initTimers, compose, setToStorage } from './utils';
import { createTimer } from './timer';
import { render } from './render';

const init = async () => {
  const toggle = document.getElementById('toggle');
  const reset = document.getElementById('reset');
  const sleepPreventer = preventSleep();
  const timers = await initTimers();

  const timer = createTimer({
    timers,
    onEnd: beep,
    onStart: speak,
    onUpdate: render,
    onComplete: sleepPreventer.stop,
    onTick: s => s <= 3 && s > 0 && beep(100),
  });

  const togglePreventer = () => sleepPreventer?.[timer.getState().isRunning ? 'start' : 'stop']();

  toggle.addEventListener('click', compose(timer.toggle, togglePreventer));
  reset.addEventListener('click', timer.reset);

  enableAudio();
  setToStorage('timers', timers);
};

document.addEventListener('DOMContentLoaded', init);

// TODO:
// - sleep preventer doesn't work on mobile
// - beep doesn't work on mobile
