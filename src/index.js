import { initTimers, setToStorage } from './utils';
import { createTimer } from './timer';
import { render } from './render';
import { beep } from './audio';

const init = async () => {
  const toggle = document.getElementById('toggle');
  const reset = document.getElementById('reset');
  const initialTimers = await initTimers();

  const timer = createTimer({
    timers: initialTimers,
    onComplete: beep,
    onUpdate: render,
    onTick: s => s <= 3 && s > 0 && beep(100),
  });

  toggle.addEventListener('click', timer.toggle);
  reset.addEventListener('click', timer.reset);

  setToStorage('timers', initialTimers);
};

document.addEventListener('DOMContentLoaded', init);

// TODO: voice
