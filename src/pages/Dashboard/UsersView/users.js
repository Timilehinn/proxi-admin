import React, { useEffect, useState, useContext } from 'react'
import {AuthContext} from '../../../contexts/authContextApi'
import Header from '../../../components/DashHeader/DashHeader'
import SideBar from '../../../components/SideNav/SideBarNav';
import Disable from '../../../components/UserActions/disable';
import Approve from '../../../components/UserActions/approve';
import styles from './users.module.css'
import sharedStyle from '../../../components/Sharedstyle/shared.module.css'

import axios from 'axios'
import { FiUsers } from 'react-icons/fi'
import { GiShop } from 'react-icons/gi'
import { BsArrowRepeat } from 'react-icons/bs'
import { RiExchangeDollarFill } from 'react-icons/ri'
import { BiTransferAlt } from 'react-icons/bi'
import { url } from '../../../utils/urls'
import { DataGrid } from '@material-ui/data-grid'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from './modalListItem'
import { convertDate } from '../../../utils/date'
const Divider =(prop)=>{
    return (
        <div style={{height: '1px', width: '100%', backgroundColor: 'lightgrey', margin: '1rem'}}  />
    )
}

function UsersView() {
    const token = localStorage.getItem('mfa_token')
    const [ users, setUsers ] = useState([])
    const [ user, setUser ] = useState([])
    const [ selection, setSelection ] = useState([])
    const [ gettingUser, setGettingUser ] = useState(false)

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


    const styles = (theme) => ({
        root: {
          margin: 0,
          padding: theme.spacing(2),
        },
        closeButton: {
          position: 'absolute',
          right: theme.spacing(1),
          top: theme.spacing(1),
          color: theme.palette.grey[500],
        },
      });

    const handleSelection=(e)=>{
        console.log(e)
        setSelection(e)
    }

        // console.log(selection, ' seleection here')


    const columns = [
        // { field: '_id', headerName: 'ID', width: 90 },
        { field: 'fullName', headerName: 'Fullname', width: 150, description: 'Users name, view details', renderCell:(params)=>{
            return(
                <p style={{cursor: 'pointer'}} onClick={()=>{handleClickOpen(); handleUser(params.row._id)}}>{params.row.fullName}</p>
            )
        } },
        { field: 'accountType', headerName: 'Type', sortable: false, width: 90, editable: true },
        { field: 'email', headerName: 'Email', width: 150, sortable: false, editable: true, },
        { field: 'accountStatus',headerName: 'Status', sortable: false,width: 100, editable: true },
        { field: 'lastSeen', renderCell:(params)=>{
            return(
                <p>{convertDate(params.row.lastSeen)}</p>
            )
        },
         headerName: 'Last Seen', type: 'date', width: 160, editable: true },
        { field: 'date', renderCell:(params)=>{
            return(
                <p>{convertDate(params.row.date)}</p>
            )
        }, headerName: 'Date Joined', width: 160 },
    ];

    const fetchUsers =()=>{
        axios.get(`${url.baseUrl}v1/admin/get-all-users/users`, {
            headers: {
                'Authorization': 'Bearer ' + token
        }})
        .then(res=>{
            setUsers(res.data.users)
            setSelection([])
            handleClose()

        })
        .catch(err=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        fetchUsers()
    },[])

    const handleUser=(id)=>{
        setSelection([id])
        const userActivity = async () =>{
            setGettingUser(true)
            const res = await axios.get(`${url.baseUrl}v1/admin/get-user-activity/user/${id}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            if(res.data.status){
                setUser(res.data.user)
                setGettingUser(false)
            }else{
                console.log(res.data.message)
                setGettingUser(false)
          }
        }
        userActivity()
    }
    

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      setSelection([])
    };

    const DialogTitle = withStyles(styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
          <MuiDialogTitle disableTypography className={classes.root} {...other}>
            {onClose ? (
              <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                <CloseIcon />
              </IconButton>
            ) : null}
          </MuiDialogTitle>
        );
      });

    return (
        <>
            <Header />
            <main style={{display: 'flex', flexDirection: 'row'}}>
                <SideBar />
                <div className={sharedStyle.container} >
                    <div className={sharedStyle.grid_container} >
                        <div className={sharedStyle.grid_container_header}>
                            <h3 style={{margin: '.3rem'}}>Users</h3>
                            {selection.length> 0? (
                                <div style={{display: 'flex', alignItems: 'center' }}>
                                    <Approve selection={selection} setSelection={setSelection} fetchusers={fetchUsers} />
                                    <Disable selection={selection} setSelection={setSelection} fetchusers={fetchUsers} />
                                </div>
                            ):<></>}
                        </div>
                        <DataGrid
                            rows={users}
                            columns={columns}
                            pageSize={25}
                            checkboxSelection 
                            disableSelectionOnClick={true}
                            className={classes.root}
                            onSelectionModelChange={e => handleSelection(e)}
          
                        />
                        
                    </div>

                    {/* MODAL */}
                    <div>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        {gettingUser? <></>:(
                            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                                Modal title
                            </DialogTitle>
                        )}
                        
                        <br />
                            <DialogContent>
                                {gettingUser? <CircularProgress color="primary" />:(
                                    <div style={{display: 'flex', padding: '1rem', flexDirection: 'column', alignItems: 'center'}}>
                                        <div style={{width: '50px', marginBottom: '30px', textTransform: 'capitalize', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50px', border: '1px solid grey', borderRadius: '50%'}} >
                                            <h1>{user.fullName? user.fullName.substring(0,1):''}</h1>
                                        </div>
                                        <div style={{display: 'flex'}}>
                                            <Approve selection={selection} setSelection={setSelection} fetchusers={fetchUsers} />
                                            <Disable selection={selection} setSelection={setSelection} fetchusers={fetchUsers} />
                                        </div>
                                        
                                        <ListItem value={user?.fullName} label="Fullname" />
                                        <ListItem value={user?.email} label="Email" />
                                        <ListItem value={user?.phoneNumber} label="Phone" />
                                        <ListItem value={user?.accountStatus} label="Account Status" />
                                        <ListItem value={user?.transactions} label="Transactions" />
                                        <ListItem value={user?.orders} label="Orders" />
                                        <ListItem value={convertDate(user?.lastSeen)} label="Last Ative" />
                                    </div>
                                )}
                                
                            </DialogContent>
                        </Dialog>
                        </div>
                </div>
            </main>
        </>
    )
}

export default UsersView
