import { decorate, observable, action } from 'mobx';
import SoundLoader from "./Sound/SoundLoader";
import {
  AudioContext,
  Oscillator,
  MidiInstrument
} from "./Sound/Sound";

const context = new AudioContext();
const soundLoader = new SoundLoader(context);

class AppState {
  pressedKeys = [];
  currentOctave = 4;
  selectedInstrument = 'oscillator';
  activeTrack = 0;
  currentlyPlayingNotes = {};

  onKeyDown = (midiCode) => {
    this.playNote(midiCode);

    this.pressedKeys = [...this.pressedKeys, midiCode];
  }

  instrument = () => {
    return this.selectedInstrument === "oscillator"
      ? new Oscillator(context)
      : new MidiInstrument(context, soundLoader.buffers[this.selectedInstrument]);
  }

  playNote = (code) => {
    if (this.currentlyPlayingNotes[code] && this.currentlyPlayingNotes[code].stop) {
      this.currentlyPlayingNotes[code].stop();
    }

    const instrument = this.instrument();
    this.currentlyPlayingNotes[code] = instrument;
    instrument.play(code);
  }

  stopNote = (code) => {
    if (this.currentlyPlayingNotes[code]) {
      this.currentlyPlayingNotes[code].stop();
      delete this.currentlyPlayingNotes[code];
    }
  }

  onKeyUp = (midiCode) => {
    this.stopNote(midiCode);

    this.pressedKeys = this.pressedKeys.filter((code) => code !== midiCode);
  }

  onSelectInstrument = (e) => {
    this.selectedInstrument = e.target.value;

    if (this.selectedInstrument === 'oscillator') return;

    soundLoader.loadInstrument(this.selectedInstrument)
      .then(() => console.log('Loaded:', this.selectedInstrument));
  }
}

decorate(AppState, {
  pressedKeys: observable,
  activeTrack: observable,
  selectedInstrument: observable,
  currentOctave: observable,
  currentlyPlayingNotes: observable,
  onKeyDown: action,
  onKeyUp: action,
  playNote: action,
  onSelectInstrument: action,
  stopNote: action
})

export default AppState;