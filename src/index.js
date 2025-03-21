import { loadTimers } from './utils';
import { createTimer } from './timer';
import { render } from './render';

const init = async () => {
  const toggle = document.getElementById('toggle');
  const reset = document.getElementById('reset');
  const timers = await loadTimers();
  const timer = createTimer();

  toggle.addEventListener('click', timer.toggle);
  reset.addEventListener('click', timer.reset);

  timer.setUpdate(render);
  timer.setTimers(timers);
};

document.addEventListener('DOMContentLoaded', init);
