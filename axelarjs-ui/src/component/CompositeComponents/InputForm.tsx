import {useRecoilState}     from "recoil";
import {DestinationAddress} from "state/ChainSelection";
import {Input}              from "../StyleComponents/Input";

export const InputForm = (props: any) => {

	const [destinationAddress, setDestinationAddress] = useRecoilState(DestinationAddress);
	const handleChange = (event: any) => setDestinationAddress(event.target.value);

	return <Input
		name="destination-address-input"
		placeholder="Enter Destination Address (Public Key)"
		type="text"
		value={destinationAddress || ""}
		onChange={handleChange}
	/>;

};