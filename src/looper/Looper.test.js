import xs from 'xstream'

class Timer {
  constructor(bpm) {
    this.bpm = bpm;
    this.stream = xs.periodic((1000 * this.bpm / 60) / 256);
  }

  setBpm(newBpm) {
    this.bpm = newBpm;
  }

  subscribe(fn) {
    this.stream.addListener({ next: fn });
  }
}

describe("Timer", () => {
  test("sets initial bpm", () => {
    const timer = new Timer(120);
    expect(timer.bpm).toBe(120);
  });

  test("sets new bpm", () => {
    const timer = new Timer(120);
    timer.setBpm(240);
    expect(timer.bpm).toBe(240);
  });

  test("publishes an event every second for bpm = 60 * 256", () => {
    jest.useFakeTimers();
    const ticks = [];
    const timer = new Timer(60);
    timer.subscribe(event => ticks.push(event))
    jest.advanceTimersByTime(1000);
    expect(ticks.length).toBe(256);
  })
});
