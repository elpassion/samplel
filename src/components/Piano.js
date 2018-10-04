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
  height: 260px;
  flex-shrink: 0;
  border-radius: 0 0 4px 4px;
  background: white;
  margin-right: 4px;
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
  transform: translate(50%, 0);

  &::before {
    content: '';
    background: #4A4A4A;
    display: block;
    margin: 0 auto;
    width: calc(100% - 12px);
    height: calc(100% - 34px);
    border-radius: 0 0 4px 4px;
  }
`;

const KeyPair = styled(Flex)``;

class Piano extends React.Component {
  render() {
    return (
      <KeyboardContainer>
        <KeyPair>
          <WhiteKey />
          <BlackKey />
        </KeyPair>
        <KeyPair>
          <WhiteKey />
          <BlackKey />
        </KeyPair>
        <WhiteKey />
        <KeyPair>
          <WhiteKey />
          <BlackKey />
        </KeyPair>
        <KeyPair>
          <WhiteKey />
          <BlackKey />
        </KeyPair>
        <KeyPair>
          <WhiteKey />
          <BlackKey />
        </KeyPair>
        <WhiteKey />
        <KeyPair>
          <WhiteKey />
          <BlackKey />
        </KeyPair>
        <KeyPair>
          <WhiteKey />
          <BlackKey />
        </KeyPair>
        <WhiteKey />
      </KeyboardContainer>
    )
  }
}

export default Piano;