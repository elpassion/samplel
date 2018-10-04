import Timer from "./Timer";

describe("Timer", () => {
  test("in 1 second publishes 16 events for bpm 60", () => {
    jest.useFakeTimers();
    const ticks = [];
    const timer = new Timer(60, "START");
    timer.stream$.subscribe({ next: event => ticks.push(event) });
    jest.advanceTimersByTime(1000);
    expect(ticks).toMatchSnapshot();
  });

  test("in 1 second publishes 32 events for bpm 120", () => {
    jest.useFakeTimers();
    const ticks = [];
    const timer = new Timer(120, "START");
    timer.stream$.subscribe({ next: event => ticks.push(event) });
    jest.advanceTimersByTime(1000);
    expect(ticks).toMatchSnapshot();
  });

  test("correctly reacts to bpm change", () => {
    jest.useFakeTimers();
    const ticks = [];
    const timer = new Timer(120, "START");
    timer.stream$.subscribe({ next: event => ticks.push(event) });
    jest.advanceTimersByTime(1000);
    timer.setBpm(60);
    jest.advanceTimersByTime(1000);
    expect(ticks).toMatchSnapshot();
  });

  test("correctly wraps beatNumbers", () => {
    jest.useFakeTimers();
    const ticks = [];
    const timer = new Timer(60, "START");
    timer.stream$.subscribe({ next: event => ticks.push(event) });
    jest.advanceTimersByTime(5000);
    expect(ticks).toMatchSnapshot();
  });

  test("publishes no events when state is stop", () => {
    jest.useFakeTimers();
    const ticks = [];
    const timer = new Timer(120);
    timer.stream$.subscribe({ next: event => ticks.push(event) });
    jest.advanceTimersByTime(1000);
    expect(ticks).toMatchSnapshot();
    timer.start();
    jest.advanceTimersByTime(1000);
    expect(ticks).toMatchSnapshot();
    timer.stop();
    jest.advanceTimersByTime(1000);
    expect(ticks).toMatchSnapshot();
  });
});
