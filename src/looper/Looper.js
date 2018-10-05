import React from "react";
import { Provider, connect } from "@seracio/xstream-connect";
import styled from "styled-components";
import Track from "./Track";
import { AudioContext, Oscillator, MidiInstrument } from "../Sound/Sound";
import Instrument from "../Instrument/Instrument";
import SoundLoader from "../Sound/SoundLoader";
import timer from "../timer";
import Timer from "./Timer";

const context = new AudioContext();
const soundLoader = new SoundLoader(context);

const Beat = styled.div`
  flex: 1;
  position: relative;
  border-left: 1px solid transparent;
  &:nth-child(4n + 1):not(:first-of-type) {
    border-left: 1px solid rgba(28, 28, 28, 0.4);
  }
`;

const HeaderBeat = styled(Beat)`
  height: 16px;
`;

class TrackBeat extends React.Component {
  static StyledBeat = styled(Beat)`
    height: 96px;
  `;

  render() {
    return (
      <TrackBeat.StyledBeat className={this.props.className}>
        {this.props.events[this.props.index].map((sound, index) => (
          <>
            <Sound
              key={index}
              length={sound.length}
              top={96 * (sound.note / 100)}
            />
          </>
        ))}
      </TrackBeat.StyledBeat>
    );
  }
}

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

  onSelectInstrument = e => {
    const selectedInstrument = e.target.value;

    this.setState({ selectedInstrument });

    if (selectedInstrument === "oscillator") return;

    soundLoader
      .loadInstrument(selectedInstrument)
      .then(() => console.log("Loaded", selectedInstrument));
  };

  render() {
    return (
      <Provider
        store={{
          events$: this.track.completeEvents$
        }}
      >
        <>
          <ConnectedTracksRow
            onSelectInstrument={this.onSelectInstrument}
            onClick={this.props.onClick}
            Column={TracksColumn}
            Beat={TrackBeat}
            isActive={this.props.isActive}
          />
          <Instrument
            isActive={this.props.isActive}
            instrument={this.instrument}
            onKeyDown={key => this.track.addEventStart(key, undefined)}
            onKeyUp={key => this.track.addEventStop(key)}
          />
        </>
      </Provider>
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

const InstrumentPicker = styled.select`
  position: absolute;
  left: 100%;
`;

const TracksRow = ({ Column, Beat, events, onClick, onSelectInstrument, isActive }) => (
  <TracksRow.Wrapper onClick={onClick} isActive={isActive}>
    {Array.from({ length: Timer.BEAT_COUNT }, (_, index) => (
      <>
        {onSelectInstrument && (
          <InstrumentPicker onChange={onSelectInstrument}>
            {soundLoader.instruments.map(name => (
              <option value={name}>{name}</option>
            ))}
          </InstrumentPicker>
        )}
        <Column key={index} index={index} Beat={Beat} events={events} />
      </>
    ))}
  </TracksRow.Wrapper>
);

const ConnectedTracksRow = connect(({ events$ }) => {
  return events$.map(events => ({ events: [...events] }));
})(TracksRow);

TracksRow.Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  border: 2px solid transparent;
  border-top: 1px solid black;
  ${props =>props.isActive && `border-color: red`};
`;

const TracksColumn = ({ Beat, index, events }) => (
  <TracksColumn.Wrapper>
    {Array.from({ length: Timer.BEAT_STEP_COUNT }, (_, stepIndex) => (
      <Beat
        key={stepIndex}
        index={Timer.BEAT_STEP_COUNT * index + stepIndex}
        events={events}
      />
    ))}
  </TracksColumn.Wrapper>
);

TracksColumn.Wrapper = styled.div`
  border-left: 1px solid black;
  flex: 1;
  display: flex;
  flex-direction: row;
`;

const Ticker = styled.div.attrs({
  style: ({ count }) => ({
    transform: `translateX(${960 * (count / Timer.STEP_COUNT)}px)`
  })
})`
  width: 2px;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  position: absolute;
`;

const ConnectedTicker = connect(({ count$ }) => {
  return count$.map(count => ({ count }));
})(Ticker);

const Sound = styled.div`
  background-color: yellow;
  height: 8px;
  position: absolute;
  left: 0;
  top: ${({ top }) => `${top}px`}
  width: ${({ length }) => `${length * 14.94}px`}
`;

class Loop extends React.Component {
  state = {
    activeTrack: 0
  };

  static SetActiveTrack = styled.select`
    position: fixed;
    bottom: 20px;
    left: 100px;
  `;

  render() {
    return (
      <Tracks>
        <ConnectedTicker />
        <TracksRow Column={TracksColumn} Beat={HeaderBeat} />
        <TrackComponent
          onClick={() => this.setState({ activeTrack: 0 })}
          isActive={this.state.activeTrack === 0}
        />
        <TrackComponent
          onClick={() => this.setState({ activeTrack: 1 })}
          isActive={this.state.activeTrack === 1}
        />
        <TrackComponent
          onClick={() => this.setState({ activeTrack: 2 })}
          isActive={this.state.activeTrack === 2}
        />
        <TrackComponent
          onClick={() => this.setState({ activeTrack: 3 })}
          isActive={this.state.activeTrack === 3}
        />
      </Tracks>
    );
  }
}

export default class Looper extends React.Component {
  render() {
    return <Loop />;
  }
}
