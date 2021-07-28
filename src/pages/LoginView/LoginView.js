import React, { useState, useContext } from 'react'
// import styles from './loginview.css'
import axios from 'axios'
import {AuthContext} from '../../contexts/authContextApi'
import { url } from '../../utils/urls'
import { useHistory, Link } from 'react-router-dom'
function LoginView() {
    const history = useHistory();

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const { setAuth, setUserDetails } = useContext(AuthContext);

    const Login = async (e)=>{
        e.preventDefault();
        const res = await axios.post(`${url.baseUrl}v1/auth/login`, { email, password })
        if(res.data.status){
            localStorage.setItem("mfa_token", res.data.data.token);
            // setUserDetails(res.data.data.userData);
            setAuth(true);
            history.push('/dashboard/home')
        }else{
            setAuth(true);
        }
    }

    return (
        <div>
            <form onSubmit={(e)=>Login(e)}>
                <input placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                <input placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                <button>login</button>
            </form>
            
        </div>
    )
}

export default LoginView
