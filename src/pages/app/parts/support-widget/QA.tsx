import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion"
import "./accordian-styles.css"
import configs from "../../../../config/downstreamServices"
import { PopoutLink } from "../../../../components/Widgets/PopoutLink"
import React from "react"
import StyledLink from "components/Widgets/Link"

export interface IQA {
  question: string
  answer: string | any
}

const QAs: IQA[] = [
  {
    question: `Do you have any tutorials on how to use Satellite?`,
    answer: (
      <div>
        <div>
          Text:{" "}
          <PopoutLink
            text={"Transfer Terra assets to EVM chains using Satellite"}
            onClick={() => window.open("https://shorturl.at/dtDY8", "_blank")}
          />
        </div>
        <div>
          Video:{" "}
          <PopoutLink
            text={"Satellite Tutorial Video"}
            onClick={() =>
              window.open(
                "https://www.youtube.com/watch?v=VsfCJl1A9QI",
                "_blank"
              )
            }
          />
        </div>
      </div>
    ),
  },
  {
    question: `My assets are in Terra Station. How can I bridge them to other chains?`,
    answer: `As of now, Keplr is the only wallet supported to move via Satellite. Integration with other wallets is in progress. Until then, you can transfer your assets to a Keplr wallet and use Satellite with them.`,
  },
  {
    question: `Can I move non-Axelar Wrapped UST / LUNA via Satellite?`,
    answer: (
      <div>
        <div>
          No. Satellite supports moving of Axelar Wrapped Assets only. Before
          you deposit your tokens to the deposit address, please verify that
          you’re using the correct token contract. If you send a non-Axelar
          wrapped asset to the deposit address, it will be lost.
        </div>
        <br />
        <div>
          See{" "}
          <PopoutLink
            text={configs.tokenContracts[process.env.REACT_APP_STAGE as string]}
            onClick={() =>
              window.open(
                configs.tokenContracts[process.env.REACT_APP_STAGE as string],
                "_blank"
              )
            }
          />{" "}
          for a list of token contracts supported by Satellite on the mainnet.
        </div>
      </div>
    ),
  },
  {
    question: `How can I ask for help?`,
    answer: (
      <div>
        If your asset doesn’t arrive after sufficient time has passed (15-30
        minutes for all chains, except Ethereum, where transactions are
        triggered at 30m+ intervals), then:
        <ul>
          <li>
            Confirm that your transaction on the source chain went through via
            the corresponding explorer.
          </li>
          <li>
            Confirm that you sent the assets to the Axelar-generated deposit
            address.
          </li>
          <li>
            Confirm that you’ve sent the tokens to the desired destination chain
            & added the token contract to your metamask wallet{" "}
            <PopoutLink
              text={
                configs.tokenContracts[process.env.REACT_APP_STAGE as string]
              }
              onClick={() =>
                window.open(
                  configs.tokenContracts[process.env.REACT_APP_STAGE as string],
                  "_blank"
                )
              }
            />
            . Try searching your transaction in the destination chain’s explorer
            based on your destination address.
          </li>
        </ul>
        If you still can’t find it, copy the Trace ID & the destination address
        & your transaction on the source chain and submit a request <StyledLink href="https://axelar.zendesk.com/hc/en-us">here</StyledLink>.
      </div>
    ),
  },
]

export const QASection = () => {
  return (
    <Accordion>
      {QAs.map((qa, idx) => {
        return (
          <CombinedAccordianItem
            key={`qa_id-${idx}`}
            heading={qa.question}
            body={qa.answer}
          />
        )
      })}
    </Accordion>
  )
}

const CombinedAccordianItem = ({
  heading,
  body,
}: {
  heading: string
  body: JSX.Element | string
}) => {
  return (
    <AccordionItem>
      <AccordionItemHeading>
        <AccordionItemButton>{heading}</AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel>
        <span>{body}</span>
      </AccordionItemPanel>
    </AccordionItem>
  )
}

export default QAs

/*
 * */
