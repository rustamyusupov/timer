import { secondsInMinute } from './constants';

export const convertTimeToSeconds = time => {
  const [minutes, seconds] = time.split(':').map(Number);

  return minutes * secondsInMinute + seconds;
};

export const convertSecondsToTime = seconds => {
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

export const beep = ({ ctx, duration = 100, frequency = 1000, volume = 2, type = 'triangle' }) => {
  if (!ctx) {
    console.warn('AudioContext is not provided');
    return;
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  gainNode.gain.value = volume;
  oscillator.frequency.value = frequency;
  oscillator.type = type;

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration / 1000);
};
