import React,{ useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios'
import { useHistory } from 'react-router';
import LinearProgress from '@material-ui/core/LinearProgress';
import { FaTrashAlt } from 'react-icons/fa' 
import { url } from '../../utils/urls'


function Disable(props) {
    let token = localStorage.getItem('mfa_token');
    const [ isDeleting, setIsDeleting ] = useState(false)
    console.log(props.selection, ' disable finction');
    // const [ selection, setSelection ] = useState(props.selection)
    const history = useHistory()
    const [open, setOpen] = useState(false);
    const toastsettings ={
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: false,
    }
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setIsDeleting(false)
        setOpen(false);
    };

    const disableUsers=async()=>{
        let token = localStorage.getItem("mfa_token");
        setIsDeleting(true)
        const res = await axios.post(`${url.baseUrl}/admin/disable-users`,
        {ids: props.selection},{
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        if(res.data.status){
            props.fetchusers()
            props.setSelection([])
            setIsDeleting(false);
            // setSelection([])
        }else{
            setIsDeleting(false)
        }
    }
    useEffect(()=>{

    },[])
    return (
        <>
        <div>
            <label onClick={handleClickOpen} style={{fontSize: '.8rem', border:"1px solid cyan",cursor:'pointer',padding:'.5rem',border:'1px solid lightgrey',display:'flex',alignItems:'center'}}>
                    Disable
            </label>
                
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            { isDeleting? <LinearProgress/>:'' }
                <DialogTitle id="form-dialog-title">Disable</DialogTitle>
                <DialogContent>
                Disable {props.selection.length} selected users(s). Proceed?
                </DialogContent>
                <DialogActions>
                <Button style={{textTransform:'capitalize'}} onClick={handleClose}>
                    Cancel
                </Button>
                <Button style={{textTransform:'capitalize'}} onClick={()=>disableUsers()}>
                    Proceed
                </Button>
                </DialogActions>
            </Dialog>
        </div>
            
      </>
    )
}

export default Disable