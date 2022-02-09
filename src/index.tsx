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

new TransferAssetBridgeFacade(process.env.REACT_APP_STAGE as string)

const routes = (props: any) => (
  <TransitionGroup>
    <CSSTransition
      key={props.location.pathname}
      classNames="page"
      timeout={2000}
    >
      <Switch>
        <ProtectedRoute exact path="/" component={App} />
        <ProtectedRoute exact path="/app" component={App} />
        <Route exact path="/landing" component={Landing} />
        <ProtectedRoute exact path="/debug" component={Info} />
      </Switch>
    </CSSTransition>
  </TransitionGroup>
)

const routesWithCSSTransition = (
  <BrowserRouter>
    <Route path="/" component={routes} />
  </BrowserRouter>
)

const theme = {
  headerBackgroundColor: `rgba(0, 0, 0, 0.82)`,
}

ReactDOM.render(
  <RecoilRoot>
    <ThemeProvider theme={theme}>
      <ReactNotification />
      {process.env.REACT_APP_STAGE !== "mainnet" && <RecoilLogger />}
      {routesWithCSSTransition}
      <GlobalStyle />
    </ThemeProvider>
  </RecoilRoot>,
  document.getElementById("root")
)

// TODO: may want to use this for reporting web vitals: https://bit.ly/CRA-vitals
// reportWebVitals();
