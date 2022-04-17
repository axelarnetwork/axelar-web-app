import { AssetInfo, ChainInfo } from "@axelar-network/axelarjs-sdk"
import styled from "styled-components"
import screenConfigs from "config/screenConfigs"
import { useRecoilValue } from "recoil"
import { DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY } from "config/consts"
import downstreamServices from "config/downstreamServices"
import CopyToClipboard from "components/Widgets/CopyToClipboard"
import Link from "components/Widgets/Link"
import BoldSpan from "components/StyleComponents/BoldSpan"
import { FlexRow } from "components/StyleComponents/FlexRow"
import { ImprovedTooltip } from "components/Widgets/ImprovedTooltip"
import { SVGImage } from "components/Widgets/SVGImage"
import {
  ChainSelection,
  DestinationAddress,
  SourceAsset,
} from "state/ChainSelection"
import {
  SourceDepositAddress,
  SrcChainDepositTxHash,
} from "state/TransactionStatus"
import { getShortenedWord } from "utils/wordShortener"
import logoKeplr from "assets/svg/keplr.svg"
import logoMetamask from "assets/svg/metamask.svg"
import logoAxelar from "assets/svg/logos/AXL.svg"
import logoTerraStation from "assets/svg/terra-station.svg"
import { WalletType } from "state/Wallet"
import { hasSelectedNativeAssetForChain } from "utils/hasSelectedNativeAssetOnChain"
import { getConfigs } from "api/WaitService"
import { ListItem } from "./ListItem"
import { MetaMaskWallet } from "hooks/wallet/MetaMaskWallet"
import { useEffect, useState } from "react"

const StyledStatusList = styled.div`
  width: 100%;
  height: 65%;
  @media ${screenConfigs.media.desktop} {
    margin-top: 20px;
  }
`
const StyledSVGImage = styled(SVGImage)`
  cursor: pointer;
`
const HelperWidget = styled.span`
  box-sizing: border-box;
  padding: 0.5em 1em 0.5em 1em;
  text-align: center;
  background-color: ${(props) => props.theme.headerBackgroundColor};
  border-radius: 50px;
  color: white;
  cursor: pointer;
  font-size: smaller;
  transition: opacity 0.2s ease;
  min-width: fit-content;
  &:hover {
    opacity: 0.8;
  }
`

interface IStatusListProps {
  activeStep: number
  isWalletConnected: boolean
  connectToWallet: (walletType: WalletType) => void
}

const StatusList = (props: IStatusListProps) => {
  const { activeStep } = props
  const selectedSourceAsset = useRecoilValue(SourceAsset)
  const sourceChain = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY))
  const destinationChain = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY))
  const depositAddress = useRecoilValue(SourceDepositAddress)
  const destinationAddress = useRecoilValue(DestinationAddress)
  const srcChainDepositHash = useRecoilValue(SrcChainDepositTxHash)
  const [tokenToAdd, setTokenToAdd] = useState(false)

  useEffect(() => {
    if (tokenToAdd) {
      setTimeout(() => {
        addTokenToMetamask(destinationChain, selectedSourceAsset)
        setTokenToAdd(false)
      }, 2000)
    }
  }, [tokenToAdd, destinationChain, selectedSourceAsset])

  const renderWalletButton = () => {
    if (props.isWalletConnected) return null

    if (sourceChain?.chainName?.toLowerCase() !== "terra") {
      const logo = sourceChain?.module === "evm" ? logoMetamask : logoKeplr
      const walletName = sourceChain?.module === "evm" ? "Metamask" : "Keplr"
      const walletType =
        sourceChain?.module === "evm" ? WalletType.METAMASK : WalletType.KEPLR
      return (
        <div>
          <FlexRow
            style={{
              width: `100%`,
              justifyContent: `flex-start`,
              marginTop: `0.5em`,
            }}
          >
            <div style={{ marginRight: `5px` }}>
              Send{" "}
              {sourceChain?.module === "axelarnet" ? "IBC transfer" : "deposit"}{" "}
              here via:
            </div>
            <HelperWidget onClick={() => props.connectToWallet(walletType)}>
              <WalletLogo src={logo} />
              <span style={{ marginLeft: "0.5em" }}>{walletName}</span>
            </HelperWidget>
          </FlexRow>
          {hasSelectedNativeAssetForChain(
            selectedSourceAsset as AssetInfo,
            sourceChain?.chainName
          ) && (
            <div
              style={{
                width: `100%`,
                justifyContent: `flex-start`,
                marginTop: `0.5em`,
                fontStyle: `italic`,
                fontSize: `0.8em`,
              }}
            >
              (Satellite accepts native {sourceChain?.chainSymbol} tokens and
              automatically converts them to W{sourceChain?.chainSymbol} for the
              required deposit.)
            </div>
          )}
        </div>
      )
    } else {
      return (
        <div style={{ marginTop: `0.5em` }}>
          <p>Send IBC transfer here via:</p>
          <FlexRow
            style={{
              justifyContent: `space-between`,
              width: `80%`,
            }}
          >
            <HelperWidget
              onClick={() => props.connectToWallet(WalletType.KEPLR)}
              style={{ marginRight: "2px" }}
            >
              <span style={{ marginRight: "5px" }}>Keplr Wallet</span>
              <WalletLogo src={logoKeplr} />
            </HelperWidget>
            <p style={{ marginRight: "2px" }}>OR</p>
            <HelperWidget
              onClick={() => props.connectToWallet(WalletType.TERRA)}
            >
              <span style={{ marginRight: "5px" }}>Terra Station</span>
              <WalletLogo src={logoTerraStation} />
            </HelperWidget>
          </FlexRow>
        </div>
      )
    }
  }

  return (
    <StyledStatusList>
      <ListItem
        className={"joyride-status-step-1"}
        step={1}
        activeStep={activeStep}
        text={
          <span>
            Generating a one-time deposit address for{" "}
            {selectedSourceAsset?.assetSymbol} recipient:{" "}
            <BoldSpan>
              {getShortenedWord(destinationAddress as string, 5)}
            </BoldSpan>
          </span>
        }
      />
      <ListItem
        className={"joyride-status-step-2"}
        step={2}
        activeStep={activeStep}
        text={
          activeStep >= 2 ? (
            <div
              style={{
                overflowWrap: `break-word`,
                overflow: `hidden`,
                width: `100%`,
              }}
            >
              <div>
                Deposit address:{" "}
                <BoldSpan style={{ marginRight: `10px` }}>
                  {getShortenedWord(depositAddress?.assetAddress, 5)}
                </BoldSpan>
                <ImprovedTooltip
                  anchorContent={
                    <CopyToClipboard
                      JSXToShow={<span></span>}
                      height={`12px`}
                      width={`10px`}
                      textToCopy={depositAddress?.assetAddress || ""}
                      showImage={true}
                    />
                  }
                  tooltipText={
                    "Optional: Copy this address if you want to make this deposit from outside Satellite."
                  }
                  tooltipAltText={
                    "Copied! Please be sure you send the correct assets to this address."
                  }
                />
              </div>
              {activeStep === 2 && renderWalletButton()}
              {activeStep === 3 &&
                linkToExplorer(
                  sourceChain as ChainInfo,
                  srcChainDepositHash as string
                )}
            </div>
          ) : (
            `Waiting for your deposit into a temporary deposit account.`
          )
        }
      />
      <ListItem
        className={"joyride-status-step-3"}
        step={3}
        activeStep={activeStep}
        text={
          activeStep >= 3 ? (
            <FlexRow style={{ width: `100%` }}>
              <div>
                {
                  activeStep === 4
                    ? "Transaction Complete!"
                    : `Deposit looks good! Your ${destinationChain?.chainName} balance will be updated shortly`
                }
              </div>

              <FlexRow>
                <ImprovedTooltip
                  anchorContent={
                    <WalletLogo
                      src={logoAxelar}
                      onClick={() =>
                        window.open(
                          downstreamServices.axelarScanAccountSearch[
                            process.env.REACT_APP_STAGE as string
                          ] + destinationAddress,
                          "_blank"
                        )
                      }
                      height={`1.5em`}
                      width={`1.5em`}
                      margin={`0.5em`}
                    />
                  }
                  tooltipText={"Check Axelarscan for latest transaction status"}
                  tooltipAltText={""}
                />
                {destinationChain?.module === "evm" && (
                  <ImprovedTooltip
                    anchorContent={
                      <WalletLogo
                        src={logoMetamask}
                        onClick={() =>
                          confirmChainAndAddToken(
                            destinationChain,
                            selectedSourceAsset,
                            () => setTokenToAdd(true)
                          )
                        }
                        height={`1.5em`}
                        width={`1.5em`}
                        margin={`0.5em`}
                      />
                    }
                    tooltipText={`Add ${selectedSourceAsset?.assetSymbol} token to Metamask`}
                    tooltipAltText={""}
                  />
                )}
                {getBlockExplorer(destinationChain as ChainInfo) && (
                  <ImprovedTooltip
                    anchorContent={
                      <WalletLogo
                        src={
                          require(`assets/svg/logos/${destinationChain?.chainSymbol}.svg`)
                            .default
                        }
                        onClick={() =>
                          window.open(
                            getBlockExplorerLink(
                              destinationChain as ChainInfo,
                              selectedSourceAsset as AssetInfo,
                              destinationAddress as string
                            ),
                            "_blank"
                          )
                        }
                        height={`1.5em`}
                        width={`1.5em`}
                        margin={`0.5em`}
                      />
                    }
                    tooltipText={`View your account on ${
                      getBlockExplorer(destinationChain as ChainInfo)?.name
                    }`}
                    tooltipAltText={""}
                  />
                )}
              </FlexRow>
            </FlexRow>
          ) : (
            `Finalizing your transaction on ${destinationChain?.chainName}.`
          )
        }
      />
    </StyledStatusList>
  )
}

const WalletLogo = ({
  src,
  onClick,
  height,
  width,
  margin,
}: {
  src: any
  onClick?: any
  height?: string
  width?: string
  margin?: string
}) => (
  <span onClick={onClick}>
    <StyledSVGImage
      height={height || `1em`}
      width={width || `1em`}
      margin={margin || `0em 0em -0.125em 0em`}
      src={src}
    />
  </span>
)

const addTokenToMetamask = async (
  destinationChain: ChainInfo | null,
  selectedSourceAsset: AssetInfo | null
) => {
  try {
    return await (window as any).ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: getTokenAddress(
            destinationChain as ChainInfo,
            selectedSourceAsset as AssetInfo
          ),
          symbol: selectedSourceAsset?.assetSymbol,
          decimals: selectedSourceAsset?.decimals,
          image: "",
        },
      },
    })
  } catch (error) {
    console.log(error)
  }
}
const confirmChainAndAddToken = async (
  destinationChain: ChainInfo | null,
  selectedSourceAsset: AssetInfo | null,
  cb: any
) => {
  const { chainName } = destinationChain as ChainInfo
  const _chainName = chainName?.toLowerCase() || ""
  const evmWallet = new MetaMaskWallet(_chainName)

  if (!evmWallet.isChainActive(_chainName)) {
    await evmWallet.switchChain(_chainName)
    cb()
  } else await addTokenToMetamask(destinationChain, selectedSourceAsset)
}

const linkToExplorer = (sourceChainSelection: ChainInfo, txHash: string) => {
  const blockExplorer = getBlockExplorer(sourceChainSelection)

  return txHash && blockExplorer ? (
    <div style={{ marginTop: `0.35em`, width: `100%` }}>
      <span>
        Deposit txHash: <BoldSpan>{getShortenedWord(txHash)}</BoldSpan>{" "}
      </span>
      <Link href={`${blockExplorer.url}tx/${txHash}`}>
        <SVGImage
          style={{ marginLeft: `5px` }}
          src={require(`assets/svg/link-new-tab.svg`).default}
          height={`1em`}
          width={`1em`}
        />
      </Link>
    </div>
  ) : null
}

const getBlockExplorer = (
  chain: ChainInfo
): { name: string; url: string } | null => {
  return (
    downstreamServices.blockExplorers[process.env.REACT_APP_STAGE as string] &&
    downstreamServices.blockExplorers[process.env.REACT_APP_STAGE as string][
      chain?.chainName?.toLowerCase() as string
    ]
  )
}

const getBlockExplorerLink = (
  destinationChain: ChainInfo,
  asset: AssetInfo,
  destinationAddress: string
) => {
  const blockExplorer = getBlockExplorer(destinationChain)

  if (!blockExplorer) return ""

  if (destinationChain.module === "axelarnet")
    return blockExplorer.url + "account/" + destinationAddress

  const tokenAddress = getTokenAddress(destinationChain, asset)

  if (!tokenAddress) return `${blockExplorer.url}address/${destinationAddress}`

  return `${blockExplorer.url}token/${tokenAddress}?a=${destinationAddress}`
}

const getTokenAddress = (destinationChain: ChainInfo, asset: AssetInfo) => {
  const config = getConfigs(process.env.REACT_APP_STAGE as string)
  const tokenAddressMap =
    config?.ethersJsConfigs[destinationChain?.chainName.toLowerCase()]
      ?.tokenAddressMap
  return tokenAddressMap[asset?.common_key as string]
}

export default StatusList
