import React from 'react';
import styled from 'styled-components';
import { connect } from "@seracio/xstream-connect";
import { ReactComponent as SvgPlay } from '../assets/icons/play.svg';
import { ReactComponent as SvgStop } from '../assets/icons/stop.svg';
import { ReactComponent as SvgRecord } from '../assets/icons/record.svg';
import { ReactComponent as SvgMinus } from '../assets/icons/minus.svg';
import { ReactComponent as SvgPlus } from '../assets/icons/plus.svg';
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

const ContainerFluid = styled(Flex)`
  width: 100%;
`;

const ButtonContainer = styled(Flex)`
  flex-direction: column;
  margin-left: auto;
`;

const VolumeContainer = styled(ButtonContainer)`
  margin-left: 30px
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
  color: #303030;
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
              <GrayButton onClick={() => timer.setBpm(this.props.bpm - 5)}>
                <SvgMinus />
              </GrayButton>

              <GrayButton onClick={() => timer.setBpm(this.props.bpm + 5)}>
                <SvgPlus />
              </GrayButton>
            </Flex>

            <Flex>
              <Label>BPM:</Label>
              <Bpm>{this.props.bpm}</Bpm>
            </Flex>
          </ButtonContainer>

          <VolumeContainer>
            <GrayButton>
              <svg version="1.2" baseProfile="tiny" width="18" height="18" className="p2" fill="#303030">
                <path
                  d="M3.2149115128211534,15.89439998807081 A9,9 0 1 0 3.2149115128211454,15.894399988070802L4.3719292102569165,14.515519990456642 A7.2,7.2 0 1 1 4.371929210256923,14.515519990456648L3.2149115128211534,15.89439998807081"></path>
                <path
                  d="M13.266898407315153,16.92423989929958 A9,9 0 1 0 3.2149115128211454,15.894399988070802L4.3719292102569165,14.515519990456642 A7.2,7.2 0 1 1 12.413518725852125,15.339391919439663L13.266898407315153,16.92423989929958"></path>
                <rect x="8.1" y="0" width="1.8" height="9" className=" pointer"
                      transform="rotate(511.6992442339936 9 9)"></rect>
              </svg>
            </GrayButton>
            <Label>Volume</Label>
          </VolumeContainer>
        </ContainerFluid>
      </Container>
    );
  }
}

const ConnectedControlBar = connect(({ bpm$ }) => {
  return bpm$.map((bpm) => ({ bpm }));
})(ControlBar);

export default ConnectedControlBar;