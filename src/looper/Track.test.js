import xs from "xstream";
import Track from "./Track";

describe("Track", () => {
  test("converts publishes events saved on track", () => {
    const ticks = [];
    const timer$ = xs.of(0, 2);
    const track = new Track(timer$);
    track.addEvent(2, { id: "123" });
    track.stream$.subscribe({ next: event => ticks.push(event) });
    expect(ticks).toEqual([[{ id: "123" }]]);
  });

  test("clear clears all events saved on track", () => {
    const timer$ = xs.empty();
    const track = new Track(timer$);
    track.addEvent(2, { id: "123" });
    track.clear();
    expect(track.events).toEqual(Track.emptyArray(1024));
  });

  test("converts publishes events saved on track", () => {
    const ticks = [];
    const timer$ = xs.create();
    const track = new Track(timer$);
    track.stream$.subscribe({ next: event => ticks.push(event) });
    timer$.shamefullySendNext(0);
    track.addEventStart("A1", 100);
    timer$.shamefullySendNext(2);
    track.addEventStop("A1");
    timer$.shamefullySendNext(0);
    expect(ticks).toEqual([
      [{ note: "A1", velocity: 100, id: expect.any(String), type: "START" }]
    ]);
  });
});
