import './Write.css'
import {useState} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import List from '@mui/material/List';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import { ListItem } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemText from '@mui/material/ListItemText';
import MergeIcon from '@mui/icons-material/Merge';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {TextField} from '@mui/material';
import AWS from 'aws-sdk'
AWS.config.update({
    accessKeyId:process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey:process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION, 



})
const polly=new AWS.Polly();
export default function Write(){
    const [char, setChar] = useState('');
    const [notesName, setNotesName] = useState('');
    const [open, setOpen] = React.useState(false);
    const [notes, setNotes] = useState([]);
    const [selectedNotes, checkedNotes] = useState([]);
    const [notesCreated, setNotesCreated] = useState(false);
    const [merge, setMerge] = useState([]);
    const [openAlert, setOpenAlert] = React.useState(false);
    const navigate = useNavigate();
    const [nameToMerge, setMergeNotesName] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
 
  const synthesizeSpeech = () => {
    const params = {
      Text: char,
      OutputFormat: 'mp3',
      VoiceId: 'Joanna', 
    };




    
        polly.synthesizeSpeech(params, (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
      
            const uInt8Array = new Uint8Array(data.AudioStream);
            const blob = new Blob([uInt8Array.buffer], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
          });
    
        }

    
    
    console.log(selectedNotes);
    console.log("mergenotes", merge);
  
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
  
    const handleClose = () => {
        if (nameToMerge.length === 0) {
            setOpenAlert(true);
            
            //setValidation(true);
        } else {
            setOpenAlert(false);
        }
    };
  
    const setSelectedNotes = (isChecked, val) => {
        console.log(isChecked, val);
   
        if (isChecked !== false) {
            if (selectedNotes.indexOf(val) === -1) {
                checkedNotes((prev) => [...prev, val]);
                setMerge((prev) => [...prev, val]);
            }
        } else {
            const index = selectedNotes.indexOf(val);
            const notesInMerge = merge.indexOf(val);
            selectedNotes.splice(index, 1);
            merge.splice(notesInMerge, 1);
        }
        console.log(selectedNotes);
        console.log(merge);
    };
  
    React.useEffect(() => {
        console.log(selectedNotes);
    }, [selectedNotes]);
  
    const getNoOfBooks = () => {
        const items = localStorage;
        const values = Object.entries(items);
        const res = values.map((d, i) => d[0]);
        setNotes(res);
    };
  
    const deleteNotes = () => {
        navigate(0);
        for (let i = 0; i < selectedNotes.length; i++) {
            localStorage.removeItem(selectedNotes[i]);
        }
        getNoOfBooks();
    };
  
    const editNotes = () => {
        const getData = localStorage.getItem(selectedNotes);
        setChar(getData);
        setNotesName(selectedNotes);
    };
  
    const mergeTwoNotes = () => {
        setOpenAlert(true);
        if(nameToMerge.length===0)
        {
          toast.error("Name should not empty")
        }
        else{
        const items = merge.map(d => localStorage.getItem(d));
        let content = '';
        for (let i = 0; i < items.length; i++) {
            content += localStorage.getItem(merge[i]);
            localStorage.removeItem(merge[i]);
        }
        localStorage.setItem(nameToMerge, content);
        setOpenAlert(false)
      }
    };
  
    React.useEffect(() => {
        const items = localStorage;
        const values = Object.entries(items);
        const res = values.map((d, i) => d[0]);
        setNotes(res);
    }, []);
  
    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation">
            <List>
                {notes.length > 0 ? notes.map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <input type="checkbox" value={text} onChange={(e) => setSelectedNotes(e.target.checked, text)} />
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                )) : "no notes here"}
            </List>
            <div>
                {selectedNotes.length > 0 ? <Button onClick={deleteNotes} className='lg:bg-red-500 p-2 rounded-lg hover:bg-sky-300'>Delete<DeleteIcon/></Button> : " "}
                {selectedNotes.length >= 2 ? <Button className='bg-sky-500 p-2 rounded-lg hover:bg-sky-300' onClick={handleClose}>Merge<MergeIcon/></Button> : " "}
                {selectedNotes.length === 1 ? <Button className='bg-sky-500 p-2 rounded-lg hover:bg-sky-300' onClick={editNotes}>EditNotes<EditIcon/></Button> : " "}
            </div>
        </Box>
    );
    
    const saveNotes = () => {
        if (notesName.length > 0) {
            const items = localStorage;
            const values = Object.entries(items);
            const res = values.map((d, i) => d[0]);
            if (res.indexOf(notesName) !== -1) {
                toast.error(`There is already a book name with! ${notesName}`, {
                    autoClose: 3000,
                });
            } else {
                localStorage.setItem(notesName, char);
                setNotesCreated(true);
                toast.success("Notes created");
                navigate(0);
            }
            setNotes(res);
            setNotesName("");
            setChar("");
        } else {
            toast.error("Enter notes name");
        }
    };
  
    return (
        <>
            {notesCreated ?
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
                :
                <div className="p-4">
                    <Button onClick={toggleDrawer(true)}><DensityMediumIcon/></Button>
                    <Drawer open={open} onClose={toggleDrawer(false)}>
                        {DrawerList}
                    </Drawer>
                    <ToastContainer />
                    <span>no of characters: {char.length}</span>
                    
                    
                    <button onClick={synthesizeSpeech} className='bg-blue-600 rounded-lg p-2'>ReadBook<VolumeUpIcon/></button>
      {audioUrl && <audio controls src={audioUrl} />}

                    <br/>
                    <div className="items-center">
                        <label>NotesName:</label>
                        <input type="text" className="rounded-md border-2 border-black w-50" value={notesName} onChange={(e) => setNotesName(e.target.value)} required />
                    </div>
                    <br/>
                    <textarea id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-screen" placeholder="Write your book..." value={char} onChange={(e) => setChar(e.target.value)}></textarea>
                    <button type="button" className={char.length ? "px-8 py-3 text-white bg-sky-500 rounded focus:outline-none cursor-pointer" : "px-8 py-3 text-white bg-gray-300 rounded focus:outline-none cursor-not-allowed"} disabled={!char.length} onClick={saveNotes}>saveNotes</button>

                    <Dialog
                        open={openAlert}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Give Name To Merge Notes?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                In Order To merge Notes Give Suitable Notes Name Which You Can Identify
                                <TextField id="notes-name-tomerge" label="notes-name-tomerge" variant="outlined" value={nameToMerge} onChange={(e) => setMergeNotesName(e.target.value)} placeholder="enter name..." helperText="Name required"/>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={mergeTwoNotes}>Merge</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            }
        </>
    );
}
