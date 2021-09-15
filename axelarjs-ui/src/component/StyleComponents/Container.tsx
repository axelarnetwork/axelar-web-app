import {HTMLAttributes, ReactElement} from 'react';
import styled, {ThemedStyledProps}    from 'styled-components';

interface IStyledDivProps extends ThemedStyledProps<any, any> {
	width: string;
	height: string;
}

const StyledContainer = styled.div<IStyledDivProps>`
	width: ${props => props.width || "100%"};
	height: ${props => props.height || "100%"};
  	margin: ${props => props.margin || "auto"};
`;

interface IContainerProps extends HTMLAttributes<HTMLDivElement> {
	width?: string;
	height?: string;
	margin?: string;
}

const Container = (props: IContainerProps): ReactElement => {
	return <StyledContainer {...props} />
}

export default Container;