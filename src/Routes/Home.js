import React, {useContext,useEffect,useState} from 'react';
import FormAddTodo from '../Components/Todo/FormAddTodo';
import TodoList from '../Components/Todo/TodoList';

//import axios
import todosApi from '../Components/Api/todos';

import TodosContext from './../Context/TodosContext';


export default function Home() {
    const [loading , setLoading] = useState();
    const todocontext = useContext(TodosContext);
    //const { todos , dispatch } = todoscontext;
    // console.log(todocontext)
    useEffect(() => {
        setLoading(true)
        todosApi.get(`/todos.json`)
        .then(response => jsonHandler(response.data))
        .catch(error => console.log(error));
    },[])

const jsonHandler = (data) => {
    setLoading(false);

    // Convert the data object into an array of todos with key as property
    let todos = Object.entries(data).map(([key, value]) => {
        return { 
            ...value,
            key 
        }
    });

    // Dispatch an action to initialize the todos in the state
    todocontext.dispatch({ type: 'init_todos', payload: { todos } });
}

    return (
        <main>
            <section className="jumbotron">
                <div className="container d-flex flex-column align-items-center">
                    <h1 className="jumbotron-heading">Welcome!</h1>
                    <p className="lead text-muted">To get started, add some items to your list:</p>
                    <FormAddTodo />
                </div>
            </section>

            <div className="todosList">
                <div className="container">
                    <div className="d-flex flex-column align-items-center ">
                        {!loading
                            ?
                            <TodoList />
                            :
                            <h2>Loading Data ...</h2>
                        }
                    </div>
                </div>
            </div>


        </main>
    )
}