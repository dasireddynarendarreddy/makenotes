import { Button } from '@mui/material'
import {useEffect,useState} from 'react'
import DownloadIcon from '@mui/icons-material/Download';
import { jsPDF } from "jspdf";
export default function Books()
{
    const[data,setdata]=useState([])
    useEffect(()=>{
         const items=Object.entries(localStorage)
         const res=items.map(d=>d[0])
         setdata(res)
        

    },[])
    const downloadPdf=(notesname)=>{
        const pdf=new jsPDF();
        pdf.text(localStorage.getItem(notesname),10,10)
        pdf.save(notesname)


    }
    return(
        <div className='flex gap-2'>
                  {
                    data.map((d,i)=>(
                        <div key={d} className='shadow-md w-auto h-auto text-center shadow-indigo-500/40 p-2'>
                                        
                            <h1>NotesName:{d}</h1>
                            <Button onClick={()=>downloadPdf(d)}>Downlaod<DownloadIcon/></Button>
                        </div>
                    ))
                  }   
        </div>
    )
}