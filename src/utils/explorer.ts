export function getAxelarTxLink(txHash: string) {
  if (process.env.REACT_APP_STAGE === "mainnet") {
    return `https://axelarscan.io/tx/${txHash}`
  } else {
    return `https://testnet.axelarscan.io/tx/${txHash}`
  }
}
