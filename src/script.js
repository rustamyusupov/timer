document.addEventListener('DOMContentLoaded', () => {
  const add = document.querySelector('#add');
  const form = document.querySelector('form');

  add.addEventListener('click', () => {
    add.classList.add('hidden');
    form.classList.remove('hidden');
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
  });
});
