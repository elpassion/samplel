import xs from "xstream";
import sampleCombine from "xstream/extra/sampleCombine";

export default class Timer {
  static BEAT_STEP_COUNT = 16;
  static BEAT_COUNT = 4;
  static STEP_COUNT = Timer.BEAT_STEP_COUNT * Timer.BEAT_COUNT;

  static *BeatNumberGenerator() {
    let beatNumber = -1;
    while (true) {
      if (beatNumber === Timer.STEP_COUNT - 1) {
        beatNumber = -1;
      }
      beatNumber++;
      yield beatNumber;
    }
  }

  constructor(initialBpm = 60, initialState = "STOP") {
    this.bpmStream$ = xs.create().startWith(initialBpm);
    this.stateStream$ = xs.create().startWith(initialState);
    this.nextBeatNumberGenerator = Timer.BeatNumberGenerator();
    this.stream$ = this.bpmStream$
      .map(bpm => {
        return xs.periodic((60 * 4 * 1000) / (bpm * Timer.STEP_COUNT));
      })
      .flatten()
      .compose(sampleCombine(this.stateStream$))
      .filter(([, state]) => state === "START")
      .map(() => this.nextBeatNumberGenerator.next().value)
      .startWith(0);
  }

  setBpm(newBpm) {
    this.bpmStream$.shamefullySendNext(newBpm);
  }

  start() {
    this.stateStream$.shamefullySendNext("START");
  }

  stop() {
    this.stateStream$.shamefullySendNext("STOP");
  }
}
