import React, { useEffect, useState, useContext } from 'react'
import Header from '../../../components/DashHeader/DashHeader'
import SideBar from '../../../components/SideNav/SideBarNav';
import styles from './advert.module.css'
import axios from 'axios'
import { url } from '../../../utils/urls'
import { _convert64 } from '../../../utils/converters';
import { DataGrid } from '@material-ui/data-grid'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { TextField, Dialog, DialogContent, Button, DialogActions, Select, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { VscDiffRemoved } from 'react-icons/vsc';
import { AiOutlineEdit } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AdvertView() {
    const token = localStorage.getItem('mfa_token')
    const [ adverts, setAdverts ] = useState([])
    const [selectionModel, setSelectionModel] = useState([]);
    const [banner, setBanner] = useState();
    const [ title, setTitle ] = useState('');
    const [ status, setStatus ] = useState("active");
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
        { field: 'banner', headerName: 'Banner', width: 150, renderCell: (params) => {
            return <img src={`${url.photoUrl}${params.value}`} width={100} />
        }},
        { field: 'title', headerName: 'Title', width: 150 },
        { field: 'date', headerName: 'Created', sortable: false, width: 200, editable: true },
    ];

    const getAdverts =()=>{
        axios.get(`${url.baseUrl}/admin/adverts`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res=>{
            setAdverts(res.data.adverts)
            setSelectionModel([])
            handleClose()
        })
        .catch(err=>{
            return toast.dark('An error occurred, please try again', _toast);
        })
    }

    useEffect(()=>{
        getAdverts()
    },[])

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
        setSelectionModel([])
        setOpen(false);
    };

    const handleImageChange = (e) => {
        let filed = e.target.files[0];
        if (filed) {
            _convert64(e.target.files[0])
            .then((result) => {
                setBanner(result);
            })
            .catch(err => console.log(err) );
        }
    }

    const addNewAdvert = () =>{
        if(!title){
            return toast.dark('Enter advert title', _toast);
        }

        if(!banner){
            return toast.dark('Add advert banner', _toast);
        }

        axios.post(`${url.baseUrl}/admin/adverts/add`,
        {
            title, 
            banner,
            status
        },
        {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res=>{
            toast.dark(res.data.message, _toast);
            if(res.data.status){
                setTitle('')
                setBanner('')
                getAdverts();
            }
        })
        .catch(err=>{
            return toast.dark('An error occurred, please try again', _toast); 
        })
    }

    const deleteAdvert = () =>{
        axios.post(`${url.baseUrl}/admin/adverts/delete/${selectionModel[0]}`,{},{
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res=>{
            toast.dark(res.data.message, _toast);
            if(res.data.status){
                getAdverts();
            }
        })
        .catch(err=>{
            return toast.dark('An error occurred, please try again', _toast);
        })
    }

    const updateAdvert = () =>{
        if(!title){
            return toast.dark('Enter advert title', _toast);
        }

        if(!banner){
            return toast.dark('Add advert banner', _toast);
        }

        axios.post(`${url.baseUrl}/admin/adverts/update/${selectionModel[0]}`,{
            title,
            banner,
            status
        },{
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res=>{
            toast.dark(res.data.message, _toast);
            if(res.data.status){
                handleClose()
                setTitle('')
                setBanner('')
                getAdverts();
            }
        })
        .catch(err=>{
            return toast.dark('An error occurred, please try again', _toast);
        })
    }


    return (
        <>
            <ToastContainer />
            <Header title="Adverts" />
            <main style={{display: 'flex', flexDirection: 'row'}}>
                <SideBar />
                {/* <div className={styles.container}> */}
                <div className={styles.container}>
                    <div className={styles.grid}>
                        <div className={styles.grid_header}>
                            <span>Ads</span>
                            {selectionModel.length > 0 && (
                                <div>
                                    <span title="remove" onClick={()=>deleteAdvert()} style={{cursor: 'pointer', marginLeft: '.5rem'}}><VscDiffRemoved /></span>
                                    <span title="update" onClick={handleOpen} style={{cursor: 'pointer', marginLeft: '.5rem'}}><AiOutlineEdit /></span>
                                </div>
                            )}
                            
                        </div>
                        <DataGrid
                            getRowId={(row) => row._id}
                            rows={adverts}
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
                        <p>Create New Advert</p>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder= "Advert Name" style={{minHeight: 45}} />
                        <select style={{minHeight: 45, backgroundColor: "transparent"}}  onChange={e => setStatus(e.target.value)}>
                            <option value="active">Activate</option>
                            <option value="inactive">Disable</option>
                        </select>
                        <div style={{maxHeight: 300, width: "auto" }}>
                            <img src={banner ? banner : ""} style={{maxHeight: '100%'}}  />
                        </div>
                        <label>
                            <div style={{height: 20, width: 200, backgroundColor: '#fea204', padding: 10, marginBottom: 10, textAlign: "center"}}>
                                <span>{banner ? "Change" : "Add"} Advert Banner</span>
                            </div>
                            <input type="file" name="categoryImage" onChange={handleImageChange} style={{display: "none"}} />
                        </label>
                        <button onClick={()=> addNewAdvert()} style={{color: 'white', backgroundColor: 'rgb(13, 13, 160)', padding: '.5rem', borderRadius: '.2rem', border: '0px', fontWeight: 'bold', cursor: 'pointer'}}>Create Advert</button>
                    </div>
                </div>
                    
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    {/* <DialogTitle id="form-dialog-title">Update Plan Details</DialogTitle> */}
                    <h3 style={{margin: '1.5rem'}}>Update Advert</h3>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Advert Name"
                            type="text"
                            fullWidth
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            inputProps={{ maxLength: 30 }}
                            required
                        />
                        <span style={{fontSize:'.7rem',color:'grey'}}>{0 + title.length}/30</span>

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                value={status}
                                label="Status"
                                onChange={e => setStatus(e.target.value)}
                            >
                                <MenuItem value={"active"}>Activate</MenuItem>
                                <MenuItem value={"inactive"}>Disable</MenuItem>
                            </Select>
                            </FormControl>

                        <div>
                            <div style={{maxHeight: "auto", width: 300 }}>
                                <img src={banner ? banner : ""} style={{maxHeight: '100%'}}  />
                            </div>
                            <label>
                                <div style={{height: 20, width: 200, backgroundColor: '#fea204', padding: 10, marginBottom: 10, textAlign: "center"}}>
                                    <span>{banner ? "Change" : "Add"} Advert Banner</span>
                                </div>
                                <input type="file" name="categoryImage" onChange={handleImageChange} style={{display: "none"}} />
                            </label>
                        </div>
                       
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={()=>updateAdvert()}>
                        Update
                    </Button>
                    </DialogActions>
                </Dialog>
            </main>
        </>
    )
}

export default AdvertView
