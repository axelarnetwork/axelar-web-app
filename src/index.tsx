import React                            from 'react';
import ReactDOM                         from 'react-dom';
import {BrowserRouter, Route, Switch}   from "react-router-dom";
import App                              from './view/App';
import reportWebVitals                  from './reportWebVitals';
import {RecoilRoot}                     from "recoil";
import {RecoilLogger}                   from 'recoil-devtools-logger';
import {createGlobalStyle}              from "styled-components";
import {TransferAssetBridgeFacade}      from "api/TransferAssetBridgeFacade";
import Info                             from "./view/Debug";
import Login                            from "./view/Login";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import ProtectedRoute                   from "./component/CompositeComponents/ProtectedRoute";
import backgroundImage                  from "resources/bg-image.svg";
import './index.css';

const GlobalStyle = createGlobalStyle`
	body {
		margin: 0 auto;
		padding: 0;
		// width: 100vh;
		box-sizing: border-box;
		position: relative;
		line-height: initial;
		background-image: url(${backgroundImage});
		background-repeat: no-repeat;
		background-position: 50% 50%;
		background-attachment: fixed;
		background-size: cover;
	}

	code {
	    // font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
	}
`;

new TransferAssetBridgeFacade(process.env.REACT_APP_STAGE as string);

const routes = (props: any) => <TransitionGroup>
	<CSSTransition key={props.location.pathname} classNames="page" timeout={2000}>
		<Switch>
			<ProtectedRoute exact path="/" component={App}/>
			<ProtectedRoute exact path="/app" component={App}/>
			<Route exact path="/login" component={Login}/>
			<ProtectedRoute exact path="/debug" component={Info}/>
		</Switch>
	</CSSTransition>
</TransitionGroup>;

const routesWithCSSTransition = <BrowserRouter>
	<Route path="/" component={routes}/>
</BrowserRouter>;

ReactDOM.render(
	<RecoilRoot>
		<RecoilLogger/>
		{routesWithCSSTransition}
		<GlobalStyle/>
	</RecoilRoot>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export {StyledImage}                    from "./component/StyleComponents/StyledImage";