import { process, startTime } from './constants.js';

export const renderTimer = (elements, state) => {
  elements.timer.textContent = state.current.time ? state.current.time : startTime;
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

export const renderList = (elements, state) => {
  const { list } = elements;

  list.innerHTML = '';
  state.timers.forEach(renderItem(list));
};

export const updateVisibility = (elements, state) => {
  const { add, form, name, pause, reset, start } = elements;

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
};
