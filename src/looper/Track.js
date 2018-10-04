import xs from "xstream";
import uuid from "uuid";
import sampleCombine from 'xstream/extra/sampleCombine'

export default class Track {
  static emptyArray(length) {
    return Array.from({ length }, () => []);
  }

  addingEvents = {};
  events = Track.emptyArray(1024);

  constructor($timer) {
    this.timer$ = $timer;
    this.eventStream$ = xs.create();
    this.eventStream$
      .compose(sampleCombine(this.timer$))
      .map(([event, step]) => this.addEvent(step, event))
      .subscribe({ next: () => {} });
    this.stream$ = this.timer$
      .map(step => this.events[step])
      .filter(events => events.length);
  }

  addEvent(step, event) {
    this.events[step].push(event);
  }

  addEventStart(note, velocity) {
    const id = uuid.v4();
    this.addingEvents[note] = id;
    this.eventStream$.shamefullySendNext({ type: "START", note, velocity, id });
  }

  addEventStop(note) {
    const id = this.addingEvents[note];
    delete this.addingEvents[note];
    this.eventStream$.shamefullySendNext({ type: "STOP", note, id });
  }

  clear() {
    this.events = Track.emptyArray(1024);
  }
}
