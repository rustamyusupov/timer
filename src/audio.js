import { delay } from './utils';

const ctx = new (window.AudioContext || window.webkitAudioContext)();

export const beep = async (duration = 500, volume = 1) =>
  new Promise(resolve => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNode.gain.value = volume;
    oscillator.frequency.value = 1000;
    oscillator.type = 'sine';

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);

    oscillator.onended = async () => {
      await delay(500);
      resolve();
    };
  });
