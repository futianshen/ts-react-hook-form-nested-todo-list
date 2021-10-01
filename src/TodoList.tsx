import React from "react"
import {
  useForm,
  useFieldArray,
  UseFormRegisterReturn,
  FieldArrayWithId,
} from "react-hook-form"

import { ReactElement } from "react"
import { Control } from "react-hook-form"
type FormValues = {
  nestedList: {
    isGroup: boolean
    value: string
    isDone: boolean
    list: {
      value: string
      isDone: boolean
    }[]
  }[]
}

const initialList: FormValues["nestedList"] = [
  {
    value: "todo 1",
    isDone: false,
    isGroup: false,
    list: [],
  },
  {
    value: "todo group 1",
    isDone: false,
    isGroup: true,
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
        renderTodo={(field, index, onRemove) => (
          <Todo
            key={field.id}
            onRegister={(inputName) =>
              register(`nestedList.${index}.${inputName}`)
            }
            onCheck={() => {
              const currentTodo = getValues(`${name}.${index}`)
              currentTodo.list.forEach((_, i) => {
                setValue(
                  `${name}.${index}.list.${i}.isDone`,
                  currentTodo.isDone
                )
              })
            }}
            onRemove={onRemove}
          >
            <TodoList
              name={`${name}.${index}.list`}
              control={control}
              onTodoAdd={() => {
                if (getValues(`${name}.${index}.isDone`)) {
                  setValue(`${name}.${index}.isDone`, false)
                }
              }}
              renderTodo={(subField, subIndex, onRemove) => (
                <Todo
                  key={subField.id}
                  onRegister={(inputName) =>
                    register(`${name}.${index}.list.${subIndex}.${inputName}`)
                  }
                  onCheck={() => {
                    const siblings = getValues(`${name}.${index}.list`)
                    if (siblings.every((todo) => todo.isDone)) {
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
  renderTodo: (
    field: FieldArrayWithId<
      FormValues,
      "nestedList" | `nestedList.${number}.list`,
      "id"
    >,
    index: number,
    onRemove: () => void
  ) => ReactElement
  onTodoAdd?: () => void
}) {
  const { name, control, renderTodo, onTodoAdd } = props
  const { fields, prepend, remove } = useFieldArray({ name, control })

  return (
    <>
      {onTodoAdd ? (
        <>
          <button
            onClick={() => {
              onTodoAdd()
              prepend({ value: "todo", isDone: false })
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
                isGroup: false,
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
                isGroup: true,
                list: [{ value: "todo", isDone: false }],
              } as any)
            }
          >
            Add Group
          </button>
        </>
      )}
      <ol>
        {fields.map((field, index) =>
          renderTodo(field, index, () => remove(index))
        )}
      </ol>
    </>
  )
}

function Todo(props: {
  onRegister: (inputName: "isDone" | "value") => UseFormRegisterReturn
  onCheck: () => void
  onRemove: () => void
  children?: ReactElement
}) {
  const { onRegister, onCheck, onRemove, children } = props

  return (
    <li>
      <input
        type="checkbox"
        {...onRegister("isDone")}
        onChange={(e) => {
          const { onChange } = onRegister(`isDone`)
          onChange(e)
          onCheck()
        }}
      />
      <input {...onRegister(`value`)} type="text" />
      <button onClick={onRemove}>Delete</button>
      {children}
      {children && <hr />}
    </li>
  )
}

export default TodoForm
