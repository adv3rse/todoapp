import React, { useState, useContext } from 'react';
import TodoList from './TodoList';
import TodosContext from './../../Context/TodosContext'
import StateContext from './../../Context/StateContext'


class StateList extends React.Component {
    state = {
        doneStatus: false
    }
    changeStatus(y) {
        this.setState({ doneStatus: y })
        console.log('y y  y    y : ',y)
        this.context.dispatch({type:'change_status',payload:{reducer_status : y}})
    }
    
    static contextType = TodosContext;
    render() {
        let filterTodos = this.context.todos
        console.log('filterTodos Length : ',filterTodos.length)
        console.log('doneStatus in class : ',this.state.doneStatus)
        return (
            <>
                <nav className="col-6 mb-3">
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <a className={`nav-item nav-link font-weight-bold ${!this.state.doneStatus ? 'active' : ''}`} id="nav-home-tab" onClick={this.changeStatus.bind(this,false)}>undone <span className=" badge rounded-pill bg-info">2</span></a>
                        <a className={`nav-item nav-link font-weight-bold ${this.state.doneStatus ? 'active' : ''}`} id="nav-profile-tab" onClick={this.changeStatus.bind(this,true)}>done <span className="badge rounded-pill bg-success">3</span></a>
                    </div>
                </nav>
                <TodoList />
            </>
    )
    }
}

export default StateList

/*function StateList(props) {
    let [doneStatus, setDone] = useState(false);
    const todosContext = useContext(TodosContext)
    let { todos } = todosContext;
    let { authenticated } = todosContext;
    //let filterTodos = todos.filter(item => item.done == doneStatus);
   // let changeStatus = xxx => todosContext.dispatch({type:'change_status',payload:{doneStatus_ : xxx}})
   console.log('doneStatus_ _____ : ',authenticated)
   let changeStatus = () => {
    console.log('doneStatus 11111 : ',doneStatus)
        setDone(authenticated)
        console.log('doneStatus doneStatus doneStatus : ',doneStatus)
        todosContext.dispatch({type:'change_status',payload:{reducer_status : doneStatus}})
    }
    let filterTodos = todosContext.todos.filter(item => item.done == doneStatus);
    console.log('filterTodos Length : ',filterTodos.length)
    /*let editHandler = text => {
        todosContext.edit(item.key, text)
        setEdit(false)
    }*/
    //let { doneStatus } = todosContext;
    
   
    //after dispatch
    // let filterTodos = todosContext.dispatch({type:'filter_todos',payload:{doneStatus}})
    // const [state,dispatch] = useReducer(AppReducer,{
    //     todos: [],
    //     authenticated:false,
    //     userName : '' 
    // })
/*    return (
            <>
                <nav className="col-6 mb-3">
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <a className={`nav-item nav-link font-weight-bold ${!doneStatus ? 'active' : ''}`} id="nav-home-tab" onClick={changeStatus}>undone <span className=" badge rounded-pill bg-info">2</span></a>
                        <a className={`nav-item nav-link font-weight-bold ${doneStatus ? 'active' : ''}`} id="nav-profile-tab" onClick={changeStatus}>done <span className="badge rounded-pill bg-success">3</span></a>
                    </div>
                </nav>
                <TodoList />
            </>
    )
}
export default StateList*/