import styled from "styled-components";

const TooltipText = styled.span`
  cursor: pointer;
`;

const TooltipBox = styled.span`
	visibility: hidden;
	color: transparent;
	background-color: transparent;
	padding: 5px 5px;
	border-radius: 4px;
	transition: all 0.1s ease-in-out;
	&:before {
		content: "";
		width: 0;
		height: 0;
		transition: border 0.3s ease-in-out;
	}
`;
const TooltipCard = styled.span`
	position: relative;
	& ${TooltipText}:hover + ${TooltipBox} {
		visibility: visible;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
		padding: 3px 2px;
		&:before {
			border-color: transparent transparent rgba(0, 0, 0, 0.5) rgba(0, 0, 0, 0.5);
		}
	}
`;

interface ITooltip {
	tooltipText: any;
	tooltipBox: any;
}

const Tooltip = ({tooltipBox, tooltipText}: ITooltip) => (<TooltipCard>
	<TooltipText>
		{tooltipText}
	</TooltipText>
	<TooltipBox>
		{tooltipBox}
	</TooltipBox>
</TooltipCard>);

export default Tooltip;