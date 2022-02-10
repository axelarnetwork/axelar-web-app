import { useRecoilState } from "recoil"
import styled from "styled-components"
import {
  ShowFAQ,
  ShowGettingStartedWidget,
  ShowSupportWidget,
} from "state/FAQWidget"
import Container from "../StyleComponents/Container"
import { FlexRow } from "../StyleComponents/FlexRow"

const StyledPageFooter = styled(Container)`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 55px;
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.21);
  display: flex;
  justify-content: space-between !important;
  align-items: center !important;
  z-index: 10000;
  color: black;
  font-size: 1em;
  transition: background-color 0.3s ease-in-out;
  background-color: rgba(0, 0, 0, 0.21);
  &:hover {
    color: white;
    background-color: ${(props) => props.theme.headerBackgroundColor};
  }
`
const HelperWidget = styled.div`
  box-sizing: border-box;
  padding: 0.5em 0.75em 0.5em 0.75em;
  margin: 0.5em;
  border-radius: 50px;
  cursor: pointer;
  border: 1px solid darkgrey;
  transition: background-color color 0.5s ease-in-out;
  ${StyledPageFooter}:hover & {
    background: none;
    border: 0.5px solid grey;
  }
  &:hover {
    background-color: ${(props) =>
      props.theme.headerBackgroundColor} !important;
  }
`

const PageFooter = () => {
  const [showGettingStarted, setShowGettingStarted] = useRecoilState(
    ShowGettingStartedWidget
  )
  const [showFAQ, setShowFAQ] = useRecoilState(ShowFAQ)
  const [showSupport, setShowSupport] = useRecoilState(ShowSupportWidget)

  return (
    <StyledPageFooter>
      <div
        style={{ marginLeft: `1em`, cursor: `pointer`, width: `25%` }}
        onClick={() => window.open("https://axelar.network", "_blank")}
      >
        <img
          src={require(`assets/svg/axelar-logo-horizontal-white.svg`)?.default}
          alt=""
        />
      </div>
      <FlexRow
        style={{
          width: `30%`,
          fontSize: `0.9em`,
          minWidth: `425px`,
          justifyContent: `flex-end`,
        }}
      >
        <HelperWidget
          onClick={() => {
            setShowFAQ(false)
            setShowSupport(false)
            setShowGettingStarted(!showGettingStarted)
          }}
        >
          <FlexRow>
            <img
              src={require(`assets/svg/active-eye-orange.svg`).default}
              alt={""}
            />
            <div style={{ marginLeft: `0.5em` }}>Getting Started</div>
          </FlexRow>
        </HelperWidget>
        <HelperWidget
          onClick={() => {
            setShowSupport(false)
            setShowGettingStarted(false)
            setShowFAQ(!showFAQ)
          }}
        >
          <FlexRow>
            <img
              src={require(`assets/svg/active-eye-orange.svg`).default}
              alt={""}
            />
            <div style={{ marginLeft: `0.5em` }}>FAQ</div>
          </FlexRow>
        </HelperWidget>
        <HelperWidget
          onClick={() => {
            setShowFAQ(false)
            setShowGettingStarted(false)
            setShowSupport(!showSupport)
          }}
        >
          <FlexRow>
            <img
              src={require(`assets/svg/active-eye-orange.svg`).default}
              alt={""}
            />
            <div style={{ marginLeft: `0.5em` }}>Support</div>
          </FlexRow>
        </HelperWidget>
      </FlexRow>
    </StyledPageFooter>
  )
}

export default PageFooter
