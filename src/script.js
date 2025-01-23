document.addEventListener('DOMContentLoaded', () => {
  const add = document.querySelector('#add');
  const form = document.querySelector('form');

  add.addEventListener('click', () => {
    add.classList.add('hidden');
    form.classList.remove('hidden');
  });

  form.addEventListener('submit', e => {
    add.classList.remove('hidden');
    form.classList.add('hidden');
  });
});
