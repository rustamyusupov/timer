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
  Object.assign(state, newState);

  console.log({ prevState, newState });

  if (
    state.current.time !== prevState.current.time ||
    (state.process === process.ready && prevState.process === process.idle)
  ) {
    renderTimer(elements, state);
  }

  if (
    state.process === process.idle ||
    (state.process && state.process !== prevState.process) ||
    (state.timers && state.timers.length !== prevState.timers.length)
  ) {
    renderElements(elements, state);
    renderList(elements, state);
    localStorage.setItem('timers', JSON.stringify(state.timers));
  }
};

const handleSubmit = event => {
  const data = new FormData(event.target);
  const values = Object.fromEntries(data.entries());
  const timers = [...state.timers, values];

  setState({ process: process.ready, timers });
};

const handleListClick = event => {
  if (!event.target.classList.contains('remove') || state.process === process.countdown) {
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

const updateTimer = () => {
  const { current, timers, intervalId } = state;
  const seconds = convertTimeToSeconds(current.time);

  if (!current?.index !== null && !current?.time) {
    clearInterval(intervalId);
    setState({
      intervalId: null,
      current: { index: null, time: null },
      process: process.ready,
    });
    return;
  }

  if (seconds === 0) {
    const nextIndex = current.index + 1;

    if (nextIndex >= timers.length) {
      clearInterval(intervalId);
      setState({
        intervalId: null,
        current: { index: null, time: null },
        process: process.ready,
      });
      return;
    }

    setState({
      current: {
        index: nextIndex,
        time: timers[nextIndex].time,
      },
    });
    return;
  }

  setState({
    current: {
      index: current.index,
      time: convertSecondsToTime(seconds - 1),
    },
  });
};

const handleStartClick = () => {
  const initial = process.idle ? { index: 0, time: state.timers[0].time } : state.current;

  state.intervalId = setInterval(updateTimer, millisecondsInSecond);

  setState({
    current: initial,
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
