import { Note } from 'tonal';

export const AudioContext = window.AudioContext || window.webkitAudioContext;

export class Oscillator {
  config = {
    type: 'sine',
    gain: 0.5,
    frequencyValue: 440,
    fadeOut: 0.6, // fadeOut time after calling stop
  }

  constructor(context, config = {}) {
    this.context = context;
    this.config = Object.assign({}, this.config, config);

    return this;
  }

  init = () => {
    this.gainNode = this.context.createGain();
    this.gainNode.connect(this.context.destination);

    this.oscillator = this.context.createOscillator();
    this.oscillator.connect(this.gainNode);
  }

  play(note, config = {}) {
    this.init();

    this.update({
      ...config,
      frequencyValue: Note.freq(note)
    });

    this.oscillator.start();
    this.stop(this.context.currentTime + 1);

    return this;
  }

  stop(time = this.context.currentTime) {
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, time + this.config.fadeOut);
    this.oscillator.stop(time + this.config.fadeOut);
  }

  update(config) {
    this.config = Object.assign({}, this.config, config);

    if (this.gainNode) {
      this.gainNode.gain.value = this.config.gain;
    }

    if (this.oscillator) {
      this.oscillator.type = this.config.type;
      this.oscillator.frequency.value = this.config.frequencyValue;
    }

    return this;
  }
}

export class MidiInstrument {
  constructor(context, buffers) {
    this.context = context;
    this.buffers = buffers;
  }

  init = (note) => {
    this.gainNode = this.context.createGain();
    this.gainNode.connect(this.context.destination);
    this.gainNode.gain.value = 1;

    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffers[note];
    this.source.connect(this.gainNode);
  }

  play = (note) => {
    this.init(note);
    this.source.start(this.context.currentTime);

    return this;
  }

  stop(time = this.context.currentTime) {
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
    this.source.stop(time + 0.5);
  }
}

// export class SoundsBuffer {
//   buffers = {};

//   constructor(context, { file, name }) {
//     this.context = context;
//     this.name = name;

//     return this.loadSounds(file)
//       .then(this.onSoundsLoaded);
//   }

//   loadSounds = (file) => {
//     return new Promise((resolve, reject) => {
//       const script = document.createElement('script');
//       document.body.appendChild(script);
//       script.onload = resolve;
//       script.onerror = reject;
//       script.async = true;
//       script.src = file;
//     });
//   }

//   onSoundsLoaded = () => {
//     const promises = Object.entries(window.MIDI.Soundfont[this.name]).map(([ note, base64string ]) => {
//       return new Promise((resolve) => {
//         const data = base64ToArrayBuffer(base64string.split(',')[1]);
//         return this.context.decodeAudioData(data, (audioBuffer) => {
//           this.buffers[Note.midi(note)] = audioBuffer;
//           resolve();
//         });
//       })
//     });

//     return Promise.all(promises).then(() => {
//       return this.buffers;
//     })
//   }
// }
