import React from 'react';

const authContext = React.createContext({
    userName:'',
    authenticated : false,
    login : () => {},
    logout : () => {},
    setUserName : () => {}
})

export default authContext