import { useRecoilValue }                          from "recoil"
import styled                                      from "styled-components"
import BoldSpan                                    from "components/StyleComponents/BoldSpan"
import LoadingWidget                               from "components/Widgets/LoadingWidget";
import { DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY } from "config/consts"
import { ChainSelection, SourceAsset }             from "state/ChainSelection"
import { getShortenedWord }                        from "utils/wordShortener"
import { getMinDepositAmount }                     from "utils/getMinDepositAmount"
import { DepositFromWallet }                       from "./DepositFromWallet"
import {AssetInfo}                                 from "@axelar-network/axelarjs-sdk";
import React                                       from "react";

export const StyledHeader = styled.div`
  position: relative;
  width: 100%;
  background-color: ${(props) => props.theme.headerBackgroundColor};
  border-radius: 9px 9px 0px 0px;
  color: white;
  font-size: 1em;
  text-align: center;
  box-sizing: border-box;
  padding: 0.25em;
`

interface Step2InfoForWidgetProps {
  isWalletConnected: boolean
  walletBalance: number
  reloadBalance: () => void
  walletAddress: string
  depositAddress: AssetInfo
}
const Step2InfoForWidget = ({
  isWalletConnected,
  walletBalance,
  reloadBalance,
  walletAddress,
  depositAddress,
}: Step2InfoForWidgetProps) => {
  const sourceAsset = useRecoilValue(SourceAsset)
  const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const destChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY))

  if (!sourceAsset || !depositAddress || !sourceChain || !destChain) return null

  const minDepositAmt = getMinDepositAmount(sourceAsset, destChain)

  return (
    <div
      style={{ width: `100%`, height: `100%` }}
      className={"joyride-status-step-2-important-info"}
    >
      <StyledHeader>
        <br />
        <div>
          <BoldSpan>Deposit Notes</BoldSpan>
        </div>
        <br />
      </StyledHeader>
      <br />
      {generateLine("Transfer Fee: ", `${sourceChain?.txFeeInPercent}%`)}
      {minDepositAmt && generateLine("Min Transfer Amount: ", `${minDepositAmt} ${sourceAsset?.assetSymbol }`)}
      {generateLine("Wait Time: ", `Up to ~${sourceChain?.estimatedWaitTime}min`)}
      {generateLine("Deposit Address: ", getShortenedWord(depositAddress?.assetAddress))}

      {isWalletConnected && <div>
        {walletAddress?.length > 0 && <>
          {generateLine("Wallet Address: ", getShortenedWord(walletAddress, 5))}
          {generateLine("Balance: ", <span>
            {walletBalance}{" "}
            {sourceAsset?.assetSymbol}
            <LoadingWidget cb={reloadBalance} />
          </span>)}
          {generateLine("Deposit Amount:", <DepositFromWallet
              isWalletConnected={isWalletConnected}
              walletBalance={walletBalance}
              reloadBalance={reloadBalance}
              walletAddress={walletAddress}
              depositAddress={depositAddress}
          />)}
        </>}
      </div>}
      <br />
    </div>
  )
}

const generateLine = (
  header: string,
  text: string | JSX.Element,
  addlStyles?: { [key: string]: string }
) => {
  let style = { padding: `0.4em 0.75em 0.4em 0.75em`, fontSize: `0.9em` }
  if (addlStyles) style = { ...style, ...addlStyles }
  return (
    <div style={style}>
      <BoldSpan>{header} </BoldSpan>
      <span>{text}</span>
    </div>
  )
}

export default Step2InfoForWidget
