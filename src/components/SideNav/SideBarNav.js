import React from 'react'
import styles from './sidenav.module.css';
import { FiUsers, FiLogOut } from 'react-icons/fi'
import { MdReport } from 'react-icons/md'
import { AiFillSetting } from 'react-icons/ai'
import { GiShop } from 'react-icons/gi'
import { RiDashboardFill, RiAdminFill } from 'react-icons/ri' 
import { Link, useHistory } from 'react-router-dom'


export default function SideBar(){
    const history = useHistory();
    const active = {
        padding:'.7rem',
        backgroundColor:'rgb(226,225,225)',
        cursor:'default'
    }

    const logOut=()=>{
        localStorage.removeItem('mfa_token');
        history.push('/')
    }
    return(
        <div className={styles.sidebar}>
            <Link style={{color: 'grey', textDecoration: 'none'}} to="/dashboard/home">
                <p>
                        <RiDashboardFill color="white" 
                        style={{paddingRight:'5px'}}/>Home
                </p>
            </Link>

            <Link style={{color: 'grey', textDecoration: 'none'}} to="/dashboard/users">
                <p>
                    <FiUsers color="white" 
                    style={{paddingRight:'5px'}}/>Users
                </p>
            </Link>

            <Link style={{color: 'grey', textDecoration: 'none'}} to="/dashboard/vendors">
                <p>
                    <GiShop color="white" 
                    style={{paddingRight:'5px'}}/>Vendors
                </p>
            </Link>
            
            <p>
                <RiAdminFill color="white" 
                style={{paddingRight:'5px'}}/>Admins
            </p>
            <div style={{height:'1px', backgroundColor:"lightgrey"}} />
            <p>
                <MdReport color="white" style={{paddingRight:'5px'}}/>Reports
            </p>
            <p>
                <AiFillSetting color="white" style={{paddingRight:'5px'}}/>Roles and Priviledges
            </p>
            <div style={{height:'1px', backgroundColor:"lightgrey"}} />
            <p style={{color: 'orange'}} onClick={logOut}>
                <FiLogOut color="orange" style={{paddingRight:'5px'}}/>Logout
            </p>
        </div>
    )
} 