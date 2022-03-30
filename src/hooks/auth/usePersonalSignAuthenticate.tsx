import axios from "axios"
import { useCallback, useState } from "react"
import { useRecoilState } from "recoil"
import { IsBlockchainAuthenticated } from "state/TransactionStatus"
import { MetaMaskWallet } from "hooks/wallet/MetaMaskWallet"
import { getConfigs } from "@axelar-network/axelarjs-sdk"

const NODE_SERVER_URL: string = getConfigs(
  process.env.REACT_APP_STAGE as string
)?.resourceUrl
const OTC_ENDPOINT: string = NODE_SERVER_URL + "/otc"

const usePersonalSignAuthenticate = () => {
  const [isBlockchainAuthenticated, setIsBlockchainAuthenticated] =
    useRecoilState(IsBlockchainAuthenticated)
  const [otc, setOtc] = useState("")
  const [publicAddress, setPublicAddress] = useState("")
  const [signature, setSignature] = useState("")

  const authenticateWithMetamask = useCallback((): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        const mmWallet = new MetaMaskWallet("ethereum")
        const address = await mmWallet.getAddress()
        setPublicAddress(address)
        const codeRes = await axios.get(
          OTC_ENDPOINT + `?publicAddress=${address}`
        )
        setOtc(codeRes?.data?.otc)
        const res = await mmWallet.signMessage(codeRes?.data.validationMsg)
        setPublicAddress(res.address)
        setSignature(res.signature)
        setIsBlockchainAuthenticated(true)
        resolve({
          publicAddress: res.address,
          signature: res.signature,
          otc: codeRes?.data?.otc,
          isBlockchainAuthenticated: true,
        })
      } catch (e: any) {
        setIsBlockchainAuthenticated(false)
        reject(e)
      }
    })
  }, [setIsBlockchainAuthenticated])

  return {
    isBlockchainAuthenticated,
    authenticateWithMetamask,
    otc,
    publicAddress,
    signature,
  } as const
}

export default usePersonalSignAuthenticate
