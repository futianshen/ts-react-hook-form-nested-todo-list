type FormValues = {
  nestedList: NestedList
}

type NestedList = (Todo & {
  list?: List
})[]

type List = Todo[]

type Todo = {
  value: string
  isDone: boolean
}

export type { FormValues, NestedList }
