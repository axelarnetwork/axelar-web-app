import { KeyboardEvent, useState } from "react"
import { InputForm } from "components/CompositeComponents/InputForm"
import { SVGImage } from "components/Widgets/SVGImage"

const usePasswordInput = ({
  handleOnEnterPress,
}: {
  handleOnEnterPress: () => void
}) => {
  const [password, setPassword] = useState("")
  const [passwordShown, setPasswordShown] = useState(false)
  const togglePassword = () => setPasswordShown(!passwordShown)

  const handleOnKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      setPassword((e.target as any)?.value)
      handleOnEnterPress && handleOnEnterPress()
    }
  }

  return [
    password,
    <div style={{ width: `50%`, position: `relative` }}>
      <InputForm
        name={"usePasswordInput"}
        placeholder={"Admin Password"}
        value={password}
        type={(passwordShown ? "text" : "password") as any}
        onChange={(e: any) => setPassword(e.target.value)}
        handleOnEnterPress={handleOnKeyPress}
      />
      <div
        style={{
          position: `absolute`,
          marginTop: `-32px`,
          right: `20px`,
          cursor: `pointer`,
        }}
      >
        <SVGImage
          src={require(`assets/svg/show-password.svg`)?.default}
          height={"30px"}
          width={"30px"}
          onClick={togglePassword}
        />
      </div>
    </div>,
  ] as const
}

export default usePasswordInput
