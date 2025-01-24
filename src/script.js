const add = document.getElementById('add');
const form = document.getElementById('form');
const list = document.getElementById('list');
const name = document.getElementById('name');

const formState = {
  hide: 'hide',
  show: 'show',
};

const process = {
  idle: 'idle',
  ready: 'ready',
  countdown: 'countdown',
  pause: 'pause',
};

const state = {
  form: formState.hide,
  process: process.idle,
  timers: [],
};

const setState = newState => {
  Object.assign(state, newState);
  localStorage.setItem('timers', JSON.stringify(state.timers));
  render(state);
};

const handleAddClick = () => setState({ form: formState.show });

const handleSubmit = event => {
  const data = new FormData(event.target);
  const values = Object.fromEntries(data.entries());
  const timers = [...state.timers, values];

  setState({ form: formState.hide, process: process.ready, timers });
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
  switch (state.form) {
    case formState.hide:
      add.classList.remove('hidden');
      form.classList.add('hidden');
      form.reset();
      break;
    case formState.show:
      add.classList.add('hidden');
      form.classList.remove('hidden');
      name.focus();
      break;
    default:
      break;
  }

  switch (state.process) {
    case process.idle:
      break;
    case process.ready:
      break;
    case process.countdown:
      break;
    case process.pause:
      break;
    default:
      break;
  }

  renderList(list, state.timers);
};

document.addEventListener('DOMContentLoaded', () => {
  const timers = JSON.parse(localStorage.getItem('timers')) || [];

  add.addEventListener('click', handleAddClick);
  form.addEventListener('submit', handleSubmit);
  list.addEventListener('click', handleListClick);

  setState({ process: timers > 0 ? process.ready : process.idle, timers });
});
