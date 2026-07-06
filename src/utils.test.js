import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatTime, loadWorkout, normalizeWorkout } from './utils';

describe('loadWorkout', () => {
  const workout = { name: 'Yoga', sport: 'Yoga', timers: [{ id: 0, name: 'Cat-Cow', time: 90 }] };
  let storage;

  beforeEach(() => {
    storage = {};
    vi.stubGlobal('window', { location: { search: '' } });
    vi.stubGlobal('localStorage', {
      getItem: key => storage[key] ?? null,
      setItem: (key, value) => {
        storage[key] = value;
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('fetches workout from the url param and remembers the url', async () => {
    window.location.search = '?url=/workout.json';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => workout }));

    await expect(loadWorkout()).resolves.toEqual(workout);
    expect(storage.workoutUrl).toBe('"/workout.json"');
  });

  it('reuses the stored url when opened without params', async () => {
    storage.workoutUrl = '"/workout.json"';
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => workout });
    vi.stubGlobal('fetch', fetchMock);

    await expect(loadWorkout()).resolves.toEqual(workout);
    expect(fetchMock).toHaveBeenCalledWith('/workout.json');
  });

  it('falls back to the stored workout when the fetch fails', async () => {
    storage.workoutUrl = '"/workout.json"';
    storage.timers = JSON.stringify(workout);
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(loadWorkout()).resolves.toEqual(workout);
  });
});

describe('normalizeWorkout', () => {
  it('wraps a plain timers array with default name and sport', () => {
    const timers = [{ id: 0, name: 'Test 1', time: 5 }];

    expect(normalizeWorkout(timers)).toEqual({ name: 'Workout', sport: 'Workout', timers });
  });

  it('keeps name and sport from a workout object', () => {
    const workout = { name: 'Yoga', sport: 'Yoga', timers: [] };

    expect(normalizeWorkout(workout)).toEqual(workout);
  });

  it('fills missing fields with defaults', () => {
    expect(normalizeWorkout({ timers: [] })).toEqual({
      name: 'Workout',
      sport: 'Workout',
      timers: [],
    });
  });

  it('returns an empty workout for null', () => {
    expect(normalizeWorkout(null)).toEqual({ name: 'Workout', sport: 'Workout', timers: [] });
  });
});

describe('formatTime', () => {
  it('formats 0 seconds correctly', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('formats seconds less than 10 correctly', () => {
    expect(formatTime(5)).toBe('00:05');
  });

  it('formats seconds greater than or equal to 10 correctly', () => {
    expect(formatTime(42)).toBe('00:42');
  });

  it('formats whole minutes correctly', () => {
    expect(formatTime(60)).toBe('01:00');
    expect(formatTime(120)).toBe('02:00');
  });

  it('formats minutes and seconds correctly', () => {
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(126)).toBe('02:06');
  });

  it('formats time greater than an hour correctly', () => {
    expect(formatTime(3600)).toBe('60:00');
    expect(formatTime(3723)).toBe('62:03');
  });
});
