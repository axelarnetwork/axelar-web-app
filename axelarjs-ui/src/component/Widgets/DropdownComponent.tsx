import {Dropdown} from "react-bootstrap";
import {useState} from "react";

export interface IDropdownOption {
	title: string;
	active: boolean;
	disabled: boolean;
	action: (param: IDropdownOption) => void;
}

interface IDropdownComponent {
	id: string;
	conditionToDisableItem: (dropdownOption: IDropdownOption) => boolean;
	dropdownOptions: IDropdownOption[];
}

const DropdownComponent = (props: IDropdownComponent) => {
	const [selectedOption, setSelectedOption] = useState<IDropdownOption>();
	const {conditionToDisableItem, dropdownOptions, id} = props;
	return <Dropdown>

		<Dropdown.Toggle id={id} variant="secondary">
			{selectedOption?.title || "Select a chain..."}
		</Dropdown.Toggle>

		<Dropdown.Menu variant="dark">{
			dropdownOptions.map((dropdownOption: IDropdownOption) => {
				const shouldDisable = conditionToDisableItem(dropdownOption);
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