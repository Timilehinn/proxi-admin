import React, { useEffect, useState, useContext } from 'react'
import {AuthContext} from '../../../contexts/authContextApi'
import Header from '../../../components/DashHeader/DashHeader'
import SideBar from '../../../components/SideNav/SideBarNav';
import Disable from '../../../components/UserActions/disable';
import Approve from '../../../components/UserActions/approve';
import styles from './vendors.module.css'
import sharedStyle from '../../../components/Sharedstyle/shared.module.css'
import axios from 'axios'
import { url } from '../../../utils/urls'
import { DataGrid } from '@material-ui/data-grid'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ListItem from './modalListItem'
import Test from '../../../assets/part2.png'
import { convertDate } from '../../../utils/date'


const ModalHeader = (prop)=>{
    return(
        <div style={{display: 'flex', width:'100%', marginBottom: '30px', alignItems: 'center', flexDirection: 'column'}}>
            <div style={{backgroundImage:`url(${url.baseUrl+prop.image})`, backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '150px', backgroundColor: 'white'}}>
            <h1 style={{color: 'grey'}}>{prop.image? '':'NO IMAGE' }</h1>
            </div>
            <div style={{textTransform: 'capitalize', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50px', border: '1px solid grey', marginTop: '-37.5px', width: '75px', height: '75px', backgroundColor: 'white', borderRadius: '50%'}} >
                <h1>{prop.letter}</h1>
            </div>
        </div>
    )
}

const Divider =(prop)=>{
    return (
        <div style={{height: '1px', width: '100%', backgroundColor: 'lightgrey', margin: '1rem'}}  />
    )
}

function VendorsView() {
    const token = localStorage.getItem('mfa_token')
    const [ vendors, setVendors ] = useState([])
    const [ vendor, setVendor ] = useState([])
    const [ details, setDetails ] = useState([])
    const [ foodmenu, setFoodmenu ] = useState([])
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


    const materialStyles = (theme) => ({
        root: {
          margin: 0,
          padding: theme.spacing(2),
          width: '100%',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
        closeButton: {
          position: 'absolute',
          right: theme.spacing(1),
          top: theme.spacing(1),
          color: theme.palette.grey[500],
        },
      });

    const handleSelection=(e)=>{
        setSelection(e)
    }

        // console.log(selection, ' seleection here')


    const columns = [
        // { field: '_id', headerName: 'ID', width: 90 },
        { field: 'fullName', headerName: 'Fullname', width: 150, description: 'Users name, view details', renderCell:(params)=>{
            return(
                <p style={{cursor: 'pointer'}} onClick={()=>{handleClickOpen(); handleVendor(params.row._id)}}>{params.row.fullName}</p>
            )
        } },
        { field: 'accountType', headerName: 'Type', sortable: false, width: 90, editable: true },
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

    const getVendors =()=>{
        axios.get(`${url.baseUrl}/admin/get-all-users/vendors`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res=>{
            setVendors(res.data.vendors)
            setSelection([])
            handleClose()

        })
        .catch(err=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        getVendors()
    },[])

    const handleVendor=(id)=>{
        setSelection([id])
        const vendorActivity = async () =>{
            setGettingUser(true)
            const res = await axios.get(`${url.baseUrl}/admin/get-user-activity/vendor/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            if(res.data.status){
                setVendor(res.data.vendor)
                setDetails(res.data.vendor?.basic_info)
                setFoodmenu(res.data.vendor?.foodmenu)
                setGettingUser(false)
            }else{
                setGettingUser(false)
          }
        }
        vendorActivity()
    }
    

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
        setSelection([])
        setOpen(false);
    };

    const DialogTitle = withStyles(materialStyles)((props) => {
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
            <Header title="Vendors" />
            <main style={{display: 'flex', flexDirection: 'row'}}>
                <SideBar />
                {/* <div className={styles.container}> */}
                <div className={sharedStyle.container}>
                    <div className={sharedStyle.grid_container}>
                        <div className={sharedStyle.grid_container_header}>
                            {selection.length> 0? (
                                <div style={{display: 'flex', alignItems: 'center' }}>
                                    <Approve selection={selection} setSelection={setSelection} fetchusers={getVendors} />
                                    <Disable selection={selection} setSelection={setSelection} fetchusers={getVendors} />
                                </div>
                            ):<></>}
                        </div>
                        <DataGrid
                            rows={vendors}
                            columns={columns}
                            pageSize={25}
                            checkboxSelection 
                            disableSelectionOnClick={true}
                            className={classes.root}
                            onSelectionModelChange={e => handleSelection(e)}
          
                        />
                    </div>

                    {/* MODAL */}
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        {gettingUser? <></>:( 
                            <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                                <IconButton aria-label="close" style={{width: 'auto'}} onClick={handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                            
                        )}
                         
                        <br />
                            <DialogContent style={{padding: '2rem' }} >
                                {gettingUser? <CircularProgress color="primary" />:(
                                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                        <ModalHeader 
                                            image={vendor?.details?.image}
                                            letter={vendor?.fullName? vendor?.fullName.substring(0,1):''}  
                                        />
                                        <div style={{display: 'flex'}}>
                                            <Approve selection={selection} setSelection={setSelection} fetchusers={getVendors} />
                                            <Disable selection={selection} setSelection={setSelection} fetchusers={getVendors} />
                                        </div>
                                        <ListItem value={vendor?.details?.name} label="Name" />
                                        <ListItem value={vendor?.details?.description} label="Description" />
                                        <ListItem value={vendor?.transactions} label="Transactions" />
                                        <ListItem value={vendor?.recieved_orders} label="Orders" />
                                        <ListItem value={convertDate(vendor?.lastSeen)} label="Last Active" />
                                        <Accordion style={{width: '100%'}}>
                                            <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                            style={{height: '50px'}}
                                            >
                                            <h5 className={classes.heading}>Foodmenu</h5>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                                                {vendor.foodmenu && vendor.foodmenu.map(f=>(
                                                    <p style={{margin: 0}}>{f.name}</p>
                                                ))}
                                            
                                            </div>

                                            </AccordionDetails>

                                        </Accordion>
                                    </div>
                                )}
                                
                            </DialogContent>
                        </Dialog>
                </div>
            </main>
        </>
    )
}

export default VendorsView
