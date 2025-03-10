const secondsInMinute = 60;

export const timeToSeconds = time => {
  const [minutes, seconds] = time.split(':').map(Number);

  return minutes * secondsInMinute + seconds;
};

export const secondsToTime = seconds => {
  const minutes = String(Math.floor(seconds / secondsInMinute)).padStart(2, '0');
  const remaining = String(seconds % secondsInMinute).padStart(2, '0');

  return `${minutes}:${remaining}`;
};
