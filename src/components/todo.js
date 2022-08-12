import React from 'react'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import { createTodo, deleteTodo } from '../graphql/mutations'
import { listTodos } from '../graphql/queries'

const Todo = () => {

    const initialState = { name: '', description: '' }

    const [formState, setFormState] = useState(initialState)
    const [todos, setTodos] = useState([])

    useEffect(() => {
        fetchTodos()
    }, [])

    function setInput(key, value) {
        setFormState({ ...formState, [key]: value })
    }

    async function fetchTodos() {
        try {
            const todoData = await API.graphql(graphqlOperation(listTodos))
            const todos = todoData.data.listTodos.items
            setTodos(todos)
        } catch (err) { console.log('error fetching todos', err) }
    }

    async function addTodo() {
        try {
            if (!formState.name || !formState.description) return
            const todo = { ...formState }
            setTodos([...todos, todo])
            setFormState(initialState)
            await API.graphql(graphqlOperation(createTodo, { input: todo }))
        } catch (err) {
            console.log('error creating todo:', err)
        }
    }
    async function handledeleteTodo(id) {
        console.log(id)
        const inputDetails = {
            id: id,
        };
        try {
            await API.graphql({ query: deleteTodo, variables: { input: inputDetails } })
                .then(setTodos([todos.filter(content => content.id !== id)]))
        } catch (err) {
            console.log('error delete todo:', err)
        }
    }

    return (
        <>
            <Container>
                <h2>GraphQL and DynamoDB Test</h2>
                <TextField
                    onChange={event => setInput('name', event.target.value)}
                    value={formState.name}
                    placeholder="Name"
                    style={styles.input}
                />
                <TextField
                    onChange={event => setInput('description', event.target.value)}
                    value={formState.description}
                    placeholder="Description"
                    style={styles.input}
                />
                <Button onClick={addTodo}>Add Item</Button>
                {
                    todos.map((todo, index) => (
                        <div key={todo.id ? todo.id : index} style={styles.todo}>
                            <p style={styles.todoName}>{todo.name}</p>
                            <p style={styles.todoDescription}>{todo.description}<span><Button onClick={() => handledeleteTodo(todo.id)}>Delete</Button></span></p>

                        </div>
                    ))
                }
            </Container>
        </>)
}

export default Todo