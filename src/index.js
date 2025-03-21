import { render } from './render';
import { createTimer } from './timer';

const init = () => {
  const timer = createTimer();
  const toggle = document.getElementById('toggle');
  const reset = document.getElementById('reset');

  timer.setUpdate(render);
  timer.setTimers([
    { id: 0, name: 'Timer 1', time: 4 },
    { id: 1, name: 'Timer 2', time: 2 },
    { id: 2, name: 'Timer 3', time: 3 },
  ]);

  toggle.addEventListener('click', timer.toggle);
  reset.addEventListener('click', timer.reset);
};

document.addEventListener('DOMContentLoaded', init);
