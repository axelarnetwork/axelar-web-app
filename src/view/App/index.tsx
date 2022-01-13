import {useEffect}          from "react";
import {useRecoilValue}     from "recoil";
import InfoWidget           from "component/CompositeComponents/InfoWidget";
import PageHeader           from "component/CompositeComponents/PageHeader";
import PageFooter           from "component/CompositeComponents/PageFooter";
import WalkThrough          from "component/CompositeComponents/Walkthrough";
import useLoadRecaptcha     from "hooks/auth/useLoadRecaptcha";
import {DisclaimerAgreed}   from "state/ApplicationStatus";
import {StyledAppContainer} from "view/App/styles/StyledAppContainer";
import SwapWindow           from "view/SwapWindow";
import Disclaimer           from "../Disclaimer";
import PageFooter           from "../../component/CompositeComponents/PageFooter";

const App = () => {

	const [isRecaptchaSet, initiateRecaptcha] = useLoadRecaptcha();
	const disclaimerAgreed = useRecoilValue(DisclaimerAgreed);

	useEffect(() => {
		if (!isRecaptchaSet)
			initiateRecaptcha();
	}, [isRecaptchaSet, initiateRecaptcha])

	return (
		<StyledAppContainer>
			{!disclaimerAgreed && <Disclaimer/>}
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
