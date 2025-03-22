import { initTimers, setToStorage } from './utils';
import { beep, speak, enableAudio } from './sound';
import { createTimer } from './timer';
import { render } from './render';

const init = async () => {
  const toggle = document.getElementById('toggle');
  const reset = document.getElementById('reset');
  const timers = await initTimers();

  const timer = createTimer({
    timers,
    onComplete: beep,
    onUpdate: render,
    onStart: speak,
    onTick: s => s <= 3 && s > 0 && beep(100),
  });

  toggle.addEventListener('click', timer.toggle);
  reset.addEventListener('click', timer.reset);

  enableAudio();
  setToStorage('timers', timers);
};

document.addEventListener('DOMContentLoaded', init);
