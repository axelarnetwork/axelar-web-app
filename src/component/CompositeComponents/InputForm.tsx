import {HTMLInputTypeAttribute} from "react";
import {StyledInput}            from "component/StyleComponents/StyledInput";

interface IInputProps {
	name: string;
	placeholder: string;
	type: ((HTMLInputTypeAttribute | undefined) & "text") | undefined;
	onChange: (e: any) => void;
	value: string;
	handleOnEnterPress?: any;
}

export const InputForm = (props: IInputProps) => {

	const handleChange = (event: any) => {
		props.onChange && props.onChange(event);
	};

	return <StyledInput
		name={props.name}
		placeholder={props.placeholder}
		type={props.type}
		value={props.value || ""}
		onChange={handleChange}
		onKeyDown={props.handleOnEnterPress}
	/>;

};