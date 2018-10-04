import styled from 'styled-components';
import React from 'react';

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
  transition: all .1s ease;
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
  transition: all .1s ease;
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
    transition: all .1s ease;
  }

  ${KeyLabel} {
    bottom: 12px;
    color: white;
  }
`;

class Key extends React.Component {
  state = {
    isActive: false,
  }

  setActive = () => {
    this.setState({ isActive: true });
  }

  setInactive = () => {
    this.setState({ isActive: false });
  }

  render() {
    const { as: Component = WhiteKey, label, ...props } = this.props;

    const isKeyActive = this.props.pressedKeys.find(key => key === `Key${label}`);

    return (
      <Component
        onMouseDown={this.setActive}
        onMouseUp={this.setInactive}
        isActive={isKeyActive || this.state.isActive}
        {...props}
      >
        {label && <KeyLabel>{label}</KeyLabel>}
      </Component>
    )
  }
}

const KeyPair = styled(Flex)``;

class Piano extends React.Component {
  state = {
    pressedKeys: []
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  componentWillMount() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
  }

  onKeyDown = (e) => {
    this.setState(prevState => ({
      pressedKeys: [...prevState.pressedKeys, e.code ]
    }));
  }

  onKeyUp = (e) => {
    this.setState(prevState => ({
      pressedKeys: prevState.pressedKeys.filter((keyCode) => keyCode !== e.code),
    }));
  }

  render() {
    return (
      <KeyboardContainer>
        <KeyPair>
          <Key label="A" pressedKeys={this.state.pressedKeys} />
          <Key label="W" as={BlackKey} pressedKeys={this.state.pressedKeys} />
        </KeyPair>
        <KeyPair>
          <Key label="S" pressedKeys={this.state.pressedKeys} />
          <Key label="E" as={BlackKey} pressedKeys={this.state.pressedKeys}/>
        </KeyPair>
        <Key label="D" pressedKeys={this.state.pressedKeys} />
        <KeyPair>
          <Key label="F" pressedKeys={this.state.pressedKeys} />
          <Key label="T" as={BlackKey} pressedKeys={this.state.pressedKeys} />
        </KeyPair>
        <KeyPair>
          <Key label="G" pressedKeys={this.state.pressedKeys} />
          <Key label="Y" as={BlackKey} pressedKeys={this.state.pressedKeys} />
        </KeyPair>
        <KeyPair>
          <Key label="H" pressedKeys={this.state.pressedKeys} />
          <Key label="U" as={BlackKey} pressedKeys={this.state.pressedKeys} />
        </KeyPair>
        <Key label="J" pressedKeys={this.state.pressedKeys} />
        <KeyPair>
          <Key label="K" pressedKeys={this.state.pressedKeys} />
          <Key label="O" as={BlackKey} pressedKeys={this.state.pressedKeys} />
        </KeyPair>
        <KeyPair>
          <Key label="L" pressedKeys={this.state.pressedKeys} />
          <Key label="P" as={BlackKey} pressedKeys={this.state.pressedKeys} />
        </KeyPair>
        <Key label=";" pressedKeys={this.state.pressedKeys} />
      </KeyboardContainer>
    )
  }
}

export default Piano;