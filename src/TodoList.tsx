import React from "react"
import { useForm, useFieldArray, UseFormRegisterReturn } from "react-hook-form"

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

function TodoList() {
  const form = useForm<FormValues>({
    defaultValues: {
      nestedList: initialList,
    },
  })
  const name = "nestedList"
  const { control, getValues, register, setValue, handleSubmit } = form
  const { fields, prepend, remove } = useFieldArray({ name, control })

  const save = handleSubmit((value) => {
    localStorage.setItem("todoList", JSON.stringify(value.nestedList))
    alert("success")
  })

  return (
    <>
      <button onClick={save}>Save</button>
      <button
        onClick={() => {
          setValue(
            "nestedList",
            JSON.parse(localStorage.getItem("todoList") || "")
          )
          alert("success")
        }}
      >
        Load
      </button>
      <button
        onClick={() => {
          prepend({ value: "todo", isDone: false, isGroup: false })
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
          })
        }
      >
        Add Group
      </button>

      <ol>
        {fields.map((field, index) => (
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
            onRemove={() => remove(index)}
          >
            <SubTodoList
              control={control}
              name={`${name}.${index}.list`}
              isGroup={field.isGroup}
              onTodoAdd={() => setValue(`${name}.${index}.isDone`, false)}
              renderSubTodo={(subFieldId, subIndex, onRemove) => (
                <SubTodo
                  key={subFieldId}
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
        ))}
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
      <hr />
    </li>
  )
}

function SubTodoList(props: {
  name: `nestedList.${number}.list`
  control: Control<FormValues>
  isGroup: boolean
  onTodoAdd: () => void
  renderSubTodo: (
    fieldId: string,
    index: number,
    onRemove: () => void
  ) => ReactElement
}) {
  const { name, control, isGroup, onTodoAdd, renderSubTodo } = props
  const { fields, append, remove } = useFieldArray({ name, control })

  return (
    <>
      {isGroup && (
        <button
          onClick={() => {
            onTodoAdd()
            append({ value: "todo", isDone: false })
          }}
        >
          Add Todo
        </button>
      )}
      <ol>
        {fields.map((field, index) =>
          renderSubTodo(field.id, index, () => remove(index))
        )}
      </ol>
    </>
  )
}

function SubTodo(props: {
  onRegister: (inputName: "isDone" | "value") => UseFormRegisterReturn
  onCheck: () => void
  onRemove: () => void
}) {
  const { onRegister, onCheck, onRemove } = props

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
      <input {...onRegister("value")} type="text" />
      <button onClick={onRemove}>Delete</button>
    </li>
  )
}

export default TodoList
