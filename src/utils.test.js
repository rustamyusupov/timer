import { describe, it, expect } from 'vitest';
import { formatTime } from './utils';

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
