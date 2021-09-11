import React from 'react';
// import {IAssetTransferObject, TransferAssetBridge} from "@axelar-network/axelarjs-sdk";

import './App.css';
import {AddTodo} from "./component/ignored-files/AddTodo";
import {TodoList} from "./component/ignored-files/TodoList";

// const axelarBridgeFacade = new TransferAssetBridge("http://localhost:4000");

const App = () => {


	// const message: IAssetTransferObject = {
	// 	sourceTokenSymbol: "BTC",
	// 	destinationTokenSymbol: "ETH",
	// 	destinationAddress: "TBD"
	// }

	// const onClick = async () => {
	//
	// 	const res = await axelarBridgeFacade.transferAssets(message, console.log);
	// 	console.log("results",res);
	// }

	return (
		<div>
			<AddTodo />
			<TodoList />
		</div>
	);

	// return (
	// 	<div className="App">
	// 		<header className="App-header">
	// 		<img src={logo} className="App-logo" alt="logo" />
	// 		<p>
	// 			Edit <code>src/App.tsx</code> and save to reload.
	// 		</p>
	// 		<div onClick={onClick}>Click me!</div>
	// 		<a
	// 			className="App-link"
	// 			href="https://reactjs.org"
	// 			target="_blank"
	// 			rel="noopener noreferrer"
	// 		>
	// 			Learn React
	// 		</a>
	// 		</header>
	// 	</div>
  // );
}

export default App;
