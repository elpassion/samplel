import { Component } from "react";
import { inject, observer } from 'mobx-react';

// const keys = {
//   65: 69,
//   83: 71,
//   68: 72,
//   70: 74,
//   71: 76,
//   72: 77,
//   74: 79,
//   75: 81,
// }

class Instrument extends Component {
  // instruments = {};

  componentDidMount() {
    navigator.requestMIDIAccess().then(this.onMIDISuccess, this.onMIDIFailure);

    // document.addEventListener("keydown", ev => {
    //   const note = keys[ev.keyCode];
    //   if (note) this.onKeyDown({ note });
    // });

    // document.addEventListener("keyup", ev => {
    //   const note = keys[ev.keyCode];
    //   this.onKeyUp({ note });
    // });
  }

  onMIDISuccess = midiAccess => {
    this.connectInputs(midiAccess);

    midiAccess.onstatechange = e => {
      if (e.port.state === "connected") {
        this.connectInputs(midiAccess);
      }
    };
  };

  connectInputs = midiAccess => {
    const inputs = midiAccess.inputs.values();

    for (
      let input = inputs.next();
      input && !input.done;
      input = inputs.next()
    ) {
      input.value.onmidimessage = this.onMIDIMessage;
    }
  };

  onMIDIFailure() {
    console.error("Could not access your MIDI devices.");
  }

  onMIDIMessage = message => {
    const srcElement = message.srcElement;
    const data = message.data;
    const channel = data[0] & 0xf;
    const event = data[0] & 0xf0;
    const note = data[1];
    const velocity = data[2];

    if ([144, 128].includes(event)) {
      // only listen to noteOn and noteOff events
      const result = {
        name: srcElement.name,
        manufacturer: srcElement.manufacturer,
        state: srcElement.state,
        channel: channel,
        type: srcElement.type,
        event,
        note,
        velocity
      };

      if (velocity > 0) {
        this.onKeyDown(result);
      } else {
        this.onKeyUp(result);
      }
    }
  };

  onKeyDown = key => {
    // if (this.props.isActive && !this.instruments[key.note]) {
    //   this.instruments[key.note] = this.props.instrument().play(key.note);
    //   this.props.onKeyDown(key.note);
    // }
    this.props.appState.onKeyDown(key.note);
  };

  onKeyUp = key => {
    // if (this.props.isActive && this.instruments[key.note]) {
    //   this.instruments[key.note].stop();
    //   delete this.instruments[key.note];
    //   this.props.onKeyUp(key.note);
    // }
    this.props.appState.onKeyUp(key.note);
  };

  render() {
    return null;
  }
}

export default inject('appState')(observer(Instrument));
