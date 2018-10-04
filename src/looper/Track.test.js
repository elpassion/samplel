import xs from "xstream";
import Track from "./Track";

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
    expect(track.events).toEqual(Track.emptyArray(1024));
  });
});
