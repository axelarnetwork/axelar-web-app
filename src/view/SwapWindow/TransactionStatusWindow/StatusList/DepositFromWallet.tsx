import React, {useState}                         from "react";
import styled                                    from "styled-components";
import {AssetInfo}                               from "@axelar-network/axelarjs-sdk";
import {useRecoilValue}                          from "recoil";
import downstreamServices                        from "config/downstreamServices";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY} from "config/consts";
import {InputForm}                               from "component/CompositeComponents/InputForm";
import {StyledButton}                            from "component/StyleComponents/StyledButton";
import {FlexRow}                                 from "component/StyleComponents/FlexRow";
import Link                                      from "component/Widgets/Link";
import {KeplrWallet}                             from "hooks/wallet/KeplrWallet";
import {MetamaskTransferEvent, MetaMaskWallet}   from "hooks/wallet/MetaMaskWallet";
import {ChainSelection, SourceAsset}             from "state/ChainSelection";
import {SourceDepositAddress}                    from "state/TransactionStatus";
import {getMinDepositAmount}                     from "utils/getMinDepositAmount";

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
	const [buttonText, setButtonText] = useState(sourceChainSelection?.chainName.toLowerCase() === "terra" ? "Deposit via IBC Transfer" : "Send Deposit");
	const [sentSuccess, setSentSuccess] = useState(false);
	const [numConfirmations, setNumConfirmations] = useState(0);
	const [walletBalance, setWalletBalance] = useState(0);
	const [hasEnoughInWalletForMin, setHasEnoughInWalletForMin] = useState(true);
	const [txHash, setTxHash] = useState("");

	const connectToWallet = async () => {
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
		const sourceChainName: "axelar" | "terra" = sourceChainSelection?.chainName.toLowerCase() as "axelar" | "terra";
		let wallet: KeplrWallet = new KeplrWallet(sourceChainName);
		await wallet.connectToWallet();
		setButtonText("Sending...");

		let results;
		if (sourceChainName === "axelar") {
			results = await wallet.transferTokens(
				depositAddress?.assetAddress as string,
				(amountToDeposit || 0).toString()
			);
		} else {
			results = await wallet.ibcTransferFromTerra(
				depositAddress?.assetAddress as string,
				{
					amount: ((amountToDeposit || 0) * 1000000).toString(),
					denom: selectedSourceAsset?.common_key?.toString() as string
				}
			)
		}
		console.log("results from IBC", results);
		if (results && results.transactionHash && results.height) {
			setSentSuccess(true);
			setTxHash(results.transactionHash);
		} else
			setButtonText("Something went wrong, try again?");

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
		return <><br/>
			<div>
				{`Deposit detected! `}
				<LinkToExplorer/>
			</div>
			{sourceChainSelection?.module === "evm"
				? <div>{(numConfirmations >= (sourceChainSelection?.confirmLevel as number)
						? `Received (${sourceChainSelection?.confirmLevel}/${sourceChainSelection?.confirmLevel}) confirmations. Sending to Axelar to confirm.`
						: `Waiting on (${numConfirmations}/${sourceChainSelection?.confirmLevel}) required confirmations before forwarding to Axelar...`
					)}</div>
				: `Sending to Axelar to confirm.`
			}
		</>


	return <div style={{width: `95%`}}><br/>{isWalletConnected
		? <div>
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
		: <TransferButton
			onClick={connectToWallet}>Connect {sourceChainSelection?.module === "evm" ? "Metamask" : "Keplr"} Wallet</TransferButton>
	}</div>
}