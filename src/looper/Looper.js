import React from "react";
import { Provider, connect } from "@seracio/xstream-connect";
import xs from "xstream";
import Track from "./Track";
import Timer from "./Timer";
import {
  AudioContext,
  Oscillator,
  MidiInstrument,
} from "../Sound/Sound";
import Instrument from "../Instrument/Instrument";
import SoundLoader from "../Sound/SoundLoader";

const context = new AudioContext();
const soundLoader = new SoundLoader(context);

const timer = new Timer(60);

const store = {
  count$: timer.stream$,
  player$: timer.stateStream$,
  bpm$: timer.bpmStream$
};

class TrackComponent extends React.Component {
  track = new Track(timer.stream$);
  currentlyPlayingNotes = {};
  state = {
    selectedInstrument: "oscillator"
  };

  componentDidMount() {
    this.track.stream$.subscribe({
      next: events => {
        events.forEach(event => {
          if (event.type === "START") {
            const instrument = this.instrument();
            this.currentlyPlayingNotes[event.id] = instrument;
            instrument.play(event.note);
          } else {
            this.currentlyPlayingNotes[event.id].stop();
          }
        });
      }
    });
  }

  instrument = () => {
    const { selectedInstrument } = this.state;

    return selectedInstrument === "oscillator"
      ? new Oscillator(context)
      : new MidiInstrument(context, soundLoader.buffers[selectedInstrument]);
  };

  onSelectInstrument = (e) => {
    const selectedInstrument = e.target.value;

    this.setState({ selectedInstrument });

    if (selectedInstrument === 'oscillator') return;

    soundLoader.loadInstrument(selectedInstrument)
      .then(() => console.log('Loaded', selectedInstrument));
  }

  render() {
    return (
      <div>
        <select onChange={this.onSelectInstrument}>
          <option value="oscillator">Oscillator</option>
          {soundLoader.instruments.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <Instrument
          isActive={this.props.isActive}
          instrument={this.instrument}
          onKeyDown={key => this.track.addEventStart(key, undefined)}
          onKeyUp={key => this.track.addEventStop(key)}
        />
      </div>
    );
  }
}

class App extends React.Component {
  state = {
    activeTrack: 0
  }

  render() {
    const { count, bpm } = this.props;
    return (
      <div>
        Active Track: <select
            onChange={e => this.setState({ activeTrack: parseInt(e.target.value, 10) })}
          >
          <option value={0}>0</option>
          <option value={1}>1</option>
        </select>
        <input value={bpm} onChange={e => timer.setBpm(e.target.value) || 0} />
        <button onClick={() => timer.start()} />
        <button onClick={() => timer.stop()} />
        <TrackComponent isActive={this.state.activeTrack === 0} />
        <TrackComponent isActive={this.state.activeTrack === 1} />
        {count}
      </div>
    );
  }
}

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
