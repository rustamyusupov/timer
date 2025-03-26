import { compose, getFromStorage, request, setToStorage } from './utils';
import { beep, speak, enableAudio } from './sound';
import { createWakeLock } from './wakelock';
import { createTimer } from './timer';
import { render } from './render';

export const loadTimers = async () => {
  const params = new URLSearchParams(window.location.search);
  const url = params.get('url');
  const timers = url ? await request(url) : getFromStorage('timers');

  return timers || [];
};

const init = async () => {
  const toggle = document.getElementById('toggle');
  const reset = document.getElementById('reset');

  const timers = await loadTimers();
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
