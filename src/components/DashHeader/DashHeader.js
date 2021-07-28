import React, { useContext, useState } from 'react'
import styles from './dashheader.module.css'
import {AuthContext} from '../../contexts/authContextApi'
import { FaBell, FaTimes } from 'react-icons/fa'
import { FiUsers, FiLogOut } from 'react-icons/fi'
import { MdReport } from 'react-icons/md'
import { AiFillSetting } from 'react-icons/ai'
import { GiShop } from 'react-icons/gi'
import { RiDashboardFill, RiAdminFill } from 'react-icons/ri' 
import { Link, useHistory } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SideBar from '../SideNav/SideBarNav';


function DashHeader() {
    const history = useHistory()
    const [ showSideBar, setShowSideBar ] = useState(-100);
    const [ backModal, showBackModal ] = useState('hidden');
    const [ dropDownDisplay, setDropDownDisplay ] = useState('none')
    const [ dropDownBack, setDropDownBack ] = useState('none')
    const { userDetails } = useContext(AuthContext)

    const logOut=()=>{
        localStorage.removeItem('mfa_token');
        history.push('/')
    }

    const closeDrawer = ()=>{
        setShowSideBar(-100); 
        showBackModal('hidden');
    }
    const openDrawer=()=>{
        setShowSideBar(0); 
        showBackModal('visible')
    }

    return (
        <>
            <div className={styles.navbar}>
                    <div className={styles.menubars} onClick={openDrawer}>
                        <div /><div /><div />
                    </div>
                    <div className={styles.nav_col1}>
                        <h3 className={styles.logo}>FoodApp</h3>
                        <Link to="/home" style={{color:'black',textDecoration:'none'}}>
                            <h4 style={{color:'grey'}}>Admin</h4>
                        </Link>
                    </div>
                    <div className={styles.navitems}>
                        <span><FaBell /></span>
                        <span><h3>{userDetails.email}</h3></span>
                    </div>
            </div>

            <div className={styles.sideBar}  style={{zIndex:'1',overflowX:'scroll',transform:`translateX(${showSideBar}%)`}}>
                <div className={styles.sidebar_inner_container}>
                    <div className={styles.cancel}>
                        <h2 style={{color: 'white'}}>FoodApp</h2>
                        <IconButton aria-label="close" style={{width: 'auto'}} onClick={closeDrawer}>
                            <CloseIcon style={{color: 'white'}} />
                        </IconButton>
                    </div>
                    <Link style={{color: 'white', textDecoration: 'none'}} to="/dashboard/home">
                        <p>
                            <RiDashboardFill color="white" 
                            style={{paddingRight:'5px'}}/>Home
                        </p>
                    </Link>

                    <Link style={{color: 'white', textDecoration: 'none'}} to="/dashboard/users">
                        <p>
                            <FiUsers color="white" 
                            style={{paddingRight:'5px'}}/>Users
                        </p>
                    </Link>

                    <Link style={{color: 'white', textDecoration: 'none'}} to="/dashboard/vendors">
                        <p>
                            <GiShop color="white" 
                            style={{paddingRight:'5px'}}/>Vendors
                        </p>
                    </Link>
                    
                    <p style={{color: "white"}}><RiAdminFill color="white" style={{paddingRight:'5px'}}/>Admins</p>
                    <div style={{height:'1px', backgroundColor:"lightgrey"}} />
                    <p style={{color: "white"}}><MdReport color="white" style={{paddingRight:'5px'}}/>Reports</p>
                    <p style={{color: "white"}}><AiFillSetting color="white" style={{paddingRight:'5px'}}/>Roles and Priviledges</p>
                    <p style={{color: 'orange'}} onClick={logOut}>
                        <FiLogOut color="orange" style={{paddingRight:'5px'}}/>Logout
                    </p>
                </div>
            </div>
            <div className={styles.backmodal} onClick={()=>{setShowSideBar(-100); showBackModal('hidden')}} style={{visibility:backModal}}></div>
            <div className={styles.dropdownback} onClick={()=>{setDropDownDisplay('none'); setDropDownBack('none')}} style={{display:dropDownBack}}></div>
        </>
    )
}

export default DashHeader
