import xs from "xstream";
import uuid from "uuid";
import sampleCombine from "xstream/extra/sampleCombine";
import Timer from "./Timer";

export default class Track {
  static emptyArray(length) {
    return Array.from({ length }, () => []);
  }

  addingEvents = {};
  events = Track.emptyArray(Timer.STEP_COUNT);
  completeEvents = Track.emptyArray(Timer.STEP_COUNT);
  ongoingEvents = {};

  constructor($timer) {
    this.timer$ = $timer;
    this.eventStream$ = xs.create();
    this.completeEvents$ = this.eventStream$
      .compose(sampleCombine(this.timer$))
      .map(([event, step]) => this.addEvent(step, event))
      .map(() => this.completeEvents)
      .startWith(this.completeEvents);
    this.completeEvents$.subscribe({ next: () => {} })
    this.stream$ = this.timer$
      .map(step => this.events[step])
      .filter(events => events.length);
  }

  addEvent(step, event) {
    if(event.type === "START") this.ongoingEvents[event.id] = { event, startTime: step };
    if(event.type === "STOP") {
      const startEvent = this.ongoingEvents[event.id];
      delete this.ongoingEvents[event.id];
      this.completeEvents[startEvent.startTime].push({ note: event.note, length: step - startEvent.startTime });
    }
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
    this.events = Track.emptyArray(Timer.STEP_COUNT);
    this.completeEvents = Track.emptyArray(Timer.STEP_COUNT);
  }
}
