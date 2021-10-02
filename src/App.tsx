import { GeistProvider } from "@geist-ui/react"
import TodoForm from "./components/TodoForm"

function App() {
  return (
    <GeistProvider>
      <TodoForm />
    </GeistProvider>
  )
}

export default App
