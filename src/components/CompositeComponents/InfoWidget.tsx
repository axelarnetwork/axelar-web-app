import { useRecoilValue } from "recoil"
import styled, { ThemedStyledProps } from "styled-components"
import screenConfigs from "config/screenConfigs"
import { MessageShownInCartoon } from "state/ApplicationStatus"
import { fadeIn } from "../StyleComponents/animations/fadeInKeyframe"

interface IStyledDivProps extends ThemedStyledProps<any, any> {
  animation?: any
  animationDuration?: number
  width: string
}

const StyledDiv = styled.div<IStyledDivProps>`
  position: absolute;
  z-index: 1000;
  width: 20%;
  min-width: 250px;
  box-sizing: border-box;
  display: inline-block;
  left: 1%;
  color: black;
  border-radius: 9px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.22), inset 0 0 3px 0 #262426;
  border: solid 1px #b9bac8;
  background-color: white;
  animation: ${(props) => props?.animation}
    ${(props) => props?.animationDuration}s ease-in ease-out;
  @media ${screenConfigs.media.mobile} {
    display: none;
  }
`

const InfoWidget = () => {
  const messageInCartoon = useRecoilValue(MessageShownInCartoon)

  if (!messageInCartoon) return null

  return (
    <StyledDiv animation={fadeIn} animationDuration={120}>
      {messageInCartoon}
    </StyledDiv>
  )
}

export default InfoWidget
