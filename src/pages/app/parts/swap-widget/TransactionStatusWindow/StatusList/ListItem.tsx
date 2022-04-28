import screenConfigs from "config/screenConfigs"
import styled from "styled-components"

const StyledListItem = styled.div`
  height: 33%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media ${screenConfigs.media.desktop} {
    font-size: 18px;
  }
  @media ${screenConfigs.media.laptop} {
    font-size: 15px;
  }
  @media ${screenConfigs.media.tablet} {
    font-size: 12px;
  }
  @media ${screenConfigs.media.mobile} {
    font-size: 10px;
  }
`

const StyledImage = styled.object`
  height: 75%;
  width: 75%;
`

interface IListItemProps {
  activeStep: number
  step: number
  text: any
  className?: string
}

export const ListItem = (props: IListItemProps) => {
  const { activeStep, className, step, text } = props
  let suffix: string

  if (activeStep > step) {
    suffix = "complete"
  } else if (activeStep === step) {
    suffix = "active"
  } else {
    suffix = "inactive"
  }

  return (
    <StyledListItem className={className}>
      <div
        style={{
          width: `20%`,
          height: `100%`,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
        }}
      >
        <StyledImage
          data={
            require(`assets/svg/transaction_status_logos/step-${step}-${suffix}.svg`)
              ?.default
          }
        />
      </div>
      <div
        style={{
          width: `80%`,
          height: `100%`,
          display: `flex`,
          alignItems: `center`,
          color: activeStep >= step ? "black" : "lightgray",
        }}
      >
        {text}
      </div>
    </StyledListItem>
  )
}
