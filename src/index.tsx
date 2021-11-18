import React                            from 'react';
import ReactDOM                         from 'react-dom';
import {createGlobalStyle}              from "styled-components";
import {BrowserRouter, Route, Switch}   from "react-router-dom";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {RecoilRoot}                     from "recoil";
import {RecoilLogger}                   from 'recoil-devtools-logger';
import {TransferAssetBridgeFacade}      from "api/TransferAssetBridgeFacade";
import ProtectedRoute                   from "component/CompositeComponents/ProtectedRoute";
import {PageOpacityAnimation}           from "component/StyleComponents/animations/PageOpacityAnimation";
import {HideGrecaptchaBadge}            from "component/StyleComponents/HideGrecaptchaBadge";
import backgroundImage                  from "resources/bg-image.svg";
import Info                             from "view/Debug";
import Login                            from "view/Login";
import App                              from 'view/App';
import reportWebVitals                  from './reportWebVitals';
import GilroyExtraBoldSvg   from "fonts/Gilroy-extrabold/Gilroy-ExtraBold.svg";
import GilroyExtraBoldEot   from "fonts/Gilroy-extrabold/Gilroy-ExtraBold.eot";
import GilroyExtraBoldTtf   from "fonts/Gilroy-extrabold/Gilroy-ExtraBold.ttf";
import GilroyExtraBoldWoff  from "fonts/Gilroy-extrabold/Gilroy-ExtraBold.woff";
import GilroyExtraBoldWoff2 from "fonts/Gilroy-extrabold/Gilroy-ExtraBold.woff2";

const GlobalStyle = createGlobalStyle`
	@font-face {
		font-family: ‘Gilroy-ExtraBold’;
		src: url(${GilroyExtraBoldEot});
		src: url(${GilroyExtraBoldEot}?#iefix) format(‘embedded-opentype’),
			url(${GilroyExtraBoldSvg}#Gilroy-ExtraBold) format(‘svg’),
			url(${GilroyExtraBoldTtf}) format(‘truetype’),
			url(${GilroyExtraBoldWoff}) format(‘woff’),
			url(${GilroyExtraBoldWoff2}) format(‘woff2’);
		font-weight: normal;
		font-style: normal;
	}
	body {
		font-family: ‘Gilroy-ExtraBold’, sans-serif;
		margin: 0 auto;
		padding: 0;
		${HideGrecaptchaBadge}
		${PageOpacityAnimation}
		box-sizing: border-box;
		position: relative;
		line-height: initial;
		background-image: url(${backgroundImage});
		background-repeat: no-repeat;
		background-position: 50% 50%;
		background-attachment: fixed;
		background-size: cover;
	}
	
	p {
		margin-block-start: 5px;
	    margin-block-end: 5px;
	    margin-inline-start: 0;
	    margin-inline-end: 0;
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