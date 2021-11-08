import React                          from 'react';
import ReactDOM                       from 'react-dom';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import App                              from './view/App';
import reportWebVitals                  from './reportWebVitals';
import {RecoilRoot}                     from "recoil";
import {RecoilLogger}                   from 'recoil-devtools-logger';
import {createGlobalStyle}              from "styled-components";
import {TransferAssetBridgeFacade}      from "api/TransferAssetBridgeFacade";
import downstreamServices               from "./config/downstreamServices";
import Info                             from "./view/Debug";
import './index.css';
import Login                            from "./view/Login";
import {TransitionGroup, CSSTransition} from "react-transition-group";
import ProtectedRoute                   from "./component/CompositeComponents/ProtectedRoute";
import backgroundImage                  from "resources/dummy_background_7.jpg";

const GlobalStyle = createGlobalStyle`
	body {
		margin: 0;
		padding: 0;
		height: 100%;
		font-family: Kanit, Sans-Serif !important;
     	font-size: 14px;
		font-weight: normal;
		font-stretch: normal;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background-image: url(${backgroundImage});
		background-repeat: no-repeat;
		background-position: center center;
		background-attachment: fixed;
		background-size: cover;
	}

	code {
	    // font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
	}
`;

new TransferAssetBridgeFacade(downstreamServices.AXELAR_BRIDGE_URL);

const routes = (props: any) =>	<TransitionGroup>
	<CSSTransition key={props.location.pathname} classNames="page" timeout={2000}>
		<Switch>
			<Route exact path="/" component={Login}/>
			<ProtectedRoute exact path="/app" component={App}/>
			<Route exact path="/login" component={Login}/>
			<ProtectedRoute exact path="/debug" component={Info}/>
		</Switch>
	</CSSTransition>
</TransitionGroup>;

const routesWithCSSTransition = <BrowserRouter>
	<Route path="/" component={routes} />
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
