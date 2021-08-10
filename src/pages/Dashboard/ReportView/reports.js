import React, { useEffect, useState, useContext } from 'react'
import {AuthContext} from '../../../contexts/authContextApi'
import Header from '../../../components/DashHeader/DashHeader'
import SideBar from '../../../components/SideNav/SideBarNav';
import styles from './report.module.css';
import sharedStyle from '../../../components/Sharedstyle/shared.module.css'
import axios from 'axios';
import { url } from '../../../utils/urls'
import { useHistory } from 'react-router-dom'
import { Doughnut } from 'react-chartjs-2';
import { formatCurrency } from '../../../utils/formatCurrency';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import moment from 'moment'


function Reports() {
    const history = useHistory()
    let token = localStorage.getItem("mfa_token");
    const { userDetails } = useContext(AuthContext);
    const [ users, setUsers ] = useState(0)
    const [ vendors, setVendors ] = useState(0)
    const [ dailyActiveUsers, setDailyActiveUsers ] = useState(0)
    const [ dailyActiveVendors, setDailyActiveVendors ] = useState(0)
    const [ transactions, setTransactions ] = useState([])
    const [ daily, setDaily ] = useState([])
    const [ weekly, setWeekly ] = useState([]);
    const [ day, setDay ] = useState(0);
    const [ week, setWeek ] = useState(0);
    const dayString = moment().subtract(parseInt(day), 'days').startOf('day');
    const weekStart = moment().subtract(parseInt(week), 'weeks').startOf('week');
    const weekEnd = moment().subtract(parseInt(week), 'weeks').endOf('week');

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
        axios.get(`${url.baseUrl}v1/admin/transaction-report/daily?day=${day}`, {
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
        axios.get(`${url.baseUrl}v1/admin/transaction-report/weekly?week=${week}`, {
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
    },[day, week])

    const viewDay=(cond)=>{
        if(cond == 'prev'){
            setDay(day + 1)
        }else if(cond == 'next' && day > 0){
            setDay(day - 1);
        }
    }

    const viewWeek=(cond)=>{
        if(cond == 'prev'){
            setWeek(week + 1)
        }else if(cond == 'next' && week > 0){
            setWeek(week - 1);
        }
    }

    const navigate=(link)=>{
        history.push(link)
    }

    return (
        <>
        <Header title="Reports" />
        <main style={{display: 'flex', flexDirection: 'row'}}>
            <SideBar />
            <div className={styles.fluid}>
                <div className={styles.container}>
                    <div className={styles.doughnut}>
                        <div className={styles.doughnut_header}>
                            <span onClick={()=>viewDay('prev')} className={styles.btn_arrow}><MdKeyboardArrowLeft /></span>
                            <h5 style={{color: 'grey'}}>{dayString.format("dddd, MMMM Do YYYY")}</h5>
                            <span onClick={()=>viewDay('next')} className={styles.btn_arrow}><MdKeyboardArrowRight /></span>
                        </div>
                        <div className={styles.doughnut_main}>
                            <Doughnut 
                                data={_daily}
                            />
                            <p>
                                Total amount: {formatCurrency(daily?.dailytotal?.credit + daily?.dailytotal?.debit)}
                            </p>
                        </div>
                    </div>

                    <div className={styles.doughnut}>
                        <div className={styles.doughnut_header}>
                            <span onClick={()=>viewWeek('prev')} className={styles.btn_arrow}><MdKeyboardArrowLeft /></span>
                            <h5 style={{color: 'grey'}}>{weekStart.format("dddd, MMMM Do") +' - '+ weekEnd.format("dddd, Do")}</h5>
                            <span onClick={()=>viewWeek('next')} className={styles.btn_arrow}><MdKeyboardArrowRight /></span>
                        </div>
                        <div className={styles.doughnut_main}>
                            <Doughnut 
                                data={_weekly}
                            />
                            <p>
                                Total amount: {formatCurrency(weekly?.weeklytotal?.debit + weekly?.weeklytotal?.credit)}
                            </p>
                        </div>
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

export default Reports;
