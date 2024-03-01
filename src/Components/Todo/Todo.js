import React, { useState, useContext } from 'react';
import EditTodo from './EditTodo';
import TodosContext from './../../Context/TodosContext'
import StateContext from './../../Context/StateContext'
//import axios from 'axios';
import todosApi from './../Api/todos';
import {Link} from 'react-router-dom'
function Todo(props) {

    const { item } = props;


    const [ edit , setEdit ] = useState(false);
    const [ loading , setLoading ] = useState(false);
    const todosContext = useContext(TodosContext);
    
    let editHandler = text => {
        setLoading(true)
        todosApi.put(`/todos/${item.key}.json`,{done: item.done, text})
        .then(response => {todosContext.dispatch({ type : 'edit_todo' , payload : { key : item.key , text }});setLoading(false)})
        .catch(error => console.log(error));
        setEdit(false);
    }

    let deleteHandler = e => {
        setLoading(true)
        todosApi.delete(`/todos/${item.key}.json`)
        .then(response => {todosContext.dispatch({ type : 'delete_todo' , payload : { key : item.key}});setLoading(false)})
        .catch(error => console.log(error));
        
    }

    let doneHandler = e => {
        setLoading(true)
        todosApi.put(`/todos/${item.key}.json`,{done: ! item.done, text: item.text})
        .then(response => {todosContext.dispatch({ type : 'toggle_todo' , payload : { key : item.key}});setLoading(false)})
        .catch(error => console.log(error));
    }



    return (
        <>
            {
                ! edit
                    ? (
                        <div className="col-6 mb-2">
                            <div className="d-flex justify-content-between align-items-center border rounded p-3">
                                <div>
                                {!loading ? <Link to={`/Todo/SingleTodo/${item.key}`}>{item.text}</Link> :<h3>Loading Data...</h3> }
                                </div>
                                <div>
                                    <button type="button" className={`btn btn-sm mr-1 ${ !item.done ? 'btn-success' : 'btn-warning'}`} onClick={doneHandler}>{ item.done ? 'undone' : 'done'}</button>
                                    <button type="button" className="btn btn-info btn-sm mr-1" onClick={() => setEdit(true)}>edit</button>
                                    <button type="button" className="btn btn-danger btn-sm" onClick={deleteHandler}>delete</button>
                                </div>
                            </div>
                        </div>
                    )  
                    : <EditTodo text={item.text} edit={editHandler}/> 
            }
        </>
    )
}



export default Todo;