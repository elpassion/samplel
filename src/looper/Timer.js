import xs from "xstream";

export default class Timer {
  constructor(initialBpm = 60, initialState = "STOP") {
    this.bpmProducer = {
      start: listener => {
        this.bpmListener = listener;
        this.bpmListener.next(initialBpm);
      },
      stop: () => {}
    };

    this.stateProducer = {
      start: listener => {
        this.stateListener = listener;
      },
      stop: () => {}
    };

    this.nextBeatNumberGenerator = Timer.nextBeatNumber();
    const tickStream = xs
      .create(this.bpmProducer)
      .map(bpm => xs.periodic((1000 * bpm) / 60 / 256))
      .flatten()

    const stateStream = xs.create(this.stateProducer).startWith(initialState);

    this.$stream =
      xs.combine(tickStream, stateStream)
        .filter(([, state]) => state === "START")
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

  start() {
    this.stateListener.next("START");
  }

  stop() {
    this.stateListener.next("STOP");
  }
}
