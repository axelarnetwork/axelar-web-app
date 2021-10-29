import styled from "styled-components";

interface ILinkProps {
	children: any;
	href?: string;
	className?: string;
}

const Link = ({children, href, className}: ILinkProps) => (
	<a
		className={className}
		href={href}
		target={"_blank"}
		rel="noreferrer"
	>
		{children}
	</a>
);

const StyledLink = styled(Link)`
	cursor: pointer;
`;

export default StyledLink;