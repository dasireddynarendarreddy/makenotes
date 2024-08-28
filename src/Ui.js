import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Write from "./Write"
import Books from "./Books"
import Nav from "./Nav"

export default function  Ui()
{
    return(
        <>
             <Router>
                <Nav/>
                <Routes>
                    <Route path="/" element={<Write/>}/>
                    <Route path="/books" element={<Books/>}/>
                </Routes>
             </Router>
        </>
    )
}