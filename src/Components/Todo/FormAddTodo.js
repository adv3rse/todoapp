import React from 'react';
import TodosContext from './../../Context/TodosContext'
import AuthContext from './../../Context/auth'
import bootstrap from 'bootstrap/dist/css/bootstrap.css'
/*function FormAddTodo(props) {
    const [text, setText] = useState('');
    const todosContext = useContext(TodosContext)
    console.log('todosContext = '+todosContext)
    let formHandler = (e, context) => {
        e.preventDefault();
        todosContext.add(text)
        setText('')
    }

    let inputHandler = e => setText(e.target.value)

    return (
            <form className="form-inline" onSubmit={formHandler}>
                <div className="row">
                    <button type="submit" className="col mx-3 mb-3 btn btn-primary btn-sm ">add</button>
                    <input value={text} type="text" className="col form-control mb-3" placeholder="i want to do ..." onChange={inputHandler} />
                </div>
            </form>
    )
}
export default FormAddTodo*/
import todosApi from './../Api/todos';

class FormAddTodo extends React.Component {
    state = { text: '' }
    static contextType = TodosContext;

    formHandler(e) {
        e.preventDefault();
        let todo = {text: this.state.text, done: false};
        //const axios = require('axios');
        if(this.state.text.length > 1){
            todosApi.post('https://test-react-82198-default-rtdb.firebaseio.com/todos.json',todo)
                .then(response => this.context.dispatch({ type: 'add_todo', payload: { todo :{...todo,key : response.data.name} } }))
                .catch(error => console.log(error));
            this.setState({ text: '' })
        }
    }


    inputHandler(e) { this.setState({ text: e.target.value }) }

    render() {
        return (
            <AuthContext.Consumer>
                {context => (
                    <>
                        {
                            context.authenticated
                                ? (
                                    <form className="form-inline" onSubmit={this.formHandler.bind(this)}>
                                        <div className="form-group">
                                            <input type="text" className="form-control mx-sm-3" placeholder="i want to do ..." value={this.state.text} onChange={this.inputHandler.bind(this)} />
                                            <button type="submit" className="btn btn-primary">add</button>
                                        </div>
                                    </form>
                                )
                                : <p>You must be login</p>
                        }
                    </>
                )
                }
            </AuthContext.Consumer>
        )
    }
}


export default FormAddTodo;