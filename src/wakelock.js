export const createWakeLock = () => {
  let wakeLock = null;
  let isWakeLockRequested = false;

  const requestWakeLock = async () => {
    if (!isWakeLockRequested || wakeLock) {
      return;
    }

    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => {
        wakeLock = null;
      });
    } catch (err) {
      console.error('Wake lock request failed:', err);
      wakeLock = null;
    }
  };

  const enable = async () => {
    isWakeLockRequested = true;

    if (document.visibilityState === 'visible') {
      return requestWakeLock();
    }
  };

  const disable = () => {
    isWakeLockRequested = false;

    if (wakeLock) {
      wakeLock.release();
      wakeLock = null;
    }
  };

  document.addEventListener('visibilitychange', () => {
    if (isWakeLockRequested && document.visibilityState === 'visible') {
      requestWakeLock();
    }
  });

  return { enable, disable };
};
