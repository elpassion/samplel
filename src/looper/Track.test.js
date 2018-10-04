class Track {
  constructor(timer) {
    this.timer = timer;
    this.timer.subscribe();
  }
}

describe("Track", () => {
  test("subscribes to Timer", () => {
    const timer = { subscribe: jest.fn() };
    new Track(timer);
    expect(timer.subscribe).toHaveBeenCalled();
  })
})