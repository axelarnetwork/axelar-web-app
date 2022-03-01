export const SOURCE_TOKEN_KEY: string = "first-chain-selection"
export const DESTINATION_TOKEN_KEY: string = "second-chain-selection"
export const MS_UNTIL_CONFIRM_BTN_VISIBLE: number = parseInt(
  process.env.REACT_APP_MS_UNTIL_CONFIRM_BTN_VISIBLE ||
    (5 * 60 * 1000).toString()
) // 5 mins
