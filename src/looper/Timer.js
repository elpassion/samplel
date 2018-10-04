import xs from "xstream";
import sampleCombine from "xstream/extra/sampleCombine";

export default class Timer {
  constructor(initialBpm = 60, initialState = "STOP") {
    this.bpmProducer = {
      start: listener => {
        this.bpmListener = listener;
        this.bpmListener.next(initialBpm);
      },
      stop: () => {}
    };

    this.loopProducer = {
      start: listener => {
        this.loopListener = listener;
      },
      stop: () => {}
    };

    this.stateProducer = {
      start: listener => {
        this.stateListener = listener;
      },
      stop: () => {}
    };

    const $tickStream = xs
      .create(this.bpmProducer)
      .map(bpm => xs.periodic((1000 * bpm) / 60 / 256))
      .flatten();

    const $stateStream = xs.create(this.stateProducer).startWith(initialState);
    xs.create(this.loopProducer).addListener({ next: (loop) => loop });
    this.nextBeatNumberGenerator = Timer.nextBeatNumber(this.loopListener);
    this.$stream = $tickStream
      .compose(sampleCombine($stateStream))
      .filter(([, state]) => state === "START")
      .map(() => this.nextBeatNumberGenerator.next().value);
  }

  static *nextBeatNumber(loopListener) {
    let beatNumber = -1;
    while (true) {
      if (beatNumber === 1023) {
        beatNumber = -1;
        loopListener.next("a");
      }
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
