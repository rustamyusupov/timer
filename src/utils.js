import { beepConfig, millisecondsInSecond, secondsInMinute } from './constants';

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

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const speak = async (text, delayMs = 0) => {
  const speech = new SpeechSynthesisUtterance(text);

  window.speechSynthesis.speak(speech);
  await delay(delayMs);
};

export const beep = async ({ ctx, delayMs, duration, frequency, volume, type }) =>
  new Promise(resolve => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNode.gain.value = volume ?? beepConfig.volume;
    oscillator.frequency.value = frequency ?? beepConfig.frequency;
    oscillator.type = type ?? beepConfig.type;

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + (duration ?? beepConfig.duration) / millisecondsInSecond);

    oscillator.onended = async () => {
      await delay(delayMs ?? beepConfig.delayMs);
      resolve();
    };
  });
