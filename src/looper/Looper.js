import React from "react";
import { Provider, connect } from "@seracio/xstream-connect";
import xs from "xstream";
import Track from "./Track";
import Timer from "./Timer";
import { AudioContext, Oscillator } from "../Sound/Sound";

const context = new AudioContext();

const timer = new Timer(60);

const store = {
  count$: timer.stream$,
  player$: timer.stateStream$,
  bpm$: timer.bpmStream$
};

class TrackComponent extends React.Component {
  track = new Track(timer.stream$);
  currentlyPlayingNotes = {};

  componentDidMount() {
    this.track.stream$.subscribe({
      next: events => {
        events.forEach(event => {
          if (event.type === "START") {
            const oscillator = new Oscillator(context);
            this.currentlyPlayingNotes[event.id] = oscillator;
            oscillator.play(this.props.note);
          } else {
            this.currentlyPlayingNotes[event.id].stop();
          }
        });
      }
    });
  }

  render() {
    return (
      <div>
        <button
          onMouseDown={() => this.track.addEventStart(69, undefined)}
          onMouseUp={() => this.track.addEventStop(69)}
        >
          BOOM
        </button>
        <button
          onClick={() => this.track.clear()}
        >
          X
        </button>
      </div>
    );
  }
}

const App = ({ count, bpm }) => {
  return (
    <div>
      <input value={bpm} onChange={e => timer.setBpm(e.target.value) || 0} />
      <button onClick={() => timer.start()} />
      <button onClick={() => timer.stop()} />
      <TrackComponent note={69} />
      <TrackComponent note={70} />
      {count}
    </div>
  );
};

const combinator = ({ count$, player$, bpm$ }) => {
  return xs
    .combine(count$, player$, bpm$)
    .map(([count, isPlaying, bpm]) => ({ count, isPlaying, bpm }));
};

const ConnectedApp = connect(combinator)(App);

export default class Looper extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedApp />
      </Provider>
    );
  }
}
