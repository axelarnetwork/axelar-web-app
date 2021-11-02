import {ReactElement}                    from "react";
import {CSSTransition, SwitchTransition} from "react-transition-group";
import UserInputWindow                   from "./UserInputWindow";
import usePostTransactionToBridge        from "hooks/usePostTransactionToBridge";
import TransactionStatusWindow           from "./TransactionStatusWindow";

const SwapWindow = (): ReactElement => {

	const [
		showTransactionStatusWindow,
		handleTransactionSubmission,
		closeResultsScreen
	] = usePostTransactionToBridge();

	const userInputNeeded = !showTransactionStatusWindow;

	return <SwitchTransition mode={"out-in"}>
		<CSSTransition
			key={userInputNeeded ? "user-input-window" : "transaction-status-window"}
			addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
			classNames="fade"
		>
			<div style={{maxWidth: `600px`, overflow: `hidden`}}>
				{userInputNeeded
					? <UserInputWindow handleSwapSubmit={handleTransactionSubmission}/>
					: <TransactionStatusWindow isOpen={showTransactionStatusWindow}
					                           closeResultsScreen={closeResultsScreen}/>}
			</div>
		</CSSTransition>
	</SwitchTransition>;

}

export default SwapWindow;