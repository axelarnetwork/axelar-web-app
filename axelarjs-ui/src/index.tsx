import React                       from 'react';
import ReactDOM                    from 'react-dom';
import App                         from './view/App';
import reportWebVitals             from './reportWebVitals';
import {RecoilRoot}                from "recoil";
import {RecoilLogger}              from 'recoil-devtools-logger';
import {createGlobalStyle}         from "styled-components";
import {TransferAssetBridgeFacade} from "api/TransferAssetBridgeFacade";
import downstreamServices          from "./config/downstreamServices";
import 'bootstrap/dist/css/bootstrap.min.css';

const GlobalStyle = createGlobalStyle`
	body {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
		'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	
	code {
	    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
	}
`;

new TransferAssetBridgeFacade(downstreamServices.AXELAR_BRIDGE_URL);

ReactDOM.render(
	<RecoilRoot>
		<RecoilLogger/>
		<App/>
		<GlobalStyle/>
	</RecoilRoot>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
