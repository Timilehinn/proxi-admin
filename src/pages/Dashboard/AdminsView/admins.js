import React, { useEffect, useState, useContext } from 'react'
import {AuthContext} from '../../../contexts/authContextApi'
import Header from '../../../components/DashHeader/DashHeader'
import SideBar from '../../../components/SideNav/SideBarNav';
import Disable from '../../../components/UserActions/disable';
import Approve from '../../../components/UserActions/approve';
import styles from './admins.module.css'
import sharedStyle from '../../../components/Sharedstyle/shared.module.css'
import axios from 'axios'
import { url } from '../../../utils/urls'
import { DataGrid } from '@material-ui/data-grid'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import { convertDate } from '../../../utils/date'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function AdminView() {
    const token = localStorage.getItem('mfa_token')
    const [ selection, setSelection ] = useState([])
    const [ admins, setAdmins ] = useState([]);
    const [ email, setEmail ] = useState('');
    const [snackOpen, setSnackOpen] = useState(false);
    const [ snackMsg, setSnackMsg ] = useState('')

    const useStyles = makeStyles({
        root: {
            '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
                outline: 'none',
            },
            "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
                display: "none"
            } 
        }
    });

    const classes = useStyles();
    const handleSelection=(e)=>{
        setSelection(e);
    }

    const columns = [
        // { field: '_id', headerName: 'ID', width: 90 },
        { field: 'fullName', headerName: 'Fullname', width: 150, description: 'Users name, view details'},
        // { field: 'accountType', headerName: 'Type', sortable: false, width: 90, editable: true },
        { field: 'email', headerName: 'Email', width: 150, sortable: false, editable: true, },
        { field: 'accountStatus',headerName: 'Status', sortable: false,width: 100, editable: true },
        { field: 'lastSeen', renderCell:(params)=>{
            return(
                <p>{convertDate(params.row.lastSeen)}</p>
            )
        }, headerName: 'Last Seen', type: 'date', width: 160, editable: true },
        { field: 'date', renderCell:(params)=>{
            return(
                <p>{convertDate(params.row.date)}</p>
            )
        }, headerName: 'Date Joined', width: 160 },
    ];

    const getAdmins =()=>{
        axios.get(`${url.baseUrl}/admin/get-all-users/admins`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res=>{
            setAdmins(res.data.admins)
            setSelection([])
            handleClose()

        })
        .catch(err=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        getAdmins()
    },[])

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
        setSelection([])
        setOpen(false);
    };

    const sendInvite = async () =>{
        axios.post(`${url.baseUrl}/admin/send-invite`,
            { email },
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
        )
        .then(res=>{
            openSnack();
            setSnackMsg(res.data.message);
            setEmail('')
        })
        .catch(err=>{
            openSnack();
            setSnackMsg('Something went wrong, Try again.');
            console.log(err)
        })
    }
    const openSnack=()=>{
        setSnackOpen(true);
    }

    const closeSnack=()=>{
        setSnackOpen(false);      
    }

    return (
        <>
            <Header title="Admins" />
            <Snackbar open={snackOpen} autoHideDuration={6000} onClose={closeSnack}>
                <Alert onClose={closeSnack} severity="info">
                    {snackMsg}
                </Alert>
            </Snackbar>
            <main style={{display: 'flex', flexDirection: 'row'}}>
                <SideBar />
                {/* <div className={styles.container}> */}
                <div className={sharedStyle.container}>
                    <div className={sharedStyle.grid_container}>
                        <div className={sharedStyle.grid_container_header}>
                            {selection.length> 0? (
                                <div style={{display: 'flex', alignItems: 'center' }}>
                                    <Approve selection={selection} setSelection={setSelection} fetchusers={getAdmins} />
                                    <Disable selection={selection} setSelection={setSelection} fetchusers={getAdmins} />
                                </div>
                            ):<></>}
                        </div>
                        <DataGrid
                            rows={admins}
                            columns={columns}
                            pageSize={25}
                            checkboxSelection 
                            disableSelectionOnClick={true}
                            className={classes.root}
                            onSelectionModelChange={e => handleSelection(e)}
          
                        />
                    </div>

                    <div className={styles.add}>
                         <h2>Add New Administrator</h2>
                         <form noValidate autoComplete="off">
                            <TextField type="email" onChange={e=>setEmail(e.target.value)} value={email} id="standard-basic" label="email" variant="outlined"  />
                            <Button onClick={()=>sendInvite()} style={{margin: '.5rem'}} variant="contained" color="primary" >
                                Invite
                            </Button>
                            <p style={{color: 'grey', fontSize: '.85rem'}}>Invite a new administrator by email </p>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default AdminView
