import React, { useEffect, useState } from "react";

interface ExpireProps {
	delay: number;
	children: any;
}
const Expire = (props: ExpireProps) => {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setVisible(false);
		}, props.delay);
	}, [props.delay]);

	return visible ? <div>{props.children}</div> : <div />;
};

export default Expire;