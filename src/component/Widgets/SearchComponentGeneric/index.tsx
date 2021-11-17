import styled, {ThemedStyledProps}         from "styled-components";
import {IAssetInfo}                        from "@axelar-network/axelarjs-sdk";
import {FlexSpaceBetween}                  from "component/StyleComponents/FlexSpaceBetween";
import {GridDisplay}                       from "component/StyleComponents/GridDisplay";
import {SVGImage}                          from "component/Widgets/SVGImage";
import SearchFilterText                    from "component/Widgets/SearchComponentGeneric/SearchFilterText";

interface IStyledSearchComponentProps extends ThemedStyledProps<any, any> {
	show: boolean;
}

const StyledSearchComponent = styled(GridDisplay)<IStyledSearchComponentProps>`
	// padding: ${props => props.show ? '5px' : '0px'};
	box-sizing: border-box;
	width: 100%;
	visibility: ${props => props.show ? 'visible' : 'hidden'};
	height: ${props => props.show ? '150px' : '0px'};
	transition: all 200ms;
    display: flex;
    flex-direction: column;
`;

const StyledBox = styled.div`
	width: 100%;
	height: 100%;
	overflow-y: auto;
	position: relative;
`;
export interface ISearchItem {
	title: string;
	symbol: string;
	active: boolean;
	disabled: boolean;
	icon: any;
	onClick: () => void;
}
interface ISearchMenuProps {
	show: boolean;
	items: ISearchItem[];
	handleClose?: () => void;
}

const SearchMenu = (props: ISearchMenuProps) => {

	return (<StyledSearchComponent show={props.show}>
		{props.show && <>
            <SearchFilterText
                initialAssetList={[]}
                callback={(data: IAssetInfo[]) => console.log(data)}
                show={props.show}
            />
            <StyledBox>
				{props.items.map((item: ISearchItem) => (<SearchOption
						key={item.title}
						title={item.title}
						icon={item.icon}
						onClick={() => {
							item.onClick();
							props.handleClose && props.handleClose();
						}}
					/>
				))}
            </StyledBox>
        </>}
	</StyledSearchComponent>);
};

interface IAssetOption {
	title: string;
	icon: any;
	onClick: any;
}

const StyledSearchItem = styled(FlexSpaceBetween)`
	cursor: pointer;
	box-sizing: border-box;
	width: 100%;
	padding: 10px 15px 10px 15px;
	box-sizing: border-box;
	border-top: solid 1px #e2e1e2;
	color: darkgrey;
	letter-spacing: 0.78px;
	font-weight: bold;
	&:hover {
		color: black;
	}
	transition: color 500ms;
`;

const SearchOption = (props: IAssetOption) => {
	let icon;
	try {
		icon = props.icon;
	} catch (e) {
		icon = require(`resources/select-chain-icon-black.svg`)?.default;
	}
	return <StyledSearchItem onClick={() => props.onClick(props.title)}>
		<SVGImage height={"25px"} width={"25px"} src={icon}/>
		<div style={{ width: `85%` }}>{props.title}</div>
	</StyledSearchItem>;
}

export default SearchMenu;