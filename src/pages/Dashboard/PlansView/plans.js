import React, { useEffect, useState, useContext } from 'react'
import Header from '../../../components/DashHeader/DashHeader'
import SideBar from '../../../components/SideNav/SideBarNav';
import styles from './plans.module.css'
import axios from 'axios'
import { url } from '../../../utils/urls'
import { DataGrid } from '@material-ui/data-grid'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { VscDiffRemoved } from 'react-icons/vsc';
import { AiOutlineEdit } from 'react-icons/ai'
import DialogActions from '@material-ui/core/DialogActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function PlansView() {
    const token = localStorage.getItem('mfa_token')
    const [ plans, setPlans ] = useState([])
    const [selectionModel, setSelectionModel] = useState([]);
    const [ gettingPlan, setGettingPlan ] = useState(false)

    const [ planName, setPlanName ] = useState('');
    const [ planAmount, setPlanAmount ] = useState(0);

    const [ newPlanName, setNewPlanName ] = useState('');
    const [ newPlanAmount, setNewPlanAmount ] = useState(0);
    const _toast = {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true, 
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
    }
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


    const columns = [
        // { field: '_id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'plan', width: 150, renderCell: (params) => {
            <span>{params.row.name}</span>
        }},
        { field: 'amountPerMeal', headerName: 'amount per meal', sortable: false, width: 200, editable: true },
    ];

    const getPlans =()=>{
        axios.get(`${url.baseUrl}/admin/plans`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res=>{
            setPlans(res.data.plans)
            setSelectionModel([])
            handleClose()
        })
        .catch(err=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        getPlans()
    },[])

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
        setSelectionModel([])
        setOpen(false);
    };

    const addNewPlan = () =>{
        if(newPlanName === '' ){
            return toast.dark('Enter a plan name to proceed', _toast);
        }
        if(newPlanAmount < 500){
            return toast.dark('Plan amount should be atleast N500', _toast);
        }

        axios.post(`${url.baseUrl}/admin/plans/add`,
        {
            newPlanName, 
            newPlanAmount
        },
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res=>{
            toast.dark(res.data.message, _toast);
            if(res.data.status){
                setNewPlanAmount(0);
                setNewPlanName('')
                getPlans();
            }
        })
        .catch(err=>{
            return toast.dark('An error occurred, please try again', _toast);
        })
    }

    const deletePlan = () =>{
        axios.post(`${url.baseUrl}/admin/plans/delete/${selectionModel[0]}`,{},{
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res=>{
            toast.dark(res.data.message, _toast);
            if(res.data.status){
                getPlans();
            }
        })
        .catch(err=>{
            return toast.dark('An error occurred, please try again', _toast);
        })
    }

    const updatePlan = () =>{
        if(planName === '' ){
            return toast.dark('Enter a new plan name to proceed', _toast);
        }
        if(planAmount < 500){
            return toast.dark('Amount should be atleast N500',_toast);
        }
        axios.post(`${url.baseUrl}/admin/plans/update/${selectionModel[0]}`,{
            planName, planAmount
        },{
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res=>{
            toast.dark(res.data.message, _toast);
            if(res.data.status){
                handleClose()
                setPlanAmount(0)
                setPlanName('')
                getPlans();
            }
        })
        .catch(err=>{
            return toast.dark('An error occurred, please try again', _toast);
        })
    }


    return (
        <>
            <ToastContainer />
            <Header title="Plans" />
            <main style={{display: 'flex', flexDirection: 'row'}}>
                <SideBar />
                {/* <div className={styles.container}> */}
                <div className={styles.container}>
                    <div className={styles.grid}>
                        <div className={styles.grid_header}>
                            <span>All Plans</span>
                            {selectionModel.length > 0 && (
                                <div>
                                    <span title="remove" onClick={()=>deletePlan()} style={{cursor: 'pointer', marginLeft: '.5rem'}}><VscDiffRemoved /></span>
                                    <span title="update" onClick={handleOpen} style={{cursor: 'pointer', marginLeft: '.5rem'}}><AiOutlineEdit /></span>
                                </div>
                            )}
                            
                        </div>
                        <DataGrid
                            getRowId={(row) => row._id}
                            rows={plans}
                            columns={columns}
                            pageSize={10}
                            checkboxSelection
                            selectionModel={selectionModel}
                            className={classes.root}
                            hideFooterSelectedRowCount
                            onSelectionModelChange={(selection) => {
                            const newSelectionModel = selection;

                            if (newSelectionModel.length > 1) {
                                const selectionSet = new Set(selectionModel);
                                const result = newSelectionModel.filter(
                                (s) => !selectionSet.has(s)
                                );
                                setSelectionModel(result);
                            } else {
                                setSelectionModel(newSelectionModel);
                            }
                            }}
                            // onSelectionModelChange={e => handleSelection(e)}
                        />
                    </div>
                    <div className={styles.addplan} >
                        <p>Add New Plan</p>
                        <input value={newPlanName} onChange={e=>setNewPlanName(e.target.value)} placeholder= "plan name" />
                        <input value={newPlanAmount} onChange={e=>setNewPlanAmount(e.target.value)} placeholder="amount per meal" type="number" />
                        <button onClick={()=>addNewPlan()} style={{color: 'white', backgroundColor: 'rgb(13, 13, 160)', padding: '.5rem', borderRadius: '.2rem', border: '0px', fontWeight: 'bold', cursor: 'pointer'}}>Add Plan</button>
                    </div>
                </div>
                    
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    {/* <DialogTitle id="form-dialog-title">Update Plan Details</DialogTitle> */}
                    <h3 style={{margin: '1.5rem'}}>Update plan details</h3>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="new name"
                            type="text"
                            fullWidth
                            value={planName}
                            onChange={e=>setPlanName(e.target.value)}
                            inputProps={{ maxLength: 25 }}
                            required
                        />
                        <span style={{fontSize:'.7rem',color:'grey'}}>{0 + planName.length}/25</span>

                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="new amount"
                            type="number"
                            fullWidth
                            value={planAmount}
                            onChange={e=>setPlanAmount(e.target.value)}
                            inputProps={{ maxLength: 25 }}
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={()=>updatePlan()}>
                        Update
                    </Button>
                    </DialogActions>
                </Dialog>
            </main>
        </>
    )
}

export default PlansView
