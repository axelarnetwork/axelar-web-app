import {useEffect}          from "react";
import InfoWidget           from "component/CompositeComponents/InfoWidget";
import PageHeader           from "component/CompositeComponents/PageHeader";
import useLoadRecaptcha     from "hooks/auth/useLoadRecaptcha";
import {StyledAppContainer} from "view/App/styles/StyledAppContainer";
import SwapWindow           from "view/SwapWindow";

const App = () => {

	const [isRecaptchaSet, initiateRecaptcha] = useLoadRecaptcha();

	useEffect(() => {
		if (!isRecaptchaSet)
			initiateRecaptcha();
	}, [isRecaptchaSet, initiateRecaptcha])

	return (
		<StyledAppContainer>
			<InfoWidget/>
			<PageHeader/>
			{isRecaptchaSet
				? <SwapWindow/>
				: null
			}
			{/*<PageFooter/> let's disable this for now*/}
		</StyledAppContainer>
	);
}

export default App;
