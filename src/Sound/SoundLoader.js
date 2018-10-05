import { Note } from 'tonal';
import data from '../data';
import base64ToArrayBuffer from '../helpers/base64ToArrayBuffer';
import loadScript from '../helpers/loadScript';

export default class SoundLoader {
  constructor(context) {
    this.instruments = data.instruments;
    this.context = context;

    this.buffers = {};
    this.loadedInstruments = {};

    this.instruments.forEach((name) => this.buffers[name] = {})
  }

  loadInstrument = (instrumentName) => {
    const instrument = this.buffers[instrumentName];

    if (instrument.loaded) return Promise.resolve(instrument);

    return loadScript(`/assets/sounds/${instrumentName}-mp3.js`)
      .then(() => this.onScriptLoaded(instrumentName));
  }

  onScriptLoaded = (instrumentName) => {
    const promises = Object.entries(window.MIDI.Soundfont[instrumentName]).map(([ note, base64string ]) => {
      return new Promise((resolve) => {
        const data = base64ToArrayBuffer(base64string.split(',')[1]);
        return this.context.decodeAudioData(data, (audioBuffer) => {
          this.buffers[instrumentName][Note.midi(note)] = audioBuffer;
          resolve();
        });
      })
    });

    return Promise.all(promises).then(() => {
      this.buffers[instrumentName].loaded = true;

      return this.buffers[instrumentName];
    })
  }
}