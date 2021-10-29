import {useEffect}          from "react";
import PageFooter           from "component/CompositeComponents/PageFooter";
import PageHeader           from "component/CompositeComponents/PageHeader";
import useLoadRecaptcha     from "hooks/auth/useLoadRecaptcha";
import {StyledAppContainer} from "view/App/styles/StyledAppContainer";
import {StyledAppBody}      from "view/App/styles/StyledAppBody";
import SwapWindow           from "view/SwapWindow";

const App = () => {

	const [isRecaptchaSet, initiateRecaptcha] = useLoadRecaptcha();

	useEffect(() => {
		if (!isRecaptchaSet)
			initiateRecaptcha();
	}, [isRecaptchaSet, initiateRecaptcha])

	return (
		<StyledAppContainer>
			<PageHeader/>
			{isRecaptchaSet
				? <StyledAppBody>
					<SwapWindow/>
				</StyledAppBody>
				: null
			}
			<PageFooter />
		</StyledAppContainer>
	);
}

export default App;
