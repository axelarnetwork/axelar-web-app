import React, { useRef, useState } from "react"
import { useRecoilState } from "recoil"
import { Redirect } from "react-router-dom"
import styled from "styled-components"
import { slamKeyframe } from "components/StyleComponents/animations/slamKeyframe"
import { StyledButton } from "components/StyleComponents/StyledButton"
import usePasswordInput from "hooks/usePasswordInput"
import backgroundImage from "assets/svg/globe.svg"
import { IsLoggedInWithBetaPassword } from "state/ApplicationStatus"
import disintegrate from "./animation"
import { ethers } from "ethers"
import StyledLink from "components/Widgets/Link"

const StyledLoginPage = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: row;
  background: white !important;
`

const StyledLoginSection = styled.div`
  height: 100%;
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const LeftStyledLoginSection = styled(StyledLoginSection)`
  background-image: linear-gradient(to right, lightgrey, white);
  width: 40%;
`

const StyledImage = styled.img`
  height: auto;
  width: 90%;
  object-fit: cover;
`

const SlaminDiv = styled(StyledImage)`
  animation: ${slamKeyframe} 1000ms ease-in;
  display: block;
  font-size: 6em;
  font-weight: 600;
  margin-left: 20px;
`

export const LandingPage = () => {
  const imageRef = useRef(null)
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(IsLoggedInWithBetaPassword)
  const [underMaintenance] = useState(process.env.REACT_APP_UNDER_MAINTENANCE)

  const onClick = () => {
    if (
      !(
        ethers.utils.sha256(ethers.utils.toUtf8Bytes(userPassword)) ===
        process.env.REACT_APP_LOGIN_PASSWORD
      )
    )
      return
    disintegrate(imageRef.current).then(() =>
      setTimeout(() => setIsLoggedIn(true), 1000)
    )
  }
  const [userPassword, passwordComponent] = usePasswordInput({
    handleOnEnterPress: onClick,
  })

  const maintenanceLanguage = () => {
    return (
      <>
        <h1>We'll be right back</h1>
        <div style={{ fontSize: `1.25em`, width: `75%`, textAlign: "center" }}>
          <div>Satellite is under scheduled maintenance.</div>
          <div>
            For latest updates:{" "}
            <StyledLink href="https://twitter.com/axl_satellite" children={"@axl_satellite"} />
          </div>
          <br/>
          <div>Back online shortly!</div>
        </div>
      </>
    )
  }

  const leftSection = () => {
    return underMaintenance === "true" ? (
      maintenanceLanguage()
    ) : (
      <>
        {maintenanceLanguage()}
        <br />
        {React.cloneElement(passwordComponent, { handleOnEnterPress: onClick })}
        <br />
        <div style={{ width: `50%` }}>
          <StyledButton onClick={onClick}>Enter</StyledButton>
        </div>
      </>
    )
  }

  return (
    <>
      {isLoggedIn && underMaintenance !== "true" ? (
        <Redirect to={"/"} />
      ) : (
        <StyledLoginPage>
          <LeftStyledLoginSection>
            <SlaminDiv
              src={
                require("assets/svg/axelar-logo-horizontal-white.svg").default
              }
            />
            <br />
            {leftSection()}
          </LeftStyledLoginSection>
          <StyledLoginSection>
            <StyledImage ref={imageRef} src={backgroundImage} />
          </StyledLoginSection>
        </StyledLoginPage>
      )}
    </>
  )
}
