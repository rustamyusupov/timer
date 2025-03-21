import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTimer } from './timer';

describe('Timer', () => {
  let timer;
  let mockUpdateFn;

  beforeEach(() => {
    vi.useFakeTimers();

    mockUpdateFn = vi.fn();
    timer = createTimer();
    timer.setUpdate(mockUpdateFn);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test('initial state is correct', () => {
    const state = timer.getState();

    expect(state.isRunning).toBe(false);
    expect(state.seconds).toBe(0);
    expect(state.timerIdx).toBe(0);
    expect(state.timers).toEqual([]);
  });

  test('setTimers updates timers array', () => {
    const timers = [
      { time: 10, active: false },
      { time: 5, active: false },
    ];
    timer.setTimers(timers);

    expect(timer.getState().timers).toEqual(timers);
    expect(mockUpdateFn).toHaveBeenCalledTimes(1); // setTimers
  });

  test('toggle starts the timer when not running', () => {
    const timers = [{ time: 10, active: false }];
    timer.setTimers(timers);
    timer.toggle();

    const state = timer.getState();
    expect(state.isRunning).toBe(true);
    expect(state.seconds).toBe(10);
    expect(state.timers[0].active).toBe(true);
    expect(mockUpdateFn).toHaveBeenCalledTimes(2); // setTimers, toggle
  });

  test('toggle stops the timer when running', () => {
    const timers = [{ time: 10, active: false }];
    timer.setTimers(timers);
    timer.toggle(); // Start
    timer.toggle(); // Stop

    const state = timer.getState();
    expect(state.isRunning).toBe(false);
    expect(mockUpdateFn).toHaveBeenCalledTimes(4); // setTimers, toggle, stop, toggle
  });

  test('timer decrements seconds every second', () => {
    const timers = [{ time: 3, active: false }];
    timer.setTimers(timers);
    timer.toggle(); // Start

    expect(timer.getState().seconds).toBe(3);

    vi.advanceTimersByTime(1000);
    expect(timer.getState().seconds).toBe(2);

    vi.advanceTimersByTime(1000);
    expect(timer.getState().seconds).toBe(1);

    expect(mockUpdateFn).toHaveBeenCalledTimes(4); // setTimers, toggle, start * 2
  });

  test('next timer starts when current timer reaches zero', () => {
    const timers = [
      { time: 2, active: false },
      { time: 5, active: false },
    ];
    timer.setTimers(timers);
    timer.toggle(); // Start

    vi.advanceTimersByTime(2000); // First timer completes

    const state = timer.getState();
    expect(state.timerIdx).toBe(1);
    expect(state.seconds).toBe(5);
    expect(state.timers[0].active).toBe(false);
    expect(state.timers[1].active).toBe(true);
  });

  test('timer resets when all timers are complete', () => {
    const timers = [
      { time: 1, active: false },
      { time: 1, active: false },
    ];
    timer.setTimers(timers);
    timer.toggle(); // Start

    vi.advanceTimersByTime(2000); // Both timers complete

    const state = timer.getState();
    expect(state.isRunning).toBe(false);
    expect(state.seconds).toBe(0);
    expect(state.timerIdx).toBe(0);
    expect(state.timers.every(t => !t.active)).toBe(true);
  });

  test('reset returns timer to initial state', () => {
    const timers = [
      { time: 10, active: false },
      { time: 5, active: false },
    ];
    timer.setTimers(timers);
    timer.toggle(); // Start
    timer.reset();

    const state = timer.getState();
    expect(state.isRunning).toBe(false);
    expect(state.seconds).toBe(0);
    expect(state.timerIdx).toBe(0);
    expect(state.timers.every(t => !t.active)).toBe(true);
  });
});
