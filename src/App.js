import React, { Component } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Piano from './components/Piano';
import ControlBar from './components/ControlBar';
import MidiController from "./components/MidiController";
import { observer, inject } from 'mobx-react';

const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    color: white;
  }

  html,
  body,
  #root {
    height: 100%;
    overflow: hidden;
  }
`;

const AppContainer = styled.div`
  background: #222222;
  height: 100%;
`;

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #303030;
`;

const Panel = styled.div`
  flex-grow: 1;
  width: 790px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const OctaveConfig = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px 0;
`;

const CurrentOctave = styled.div`
  border-radius: 8px;
  padding: 16px 30px;
  font-size: 26px;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.2);
  margin: 0 20px;
  width: calc(50% - 40px);
  text-align: center;
`;

const OctaveText = styled.div`
  letter-spacing: 2px;
  font-size: 12px;
  text-transform: uppercase;
  opacity: 0.5;
  margin-bottom: 4px;
`;

const OctaveButton = styled.div`
  width: 25%;
  user-select: none;
  border-radius: 8px;
  padding: 20px 40px;
  font-size: 20px;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0.9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

const WaveConfig = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;

const WaveOption = styled.div`
  letter-spacing: 2px;
  font-size: 12px;
  text-transform: uppercase;
  opacity: 0.5;
  width: calc(25% - 20px);
  border-radius: 8px;
  text-align: center;
  color: black;
  margin: 0 10px;
  padding: 15px 20px;
  font-weight: 600;
  background: rgba(255,255,255, 0.4);
  cursor: pointer;
  user-select: none;

  &:hover {
    opacity: 0.8;
  }

  ${props => props.isActive && `
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.5);
    opacity: 1;
    color: white;
  `}
`;

class App extends Component {
  render() {
    const { appState } = this.props;

    return (
      <AppContainer>
        <GlobalStyles />
        <MidiController />
        <Flex>
          <Panel>
            {/* <div>
              <input onChange={appState.onGainChange} type="range" min="0" max="1" step="0.01" />
            </div> */}

            <WaveConfig>
              {['sine', 'square', 'sawtooth', 'triangle'].map(osc => (
                <WaveOption
                  key={osc}
                  onClick={() => appState.onOscillatorChange(osc)}
                  isActive={appState.oscillatorConfig.type === osc}
                >
                  {osc}
                </WaveOption>
              ))}
            </WaveConfig>

            <OctaveConfig>
              <OctaveButton onClick={() => appState.onChangeOctave(appState.currentOctave - 1)}>-1</OctaveButton>
              <CurrentOctave>
                <OctaveText>Current Octave</OctaveText>
                {appState.currentOctave}
              </CurrentOctave>
              <OctaveButton onClick={() => appState.onChangeOctave(appState.currentOctave + 1)}>+1</OctaveButton>
            </OctaveConfig>
          </Panel>
          <Piano />
          <ControlBar />
        </Flex>
      </AppContainer>
    );
  }
}

export default inject('appState')(observer(App));
