import styled    from "styled-components";
import Container from "component/StyleComponents/Container";
import brandmark from "assets/brandmark.png";

export const StyledAppContainer = styled(Container)`
	background-color: #282c34;
	background-image: url(${brandmark});
	background-repeat: no-repeat;
	font-size: calc(10px + 1vmin);
  	width: 100vw;
  	height: 100vh;
	color: white;
	word-break: break-word;
`;