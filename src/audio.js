import { beepConfig, millisecondsInSecond } from './constants';
import { delay } from './utils';

const ctx = new (window.AudioContext || window.webkitAudioContext)();

export const beep = async ({ delayMs, duration, frequency, volume, type } = {}) =>
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

export const enableAudio = () => {
  const isiOS = navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

  if (!isiOS) {
    return;
  }

  const simulateAudio = () => {
    const lecture = new SpeechSynthesisUtterance('hello');

    lecture.volume = 0;
    speechSynthesis.speak(lecture);

    beep({ duration: 100, volume: 0 });

    document.removeEventListener('click', simulateAudio);
  };

  document.addEventListener('click', simulateAudio);
};

export const speak = async (text, delayMs = 0) => {
  const speech = new SpeechSynthesisUtterance(text);

  speech.pitch = 1;
  speech.volume = 1;
  speech.rate = 1;

  window.speechSynthesis.speak(speech);
  await delay(delayMs);
};
