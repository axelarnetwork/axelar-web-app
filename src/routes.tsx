import { Switch, Route, BrowserRouter } from "react-router-dom"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import ProtectedRoute from "./components/CompositeComponents/ProtectedRoute"
import { AppPage, DebugPage, LandingPage } from "./pages"

const routes = (props: any) => (
  <TransitionGroup>
    <CSSTransition
      key={props.location.pathname}
      classNames="page"
      timeout={2000}
    >
      <Switch>
        <ProtectedRoute exact path="/" component={AppPage} />
        <ProtectedRoute exact path="/app" component={AppPage} />
        <Route exact path="/landing" component={LandingPage} />
        <ProtectedRoute exact path="/debug" component={DebugPage} />
      </Switch>
    </CSSTransition>
  </TransitionGroup>
)

export const RoutesWithTransitions = () => {
  return (
    <BrowserRouter>
      <Route path="/" component={routes} />
    </BrowserRouter>
  )
}
