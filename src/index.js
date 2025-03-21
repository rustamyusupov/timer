import { initTimers, setToStorage } from './utils';
import { createTimer } from './timer';
import { render } from './render';
import { beep } from './audio';

const init = async () => {
  const toggle = document.getElementById('toggle');
  const reset = document.getElementById('reset');
  const timers = await initTimers();

  const timer = createTimer({
    timers,
    onComplete: beep,
    onUpdate: render,
    onStart: n => console.log('voice', n), // TODO: voice
    onTick: s => s <= 3 && s > 0 && beep(100),
  });

  toggle.addEventListener('click', timer.toggle);
  reset.addEventListener('click', timer.reset);

  setToStorage('timers', timers);
};

document.addEventListener('DOMContentLoaded', init);
