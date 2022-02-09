import { Switch, Route, BrowserRouter } from "react-router-dom"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import ProtectedRoute from "./components/CompositeComponents/ProtectedRoute"
import App from "./view/App"
import Info from "./view/Debug"
import Landing from "./view/Landing"

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

export const RoutesWithTransitions = () => {
  return (
    <BrowserRouter>
      <Route path="/" component={routes} />
    </BrowserRouter>
  )
}
