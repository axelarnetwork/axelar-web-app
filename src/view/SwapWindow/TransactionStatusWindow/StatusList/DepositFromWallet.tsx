import React, {useEffect, useState}              from "react";
import styled                                    from "styled-components";
import {AssetInfo}                               from "@axelar-network/axelarjs-sdk";
import {useRecoilValue}                          from "recoil";
import {FlexRow}                                 from "component/StyleComponents/FlexRow";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY} from "config/consts";
import {MetamaskTransferEvent, MetaMaskWallet}   from "hooks/wallet/MetaMaskWallet";
import {ChainSelection, SourceAsset}             from "state/ChainSelection";
import {SourceDepositAddress}                    from "state/TransactionStatus";
import {InputForm}                               from "component/CompositeComponents/InputForm";
import {StyledButton}                            from "component/StyleComponents/StyledButton";
import {getMinDepositAmount}                     from "utils/getMinDepositAmount";
import {KeplrWallet}                             from "../../../../hooks/wallet/KeplrWallet";
import downstreamServices                        from "../../../../config/downstreamServices";
import Link                                      from "../../../../component/Widgets/Link";

const TopFlowsToggle = styled(FlexRow)`
	cursor: pointer;
`;
const TransferButton = styled(StyledButton)`
	color: ${props => props.dim ? "#565656" : "white"};
	cursor: ${props => props.dim ? "not-allowed" : "pointer"};
`;

export const DepositFromWallet = () => {
	const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destChainSelection = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const selectedSourceAsset = useRecoilValue(SourceAsset);
	const [isWalletConnected, setIsWalletConnected] = useState(false);
	const [amountToDeposit, setAmountToDeposit] = useState(null);
	const depositAddress = useRecoilValue(SourceDepositAddress);
	const [minDepositAmt] = useState(getMinDepositAmount(selectedSourceAsset, destChainSelection) || 0);
	const [buttonText, setButtonText] = useState("Send Deposit");
	const [sentSuccess, setSentSuccess] = useState(false);
	const [numConfirmations, setNumConfirmations] = useState(0);
	const [walletBalance, setWalletBalance] = useState(0);
	const [hasEnoughInWalletForMin, setHasEnoughInWalletForMin] = useState(true);
	const [txHash, setTxHash] = useState("");

	useEffect(() => {
		(async function () {
			if (sourceChainSelection?.module === "evm") {
				let wallet: MetaMaskWallet = new MetaMaskWallet(sourceChainSelection?.chainName.toLowerCase() as string);
				const isWalletInstalled: boolean = wallet.isWalletInstalled() as boolean;
				setIsWalletConnected(isWalletInstalled);
				if (!isWalletInstalled)
					return;
				await wallet.connectToWallet();
				const tokenAddress: string = await wallet.getOrFetchTokenAddress(selectedSourceAsset as AssetInfo);
				const balance = await wallet.getBalance(tokenAddress);
				setWalletBalance(balance)
				if (balance < minDepositAmt)
					setHasEnoughInWalletForMin(false);
			} else {
				let wallet: KeplrWallet = new KeplrWallet(sourceChainSelection?.chainName.toLowerCase() as "axelar" | "terra");
				const isWalletInstalled: boolean = wallet.isWalletInstalled() as boolean;
				setIsWalletConnected(isWalletInstalled);
				if (!isWalletInstalled)
					return;
				await wallet.connectToWallet();
				const balance: number = (await wallet.getBalance(selectedSourceAsset?.common_key as string));
				setWalletBalance(balance);
				if (balance < minDepositAmt)
					setHasEnoughInWalletForMin(false);
			}
		})()
	}, [minDepositAmt, sourceChainSelection, selectedSourceAsset]);

	const connectToWallet = async () => {
		let wallet: MetaMaskWallet = new MetaMaskWallet(sourceChainSelection?.chainName.toLowerCase() as string);
		await wallet.connectToWallet();
	}
	const transferMetamask = async () => {
		let wallet: MetaMaskWallet = new MetaMaskWallet(sourceChainSelection?.chainName.toLowerCase() as string);
		await wallet.connectToWallet();
		await wallet.switchChain(sourceChainSelection?.chainName.toLowerCase() as string);
		const tokenAddress: string = await wallet.getOrFetchTokenAddress(selectedSourceAsset as AssetInfo);
		setButtonText("Sending...");
		const results: MetamaskTransferEvent = await wallet.transferTokens(
			depositAddress?.assetAddress as string,
			(amountToDeposit || 0).toString(),
			selectedSourceAsset as AssetInfo
		);
		if (results.txHash && results.blockNumber) {
			setSentSuccess(true);
			setTxHash(results.txHash);
			wallet.confirmEtherTransaction(results.txHash, sourceChainSelection?.confirmLevel as number, ({numConfirmations}: any) => {
				setNumConfirmations(numConfirmations)
			});
		} else if (results.error.length > 0)
			setButtonText("Something went wrong");
		console.log("token address on", sourceChainSelection?.chainName, tokenAddress, results);
	}
	const transferKeplr = async () => {
		let wallet: KeplrWallet = new KeplrWallet("axelar");
		await wallet.connectToWallet();
		await wallet.switchChain("axelar-testnet-lisbon");
		setButtonText("Sending...");
		const results = await wallet.transferTokens(
			depositAddress?.assetAddress as string,
			(amountToDeposit || 0).toString()
		);
		// if (results.txHash && results.blockNumber) {
		// 	setSentSuccess(true);
		// 	wallet.confirmEtherTransaction(results.txHash, 35, ({numConfirmations}: any) => console.log("numConfirmations:", numConfirmations));
		// } else if (results.error.length > 0)
		// 	setButtonText("Something went wrong");
		console.log("results", results);
	}

	const transfer = async () => {
		return sourceChainSelection?.module === "evm"
			? await transferMetamask()
			: await transferKeplr()
	}

	const LinkToExplorer = () => {
		const blockExplorer: { name: string, url: string } = downstreamServices.blockExplorers[process.env.REACT_APP_STAGE as string]
			&& downstreamServices.blockExplorers[process.env.REACT_APP_STAGE as string][sourceChainSelection?.chainName?.toLowerCase() as string];

		return txHash && blockExplorer
			? <span>
				See it{" "}
				<Link href={`${blockExplorer.url}${txHash}`}>here</Link>
				{" "} on {blockExplorer.name}.
				<br/><br/>
			</span>
			: null;
	}

	if (sentSuccess)
		return <>
			<div>
				{`Sent! `}
				{sourceChainSelection?.module === "evm" && <LinkToExplorer />}
			</div>
			<div>{`Waiting on (${numConfirmations}/${sourceChainSelection?.confirmLevel}) required confirmations before forwarding to Axelar...`}</div>
		</>



	return <div style={{width: `95%`}}>{isWalletConnected
		? <div><br/>
			<FlexRow>
				<InputForm
					name={"destination-address-input"}
					value={amountToDeposit || ""}
					placeholder={"Enter amount to deposit"}
					type={"number"}
					onChange={(e: any) => setAmountToDeposit(e.target.value)}
				/>
				<div style={{marginLeft: `0.5em`}}>{selectedSourceAsset?.assetSymbol}</div>
			</FlexRow>
			<div>Balance: {walletBalance}{" "}{selectedSourceAsset?.assetSymbol}</div>
			{!hasEnoughInWalletForMin && <div>Not enough money in this account</div>}
			<br/><br/>
			<TransferButton
				dim={!amountToDeposit || (amountToDeposit < minDepositAmt) || !hasEnoughInWalletForMin}
				disabled={!amountToDeposit || (amountToDeposit < minDepositAmt) || !hasEnoughInWalletForMin}
				onClick={transfer}
			>
				{buttonText}
			</TransferButton>
		</div>
		: <TopFlowsToggle onClick={() => connectToWallet()}>
			<img src={require(`resources/active-eye-blue.svg`).default} alt={""} width={`12px`} height={`12px`}/>
			<div style={{marginLeft: `5px`, fontSize: `1em`}}>Connect Metamask</div>
		</TopFlowsToggle>
	}</div>
}