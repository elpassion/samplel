import React, { Component } from 'react';
import Instrument from './Instrument/Instrument'
import styled, { createGlobalStyle } from 'styled-components';
import Piano from './components/Piano';
import ControlBar from './components/ControlBar';

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

const TopSection = styled.div`
  flex: 1;
`;

class App extends Component {
  render() {
    return (
      <AppContainer>
        <GlobalStyles />
        <Flex>
          <TopSection>
            <Instrument />
          </TopSection>
          <Piano />
          <ControlBar />
        </Flex>
      </AppContainer>
    );
  }
}

export default App;
