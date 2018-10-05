import React from "react";
import { Provider, connect } from "@seracio/xstream-connect";
import xs from "xstream";
import styled from "styled-components";
import Track from "./Track";
import {
  AudioContext,
  Oscillator,
  MidiInstrument,
} from "../Sound/Sound";
import Instrument from "../Instrument/Instrument";
import SoundLoader from "../Sound/SoundLoader";
import timer from "../timer";
import Timer from "./Timer";

const context = new AudioContext();
const soundLoader = new SoundLoader(context);

const store = {
  count$: timer.stream$,
  player$: timer.stateStream$,
  bpm$: timer.bpmStream$
};

const Beat = styled.div`
  flex: 1;
  border-left: 1px solid transparent;
  &:nth-child(4n + 1):not(:first-of-type) {
    border-left: 1px solid rgba(28, 28, 28, 0.4);
  }
`;

const HeaderBeat = styled(Beat)`
  height: 16px;
`;

const TrackBeat = styled(Beat)`
  height: 96px;
`;

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
      <>
        {/* <select onChange={this.onSelectInstrument}>
          <option value="oscillator">Oscillator</option>
          {soundLoader.instruments.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>*/}
        <TracksRow
          Component={
            <TracksColumn
              Component={<TrackBeat active={this.props.isActive} />}
            />
          }
        />
        <Instrument
          isActive={this.props.isActive}
          instrument={this.instrument}
          onKeyDown={key => this.track.addEventStart(key, undefined)}
          onKeyUp={key => this.track.addEventStop(key)}
        />
      </>
    );
  }
}

const Tracks = styled.div`
  background-color: #3d3d3d;
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
  width: 960px;
  margin: 0 auto;
`;

const TracksRow = ({ Component }) => (
  <TracksRow.Wrapper>
    {Array.from({ length: Timer.BEAT_COUNT }, () => Component)}
  </TracksRow.Wrapper>
);

TracksRow.Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  border-top: 1px solid black;
`;

const TracksColumn = ({ Component }) => (
  <TracksColumn.Wrapper>
    {Array.from({ length: Timer.BEAT_STEP_COUNT }, () => Component)}
  </TracksColumn.Wrapper>
);

TracksColumn.Wrapper = styled.div`
  border-left: 1px solid black;
  flex: 1;
  display: flex;
  flex-direction: row;
`;

const Ticker = styled.div.attrs({
  style: ({ position }) => ({
    transform: `translateX(${960 * (position / Timer.STEP_COUNT)}px)`
  })
})`
  width: 2px;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  position: absolute;
`;

class App extends React.Component {
  state = {
    activeTrack: 0
  };

  render() {
    const { count } = this.props;
    return (
      <Tracks>
        <Ticker position={count} />
        <TracksRow Component={<TracksColumn Component={<HeaderBeat />} />} />
        <TrackComponent isActive={this.state.activeTrack === 0} />
        <TrackComponent isActive={this.state.activeTrack === 1} />
        <TrackComponent isActive={this.state.activeTrack === 2} />
        <TrackComponent isActive={this.state.activeTrack === 3} />
      </Tracks>

      /* Active Track: <select
            onChange={e => this.setState({ activeTrack: parseInt(e.target.value, 10) })}
          >
          <option value={0}>0</option>
          <option value={1}>1</option>
        </select>
        <input value={bpm} onChange={e => timer.setBpm(e.target.value) || 0} />
        <button onClick={() => timer.start()} />
        <button onClick={() => timer.stop()} /> */
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
