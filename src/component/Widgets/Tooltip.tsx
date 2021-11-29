import styled                                from "styled-components";
import {cloneElement, useCallback, useState} from "react";

const AnchorText = styled.div`
  cursor: pointer;
`;

const TooltipText = styled.div`
	white-space: nowrap;
	bottom: 0;
	visibility: hidden;
	color: transparent;
	background-color: transparent;
	padding: 0.1em 0.1em;
	margin: 0.25em 0.25em;
	border-radius: 4px;
	text-align: center;
	transition: all 0.1s ease-in-out;
	&:before {
		content: "";
		width: 0;
		height: 0;
		transition: border 0.3s ease-in-out;
	}
`;
const TooltipContainer = styled.div`
	position: relative;
	& ${AnchorText}:hover + ${TooltipText} {
		visibility: visible;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
		&:before {
			border-color: transparent transparent rgba(0, 0, 0, 0.5) rgba(0, 0, 0, 0.5);
		}
	}
`;

interface ITooltip {
	anchorContent: JSX.Element | string;
	tooltipText: string;
	tooltipAltText: string;
}

const Tooltip = ({anchorContent, tooltipText, tooltipAltText}: ITooltip) => {

	const [textToShow, setTextToShow] = useState(tooltipText);

	const updateTextToShow = useCallback(() => {
		setTextToShow(tooltipAltText);
		setTimeout(() => setTextToShow(tooltipText), 2000);
	}, [setTextToShow, tooltipText, tooltipAltText]);

	return <TooltipContainer>
		<AnchorText>
			{cloneElement(anchorContent as JSX.Element, {cbOnClick: updateTextToShow})}
		</AnchorText>
		<TooltipText>
			{textToShow}
		</TooltipText>
	</TooltipContainer>;
};

export default Tooltip;