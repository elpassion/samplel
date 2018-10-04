import xs from "xstream";

export default class Timer {
  constructor(bpm) {
    this.bpmProducer = {
      start: listener => {
        this.bpmListener = listener;
        this.bpmListener.next(bpm);
      },
      stop: () => {}
    };
    this.nextBeatNumberGenerator = Timer.nextBeatNumber();
    this.$stream = xs
      .create(this.bpmProducer)
      .map(bpm => xs.periodic((1000 * bpm) / 60 / 256))
      .flatten()
      .map(() => this.nextBeatNumberGenerator.next().value);
  }

  static *nextBeatNumber() {
    let beatNumber = -1;
    while (true) {
      if (beatNumber === 1023) beatNumber = -1;
      beatNumber++;
      yield beatNumber;
    }
  }

  setBpm(newBpm) {
    this.bpmListener.next(newBpm);
  }
}
