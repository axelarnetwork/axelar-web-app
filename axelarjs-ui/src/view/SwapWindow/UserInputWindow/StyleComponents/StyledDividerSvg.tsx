import styled     from "styled-components";
import dividerSvg from "assets/group.svg";

export const StyledDividerSvg = styled.div`
	background-image: url(${dividerSvg}); 
	background-repeat: no-repeat;
	background-size: cover;
	right: 0;
	top: 5px;
	font-size: 11px;
	font-weight: bold;
	height: 21px;
	width: 98%;
	text-align: right;
`;