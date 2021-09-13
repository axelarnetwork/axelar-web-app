import React from 'react';
import {IAssetTransferObject, TransferAssetBridge} from "@axelar-network/axelarjs-sdk";

import styled from "styled-components";
import Container from "component/Container";
import PageHeader from "component/PageHeader";

const axelarBridgeFacade = new TransferAssetBridge("http://localhost:4000");

const StyledContainer = styled(Container)`
	background-color: #282c34;
	font-size: calc(10px + 2vmin);
  	width: 100vw;
  	height: 100vh;
`;

const Header = styled.header`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: white;
`;

const StyledLink = styled.a`
	color: #61dafb;
`;

const StyledApp = styled.div`
	text-align: center;
`;

const App = () => {

	const message: IAssetTransferObject = {
		sourceTokenSymbol: "BTC",
		destinationTokenSymbol: "ETH",
		destinationAddress: "TBD"
	}

	const onClick = async () => {

		const res = await axelarBridgeFacade.transferAssets(message, console.log);
		console.log("results",res);
	}

	return (
		<StyledContainer>
			<PageHeader />
			<StyledApp>
				<Header>
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<div onClick={onClick}>Click me!</div>
				<StyledLink
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</StyledLink>
				</Header>
			</StyledApp>
		</StyledContainer>
  );
}

export default App;
