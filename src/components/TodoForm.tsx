import React from "react"
import { useForm } from "react-hook-form" // react hook 邏輯複用
import { TodoList, Todo } from "../components/todo" // Component 複用
import { FormValues, NestedList } from "../types/todo" // type 複用

const initialList: NestedList = [
  {
    value: "todo group 1",
    isDone: false,
  },
  {
    value: "todo group 2",
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
      <div className="flex gap-1">
        <button onClick={handleSave}>↑ Save</button>
        <button onClick={handleLoad}>↓ Load</button>
        <button onClick={() => setValue("nestedList", [])}>X Clear</button>
      </div>

      <TodoList
        name="nestedList"
        control={control}
        renderAddButton={(prepend) => (
          <>
            <button
              onClick={() =>
                prepend({
                  value: "",
                  isDone: false,
                })
              }
            >
              + Todo
            </button>
            <button
              onClick={() =>
                prepend({
                  value: "",
                  isDone: false,
                  list: [{ value: "", isDone: false }],
                })
              }
            >
              + Group
            </button>
          </>
        )}
        renderTodo={(fieldId, index, onRemove) => (
          <Todo
            key={fieldId}
            onRegister={(name) => register(`nestedList.${index}.${name}`)}
            onCheck={() => {
              const todo = getValues(`nestedList.${index}`)
              todo.list?.forEach((_, subIndex) => {
                setValue(
                  `nestedList.${index}.list.${subIndex}.isDone`,
                  todo.isDone
                )
              })
            }}
            onRemove={onRemove}
          >
            <TodoList
              name={`nestedList.${index}.list`}
              control={control}
              renderAddButton={(prepend) => (
                <button
                  onClick={() => {
                    prepend({
                      value: "",
                      isDone: false,
                    })
                    if (getValues(`nestedList.${index}.isDone`) === true) {
                      setValue(`nestedList.${index}.isDone`, false)
                    }
                  }}
                >
                  + Todo
                </button>
              )}
              renderTodo={(subField, subIndex, onRemove) => (
                <Todo
                  key={subField}
                  onRegister={(name) =>
                    register(`nestedList.${index}.list.${subIndex}.${name}`)
                  }
                  onCheck={() => {
                    const subTodoList =
                      getValues(`nestedList.${index}.list`) || []
                    if (subTodoList.every((todo) => todo.isDone)) {
                      return setValue(`nestedList.${index}.isDone`, true)
                    }
                    setValue(`nestedList.${index}.isDone`, false)
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

export default TodoForm
