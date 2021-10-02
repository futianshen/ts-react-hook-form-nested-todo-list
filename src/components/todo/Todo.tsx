import { ChangeEventHandler, ReactElement } from "react"
import { UseFormRegisterReturn } from "react-hook-form/dist/types/form"

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
      <input
        type="checkbox"
        {...onRegister("isDone")}
        onChange={handleChange}
      />
      <input {...onRegister("value")} type="text" placeholder="todo" />
      <button onClick={onRemove}>x</button>
      {children}
      {children && <hr />}
    </li>
  )
}

export default Todo
