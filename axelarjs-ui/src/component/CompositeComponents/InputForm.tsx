import {HTMLInputTypeAttribute} from "react";
import {Input}                  from "component/StyleComponents/Input";

interface IInputProps {
	name: string;
	placeholder: string;
	type: ((HTMLInputTypeAttribute | undefined) & "text") | undefined;
	onChange: (e: any) => void;
	value: string;

}

export const InputForm = (props: IInputProps) => {

	const handleChange = (event: any) => {
		props.onChange && props.onChange(event);
	};

	return <Input
		name={props.name}
		placeholder={props.placeholder}
		type={props.type}
		value={props.value || ""}
		onChange={handleChange}
	/>;

};