import { ReactElement } from "react"
import { useFieldArray } from "react-hook-form"
import { Control } from "react-hook-form/dist/types/form"
import styled from "styled-components"
import { ContainerMixin } from "../../style"
import { FormValues } from "../../types/todo"

const StyledList = styled.ol`
  ${ContainerMixin}
`

function TodoList(props: {
  name: "nestedList" | `nestedList.${number}.list`
  control: Control<FormValues>
  renderAddButton?: (
    prepend: (todo: {
      value: string
      isDone: boolean
      list?: { value: string; isDone: boolean }[]
    }) => void
  ) => ReactElement
  renderTodo?: (
    fieldId: string,
    index: number,
    onRemove: () => void
  ) => ReactElement
}) {
  const { name, control, renderAddButton, renderTodo } = props
  const { fields, prepend, remove } = useFieldArray({ name, control })

  return (
    <>
      {renderAddButton?.((todo) => prepend(todo as any))}
      {renderTodo && (
        <StyledList className="d-flex gap-3">
          {fields.map((field: { id: string }, index) =>
            renderTodo(field.id, index, () => remove(index))
          )}
        </StyledList>
      )}
    </>
  )
}

export default TodoList
