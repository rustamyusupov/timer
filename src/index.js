import { millisecondsInSecond, process, state } from './constants';
import { renderElements, renderList, renderTimer } from './render';
import { convertSecondsToTime, convertTimeToSeconds } from './utils';

const elements = {
  add: document.getElementById('add'),
  form: document.getElementById('form'),
  list: document.getElementById('list'),
  name: document.getElementById('name'),
  pause: document.getElementById('pause'),
  reset: document.getElementById('reset'),
  start: document.getElementById('start'),
  timer: document.getElementById('timer'),
};

const setState = newState => {
  const prevState = { ...state };
  const isTimerReady = prevState.process === process.idle || newState.process === process.ready;
  const isTimeChanged = newState.current && newState.current.time !== prevState.current.time;
  const isIdle = prevState.process === process.idle;
  const isTimerAdded = newState.timers && newState.timers.length !== prevState.timers.length;
  const isProcessChanged = prevState.process !== newState.process;

  Object.assign(state, newState);

  if (isTimerReady || isTimeChanged) {
    renderTimer(elements, state);
  }

  if (isIdle || isTimerAdded || isProcessChanged) {
    renderElements(elements, state);
    renderList(elements, state);
  }

  localStorage.setItem('timers', JSON.stringify(state.timers));
};

const resetTimer = () => {
  clearInterval(state.intervalId);
  setState({ intervalId: null, current: { index: null, time: null }, process: process.ready });
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

const updateTimer = () => {
  const index = state.current.index;
  const nextIndex = index + 1;
  const isLastTimer = state.timers.length - 1 === index;
  const seconds = convertTimeToSeconds(state.current.time) - 1;
  const time = convertSecondsToTime(seconds);

  // update time
  setState({ current: { index, time } });

  if (seconds !== 0) {
    return;
  }

  if (isLastTimer) {
    resetTimer();
    return;
  }

  setState({
    current: { index: nextIndex, time: state.timers[nextIndex].time },
  });
};

const handleStartClick = () => {
  const initial = state.current.time ? state.current : { index: 0, time: state.timers[0].time };

  state.intervalId = setInterval(updateTimer, millisecondsInSecond);

  setState({ current: initial, process: process.countdown });
};

const init = () => {
  const { form, list, add, pause, reset, start } = elements;
  const timers = JSON.parse(localStorage.getItem('timers')) || [];

  form.addEventListener('submit', handleSubmit);
  list.addEventListener('click', handleListClick);
  add.addEventListener('click', handleAddClick);
  pause.addEventListener('click', handlePauseClick);
  reset.addEventListener('click', handleResetClick);
  start.addEventListener('click', handleStartClick);

  setState({ process: timers.length > 0 ? process.ready : process.idle, timers });
};

document.addEventListener('DOMContentLoaded', init);
