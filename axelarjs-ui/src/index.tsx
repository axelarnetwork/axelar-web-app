import React                          from 'react';
import ReactDOM                       from 'react-dom';
import App                            from './view/App';
import reportWebVitals                from './reportWebVitals';
import {RecoilRoot}                   from "recoil";
import {RecoilLogger}                 from 'recoil-devtools-logger';
import {createGlobalStyle}            from "styled-components";
import {TransferAssetBridgeFacade}    from "api/TransferAssetBridgeFacade";
import downstreamServices             from "./config/downstreamServices";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import './index.css';
import Info from "./view/Debug";
// import 'bootstrap/dist/css/bootstrap.min.css';

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
	}

	code {
	    // font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
	}
`;

new TransferAssetBridgeFacade(downstreamServices.AXELAR_BRIDGE_URL);

const routes = <BrowserRouter>
	<Switch>
		<Route exact path="/" component={App}/>
		<Route exact path="/debug" component={Info}/>
	</Switch>
</BrowserRouter>;

ReactDOM.render(
	<RecoilRoot>
		<RecoilLogger/>
		{routes}
		<GlobalStyle/>
	</RecoilRoot>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
