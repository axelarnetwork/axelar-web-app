import Joyride, {ACTIONS, CallBackProps, EVENTS, STATUS, Step} from 'react-joyride';
import {useState}                                              from "react";
import {useSetRecoilState}                                     from "recoil";
import {ShowTransactionStatusWindow}                           from "state/ApplicationStatus";
import {ActiveStep}                                            from "state/TransactionStatus";
import {BreakIndex, WalkthroughSteps}                          from "./WalkthroughSteps";
import {styles}                                                from "./styles";

const WalkThrough = () => {

	const setShowTransactionStatusWindow = useSetRecoilState(ShowTransactionStatusWindow);
	const setActiveStepOnTxStatusWindow = useSetRecoilState(ActiveStep);
	const [shouldRun, setShouldRun] = useState(true);
	const [currStepIndex, setCurrStepIndex] = useState(0);
	const [breakIndex] = useState(BreakIndex);
	const [steps] = useState<Step[]>(WalkthroughSteps);

	const handleJoyrideCallback = (data: CallBackProps) => {

		const {action, index, size, status, type} = data;

		if (([STATUS.FINISHED] as string[]).includes(status) && index + 1 === size) {
			setShouldRun(false);
			setShowTransactionStatusWindow(false);
			setActiveStepOnTxStatusWindow(0);
			setCurrStepIndex(0);
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
				/*for the "blue" active buttons on TransactionStatusWindow;
				there are only four steps in our flow process,
				so anything greater would cause an out-of-bounds exception
				* */
				setActiveStepOnTxStatusWindow(Math.min(currStepIndex - breakIndex, 4));
		}

		if (["close", "skip"].includes(data.action)) {
			setShouldRun(false);
			setShowTransactionStatusWindow(false);
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
		hideBackButton={currStepIndex === breakIndex + 1}
		styles={{options: styles}}
	/>;
}

export default WalkThrough;