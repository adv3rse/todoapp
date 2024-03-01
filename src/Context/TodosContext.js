import React from 'react';

const TodosContext = React.createContext({
    todos : [],
    add : () => {},
    edit : () => {},
    done : () => {},
    delete : () => {}
})


export default TodosContext