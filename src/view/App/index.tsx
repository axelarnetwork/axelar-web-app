import {useEffect}           from "react";
import {useRecoilValue}      from "recoil";
import InfoWidget            from "component/CompositeComponents/InfoWidget";
import PageHeader            from "component/CompositeComponents/PageHeader";
import PageFooter            from "component/CompositeComponents/PageFooter";
import WalkThrough           from "component/CompositeComponents/Walkthrough";
import useLoadRecaptcha      from "hooks/auth/useLoadRecaptcha";
import {ShowLargeDisclaimer} from "state/ApplicationStatus";
import {StyledAppContainer}  from "view/App/styles/StyledAppContainer";
import SwapWindow            from "view/SwapWindow";
import Disclaimer            from "../Disclaimer";

const App = () => {

	const [isRecaptchaSet, initiateRecaptcha] = useLoadRecaptcha();
	const showLargeDisclaimer = useRecoilValue(ShowLargeDisclaimer);

	useEffect(() => {
		if (!isRecaptchaSet)
			initiateRecaptcha();
	}, [isRecaptchaSet, initiateRecaptcha])

	return (
		<StyledAppContainer>
			{showLargeDisclaimer && <Disclaimer/>}
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
