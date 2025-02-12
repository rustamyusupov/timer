import { millisecondsInSecond } from './constants';
import { delay } from './utils';

export const beep = async (ctx, duration = 500, volume = 1) =>
  new Promise(resolve => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNode.gain.value = volume;
    oscillator.frequency.value = 1000;
    oscillator.type = 'sine';

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / millisecondsInSecond);

    oscillator.onended = async () => {
      await delay(500);
      resolve();
    };
  });

export const speak = text => {
  const speech = new SpeechSynthesisUtterance(text);

  window.speechSynthesis.speak(speech);
};

export const enableAudio = () => {
  const isiOS = navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

  if (!isiOS) {
    return;
  }

  const simulateAudio = () => {
    const lecture = new SpeechSynthesisUtterance('hello');

    lecture.volume = 0;
    speechSynthesis.speak(lecture);

    document.removeEventListener('click', simulateAudio);
  };

  document.addEventListener('click', simulateAudio);
};
