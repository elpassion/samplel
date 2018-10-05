import React, { Component } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Piano from "./components/Piano";
import ControlBar from "./components/ControlBar";
import Looper from "./looper/Looper";
import { Provider as XstreamProvider } from "@seracio/xstream-connect";
import timer from "./timer";

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

const xstreamStore = {
  count$: timer.stream$,
  player$: timer.stateStream$,
  bpm$: timer.bpmStream$
};

class App extends Component {
  render() {
    return (
      <XstreamProvider store={xstreamStore}>
        <AppContainer>
          <GlobalStyles />
          <Flex>
            <Looper />
            <Piano />
            <ControlBar />
          </Flex>
        </AppContainer>
      </XstreamProvider>
    );
  }
}

export default App;
