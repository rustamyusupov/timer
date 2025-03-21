import { createTimer } from './timer';
import { render } from './render';

const init = () => {
  const toggle = document.getElementById('toggle');
  const reset = document.getElementById('reset');
  const timer = createTimer();

  toggle.addEventListener('click', timer.toggle);
  reset.addEventListener('click', timer.reset);

  timer.setUpdate(render);
  timer.setTimers([
    { id: 0, name: 'Timer 1', time: 4 },
    { id: 1, name: 'Timer 2', time: 2 },
    { id: 2, name: 'Timer 3', time: 3 },
  ]);
  // TODO: load timers from local storage or url
};

document.addEventListener('DOMContentLoaded', init);
