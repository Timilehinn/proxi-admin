import React,{ useState, createContext } from 'react'


export const AuthContext = createContext();

function AuthContextApi(props) {

    const [ auth, setAuth ] = useState(false);
    const [ userDetails, setUserDetails ] = useState([]);

    const allValues = {auth, setAuth, userDetails, setUserDetails };
     
    
    return (
        <AuthContext.Provider value={allValues} >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextApi
