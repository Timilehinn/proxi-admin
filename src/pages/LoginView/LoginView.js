import React, { useState, useContext } from 'react'
import styles from './loginview.module.css'
import axios from 'axios'
import {AuthContext} from '../../contexts/authContextApi'
import { url } from '../../utils/urls'
import { useHistory, Link } from 'react-router-dom'
import { RiUser6Line } from 'react-icons/ri'
import { FaTimes } from 'react-icons/fa'

const Loader=()=>{
    return(
        <div className={styles.the_box}>
            <div className={styles.loader}></div>
        </div>
    )
    
}

function LoginView() {
    const history = useHistory();
    const [isLoading , setIsLoading] = useState(false);
    const [ errorBox, setErrorBox ] = useState('none')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const { setAuth, setUserDetails } = useContext(AuthContext);
    const Login = async (e)=>{
        e.preventDefault();
        setIsLoading(true)
        axios.post(`${url.baseUrl}v1/auth/login`, { email, password })
        .then(res=>{
            localStorage.setItem("mfa_token", res.data.data.token);
            setAuth(true);
            setIsLoading(false)
            history.push('/dashboard/home')
        })
        .catch(err=>{
            history.push('/')
            setIsLoading(false)
            setAuth(true);
            setErrorBox()
            console.log(err)
        })
    }

    return (
        <main className={styles.main}>
            <RiUser6Line size="70" color="rgb(21, 21, 226)" />
            <p style={{textAlign:'center',color:"rgb(21, 21, 226)",marginTop:'1rem',marginBottom:'1rem',fontSize:'1.2rem'}}>
                Login as Admin. 
            </p>
            <form className={styles.form} onSubmit={(e)=>Login(e)}>
                <div onClick={()=>setErrorBox('none')} style={{display:errorBox}} className={styles.error_box}>
                    <span>Invalid email and or password.</span>
                    <FaTimes size={10} color="grey" style={{cursor:'pointer'}} onClick={()=>setErrorBox('none')} />
                </div>
                <input placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                <input placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                <button className={styles.btn}>
                    <span>login</span>
                    {isLoading? <Loader />:''}
                </button>
            </form>
            <p style={{fontSize: '.8rem', color: 'grey'}}>Foodapp Admin Panel v1.0</p>
        </main>
    )
}

export default LoginView
