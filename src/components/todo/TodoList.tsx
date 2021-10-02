import { ReactElement } from "react"
import { useFieldArray } from "react-hook-form"

import { Control } from "react-hook-form/dist/types/form"
import { FormValues } from "../../types/todo"

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
        <ol>
          {fields.map((field: { id: string }, index) =>
            renderTodo(field.id, index, () => remove(index))
          )}
        </ol>
      )}
    </>
  )
}

export default TodoList
