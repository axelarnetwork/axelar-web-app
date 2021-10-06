import {useSetRecoilState}  from "recoil";
import Form                 from "react-bootstrap/Form";
import styled               from "styled-components";
import {DestinationAddress} from "state/ChainSelection";

const StyledForm = styled(Form)`
	margin-top: 30px;
	margin-bottom: 30px;
	width: calc(100% - 50px);
`;

const StyledFormControl = styled(Form.Control)`
	background-color: rgb(33, 36, 41);
	color: darkgray;
	font-size: 16px;
	border: none;
	margin-top: 10px;
	width: 100%;
`;

export const NumberFormInput = () => {

	const setDestinationAddress = useSetRecoilState<string | null>(DestinationAddress);

	const onChange = (e: any) => {
		setDestinationAddress(e?.target?.value);
	}
	return <StyledForm onChange={onChange}>
		Destination Address
		<StyledFormControl type="text" placeholder="(Public Key)" size={"sm"}/>
	</StyledForm>;
}