import { secondsToTime } from './utils';

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

export const updateUI = (currentState, states) => {
  const add = document.getElementById('add');
  const start = document.getElementById('start');
  const stop = document.getElementById('stop');
  const reset = document.getElementById('reset');

  switch (currentState) {
    case states.IDLE:
      add.classList.remove('hidden');
      start.classList.remove('hidden');
      stop.classList.add('hidden');
      reset.classList.add('hidden');
      break;
    case states.RUNNING:
      add.classList.add('hidden');
      start.classList.add('hidden');
      stop.classList.remove('hidden');
      reset.classList.remove('hidden');
      break;
    case states.PAUSED:
      add.classList.add('hidden');
      start.classList.remove('hidden');
      stop.classList.add('hidden');
      reset.classList.remove('hidden');
      break;
  }
};
