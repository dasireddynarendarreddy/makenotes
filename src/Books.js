import { Button } from '@mui/material'
import {useEffect,useState} from 'react'
import DownloadIcon from '@mui/icons-material/Download';
import { jsPDF } from "jspdf";
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
export default function Books()
{
    const[data,setdata]=useState([])
    useEffect(()=>{
         const items=Object.entries(localStorage)
         const res=items.map(d=>d[0])
         setdata(res)
        

    },[])
    const downloadPdf=(notesname)=>{
        /*const pdf=new jsPDF();
        pdf.text(localStorage.getItem(notesname),10,10)
        let text = localStorage.getItem(notesname);
let splitText = pdf.splitTextToSize(text, 180);
let yOffset = 10;

splitText.forEach(line => {
    if (yOffset > 280) {  // Assuming 280 is near the bottom of the page
        pdf.addPage();
        yOffset = 10;
    }
    pdf.text(line, 10, yOffset);
    yOffset += 10;  // Adjust spacing between lines
});*/

const pdf = new jsPDF();

// Retrieve the text from localStorage
let text = localStorage.getItem(notesname);

// Set the font size for the PDF
pdf.setFontSize(12);

// Define the maximum width for the text
const pageWidth = pdf.internal.pageSize.getWidth();
const margin = 10;
const maxWidth = pageWidth - 2 * margin;

// Split the text into lines that fit within the defined width
let splitText = pdf.splitTextToSize(text, maxWidth);

// Set the initial y-coordinate for the text placement
let yOffset = 20;

// Loop through the split text lines and add them to the PDF
splitText.forEach((line, index) => {
    // Check if the current yOffset is beyond the page height, then add a new page
    if (yOffset > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yOffset = margin; // Reset yOffset for the new page
    }
    pdf.text(line, margin, yOffset);
    yOffset += 10; // Adjust line height for the next line
});

// Save the PDF



        pdf.save(notesname)


    }
    return(
        <div>
               <Link to="/"><ArrowBackIcon/></Link>
               <div className='flex gap-2'>
                  {data.length===0?<h1>NO NOTES HERE</h1>:
                    data.map((d,i)=>(
                        <div key={d} className='shadow-md w-auto h-auto text-center shadow-indigo-500/40 p-2'>
                                        
                            <h1>NotesName:{d}</h1>
                            <Button onClick={()=>downloadPdf(d)}>Downlaod<DownloadIcon/></Button>
                        </div>
                    ))
                
                  }   
                  </div>
        </div>
    )
}