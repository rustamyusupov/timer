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

  timers.forEach((timer, index) => {
    const li = document.createElement('li');
    const remove = document.createElement('button');
    const name = document.createElement('span');
    const time = document.createElement('span');

    remove.classList.add('remove');
    remove.setAttribute('type', 'button');
    remove.textContent = '✖';
    remove.dataset.index = index;

    name.classList.add('text', 'name');
    name.textContent = timer.name;

    time.classList.add('text', 'time');
    time.textContent = timer.time;

    li.classList.add('item');
    li.appendChild(remove);
    li.appendChild(name);
    li.appendChild(time);
    list.appendChild(li);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const add = document.getElementById('add');
  const form = document.getElementById('form');
  const list = document.getElementById('list');
  const saved = localStorage.getItem('timers');
  const timers = JSON.parse(saved) || [];

  add.addEventListener('click', () => {
    const name = document.getElementById('name');

    add.classList.add('hidden');
    form.classList.remove('hidden');

    name.focus();
  });

  form.addEventListener('submit', () => {
    const formData = new FormData(form);
    const saved = localStorage.getItem('timers');
    const values = Object.fromEntries(formData.entries());
    const timers = [...(JSON.parse(saved) || []), values];

    localStorage.setItem('timers', JSON.stringify(timers));

    add.classList.remove('hidden');
    form.classList.add('hidden');

    form.reset();

    render(timers);
  });

  list.addEventListener('click', event => {
    if (!event.target.classList.contains('remove')) {
      return;
    }

    const index = event.target.dataset.index;
    const saved = localStorage.getItem('timers');
    const timers = JSON.parse(saved) || [];

    timers.splice(index, 1);
    localStorage.setItem('timers', JSON.stringify(timers));

    render(timers);
  });

  render(timers);
});
