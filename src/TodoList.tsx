import React from "react"
import { useForm, useFieldArray } from "react-hook-form"

import { ReactElement, ChangeEventHandler } from "react"
import { Control, UseFormRegisterReturn } from "react-hook-form"
type FormValues = {
  nestedList: {
    value: string
    isDone: boolean
    list?: {
      value: string
      isDone: boolean
    }[]
  }[]
}

const initialList: FormValues["nestedList"] = [
  {
    value: "todo 1",
    isDone: false,
  },
  {
    value: "todo group 1",
    isDone: false,
    list: [
      {
        value: "group todo 1",
        isDone: false,
      },
      {
        value: "group todo 2",
        isDone: true,
      },
    ],
  },
]

function TodoForm() {
  const form = useForm<FormValues>({
    defaultValues: {
      nestedList: initialList,
    },
  })
  const name = "nestedList"
  const { control, register, getValues, setValue, handleSubmit } = form
  const handleSave = handleSubmit((value) => {
    localStorage.setItem("todoList", JSON.stringify(value.nestedList))
    alert("success")
  })
  const handleLoad = () => {
    setValue("nestedList", JSON.parse(localStorage.getItem("todoList") || ""))
    alert("success")
  }

  return (
    <>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleLoad}>Load</button>

      <TodoList
        name={name}
        control={control}
        renderTodo={(fieldId, index, onRemove) => (
          <Todo
            key={fieldId}
            onRegister={(inputName) =>
              register(`nestedList.${index}.${inputName}`)
            }
            onCheck={() => {
              const todo = getValues(`${name}.${index}`)
              todo.list?.forEach((_, subIndex) => {
                setValue(
                  `${name}.${index}.list.${subIndex}.isDone`,
                  todo.isDone
                )
              })
            }}
            onRemove={onRemove}
          >
            <TodoList
              name={`${name}.${index}.list`}
              control={control}
              onTodoAdd={() => {
                if (getValues(`${name}.${index}.isDone`) === true) {
                  setValue(`${name}.${index}.isDone`, false)
                }
              }}
              renderTodo={(subField, subIndex, onRemove) => (
                <Todo
                  key={subField}
                  onRegister={(inputName) =>
                    register(`${name}.${index}.list.${subIndex}.${inputName}`)
                  }
                  onCheck={() => {
                    const subTodoList = getValues(`${name}.${index}.list`) || []
                    if (subTodoList.every((todo) => todo.isDone)) {
                      return setValue(`${name}.${index}.isDone`, true)
                    }
                    setValue(`${name}.${index}.isDone`, false)
                  }}
                  onRemove={onRemove}
                />
              )}
            />
          </Todo>
        )}
      />
    </>
  )
}

function TodoList(props: {
  name: "nestedList" | `nestedList.${number}.list`
  control: Control<FormValues>
  onTodoAdd?: () => void
  renderTodo?: (
    fieldId: string,
    index: number,
    onRemove: () => void
  ) => ReactElement
}) {
  const { name, control, onTodoAdd, renderTodo } = props
  const { fields, prepend, remove } = useFieldArray({ name, control })

  return (
    <>
      {onTodoAdd ? (
        <>
          <button
            onClick={() => {
              onTodoAdd()
              prepend({ value: "todo", isDone: false } as any)
            }}
          >
            Add Todo
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              prepend({
                value: "todo",
                isDone: false,
              } as any)
            }}
          >
            Add Todo
          </button>
          <button
            onClick={() =>
              prepend({
                value: "todoGroup",
                isDone: false,
                list: [{ value: "todo", isDone: false }],
              } as any)
            }
          >
            Add Group
          </button>
        </>
      )}
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

function Todo(props: {
  onRegister?: (inputName: "isDone" | "value") => UseFormRegisterReturn
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
      <input
        type="checkbox"
        {...onRegister?.("isDone")}
        onChange={handleChange}
      />
      <input {...onRegister?.("value")} type="text" />
      <button onClick={onRemove}>Delete</button>
      {children}
      {children && <hr />}
    </li>
  )
}

export default TodoForm
