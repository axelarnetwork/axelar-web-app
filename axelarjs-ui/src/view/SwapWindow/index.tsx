import React, {ReactElement}      from "react";
import {StyledSwapWindow}         from "view/SwapWindow/styles/StyledSwapWIndow";
import UserInputWindow            from "./UserInputWindow";
import usePostTransactionToBridge from "hooks/usePostTransactionToBridge";
import TransactionStatusWindow from "./TransactionStatusWindow";

const SwapWindow = (): ReactElement => {

	const [
		showTransactionStatusWindow,
		handleTransactionSubmission,
		closeResultsScreen
	] = usePostTransactionToBridge();

	const userInputNeeded = !showTransactionStatusWindow;

	return <StyledSwapWindow>
		{userInputNeeded
			? <UserInputWindow handleSwapSubmit={handleTransactionSubmission}/>
			: <TransactionStatusWindow isOpen={showTransactionStatusWindow} closeResultsScreen={closeResultsScreen}/>
		}
	</StyledSwapWindow>;

}

export default SwapWindow;