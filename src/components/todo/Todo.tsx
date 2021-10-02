import { Divider } from "@geist-ui/react"
import { Delete } from "@geist-ui/react-icons"
import { ChangeEventHandler, ReactElement } from "react"
import { UseFormRegisterReturn } from "react-hook-form/dist/types/form"
import styled from "styled-components"
import { TodoList } from "../../components/todo"

const StyledCheckbox = styled.input`
  width: 2rem;
  height: 2rem;
`

const StyledTextInput = styled.input`
  height: 2rem;
`

function Todo(props: {
  onRegister: (name: "isDone" | "value") => UseFormRegisterReturn
  onCheck?: () => void
  onRemove?: () => void
  children?: ReactElement
}) {
  const { onRegister, onCheck, onRemove, children } = props
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onRegister?.("isDone").onChange(e)
    onCheck?.()
  }

  return (
    <li>
      <div className="flex items-center gap-3 mb-3">
        <StyledCheckbox
          type="checkbox"
          {...onRegister("isDone")}
          onChange={handleChange}
        />
        <StyledTextInput
          className="flex-grow"
          {...onRegister("value")}
          type="text"
          placeholder="todo"
        />
        <Delete onClick={onRemove} />
      </div>
      {children}
      {children && <Divider />}
    </li>
  )
}

Todo.TodoList = TodoList

export default Todo
