import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import styled from "styled-components"
import { ShowDisclaimer, ShowLargeDisclaimer } from "state/ApplicationStatus"
import textLines from "./disclaimerText"
import { StyledButton } from "components/StyleComponents/StyledButton"
import { StyledLargePopupPage } from "components/StyleComponents/StyledLargePopupPage"
import { Mask } from "components/Widgets/Mask"

interface LargeDisclaimerProps {
  onClose?: () => void
}

const TextSection = styled.div`
  width: 100%;
  height: 75%;
  margin: 3em 0em 3em 0em;
  overflow-y: scroll;
  box-shadow: 2px 0px 7px hsl(0deg 0% 0% / 0.39);
  border-radius: 10px;
  box-sizing: border-box;
  padding: 2em;
`

const Text = styled.div`
  margin-top: 1em;
`

const LargeDisclaimer = ({ onClose }: LargeDisclaimerProps) => {
  const [showLargeDisclaimer, setShowLargeDisclaimer] =
    useRecoilState(ShowLargeDisclaimer)
  const setShowDisclaimer = useSetRecoilState(ShowDisclaimer)

  if (!showLargeDisclaimer) return null

  return (
    <Mask centered={true}>
      <StyledLargePopupPage>
        <h1>Terms of Use</h1>
        <TextSection>
          {textLines.map((text: string, key: number) => (
            <Text key={`disclaimer-${key}`}>{text}</Text>
          ))}
        </TextSection>
        <br />
        <DisclaimerAgreeButton
          setDisclaimerAgreed={() => {
            setShowLargeDisclaimer(false)
            setShowDisclaimer(false)
            onClose && onClose()
          }}
          text={"Close"}
        />
      </StyledLargePopupPage>
    </Mask>
  )
}
const StyledTinyDisclaimer = styled.div`
  position: absolute;
  bottom: 40%;
  left: 5%;
  max-width: 20%;
  z-index: 10000;
  background: rgba(255, 255, 255, 0.97);
  box-sizing: border-box;
  padding: 1em;
  box-shadow: 2px 10px 20px hsl(0deg 0% 0% / 0.39);
  border-radius: 10px;
`
export const TinyDisclaimer = () => {
  const setShowLargeDisclaimer = useSetRecoilState(ShowLargeDisclaimer)
  const showDisclaimer = useRecoilValue(ShowDisclaimer)

  if (!showDisclaimer) return null

  return (
    <StyledTinyDisclaimer>
      Satellite is in Beta. Use at your own risk with funds you're comfortable
      using.{" "}
      <span
        style={{ cursor: `pointer`, color: `blue` }}
        onClick={() => setShowLargeDisclaimer(true)}
      >
        Click here{" "}
      </span>
      for full Terms of Use.
    </StyledTinyDisclaimer>
  )
}

const DisclaimerAgreeButton = ({
  setDisclaimerAgreed,
  text,
}: {
  setDisclaimerAgreed: (agreed: boolean) => void
  text: string
}) => (
  <StyledButton onClick={() => setDisclaimerAgreed(true)}>{text}</StyledButton>
)

export const Disclaimer = () => {
  const showLargeDisclaimer = useRecoilValue(ShowLargeDisclaimer)

  return showLargeDisclaimer ? <LargeDisclaimer /> : <TinyDisclaimer />
}
