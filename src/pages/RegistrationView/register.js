import React, { useState, useEffect } from 'react'
import styles from './register.module.css'
import axios from 'axios'
import {AuthContext} from '../../contexts/authContextApi'
import { url } from '../../utils/urls'
import { useHistory, Link } from 'react-router-dom'
import { RiAdminFill, RiEyeFill, RiEyeCloseLine } from 'react-icons/ri'
import { FaTimes } from 'react-icons/fa'

const Loader=()=>{
    return(
        <div className={styles.the_box}>
            <div className={styles.loader}></div>
        </div>
    )
    
}

function RegisterView(props) {
    const token = props.match?.params?.token
    const history = useHistory();
    const [isLoading , setIsLoading] = useState(false);
    const [ verified, setVerified ] = useState()
    const [ email, setEmail ] = useState('')
    const [ fullname, setFullname ] = useState('')
    const [ password, setPassword ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ inputType, setInputType ] = useState('password')
    const [ errorBox, setErrorBox ] = useState('none');
    const [ errMsg, setErrMsg ] = useState('')

    const Register = async (e)=>{
        e.preventDefault();
        setIsLoading(true)
        axios.post(`${url.baseUrl}v1/admin/register`, { email, password, phone, fullname })
        .then(res=>{
            if(res.data.status){
                setIsLoading(false)
                alert(res.data.message)
                history.push('/')
            }else{
                // alert(res.data.message);
                setErrorBox('flex')
                setErrMsg(res.data.message)
                setIsLoading(false)
            }
        })
        .catch(error=>{
            setErrorBox('flex')
            setIsLoading(false);
            const err = error
            if (err.response) {
                setErrMsg(err.response.data.message)
            }
            console.log(err)
        })
    }

    useEffect(()=>{
        verifyLink()
    },[])

    const verifyLink = async(req, res)=>{
        setIsLoading(true)
        axios.get(`${url.baseUrl}v1/admin/verify-invite`,
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).
        then(res=>{
            setVerified(res.data.status);
            setEmail(res.data.email)
            setIsLoading(false)
        })
        .catch(err=>{
            setVerified(false);
            setIsLoading(false)
        })
    }


    function showText(){
        setInputType('text')
    }

    function showPassword(){
        setInputType('password')
    }


    return (
        <main className={styles.main}>
            {/* {isLoading? <p>loading ...</p>: <></> }  */}

            {verified? (
                <>
                    <RiAdminFill size="50" color="rgb(21, 21, 226)" />
                    <p style={{textAlign:'center',color:"rgb(21, 21, 226)",marginTop:'1rem',marginBottom:'1rem',fontSize:'1.2rem'}}>
                        Register Account 
                    </p>
                    <form className={styles.form} onSubmit={(e)=>Register(e)}>
                        <div onClick={()=>setErrorBox('none')} style={{display:errorBox}} className={styles.error_box}>
                            <span>{errMsg}</span>
                            <FaTimes size={10} color="grey" style={{cursor:'pointer'}} onClick={()=>setErrorBox('none')} />
                        </div>
                        <input className={styles.form_input} value={email} disabled={true} required />
                        <input className={styles.form_input} placeholder="fullname" value={fullname} onChange={e=>setFullname(e.target.value)} required />
                        <span className={styles.span__form_input}> 
                            <input placeholder="password" required value={password} type={inputType} onChange={e=>setPassword(e.target.value)} />
                            {  inputType == 'password' ? <RiEyeCloseLine size='20' color="grey" style={{marginLeft:'-2.2rem',cursor:"pointer"}} onClick={showText} />  : <RiEyeFill size="20" color="blue" style={{marginLeft:'-2.2rem',cursor:"pointer"}} onClick={showPassword}  />}
                        </span>
                        <input className={styles.form_input} placeholder="phonenumber" value={phone} onChange={e=>setPhone(e.target.value)} required />
                        <button className={styles.btn}
                            disabled={isLoading? true: false}
                        >
                            <span>Register</span>
                            {isLoading? <Loader />:''}
                        </button>
                    </form>
                    <p style={{fontSize: '.8rem', color: 'grey'}}>Foodapp Admin Panel v1.0</p>
                </>
            ):(
                <div style={{ borderRadius: '1rem', textAlign: 'center', width: '200px', backgroundColor: 'rgb(248,208,200)', padding: '1rem', border: '.5px solid grey'}}>
                    <h3 style={{color: 'grey'}}>Invite Link expired</h3>
                    <p style={{fontSize: '.85rem', color: 'grey'}}>This invite link has expired, request for a new invitation or try again.</p>
                </div>
            )}
            
        </main>
    )
}

export default RegisterView
