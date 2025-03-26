import { initTimers, compose, setToStorage } from './utils';
import { beep, speak, enableAudio } from './sound';
import { createWakeLock } from './wakelock';
import { createTimer } from './timer';
import { render } from './render';

const init = async () => {
  const toggle = document.getElementById('toggle');
  const reset = document.getElementById('reset');
  const timers = await initTimers();
  const lock = createWakeLock();

  const timer = createTimer({
    timers,
    onEnd: beep,
    onStart: speak,
    onUpdate: render,
    onRun: () => beep(0, 0),
    onComplete: lock.disable,
    onTick: s => s <= 3 && s > 0 && beep(100),
  });

  const togglePreventer = () => lock?.[timer.getState().isRunning ? 'enable' : 'disable']();

  toggle.addEventListener('click', compose(timer.toggle, togglePreventer));
  reset.addEventListener('click', timer.reset);

  enableAudio();
  setToStorage('timers', timers);
};

document.addEventListener('DOMContentLoaded', init);
