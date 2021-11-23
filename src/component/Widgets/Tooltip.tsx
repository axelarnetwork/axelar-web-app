import styled from "styled-components";

const TooltipText = styled.div`
  cursor: pointer;
`;

const TooltipBox = styled.div`
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
const TooltipCard = styled.div`
	position: relative;
	& ${TooltipText}:hover + ${TooltipBox} {
		visibility: visible;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
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