export default class Track {
  static emptyArray(length) {
    return Array.from({ length }, () => []);
  }

  events = Track.emptyArray(1024);

  constructor($timer) {
    this.$stream = $timer.map(step => this.events[step]).filter((events) => events.length);
  }

  addEvent(step, event) {
    this.events[step].push(event);
  }

  clear() {
    this.events = Track.emptyArray(1024);
  }
}
