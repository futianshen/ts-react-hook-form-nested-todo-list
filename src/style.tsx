import { Button } from "@geist-ui/react"
import styled, { css } from "styled-components"

const ContainerMixin = css`
  margin: 0 auto;
  width: 500px;
`

const StyledAddButton = styled(Button)`
  &&& {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0;
    width: 33px;
    height: 33px;
  }
`

export { ContainerMixin, StyledAddButton }
