import React from 'react';
import styled from 'styled-components';
import { Provider, connect } from "@seracio/xstream-connect";
import xs from "xstream";
import { ReactComponent as SvgPlay } from '../assets/icons/play.svg';
import { ReactComponent as SvgStop } from '../assets/icons/stop.svg';
import { ReactComponent as SvgRecord } from '../assets/icons/record.svg';
import { ReactComponent as SvgMinus } from '../assets/icons/minus.svg';
import { ReactComponent as SvgPlus } from '../assets/icons/plus.svg';
import Timer from "../looper/Timer";

const timer = new Timer(60);

const store = {
  count$: timer.stream$,
  player$: timer.stateStream$,
  bpm$: timer.bpmStream$
};

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Container = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px;
`;

const ContainerFluid = styled(Flex)`
  width: 100%;
`;

const ButtonContainer = styled(Flex)`
  flex-direction: column;
  margin-left: auto;
`;

const Counter = styled.div`
  font-size: 24px;
`;

const Button = styled.div`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SmallButton = styled(Button)`
  width: 24px;
  height: 24px;
`;

const GrayButton = styled(SmallButton)`
  background: #5C5C5C;
  color: #fff;
  margin: 0 4px 10px;
`;

const DarkButton = styled(Button)`
  margin-left: 26px;
  background: #222222;
`;

const StyledSvgPlay = styled(SvgPlay)`
  margin-left: 4px;
`;

const PauseButton = styled(DarkButton)`
  color: #EE4444;
`;

const Bpm = styled.span` 
  font-size: 12px;
  line-height: 1.2;
  color: #fff;
`;

const Label = styled.span`
  font-size: 12px;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.4);
  padding-right: 5px;
`;

class ControlBar extends React.Component {

  state = {
    bpm: this.props.bpm
  }

  incrementBPM = () => {

    this.setState(prevState => ({
      bpm: prevState.bpm + 1
    }));

    timer.setBpm(this.state.bpm)
  }

  decreaseBPM = () => {

    this.setState(prevState => ({
      bpm: prevState.bpm - 1
    }));

    timer.setBpm(this.state.bpm)
  }

  render() {

    return (
      <Container>
        <ContainerFluid>
          <Counter>00:10.0</Counter>
          <DarkButton onClick={() => timer.start()} >
            <StyledSvgPlay />
          </DarkButton>
          <DarkButton onClick={() => timer.stop()} >
            <SvgStop />
          </DarkButton>
          <PauseButton>
            <SvgRecord />
          </PauseButton>
          <ButtonContainer>
            <Flex>
              <GrayButton onClick={this.decreaseBPM}>
                <SvgMinus />
              </GrayButton>

              <GrayButton onClick={this.incrementBPM}>
                <SvgPlus />
              </GrayButton>
            </Flex>

            <Flex>
              <Label>BPM:</Label>
              <Bpm>{this.state.bpm}</Bpm>
            </Flex>
          </ButtonContainer>
        </ContainerFluid>
      </Container>
    );
  }
}


const combinator = ({ count$, player$, bpm$ }) => {
  return xs
    .combine(count$, player$, bpm$)
    .map(([count, isPlaying, bpm]) => ({ count, isPlaying, bpm }));
};

const ConnectedApp = connect(combinator)(ControlBar);

export default class Looper extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedApp />
      </Provider>
    );
  }
}
