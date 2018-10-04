import React, { Component}  from 'react';
import { Oscillator, AudioContext, BufferInstrument } from '../Sound/Sound';
import { Note } from 'tonal';

class Instrument extends Component {
  oscillators = {};
  state = {
    activeNotes: []
  }

  componentDidMount() {
    this.context = new AudioContext();
    const bufferInstrument = new BufferInstrument(this.context, {
      file: 'http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/marimba-mp3.js'
    })

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
    const sound = Note.freq(key.note);


    this.oscillators[key.note] = new Oscillator(this.context).play({ frequencyValue: sound });
  }

  onKeyUp = (key) => {
    if (this.oscillators[key.note]) {
      this.oscillators[key.note].stop();
      delete this.oscillators[key.note];
    }
  }

  render() {
    return (
      <h1>Instrument</h1>
    );
  }
}


export default Instrument;
