import React from "react"
import ReactDOM from "react-dom"
import { createGlobalStyle, ThemeProvider } from "styled-components"
import ReactNotification from "react-notifications-component"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { RecoilRoot } from "recoil"
import { RecoilLogger } from "recoil-devtools-logger"
import { TransferAssetBridgeFacade } from "api/TransferAssetBridgeFacade"
import ProtectedRoute from "components/CompositeComponents/ProtectedRoute"
import { PageOpacityAnimation } from "components/StyleComponents/animations/PageOpacityAnimation"
import { HideGrecaptchaBadge } from "components/StyleComponents/HideGrecaptchaBadge"
import screenConfigs from "config/screenConfigs"
import backgroundImage from "assets/svg/bg-image.svg"
import Info from "view/Debug"
import Landing from "view/Landing"
import App from "view/App"
import "react-notifications-component/dist/theme.css"
import "./index.css"
import { GlobalStyle } from "./global-styles"
import { RoutesWithTransitions } from "./routes"

new TransferAssetBridgeFacade(process.env.REACT_APP_STAGE as string)

const theme = {
  headerBackgroundColor: `rgba(0, 0, 0, 0.82)`,
}

ReactDOM.render(
  <RecoilRoot>
    <ThemeProvider theme={theme}>
      <ReactNotification />
      {process.env.REACT_APP_STAGE !== "mainnet" && <RecoilLogger />}
      <RoutesWithTransitions />
      <GlobalStyle />
    </ThemeProvider>
  </RecoilRoot>,
  document.getElementById("root")
)

// TODO: may want to use this for reporting web vitals: https://bit.ly/CRA-vitals
// reportWebVitals();
