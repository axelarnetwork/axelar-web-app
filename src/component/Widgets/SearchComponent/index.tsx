import {KeyboardEvent, useEffect, useState} from "react";
import styled, {ThemedStyledProps}          from "styled-components";
import {FlexSpaceBetween}                   from "component/StyleComponents/FlexSpaceBetween";
import {GridDisplay}                        from "component/StyleComponents/GridDisplay";
import {SVGImage}                           from "component/Widgets/SVGImage";
import SearchFilterText                     from "component/Widgets/SearchComponent/SearchFilterText";
import screenConfigs                        from "config/screenConfigs";

interface IStyledSearchComponentProps extends ThemedStyledProps<any, any> {
	show: boolean;
}

const StyledSearchComponent = styled(GridDisplay)<IStyledSearchComponentProps>`
	box-sizing: border-box;
	width: 100%;
	visibility: ${props => props.show ? 'visible' : 'hidden'};
	transition: all 200ms;
    display: flex;
    flex-direction: column;
    
	@media ${screenConfigs.media.desktop} {
		height: ${props => props.show ? '245px' : '0px'};
		transition: none;
	}
	@media ${screenConfigs.media.laptop} {
		height: ${props => props.show ? '225px' : '0px'};
		transition: none;
	}
	@media ${screenConfigs.media.tablet} {
		height: ${props => props.show ? '150px' : '0px'};
	}
	@media ${screenConfigs.media.mobile} {
		height: ${props => props.show ? '150px' : '0px'};
	}	
`;

const StyledBox = styled.div`
	width: 100%;
	height: 100%;
	max-height: 100%;
	overflow-y: scroll !important;
	position: relative;

	::-webkit-scrollbar {
	  -webkit-appearance: none;
	  width: 10px;
	}
	
	::-webkit-scrollbar-thumb {
	  border-radius: 5px;
	  background-color: rgba(0,0,0,.5);
	  -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
	}
`;

export interface ISearchItem {
	title: string;
	symbol?: string;
	active: boolean;
	disabled: boolean;
	icon: any;
	onClick: () => void;
}

interface ISearchMenuProps {
	show: boolean;
	allItems: ISearchItem[];
	handleClose: () => void;
}

const SearchMenu = (props: ISearchMenuProps) => {

	const {handleClose, allItems, show} = props;
	const [listItems, setListItems] = useState<ISearchItem[]>([]);

	useEffect(() => {
		setListItems(allItems);
	}, [allItems]);

	const onClick = (item: ISearchItem) => {
		item.onClick();
		handleClose && handleClose();
		setListItems(allItems); //reset list items so that when menu is reopened, all options show again
	};

	const handleOnEnterPress = (e: KeyboardEvent<HTMLInputElement>) => {
		console.log("keypress in SearchComponent/index.tsx");
		e.stopPropagation();
		(e.code === "Enter" || e.code === "NumpadEnter")
		&& listItems?.length === 1
		&& !listItems[0].disabled
		&& onClick(listItems[0]);
	}

	return (<StyledSearchComponent show={show}>
		{show && <>
            <SearchFilterText
                unfilteredList={allItems}
                callback={(data: any[]) => setListItems(data)}
                show={props.show}
                handleOnEnterPress={handleOnEnterPress}
            />
            <StyledBox>
				{listItems.map((item: ISearchItem) => (<SearchOption
						key={item.title}
						title={item.title}
						icon={item.icon}
						disabled={item.disabled}
						onClick={(title: string) => !item.disabled && onClick(item)}
					/>
				))}
            </StyledBox>
        </>}
	</StyledSearchComponent>);
};

interface ISearchOption {
	title: string;
	disabled: boolean;
	icon: any;
	onClick: (title: string) => void;
}

interface IStyledSearchItemProps extends ThemedStyledProps<any, any> {
	disabled?: boolean;
}

const StyledSearchItem = styled(FlexSpaceBetween)<IStyledSearchItemProps>`
	${({disabled}) => disabled ? '' : 'cursor: pointer'};
	box-sizing: border-box;
	width: 100%;
	padding: 10px 15px 10px 15px;
	box-sizing: border-box;
	border-top: solid 1px #e2e1e2;
	color: darkgrey;
	letter-spacing: 0.78px;
	font-weight: bold;
	&:hover {
		color: ${({disabled}) => disabled ? 'darkgrey' : 'black'};
	}
	transition: color 500ms;
`;

const SearchOption = (props: ISearchOption) => {
	const {disabled, icon, onClick, title} = props;
	let imageSrc;
	try {
		imageSrc = icon;
	} catch (e) {
		imageSrc = require(`resources/select-chain-icon-black.svg`)?.default;
	}
	return <StyledSearchItem disabled={disabled} onClick={() => !disabled && onClick(title)}>
		<SVGImage height={"25px"} width={"25px"} src={imageSrc}/>
		<div style={{width: `85%`}}>{title}</div>
	</StyledSearchItem>;
}

export default SearchMenu;