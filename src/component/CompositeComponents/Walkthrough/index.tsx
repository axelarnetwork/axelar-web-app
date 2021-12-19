import Joyride, {ACTIONS, CallBackProps, EVENTS, STATUS, Step}               from 'react-joyride';
import React, {useState}                                                     from "react";
import {useRecoilState, useSetRecoilState}                                   from "recoil";
import useResetAllState                                                         from "hooks/useResetAllState";
import {MessageShownInCartoon, ShowTransactionStatusWindow, DismissWalkThrough} from "state/ApplicationStatus";
import {ActiveStep}                                                             from "state/TransactionStatus";
import {BreakIndex, WalkthroughSteps}                                        from "./WalkthroughSteps";
import {styles}                                                              from "./styles";
import InfoForWidget
                                                                             from "view/SwapWindow/TransactionStatusWindow/StatusList/InfoForWidget";

const WalkThrough = () => {

	const setShowTransactionStatusWindow = useSetRecoilState(ShowTransactionStatusWindow);
	const setActiveStepOnTxStatusWindow = useSetRecoilState(ActiveStep);
	const [cartoonMessage, setCartoonMessage] = useRecoilState(MessageShownInCartoon);
	const resetAllState = useResetAllState();
	const [currStepIndex, setCurrStepIndex] = useState(0);
	const [breakIndex] = useState(BreakIndex);
	const [steps] = useState<Step[]>(WalkthroughSteps);
	const [dismissed, setDismissed] = useRecoilState(DismissWalkThrough);
	const [shouldRun, setShouldRun] = useState(true && !dismissed);

	const closeOut = () => {
		setShouldRun(false);
		setShowTransactionStatusWindow(false);
		setCurrStepIndex(0);
		resetAllState();
	}

	const handleJoyrideCallback = (data: CallBackProps) => {

		const {action, index, size, status, type} = data;

		if (([STATUS.FINISHED] as string[]).includes(status) && index + 1 === size) {
			closeOut();
		} else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {

			const currStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
			setCurrStepIndex(currStepIndex);

			/*controlled transition between UserInputWindow
			and TransactionStatusWindow*/
			if (index === breakIndex) {

				setShouldRun(false);
				setShowTransactionStatusWindow(true);

				setTimeout(() => {
					setShouldRun(true);
					setCurrStepIndex(breakIndex + 1);
				}, 1000);

			} else if (index > breakIndex)

				if (!cartoonMessage) setCartoonMessage(<InfoForWidget/>);

			/*for the "blue" active buttons on TransactionStatusWindow;
			there are only four steps in our flow process,
			so anything greater would cause an out-of-bounds exception
			* */
			setActiveStepOnTxStatusWindow(Math.min(currStepIndex - breakIndex, 4));
		}

		if (["skip"].includes(data.action)) {
			closeOut();

			/*remember choice*/
			setDismissed(true);
		}
	}

	return <Joyride
		callback={handleJoyrideCallback}
		steps={steps}
		stepIndex={currStepIndex}
		continuous={true}
		scrollToFirstStep={true}
		showProgress={true}
		showSkipButton={true}
		run={shouldRun}
		hideBackButton={currStepIndex === breakIndex || currStepIndex === breakIndex + 1}
		styles={{options: styles}}
	/>;
}

export default WalkThrough;