import {useState}  from "react";
import {InputForm} from "component/CompositeComponents/InputForm";
import {SVGImage}  from "component/Widgets/SVGImage";

const usePasswordInput = () => {

	const [password, setPassword] = useState("");
	const [passwordShown, setPasswordShown] = useState(false);
	const togglePassword = () => setPasswordShown(!passwordShown);

	return [
		password,
		(<div style={{width: `50%`, position: `relative`}}>
			<InputForm
				name={"usePasswordInput"}
				placeholder={"Enter password"}
				value={password}
				type={(passwordShown ? "text" : "password") as any}
				onChange={(e: any) => setPassword(e.target.value)}
			/>
			<div style={{position: `absolute`, marginTop: `-32px`, right: `20px`, cursor: `pointer`}}>
				<SVGImage
					src={require(`resources/show-password.svg`)?.default}
					height={"30px"}
					width={"30px"}
					onClick={togglePassword}
				/>
			</div>
		</div>)
	] as const;

}

export default usePasswordInput;