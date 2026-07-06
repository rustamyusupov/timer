import { describe, it, expect } from 'vitest';
import { formatTime, normalizeWorkout } from './utils';

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
