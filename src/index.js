import { process, processByElement, state } from './constants';
import { render } from './render';

const elements = {
  add: document.getElementById('add'),
  form: document.getElementById('form'),
  list: document.getElementById('list'),
  name: document.getElementById('name'),
  pause: document.getElementById('pause'),
  reset: document.getElementById('reset'),
  start: document.getElementById('start'),
};

const setState = newState => {
  Object.assign(state, newState);
  localStorage.setItem('timers', JSON.stringify(state.timers));
  console.log(state);
  render(elements, state);
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

const handleClick = process => () => setState({ process });

document.addEventListener('DOMContentLoaded', () => {
  const { form, list, ...controls } = elements;
  const timers = JSON.parse(localStorage.getItem('timers')) || [];

  form.addEventListener('submit', handleSubmit);
  list.addEventListener('click', handleListClick);
  Object.entries(controls).forEach(([id, c]) =>
    c.addEventListener('click', handleClick(processByElement?.[id]))
  );

  setState({ process: timers.length > 0 ? process.ready : process.idle, timers });
});
