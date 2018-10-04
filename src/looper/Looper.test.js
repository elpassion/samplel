import xs from "xstream";

class Timer {
  constructor(bpm) {
    this.bpmProducer = {
      start: (listener) => {
        this.bpmListener = listener;
        this.bpmListener.next(bpm);
      },
      stop: () => {}
    }
    this.stream = 
      xs
        .create(this.bpmProducer)
        .map((bpm) => xs.periodic((1000 * bpm) / 60 / 256))
        .flatten();
  }

  setBpm(newBpm) {
    this.bpmListener.next(newBpm);
  }

  subscribe(fn) {
    return this.stream.subscribe({ next: fn });
  }
}

describe("Timer", () => {
  test("publishes an event every second for bpm = 60 * 256", () => {
    jest.useFakeTimers();
    const ticks = [];
    const timer = new Timer(60);
    timer.subscribe(event => ticks.push(event));
    jest.advanceTimersByTime(1000);
    expect(ticks.length).toBe(256);
  });

  test("publishes an event every second for bpm = 120 * 256", () => {
    jest.useFakeTimers();
    const ticks = [];
    const timer = new Timer(120);
    timer.subscribe(event => ticks.push(event));
    jest.advanceTimersByTime(1000);
    expect(ticks.length).toBe(128);
  });

  test("publishes an event every second for bpm = 120 * 256 and then for bpm = 60 * 256", () => {
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
