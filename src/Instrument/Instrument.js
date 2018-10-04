import React, { Component}  from 'react';
import { MidiInstrument, Oscillator, AudioContext, SoundsBuffer } from '../Sound/Sound';

class Instrument extends Component {
  oscillators = {};
  state = {
    activeNotes: [],
    selectedInstrument: 'oscillator'
  }

  componentDidMount() {
    this.context = new AudioContext();

    const file = 'http://cdn.rawgit.com/gleitz/midi-js-soundfonts/gh-pages/MusyngKite/banjo-mp3.js'

    this.marimbaBuffers = {};
    new SoundsBuffer(this.context, { file: file, name: 'banjo' }).then(buffers => {
      this.marimbaBuffers = buffers;
    });

    navigator.requestMIDIAccess()
      .then(this.onMIDISuccess, this.onMIDIFailure);
  }

  onMIDISuccess = (midiAccess) => {
    this.connectInputs(midiAccess);

    midiAccess.onstatechange = (e) =>  {

      if(e.port.state == 'connected'){
        this.connectInputs(midiAccess);
      }
    };
  }

  connectInputs = (midiAccess) => {
    const inputs = midiAccess.inputs.values();

    for (let input = inputs.next();
         input && !input.done;
         input = inputs.next()) {
      input.value.onmidimessage = this.onMIDIMessage;
    }
  }

  onMIDIFailure() {
    console.log('Could not access your MIDI devices.');
  }

  onMIDIMessage = (message) => {
    const srcElement = message.srcElement;
    const data = message.data;
    const channel =  data[0] & 0xf;
    const event = data[0] & 0xf0;
    const note = data[1];
    const velocity = data[2];

    if ( [144, 128].includes(event) ) { // only listen to noteOn and noteOff events
      const result = {
        name: srcElement.name,
        manufacturer: srcElement.manufacturer,
        state: srcElement.state,
        channel: channel,
        type: srcElement.type,
        event,
        note,
        velocity,
      };

      if(velocity > 0) {
        this.onKeyDown(result);
      }else{
        this.onKeyUp(result);
      }
    }
  }

  onKeyDown = (key) => {
    this.oscillators[key.note] = new Oscillator(this.context).play(key.note);
    // this.oscillators[key.note] = new MidiInstrument(this.context, this.marimbaBuffers).play(key.note);
  }

  onKeyUp = (key) => {
    if (this.oscillators[key.note]) {
      this.oscillators[key.note].stop();
      delete this.oscillators[key.note];
    }
  }

  render() {
    return (
      <div>
        <h1>Instrument</h1>
        <select onChange={e => this.setState({ selectedInstrument: e.target.value })}>
          <option value="oscillator">Oscillator</option>
          <option value="banjo">Banjo</option>
        </select>
      </div>
    );
  }
}


export default Instrument;
