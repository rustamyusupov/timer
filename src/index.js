import { millisecondsInSecond, process, state } from './constants';
import { render } from './render';
import { beep, convertSecondsToTime, convertTimeToSeconds, request } from './utils';

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
  Object.assign(state, newState);
  render(elements, state);
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

  if (seconds > 0 && seconds <= 3) {
    beep(30);
  }

  if (seconds !== 0) {
    return;
  }

  if (isLastTimer) {
    resetTimer();
    return;
  }

  beep();
  setState({
    current: { index: nextIndex, time: state.timers[nextIndex].time },
  });
};

const handleStartClick = () => {
  const initial = state.current.time ? state.current : { index: 0, time: state.timers[0].time };

  state.intervalId = setInterval(updateTimer, millisecondsInSecond);
  setState({ current: initial, process: process.countdown });
  beep(250);
};

const addEventListeners = () => {
  const { form, list, add, pause, reset, start } = elements;

  form.addEventListener('submit', handleSubmit);
  list.addEventListener('click', handleListClick);
  add.addEventListener('click', handleAddClick);
  pause.addEventListener('click', handlePauseClick);
  reset.addEventListener('click', handleResetClick);
  start.addEventListener('click', handleStartClick);
};

const init = async () => {
  const params = new URLSearchParams(window.location.search);
  const url = params.get('url');
  let timers = [];

  if (url) {
    timers = await request(url);
    localStorage.setItem('timers', JSON.stringify(timers));
  } else {
    timers = JSON.parse(localStorage.getItem('timers')) || [];
  }

  addEventListeners();
  setState({ process: timers.length > 0 ? process.ready : process.idle, timers });
};

document.addEventListener('DOMContentLoaded', init);
