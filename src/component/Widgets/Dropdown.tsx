import {useState} from "react";

const Dropdown = () => {
	const [value, setValue] = useState("Select Flow");

	const handleChange = (event: any) => setValue(event.target.value);

	return (
		<label>
			<select name={"TBD"} value={value} onChange={handleChange}>
				<option value="Flow 1">Flow 1</option>
				<option value="Flow 2">Flow 2</option>
				<option value="Flow 3">Flow 3</option>
				<option value="Flow 4">Flow 4</option>
			</select>
		</label>
	);
}

export default Dropdown;