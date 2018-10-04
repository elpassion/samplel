import Timer from "./Timer";

describe("Timer", () => {
  test("in 1 second publishes 256 events for bpm 60", () => {
    jest.useFakeTimers();
    const ticks = [];
    const timer = new Timer(60);
    timer.subscribe(event => ticks.push(event));
    jest.advanceTimersByTime(1000);
    expect(ticks.length).toBe(256);
  });

  test("in 1 second publishes 128 events for bpm 120", () => {
    jest.useFakeTimers();
    const ticks = [];
    const timer = new Timer(120);
    timer.subscribe(event => ticks.push(event));
    jest.advanceTimersByTime(1000);
    expect(ticks.length).toBe(128);
  });

  test("in 2 seconds publishes 384 events for bpm 120 and then 60", () => {
    jest.useFakeTimers();
    const ticks = [];
    const timer = new Timer(120);
    timer.subscribe(event => ticks.push(event));
    jest.advanceTimersByTime(1000);
    timer.setBpm(60);
    jest.advanceTimersByTime(1000);
    expect(ticks.length).toBe(384);
  });
});
