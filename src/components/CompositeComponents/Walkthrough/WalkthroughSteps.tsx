import { Step } from "react-joyride"
import styled from "styled-components"

const Text = styled.div`
  font-size: larger;
`

export const WalkthroughSteps: Step[] = [
  {
    target: "body",
    placement: "center",
    styles: { options: { width: `50vw` } },
    content: (
      <div>
        <h1>First time here?</h1>
        <br />
        <div style={{ padding: `30px`, fontSize: `larger` }}>
          Here's a brief step-by-step walkthrough of how you can use this app to
          transfer your crypto holdings across our universe of supported
          blockchains and assets.
        </div>
        <div style={{ padding: `30px`, fontSize: `larger` }}>
          <div>
            We currently support asset transfers across five EVM chains:
          </div>
          <div>
            Avalanche, Ethereum, Fantom, Moonbeam, and Polygon - along with
            Terra and Axelar.
          </div>
        </div>
        <div style={{ padding: `30px`, fontSize: `larger` }}>
          And the list is growing fast!
        </div>
        <br />
      </div>
    ),
  },
  {
    target: ".joyride-chain-selector",
    title: "Input Selection",
    placement: "right-end",
    content: (
      <div>
        <br />
        <Text>
          First, select your source/destination chains and the address on the
          destination chain where the transferred assets should arrive.
        </Text>
        <br />
        <Text>
          The option to select an asset will appear once a source chain is
          selected.
        </Text>
      </div>
    ),
  },
  {
    target: ".joyride-top-flows",
    title: "Top flows",
    content: <Text>Or choose among some of our popular flows!</Text>,
  },
  {
    target: ".joyride-input-button",
    title: "Initiate Asset Transfer",
    content: (
      <Text>
        You will be able to send a transaction once you enter valid inputs,
        which you'll know once the app lights up :-)
      </Text>
    ),
  },
  {
    target: ".joyride-faq",
    placement: "left-end",
    title: "Live Support",
    content: (
      <div>
        <Text>
          For any issues with a "live" transaction, you can contact us here. Be
          sure to make note of the (transaction-specific) trace ID when
          contacting us!
        </Text>
        <br />
        <Text>Our FAQ is also shown here.</Text>
      </div>
    ),
  },
  {
    target: ".joyride-status-step-1",
    title: "One-Time Deposit Address",
    content: (
      <div>
        <Text>
          The one-time deposit address is a temporary Axelar-controlled deposit
          address on your chosen source chain.{" "}
        </Text>
        <br />
        <Text>
          It is continuously monitored for deposits for 24 hours, then it is
          discarded.
        </Text>
      </div>
    ),
  },
  {
    target: ".joyride-status-step-2",
    styles: { options: { width: `50vw` } },
    title: "Deposit now, please!",
    content: (
      <div>
        <Text>
          Use any of the popular wallet providers (like Metamask) to send your
          token deposits directly to this temporary deposit address on the
          source chain. IBC transfers are also supported (in the case where you
          are depositing Cosmos-based tokens like UST, AXL, etc).
        </Text>
        <br />
        <Text>
          As mentioned, the deposit address is monitored for 24 hours after it
          is generated, then it is destroyed. Anything you transfer in those 24
          hours will be processed real-time and transferred, but try and send a
          single deposit soon after it's been generated, if possible!
        </Text>
        <br />
        <Text>
          *** Be sure to send the right tokens over the right networks! We won't
          be responsible for any misappropriated funds (though we'll try our
          best to help you out if that happens).
        </Text>
      </div>
    ),
  },
  {
    target: ".joyride-status-step-2-important-info",
    title: "Important Deposit Info!",
    content: (
      <Text>
        Please pay attention to minimum deposit amounts, fees, and approximate
        wait times to be noted here.
      </Text>
    ),
  },
  {
    target: ".joyride-status-step-3",
    title: "Deposit Received!",
    styles: { options: { width: `50vw` } },
    content: (
      <div>
        <Text>
          At this stage, we have processed your deposit and prepared it for the
          final transfer to the destination chain.
        </Text>
        <br />
        <Text>
          You do not need to wait for Step 4, where we detect your transaction
          on the destination chain.
        </Text>
      </div>
    ),
  },
  {
    target: ".joyride-status-step-4",
    title: "Done!!",
    placement: "top",
    content: (
      <Text>
        If available, we'll link you up to the txHash on the relevant block
        explorer where your transaction can be found.
      </Text>
    ),
  },
  {
    target: "body",
    placement: "center",
    styles: { options: { width: `60vw` } },
    content: (
      <div>
        <h1>That's it!</h1>
        <h1>Any questions, please see our FAQ.</h1>
      </div>
    ),
  },
]

export const BreakIndex: number =
  WalkthroughSteps.findIndex(
    (step) => step.target === ".joyride-status-step-1"
  ) - 1 || -1
