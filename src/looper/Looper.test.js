class Timer {
  constructor(bpm) {
    this.bpm = bpm;
  }

  setBpm(newBpm) {
    this.bpm = newBpm;
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
  })
});
