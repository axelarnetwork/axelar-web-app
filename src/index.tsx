import React, { Suspense } from "react"
import ReactDOM from "react-dom"
import { ThemeProvider } from "styled-components"
import ReactNotification from "react-notifications-component"
import { RecoilRoot } from "recoil"
import { TransferAssetBridgeFacade } from "api/TransferAssetBridgeFacade"
import { GlobalStyle } from "./global-styles"
import { RoutesWithTransitions } from "./routes"
import { WalletProvider, getChainOptions } from "@terra-money/wallet-provider"
import "react-notifications-component/dist/theme.css"
import { datadogLogs } from "@datadog/browser-logs"
import "./index.css"
import { AssetConfig, ChainInfo, Environment, loadAssets, loadChains } from "@axelar-network/axelarjs-sdk"

new TransferAssetBridgeFacade(process.env.REACT_APP_STAGE as string)

export let ALL_ASSETS: AssetConfig[] = [];
export let ALL_CHAINS: ChainInfo[] = [];
const getAssets = async () => {
  const environment: Environment = process.env.REACT_APP_STAGE === "local"
  ? "testnet" as Environment
  : (process.env.REACT_APP_STAGE as Environment)
  const assets = await loadAssets({ environment })
  ALL_ASSETS = assets;
}

(async () => {
  await getAssets();
  // await getChains();
})()

datadogLogs.init({
  clientToken: process.env.REACT_APP_DD_CLIENT_TOKEN as string,
  datacenter: "us",
  site: "datadoghq.com",
  forwardErrorsToLogs: true,
  sampleRate: 1,
  service: `satellite_browser_${process.env.REACT_APP_STAGE}`,
  env: process.env.REACT_APP_STAGE,
  beforeSend: (log) => {
    if (log.http && log.http.status_code === 404) {
      return false
    }
  },
})

const theme = {
  headerBackgroundColor: `rgba(0, 0, 0, 0.82)`,
}
getChainOptions().then(async (_chainOptions) => {
  const defaultNetwork =
    process.env.REACT_APP_STAGE === "mainnet"
      ? _chainOptions.walletConnectChainIds[1]
      : _chainOptions.walletConnectChainIds[0]
  const chainOptions = { ..._chainOptions, defaultNetwork }
  // await getAssets();
  // await getChains();
  ReactDOM.render(
    <WalletProvider {...chainOptions}>
      <RecoilRoot>
        <Suspense fallback={<div>Loading whale types...</div>}>
          <ThemeProvider theme={theme}>
            <ReactNotification />
            <RoutesWithTransitions />
            <GlobalStyle />
          </ThemeProvider>
        </Suspense>
      </RecoilRoot>
    </WalletProvider>,
    document.getElementById("root")
  )
})
// TODO: may want to use this for reporting web vitals: https://bit.ly/CRA-vitals
// reportWebVitals();
