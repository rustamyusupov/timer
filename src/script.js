const renderTimer = (timer, index) => {
  const remove = document.createElement('button');
  const name = document.createElement('span');
  const time = document.createElement('span');
  const item = document.createElement('li');
  const list = document.getElementById('list');

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

const render = timers => {
  const list = document.getElementById('list');

  list.innerHTML = '';

  if (timers.length === 0) {
    const li = document.createElement('li');

    li.classList.add('text');
    li.textContent = 'No timers';
    list.appendChild(li);

    return;
  }

  timers.forEach(renderTimer);
};

const handleAdd = event => {
  const form = document.getElementById('form');
  const name = document.getElementById('name');

  event.target.classList.add('hidden');
  form.classList.remove('hidden');

  name.focus();
};

const handleSubmit = event => {
  const data = new FormData(event.target);
  const add = document.getElementById('add');
  const saved = localStorage.getItem('timers');
  const values = Object.fromEntries(data.entries());
  const timers = [...(JSON.parse(saved) || []), values];

  localStorage.setItem('timers', JSON.stringify(timers));

  event.target.classList.add('hidden');
  add.classList.remove('hidden');

  event.target.reset();

  render(timers);
};

const handleListClick = event => {
  if (!event.target.classList.contains('remove')) {
    return;
  }

  const index = event.target.dataset.index;
  const saved = localStorage.getItem('timers');
  const timers = JSON.parse(saved) || [];

  timers.splice(index, 1);
  localStorage.setItem('timers', JSON.stringify(timers));

  render(timers);
};

document.addEventListener('DOMContentLoaded', () => {
  const add = document.getElementById('add');
  const form = document.getElementById('form');
  const list = document.getElementById('list');
  const saved = localStorage.getItem('timers');
  const timers = JSON.parse(saved) || [];

  add.addEventListener('click', handleAdd);
  form.addEventListener('submit', handleSubmit);
  list.addEventListener('click', handleListClick);

  render(timers);
});
