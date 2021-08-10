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
import { Doughnut } from 'react-chartjs-2';
import { formatCurrency } from '../../../utils/formatCurrency';



function Home() {
    const history = useHistory()
    let token = localStorage.getItem("mfa_token");
    const { userDetails } = useContext(AuthContext);
    const [ users, setUsers ] = useState(0)
    const [ vendors, setVendors ] = useState(0)
    const [ dailyActiveUsers, setDailyActiveUsers ] = useState(0)
    const [ dailyActiveVendors, setDailyActiveVendors ] = useState(0)
    const [ transactions, setTransactions ] = useState([])
    const [ daily, setDaily ] = useState([])
    const [ weekly, setWeekly ] = useState([])


    const _daily = {
        labels: [
            `Debits: ${formatCurrency(daily?.dailytotal?.debit)}`, 
            `Credits: ${formatCurrency(daily?.dailytotal?.credit)}`,
        ],
        datasets: [
          {
            label: 'Number of transactions',
            data: daily.daily,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1,
          },
        ],
    };

    const _weekly = {
        // labels: ['Debits', 'Credits'],
        labels: [
            `Debits: ${formatCurrency(weekly?.weeklytotal?.debit)}`, 
            `Credits: ${formatCurrency(weekly?.weeklytotal?.credit)}`,
        ],
        datasets: [
          {
            label: 'Number of transactions',
            data: weekly.weekly,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1,
          },
        ],
    };

    const dailyReport=()=>{
        axios.get(`${url.baseUrl}v1/admin/transaction-report/daily?day=0`, {
            headers: {
                'Authorization': 'Bearer ' + token
        }})
        .then(res=>{
            console.log(res.data)
            setDaily(res.data)
        })
        .catch(err=>{
            console.log(err);
            setDaily([0, 0])
        })
    }

    const weeklyReport=()=>{
        axios.get(`${url.baseUrl}v1/admin/transaction-report/weekly?week=0`, {
            headers: {
                'Authorization': 'Bearer ' + token
        }})
        .then(res=>{
            console.log(res.data)
            setWeekly(res.data)
        })
        .catch(err=>{
            setWeekly([0, 0])
            console.log(err)
        })
    }

    useEffect(()=>{
        dailyReport();
        weeklyReport();
    },[])


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
        <Header title="Home" />
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
                        <span>{transactions?.count}</span>
                    </div>
                    <div className={styles.box}>
                        <span style={{color: 'grey', fontSize: '2.5rem', fontWeight: 'bold'}}>&#8358;</span>
                        <span>Total Amount</span>
                        <span>{formatCurrency(transactions?.totalAmount)}</span>
                    </div>
                </div>


                <div className={styles.container2}>
                    <div>
                        <h3>Today: </h3>
                        <Doughnut 
                            data={_daily}
                        />
                        <p>
                            Total amount: {formatCurrency(daily?.dailytotal?.credit + daily?.dailytotal?.debit)}
                        </p>
                    </div>
                    <div>
                        <h3>This week</h3>
                        <Doughnut 
                            data={_weekly}
                        />
                        <p>
                            Total amount: {formatCurrency(weekly?.weeklytotal?.debit + weekly?.weeklytotal?.credit)}
                        </p>
                    </div>
                    {/* <span>
                        <h5>Transaction reports</h5>
                    </span> */}
                </div>
            </div>
            

        </main>
        </>
    )
}

export default Home
