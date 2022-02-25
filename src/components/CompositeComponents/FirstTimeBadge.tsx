import BoldSpan from "components/StyleComponents/BoldSpan"
import StyledLink from "components/Widgets/Link"
import { useRecoilState } from "recoil"
import { DismissFirstTimeBadge } from "state/ApplicationStatus"
import styled from "styled-components"

const StyledContainer = styled.div`
  position: absolute;
  top: 60px;
  left: 10px;
  box-sizing: border-box;
  padding: 1em 2.5em 1em 1em;
  background-color: #017cff;
  border-radius: 10px;
  z-index: 100;
  color: white;
  font-size: 0.8em;
`

const FirstTimeBadge = () => {
  const [dismissBadge, setDismissBadge] = useRecoilState(DismissFirstTimeBadge)

  if (dismissBadge) return null

  return (
    <StyledContainer>
      New to Satellite? Run a few flows in our{" "}
      <StyledLink
        href="http://bridge.testnet.axelar.dev"
        style={{ color: `white` }}
      >
        <BoldSpan>playground</BoldSpan>
      </StyledLink>{" "}
      (with testnet tokens) until you know what you're doing.{" "}
      <div
        style={{
          position: `absolute`,
          right: 10,
          top: 10,
          cursor: `pointer`,
        }}
        onClick={() => setDismissBadge(true)}
      >
        <img src={require(`assets/svg/close-icon.svg`).default} alt={""} />
      </div>
    </StyledContainer>
  )
}
export default FirstTimeBadge
