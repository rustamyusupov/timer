const renderList = () => {
  const list = document.querySelector('ul');
  const saved = localStorage.getItem('timers');
  const timers = JSON.parse(saved) || [];

  list.innerHTML = '';

  if (timers.length === 0) {
    const li = document.createElement('li');

    li.classList.add('text');
    li.textContent = 'No timers';
    list.appendChild(li);
    return;
  }

  timers.forEach(timer => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    const name = document.createElement('span');
    const time = document.createElement('span');

    button.classList.add('item');
    button.setAttribute('type', 'button');
    button.setAttribute('id', 'edit');

    name.classList.add('text', 'name');
    name.textContent = timer.name;

    time.classList.add('text', 'time');
    time.textContent = timer.time;

    button.appendChild(name);
    button.appendChild(time);
    li.appendChild(button);
    list.appendChild(li);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const add = document.querySelector('#add');
  const edit = document.querySelector('#edit');
  const form = document.querySelector('form');

  add.addEventListener('click', () => {
    add.classList.add('hidden');
    form.classList.remove('hidden');
  });

  edit.addEventListener('dblclick', e => {
    console.log(e);
  });

  form.addEventListener('submit', () => {
    const formData = new FormData(form);
    const saved = localStorage.getItem('timers');
    const values = Object.fromEntries(formData.entries());
    const timers = JSON.stringify([...(JSON.parse(saved) || []), values]);

    add.classList.remove('hidden');
    form.classList.add('hidden');
    localStorage.setItem('timers', timers);
    form.reset();
    renderList();
  });

  renderList();
});
