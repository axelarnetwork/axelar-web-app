import PageHeader           from "component/CompositeComponents/PageHeader";
import SwapWindow           from "view/SwapWindow";
import {StyledAppContainer} from "view/App/styles/StyledAppContainer";
import {StyledAppBody}      from "view/App/styles/StyledAppBody";
import useLoadRecaptcha     from "hooks/auth/useLoadRecaptcha";

const App = () => {

	useLoadRecaptcha();

	return (
		<StyledAppContainer>
			<PageHeader/>
			<StyledAppBody>
				<SwapWindow/>
			</StyledAppBody>
		</StyledAppContainer>
	);
}

export default App;
