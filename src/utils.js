import { beepConfig, millisecondsInSecond, secondsInMinute } from './constants';

export const timeToSeconds = time => {
  const [minutes, seconds] = time.split(':').map(Number);

  return minutes * secondsInMinute + seconds;
};

export const secondsToTime = seconds => {
  const minutes = String(Math.floor(seconds / secondsInMinute)).padStart(2, '0');
  const remaining = String(seconds % secondsInMinute).padStart(2, '0');

  return `${minutes}:${remaining}`;
};

export const request = async url => {
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

export const loadTimers = async () => {
  const params = new URLSearchParams(window.location.search);
  const url = params.get('url');

  return url ? await request(url) : JSON.parse(localStorage.getItem('timers')) || [];
};

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
