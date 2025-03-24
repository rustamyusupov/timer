import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTimer } from './timer';

describe('createTimer', () => {
  let timer;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
  });

  it('should create a timer with default options', () => {
    timer = createTimer();

    expect(timer.getState().isRunning).toBe(false);
    expect(timer.getState().seconds).toBe(0);
    expect(timer.getState().timers).toEqual([]);
  });

  it('should initialize timer with provided timers', () => {
    const timers = [
      { time: 30, active: false },
      { time: 60, active: false },
    ];
    timer = createTimer({ timers });

    expect(timer.getState().timers).toEqual(timers);
  });

  it('should call onUpdate when initialized', () => {
    const onUpdate = vi.fn();
    timer = createTimer({ onUpdate });

    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        isRunning: false,
        seconds: 0,
      })
    );
  });

  it('should move to next timer when current timer completes', () => {
    const timers = [
      { time: 2, active: false },
      { time: 3, active: false },
    ];

    const onUpdate = vi.fn();
    timer = createTimer({ timers, onUpdate });

    timer.toggle();
    expect(timer.getState().timerIdx).toBe(0);
    expect(timer.getState().timers[0].active).toBe(true);

    vi.advanceTimersByTime(3000);

    expect(timer.getState().timerIdx).toBe(1);
    expect(timer.getState().timers[0].active).toBe(false);
    expect(timer.getState().timers[1].active).toBe(true);
    expect(timer.getState().seconds).toBe(3);
  });

  it('should reset when all timers complete', () => {
    const timers = [
      { time: 1, active: false },
      { time: 1, active: false },
    ];

    const onUpdate = vi.fn();
    timer = createTimer({ timers, onUpdate });

    timer.toggle();
    vi.advanceTimersByTime(4000); // 1, 0, 1, 0 – 4 seconds

    expect(timer.getState().isRunning).toBe(false);
    expect(timer.getState().seconds).toBe(0);
    expect(timer.getState().timerIdx).toBe(0);
    expect(timer.getState().timers.every(t => !t.active)).toBe(true);
  });

  it('should toggle timer state correctly', () => {
    timer = createTimer({
      timers: [{ time: 5, active: false }],
    });

    timer.toggle();
    expect(timer.getState().isRunning).toBe(true);

    timer.toggle();
    expect(timer.getState().isRunning).toBe(false);
  });

  it('should reset timer correctly', () => {
    const timers = [{ time: 10, active: false }];
    timer = createTimer({ timers });

    timer.toggle();
    vi.advanceTimersByTime(2000);
    timer.reset();

    expect(timer.getState().isRunning).toBe(false);
    expect(timer.getState().seconds).toBe(0);
    expect(timer.getState().timerIdx).toBe(0);
    expect(timer.getState().timers[0].active).toBe(false);
  });

  it('should skip to next timer when calling next()', () => {
    const timers = [
      { time: 10, name: 'first', active: false },
      { time: 5, name: 'second', active: false },
    ];
    const onStart = vi.fn();
    timer = createTimer({ timers, onStart });

    timer.toggle();
    expect(timer.getState().timerIdx).toBe(0);

    timer.next();

    expect(timer.getState().timerIdx).toBe(1);
    expect(timer.getState().seconds).toBe(5);
    expect(timer.getState().timers[0].active).toBe(false);
    expect(timer.getState().timers[1].active).toBe(true);
    expect(onStart).toHaveBeenCalledWith('second');
  });

  it('should call onStart when timer starts', () => {
    const onStart = vi.fn();
    timer = createTimer({
      timers: [{ time: 5, name: 'test timer', active: false }],
      onStart,
    });

    timer.toggle();

    expect(onStart).toHaveBeenCalledWith('test timer');
  });

  it('should handle stop and restart correctly', () => {
    const timers = [{ time: 10, active: false }];
    const onUpdate = vi.fn();
    timer = createTimer({ timers, onUpdate });

    timer.toggle();
    vi.advanceTimersByTime(2000);
    expect(timer.getState().seconds).toBe(8);

    timer.stop();
    expect(timer.getState().isRunning).toBe(true);

    vi.advanceTimersByTime(3000);
    expect(timer.getState().seconds).toBe(8);

    timer.start();
    vi.advanceTimersByTime(1000);
    expect(timer.getState().seconds).toBe(7);
  });

  it('should call onTick when timer is running', () => {
    const onTick = vi.fn();
    timer = createTimer({
      timers: [{ time: 10, active: false }],
      onTick,
    });

    timer.toggle();
    vi.advanceTimersByTime(1000);

    expect(onTick).toHaveBeenCalledWith(9);
  });

  it('should call onEnd when timer reaches zero', () => {
    const onEnd = vi.fn();
    timer = createTimer({
      timers: [{ time: 2, active: false }],
      onEnd,
    });

    timer.toggle();
    vi.advanceTimersByTime(2000);

    expect(onEnd).toHaveBeenCalled();
  });

  it('should call onComplete when all timers finish', () => {
    const onComplete = vi.fn();
    timer = createTimer({
      timers: [{ time: 1, active: false }],
      onComplete,
    });

    timer.toggle();
    vi.advanceTimersByTime(2000);

    expect(onComplete).toHaveBeenCalled();
  });

  it('should handle rapid time advancement correctly', () => {
    const timers = [
      { time: 5, active: false },
      { time: 5, active: false },
    ];
    timer = createTimer({ timers });

    timer.toggle();
    vi.advanceTimersByTime(7000);

    expect(timer.getState().timerIdx).toBe(1);
    expect(timer.getState().seconds).toBe(4);
  });
});
