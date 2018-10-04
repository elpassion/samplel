import xs from "xstream";

export default class Timer {
  constructor(bpm) {
    this.bpmProducer = {
      start: (listener) => {
        this.bpmListener = listener;
        this.bpmListener.next(bpm);
      },
      stop: () => {}
    }
    this.stream = 
      xs
        .create(this.bpmProducer)
        .map((bpm) => xs.periodic((1000 * bpm) / 60 / 256))
        .flatten();
  }

  setBpm(newBpm) {
    this.bpmListener.next(newBpm);
  }

  subscribe(fn) {
    return this.stream.subscribe({ next: fn });
  }
}
