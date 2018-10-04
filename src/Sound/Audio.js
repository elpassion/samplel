import React from 'react';
import { Oscillator, AudioContext } from './Sound';

export default class extends React.Component {
  componentDidMount() {
    this.context = new AudioContext();
    this.oscillator = new Oscillator(this.context);
  }

  play = () => {
    this.setState({ isPlaying: true });
    this.oscillator.play({ frequencyValue: 220 });
  }

  stop = () => {
    this.setState({ isPlaying: false });
    this.oscillator.stop();
  }

  onSelectChange = (e) => {
    this.oscillator.update({ type: e.target.value });
  }

  onSliderChange = (e) => {
    this.setState({ frequencyValue: e.target.value });
    this.oscillator.update({ frequencyValue: e.target.value });
  }

  render() {
    return (
      <div>
        <button onClick={this.play} disabled={this.state.isPlaying}>Play Sound</button>
        <button onClick={this.stop} disabled={!this.state.isPlaying}>Pause Sound</button>
        <select onChange={this.onSelectChange}>
          <option value="sine">sine</option>
          <option value="square">square</option>
          <option value="sawtooth">sawtooth</option>
          <option value="triangle">triangle</option>
        </select>
        <input type="range" min="20" max="2000" onChange={this.onSliderChange} value={this.state.frequencyValue} />
      </div>
    )
  }
}