import styled from 'styled-components';
import React from 'react';
import { observer, inject } from 'mobx-react';
import { Note } from 'tonal';
import data from '../data';

const Flex = styled.div`
  display: flex;
  position: relative;
`;

const KeyboardContainer = styled(Flex)`
  justify-content: center;
  background: #222222;
  padding-bottom: 24px;
  border-top: 2px solid black;
  overflow: hidden;
  user-select: none;

  &::before {
    content: close-quote;
    position: absolute;
    display: block;
    height: 80px;
    width: 100%;
    bottom: 0;
    opacity: 0.3;
    background: linear-gradient(0deg, #121212 0%, rgba(0, 0, 0, 0));
  }
`;

const WhiteKey = styled.div`
  position: relative;
  width: 75px;
  height: 264px;
  flex-shrink: 0;
  border-radius: 0 0 4px 4px;
  background: white;
  top: 0;
  margin-right: 4px;
  cursor: pointer;
  transition: all .05s ease;
  opacity: ${props => props.isActive ? 0.7 : 1};
  transform: translate(0, ${props => props.isActive ? 0 : '-3px'});
  user-select: none;
`;

const KeyLabel = styled.span`
  position: absolute;
  font-weight: 600;
  font-size: 12px;
  color: #555555;
  text-transform: uppercase;
  bottom: 30px;
  left: 50%;
  transform: translate(-50%, 0);
  user-select: none;
`;

const BlackKey = styled.div`
  border-radius: 0 0 8px 8px;
  position: absolute;
  z-index: 1;
  right: 2px;
  flex-shrink: 0;
  top: 0;
  height: 156px;
  width: 38px;
  background: #303030;
  transform: translate(50%, ${props => props.isActive ? 0 : '-3px'});
  transition: all .05s ease;
  cursor: pointer;

  &::before {
    content: '';
    background: #4A4A4A;
    display: block;
    margin: 0 auto;
    width: calc(100% - 12px);
    height: calc(100% - 34px);
    border-radius: 0 0 4px 4px;
    opacity: ${props => props.isActive ? 0 : 1};
    transform: translateY(${props => props.isActive ? 0 : '-3px' });
    transition: all .05s ease;
  }

  ${KeyLabel} {
    bottom: 12px;
    color: white;
  }
`;

class BaseKey extends React.Component {
  state = {
    isActive: false,
  }

  onMouseDown = () => {
    this.props.appState.onKeyDown(Note.midi(this.props.name));
  }

  onMouseUp = () => {
    this.props.appState.onKeyUp(Note.midi(this.props.name));
  }

  render() {
    const { as: Component = WhiteKey, name, label, ...props } = this.props;

    const isKeyActive = this.props.appState.pressedKeys.find(midiKey => midiKey === Note.midi(name));

    return (
      <Component
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseLeave={this.onMouseUp}
        isActive={isKeyActive}
        {...props}
      >
        {label && <KeyLabel>{label}</KeyLabel>}
      </Component>
    )
  }
}

const Key = inject('appState')(observer(BaseKey));

const KeyPair = styled(Flex)``;

class Piano extends React.Component {
  activeKeys = {};

  onKeyboardKeyUp = (e) => {
    const key = data.keymapper[e.keyCode];

    if (key) {
      this.activeKeys[key] = false;
      const actualKey = `${key[0]}${(this.props.appState.currentOctave + key[1])}`;
      this.props.appState.onKeyUp(Note.midi(actualKey));
    }
  }

  onKeyboardKeyDown = (e) => {
    const key = data.keymapper[e.keyCode];

    if (key && !this.activeKeys[key]) {
      this.activeKeys[key] = true;
      const actualKey = `${key[0]}${(this.props.appState.currentOctave + key[1])}`;
      this.props.appState.onKeyDown(Note.midi(actualKey));
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyboardKeyDown);
    document.addEventListener('keyup', this.onKeyboardKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyboardKeyDown);
    document.removeEventListener('keyup', this.onKeyboardKeyUp);
  }

  render() {
    const getKeyName = (name, offset = 0) => name + (this.props.appState.currentOctave + offset);

    return (
      <KeyboardContainer onFocus={() => console.log('focus piano')}>
        <KeyPair>
          <Key name={getKeyName('C')} label="A" />
          <Key name={getKeyName('C#')} label="W" as={BlackKey} />
        </KeyPair>
        <KeyPair>
          <Key name={getKeyName('D')} label="S" />
          <Key name={getKeyName('D#')} label="E" as={BlackKey}/>
        </KeyPair>
        <Key name={getKeyName('E')} label="D" />
        <KeyPair>
          <Key name={getKeyName('F')} label="F" />
          <Key name={getKeyName('F#')} label="T" as={BlackKey} />
        </KeyPair>
        <KeyPair>
          <Key name={getKeyName('G')} label="G" />
          <Key name={getKeyName('G#')} label="Y" as={BlackKey} />
        </KeyPair>
        <KeyPair>
          <Key name={getKeyName('A')} label="H" />
          <Key name={getKeyName('A#')} label="U" as={BlackKey} />
        </KeyPair>
        <Key name={getKeyName('B')} label="J" />

        <KeyPair>
          <Key name={getKeyName('C', 1)} label="K" />
          <Key name={getKeyName('C#', 1)} label="O" as={BlackKey} />
        </KeyPair>
        <KeyPair>
          <Key name={getKeyName('D', 1)} label="L" />
          <Key name={getKeyName('D#', 1)} label="P" as={BlackKey}/>
        </KeyPair>
        <Key name={getKeyName('E', 1)} label=";" />
      </KeyboardContainer>
    )
  }
}

export default inject('appState')(observer(Piano));