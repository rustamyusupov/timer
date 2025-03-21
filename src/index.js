import { initializeTimers } from './utils';
import { createTimer } from './timer';
import { render } from './render';

const init = async () => {
  const toggle = document.getElementById('toggle');
  const reset = document.getElementById('reset');
  const initialTimers = await initializeTimers();
  const timer = createTimer();

  toggle.addEventListener('click', timer.toggle);
  reset.addEventListener('click', timer.reset);

  timer.setUpdate(render);
  timer.setTimers(initialTimers);
};

document.addEventListener('DOMContentLoaded', init);

// TODO: beep and voice
