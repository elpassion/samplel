export const AudioContext = window.AudioContext || window.webkitAudioContext;

export class Audio {
  constructor(context, instrument) {
    this.context = context;
    this.instrument = instrument;
  }
}

export class Oscillator {
  config = {
    type: 'sine',
    frequencyValue: 440,
    fadeOut: 0.1, // fadeOut time after calling stop
  }

  constructor(context, config = {}) {
    this.context = context;

    this.config = {
      ...this.config,
      ...config
    }
  }

  init() {
    this.oscillator = this.context.createOscillator();
    this.gainNode = this.context.createGain();

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
  }

  play(config = {}) {
    this.init();

    this.update(config);
    this.oscillator.start();

    return this;
  }

  stop(time = this.context.currentTime) {
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, time + this.config.fadeOut);
    this.oscillator.stop(time + this.config.fadeOut);
  }

  update(config) {
    this.config = Object.assign({}, this.config, config);

    if (this.oscillator) {
      this.oscillator.type = this.config.type;
      this.oscillator.frequency.value = this.config.frequencyValue;
    }
  }
}

class BufferInput {

}