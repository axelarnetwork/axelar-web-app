import {Input}                            from "../StyleComponents/Input";
import {HTMLInputTypeAttribute, useState} from "react";

interface IInputProps {
	name: string;
	placeholder: string;
	type: ((HTMLInputTypeAttribute | undefined) & "text") | undefined;
	onChange: (e: any) => void;
	
}
export const InputForm = (props: IInputProps) => {

	const [stateValue, setStateValue] = useState("");
	const handleChange = (event: any) => {
		setStateValue(event.target.value);
		props.onChange && props.onChange(event);
	};

	return <Input
		name={props.name}
		placeholder={props.placeholder}
		type={props.type}
		value={stateValue || ""}
		onChange={handleChange}
	/>;

};