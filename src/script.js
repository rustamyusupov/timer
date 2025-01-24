const add = document.getElementById('add');
const form = document.getElementById('form');
const list = document.getElementById('list');
const name = document.getElementById('name');
const pause = document.getElementById('pause');
const reset = document.getElementById('reset');
const start = document.getElementById('start');

const process = {
  idle: 'idle',
  add: 'add',
  ready: 'ready',
  countdown: 'countdown',
  pause: 'pause',
};

const state = {
  process: process.idle,
  timers: [],
};

const setState = newState => {
  Object.assign(state, newState);
  localStorage.setItem('timers', JSON.stringify(state.timers));
  console.log(state);
  render(state);
};

const handleSubmit = event => {
  const data = new FormData(event.target);
  const values = Object.fromEntries(data.entries());
  const timers = [...state.timers, values];

  setState({ form: form.hide, process: process.ready, timers });
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

const renderItem = list => (timer, index) => {
  const remove = document.createElement('button');
  const name = document.createElement('span');
  const time = document.createElement('span');
  const item = document.createElement('li');

  remove.classList.add('remove');
  remove.setAttribute('type', 'button');
  remove.textContent = '✖';
  remove.dataset.index = index;

  name.classList.add('text', 'name');
  name.textContent = timer.name;

  time.classList.add('text', 'time');
  time.textContent = timer.time;

  item.classList.add('item');
  item.appendChild(remove);
  item.appendChild(name);
  item.appendChild(time);

  list.appendChild(item);
};

const renderList = (list, timers) => {
  list.innerHTML = '';

  if (timers.length === 0) {
    const li = document.createElement('li');

    li.classList.add('text');
    li.textContent = 'No timers';
    list.appendChild(li);

    return;
  }

  timers.forEach(renderItem(list));
};

const render = state => {
  switch (state.process) {
    case process.idle:
      add.classList.remove('hidden');
      form.classList.add('hidden');
      pause.classList.add('hidden');
      reset.classList.add('hidden');
      start.classList.add('hidden');
      break;
    case process.add:
      add.classList.add('hidden');
      form.classList.remove('hidden');
      pause.classList.add('hidden');
      reset.classList.add('hidden');
      start.classList.add('hidden');
      name.focus();
      break;
    case process.ready:
      add.classList.remove('hidden');
      form.classList.add('hidden');
      pause.classList.add('hidden');
      reset.classList.add('hidden');
      start.classList.remove('hidden');
      form.reset();
      break;
    case process.countdown:
      add.classList.add('hidden');
      form.classList.add('hidden');
      reset.classList.remove('hidden');
      pause.classList.remove('hidden');
      start.classList.add('hidden');
      break;
    case process.pause:
      add.classList.add('hidden');
      form.classList.add('hidden');
      pause.classList.add('hidden');
      reset.classList.remove('hidden');
      start.classList.remove('hidden');
      break;
    default:
      break;
  }

  renderList(list, state.timers);
};

document.addEventListener('DOMContentLoaded', () => {
  const timers = JSON.parse(localStorage.getItem('timers')) || [];

  form.addEventListener('submit', handleSubmit);
  list.addEventListener('click', handleListClick);
  add.addEventListener('click', handleClick(process.add));
  pause.addEventListener('click', handleClick(process.pause));
  reset.addEventListener('click', handleClick(process.ready));
  start.addEventListener('click', handleClick(process.countdown));

  setState({ process: timers.length > 0 ? process.ready : process.idle, timers });
});
