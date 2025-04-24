export const createWakeLock = () => {
  let wakeLock = null;

  const enable = async () => {
    if (wakeLock) {
      return;
    }

    try {
      wakeLock = await navigator.wakeLock.request('screen');
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  };

  const disable = async () => {
    if (!wakeLock) {
      return;
    }

    try {
      await wakeLock.release();
      wakeLock = null;
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  };

  return { enable, disable };
};
