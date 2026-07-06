import { compose, loadWorkout, setToStorage } from './utils';
import { beep, speak, enableAudio } from './sound';
import { createWakeLock } from './wakelock';
import { createStrava } from './strava';
import { createTimer } from './timer';
import { render } from './render';

const init = async () => {
  const toggle = document.getElementById('toggle');
  const reset = document.getElementById('reset');
  const stravaButton = document.getElementById('strava');

  const workout = await loadWorkout();
  const lock = createWakeLock();
  const strava = createStrava(workout);

  const timer = createTimer({
    timers: workout.timers,
    onEnd: beep,
    onRun: () => beep(0, 0),
    onStart: name => speak(name),
    onUpdate: state => render(state),
    onTick: sec => sec <= 3 && sec > 0 && beep(100),
    onComplete: summary => {
      speak('Workout complete!');
      lock.disable();
      strava.send(summary);
    },
  });

  const togglePreventer = () => lock[timer.getState().isRunning ? 'enable' : 'disable']();

  toggle.addEventListener('click', compose(timer.toggle, togglePreventer));
  reset.addEventListener('click', compose(timer.reset, lock.disable));
  stravaButton.addEventListener('click', strava.click);

  await strava.init();

  enableAudio();
  setToStorage('timers', workout);
};

document.addEventListener('DOMContentLoaded', init);
