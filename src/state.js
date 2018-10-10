import { decorate, observable, action } from 'mobx';
import {
  AudioContext,
  Oscillator
} from "./Sound/Sound";

const context = new AudioContext();

const OSCILLATOR_SIZE = 'sine';
const OSCILLATOR_SQUARE = 'square';
const OSCILLATOR_SAWTOOTH = 'sawtooth';
const OSCILLATOR_TRIANGLE = 'triangle';

class AppState {
  pressedKeys = [];
  currentOctave = 4;
  runningOscillators = [];

  oscillatorConfig = {
    type: 'sine',
    gain: 0.7,
  };

  onKeyDown = (midiCode) => {
    this.playNote(midiCode);

    this.pressedKeys = [...this.pressedKeys, midiCode];
  }

  playNote = (code) => {
    const oscillator = {
      node: new Oscillator(context, this.oscillatorConfig),
      code,
    }

    oscillator.node.play(code);
    this.runningOscillators = [...this.runningOscillators, oscillator];
  }

  stopNote = (code) => {
    const oscillator = this.runningOscillators.find(osc => osc.code === code)

    if (oscillator) {
      oscillator.node.stop();

      this.runningOscillators = this.runningOscillators
        .filter(osc => osc.code !== oscillator.code);
    }
  }

  onKeyUp = (midiCode) => {
    this.stopNote(midiCode);

    this.pressedKeys = this.pressedKeys.filter((code) => code !== midiCode);
  }

  updateRunningOscillators = () => {
    this.runningOscillators.forEach(osc => osc.node.update(this.oscillatorConfig));
  }

  onOscillatorChange = (type) => {
    this.oscillatorConfig.type = type;
    this.updateRunningOscillators();
  }

  onGainChange = (e) => {
    this.oscillatorConfig.gain = e.target.value;
    this.updateRunningOscillators();
  }

  onChangeOctave = (octave) => {
    this.runningOscillators.forEach(osc => osc.node.stop());
    this.pressedKeys = [];

    this.currentOctave = octave;
  }
}

decorate(AppState, {
  pressedKeys: observable,
  activeTrack: observable,
  currentOctave: observable,
  oscillatorConfig: observable,
  runningOscillators: observable,
  onOscillatorChange: action,
  onKeyDown: action,
  onKeyUp: action,
  playNote: action,
  stopNote: action
})

export default AppState;