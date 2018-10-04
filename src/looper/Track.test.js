import xs from "xstream";

function emptyArray(length) {
  return Array.from({ length }, () => []);
}

class Track {
  events = emptyArray(1024);
  constructor($timer) {
    this.$stream = $timer.map(step => this.events[step]);
  }

  addEvent(step, event) {
    this.events[step].push(event);
  }

  clear() {
    this.events = emptyArray(1024);
  }
}

describe("Track", () => {
  test("converts publishes events saved on track", () => {
    const ticks = [];
    const $timer = xs.of(0, 2);
    const track = new Track($timer);
    track.addEvent(2, { id: "123" });
    track.$stream.subscribe({ next: event => ticks.push(event) });
    expect(ticks).toEqual([[], [{ id: "123" }]]);
  });

  test("clear clears all events saved on track", () => {
    const $timer = xs.empty();
    const track = new Track($timer);
    track.addEvent(2, { id: "123" });
    track.clear();
    expect(track.events).toEqual(emptyArray(1024));
  });
});
