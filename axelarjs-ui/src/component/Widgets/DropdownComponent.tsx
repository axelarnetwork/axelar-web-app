import {forwardRef} from "react";
import {Dropdown}   from "react-bootstrap";
import {SVGImage}   from "./SVGImage";
import styled       from "styled-components";

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

const CustomToggle = forwardRef(({children, onClick}: any, ref) => (
	<a
		href="/"
		ref={ref as any}
		onClick={(e) => {
			e.preventDefault();
			onClick(e);
		}}
	>
		{children}
	</a>
));

const CustomMenu = forwardRef(
	({children, style, className, 'aria-labelledby': labeledBy}: any, ref) => {
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
	// const [selectedOption, setSelectedOption] = useState<IDropdownOption>();
	const {dropdownOptions, id} = props;
	return <Dropdown>
		<Dropdown.Toggle as={CustomToggle} id={id}>
			<SVGImage
				src={require(`resources/chevron-down-black.svg`)?.default}
				height={"8px"}
				width={"20px"}
			/>
		</Dropdown.Toggle>
		{/*TODO: Note: there is a bug in Dropdown.Menu where adding zero margins is needed for now*/}
		<Dropdown.Menu style={{margin: 0, overflowY: `auto`, maxHeight: `200px`}} as={StyledCustomMenu}>{
			dropdownOptions.map((dropdownOption: IDropdownOption) => {
				let image;
				try {
					image = require(`resources/logos/${dropdownOption.symbol}/${dropdownOption.symbol}.svg`)?.default;
				} catch (e) {
					image = require(`resources/select-chain-icon-black.svg`)?.default;
				}
				return <StyledDropdownItem
					key={"dropdown-item" + id + dropdownOption.title}
					disabled={dropdownOption.disabled}
					onClick={() => {
						dropdownOption.action(dropdownOption);
					}}
					active={dropdownOption.active}
				>
					<SVGImage height={"20px"} width={"20px"}
					          src={image}/>
					<span style={{marginLeft: `10px`}}>{dropdownOption.title}</span>
				</StyledDropdownItem>
			})
		} </Dropdown.Menu>
	</Dropdown>;
}

export default DropdownComponent;