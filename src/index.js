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
  const prev = { ...state };
  Object.assign(state, newState);

  if (state.process === process.countdown) {
    renderTimer(elements, state);
  }

  if (newState.process && newState.process !== prev.process) {
    renderElements(elements, state);
    renderList(elements, state);
  }

  localStorage.setItem('timers', JSON.stringify(state.timers));
};

const handleSubmit = event => {
  const data = new FormData(event.target);
  const values = Object.fromEntries(data.entries());
  const timers = [...state.timers, values];

  setState({ process: process.ready, timers });
};

const handleListClick = event => {
  if (!event.target.classList.contains('remove')) {
    return;
  }

  const index = event.target.dataset.index;
  const timers = [...state.timers];

  timers.splice(index, 1);

  setState({ timers, process: timers.length > 0 ? process.ready : process.idle });
};

const handleAddClick = () => setState({ process: process.add });

const handlePauseClick = () => {
  clearInterval(state.intervalId);
  setState({ intervalId: null, process: process.pause });
};

const handleResetClick = () => {
  clearInterval(state.intervalId);
  setState({ intervalId: null, current: { index: null, time: null }, process: process.ready });
};

const handleStartClick = () => {
  state.intervalId = setInterval(() => {
    const seconds = convertTimeToSeconds(state.current.time) - 1;
    const time = convertSecondsToTime(seconds);

    setState({ current: { index: state.current.index, time } });

    if (seconds === 0 && state.timers.length - 1 === state.current.index) {
      clearInterval(state.intervalId);
      setState({ current: { index: null, time: null }, process: process.ready });
    } else if (seconds === 0) {
      setState({
        current: {
          index: state.current.index + 1,
          time: state.timers[state.current.index + 1].time,
        },
      });
    }
  }, millisecondsInSecond);

  setState({
    current: state.current.time ? state.current : { index: 0, time: state.timers[0].time },
    process: process.countdown,
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const { form, list, add, name, pause, reset, start } = elements;
  const timers = JSON.parse(localStorage.getItem('timers')) || [];

  form.addEventListener('submit', handleSubmit);
  list.addEventListener('click', handleListClick);
  add.addEventListener('click', handleAddClick);
  pause.addEventListener('click', handlePauseClick);
  reset.addEventListener('click', handleResetClick);
  start.addEventListener('click', handleStartClick);

  setState({ process: timers.length > 0 ? process.ready : process.idle, timers });
});
