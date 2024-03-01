import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import todosApi from '../Components/Api/todos';

function SingleTodo() {
    const params = useParams();
    const [todo, setTodo] = useState(null)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        todosApi.get(`/todos/${params.id}.json`)
            .then(response => {
                setTodo(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.log('error:', error)
            });
    }, [])

    return (
        <main>
            <section className="jumbotron">
                <div className="container d-flex flex-column align-items-center">
                    <h1 className="jumbotron-heading">Single Todo Page!</h1>
                    <p className="lead text-muted">To get started, add some items to your list:</p>
                </div>
            </section>
            <div className="todosList">
                <div className="container">
                    <div className="d-flex flex-column align-items-center ">
                        {loading
                            ?
                            <h2>Loading Data ...</h2>
                            :
                            todo && (
                                <div>
                                    <h3>{todo.text}</h3>
                                    {todo.done ? <p>It's Done</p> : <p>Not Done Yet!</p>}
                                </div>
                            )

                        }
                    </div>
                </div>
            </div>
        </main>
    )
}
export default SingleTodo