import React, { useReducer , lazy } from 'react';
//import 'bootstrap/dist/css/bootstrap.css'

//Import Components
import StateList from './Todo/StateList2';

//import Context 
import TodosContext from './../Context/TodosContext'
import AuthContext from './../Context/auth'

//import Reducers
import AppReducer from './../Reducers/AppReducer';
import Home from '../Routes/Home'

import {
    createBrowserRouter,
    RouterProvider,
    Routes,
    Route,
    Outlet
} from "react-router-dom";

const About = lazy(() => import('../Routes/About'));
const ContactUs = lazy(() => import('../Routes/ContactUs'));
const Header = lazy(() => import('./Layout/Header'));

function App() {

    const [state, dispatch] = useReducer(AppReducer, {
        todos: [],
        authenticated: false
    })


    return (
        <AuthContext.Provider value={{
            authenticated: state.authenticated,
            dispatch
        }}>
            <TodosContext.Provider value={{
                todos: state.todos,
                dispatch
            }}>
                <div className="App">
                    <Header />
                    <Outlet />
                    
                </div>
            </TodosContext.Provider>
        </AuthContext.Provider>
    )
}



export default App;

{/* <Routes>
<Route path="/" element={<Home />}></Route>
<Route path="/about" element={<About />}></Route>
</Routes> */}