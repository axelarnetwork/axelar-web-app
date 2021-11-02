import React, {useState}    from "react";
import {useSetRecoilState}  from "recoil";
import {DestinationAddress} from "state/ChainSelection";
import styled               from "styled-components";

const Input = styled.input.attrs({
	type: 'text',
})`
	width: 100%;
	height: 35px;
	border-radius: 5px;
	border: solid 1px #e2e1e2;
	padding: 0px 10px 0px 10px !important;
	box-sizing: border-box;
	font-size: 11px;
	&:focus {
		outline: none !important;
	}
`
export const InputForm = (props: any) => {

	const [controlledValue, updateControlledValue] = useState("");
	const setDestinationAddress = useSetRecoilState<string | null>(DestinationAddress);
	const handleChange = (event: any) => {
		updateControlledValue(event.target.value);
		setDestinationAddress(event.target.value);
	};

	return (<Input
		name="destination-address-input"
		placeholder="Enter Destination Address (Public Key)"
		type="text"
		value={controlledValue}
		onChange={handleChange}
	/>);
};