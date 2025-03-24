import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from './render';
import { formatTime } from './utils';

vi.mock('./utils', () => ({
  formatTime: vi.fn(seconds => `formatted:${seconds}`),
}));

describe('render', () => {
  let elements;

  beforeEach(() => {
    elements = {
      display: { innerHTML: '' },
      toggle: { innerHTML: '', disabled: false },
      reset: { disabled: false },
      list: { innerHTML: '' },
    };

    global.document = {
      getElementById: id => elements[id],
    };
  });

  it('should render the correct time in the display', () => {
    const state = {
      timers: [{ name: 'Timer 1', time: 60, active: false }],
      seconds: 120,
      isRunning: false,
    };
    render(state);

    expect(formatTime).toHaveBeenCalledWith(120);
    expect(elements.display.innerHTML).toBe('formatted:120');
  });

  it('should set the toggle button text to "Start" when not running', () => {
    const state = {
      timers: [{ name: 'Timer 1', time: 60, active: false }],
      seconds: 120,
      isRunning: false,
    };
    render(state);

    expect(elements.toggle.innerHTML).toBe('Start');
  });

  it('should set the toggle button text to "Stop" when running', () => {
    const state = {
      timers: [{ name: 'Timer 1', time: 60, active: false }],
      seconds: 120,
      isRunning: true,
    };
    render(state);

    expect(elements.toggle.innerHTML).toBe('Stop');
  });

  it('should disable buttons when there are no timers', () => {
    const state = { timers: [], seconds: 0, isRunning: false };
    render(state);

    expect(elements.toggle.disabled).toBe(true);
    expect(elements.reset.disabled).toBe(true);
  });

  it('should enable buttons when there are timers', () => {
    const state = {
      timers: [{ name: 'Timer 1', time: 60, active: false }],
      seconds: 0,
      isRunning: false,
    };
    render(state);

    expect(elements.toggle.disabled).toBe(false);
    expect(elements.reset.disabled).toBe(false);
  });

  it('should render the timer list correctly', () => {
    const state = {
      timers: [
        { name: 'Timer 1', time: 60, active: true },
        { name: 'Timer 2', time: 120, active: false },
      ],
      seconds: 0,
      isRunning: false,
    };

    render(state);

    expect(elements.list.innerHTML).toContain('<li class="item active">');
    expect(elements.list.innerHTML).toContain('<span class="text name">Timer 1</span>');
    expect(elements.list.innerHTML).toContain('<span class="text time">formatted:60</span>');
    expect(elements.list.innerHTML).toContain('<li class="item">');
    expect(elements.list.innerHTML).toContain('<span class="text name">Timer 2</span>');
    expect(elements.list.innerHTML).toContain('<span class="text time">formatted:120</span>');
  });
});
