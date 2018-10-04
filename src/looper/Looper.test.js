class Timer {
  constructor(bpm) {
    this.bpm = bpm;
  }
}

describe("Timer", () => {
  test("sets correct bpm", () => {
    const timer = new Timer(120);
    expect(timer.bpm).toBe(120);
  })
})