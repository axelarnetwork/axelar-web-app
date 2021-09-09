import React from 'react';
import logo from './logo.svg';
import {AxelarBridgeFacade, IAssetTransferObject, TransferAssetTypes} from "@axelar-network/axelarjs-sdk";

import './App.css';

const axelarBridgeFacade = new AxelarBridgeFacade("http://localhost:4000");

const App = () => {


	const message: IAssetTransferObject = {
		token1: "BTC",
		token2: "ETH",
		destinationAddress: "TBD"
	}

	const onClick = async () => {
		const res = await axelarBridgeFacade.transferAssets(TransferAssetTypes.BTC_TO_EVM, message);
		console.log("results",res);
	}

	return (
		<div className="App">
			<header className="App-header">
			<img src={logo} className="App-logo" alt="logo" />
			<p>
				Edit <code>src/App.tsx</code> and save to reload.
			</p>
			<div onClick={onClick}>Click me!</div>
			<a
				className="App-link"
				href="https://reactjs.org"
				target="_blank"
				rel="noopener noreferrer"
			>
				Learn React
			</a>
			</header>
		</div>
  );
}

export default App;
