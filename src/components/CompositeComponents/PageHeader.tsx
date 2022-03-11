import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { KeplrWallet } from "hooks/wallet/KeplrWallet"
import Container from "../StyleComponents/Container"
import { FlexColumn } from "../StyleComponents/FlexColumn"
import { FlexRow } from "../StyleComponents/FlexRow"
import { SVGImage } from "../Widgets/SVGImage"
import BoldSpan from "../StyleComponents/BoldSpan"

const StyledPageHeader = styled(Container)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 45px;
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.21);
  background-color: black;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
`
const HeaderText = styled.div`
  display: flex;
  flex-direction: row;
  color: lightgrey;
  font-size: larger;
  box-sizing: border-box;
`
const HeaderImage = styled.div`
  font-family: EthnocentricRg-Regular;
  color: lightgrey;
  font-size: 24px;
  box-sizing: border-box;
  padding: 10px;
`
const ByText = styled.span`
  color: lightgrey;
  font-size: 12px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
  padding-bottom: 10px;
`
const ConnectWalletButton = styled(FlexRow)`
  cursor: pointer;
  transition: opacity 0.15s ease-in;
  &:hover {
    opacity: 0.7;
  }
`
const PageHeader = () => {
  const [onAddedKeplr, setOnAddedKeplr] = useState<
    "added" | "exists" | "error" | null
  >(null)

  useEffect(() => {
    if (onAddedKeplr) setTimeout(() => setOnAddedKeplr(null), 5000)
  }, [onAddedKeplr, setOnAddedKeplr])

  const onAddedResult = () => {
    let text = ""
    switch (onAddedKeplr) {
      case "added":
        text = "Successfully added Terra to your Keplr wallet!"
        break
      case "exists":
        text = "You already had Terra in your Keplr wallet!"
        break
      case "error":
        text = "Something went wrong. Try again?  "
        break
      default:
        return null
    }
    return (
      <div
        style={{
          color: onAddedKeplr !== "error" ? "green" : "red",
          fontSize: `smaller`,
          fontWeight: `bolder`,
          marginRight: `1em`,
        }}
      >
        {text}
      </div>
    )
  }

  const pillStyle =
    process.env.REACT_APP_STAGE === "mainnet"
      ? { color: `green`, fontSize: `smaller`, fontWeight: `bolder` }
      : {
          color: `white`,
          fontSize: `smaller`,
          fontWeight: `bolder`,
          backgroundColor: `red`,
          padding: `0.2em`,
          borderRadius: `10px`,
        }

  return (
    <StyledPageHeader>
      <HeaderText>
        <HeaderImage>Satellite</HeaderImage>
        <ByText>
          <BoldSpan style={{ marginRight: `0.5em` }}>(BETA)</BoldSpan>Powered by
          Axelar
        </ByText>
      </HeaderText>
      <FlexRow>
        {onAddedResult()}
        <>
          <div
            style={{
              color: `grey`,
              fontSize: `0.8em`,
              fontWeight: ``,
              marginRight: `0em`,
            }}
          >
            <ConnectWalletButton
              onClick={async () => {
                const connectWalletResult = await new KeplrWallet(
                  "terra"
                ).connectToWallet()
                console.log("text", connectWalletResult)
                if (
                  connectWalletResult !== "error" &&
                  connectWalletResult !== null
                ) {
                }
                setOnAddedKeplr(connectWalletResult)
              }}
            >
              <FlexColumn
                style={{
                  alignItems: `center`,
                  padding: "4px 8px 4px 8px",
                  borderRadius: "4px",
                  display: "flex",
                  flexDirection: "row",
                  backgroundColor: "rgb(99 102 241)",
                  color: "white",
                }}
              >
                <p>Add Terra chain</p>
                <SVGImage
                  height={`1.25em`}
                  width={`1.25em`}
                  margin={`0px 0em 0px 0.5em`}
                  src={require(`assets/svg/keplr.svg`).default}
                />
              </FlexColumn>
            </ConnectWalletButton>
          </div>
        </>
        {HeaderDivider()}
        <div style={pillStyle}>
          {(process.env.REACT_APP_STAGE || "").toUpperCase()}
        </div>
        {HeaderDivider()}
      </FlexRow>
    </StyledPageHeader>
  )
}

const HeaderDivider = () => (
  <div style={{ color: `grey`, margin: `0px 1em 0px 1em` }}>|</div>
)

export default PageHeader
