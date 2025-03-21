const request = async url => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('Failed to fetch:', error);

    return [];
  }
};

const getFromStorage = key => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const setToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const initTimers = async () => {
  const params = new URLSearchParams(window.location.search);
  const url = params.get('url');
  const timers = url ? await request(url) : getFromStorage('timers');

  return timers || [];
};

export const formatTime = time =>
  `${Math.floor(time / 60)
    .toString()
    .padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
