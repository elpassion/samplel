import React from 'react';
import styled from 'styled-components';
import { ReactComponent as SvgPlay } from '../assets/icons/play.svg';
import { ReactComponent as SvgStop } from '../assets/icons/stop.svg';
import { ReactComponent as SvgRecord } from '../assets/icons/record.svg';
import timer from "../timer";

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Container = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px;
`;

const Timer = styled.div`
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

class ControlBar extends React.Component {
  render() {
    return (
      <Container>
        <Flex>
          <Timer>00:10.0</Timer>
          <DarkButton onClick={() => timer.start()} >
            <StyledSvgPlay />
          </DarkButton>
          <DarkButton onClick={() => timer.stop()} >
            <SvgStop />
          </DarkButton>
          <PauseButton>
            <SvgRecord />
          </PauseButton>
        </Flex>
      </Container>
    );
  }
}

export default ControlBar;
