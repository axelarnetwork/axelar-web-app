export const getNotificationMessage: (
  messageCode: number,
  fullMessageObj: any
) => string = (messageCode: number, fullMessageObj: any) => {
  const errorsMap: { [statusCode: number]: string } = {
    503: `Unexpected error occurred, try again later.`,
    408: fullMessageObj.message + " Refresh this page and try again.", //handle user input timeout for things like deposit
    403:
      fullMessageObj.message +
      ". Try again after after signing with a proper Metamask signature.", //handle recaptcha error
    403.1:
      "Due to popular demand, to ensure everyone can try the app, Satellite Beta only allows to submit a few cross-chain transfers per session. Please try again after an hour or so.", //this is how we are going to represent Cloudflare errors for now
    400: fullMessageObj.message + "; Check your inputs and try again.", //handle bad request error
    429: "Due to popular demand, to ensure everyone can try the app, Satellite Beta only allows to submit a few cross-chain transfers per session. Please try again after an hour or so.", //handle rate limit error
    504: "Your request timed out. Please try again in a few moments.", //handle gateway timeout error
  }

  const messageMap: { [statusCode: number]: string } = {
    403.2: fullMessageObj.message, //handle recaptcha error, but try again...
  }

  if (errorsMap[messageCode]) return errorsMap[messageCode]
  if (messageMap[messageCode]) return messageMap[messageCode]

  return errorsMap[503]
}
