import xs from "xstream";

export default class Track {
  static emptyArray(length) {
    return Array.from({ length }, () => []);
  }

  events = Track.emptyArray(1024);
  currentlyRecordingNotes = {};

  constructor($timer) {
    this.$timer = $timer;
    this.$eventStream = {
      start: listener => {
        this.eventListener = listener;
      },
      stop: () => {}
    };
    xs.combine(this.$eventStream, this.$timer).map(
      ([{ type, ...event }, step]) => {
        if (type === "START") {
          this.currentlyRecordingNotes[event.note] = {
            ...event,
            startStep: step
          };
        } else {
          const note = this.currentlyRecordingNotes[event.note];
          this.addEvent(note.step, { ...note, endStep: step });
        }
      }
    );
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
