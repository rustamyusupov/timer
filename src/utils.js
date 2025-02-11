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

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const beep = async ({ audioCtx, delayMs, duration, frequency, volume, type }) =>
  new Promise(resolve => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.value = volume ?? beepConfig.volume;
    oscillator.frequency.value = frequency ?? beepConfig.frequency;
    oscillator.type = type ?? beepConfig.type;

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(
      audioCtx.currentTime + (duration ?? beepConfig.duration) / millisecondsInSecond
    );

    oscillator.onended = async () => {
      await delay(delayMs ?? beepConfig.delayMs);
      resolve();
    };
  });

export const enableSpeak = () => {
  const isiOS = navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

  if (!isiOS) {
    return;
  }

  const simulateSpeech = () => {
    const lecture = new SpeechSynthesisUtterance('hello');

    lecture.volume = 0;
    speechSynthesis.speak(lecture);
    document.removeEventListener('click', simulateSpeech);
  };

  document.addEventListener('click', simulateSpeech);
};

export const speak = async (text, delayMs = 0) => {
  const speech = new SpeechSynthesisUtterance(text);

  speech.pitch = 1;
  speech.volume = 1;
  speech.rate = 1;

  window.speechSynthesis.speak(speech);
  await delay(delayMs);
};
