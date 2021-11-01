import {Dropdown}        from "react-bootstrap";
import React, {useState} from "react";
import {SVGImage}        from "./SVGImage";

export interface IDropdownOption {
	title: string;
	active: boolean;
	disabled: boolean;
	action: (param: IDropdownOption) => void;
}

interface IDropdownComponent {
	id: string;
	dropdownOptions: IDropdownOption[];
}

const DropdownComponent = (props: IDropdownComponent) => {
	const [selectedOption, setSelectedOption] = useState<IDropdownOption>();
	const {dropdownOptions, id} = props;
	return <Dropdown>

		<Dropdown.Toggle id={id}>
			<SVGImage
				src={require(`assets/chevron-down-black.svg`)?.default}
				height={"8px"}
				width={"20px"}
			/>
		</Dropdown.Toggle>
		<Dropdown.Menu variant="dark">{
			dropdownOptions.map((dropdownOption: IDropdownOption) => {
				return <Dropdown.Item
					key={"dropdown-item" + id + dropdownOption.title}
					disabled={dropdownOption.disabled}
					onClick={() => {
						dropdownOption.action(dropdownOption);
						setSelectedOption(dropdownOption);
					}}
					active={dropdownOption.active}
				>
					{dropdownOption.title}
				</Dropdown.Item>
			})
		} </Dropdown.Menu>
	</Dropdown>;
}

export default DropdownComponent;