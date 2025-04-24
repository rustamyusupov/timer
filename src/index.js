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
    onRun: () => beep(0, 0),
    onStart: name => speak(name),
    onUpdate: state => render(state),
    onTick: sec => sec <= 3 && sec > 0 && beep(100),
    onComplete: () => {
      speak('Workout complete!');
      lock.disable();
    },
  });

  const togglePreventer = () => lock?.[timer.getState().isRunning ? 'enable' : 'disable']();

  toggle.addEventListener('click', compose(timer.toggle, togglePreventer));
  reset.addEventListener('click', timer.reset);

  enableAudio();
  setToStorage('timers', timers);
};

document.addEventListener('DOMContentLoaded', init);
