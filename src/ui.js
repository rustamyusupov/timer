import { secondsToTime, timeToSeconds } from './utils';

export const renderList = (currentId, timers) => {
  const list = document.getElementById('list');
  list.innerHTML = '';

  timers.forEach((timer, index) => {
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
    time.textContent = secondsToTime(timer.time);

    item.classList.add('item');
    item.classList.toggle('active', timer.id === currentId);
    item.appendChild(remove);
    item.appendChild(name);
    item.appendChild(time);

    list.appendChild(item);
  });
};

export const updateUI = (currentState, process) => {
  const add = document.getElementById('add');
  const start = document.getElementById('start');
  const stop = document.getElementById('stop');
  const reset = document.getElementById('reset');

  switch (currentState) {
    case process.IDLE:
      add.classList.remove('hidden');
      start.classList.remove('hidden');
      stop.classList.add('hidden');
      reset.classList.add('hidden');
      break;
    case process.RUNNING:
      add.classList.add('hidden');
      start.classList.add('hidden');
      stop.classList.remove('hidden');
      reset.classList.remove('hidden');
      break;
    case process.PAUSED:
      add.classList.add('hidden');
      start.classList.remove('hidden');
      stop.classList.add('hidden');
      reset.classList.remove('hidden');
      break;
  }
};

export const toggleForm = show => {
  const actions = document.querySelector('.actions');
  const form = document.getElementById('form');
  const name = document.getElementById('name');

  actions.classList.toggle('hidden', show);
  form.classList.toggle('hidden', !show);
  name.focus();
};

export const parseForm = target => {
  const data = new FormData(target);
  const name = document.getElementById('name');

  const values = Object.fromEntries(data.entries());
  const timer = { name: values.name, time: timeToSeconds(values.time) };
  name.value = '';

  return timer;
};
