import React, { Component, useContext, useState } from 'react';
import AuthContext from './../../Context/auth'
import TodosContext from './../../Context/auth'
import {Link,useLocation,NavLink} from 'react-router-dom';
//import { Button } from 'bootstrap';
//import 'bootstrap/dist/css/bootstrap.css';
function Header() {

    const todosContext = useContext(TodosContext);
    const authContext = useContext(AuthContext);
    const location = useLocation()

    let doLogin = () => authContext.dispatch({ type: 'login_user' });
    let doLogout = () => authContext.dispatch({ type: 'logout_user' });

    return (
        <header>
            <div className="navbar navbar-dark bg-dark shadow-sm">
                <div className="container d-flex justify-content-between">

                    <nav className="navbar">
                        <div className="container-fluid">
                            <a href="#" className="navbar-brand d-flex align-items-center">
                                <strong>Todo App</strong>
                            </a>
                            <ul className="nav">
                                <li className="nav-item active"><NavLink className={({ isActive, isPending }) =>
                      isActive
                        ? "text-white nav-link active"
                        : isPending
                        ? "text-white nav-link pending"
                        : "text-white nav-link"
                    } to="/">Home</NavLink></li>
                                <li className="nav-item"><NavLink className={({ isActive, isPending }) =>
                      isActive
                        ? "text-white nav-link active"
                        : isPending
                        ? "text-white nav-link pending"
                        : "text-white nav-link"
                    } to={{ pathname: "/about",
                                search:"name=hesam"}}>About</NavLink></li>
                                <li className="nav-item"><NavLink className={({ isActive, isPending }) =>
                      isActive
                        ? "text-white nav-link active"
                        : isPending
                        ? "text-white nav-link pending"
                        : "text-white nav-link"
                    } to={`/contact-us` + location.search}>Contact us</NavLink></li>
                            </ul>
                        </div>
                    </nav>
                    {
                        !authContext.authenticated
                            ? <button className="btn btn-sm btn-success" onClick={doLogin}>login</button>
                            : <button className="btn btn-sm btn-danger" onClick={doLogout}>logout</button>
                    }
                </div>
            </div>
        </header>
    )
}


export default Header;