import React from "react"
import { dependencies } from "../../../package.json"

export const DebugPage = () => {
  const sdkVersion: string = dependencies?.[`@axelar-network/axelarjs-sdk`]

  return (
    <>
      <div>{"webapp v." + process.env.REACT_APP_VERSION}</div>
      <div>{"sdk v." + sdkVersion}</div>
    </>
  )
}
