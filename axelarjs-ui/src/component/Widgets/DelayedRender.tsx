import {ReactElement, useEffect, useState} from 'react';

interface IDelayedRenderProps {
	prevChild: ReactElement;
	newChild: ReactElement;
	delayBeforeNewChild: number; //milliseconds
}

const DelayedRender = ({prevChild, newChild, delayBeforeNewChild}: IDelayedRenderProps) => {
	const [showNewChild, setShowNewChild] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setShowNewChild(true);
		}, delayBeforeNewChild);
	}, [delayBeforeNewChild]);

	return showNewChild ? newChild : prevChild;
};

export default DelayedRender;