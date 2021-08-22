import React, { useEffect, useState, useContext } from 'react'
import Header from '../../../components/DashHeader/DashHeader'
import SideBar from '../../../components/SideNav/SideBarNav';
import styles from './category.module.css'
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


function CategoryView() {
    const token = localStorage.getItem('mfa_token')
    const [ categories, setCategories ] = useState([])
    const [selectionModel, setSelectionModel] = useState([]);

    const [ newCategory, setNewCategory ] = useState('');
    const [ category, setCategory ] = useState('');

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
        { field: 'date', headerName: 'Created', sortable: false, width: 200, editable: true },
    ];

    const getCategories =()=>{
        axios.get(`${url.baseUrl}/admin/categories`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res=>{
            setCategories(res.data.categories)
            setSelectionModel([])
            handleClose()
        })
        .catch(err=>{
            return toast.dark('An error occurred, please try again', _toast);
        })
    }

    useEffect(()=>{
        getCategories()
    },[])

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
        setSelectionModel([])
        setOpen(false);
    };

    const addNewCategory = () =>{
        if(!newCategory){
            return toast.dark('Enter category name', _toast);
        }
        axios.post(`${url.baseUrl}/admin/categories/add`,
        {
            newCategory, 
        },
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res=>{
            toast.dark(res.data.message, _toast);
            if(res.data.status){
                setNewCategory('')
                getCategories();
            }
        })
        .catch(err=>{
            return toast.dark('An error occurred, please try again', _toast); 
        })
    }

    const deleteCategory = () =>{
        axios.post(`${url.baseUrl}/admin/categories/delete/${selectionModel[0]}`,{},{
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res=>{
            toast.dark(res.data.message, _toast);
            if(res.data.status){
                getCategories();
            }
        })
        .catch(err=>{
            return toast.dark('An error occurred, please try again', _toast);
        })
    }

    const updateCategory = () =>{
        if(!category){
            return toast.dark('Enter a new name for this category', _toast);
        }
        axios.post(`${url.baseUrl}/admin/categories/update/${selectionModel[0]}`,{
            category
        },{
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res=>{
            toast.dark(res.data.message, _toast);
            if(res.data.status){
                handleClose()
                setNewCategory('')
                getCategories();
            }
        })
        .catch(err=>{
            return toast.dark('An error occurred, please try again', _toast);
        })
    }


    return (
        <>
            <ToastContainer />
            <Header title="Categories" />
            <main style={{display: 'flex', flexDirection: 'row'}}>
                <SideBar />
                {/* <div className={styles.container}> */}
                <div className={styles.container}>
                    <div className={styles.grid}>
                        <div className={styles.grid_header}>
                            <span>All Plans</span>
                            {selectionModel.length > 0 && (
                                <div>
                                    <span title="remove" onClick={()=>deleteCategory()} style={{cursor: 'pointer', marginLeft: '.5rem'}}><VscDiffRemoved /></span>
                                    <span title="update" onClick={handleOpen} style={{cursor: 'pointer', marginLeft: '.5rem'}}><AiOutlineEdit /></span>
                                </div>
                            )}
                            
                        </div>
                        <DataGrid
                            getRowId={(row) => row._id}
                            rows={categories}
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
                        <p>Add New Category</p>
                        <input value={newCategory} onChange={e=>setNewCategory(e.target.value)} placeholder= "category name" />
                        <button onClick={()=>addNewCategory()} style={{padding: '.5rem', border: '.5px solid lightgrey', backgroundColor: 'white'}}>add category</button>
                    </div>
                </div>
                    
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    {/* <DialogTitle id="form-dialog-title">Update Plan Details</DialogTitle> */}
                    <h3 style={{margin: '1.5rem'}}>Update category</h3>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="new name"
                            type="text"
                            fullWidth
                            value={category}
                            onChange={e=>setCategory(e.target.value)}
                            inputProps={{ maxLength: 30 }}
                            required
                        />
                        <span style={{fontSize:'.7rem',color:'grey'}}>{0 + category.length}/30</span>
                       
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={()=>updateCategory()}>
                        Update
                    </Button>
                    </DialogActions>
                </Dialog>
            </main>
        </>
    )
}

export default CategoryView
