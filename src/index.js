import { elements, finishPhrase, millisecondsInSecond, process, state } from './constants';
import { render } from './render';
import { beep, secondsToTime, timeToSeconds, request, speak, loadTimers } from './utils';

const noSleep = new NoSleep();
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const setState = newState => {
  Object.assign(state, newState);
  render(elements, state);
  localStorage.setItem('timers', JSON.stringify(state.timers));
};

const resetTimer = () => {
  clearInterval(state.intervalId);
  setState({
    intervalId: null,
    current: { index: null, name: null, time: null },
    process: process.ready,
  });
  noSleep?.disable();
};

const handleSubmit = event => {
  const data = new FormData(event.target);
  const values = Object.fromEntries(data.entries());
  const timers = [...state.timers, values];

  setState({ process: process.ready, timers });
};

const handleListClick = event => {
  const isNotRemove = !event.target.classList.contains('remove');
  const isCountdown = state.process === process.countdown;

  if (isNotRemove || isCountdown) {
    return;
  }

  const timers = [...state.timers];
  const index = event.target.dataset.index;

  timers.splice(index, 1);
  setState({ process: timers.length > 0 ? process.ready : process.idle, timers });
};

const handleAddClick = () => setState({ process: process.add });

const handlePauseClick = () => {
  clearInterval(state.intervalId);
  setState({ intervalId: null, process: process.pause });
};

const handleResetClick = () => resetTimer();

const updateTimer = async () => {
  const index = state.current.index;
  const nextIndex = index + 1;
  const isLastTimer = state.timers.length - 1 === index;
  const seconds = timeToSeconds(state.current.time) - 1;
  const time = secondsToTime(seconds);

  // update time
  setState({ current: { index, name: state.timers[index].name, time } });

  if (seconds > 0 && seconds <= 3) {
    beep({ audioCtx, duration: 100 });
  }

  if (seconds !== 0) {
    return;
  }

  if (isLastTimer) {
    resetTimer();
    speak(finishPhrase);
    return;
  }

  await beep({ audioCtx });
  speak(state.timers[nextIndex].name);
  setState({ current: { index: nextIndex, ...state.timers[nextIndex] } });
};

const handleStartClick = async () => {
  const initial = state.current.time ? state.current : { index: 0, ...state.timers[0] };

  noSleep?.enable();
  await beep({ audioCtx });
  speak(initial.name);
  state.intervalId = setInterval(updateTimer, millisecondsInSecond);
  setState({ current: initial, process: process.countdown });
};

const init = async () => {
  const { form, list, add, pause, reset, start } = elements;
  const timers = await loadTimers();

  form.addEventListener('submit', handleSubmit);
  list.addEventListener('click', handleListClick);
  add.addEventListener('click', handleAddClick);
  pause.addEventListener('click', handlePauseClick);
  reset.addEventListener('click', handleResetClick);
  start.addEventListener('click', handleStartClick);

  setState({
    process: timers.length > 0 ? process.ready : process.idle,
    timers,
  });
};

document.addEventListener('DOMContentLoaded', init);
