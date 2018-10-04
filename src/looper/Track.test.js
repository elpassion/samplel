import xs from "xstream";

class Track {
  events = Array.from({length: 1024}, () => []);    
  constructor($timer) {
    this.$stream = $timer.map((step) => this.events[step])
  }
}

describe("Track", () => {
  test("abc", () => {
    const ticks = [];
    const $timer = xs.of(0);
    const track = new Track($timer);
    track.$stream.subscribe({ next: event => ticks.push(event) });
    expect(ticks).toEqual([[]])
  })
})