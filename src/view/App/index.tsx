import React, { useEffect, useState } from "react"
import { confirm } from "react-confirm-box"
import styled from "styled-components"
import { useRecoilState, useRecoilValue } from "recoil"
import InfoWidget from "components/CompositeComponents/InfoWidget"
import PageHeader from "components/CompositeComponents/PageHeader"
import PageFooter from "components/CompositeComponents/PageFooter"
import WalkThrough from "components/CompositeComponents/Walkthrough"
import { FlexRow } from "components/StyleComponents/FlexRow"
import { StyledButton } from "components/StyleComponents/StyledButton"
import { FlexColumn } from "components/StyleComponents/FlexColumn"
import BoldSpan from "components/StyleComponents/BoldSpan"
import { SVGImage } from "components/Widgets/SVGImage"
import { DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY } from "config/consts"
import useLoadRecaptcha from "hooks/auth/useLoadRecaptcha"
import {
  ShowDisclaimer,
  ShowDisclaimerFromFAQ,
  ShowTransactionHistoryPage,
} from "state/ApplicationStatus"
import { HasAcknowledgedTerraReinstall } from "state/Wallet"
import {
  ChainSelection,
  IsValidDestinationAddress,
  SourceAsset,
} from "state/ChainSelection"
import { StyledAppContainer } from "view/App/styles/StyledAppContainer"
import SwapWindow from "view/SwapWindow"
import Disclaimer from "../Disclaimer"
import { Redirect } from "react-router-dom"
import TransactionHistory from "../TransactionHistory"

const StyledDialogBox = styled.div`
  height: 50%;
  width: 40%;
  min-width: 500px;
  background-color: white;
  padding: 2em;
  box-sizing: border-box;
  border-radius: 10px;
  font-size: 0.9em;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.22), inset 0 0 3px 0 #262426;
  border: solid 1px #b9bac8;
`
const options = {
  render: (message: string, onConfirm: () => void, onCancel: () => void) => {
    return (
      <StyledDialogBox>
        <div>{message}</div>
        <br />
        <FlexRow>
          <StyledButton style={{ margin: `0.5em` }} onClick={onConfirm}>
            {" "}
            Okay{" "}
          </StyledButton>
        </FlexRow>
      </StyledDialogBox>
    )
  },
}

const App = () => {
  const [isRecaptchaSet, initiateRecaptcha] = useLoadRecaptcha()
  const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const destChainSelection = useRecoilValue(
    ChainSelection(DESTINATION_TOKEN_KEY)
  )
  const selectedSourceAsset = useRecoilValue(SourceAsset)
  const isValidDestinationAddr = useRecoilValue(IsValidDestinationAddress)
  const showDisclaimer = useRecoilValue(ShowDisclaimer)
  const showDisclaimerForFAQ = useRecoilValue(ShowDisclaimerFromFAQ)
  const showTransactionHistoryPage = useRecoilValue(ShowTransactionHistoryPage)
  const [underMaintenance] = useState(process.env.REACT_APP_UNDER_MAINTENANCE)
  const [hasAcknowledgedTerra, setHasAcknowledgedTerra] = useRecoilState(
    HasAcknowledgedTerraReinstall
  )

  const canLightUp =
    sourceChainSelection &&
    destChainSelection &&
    sourceChainSelection.chainName !== destChainSelection.chainName &&
    selectedSourceAsset &&
    isValidDestinationAddr

  useEffect(() => {
    if (!isRecaptchaSet) initiateRecaptcha()
  }, [isRecaptchaSet, initiateRecaptcha])

  useEffect(() => {
    if (!hasAcknowledgedTerra && underMaintenance === "false") {
      const message: any = (
        <FlexColumn>
          <h2>Important note</h2>
          <div>
            <BoldSpan>
              We changed the configs to our Terra wallet integration in Keplr.
            </BoldSpan>
          </div>
          <br />
          <div>
            <BoldSpan>
              If you previously added it to your Keplr wallet through Satellite,
              please delete Terra from the extension and add it back with the{" "}
              <SVGImage
                height={`1em`}
                width={`1em`}
                margin={`0em 0em -0.125em 0em`}
                src={require(`assets/svg/keplr.svg`).default}
              />{" "}
              button on the top right of this page.
            </BoldSpan>
          </div>
        </FlexColumn>
      )
      confirm(message, options as any).then((acknowledged) =>
        setHasAcknowledgedTerra(true)
      )
    }
  }, [hasAcknowledgedTerra, setHasAcknowledgedTerra, underMaintenance])

  if (underMaintenance === "true") return <Redirect to={"/landing"} />

  return (
    <StyledAppContainer>
      {(showDisclaimerForFAQ || canLightUp) && showDisclaimer && <Disclaimer />}
      {showTransactionHistoryPage && <TransactionHistory />}
      <WalkThrough />
      <InfoWidget />
      <PageHeader />
      {isRecaptchaSet ? <SwapWindow /> : null}
      <PageFooter />
    </StyledAppContainer>
  )
}

export default App
