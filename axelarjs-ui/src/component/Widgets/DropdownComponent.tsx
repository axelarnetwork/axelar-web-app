import React, {useState} from "react";
import {Dropdown}        from "react-bootstrap";
import {SVGImage}        from "./SVGImage";
import styled            from "styled-components";

export interface IDropdownOption {
	title: string;
	symbol: string;
	active: boolean;
	disabled: boolean;
	action: (param: IDropdownOption) => void;
}

interface IDropdownComponent {
	id: string;
	dropdownOptions: IDropdownOption[];
}

const CustomToggle = React.forwardRef(({ children, onClick }: any, ref) => (
	<a
		href=""
		ref={ref as any}
		onClick={(e) => {
			e.preventDefault();
			onClick(e);
		}}
	>
		{children}
	</a>
));

const CustomMenu = React.forwardRef(
	({ children, style, className, 'aria-labelledby': labeledBy }: any, ref) => {
		const [value, setValue] = useState('');

		return (<div
			ref={ref as any}
			style={style}
			className={className}
			aria-labelledby={labeledBy}
		>
			{children}
		</div>);
	},
);

const StyledCustomMenu = styled(CustomMenu)`
    min-width: initial;
    transform: translate3d(10px, 10px, 0px) !important;
    z-index: 10;
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.16), inset 0 0 3px 1px rgba(0, 0, 0, 0.21);
    border: solid 1px #e2e1e2;
    background-color: #fff;
`;

const StyledDropdownItem = styled(Dropdown.Item)`
    padding: 10px !important;
`;

const DropdownComponent = (props: IDropdownComponent) => {
	const [selectedOption, setSelectedOption] = useState<IDropdownOption>();
	const {dropdownOptions, id} = props;
	return <Dropdown>
		<Dropdown.Toggle as={CustomToggle} id={id}>
			<SVGImage
				src={require(`assets/chevron-down-black.svg`)?.default}
				height={"8px"}
				width={"20px"}
			/>
		</Dropdown.Toggle>
		<Dropdown.Menu as={StyledCustomMenu}>{
			dropdownOptions.map((dropdownOption: IDropdownOption) => {
				return <StyledDropdownItem
					key={"dropdown-item" + id + dropdownOption.title}
					disabled={dropdownOption.disabled}
					onClick={() => {
						dropdownOption.action(dropdownOption);
						setSelectedOption(dropdownOption);
					}}
					active={dropdownOption.active}
				>
					<SVGImage height={"20px"} width={"20px"}
					          src={require(`assets/logos/${dropdownOption.symbol}.svg`)?.default} />
					<span style={{ marginLeft: `10px` }}>{dropdownOption.title}</span>
				</StyledDropdownItem>
			})
		} </Dropdown.Menu>
	</Dropdown>;
}

export default DropdownComponent;