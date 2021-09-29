import React from "react"
import {
  useForm,
  useFieldArray,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { ReactElement } from "react"
import {
  Control,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form"
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
        <FormProvider {...form}>
          {fields.map((field, index) => (
            <Todo
              key={field.id}
              name={`${name}.${index}`}
              onRegister={register}
              onValuesGet={getValues}
              onValueSet={setValue}
              onRemove={() => remove(index)}
            >
              <SubTodoList
                control={control}
                name={`${name}.${index}`}
                isGroup={field.isGroup}
                onValueSet={setValue}
              />
            </Todo>
          ))}
        </FormProvider>
      </ol>
    </>
  )
}

function Todo(props: {
  name: `nestedList.${number}`
  onRegister: UseFormRegister<FormValues>
  onValuesGet: UseFormGetValues<FormValues>
  onValueSet: UseFormSetValue<FormValues>
  onRemove: () => void
  children?: ReactElement
}) {
  const { name, onRegister, onValuesGet, onValueSet, onRemove, children } =
    props

  return (
    <li>
      <input
        type="checkbox"
        {...onRegister(`${name}.isDone`)}
        onChange={(e) => {
          const { onChange } = onRegister(`${name}.isDone`)
          onChange(e)
          const currentTodo = onValuesGet(name)
          currentTodo.list.forEach((_, i) => {
            onValueSet(`${name}.list.${i}.isDone`, currentTodo.isDone)
          })
        }}
      />
      <input {...onRegister(`${name}.value`)} type="text" />
      <button onClick={onRemove}>Delete</button>
      {children}
      <hr />
    </li>
  )
}

function SubTodoList(props: {
  name: `nestedList.${number}`
  control: Control<FormValues>
  isGroup: boolean
  onValueSet: UseFormSetValue<FormValues>
}) {
  const { name, control, isGroup, onValueSet } = props
  const { fields, append, remove } = useFieldArray({
    name: `${name}.list`,
    control,
  })

  return (
    <>
      {isGroup && (
        <button
          onClick={() => {
            onValueSet(`${name}.isDone`, false)
            append({ value: "todo", isDone: false })
          }}
        >
          Add Todo
        </button>
      )}
      <ol>
        {fields.map((field, index) => (
          <SubTodo
            key={field.id}
            parentName={name}
            name={`${name}.list.${index}`}
            onRemove={() => remove(index)}
          />
        ))}
      </ol>
    </>
  )
}

function SubTodo(props: {
  parentName: `nestedList.${number}`
  name: `nestedList.${number}.list.${number}`
  onRemove: () => void
}) {
  const { parentName, name, onRemove } = props
  const { register, getValues, setValue } = useFormContext<FormValues>()

  return (
    <li>
      <input
        type="checkbox"
        {...register(`${name}.isDone`)}
        onChange={(e) => {
          const { onChange } = register(`${name}.isDone`)
          onChange(e)
          const siblings = getValues(`${parentName}.list`)
          if (siblings.every((todo) => todo.isDone)) {
            return setValue(`${parentName}.isDone`, true)
          }
          setValue(`${parentName}.isDone`, false)
        }}
      />
      <input {...register(`${name}.value`)} type="text" />
      <button onClick={onRemove}>Delete</button>
    </li>
  )
}

export default TodoList
