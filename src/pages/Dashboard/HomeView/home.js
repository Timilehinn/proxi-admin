import React, { useEffect, useState, useContext } from 'react'
import {AuthContext} from '../../../contexts/authContextApi'
import Header from '../../../components/DashHeader/DashHeader'
import SideBar from '../../../components/SideNav/SideBarNav';
import styles from './home.module.css';
import sharedStyle from '../../../components/Sharedstyle/shared.module.css'
import axios from 'axios';
import { FiUsers } from 'react-icons/fi'
import { GiShop } from 'react-icons/gi'
import { BsArrowRepeat } from 'react-icons/bs'
import { RiExchangeDollarFill } from 'react-icons/ri'
import { BiTransferAlt } from 'react-icons/bi'
import { url } from '../../../utils/urls'
import { useHistory } from 'react-router-dom'


function Home() {
    const history = useHistory()
    let token = localStorage.getItem("mfa_token");
    const { userDetails } = useContext(AuthContext);
    const [ users, setUsers ] = useState(0)
    const [ vendors, setVendors ] = useState(0)
    const [ dailyActiveUsers, setDailyActiveUsers ] = useState(0)
    const [ dailyActiveVendors, setDailyActiveVendors ] = useState(0)
    const [ transactions, setTransactions ] = useState([])
    
    useEffect(()=>{
        axios.get(`${url.baseUrl}v1/admin/all-users-count`, {
            headers: {
                'Authorization': 'Bearer ' + token
        }})
        .then(res=>{
            console.log(res.data.users)
            setUsers(res.data.users? res.data.users : 0)
            setVendors(res.data.vendors? res.data.vendors : 0)
            // alert(data.users.length)
        }) 
        .catch(err=>{
            console.log(err)
        })

        //daily active users and vendors
        axios.get(`${url.baseUrl}v1/admin/daily-active-users`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res=>{
            console.log(res.data, ' dailt active')
            setDailyActiveUsers(res.data.users? res.data.users : 0)
            setDailyActiveVendors(res.data.vendors? res.data.vendors : 0)
        })
        .catch(err=>{
            console.log(err)
        })

        //transactions
        axios.get(`${url.baseUrl}v1/admin/transactions`,{
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res=>{
            setTransactions(res.data.transactions)
        })
        .catch(err=>[
            console.log(err)
        ])
    },[])

    const navigate=(link)=>{
        history.push(link)
    }

    return (
        <>
        <Header />
        <main style={{display: 'flex', flexDirection: 'row'}}>
            <SideBar />
            <div className={styles.fluid}>
                <div className={styles.container}>
                    <div className={styles.box} onClick={()=>navigate('/dashboard/users')}>
                        <FiUsers color="grey" size="40" />
                        <span style={{fontWeight: 'bold'}}>{users}</span>
                        <span>Users</span>
                        <span style = {{fontSize: '.8rem'}}>active today: {dailyActiveUsers}</span>
                    </div>
                    <div className={styles.box} onClick={()=>navigate('/dashboard/vendors')}>
                        <GiShop color="grey" size="40" />
                        <span style={{fontWeight: 'bold'}}>{vendors}</span>
                        <span>Vendors</span>
                        <span style = {{fontSize: '.8rem'}}>active today: {dailyActiveVendors}</span>
                    </div>
                
                    <div className={styles.box}>
                        <BiTransferAlt color="grey" size="40" />
                        <span>Total Transactions</span>
                        <span>{transactions.count}</span>
                    </div>
                    <div className={styles.box}>
                        <span style={{color: 'grey', fontSize: '2.5rem', fontWeight: 'bold'}}>&#8358;</span>
                        <span>Total Amount</span>
                        <span>&#8358;{transactions.totalAmount}</span>
                    </div>
                </div>


                <div className={styles.container2}>
                    <p>Latest reports</p>
                    <div>lorem ipsum</div>
                    <div>lorem ipsum</div>
                    <div>lorem ipsum</div>
                    <span>view all reports</span>
                </div>
            </div>
            

        </main>
        </>
    )
}

export default Home
