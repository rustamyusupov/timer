import { delay } from './utils';

const ctx = new (window.AudioContext || window.webkitAudioContext)();

// 4 samples of 8-bit silence: playing it through an <audio> element moves the
// iOS audio session to "playback", so the mute switch no longer silences Web Audio
const SILENCE =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAACAgICA';

export const beep = async (duration = 500, volume = 1) => {
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  return new Promise(resolve => {
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
};

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
    new Audio(SILENCE).play().catch(() => {});
    ctx.resume().catch(() => {});

    const lecture = new SpeechSynthesisUtterance('hello');

    lecture.volume = 0;
    speechSynthesis.speak(lecture);

    document.removeEventListener('click', simulateAudio);
  };

  document.addEventListener('click', simulateAudio);
};
