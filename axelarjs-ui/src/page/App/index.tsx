import React from 'react';
import PageHeader from "component/PageHeader";
import SwapWindow from "page/SwapWindow";
import {StyledAppContainer} from "./styles/StyledAppContainer";
import {StyledAppBody} from "./styles/StyledAppBody";

const App = () => {

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
