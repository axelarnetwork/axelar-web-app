import {useEffect, useState}                                      from "react";
import {useRecoilValue}                                           from "recoil";
import {AssetInfo}                                                from "@axelar-network/axelarjs-sdk";
import InfoWidget                                                 from "component/CompositeComponents/InfoWidget";
import PageHeader                                                 from "component/CompositeComponents/PageHeader";
import PageFooter                                                 from "component/CompositeComponents/PageFooter";
import WalkThrough                                                from "component/CompositeComponents/Walkthrough";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                  from "config/consts";
import useLoadRecaptcha                                           from "hooks/auth/useLoadRecaptcha";
import {ShowDisclaimer, ShowDisclaimerFromFAQ}                    from "state/ApplicationStatus";
import {ChainSelection, IsValidDestinationAddress, SourceAsset}   from "state/ChainSelection";
import {HasAlreadyConnectedWallet, KEPLR_WALLET, METAMASK_WALLET} from "state/Wallet";
import {StyledAppContainer}                                       from "view/App/styles/StyledAppContainer";
import SwapWindow                                                 from "view/SwapWindow";
import Disclaimer                                                 from "../Disclaimer";
import {Redirect}                                                 from "react-router-dom";
import {MetaMaskWallet}                                           from "hooks/wallet/MetaMaskWallet";
import {KeplrWallet}                                              from "hooks/wallet/KeplrWallet";

let metamaskWallet: MetaMaskWallet;
let keplrWallet: KeplrWallet;

export const getMetamaskWallet = () => {
	if (!metamaskWallet)
		metamaskWallet = new MetaMaskWallet();
	return metamaskWallet;
}
export const getKeplrWallet = () => {
	if (!keplrWallet)
		keplrWallet = new KeplrWallet("terra");
	return keplrWallet;
}

const App = () => {

	const [isRecaptchaSet, initiateRecaptcha] = useLoadRecaptcha();

	const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destChainSelection = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const selectedSourceAsset = useRecoilValue(SourceAsset);
	const isValidDestinationAddr = useRecoilValue(IsValidDestinationAddress);
	const showDisclaimer = useRecoilValue(ShowDisclaimer);
	const showDisclaimerForFAQ = useRecoilValue(ShowDisclaimerFromFAQ);
	const [underMaintenance] = useState(process.env.REACT_APP_UNDER_MAINTENANCE);
	const hasAlreadyConnectedMetamask = useRecoilValue(HasAlreadyConnectedWallet(METAMASK_WALLET));
	const hasAlreadyConnectedKeplr = useRecoilValue(HasAlreadyConnectedWallet(KEPLR_WALLET));

	const canLightUp = sourceChainSelection && destChainSelection
		&& sourceChainSelection.chainName !== destChainSelection.chainName
		&& selectedSourceAsset
		&& isValidDestinationAddr;


	useEffect(() => {
		if (!isRecaptchaSet)
			initiateRecaptcha();
	}, [isRecaptchaSet, initiateRecaptcha]);

	// useEffect(() => {
	// 	const listener = () => getMetamaskWallet().eventListeners(selectedSourceAsset);
	// 	hasAlreadyConnectedMetamask && getMetamaskWallet().establishAccountChangeListeners(listener)
	// 	return () => {
	// 		hasAlreadyConnectedMetamask && getMetamaskWallet().removeAccountChangeListeners(listener)
	// 		.then((result) => console.log("did metamask wallet destroy", result));
	// 	}
	// }, [hasAlreadyConnectedMetamask, selectedSourceAsset]);
	// useEffect(() => {
	// 	hasAlreadyConnectedKeplr && getKeplrWallet().establishAccountChangeListeners()
	// 	return () => {
	// 		hasAlreadyConnectedKeplr && getKeplrWallet().removeAccountChangeListeners()
	// 		.then((result) => console.log("did keplr wallet destroy", result));
	// 	}
	// }, [hasAlreadyConnectedKeplr]);

	if (underMaintenance === "true")
		return <Redirect to={"/landing"}/>;

	return (
		<StyledAppContainer>
			{(showDisclaimerForFAQ || canLightUp) && showDisclaimer && <Disclaimer/>}
			<WalkThrough/>
			<InfoWidget/>
			<PageHeader/>
			{isRecaptchaSet
				? <SwapWindow/>
				: null
			}
			<PageFooter/>
			<div style={{zIndex: 10000}} onClick={async () => {
				console.log("clicking");
				const connectMetamask = await getMetamaskWallet().connectToWallet();
				const connectKeplr = await getKeplrWallet().switchChain("terra");
				const asset: AssetInfo = {common_key: "uusd", assetSymbol: "UST"};
				const metamaskBalance = await getMetamaskWallet().getBalance(asset);
				const keplrBalance = await getKeplrWallet().getBalance(asset);
				console.log("connect and balance", connectMetamask, connectKeplr, metamaskBalance, keplrBalance, getMetamaskWallet(), getKeplrWallet());
			}}>Hello
			</div>
		</StyledAppContainer>
	);
}

export default App;
