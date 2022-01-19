import {useEffect}                                              from "react";
import {useRecoilValue}                                         from "recoil";
import InfoWidget                                               from "component/CompositeComponents/InfoWidget";
import PageHeader                                               from "component/CompositeComponents/PageHeader";
import PageFooter                                               from "component/CompositeComponents/PageFooter";
import WalkThrough                                              from "component/CompositeComponents/Walkthrough";
import {DESTINATION_TOKEN_KEY, SOURCE_TOKEN_KEY}                from "config/consts";
import useLoadRecaptcha                                         from "hooks/auth/useLoadRecaptcha";
import {ChainSelection, IsValidDestinationAddress, SourceAsset} from "state/ChainSelection";
import {StyledAppContainer}                                     from "view/App/styles/StyledAppContainer";
import SwapWindow                                               from "view/SwapWindow";
import Disclaimer                                               from "../Disclaimer";
import {ShowDisclaimer}                                         from "../../state/ApplicationStatus";

const App = () => {

	const [isRecaptchaSet, initiateRecaptcha] = useLoadRecaptcha();
	const sourceChainSelection = useRecoilValue(ChainSelection(SOURCE_TOKEN_KEY));
	const destChainSelection = useRecoilValue(ChainSelection(DESTINATION_TOKEN_KEY));
	const selectedSourceAsset = useRecoilValue(SourceAsset);
	const isValidDestinationAddr = useRecoilValue(IsValidDestinationAddress);
	const showDisclaimer = useRecoilValue(ShowDisclaimer);

	const canLightUp = sourceChainSelection && destChainSelection
		&& sourceChainSelection.chainName !== destChainSelection.chainName
		&& selectedSourceAsset
		&& isValidDestinationAddr;

	useEffect(() => {
		if (!isRecaptchaSet)
			initiateRecaptcha();
	}, [isRecaptchaSet, initiateRecaptcha])

	console.log("can light up???", canLightUp);
	return (
		<StyledAppContainer>
			{canLightUp && showDisclaimer && <Disclaimer/>}
			<WalkThrough/>
			<InfoWidget/>
			<PageHeader/>
			{isRecaptchaSet
				? <SwapWindow/>
				: null
			}
			<PageFooter/>
		</StyledAppContainer>
	);
}

export default App;
