import './Write.css'
import {useState} from 'react'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import { ListItem } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemText from '@mui/material/ListItemText';
import MergeIcon from '@mui/icons-material/Merge';
import EditIcon from '@mui/icons-material/Edit';
import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded';
export default function Write()
{
    const[char,setchar]=useState('')
    const[notesname,setNotesName]=useState('')
    const [open, setOpen] = React.useState(false);
    const[notes,setnotes]=useState([])
    const[selectednotes,checkednotes]=useState([])
    console.log(selectednotes)
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const setselectednotes=(isChecked,val)=>{
    console.log(isChecked,val)
   
    if(isChecked!==false)
    {
       if(selectednotes.indexOf(val)===-1)
       {
         checkednotes((pre)=>[...pre,val])
       }
    }
    else{
      
      const index=selectednotes.indexOf(val);

      
      selectednotes.splice(index,1);
      

      
      
    }
    console.log(selectednotes)
    
   

  }
  React.useEffect(()=>{
    console.log(selectednotes)
    

  },[selectednotes])
  const getNoOfbooks=()=>{
    const items=localStorage;
    const values=Object.entries(items)
    const res=values.map((d,i)=>d[0])
    setnotes(res)
  }
  const deleteNotes=()=>{
       for(var i=0;i<selectednotes.length;i++)
       {
        localStorage.removeItem(selectednotes[i])
       }
     getNoOfbooks()
  }
  const EditNotes=()=>{
    const getData=localStorage.getItem(selectednotes)
    setchar(getData)
    setNotesName(selectednotes)
  
  }
  const MergeTwoNotes=()=>{
    
      const item1=localStorage.getItem(selectednotes[0])
      const item2=localStorage.getItem(selectednotes[1])
      const res=item1+item2
      localStorage.setItem(selectednotes[0],res)
      localStorage.removeItem(selectednotes[1])

    

  }

  React.useEffect(()=>{
    const items=localStorage;
    const values=Object.entries(items)
    const res=values.map((d,i)=>d[0])
    setnotes(res)
    
  },[])

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {notes.length>0?notes.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              
              <input type="checkbox" value={text} onChange={(e)=>setselectednotes(e.target.checked,text)}/>
              <ListItemText primary={text}/>
              
            </ListItemButton>
           
          </ListItem>
        )):"no notes here"}
      </List>
      <div>
      {selectednotes.length>0?<Button onClick={deleteNotes} className='lg:bg-red-500 p-2 rounded-lg hover:bg-sky-300'>Delete<DeleteIcon/></Button>:" "}
      {selectednotes.length>=2?<Button className='bg-sky-500 p-2 rounded-lg hover:bg-sky-300' onClick={MergeTwoNotes}>Merge<MergeIcon/></Button>:" "}
      {selectednotes.length==1?<Button className='bg-sky-500 p-2 rounded-lg hover:bg-sky-300' onClick={EditNotes}>EditNotes<EditIcon/></Button>:" "}
      </div>
     </Box>
     )
    
    const saveNotes=()=>{
        if(notesname.length>0)
        {

      
        
       
        const items=localStorage;
        const values=Object.entries(items)
        const res=values.map((d,i)=>d[0])
        if(res.indexOf(notesname)!==-1)
        {
          toast.error(`Their is already a book name with!${notesname}`, {
            //position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,  // auto-close after 3 seconds
          });
        }
        else{
          localStorage.setItem(notesname,char);
          toast("notes created")
        }
        setnotes(res)
        setNotesName("")
        
        setchar("")
        }
        else
        {
                toast("enter notes name")
        }
    }
    
    return(
        <div className="p-4">
            <Button onClick={toggleDrawer(true)}><ViewSidebarRoundedIcon/></Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
             <ToastContainer />
            <span>no of chars:{char.length}</span>
            <br/>
            <div className="items-center">
            <label>NotesName:</label>

            <input type="text" className="rounded-lg border-2 border-black" value={notesname} onChange={(e)=>setNotesName(e.target.value)} required/>
            </div>
        <textarea id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-screen" placeholder="Write your book..." value={char} onChange={(e)=>setchar(e.target.value)}></textarea>
        <button type="button" className={char.length?"px-8 py-3 text-white bg-sky-500 rounded focus:outline-none cursor-pointer":"px-8 py-3 text-white bg-gray-300 rounded focus:outline-none cursor-not-allowed"} disabled={char.length>0?"":"disabled "} onClick={saveNotes}>Button
</button>
        </div>
    )
}