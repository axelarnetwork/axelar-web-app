import React                            from 'react';
import ReactDOM                         from 'react-dom';
import {createGlobalStyle}              from "styled-components";
import ReactNotification                from 'react-notifications-component';
import {BrowserRouter, Route, Switch}   from "react-router-dom";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {RecoilRoot}                     from "recoil";
import {RecoilLogger}                   from 'recoil-devtools-logger';
import {TransferAssetBridgeFacade}      from "api/TransferAssetBridgeFacade";
import ProtectedRoute                   from "component/CompositeComponents/ProtectedRoute";
import {PageOpacityAnimation}           from "component/StyleComponents/animations/PageOpacityAnimation";
import {HideGrecaptchaBadge}            from "component/StyleComponents/HideGrecaptchaBadge";
import screenConfigs                    from "config/screenConfigs";
import backgroundImage                  from "resources/bg-image.svg";
import Info                             from "view/Debug";
import Login                            from "view/Login";
import App                              from 'view/App';
import reportWebVitals                  from './reportWebVitals';
import 'react-notifications-component/dist/theme.css';

const GlobalStyle = createGlobalStyle`

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
	    max-width: 100%;
        overflow-x: hidden;

		@media ${screenConfigs.media.desktop} {
			font-size: 20px;
		}
		@media ${screenConfigs.media.laptop} {
			font-size: 18px;
		}
		@media ${screenConfigs.media.tablet} {
			font-size: 16px;
		}
		@media ${screenConfigs.media.mobile} {
			
		}
	}
	
	p {
		margin-block-start: 5px;
	    margin-block-end: 5px;
	    margin-inline-start: 0;
	    margin-inline-end: 0;
	}
	
	button {
		@media ${screenConfigs.media.desktop} {
			font-size: 20px;
		}
		@media ${screenConfigs.media.laptop} {
			font-size: 18px;
		}
		@media ${screenConfigs.media.tablet} {
			font-size: 16px;
		}
		@media ${screenConfigs.media.mobile} {
	
		}		
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
		<ReactNotification/>
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