import styled from "styled-components";

export const Input = styled.input.attrs({
	type: 'text',
})`
	width: 100%;
	height: 35px;
	border-radius: 5px;
	border: solid 1px #e2e1e2;
	padding: 0px 10px 0px 10px !important;
	box-sizing: border-box;
	font-size: 11px;
	&:focus {
		outline: none !important;
	}
`