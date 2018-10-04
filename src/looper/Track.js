import xs from "xstream";
import sampleCombine from 'xstream/extra/sampleCombine'

export default class Track {
  static emptyArray(length) {
    return Array.from({ length }, () => []);
  }

  events = Track.emptyArray(1024);
  currentlyRecordingNotes = {};

  constructor($timer) {
    this.$timer = $timer;
    this.$eventStream = xs.create({
      start: listener => {
        this.eventListener = listener;
      },
      stop: () => {}
    });
    this.$eventStream.compose(sampleCombine(this.$timer)).map(
      ([{ type, ...event }, step]) => {
        if (type === "START") {
          this.currentlyRecordingNotes[event.note] = {
            ...event,
            startStep: step
          };
        } else {
          const note = this.currentlyRecordingNotes[event.note];
          this.addEvent(note.startStep, { ...note, endStep: step });
        }
      }
    ).subscribe({ next: () => {} });
    this.$stream = this.$timer
      .map(step => this.events[step])
      .filter(events => events.length);
  }

  addEvent(step, event) {
    this.events[step].push(event);
  }

  addEventStart(note, velocity) {
    this.eventListener.next({ type: "START", note, velocity });
  }

  addEventStop(note) {
    this.eventListener.next({ type: "STOP", note });
  }

  clear() {
    this.events = Track.emptyArray(1024);
  }
}
