import React,{ useState, useEffect, useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import axios from 'axios'
import styles from './style.module.css'
import {AuthContext} from '../../contexts/authContextApi'
import { url } from '../../utils/urls'

  const ProtectedRoute = ({ component: Component, ...rest }) => {


    // const [auth, setAuth] = useState(false);
    const [isTokenValidated, setIsTokenValidated] = useState(false);
    const {auth, setAuth, setUserDetails} = useContext(AuthContext);

    function refreshValidatePage(){
      let token = localStorage.getItem("mfa_token");
      if (token) {
        axios.get(`${url.baseUrl}/auth/verifyjwt`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          // body: JSON.stringify({ token })
        })
        .then((res) => {
          return res
        })
        .then((json) => {
          if (json.data.authenticated) {
            setAuth(true);
            setUserDetails(json.data.details)
          }else{
            setAuth(false);
            localStorage.removeItem("mfa_token"); 
          }
        })
        .catch((err) => {
          setAuth(false);
          console.log(err)
          localStorage.removeItem("mfa_token");
        })
        .then(() => setIsTokenValidated(true));
      } else {
        setIsTokenValidated(true); // in case there is no token
      }
    }

    
      // send jwt to API to see if it's valid when navigating to a protected route
    useEffect(() => {
      refreshValidatePage();
  }, [])

 if (!isTokenValidated) return (
   <div className={styles.the_box}>
      <span className={styles.loader}></span>
   </div>
 )

  return (<Route {...rest}
    render={(props) => {
      return auth ? <Component {...props} /> : <Redirect to="/" />
    }} />)
  }
export default ProtectedRoute;